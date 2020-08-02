import React, { useEffect, useReducer, useState } from 'react';
import { INode, IType, LayoutType } from '../interface';
import { omit, camelCase, cloneDeep } from 'lodash';
import produce from 'immer';
import { getUniqueNodeId } from '../utils';
import { typeName, initCondition, initCandidate, initConditionExpression } from '../constants';
export interface IConfigPanel {
  visible: boolean;
  item: INode;
}
export interface IContextValue {
  onAddItem: Function;
  onDeleteItem: Function;
  onAddCondition: Function;
  changeDomRefs: Function;
  value: INode;
  lineInfo: { from: INode; to: INode }[];
  domRefs: object;
  layoutType?: LayoutType;
  configPanel: IConfigPanel;
  changeConfigPanel: Function;
}
const initState: any = {};
export const Context = React.createContext(initState);

const lazyInit = props => {
  return {
    value: props.value,
    lineInfo: [],
    configPanel: { visible: false, item: null },
    config: props.config, // 配置中表单数据
    configValue: props.configValue, // 节点配置值
    onChange: props.onChange,
    taskTypes: props.taskTypes,
    getCandidates: props.getCandidates,
    candidateStructure: props.candidateStructure,
  };
};

function reducer(state, action) {
  return { ...state, ...omit(action, 'type') };
}

export const Provider = props => {
  const [state, dispatch] = useReducer(reducer, props, lazyInit);
  const [domRefs, changeDomRefs] = useState({});
  const layoutType = props.layoutType;

  useEffect(() => {
    dispatch({ value: props.value });
  }, [props.value]);

  useEffect(() => {
    dispatch({ lineInfo: getLineInfo(state.value) });
  }, [state.value]);

  // 删除对应节点和配置信息并修改 下个节点的prevId 到上个节点
  const deleteItem = (value: INode, node) => {
    const nodeCopy = cloneDeep(node);
    const traverse = (item, parent) => {
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
          item.conditionNodes.forEach((conditionNode: INode) => {
            traverse(conditionNode, item);
          });
        }
      }
    };
    const newConfigValue = produce(state.configValue, draft => {
      draft[nodeCopy.nodeId] = undefined;
    });
    dispatch({ configValue: newConfigValue });
    traverse(value, value);
  };

  const deleteBranchNode = (value: INode, node, conditionChildNode) => {
    const traverse = (item, parent) => {
      if (item.nodeId === node.nodeId) {
        if (conditionChildNode) {
          const conditionChildNodeLastNode = findConditionChildNodeLastNode(conditionChildNode);
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
          item.conditionNodes.forEach((conditionNode: INode) => {
            traverse(conditionNode, item);
          });
        }
      }
    };
    const newConfigValue = produce(state.configValue, draft => {
      draft[node.nodeId] = undefined;
    });

    dispatch({ configValue: newConfigValue });
    traverse(value, value);
  };

  const handleDeleteCondition = (node: INode) => {
    const newValue = produce(state.value, draft => {
      const traverse = (item: INode, parent: INode, index?: number) => {
        if (item.nodeId === node.nodeId) {
          // 分支大于两条时删除当前分支，等于两条时删除当前分支并把另一分支上的节点拿出来，如果只有一条分支就是数据错误问题，暂时不处理
          if (parent.conditionNodes.length > 2) {
            parent.conditionNodes.splice(index, 1);
          } else if ((parent.conditionNodes.length = 2)) {
            parent.conditionNodes.splice(index, 1);
            const conditionChildNode = parent.conditionNodes[0].childNode;
            deleteBranchNode(draft, parent, conditionChildNode);
          }
        } else {
          if (item.childNode) {
            traverse(item.childNode, item);
          }
          if (item.conditionNodes) {
            item.conditionNodes.forEach((conditionNode: INode, conditionIndex: number) => {
              traverse(conditionNode, item, conditionIndex);
            });
          }
        }
      };
      traverse(draft, draft);
    });
    dispatch({ value: newValue });
  };

  const handleDeleteItem = node => {
    if (node.type === IType.condition) {
      handleDeleteCondition(node);
    } else {
      const newValue = produce(state.value, draft => {
        deleteItem(draft, node);
      });
      dispatch({ value: newValue });
    }
  };

  const handleAddItem = ({ from, type }) => {
    const tempId = getUniqueNodeId(type);
    // 默认两条分支
    const tempConditionNode = genConditonNode(tempId, '条件1');
    const secondConditionNode = genConditonNode(tempId, '条件2');
    const addedNode = {
      type,
      name: typeName[type],
      nodeId: tempId,
      prevId: from.nodeId,
      conditionNodes: type === IType.route ? [tempConditionNode, secondConditionNode] : undefined,
    };
    const newValue = produce(state.value, draft => {
      const traverse = item => {
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
            item.conditionNodes.forEach((conditionNode: INode) => {
              traverse(conditionNode);
            });
          }
        }
      };
      traverse(draft);
    });

    const newConfigValue = genNodeConfig(addedNode, from.nodeId);
    // 新增条件节点的优先级默认为 1
    const addContionAfter = genConditionConfig(tempConditionNode, 1);
    const secondContionAfter = genConditionConfig(secondConditionNode, 2);
    dispatch({
      value: newValue,
      configValue: { ...newConfigValue, ...addContionAfter, ...secondContionAfter },
    });
  };

  const handleAddCondition = node => {
    const conditionNode = genConditonNode();
    let currConditionPriority = 1;
    const newValue = produce(state.value, draft => {
      const traverse = item => {
        if (item.nodeId === node.nodeId) {
          currConditionPriority = item.conditionNodes.length + 1;
          conditionNode.name = `${typeName.condition}${item.conditionNodes.length + 1}`;
          conditionNode.prevId = item.nodeId;
          item.conditionNodes.push(conditionNode);
        } else {
          if (item.childNode) {
            traverse(item.childNode);
          }
          if (item.conditionNodes) {
            item.conditionNodes.forEach((conditionNode: INode) => {
              traverse(conditionNode);
            });
          }
        }
      };
      traverse(draft);
    });
    const addContionAfter = genConditionConfig(conditionNode, currConditionPriority);
    dispatch({ value: newValue, configValue: addContionAfter });
  };

  const genConditonNode = (prevId?: string, name?: string) => {
    const tempId = getUniqueNodeId(IType.condition);
    const conditionNode = {
      type: IType.condition,
      nodeId: tempId,
      name: name || '条件',
      prevId,
    };

    return conditionNode;
  };

  const genConditionConfig = (conditionNode, priority) => {
    const newConfigValue = produce(state.configValue, draft => {
      draft[conditionNode.nodeId] = {
        ...conditionNode,
        priority,
        conditionExpression: initConditionExpression,
      };
    });
    return newConfigValue;
  };

  const genNodeConfig = (addedNode, prevId) => {
    const newConfigValue = produce(state.configValue, draft => {
      const nextNode: INode = addedNode.childNode as INode;
      draft[addedNode.nodeId] = {
        ...addedNode,
        prevId,
        ...initCandidate,
      };
      if (nextNode && draft[nextNode.nodeId]) {
        draft[nextNode.nodeId].prevId = addedNode.nodeId;
      }
    });
    return newConfigValue;
  };
  const contextValue = {
    ...state,
    domRefs,
    onDeleteItem: handleDeleteItem,
    onAddItem: handleAddItem,
    ...getReducerFuncMap(lazyInit({}), dispatch),
    changeDomRefs,
    onAddCondition: handleAddCondition,
    layoutType,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

// 将 state 内部的变量编程 change + 变量首字母大写的函数，传入到子组件，以供方便调用
const getReducerFuncMap = (initialState, dispatch) => {
  const reducerFuncMap = {};
  Object.keys(initialState).forEach(key => {
    reducerFuncMap[camelCase(`change ${key}`)] = payload => dispatch(payload);
  });
  return reducerFuncMap;
};

const getLineInfo = value => {
  const lineInfo = [];
  const traverseProcessor = (node: INode, nextNode?: INode) => {
    if (node.conditionNodes) {
      node.conditionNodes.forEach((conditionNode: INode) => {
        lineInfo.push({ from: node, to: conditionNode });
        traverseCondition(conditionNode, node.childNode, nextNode);
      });
    } else {
      if (node.childNode) {
        lineInfo.push({ from: node, to: node.childNode });
        traverseProcessor(node.childNode, nextNode);
      } else if (nextNode) {
        lineInfo.push({ from: node, to: nextNode });
      } else {
        lineInfo.push({ from: node, to: 'end' });
      }
    }
  };
  const traverseCondition = (node, nextNode, grandParentNode) => {
    if (node.childNode || nextNode) {
      traverseProcessor(node, nextNode);
    } else {
      traverseProcessor(node, grandParentNode);
    }
    if (nextNode) {
      traverseProcessor(nextNode, grandParentNode);
    }
  };
  traverseProcessor(value as INode);
  return lineInfo;
};

const findConditionChildNodeLastNode = node => {
  while (node.childNode) {
    node = node.childNode;
  }
  return node;
};
