import "antd/es/form/style/css";
import _Form from "antd/es/form";
import "antd/es/select/style/css";
import _Select from "antd/es/select";
import React, { useContext } from 'react';
import { map, pickBy, find } from 'lodash';
import ConditionConfig from '../condition';
import { Context } from '../../../../context';
import produce from 'immer';
import { IsupportFieldTypes, IType } from '../../../../interface';
var conditonFormConfig = {
  priority: '条件优先级',
  affiliation: '条件归属',
  conditionExpression: '条件配置'
};

var ConditionForm = function ConditionForm(props) {
  var context = useContext(Context);
  var config = context.config,
      item = context.configPanel.item,
      configValue = context.configValue;
  var getFieldDecorator = props.form.getFieldDecorator;

  var handlePriorityOrAffiliationChange = function handlePriorityOrAffiliationChange(key, value) {
    var newValue = produce(context.configValue, function (draft) {
      if (key === 'priority') {
        var currPriorityCondition = find(draft, function (_ref) {
          var type = _ref.type,
              priority = _ref.priority;
          return type === IType.condition && priority.toString() === value.toString();
        });
        var lastValue = draft[item.nodeId][key];
        draft[currPriorityCondition.nodeId][key] = lastValue;
      }

      draft[item.nodeId][key] = value;
    });
    context.changeConfigValue({
      configValue: newValue
    });
  };

  var getCurrConditionBrother = new Array(getBrotherConditons(context.value, item.prevId)).fill(1);
  var currConfig = configValue[item.nodeId];
  var fields = {};

  if (config[currConfig.affiliation]) {
    fields = pickBy(config[currConfig.affiliation].fields, function (value, key) {
      return Object.keys(IsupportFieldTypes).includes(value.type);
    });
  }

  return React.createElement(_Form, {
    layout: "vertical",
    hideRequiredMark: true
  }, React.createElement(_Form.Item, {
    label: conditonFormConfig.priority
  }, getFieldDecorator('priority', {
    rules: [{
      required: true,
      message: "\u8BF7\u586B\u5199".concat(conditonFormConfig.priority)
    }],
    initialValue: currConfig.priority !== undefined ? "".concat(currConfig.priority) : '1'
  })(React.createElement(_Select, {
    onChange: function onChange(val) {
      return handlePriorityOrAffiliationChange('priority', val);
    }
  }, getCurrConditionBrother.map(function (any, index) {
    return React.createElement(_Select.Option, {
      key: index + 1
    }, "\u4F18\u5148\u7EA7".concat(index + 1));
  })))), React.createElement(_Form.Item, {
    label: conditonFormConfig.affiliation
  }, getFieldDecorator('affiliation', {
    rules: [{
      required: true,
      message: "\u8BF7\u586B\u5199".concat(conditonFormConfig.affiliation)
    }],
    initialValue: currConfig.affiliation
  })(React.createElement(_Select, {
    onChange: function onChange(val) {
      return handlePriorityOrAffiliationChange('affiliation', val);
    }
  }, map(config, function (value, key) {
    return React.createElement(_Select.Option, {
      key: key
    }, value.name);
  })))), getFieldDecorator('conditionExpression', {
    rules: [{
      required: true,
      message: "\u8BF7\u586B\u5199".concat(conditonFormConfig.conditionExpression)
    }],
    initialValue: currConfig.conditionExpression
  })(React.createElement(ConditionConfig, {
    fields: fields,
    onChange: function onChange(val) {
      return handlePriorityOrAffiliationChange('conditionExpression', val);
    }
  })));
};

export default _Form.create()(ConditionForm);

var getBrotherConditons = function getBrotherConditons(value, targetId) {
  var childLength = 0;

  var traverseProcessor = function traverseProcessor(node, nextNode) {
    if (node.conditionNodes) {
      if (node.nodeId === targetId) {
        childLength = node.conditionNodes.length;
      }

      node.conditionNodes.forEach(function (conditionNode) {
        traverseCondition(conditionNode, node.childNode, nextNode);
      });
    } else {
      if (node.childNode) {
        traverseProcessor(node.childNode, nextNode);
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
  return childLength;
};