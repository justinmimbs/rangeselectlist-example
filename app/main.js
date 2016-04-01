require('./main.css');

import React from 'react';
import ReactDOM from 'react-dom';
import RangeSelectList from './components/RangeSelectList';

const _dates = [
  { key: '01', label: 'Jan' },
  { key: '02', label: 'Feb' },
  { key: '03', label: 'Mar' },
  { key: '04', label: 'Apr' },
  { key: '05', label: 'May' },
  { key: '06', label: 'Jun' },
  { key: '07', label: 'Jul' },
  { key: '08', label: 'Aug' },
  { key: '09', label: 'Sep' },
  { key: '10', label: 'Oct' },
  { key: '11', label: 'Nov' },
  { key: '12', label: 'Dec' },
];

class TimeframeSelectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: _dates,
      selectedRange: null,
    };
    this.handleSelectRange = this.handleSelectRange.bind(this);
  }

  handleSelectRange(range) {
    // console.log(range.join(', '));
    this.setState({ selectedRange: range });
  }

  render() {
    return (
      <RangeSelectList
        className="timeframe"
        items={this.state.dates}
        selectedRange={this.state.selectedRange}
        onSelectRange={this.handleSelectRange}
        maxExtent={6}
      />
    );
  }
}

function init() {
  ReactDOM.render(<TimeframeSelectList />, document.querySelector('#output'));
}

window.addEventListener('DOMContentLoaded', init);
