import { IType, INode, IRelation, IRule } from '../interface';
import { startEvent, endEvent } from '../constants';
import { getUniqueNodeId, getFieldsFromConfig } from './index';
import { isEmpty, cloneDeep } from 'lodash';

interface IEngineFlow {
  startEvent: { id: string; name: string };
  endEvent: { id: string; name: string };
  taskList: any[];
  sequenceList: any[];
}

const excludeTypeNode = [IType.route, IType.condition];
const taskMapType = [IType.approver, IType.notifier];

// 流程内部结构值改成流程引擎的结构
export const transferValueToFlow = (data, configValue, config) => {
  const copyData = cloneDeep(data);
  const result: IEngineFlow = {
    startEvent,
    endEvent,
    sequenceList: [],
    taskList: [],
  };
  const taskMap = {};
  const sequenceList = [];
  const traverseProcessor = (node: INode, nextNode?: INode) => {
    if (node.conditionNodes) {
      if (node.childNode) {
        const parentNode = findEntityParent(node, configValue);
        if (!excludeTypeNode.includes(configValue[node.prevId].type)) {
          node.childNode.conditionConvergeId = parentNode.nodeId;
        }
        traverseProcessor(node.childNode, nextNode);
      }
      node.conditionNodes.forEach((conditionNode: INode) => {
        traverseCondition(conditionNode, node.childNode, nextNode);
      });
    } else {
      if (node.childNode) {
        assemblySequenceList(sequenceList, node, node.childNode, taskMap, configValue, config);
        traverseProcessor(node.childNode, nextNode);
      } else if (nextNode) {
        assemblySequenceList(sequenceList, node, nextNode, taskMap, configValue, config);
      } else {
        assemblySequenceList(sequenceList, node, endEvent, taskMap, configValue, config);
      }
    }
  };
  const traverseCondition = (node, nextNode, grandParentNode) => {
    if (node.childNode || nextNode) {
      traverseProcessor(node, nextNode);
    } else if (grandParentNode) {
      traverseProcessor(node, grandParentNode);
    }
  };
  traverseProcessor(copyData);
  result.sequenceList = sequenceList;
  result.taskList = Object.values(taskMap);
  // 多余字段清除
  result.taskList.forEach(task => {
    delete task.childNode;
  });
  result.taskList = result.taskList.filter(task => {
    return taskMapType.includes(task.type);
  });
  return result;
};

const assemblyTaskMap = (taskMap, node, configValue) => {
  taskMap[node.nodeId] = {
    id: node.nodeId,
    name: node.name,
    ...configValue[node.nodeId],
    conditionConvergeId: node.conditionConvergeId,
  };
};
const assemblySequenceList = (sequenceList, node, nextNode, taskMap, configValue, config) => {
  // 去掉 branch 和 condition 这类虚拟节点，流程引擎中没有
  if (!excludeTypeNode.includes(nextNode.type)) {
    // 是条件节点则找出上面的 branch 节点上面的真实节点
    if (node.type === IType.condition) {
      const { priority, affiliation, conditionExpression: conditions } =
        configValue[node.nodeId] || {};
      const conditionExpression = genConditionExpression(
        conditions,
        getFieldsFromConfig(config, affiliation),
      );
      // 找到不是 excludeTypeNode 类型的节点
      const targetParentNode = findEntityParent(node, configValue);
      // const branchNode = configValue[node.prevId];
      // const branchParentNode = configValue[branchNode.prevId];
      sequenceList.push({
        sourceRef: targetParentNode.nodeId,
        targetRef: nextNode.nodeId,
        hasCondition: true,
        id: getUniqueNodeId(),
        priority,
        affiliation,
        conditionExpression,
      });
    } else {
      sequenceList.push({
        sourceRef: node.nodeId,
        targetRef: nextNode.nodeId,
        hasCondition: false,
        id: getUniqueNodeId(),
      });
    }
    assemblyTaskMap(taskMap, node, configValue);
  } else if (nextNode.type === IType.route) {
    assemblyTaskMap(taskMap, node, configValue);
  }
};

const findEntityParent = (node, configValue) => {
  const currNode = node;
  let prevNode = configValue[currNode.prevId];
  while (excludeTypeNode.includes(prevNode.type)) {
    prevNode = configValue[prevNode.prevId];
  }
  return prevNode;
};

const genConditionExpression = (value, fields) => {
  if (isEmpty(value) || !fields) {
    return '';
  }
  const { relation, conditions } = value;
  let result = '';
  conditions.forEach(({ key, rule, value: val }, index) => {
    switch (fields[key]) {
      case 'Text':
      case 'MultiText':
      case 'RichText':
      case 'Identifier':
        if (rule === IRule.contain) {
          result += '${' + `${key}.contains(${JSON.stringify(val)})` + '}';
        } else {
          result += '${' + `${key}.equals(${JSON.stringify(val)})` + '}';
        }
        break;
      case 'Enum':
      case 'Dictionary':
        if (rule === IRule.contain) {
          result += '${' + `${JSON.stringify(val)}.contains(${key})` + '}';
        } else if (rule === IRule.notContain) {
          result += '${!' + `${JSON.stringify(val)}.contains(${key})` + '}';
        }
        break;
      case 'Boolean':
        if (rule === IRule.true) {
          result += '${' + key + '}';
        } else {
          result += '$!{' + key + '}';
        }
      default:
        result += '${' + `${key}${rule}${JSON.stringify(val)}` + '}';
        break;
    }
    if (index !== conditions.length - 1) {
      result += relation;
    }
  });
  return result;
};
