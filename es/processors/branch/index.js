function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import React from 'react';
import './index.less';
import Approver from '../approver';
import { LayoutType } from '../../interface';
import Node from '../../components/node';
import { domLayoutInfo } from '../../constants';
import { Context } from '../../context';
export default React.forwardRef(function (_ref, ref) {
  var node = _ref.node,
      rest = _objectWithoutProperties(_ref, ["node"]);

  var nodes = node.conditionNodes;
  var context = React.useContext(Context);
  var domRefs = context.domRefs;
  React.useEffect(function () {
    context.changeDomRefs(domRefs);
  }, []);
  return React.createElement("div", _extends({
    className: "branch-wrap"
  }, rest), React.createElement("div", {
    className: "branch-box-wrap"
  }, React.createElement("button", {
    className: "add-branch",
    style: context.layoutType === LayoutType.vertical ? {
      marginBottom: domLayoutInfo.marginVerticle * 2
    } : {
      marginRight: domLayoutInfo.marginHorizontal * 2
    },
    ref: ref,
    onClick: function onClick() {
      return context.onAddCondition(node);
    }
  }, "\u6DFB\u52A0\u6761\u4EF6"), React.createElement("div", {
    className: "col-box"
  }, nodes.map(function (item, index) {
    return React.createElement("div", {
      key: item.nodeId,
      className: "branch",
      style: context.layoutType === LayoutType.vertical ? {
        marginRight: index !== nodes.length - 1 ? domLayoutInfo.marginHorizontal : 0
      } : {
        marginBottom: index !== nodes.length - 1 ? domLayoutInfo.marginVerticle : 0
      }
    }, React.createElement(Approver, _extends({
      node: item
    }, item, {
      style: context.layoutType === LayoutType.vertical ? {
        marginBottom: domLayoutInfo.marginHorizontal
      } : {
        marginRight: domLayoutInfo.marginHorizontal
      },
      ref: function ref(_ref2) {
        return _ref2 && (domRefs[item.nodeId] = _ref2);
      }
    })), React.createElement(Node, {
      value: item
    }));
  }))));
});