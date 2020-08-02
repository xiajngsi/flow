function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { IType, IRule } from '../interface';
import { startEvent, endEvent } from '../constants';
import { getUniqueNodeId, getFieldsFromConfig } from './index';
import { isEmpty, cloneDeep } from 'lodash';
var excludeTypeNode = [IType.route, IType.condition];
var taskMapType = [IType.approver, IType.notifier]; // 流程内部结构值改成流程引擎的结构

export var transferValueToFlow = function transferValueToFlow(data, configValue, config) {
  var copyData = cloneDeep(data);
  var result = {
    startEvent: startEvent,
    endEvent: endEvent,
    sequenceList: [],
    taskList: []
  };
  var taskMap = {};
  var sequenceList = [];

  var traverseProcessor = function traverseProcessor(node, nextNode) {
    if (node.conditionNodes) {
      if (node.childNode) {
        var parentNode = findEntityParent(node, configValue);

        if (!excludeTypeNode.includes(configValue[node.prevId].type)) {
          node.childNode.conditionConvergeId = parentNode.nodeId;
        }

        traverseProcessor(node.childNode, nextNode);
      }

      node.conditionNodes.forEach(function (conditionNode) {
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

  var traverseCondition = function traverseCondition(node, nextNode, grandParentNode) {
    if (node.childNode || nextNode) {
      traverseProcessor(node, nextNode);
    } else if (grandParentNode) {
      traverseProcessor(node, grandParentNode);
    }
  };

  traverseProcessor(copyData);
  result.sequenceList = sequenceList;
  result.taskList = Object.values(taskMap); // 多余字段清除

  result.taskList.forEach(function (task) {
    delete task.childNode;
  });
  result.taskList = result.taskList.filter(function (task) {
    return taskMapType.includes(task.type);
  });
  return result;
};

var assemblyTaskMap = function assemblyTaskMap(taskMap, node, configValue) {
  taskMap[node.nodeId] = _objectSpread({
    id: node.nodeId,
    name: node.name
  }, configValue[node.nodeId], {
    conditionConvergeId: node.conditionConvergeId
  });
};

var assemblySequenceList = function assemblySequenceList(sequenceList, node, nextNode, taskMap, configValue, config) {
  // 去掉 branch 和 condition 这类虚拟节点，流程引擎中没有
  if (!excludeTypeNode.includes(nextNode.type)) {
    // 是条件节点则找出上面的 branch 节点上面的真实节点
    if (node.type === IType.condition) {
      var _ref = configValue[node.nodeId] || {},
          priority = _ref.priority,
          affiliation = _ref.affiliation,
          conditions = _ref.conditionExpression;

      var conditionExpression = genConditionExpression(conditions, getFieldsFromConfig(config, affiliation)); // 找到不是 excludeTypeNode 类型的节点

      var targetParentNode = findEntityParent(node, configValue); // const branchNode = configValue[node.prevId];
      // const branchParentNode = configValue[branchNode.prevId];

      sequenceList.push({
        sourceRef: targetParentNode.nodeId,
        targetRef: nextNode.nodeId,
        hasCondition: true,
        id: getUniqueNodeId(),
        priority: priority,
        affiliation: affiliation,
        conditionExpression: conditionExpression
      });
    } else {
      sequenceList.push({
        sourceRef: node.nodeId,
        targetRef: nextNode.nodeId,
        hasCondition: false,
        id: getUniqueNodeId()
      });
    }

    assemblyTaskMap(taskMap, node, configValue);
  } else if (nextNode.type === IType.route) {
    assemblyTaskMap(taskMap, node, configValue);
  }
};

var findEntityParent = function findEntityParent(node, configValue) {
  var currNode = node;
  var prevNode = configValue[currNode.prevId];

  while (excludeTypeNode.includes(prevNode.type)) {
    prevNode = configValue[prevNode.prevId];
  }

  return prevNode;
};

var genConditionExpression = function genConditionExpression(value, fields) {
  if (isEmpty(value) || !fields) {
    return '';
  }

  var relation = value.relation,
      conditions = value.conditions;
  var result = '';
  conditions.forEach(function (_ref2, index) {
    var key = _ref2.key,
        rule = _ref2.rule,
        val = _ref2.value;

    switch (fields[key]) {
      case 'Text':
      case 'MultiText':
      case 'RichText':
      case 'Identifier':
        if (rule === IRule.contain) {
          result += '${' + "".concat(key, ".contains(").concat(JSON.stringify(val), ")") + '}';
        } else {
          result += '${' + "".concat(key, ".equals(").concat(JSON.stringify(val), ")") + '}';
        }

        break;

      case 'Enum':
      case 'Dictionary':
        if (rule === IRule.contain) {
          result += '${' + "".concat(JSON.stringify(val), ".contains(").concat(key, ")") + '}';
        } else if (rule === IRule.notContain) {
          result += '${!' + "".concat(JSON.stringify(val), ".contains(").concat(key, ")") + '}';
        }

        break;

      case 'Boolean':
        if (rule === IRule.true) {
          result += '${' + key + '}';
        } else {
          result += '$!{' + key + '}';
        }

      default:
        result += '${' + "".concat(key).concat(rule).concat(JSON.stringify(val)) + '}';
        break;
    }

    if (index !== conditions.length - 1) {
      result += relation;
    }
  });
  return result;
};