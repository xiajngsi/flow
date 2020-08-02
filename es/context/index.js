function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { useEffect, useReducer, useState } from 'react';
import { IType } from '../interface';
import { omit, camelCase, cloneDeep } from 'lodash';
import produce from 'immer';
import { getUniqueNodeId } from '../utils';
import { typeName, initCandidate, initConditionExpression } from '../constants';
var initState = {};
export var Context = React.createContext(initState);

var lazyInit = function lazyInit(props) {
  return {
    value: props.value,
    lineInfo: [],
    configPanel: {
      visible: false,
      item: null
    },
    config: props.config,
    // 配置中表单数据
    configValue: props.configValue,
    // 节点配置值
    onChange: props.onChange,
    taskTypes: props.taskTypes,
    getCandidates: props.getCandidates,
    candidateStructure: props.candidateStructure
  };
};

function reducer(state, action) {
  return _objectSpread({}, state, {}, omit(action, 'type'));
}

export var Provider = function Provider(props) {
  var _useReducer = useReducer(reducer, props, lazyInit),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      domRefs = _useState2[0],
      changeDomRefs = _useState2[1];

  var layoutType = props.layoutType;
  useEffect(function () {
    dispatch({
      value: props.value
    });
  }, [props.value]);
  useEffect(function () {
    dispatch({
      lineInfo: getLineInfo(state.value)
    });
  }, [state.value]); // 删除对应节点和配置信息并修改 下个节点的prevId 到上个节点

  var deleteItem = function deleteItem(value, node) {
    var nodeCopy = cloneDeep(node);

    var traverse = function traverse(item, parent) {
      if (item.nodeId === nodeCopy.nodeId) {
        if (nodeCopy.childNode) {
          nodeCopy.childNode.prevId = parent.nodeId;
        }

        parent.childNode = nodeCopy.childNode;
      } else {
        if (item.childNode) {
          traverse(item.childNode, item);
        }

        if (item.conditionNodes) {
          item.conditionNodes.forEach(function (conditionNode) {
            traverse(conditionNode, item);
          });
        }
      }
    };

    var newConfigValue = produce(state.configValue, function (draft) {
      draft[nodeCopy.nodeId] = undefined;
    });
    dispatch({
      configValue: newConfigValue
    });
    traverse(value, value);
  };

  var deleteBranchNode = function deleteBranchNode(value, node, conditionChildNode) {
    var traverse = function traverse(item, parent) {
      if (item.nodeId === node.nodeId) {
        if (conditionChildNode) {
          var conditionChildNodeLastNode = findConditionChildNodeLastNode(conditionChildNode);
          conditionChildNode.prevId = parent.nodeId;

          if (item.childNode) {
            item.childNode.prevId = conditionChildNodeLastNode.nodeId;
          }

          conditionChildNodeLastNode.childNode = item.childNode;
          parent.childNode = conditionChildNode;
        } else {
          if (node.childNode) {
            node.childNode.prevId = parent.nodeId;
          }

          parent.childNode = node.childNode;
        }
      } else {
        if (item.childNode) {
          traverse(item.childNode, item);
        }

        if (item.conditionNodes) {
          item.conditionNodes.forEach(function (conditionNode) {
            traverse(conditionNode, item);
          });
        }
      }
    };

    var newConfigValue = produce(state.configValue, function (draft) {
      draft[node.nodeId] = undefined;
    });
    dispatch({
      configValue: newConfigValue
    });
    traverse(value, value);
  };

  var handleDeleteCondition = function handleDeleteCondition(node) {
    var newValue = produce(state.value, function (draft) {
      var traverse = function traverse(item, parent, index) {
        if (item.nodeId === node.nodeId) {
          // 分支大于两条时删除当前分支，等于两条时删除当前分支并把另一分支上的节点拿出来，如果只有一条分支就是数据错误问题，暂时不处理
          if (parent.conditionNodes.length > 2) {
            parent.conditionNodes.splice(index, 1);
          } else if (parent.conditionNodes.length = 2) {
            parent.conditionNodes.splice(index, 1);
            var conditionChildNode = parent.conditionNodes[0].childNode;
            deleteBranchNode(draft, parent, conditionChildNode);
          }
        } else {
          if (item.childNode) {
            traverse(item.childNode, item);
          }

          if (item.conditionNodes) {
            item.conditionNodes.forEach(function (conditionNode, conditionIndex) {
              traverse(conditionNode, item, conditionIndex);
            });
          }
        }
      };

      traverse(draft, draft);
    });
    dispatch({
      value: newValue
    });
  };

  var handleDeleteItem = function handleDeleteItem(node) {
    if (node.type === IType.condition) {
      handleDeleteCondition(node);
    } else {
      var newValue = produce(state.value, function (draft) {
        deleteItem(draft, node);
      });
      dispatch({
        value: newValue
      });
    }
  };

  var handleAddItem = function handleAddItem(_ref) {
    var from = _ref.from,
        type = _ref.type;
    var tempId = getUniqueNodeId(type); // 默认两条分支

    var tempConditionNode = genConditonNode(tempId, '条件1');
    var secondConditionNode = genConditonNode(tempId, '条件2');
    var addedNode = {
      type: type,
      name: typeName[type],
      nodeId: tempId,
      prevId: from.nodeId,
      conditionNodes: type === IType.route ? [tempConditionNode, secondConditionNode] : undefined
    };
    var newValue = produce(state.value, function (draft) {
      var traverse = function traverse(item) {
        if (item.nodeId === from.nodeId) {
          if (item.childNode) {
            item.childNode.prevId = addedNode.nodeId;
            addedNode.childNode = item.childNode;
          }

          item.childNode = addedNode;
        } else {
          if (item.childNode) {
            traverse(item.childNode);
          }

          if (item.conditionNodes) {
            item.conditionNodes.forEach(function (conditionNode) {
              traverse(conditionNode);
            });
          }
        }
      };

      traverse(draft);
    });
    var newConfigValue = genNodeConfig(addedNode, from.nodeId); // 新增条件节点的优先级默认为 1

    var addContionAfter = genConditionConfig(tempConditionNode, 1);
    var secondContionAfter = genConditionConfig(secondConditionNode, 2);
    dispatch({
      value: newValue,
      configValue: _objectSpread({}, newConfigValue, {}, addContionAfter, {}, secondContionAfter)
    });
  };

  var handleAddCondition = function handleAddCondition(node) {
    var conditionNode = genConditonNode();
    var currConditionPriority = 1;
    var newValue = produce(state.value, function (draft) {
      var traverse = function traverse(item) {
        if (item.nodeId === node.nodeId) {
          currConditionPriority = item.conditionNodes.length + 1;
          conditionNode.name = "".concat(typeName.condition).concat(item.conditionNodes.length + 1);
          conditionNode.prevId = item.nodeId;
          item.conditionNodes.push(conditionNode);
        } else {
          if (item.childNode) {
            traverse(item.childNode);
          }

          if (item.conditionNodes) {
            item.conditionNodes.forEach(function (conditionNode) {
              traverse(conditionNode);
            });
          }
        }
      };

      traverse(draft);
    });
    var addContionAfter = genConditionConfig(conditionNode, currConditionPriority);
    dispatch({
      value: newValue,
      configValue: addContionAfter
    });
  };

  var genConditonNode = function genConditonNode(prevId, name) {
    var tempId = getUniqueNodeId(IType.condition);
    var conditionNode = {
      type: IType.condition,
      nodeId: tempId,
      name: name || '条件',
      prevId: prevId
    };
    return conditionNode;
  };

  var genConditionConfig = function genConditionConfig(conditionNode, priority) {
    var newConfigValue = produce(state.configValue, function (draft) {
      draft[conditionNode.nodeId] = _objectSpread({}, conditionNode, {
        priority: priority,
        conditionExpression: initConditionExpression
      });
    });
    return newConfigValue;
  };

  var genNodeConfig = function genNodeConfig(addedNode, prevId) {
    var newConfigValue = produce(state.configValue, function (draft) {
      var nextNode = addedNode.childNode;
      draft[addedNode.nodeId] = _objectSpread({}, addedNode, {
        prevId: prevId
      }, initCandidate);

      if (nextNode && draft[nextNode.nodeId]) {
        draft[nextNode.nodeId].prevId = addedNode.nodeId;
      }
    });
    return newConfigValue;
  };

  var contextValue = _objectSpread({}, state, {
    domRefs: domRefs,
    onDeleteItem: handleDeleteItem,
    onAddItem: handleAddItem
  }, getReducerFuncMap(lazyInit({}), dispatch), {
    changeDomRefs: changeDomRefs,
    onAddCondition: handleAddCondition,
    layoutType: layoutType
  });

  return React.createElement(Context.Provider, {
    value: contextValue
  }, props.children);
}; // 将 state 内部的变量编程 change + 变量首字母大写的函数，传入到子组件，以供方便调用

var getReducerFuncMap = function getReducerFuncMap(initialState, dispatch) {
  var reducerFuncMap = {};
  Object.keys(initialState).forEach(function (key) {
    reducerFuncMap[camelCase("change ".concat(key))] = function (payload) {
      return dispatch(payload);
    };
  });
  return reducerFuncMap;
};

var getLineInfo = function getLineInfo(value) {
  var lineInfo = [];

  var traverseProcessor = function traverseProcessor(node, nextNode) {
    if (node.conditionNodes) {
      node.conditionNodes.forEach(function (conditionNode) {
        lineInfo.push({
          from: node,
          to: conditionNode
        });
        traverseCondition(conditionNode, node.childNode, nextNode);
      });
    } else {
      if (node.childNode) {
        lineInfo.push({
          from: node,
          to: node.childNode
        });
        traverseProcessor(node.childNode, nextNode);
      } else if (nextNode) {
        lineInfo.push({
          from: node,
          to: nextNode
        });
      } else {
        lineInfo.push({
          from: node,
          to: 'end'
        });
      }
    }
  };

  var traverseCondition = function traverseCondition(node, nextNode, grandParentNode) {
    if (node.childNode || nextNode) {
      traverseProcessor(node, nextNode);
    } else {
      traverseProcessor(node, grandParentNode);
    }

    if (nextNode) {
      traverseProcessor(nextNode, grandParentNode);
    }
  };

  traverseProcessor(value);
  return lineInfo;
};

var findConditionChildNodeLastNode = function findConditionChildNodeLastNode(node) {
  while (node.childNode) {
    node = node.childNode;
  }

  return node;
};