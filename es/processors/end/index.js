import React from 'react';
import './index.less';
import classnames from 'classnames';
var Start = React.forwardRef(function (props, ref) {
  var className = props.className,
      style = props.style;
  var classNames = classnames(className, 'end');
  return React.createElement("div", {
    className: classNames,
    style: style,
    ref: ref
  });
});
export default Start;