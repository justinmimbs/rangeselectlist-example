# rangeselectlist-example

Example usage of a `RangeSelectList` component for React.

This component displays a list of items to select a range from. A new selection can be made by dragging from an unselected item; an existing selection can be moved by dragging it, and it can be resized by dragging the handles at its edges.

```js
const dates = [
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
```

```jsx
<RangeSelectList items={dates} selectedRange={['01', '03']} onSelectRange={handleSelectRange} />
```

http://justinmimbs.com/examples/rangeselectlist/
