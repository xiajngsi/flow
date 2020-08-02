import { IType, IRelation } from '../interface';
export const defaultHeight = 500;

export const domLayoutInfo = {
  marginVerticle: 35,
  marginHorizontal: 50,
};

export const marginVerticle = {
  marginTop: domLayoutInfo.marginVerticle,
  marginBottom: domLayoutInfo.marginVerticle,
};

export const marginHorizontal = {
  marginLeft: domLayoutInfo.marginHorizontal,
  marginRight: domLayoutInfo.marginHorizontal,
};

export const BORDER_COLOR = '#999';

// 固定y轴长度，为4，一半为2；
export const arrowYDistance = 3;
const arrowDeg = Math.tan((25 / 180) * Math.PI);
export const sDistance = arrowYDistance / arrowDeg;

export enum pointType {
  from = 'from',
  to = 'to',
}

export const addBtnRadius = 16;

export const defaultPrimaryColor = '#4cbf4b';

export const otherRule = ['>=', '<=', '>', '<', '='];

export const typeName = {
  [IType.approver]: '审批人',
  [IType.notifier]: '抄送人',
  [IType.condition]: '条件',
};

export const initCondition = {
  rule: '',
  key: '',
  value: '',
};

export const initCandidate = {
  multiTaskType: '',
  taskCandidate: {},
};

export const startEvent = {
  id: 'start',
  name: 'start',
};
export const endEvent = {
  id: 'end',
  name: 'end',
  nodeId: 'end',
};
export const defaultRelation = IRelation.and;

export const initConditionExpression = {
  relation: defaultRelation,
  conditions: [initCondition],
};
