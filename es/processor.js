function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import { IType, LayoutType } from './interface';
import { defaultHeight, arrowYDistance, sDistance, pointType, addBtnRadius, domLayoutInfo } from './constants';
import './index.less';
import { End } from './processors';
import { Context } from './context';
import classnames from 'classnames';
import { genUniqueSvgId, relativePositionWithSvg, getSvgAttr, getFillSvgAttr, getClientPosition, getControlPoint, getBesselLinePoint } from './utils';
import snap from 'snapsvg-cjs';
import Node from './components/node';
import SelectType from './components/select-type';
import ConfigPanel from './components/config-panel';
import Toolbar from './components/toolbar';
import { throttle } from 'lodash'; // TODO: 数据变动或者界面 resize 重新计算 dom 和 svg 的宽高

var svgAttr = getSvgAttr(); // TODO: 改变布局后要重新计算各种元素的位置，改成统一在一个地方计算

var Flow =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Flow, _React$PureComponent);

  function Flow() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Flow);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Flow)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.svgId = genUniqueSvgId();
    _this.svg = null;
    _this.lines = [];
    _this.svgDomRef = null;
    _this.endDomRef = null;
    _this.selectTypeRef = React.createRef();
    _this.nodeWrap = React.createRef();
    _this.state = {
      nodeWrapInfo: {}
    };
    _this.calculateSvgRect = throttle(function () {
      var containerPosition = getClientPosition(_this.nodeWrap);
      var endPosition = getClientPosition(_this.endDomRef);

      _this.setState({
        nodeWrapInfo: {
          width: containerPosition.width,
          height: endPosition.y - containerPosition.y
        }
      });
    }, 200);

    _this.calculateLine = function () {
      if (!_this.svg) {
        _this.svg = snap("#".concat(_this.svgId));
      }

      var layoutType = _this.context.layoutType;

      _this.svg.paper.clear();

      _this.context.lineInfo.forEach(function (_ref) {
        var from = _ref.from,
            to = _ref.to;

        var fromPosition = _this.calculeteDomPosition(from, pointType.from);

        var toPosition = _this.calculeteDomPosition(to, pointType.to);

        var controlPoint = getControlPoint(fromPosition, toPosition, layoutType);

        _this.svg.paper.path("M ".concat(fromPosition.x, " ").concat(fromPosition.y, "C").concat(controlPoint[1].x, " ").concat(controlPoint[1].y, " ").concat(controlPoint[2].x, " ").concat(controlPoint[2].y, " ").concat(toPosition.x, " ").concat(toPosition.y)).attr(svgAttr);

        _this.renderArrow(toPosition);

        if (to.type !== IType.condition) {
          _this.drawPlusBtn({
            from: from,
            to: to
          }, controlPoint);
        }
      });
    };

    _this.calculeteDomPosition = function (node, type) {
      var domRefs = _this.context.domRefs;
      var dom = null;

      if (node === 'end') {
        dom = _this.endDomRef;
      } else {
        dom = domRefs[node.nodeId];
      }

      return relativePositionWithSvg(dom, _this.svgDomRef, type, _this.context.layoutType);
    };

    _this.handleAddItem = function (value) {
      var onAddItem = _this.context.onAddItem;

      if (onAddItem) {
        onAddItem(value);
      }
    };

    return _this;
  }

  _createClass(Flow, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.svg = snap("#".concat(this.svgId));
      this.calculateLine();
      this.calculateSvgRect();
      document.addEventListener('resize', this.calculateSvgRect);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('resize', this.calculateSvgRect);
    }
  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate(prevProps, prevState) {
      // context.value 改变后，dom 的高度会变化，这时候重新设置 svg 的宽高
      var _prevState$nodeWrapIn = prevState.nodeWrapInfo,
          width = _prevState$nodeWrapIn.width,
          height = _prevState$nodeWrapIn.height;
      var containerPosition = getClientPosition(this.nodeWrap);
      var endPosition = getClientPosition(this.endDomRef);
      var currHeight = endPosition.y - containerPosition.y;

      if (currHeight !== height || containerPosition.width !== width) {
        return {
          width: containerPosition.width,
          height: currHeight
        };
      }

      return null;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      this.calculateLine();

      if (snapshot) {
        this.setState({
          nodeWrapInfo: snapshot
        });
      }

      return null;
    }
  }, {
    key: "drawPlusBtn",
    value: function drawPlusBtn(_ref2, controlPoint) {
      var _this2 = this;

      var from = _ref2.from,
          to = _ref2.to;
      var primary = this.props.primary;
      var text;

      var _getBesselLinePoint = getBesselLinePoint(controlPoint, 0.5),
          _getBesselLinePoint2 = _slicedToArray(_getBesselLinePoint, 2),
          x = _getBesselLinePoint2[0],
          y = _getBesselLinePoint2[1];

      var btn = this.svg.paper.circle(x, y, addBtnRadius);
      btn.attr({
        stroke: primary,
        fill: primary,
        strokeWidth: 1,
        cursor: 'pointer'
      });
      text = this.svg.paper.text(x - addBtnRadius / 2, y + addBtnRadius / 2 - 1, '+');
      text.attr({
        fill: 'white',
        strokeWidth: 1,
        cursor: 'pointer',
        'font-size': '24px'
      });
      text.click(function () {
        _this2.selectTypeRef.current.hide();

        _this2.selectTypeRef.current.show({
          top: y + addBtnRadius,
          left: x,
          from: from,
          to: to
        });
      });
    }
  }, {
    key: "renderArrow",
    value: function renderArrow(point) {
      // 夹角默认为 25度
      var layoutType = this.context.layoutType;
      var xPosition = point.x - sDistance;
      var yPositions = [point.y - arrowYDistance, point.y + arrowYDistance];
      var path = "M".concat(point.x, ",").concat(point.y, " L ").concat(xPosition, ",").concat(yPositions[0], " L ").concat(xPosition, ", ").concat(yPositions[1], " L ").concat(point.x, ",").concat(point.y, "Z");

      if (layoutType === LayoutType.vertical) {
        yPositions = point.y - sDistance;
        xPosition = [point.x - arrowYDistance, point.x + arrowYDistance];
        path = "M".concat(point.x, ",").concat(point.y, " L ").concat(xPosition[0], " ").concat(yPositions, " L ").concat(xPosition[1], " ").concat(yPositions, " L ").concat(point.x, ",").concat(point.y, "Z");
      }

      var arrow = this.svg.paper.path(path);
      arrow.attr(getFillSvgAttr());
      return arrow;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props$height = this.props.height,
          height = _this$props$height === void 0 ? defaultHeight : _this$props$height;
      var _this$context = this.context,
          value = _this$context.value,
          layoutType = _this$context.layoutType;
      var className = classnames('container', {
        verticle: layoutType
      });
      return React.createElement("div", null, React.createElement(Toolbar, null), React.createElement("div", {
        className: className,
        style: {
          minHeight: height
        }
      }, React.createElement("svg", _extends({
        className: "svg",
        id: this.svgId,
        ref: function ref(_ref3) {
          return _this3.svgDomRef = _ref3;
        }
      }, this.state.nodeWrapInfo)), React.createElement("div", {
        className: "node-wrap",
        ref: this.nodeWrap
      }, React.createElement(Node, {
        value: value
      }), React.createElement(End, {
        ref: function ref(_ref4) {
          return _this3.endDomRef = _ref4;
        },
        style: {
          marginTop: domLayoutInfo.marginVerticle
        }
      })), React.createElement(SelectType, {
        ref: this.selectTypeRef,
        onAddItem: this.handleAddItem
      }), React.createElement(ConfigPanel, null)));
    }
  }]);

  return Flow;
}(React.PureComponent);

Flow.contextType = Context;
export default Flow;