function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import { Provider } from './context';
import Processor from './processor';
import { defaultPrimaryColor } from './constants';
import { initValue } from './utils/transfer-engine';
import { isEmpty } from 'lodash';
import './icon.js';

var Flow = function Flow(props) {
  var value = props.value;
  var result;
  var configValue;

  if (isEmpty(value)) {
    var _initValue = initValue(),
        initedResult = _initValue.result,
        initedConfig = _initValue.configValue;

    result = initedResult;
    configValue = initedConfig;
  } else {
    result = value.value;
    configValue = value.configValue;
  }

  var targetProps = _objectSpread({}, props, {
    value: result,
    configValue: configValue
  });

  return React.createElement(Provider, targetProps, React.createElement(Processor, _extends({}, targetProps, {
    primary: props.primary || defaultPrimaryColor
  })));
};

export default Flow;