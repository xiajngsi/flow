import "antd/es/row/style/css";
import _Row from "antd/es/row";
import "antd/es/col/style/css";
import _Col from "antd/es/col";
import "antd/es/card/style/css";
import _Card from "antd/es/card";
import "antd/es/radio/style/css";
import _Radio from "antd/es/radio";
import "antd/es/message/style/css";
import _message from "antd/es/message";

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
// import request from 'utils/request';
import EditComponent from './components/edit-component';
import { Context } from '../../../../context'; // const mock = [{ flowCandidateType: { id: '1', value: '用户' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '2', value: '员工' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '3', value: '部门' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '4', value: '岗位' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '5', value: '角色' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '6', value: '部门-岗位' }, candidateValueDefinitions: ['FUNCTION'], candidateFunction: { type: 1, callPath: 'io.terminus.flow.app.service.FlowTaskLogReadService.callMethod', paramList: [{ paramClass: 'java.lang.String', type: 2, paramName: '门店部门', candidateValues: null, candidateParam: null }, { paramClass: 'java.lang.String', type: 1, paramName: '岗位', candidateValues: null, candidateParam: null }] } }, { flowCandidateType: { id: '7', value: '岗位-角色' }, candidateValueDefinitions: ['FUNCTION'], candidateFunction: { type: 1, callPath: 'io.terminus.flow.app.service.FlowTaskLogReadService.callMethod', paramList: [{ paramClass: 'java.lang.String', type: 2, paramName: '岗位', candidateValues: null, candidateParam: null }, { paramClass: 'java.lang.String', type: 1, paramName: '角色', candidateValues: null, candidateParam: null }] } }];

var Auth =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Auth, _React$Component);

  function Auth() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Auth);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Auth)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      candidateType: false,
      // 执行人类别
      candidateValueType: '',
      // 执行人规则值类别
      candidateValueSelectType: '',
      // 执行人选值交互类型， 1: 模糊搜索， 2: 树形结构
      candidateValue: '',
      // 执行人规则值
      valueSequence: [] // 执行人规则数据顺序

    };

    _this.initValue = function (structure) {
      var defaultValue = _this.props.defaultValue;

      if (defaultValue && defaultValue[0]) {
        var value = defaultValue[0];
        var candidateType = value.candidateType.toString();

        var _this$switchValueType = _this.switchValueType(value),
            candidateValueType = _this$switchValueType.candidateValueType,
            candidateValue = _this$switchValueType.candidateValue;

        var curStructure = structure.find(function (s) {
          return s.flowCandidateType.id === candidateType;
        });
        var candidateValueSelectType = curStructure.dataType;

        var _curStructure$candida = curStructure.candidateValueDefinitions.find(function (d) {
          return d.candidateValueEnum === candidateValueType;
        }),
            valueSequence = _curStructure$candida.valueSequence;

        _this.setState({
          candidateType: candidateType,
          candidateValueType: candidateValueType,
          candidateValueSelectType: candidateValueSelectType,
          candidateValue: candidateValue,
          valueSequence: valueSequence
        });
      }
    };

    _this.switchValueType = function (value) {
      if (value.candidateParam) {
        return {
          candidateValueType: 'PARAM',
          candidateValue: value.candidateParam
        };
      }

      if (value.candidateValues) {
        return {
          candidateValueType: 'VALUE',
          candidateValue: value.candidateValues
        };
      }

      if (value.candidateFunction) {
        return {
          candidateValueType: 'FUNCTION',
          candidateValue: value.candidateFunction
        };
      }

      if (value.candidateDubbo) {
        return {
          candidateValueType: 'DUBBO',
          candidateValue: value.candidateDubbo
        };
      }

      return {};
    };

    _this.changeCandidateType = function (_ref) {
      var value = _ref.target.value;
      var form = _this.props.form;

      var structure = _this.context.candidateStructure.find(function (cs) {
        return cs.flowCandidateType.id === value;
      });

      if (form && structure.candidateValueDefinitions[0].candidateValueEnum === 'VALUE') {
        // 选值有两种情况，树形结构和模糊搜索，值的结构不同，需要清空值
        form.setFieldsValue({
          candidateValues: []
        });
      }

      _this.setState({
        candidateType: value,
        candidateValueType: structure.candidateValueDefinitions[0].candidateValueEnum,
        valueSequence: structure.candidateValueDefinitions[0].valueSequence,
        candidateValueSelectType: structure.dataType,
        candidateValue: ''
      });
    };

    _this.candidateValueTypeMap = {
      VALUE: '选值',
      PARAM: '变量',
      DUBBO: 'Dubbo服务',
      FUNCTION: 'Function'
    };

    _this.changeValueType = function (_ref2) {
      var _ref2$target = _ref2.target,
          option = _ref2$target.option,
          value = _ref2$target.value;

      _this.setState({
        valueSequence: option.valueSequence,
        candidateValueType: value,
        candidateValue: ''
      });
    };

    _this.save = function () {
      _this.props.form.validateFields(function (err, values) {
        if (!err) {
          var query = _this.makeupQuery(values);

          _this.props.updateFlowNodeList(_this.props.curNode.id, 'taskCandidates', query);

          _message.success('执行人信息保存成功');
        }
      });
    };

    _this.makeupQuery = function (values) {
      var candidateValueType = _this.state.candidateValueType;
      var query = {
        candidateType: _this.state.candidateType
      }; // 参数和Dubbo表达式简单赋值

      if (candidateValueType === 'PARAM' || candidateValueType === 'DUBBO') {
        Object.assign(query, values);
      } // 选值形式需要将值转为对象


      if (candidateValueType === 'VALUE') {
        var candidateValues = {};
        values.candidateValues.forEach(function (v) {
          candidateValues[v.value || v.key] = v.label;
        });
        Object.assign(query, {
          candidateValues: candidateValues
        });
      } // Function形式需要按照对应结构返回


      if (candidateValueType === 'FUNCTION') {
        Object.assign(query, {
          candidateFunction: _this.makeupFunctionQuery(values)
        });
      }

      return [query];
    };

    _this.makeupFunctionQuery = function (values) {
      var candidateType = _this.state.candidateType;

      var _this$context$candida = _this.context.candidateStructure.find(function (cs) {
        return cs.flowCandidateType.id === candidateType;
      }),
          candidateFunction = _this$context$candida.candidateFunction;

      var query = Object.assign({}, candidateFunction); // 函数类型可能会有多个参数，暂时只能以函数名称做为key来标识

      query.paramList.forEach(function (param) {
        if (param.type === 1) {
          param.candidateValues = param.candidateValues || {};
          values.candidateValues[param.paramName] && values.candidateValues[param.paramName].forEach(function (v) {
            param.candidateValues[v.key || v.value] = v.label;
          });
        } else {
          param.candidateParam = values.candidateParam[param.paramName];
        }
      });
      return query;
    };

    return _this;
  }

  _createClass(Auth, [{
    key: "componentDidMount",
    // 获取候选项结构
    value: function componentDidMount() {
      this.initValue(this.context.candidateStructure);
    } // 初始化

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          candidateType = _this$state.candidateType,
          candidateValueType = _this$state.candidateValueType,
          candidateValue = _this$state.candidateValue,
          valueSequence = _this$state.valueSequence,
          candidateValueSelectType = _this$state.candidateValueSelectType;
      var candidateStructure = this.context.candidateStructure; // function类型结构数据

      var functionStructure = candidateValueType === 'FUNCTION' ? candidateStructure.find(function (cs) {
        return cs.flowCandidateType.id === candidateType;
      }).candidateFunction : {};
      return React.createElement(_Row, {
        gutter: 16
      }, React.createElement(_Col, {
        span: 6
      }, React.createElement(_Card, {
        title: "\u6267\u884C\u4EBA\u7C7B\u522B",
        style: {
          marginBottom: 8
        }
      }, React.createElement(_Radio.Group, {
        value: candidateType,
        onChange: this.changeCandidateType
      }, candidateStructure.map(function (cs) {
        return React.createElement(_Radio, {
          style: {
            paddingBottom: '10px'
          },
          key: cs.flowCandidateType.id,
          value: cs.flowCandidateType.id
        }, cs.flowCandidateType.value);
      }))), React.createElement(_Card, {
        title: "\u8D4B\u503C\u65B9\u5F0F"
      }, candidateType ? React.createElement(_Radio.Group, {
        value: candidateValueType,
        onChange: this.changeValueType
      }, candidateStructure.find(function (cs) {
        return cs.flowCandidateType.id === candidateType;
      }).candidateValueDefinitions.map(function (enums) {
        return React.createElement(_Radio, {
          key: enums.candidateValueEnum,
          value: enums.candidateValueEnum,
          option: enums
        }, _this2.candidateValueTypeMap[enums.candidateValueEnum]);
      })) : React.createElement("p", null, "\u8BF7\u9009\u62E9\u6267\u884C\u4EBA\u7C7B\u522B"))), React.createElement(_Col, {
        span: 18
      }, React.createElement(_Card, {
        title: "\u6267\u884C\u4EBA"
      }, candidateValueType ? React.createElement("div", {
        style: {
          maxHeight: 350,
          overflow: 'auto'
        }
      }, React.createElement(EditComponent, {
        valueSequence: valueSequence,
        type: candidateValueType,
        candidateType: candidateType,
        valueType: candidateValueSelectType,
        value: candidateValue,
        functionStructure: functionStructure,
        form: this.props.form
      })) : React.createElement("p", null, "\u8BF7\u9009\u62E9\u6267\u884C\u4EBA\u7C7B\u522B"))));
    }
  }], [{
    key: "resolveNode",
    value: function resolveNode(node, item) {
      return item.defaultValue;
    }
  }]);

  return Auth;
}(React.Component);

Auth.contextType = Context;
export { Auth as default };