import React, { useContext } from 'react';
import { Form, Select } from 'antd';
import { map, pickBy, find } from 'lodash';
import ConditionConfig from '../condition';
import { Context } from '../../../../context';
import produce from 'immer';
import { IsupportFieldTypes, INode, IType } from '../../../../interface';

const conditonFormConfig = {
  priority: '条件优先级',
  affiliation: '条件归属',
  conditionExpression: '条件配置',
};
const ConditionForm = props => {
  const context = useContext(Context);
  const {
    config,
    configPanel: { item },
    configValue,
  } = context;
  const {
    form: { getFieldDecorator },
  } = props;

  const handlePriorityOrAffiliationChange = (key, value) => {
    const newValue = produce(context.configValue, draft => {
      if (key === 'priority') {
        const currPriorityCondition = find(
          draft,
          ({ type, priority }) =>
            type === IType.condition && priority.toString() === value.toString(),
        );
        const lastValue = draft[item.nodeId][key];
        draft[currPriorityCondition.nodeId][key] = lastValue;
      }
      draft[item.nodeId][key] = value;
    });
    context.changeConfigValue({ configValue: newValue });
  };

  const getCurrConditionBrother = new Array(getBrotherConditons(context.value, item.prevId)).fill(
    1,
  );
  const currConfig = configValue[item.nodeId];
  let fields = {};
  if (config[currConfig.affiliation]) {
    fields = pickBy(config[currConfig.affiliation].fields, (value, key) =>
      Object.keys(IsupportFieldTypes).includes(value.type),
    );
  }
  return (
    <Form layout="vertical" hideRequiredMark>
      <Form.Item label={conditonFormConfig.priority}>
        {getFieldDecorator('priority', {
          rules: [{ required: true, message: `请填写${conditonFormConfig.priority}` }],
          initialValue: currConfig.priority !== undefined ? `${currConfig.priority}` : '1',
        })(
          <Select onChange={val => handlePriorityOrAffiliationChange('priority', val)}>
            {getCurrConditionBrother.map((any, index) => (
              <Select.Option key={index + 1}>{`优先级${index + 1}`}</Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label={conditonFormConfig.affiliation}>
        {getFieldDecorator('affiliation', {
          rules: [{ required: true, message: `请填写${conditonFormConfig.affiliation}` }],
          initialValue: currConfig.affiliation,
        })(
          <Select onChange={val => handlePriorityOrAffiliationChange('affiliation', val)}>
            {map(config, (value, key) => {
              return <Select.Option key={key}>{value.name}</Select.Option>;
            })}
          </Select>,
        )}
      </Form.Item>
      {getFieldDecorator('conditionExpression', {
        rules: [{ required: true, message: `请填写${conditonFormConfig.conditionExpression}` }],
        initialValue: currConfig.conditionExpression,
      })(
        <ConditionConfig
          fields={fields}
          onChange={val => handlePriorityOrAffiliationChange('conditionExpression', val)}
        />,
      )}
    </Form>
  );
};

export default Form.create()(ConditionForm);

const getBrotherConditons = (value, targetId) => {
  let childLength = 0;
  const traverseProcessor = (node: INode, nextNode?: INode) => {
    if (node.conditionNodes) {
      if (node.nodeId === targetId) {
        childLength = node.conditionNodes.length;
      }
      node.conditionNodes.forEach((conditionNode: INode) => {
        traverseCondition(conditionNode, node.childNode, nextNode);
      });
    } else {
      if (node.childNode) {
        traverseProcessor(node.childNode, nextNode);
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
  return childLength;
};
