require('./RangeSelectList.css');

import React, { PropTypes } from 'react';
import RangeSelectListItem from './RangeSelectListItem';

// utilities

function clamp(min, max, n) {
  return Math.max(min, Math.min(max, n));
}

function isBetween([start, end], n) {
  return n >= start && n <= end;
}

function equalArrays(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

// dragType = NEW|MOVE|RESIZE
const NEW = 'NEW';
const MOVE = 'MOVE';
const RESIZE = 'RESIZE';

function anchorKey({ dragType, dragKey, dragRange }) {
  if (dragType === RESIZE) {
    return dragRange[0] === dragKey ? dragRange[1] : dragRange[0];
  }

  return dragKey;
}

// handleDisplay = 'off|on|auto'
function handleDisplay(state, key) {
  if (!state.dragType) {
    return 'auto';
  }

  const displayFromDragType = {
    [NEW]: 'off',
    [MOVE]: 'off',
    [RESIZE]: key === anchorKey(state) ? 'auto' : 'on',
  };
  return displayFromDragType[state.dragType];
}

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  onSelectRange: PropTypes.func,
  selectedRange: PropTypes.arrayOf(PropTypes.string),
  maxExtent: PropTypes.number,
  className: PropTypes.string,
};

class RangeSelectList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { dragType: null, dragKey: null, dragRange: null, isOverSelected: false };

    this.indexFromKey = this.indexFromKey.bind(this);
    this.handleDown = this.handleDown.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleUp = this.handleUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  indexFromKey(key) {
    return this.props.items.findIndex(item => item.key === key);
  }

  handleDown(key, isSelected, isHandle) {
    // set state
    let dragType = null;
    if (isHandle) {
      dragType = RESIZE;
    } else if (isSelected) {
      dragType = MOVE;
    } else {
      dragType = NEW;
    }

    this.setState({ dragType, dragKey: key, dragRange: this.props.selectedRange });

    // select range
    if (dragType === NEW) {
      this.props.onSelectRange([key, key]);
    }

    // add listener
    document.addEventListener('mouseup', this.handleUp);
  }

  handleEnter(key, isSelected, isHandle) {
    // set state.isOverSelected
    const isOverSelected = isSelected && !isHandle;
    if (this.state.isOverSelected !== isOverSelected) {
      this.setState({ isOverSelected });
    }

    if (!this.state.dragType) {
      return;
    }

    // get new selectedRange
    let _rangeIndexes;

    if (this.state.dragType === MOVE) {
      // move (constrain the move within the bounds of props.items)
      const rangeIndexes = this.state.dragRange.map(this.indexFromKey);
      const _delta = this.indexFromKey(key) - this.indexFromKey(this.state.dragKey);
      const minDelta = 0 - rangeIndexes[0];
      const maxDelta = (this.props.items.length - 1) - rangeIndexes[1];
      const delta = clamp(minDelta, maxDelta, _delta);
      _rangeIndexes = rangeIndexes.map(i => i + delta);
    } else {
      // resize (constrain the size to not exceed props.maxExtent)
      const anchor = this.indexFromKey(anchorKey(this.state));
      const _target = this.indexFromKey(key);
      const maxDelta = (this.props.maxExtent || Infinity) - 1;
      const target = anchor + clamp(-maxDelta, maxDelta, _target - anchor);
      _rangeIndexes = anchor <= target ? [anchor, target] : [target, anchor];
    }

    const _selectedRange = _rangeIndexes.map(i => this.props.items[i].key);

    // select range
    if (!this.props.selectedRange || !equalArrays(this.props.selectedRange, _selectedRange)) {
      this.props.onSelectRange(_selectedRange);
    }
  }

  handleUp() {
    this.setState({ dragType: null, dragKey: null, dragRange: null });
    document.removeEventListener('mouseup', this.handleUp);
  }

  handleMouseLeave() {
    if (this.state.isOverSelected) {
      this.setState({ isOverSelected: false });
    }
  }

  render() {
    const className = [
      'range-select-list',
      this.props.className,
      // 'highlight-selected' if: mousedown will begin MOVE || MOVE is happening now
      this.state.isOverSelected && !this.state.dragType || this.state.dragType === MOVE
        ? 'highlight-selected'
        : null,
    ]
      .filter(x => x).join(' ');

    const rangeIndexes = this.props.selectedRange
      ? this.props.selectedRange.map(this.indexFromKey)
      : [-1, -1];

    return (
      <ol className={className} onMouseLeave={this.handleMouseLeave}>
        {this.props.items.map((item, i) => (
          <RangeSelectListItem
            key={item.key}
            item={item}
            isSelected={isBetween(rangeIndexes, i)}
            startHandleDisplay={i === rangeIndexes[0]
              ? handleDisplay(this.state, item.key)
              : 'off'}
            endHandleDisplay={i === rangeIndexes[1]
              ? handleDisplay(this.state, item.key)
              : 'off'}
            onDown={this.handleDown}
            onEnter={this.handleEnter}
          />
        ))}
      </ol>
    );
  }
}

RangeSelectList.propTypes = propTypes;

export default RangeSelectList;
