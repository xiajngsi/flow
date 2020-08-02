import "antd/es/form/style/css";
import _Form from "antd/es/form";
import "antd/es/tree-select/style/css";
import _TreeSelect from "antd/es/tree-select";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

var CandidateTreeSelect =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CandidateTreeSelect, _React$Component);

  function CandidateTreeSelect() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CandidateTreeSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CandidateTreeSelect)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      treeData: []
    };

    _this.getData = function () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        hasChildren: true
      };
      var keyWord = arguments.length > 1 ? arguments[1] : undefined;
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

    _this.loadTreeData = function (treeNode) {
      return new Promise(function (resolve) {
        if (treeNode.props.children) {
          resolve();
          return;
        }

        var _treeNode$props$dataR = treeNode.props.dataRef,
            value = _treeNode$props$dataR.value,
            _treeNode$props$dataR2 = _treeNode$props$dataR.hasChildren,
            hasChildren = _treeNode$props$dataR2 === void 0 ? true : _treeNode$props$dataR2,
            type = _treeNode$props$dataR.type;

        _this.getData({
          value: value,
          hasChildren: hasChildren,
          type: type
        }).then(function (result) {
          treeNode.props.dataRef.children = result || [];

          _this.setState({
            treeData: _toConsumableArray(_this.state.treeData)
          });

          resolve();
        });
      });
    };

    _this.checkTree = function (value, o) {
      console.log('check: ', value, o);
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

    _this.renderTreeNodes = function (data) {
      return data.map(function (node) {
        if (node.children) {
          return React.createElement(_TreeSelect.TreeNode, {
            title: node.title,
            key: node.value + _this.props.candidateType,
            value: node.value,
            dataRef: node
          }, _this.renderTreeNodes(node.children));
        }

        return React.createElement(_TreeSelect.TreeNode, {
          title: node.title,
          key: node.value + _this.props.candidateType,
          value: node.value,
          dataRef: node
        });
      });
    };

    return _this;
  }

  _createClass(CandidateTreeSelect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.getData().then(function (result) {
        _this2.setState({
          treeData: result || []
        });
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(nextProps) {
      var _this3 = this;

      if (nextProps.candidateType !== this.props.candidateType) {
        this.getData().then(function (result) {
          _this3.setState({
            treeData: result || []
          });
        });
      }
    } // 获取组织架构数据

  }, {
    key: "render",
    // 渲染树
    value: function render() {
      // const initialValue = this.resolveValueType(this.props.value);
      var itemId = this.props.itemId;
      return React.createElement(_Form.Item, {
        wrapperCol: {
          span: 24
        }
      }, this.props.form.getFieldDecorator(itemId ? "candidateValues[".concat(itemId, "]") : 'candidateValues', {
        initialValue: this.props.initialValue
      })( // eslint-disable-line
      React.createElement(_TreeSelect, {
        labelInValue: true,
        treeCheckable: true,
        treeCheckStrictly: true,
        treeNodeFilterProp: "key",
        loadData: this.loadTreeData,
        dropdownStyle: {
          height: 400
        },
        placeholder: "\u8BF7\u9009\u62E9\u6267\u884C\u4EBA"
      }, this.renderTreeNodes(this.state.treeData))));
    }
  }]);

  return CandidateTreeSelect;
}(React.Component);

CandidateTreeSelect.contextType = Context;
export { CandidateTreeSelect as default };