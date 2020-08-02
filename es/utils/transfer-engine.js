function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { startEvent as constStartEvent } from '../constants';
import { IType } from '../interface'; // 初始化value

export var initValue = function initValue() {
  var startEvent = constStartEvent;
  var startNode = {
    nodeId: startEvent.id,
    type: 'start',
    name: startEvent.name,
    nextId: 'end'
  };
  var result = startNode;

  var configValue = _defineProperty({}, IType.start, startNode);

  return {
    result: result,
    configValue: configValue
  };
};