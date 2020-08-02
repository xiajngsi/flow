import "antd/es/button/style/css";
import _Button from "antd/es/button";
import "antd/es/form/style/css";
import _Form from "antd/es/form";
import "antd/es/input-number/style/css";
import _InputNumber from "antd/es/input-number";
import "antd/es/date-picker/style/css";
import _DatePicker from "antd/es/date-picker";
import "antd/es/input/style/css";
import _Input from "antd/es/input";
import "antd/es/select/style/css";
import _Select from "antd/es/select";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useState } from 'react';
import { map } from 'lodash';
import { rules } from './rule';
import produce from 'immer';
import { remove } from 'lodash';
import './index.less';
import { initCondition } from '../../../../constants';
var booleanOptions = [{
  label: '是',
  value: true
}, {
  label: '否',
  value: false
}];

var Condition = function Condition(props) {
  var fields = props.fields,
      value = props.value,
      onChange = props.onChange;

  var _useState = useState(value.conditions || []),
      _useState2 = _slicedToArray(_useState, 2),
      conditions = _useState2[0],
      changeConditions = _useState2[1];

  var getValueComponent = function getValueComponent(item) {
    var conditionValue = item.value,
        key = item.key;
    var typeValue = key ? fields[key] : '';
    var commonProps = {
      placeholder: '值',
      onChange: function onChange(val) {
        return changeRuleOrValue(val, item, 'value');
      },
      value: conditionValue
    };

    switch (typeValue.type) {
      case 'Enum':
      case 'Dictionary':
        return React.createElement(_Select, _extends({}, commonProps, {
          mode: "multiple",
          value: commonProps.value || []
        }), typeValue.typeMeta && typeValue.typeMeta.options.map(function (_ref) {
          var label = _ref.label,
              value = _ref.value;
          return React.createElement(_Select.Option, {
            key: value
          }, label);
        }));

      case 'Text':
      case 'MultiText':
      case 'RichText':
      case 'Identifier':
        return React.createElement(_Input.TextArea, commonProps);

      case 'Date':
        return React.createElement(_DatePicker, _extends({
          format: "YYYY-MM-DD HH:mm:ss"
        }, commonProps));

      case 'Number':
        return React.createElement(_InputNumber, commonProps);

      case 'Boolean':
        return React.createElement(_Select, commonProps, booleanOptions.map(function (_ref2) {
          var label = _ref2.label,
              value = _ref2.value;
          return React.createElement(_Select.Option, {
            key: value
          }, label);
        }));

      default:
        return null;
        break;
    }
  };

  var changeModel = function changeModel(modelKey, item) {
    var newItem = produce(conditions, function (draft) {
      remove(draft, function (_ref3) {
        var key = _ref3.key;
        return item.key === key;
      });
      draft.push({
        key: modelKey,
        rule: '',
        value: ''
      });
    });
    handleChange(newItem);
  };

  var changeRuleOrValue = function changeRuleOrValue(val, item, type) {
    var newItem = produce(conditions, function (draft) {
      return draft.map(function (condition, index) {
        if (condition.key === item.key) {
          return _objectSpread({}, item, _defineProperty({}, type || 'rule', val));
        }

        return condition;
      });
    });
    handleChange(newItem);
  };

  var handleChange = function handleChange(item) {
    changeConditions(item);

    if (onChange) {
      onChange({
        relation: value.relation,
        conditions: item
      });
    }
  };

  var handleRelation = function handleRelation(val) {
    if (onChange) {
      onChange({
        relation: val,
        conditions: conditions
      });
    }
  };

  var handleAddCondition = function handleAddCondition() {
    var newItem = produce(conditions, function (draft) {
      draft.push(initCondition);
    });
    changeConditions(newItem);
  };

  var handleDeleteCondition = function handleDeleteCondition(index) {
    var newItem = produce(conditions, function (draft) {
      draft.splice(index, 1);
    });
    changeConditions(newItem);
  };

  return React.createElement("div", null, React.createElement(_Form.Item, {
    label: "\u6761\u4EF6\u5173\u7CFB"
  }, React.createElement(_Select, {
    onChange: handleRelation,
    value: value.relation
  }, React.createElement(_Select.Option, {
    value: "&"
  }, "\u4E14"), React.createElement(_Select.Option, {
    value: "||"
  }, "\u6216"))), React.createElement(_Form.Item, {
    label: "\u6761\u4EF6"
  }, React.createElement("div", null, conditions.map(function (item, index) {
    var key = item.key,
        rule = item.rule;
    var optionRule = key && fields[key] ? rules.find(function (_ref4) {
      var types = _ref4.types;
      return types.includes(fields[key].type);
    }) : [];
    return React.createElement("div", {
      className: "conditionItem",
      key: "".concat(item.key).concat(index)
    }, React.createElement(_Select, {
      value: key,
      onChange: function onChange(val) {
        return changeModel(val, item);
      },
      placeholder: "\u5B57\u6BB5"
    }, map(fields, function (value, key) {
      return React.createElement(_Select.Option, {
        key: key
      }, value.name);
    })), React.createElement(_Select, {
      value: rule,
      onChange: function onChange(val) {
        return changeRuleOrValue(val, item);
      },
      placeholder: "\u89C4\u5219"
    }, map(optionRule.options, function (value, key) {
      return React.createElement(_Select.Option, {
        key: key
      }, value);
    })), getValueComponent(item), React.createElement(_Button, {
      type: "link",
      onClick: function onClick(index) {
        handleDeleteCondition(index);
      }
    }, "\u5220\u9664"));
  }), React.createElement(_Button, {
    onClick: handleAddCondition,
    className: "add-condition"
  }, "\u65B0\u589E\u6761\u4EF6"))));
};

export default Condition;