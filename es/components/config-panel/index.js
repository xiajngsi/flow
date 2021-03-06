import "antd/es/form/style/css";
import _Form from "antd/es/form";
import "antd/es/drawer/style/css";
import _Drawer from "antd/es/drawer";
import "antd/es/select/style/css";
import _Select from "antd/es/select";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import { Context } from '../../context';
var Option = _Select.Option;
import ConditionForm from './components/condition-form';
import { IType } from '../../interface';
import CondidateForm from './components/condidate-form';

var DrawerForm =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DrawerForm, _React$Component);

  function DrawerForm() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DrawerForm);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DrawerForm)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onClose = function () {
      _this.context.changeConfigPanel({
        configPanel: {
          visible: false,
          item: null
        }
      });
    };

    return _this;
  }

  _createClass(DrawerForm, [{
    key: "render",
    value: function render() {
      var getFieldDecorator = this.props.form.getFieldDecorator;
      var _this$context = this.context,
          config = _this$context.config,
          configPanel = _this$context.configPanel;

      if (!config || !configPanel.item) {
        return null;
      }

      return React.createElement("div", {
        className: "config-panel"
      }, React.createElement(_Drawer, {
        title: "\u914D\u7F6E",
        width: 720,
        onClose: this.onClose,
        visible: this.context.configPanel.visible,
        placement: "right"
      }, configPanel.item.type === IType.condition ? React.createElement(ConditionForm, null) : React.createElement(CondidateForm, null)));
    }
  }]);

  return DrawerForm;
}(React.Component);

DrawerForm.contextType = Context;
export default _Form.create()(DrawerForm);