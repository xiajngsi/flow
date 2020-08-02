import "antd/es/form/style/css";
import _Form from "antd/es/form";
import "antd/es/select/style/css";
import _Select from "antd/es/select";
import React, { useContext } from 'react';
import { Context } from '../../../../context';
import produce from 'immer';
import { typeName } from '../../../../constants';
import CondidateSelect from '../condidate-select';

var getCondidateFormConfig = function getCondidateFormConfig(type) {
  return {
    candidateType: "".concat(typeName[type], "\u7C7B\u578B"),
    candidateValues: "".concat(typeName),
    multiTaskType: '多人审批方式'
  };
};

var CondidateForm = function CondidateForm(props) {
  var context = useContext(Context);
  var item = context.configPanel.item,
      configValue = context.configValue;
  var getFieldDecorator = props.form.getFieldDecorator;

  var handleTypeAndValuesChange = function handleTypeAndValuesChange(key, value) {
    var newValue = produce(context.configValue, function (draft) {
      draft[item.nodeId].taskCandidate[key] = value;
    });
    context.changeConfigValue({
      configValue: newValue
    });
  };

  var currConfig = configValue[item.nodeId];
  var condidateFormConfig = getCondidateFormConfig(item.type);
  var taskCondidate = currConfig.taskCondidate,
      multiTaskType = currConfig.multiTaskType; // TODO: 拿到选择人数据结构确定

  var condidateTypeOption = []; // TODO: 拿到选择人数据结构根据 conditateType 确定

  var candidateValuesOption = [];

  var handleTaskTypeChange = function handleTaskTypeChange(key, val) {
    var newValue = produce(context.configValue, function (draft) {
      draft[item.nodeId][key] = val;
    });
    context.changeConfigValue({
      configValue: newValue
    });
  };

  return React.createElement(_Form, {
    layout: "vertical",
    hideRequiredMark: true
  }, React.createElement(CondidateSelect, {
    form: props.form
  }), React.createElement(_Form.Item, {
    label: condidateFormConfig.multiTaskType
  }, getFieldDecorator('multiTaskType', {
    rules: [{
      required: true,
      message: "\u8BF7\u586B\u5199".concat(condidateFormConfig.multiTaskType)
    }],
    initialValue: multiTaskType
  })(React.createElement(_Select, {
    onChange: function onChange(val) {
      return handleTaskTypeChange('multiTaskType', val);
    }
  }, context.taskTypes.map(function (_ref, index) {
    var name = _ref.name,
        value = _ref.value;
    return React.createElement(_Select.Option, {
      value: value,
      key: index.toString()
    }, name);
  })))));
};

export default _Form.create()(CondidateForm);