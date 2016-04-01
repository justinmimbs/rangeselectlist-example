import React, { PropTypes } from 'react';

const propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  startHandleDisplay: PropTypes.oneOf(['off', 'on', 'auto']).isRequired,
  endHandleDisplay: PropTypes.oneOf(['off', 'on', 'auto']).isRequired,
  onDown: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
};

class RangeSelectListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseDownItem = this.handleMouseDownItem.bind(this);
    this.handleMouseOverItem = this.handleMouseOverItem.bind(this);
  }

  handleMouseDownItem(event) {
    this.props.onDown(this.props.item.key, this.props.isSelected, event.target.tagName === 'DIV');
  }

  handleMouseOverItem(event) {
    // ignore movements between li and label
    const li = event.currentTarget;
    const label = li.firstChild;
    const entering = event.target;
    const exiting = event.relatedTarget;
    if (exiting === li && entering === label || exiting === label && entering === li) {
      return;
    }

    this.props.onEnter(this.props.item.key, this.props.isSelected, event.target.tagName === 'DIV');
  }

  render() {
    const props = this.props;

    return (
      <li
        className={props.isSelected ? 'selected' : ''}
        onMouseDown={this.handleMouseDownItem}
        onMouseOver={this.handleMouseOverItem}
      >
        <label>{props.item.label}</label>
        {props.startHandleDisplay !== 'off'
          ? <div className={`handle start ${props.startHandleDisplay}`}></div>
          : null}
        {props.endHandleDisplay !== 'off'
          ? <div className={`handle end ${props.endHandleDisplay}`}></div>
          : null}
      </li>
    );
  }
}

RangeSelectListItem.propTypes = propTypes;

export default RangeSelectListItem;
