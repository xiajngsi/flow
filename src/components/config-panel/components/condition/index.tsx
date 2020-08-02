import React, { useState } from 'react';
import { Select, Input, DatePicker, InputNumber, Button, Form } from 'antd';
import { map } from 'lodash';
import { rules } from './rule';
import produce from 'immer';
import { remove } from 'lodash';
import './index.less';
import { initCondition } from '../../../../constants';

interface ICondition {
  key: string;
  rule: string;
  value: any;
}

interface ICon {
  conditions: ICondition[];
  relation: '|' | '&';
}
interface IProps {
  fields: any[];
  value: ICon;
  onChange?: Function;
}

const booleanOptions = [{ label: '是', value: true }, { label: '否', value: false }];

const Condition = (props: IProps) => {
  const { fields, value, onChange } = props;
  const [conditions, changeConditions] = useState(value.conditions || []);

  const getValueComponent = item => {
    const { value: conditionValue, key } = item;
    const typeValue = key ? fields[key] : '';
    const commonProps = {
      placeholder: '值',
      onChange: val => changeRuleOrValue(val, item, 'value'),
      value: conditionValue,
    };
    switch (typeValue.type) {
      case 'Enum':
      case 'Dictionary':
        return (
          <Select {...commonProps} mode="multiple" value={commonProps.value || []}>
            {typeValue.typeMeta &&
              typeValue.typeMeta.options.map(({ label, value }) => {
                return <Select.Option key={value}>{label}</Select.Option>;
              })}
          </Select>
        );
      case 'Text':
      case 'MultiText':
      case 'RichText':
      case 'Identifier':
        return <Input.TextArea {...commonProps} />;
      case 'Date':
        return <DatePicker format="YYYY-MM-DD HH:mm:ss" {...commonProps} />;
      case 'Number':
        return <InputNumber {...commonProps} />;
      case 'Boolean':
        return (
          <Select {...commonProps}>
            {booleanOptions.map(({ label, value }) => {
              return <Select.Option key={value}>{label}</Select.Option>;
            })}
          </Select>
        );
      default:
        return null;
        break;
    }
  };

  const changeModel = (modelKey: string, item: ICondition) => {
    const newItem = produce(conditions, draft => {
      remove(draft, ({ key }) => item.key === key);
      draft.push({ key: modelKey, rule: '', value: '' });
    });
    handleChange(newItem);
  };

  const changeRuleOrValue = (val: any, item: ICondition, type?: 'rule' | 'value') => {
    const newItem = produce(conditions, draft => {
      return draft.map((condition: ICondition, index) => {
        if (condition.key === item.key) {
          return { ...item, [type || 'rule']: val };
        }
        return condition;
      });
    });
    handleChange(newItem);
  };

  const handleChange = item => {
    changeConditions(item);
    if (onChange) {
      onChange({ relation: value.relation, conditions: item });
    }
  };

  const handleRelation = val => {
    if (onChange) {
      onChange({ relation: val, conditions });
    }
  };

  const handleAddCondition = () => {
    const newItem = produce(conditions, draft => {
      draft.push(initCondition);
    });
    changeConditions(newItem);
  };

  const handleDeleteCondition = index => {
    const newItem = produce(conditions, draft => {
      draft.splice(index, 1);
    });
    changeConditions(newItem);
  };

  return (
    <div>
      <Form.Item label="条件关系">
        <Select onChange={handleRelation} value={value.relation}>
          <Select.Option value="&">且</Select.Option>
          <Select.Option value="||">或</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="条件">
        <div>
          {conditions.map((item: ICondition, index) => {
            const { key, rule } = item;
            const optionRule =
              key && fields[key] ? rules.find(({ types }) => types.includes(fields[key].type)) : [];
            return (
              <div className="conditionItem" key={`${item.key}${index}`}>
                <Select value={key} onChange={val => changeModel(val, item)} placeholder="字段">
                  {map(fields, (value, key) => {
                    return <Select.Option key={key}>{value.name}</Select.Option>;
                  })}
                </Select>
                <Select
                  value={rule}
                  onChange={val => changeRuleOrValue(val, item)}
                  placeholder="规则"
                >
                  {map(optionRule.options, (value, key) => {
                    return <Select.Option key={key}>{value}</Select.Option>;
                  })}
                </Select>
                {getValueComponent(item)}
                <Button
                  type="link"
                  onClick={index => {
                    handleDeleteCondition(index);
                  }}
                >
                  删除
                </Button>
              </div>
            );
          })}
          <Button onClick={handleAddCondition} className="add-condition">
            新增条件
          </Button>
        </div>
      </Form.Item>
    </div>
  );
};

export default Condition;
