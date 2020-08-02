var _typeName;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { IType, IRelation } from '../interface';
export var defaultHeight = 500;
export var domLayoutInfo = {
  marginVerticle: 35,
  marginHorizontal: 50
};
export var marginVerticle = {
  marginTop: domLayoutInfo.marginVerticle,
  marginBottom: domLayoutInfo.marginVerticle
};
export var marginHorizontal = {
  marginLeft: domLayoutInfo.marginHorizontal,
  marginRight: domLayoutInfo.marginHorizontal
};
export var BORDER_COLOR = '#999'; // 固定y轴长度，为4，一半为2；

export var arrowYDistance = 3;
var arrowDeg = Math.tan(25 / 180 * Math.PI);
export var sDistance = arrowYDistance / arrowDeg;
export var pointType;

(function (pointType) {
  pointType["from"] = "from";
  pointType["to"] = "to";
})(pointType || (pointType = {}));

export var addBtnRadius = 16;
export var defaultPrimaryColor = '#4cbf4b';
export var otherRule = ['>=', '<=', '>', '<', '='];
export var typeName = (_typeName = {}, _defineProperty(_typeName, IType.approver, '审批人'), _defineProperty(_typeName, IType.notifier, '抄送人'), _defineProperty(_typeName, IType.condition, '条件'), _typeName);
export var initCondition = {
  rule: '',
  key: '',
  value: ''
};
export var initCandidate = {
  multiTaskType: '',
  taskCandidate: {}
};
export var startEvent = {
  id: 'start',
  name: 'start'
};
export var endEvent = {
  id: 'end',
  name: 'end',
  nodeId: 'end'
};
export var defaultRelation = IRelation.and;
export var initConditionExpression = {
  relation: defaultRelation,
  conditions: [initCondition]
};