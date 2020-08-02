import React from 'react';
import './index.less';
import classnames from 'classnames';
import Icon from '../../components/icon';
import { Context } from '../../context';
var Approval = React.forwardRef(function (_ref, ref) {
  var node = _ref.node,
      style = _ref.style,
      className = _ref.className;
  var name = node.name;
  var classNames = classnames(className, 'approver-node');
  var context = React.useContext(Context);

  var handleClick = function handleClick(e) {
    e.stopPropagation();
    context.onDeleteItem(node);
  };

  var handleItemClick = function handleItemClick() {
    var changeConfigPanel = context.changeConfigPanel,
        configPanel = context.configPanel;

    if (configPanel.visible) {
      changeConfigPanel({
        configPanel: {
          visible: !configPanel.visible,
          item: null
        }
      });
    } else {
      changeConfigPanel({
        configPanel: {
          visible: !configPanel.visible,
          item: node
        }
      });
    }
  };

  return React.createElement("div", {
    className: classNames,
    style: style,
    ref: ref,
    onClick: handleItemClick
  }, name, React.createElement("span", {
    onClick: handleClick
  }, React.createElement(Icon, {
    type: "flowshanchu"
  })));
});
export default Approval;