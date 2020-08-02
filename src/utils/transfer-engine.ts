import { startEvent as constStartEvent } from '../constants';
import { IType } from '../interface';

// 初始化value
export const initValue = () => {
  const startEvent = constStartEvent;
  const startNode = {
    nodeId: startEvent.id,
    type: 'start',
    name: startEvent.name,
    nextId: 'end',
  };
  const result: any = startNode;
  const configValue = {
    [IType.start]: startNode,
  };

  return { result, configValue };
};
