import "antd/es/button/style/css";
import _Button from "antd/es/button";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { useContext } from 'react';
import { Context } from '../../context';
import { transferValueToFlow } from '../../utils/transfer-flow';
import styles from './index.less';

var Toolbar = function Toolbar() {
  var context = useContext(Context);

  var handleSubmit = function handleSubmit() {
    var value = transferValueToFlow(context.value, context.configValue, context.config);

    var result = _objectSpread({}, value, {
      flowData: {
        value: context.value,
        configValue: context.configValue
      }
    });

    console.log('xxx result', result);

    if (context.onChange) {
      context.onChange(result);
    }
  };

  return React.createElement("div", {
    className: styles.toolbar
  }, React.createElement("span", {
    className: "margin-right-small"
  }, "\u653E\u5927"), React.createElement("span", {
    className: "margin-right-small"
  }, "\u7F29\u5C0F"), React.createElement("span", {
    className: "margin-right-small"
  }, "\u5168\u5C4F"), React.createElement(_Button, {
    onClick: handleSubmit
  }, "\u4FDD\u5B58"));
};

export default Toolbar;