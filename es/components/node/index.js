function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import { IType, LayoutType } from '../../interface';
import { domLayoutInfo, marginVerticle, marginHorizontal } from '../../constants';
import { Start, Branch, Approver } from '../../processors';
import { Context } from '../../context';

var Node =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Node, _React$PureComponent);

  function Node() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Node);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Node)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.domRefs = _this.context.domRefs;
    return _this;
  }

  _createClass(Node, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.changeDomRefs(this.domRefs);
    }
  }, {
    key: "componentdidUpdate",
    value: function componentdidUpdate() {
      this.context.changeDomRefs(this.domRefs);
    }
  }, {
    key: "render",
    value: function render() {
      var value = this.props.value;
      var doms = [];
      var domRef = this.domRefs;
      var layoutType = this.context.layoutType;

      var traverseProcessor = function traverseProcessor(node) {
        var commonProps = {
          key: node.nodeId,
          ref: function ref(_ref) {
            return _ref && (domRef[node.nodeId] = _ref);
          },
          node: node
        };

        switch (node.type) {
          case IType.start:
            doms.push(React.createElement(Start, _extends({
              style: layoutType === LayoutType.vertical ? {
                marginBottom: domLayoutInfo.marginVerticle
              } : {
                marginRight: domLayoutInfo.marginHorizontal
              }
            }, commonProps)));
            break;

          case IType.approver:
          case IType.notifier:
            doms.push(React.createElement(Approver, _extends({
              style: layoutType === LayoutType.vertical ? marginVerticle : marginHorizontal
            }, commonProps)));
            break;

          case IType.route:
            doms.push(React.createElement(Branch, _extends({
              style: layoutType === LayoutType.vertical ? marginVerticle : marginHorizontal
            }, commonProps)));
            break;
        }

        if (node.childNode) {
          traverseProcessor(node.childNode);
        }
      };

      traverseProcessor(value);
      return doms;
    }
  }]);

  return Node;
}(React.PureComponent);

Node.contextType = Context;
export default Node;