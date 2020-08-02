import "antd/es/form/style/css";
import _Form from "antd/es/form";
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
import queryString from 'query-string';
import { Context } from '../../../../../../context';

var CandidateSelect =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CandidateSelect, _React$Component);

  function CandidateSelect() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CandidateSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CandidateSelect)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      searchData: []
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

    _this.getData = function () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        hasChildren: true
      };
      var keyWord = arguments.length > 1 ? arguments[1] : undefined;
      // console.log(data);
      var sequence = _this.props.valueSequence || [];
      var originType = data.type || sequence[0];
      var currentIndex = sequence.findIndex(function (value) {
        return value === originType;
      });

      if (data.hasChildren === false && sequence.length > currentIndex + 1) {
        var type = sequence[currentIndex + 1];
        var query = queryString.stringify({
          type: type,
          parentId: data.value,
          keyWord: keyWord
        });
        return _this.context.getCandidates(query);
      }

      if (data.hasChildren) {
        var _query = queryString.stringify({
          type: sequence[0],
          parentId: data.value,
          keyWord: keyWord
        });

        return _this.context.getCandidates(_query);
      }

      return new Promise(function (resolve) {
        return resolve();
      });
    };

    _this.searchData = function (value) {
      _this.getData(undefined, value).then(function (result) {
        _this.setState({
          searchData: result || []
        });
      });
    };

    return _this;
  }

  _createClass(CandidateSelect, [{
    key: "render",
    // 渲染模糊搜索组件
    value: function render() {
      var itemId = this.props.itemId;
      console.log('xxx this.context ', this.context);
      return React.createElement(_Form.Item, {
        wrapperCol: {
          span: 24
        }
      }, this.props.form.getFieldDecorator(itemId ? "candidateValues[".concat(itemId, "]") : 'candidateValues', {
        initialValue: this.props.value
      })(React.createElement(_Select, {
        mode: "multiple",
        labelInValue: true,
        placeholder: "\u8BF7\u8F93\u5165\u5019\u9009\u9879",
        notFoundContent: "\u8BF7\u8F93\u5165\u5019\u9009\u9879",
        filterOption: false,
        onSearch: this.searchData,
        style: {
          width: '100%'
        }
      }, this.state.searchData.map(function (s) {
        return React.createElement(_Select.Option, {
          key: s.value,
          value: s.value
        }, s.title);
      }))) // eslint-disable-line
      );
    }
  }]);

  return CandidateSelect;
}(React.Component);

CandidateSelect.contextType = Context;
export { CandidateSelect as default };