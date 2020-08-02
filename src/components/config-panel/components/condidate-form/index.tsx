import React, { useContext } from 'react';
import { Form, Select } from 'antd';
import { map } from 'lodash';
import { Context } from '../../../../context';
import produce from 'immer';
import { typeName } from '../../../../constants';
import { IType } from '../../../../interface';
import CondidateSelect from '../condidate-select';

const getCondidateFormConfig = (type: IType) => {
  return {
    candidateType: `${typeName[type]}类型`,
    candidateValues: `${typeName}`,
    multiTaskType: '多人审批方式',
  };
};

const CondidateForm = props => {
  const context = useContext(Context);

  const {
    configPanel: { item },
    configValue,
  } = context;
  const {
    form: { getFieldDecorator },
  } = props;

  const handleTypeAndValuesChange = (key, value) => {
    const newValue = produce(context.configValue, draft => {
      draft[item.nodeId].taskCandidate[key] = value;
    });
    context.changeConfigValue({ configValue: newValue });
  };
  const currConfig = configValue[item.nodeId];
  const condidateFormConfig = getCondidateFormConfig(item.type);
  const { taskCondidate, multiTaskType } = currConfig;

  // TODO: 拿到选择人数据结构确定
  const condidateTypeOption = [];
  // TODO: 拿到选择人数据结构根据 conditateType 确定
  const candidateValuesOption = [];

  const handleTaskTypeChange = (key, val) => {
    const newValue = produce(context.configValue, draft => {
      draft[item.nodeId][key] = val;
    });
    context.changeConfigValue({ configValue: newValue });
  };

  return (
    <Form layout="vertical" hideRequiredMark>
      <CondidateSelect form={props.form} />
      <Form.Item label={condidateFormConfig.multiTaskType}>
        {getFieldDecorator('multiTaskType', {
          rules: [{ required: true, message: `请填写${condidateFormConfig.multiTaskType}` }],
          initialValue: multiTaskType,
        })(
          <Select onChange={val => handleTaskTypeChange('multiTaskType', val)}>
            {context.taskTypes.map(({ name, value }, index) => {
              return (
                <Select.Option value={value} key={index.toString()}>
                  {name}
                </Select.Option>
              );
            })}
          </Select>,
        )}
      </Form.Item>
    </Form>
  );
};

export default Form.create()(CondidateForm);
