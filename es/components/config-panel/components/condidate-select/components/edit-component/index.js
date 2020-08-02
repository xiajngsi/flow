import "antd/es/form/style/css";
import _Form from "antd/es/form";
import "antd/es/input/style/css";
import _Input from "antd/es/input";

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
import CandidateTreeSelect from '../tree-select';
import CandidateSelect from '../select';

var EditComponent =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditComponent, _React$Component);

  function EditComponent() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, EditComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(EditComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.renderSelectTree = function () {
      var otherProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return React.createElement(CandidateTreeSelect, _extends({
        key: _this.props.candidateType
      }, _this.props, otherProps, {
        initialValue: otherProps.initialValue || _this.resolveValueType(_this.props.value)
      }));
    };

    _this.renderSearchSelect = function () {
      var otherProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return React.createElement(CandidateSelect, _extends({
        key: _this.props.candidateType
      }, _this.props, otherProps, {
        value: otherProps.initialValue || _this.resolveValueType(_this.props.value)
      }));
    };

    _this.renderFunctionComponent = function () {
      var paramList = _this.props.functionStructure.paramList;
      return paramList.map(function (p, index) {
        return React.createElement("div", {
          key: p.paramName,
          style: {
            marginBottom: 8
          }
        }, React.createElement("h4", null, p.paramName), p.type === 1 ? _this.renderSelectItem(p, index) : React.createElement(_Form.Item, {
          key: p.paramName,
          wrapperCol: {
            span: 24
          }
        }, _this.props.form.getFieldDecorator("candidateParam[".concat(p.paramName, "]"), {
          initialValue: _this.props.value ? _this.props.value.paramList[index].candidateParam : ''
        })( // eslint-disable-line
        React.createElement(_Input, {
          placeholder: "\u8BF7\u8F93\u5165".concat(p.paramName)
        }))));
      });
    };

    _this.renderSelectItem = function (param, index) {
      return param.dataType === '1' ? _this.renderSearchSelect({
        key: param.paramName,
        valueSequence: param.valueSequence,
        type: param.type,
        initialValue: _this.props.value ? _this.props.value.paramList[index].candidateValues : undefined,
        itemId: param.paramName
      }) : _this.renderSelectTree({
        key: param.paramName,
        valueSequence: param.valueSequence,
        type: param.type,
        initialValue: _this.resolveValueType(_this.props.value ? _this.props.value.paramList[index].candidateValues : undefined),
        itemId: param.paramName
      });
    };

    _this.resolveValueType = function (value) {
      var initialValue = [];

      if (Object.prototype.toString.call(value) === '[object Object]') {
        Object.keys(value).forEach(function (key) {
          initialValue.push({
            label: value[key],
            value: key,
            key: key
          });
        });
      }

      return initialValue;
    };

    _this.switchComponent = function () {
      switch (_this.props.type) {
        case 'VALUE':
          return _this.props.valueType === '1' ? _this.renderSearchSelect() : _this.renderSelectTree();

        case 'PARAM':
          return React.createElement(_Form.Item, {
            wrapperCol: {
              span: 24
            }
          }, _this.props.form.getFieldDecorator('candidateParam', {
            initialValue: _this.props.value
          })(React.createElement(_Input, {
            placeholder: "\u8BF7\u8F93\u5165\u53D8\u91CF"
          })));

        case 'DUBBO':
          return React.createElement(_Form.Item, {
            wrapperCol: {
              span: 24
            }
          }, _this.props.form.getFieldDecorator('candidateDubbo', {
            initialValue: _this.props.value
          })(React.createElement(_Input, {
            placeholder: "\u8BF7\u8F93\u5165Dubbo\u670D\u52A1\u8868\u8FBE\u5F0F"
          })));

        case 'FUNCTION':
          return _this.renderFunctionComponent();

        default:
          return null;
      }
    };

    return _this;
  }

  _createClass(EditComponent, [{
    key: "render",
    value: function render() {
      return this.switchComponent();
    }
  }]);

  return EditComponent;
}(React.Component);

export default EditComponent;