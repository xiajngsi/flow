import React from 'react';
import { Input, Form } from 'antd';
import CandidateTreeSelect from '../tree-select';
import CandidateSelect from '../select';

class EditComponent extends React.Component<any, any> {
  // 渲染树
  renderSelectTree = (otherProps = {}) => (
    <CandidateTreeSelect
      key={this.props.candidateType}
      {...this.props}
      {...otherProps}
      initialValue={otherProps.initialValue || this.resolveValueType(this.props.value)}
    />
  );

  // 渲染模糊搜索组件
  renderSearchSelect = (otherProps = {}) => (
    <CandidateSelect
      key={this.props.candidateType}
      {...this.props}
      {...otherProps}
      value={otherProps.initialValue || this.resolveValueType(this.props.value)}
    />
  );

  // Function类型组件 type: 1:树选择，2: 变量
  renderFunctionComponent = () => {
    const {
      functionStructure: { paramList },
    } = this.props;
    return paramList.map((p, index) => (
      <div key={p.paramName} style={{ marginBottom: 8 }}>
        <h4>{p.paramName}</h4>
        {p.type === 1 ? (
          this.renderSelectItem(p, index)
        ) : (
          <Form.Item key={p.paramName} wrapperCol={{ span: 24 }}>
            {this.props.form.getFieldDecorator(`candidateParam[${p.paramName}]`, {
              initialValue: this.props.value
                ? this.props.value.paramList[index].candidateParam
                : '',
            })(
              // eslint-disable-line
              <Input placeholder={`请输入${p.paramName}`} />,
            )}
          </Form.Item>
        )}
      </div>
    ));
  };
  // 类型为Function时，根据不同类型渲染模糊搜索或者树状选择。dataType: 1.模糊搜索 2.树状选择
  renderSelectItem = (param, index) =>
    param.dataType === '1'
      ? this.renderSearchSelect({
          key: param.paramName,
          valueSequence: param.valueSequence,
          type: param.type,
          initialValue: this.props.value
            ? this.props.value.paramList[index].candidateValues
            : undefined,
          itemId: param.paramName,
        })
      : this.renderSelectTree({
          key: param.paramName,
          valueSequence: param.valueSequence,
          type: param.type,
          initialValue: this.resolveValueType(
            this.props.value ? this.props.value.paramList[index].candidateValues : undefined,
          ),
          itemId: param.paramName,
        });

  // 解析values类型值
  resolveValueType = value => {
    const initialValue = [];
    if (Object.prototype.toString.call(value) === '[object Object]') {
      Object.keys(value).forEach(key => {
        initialValue.push({
          label: value[key],
          value: key,
          key,
        });
      });
    }

    return initialValue;
  };

  // 根据类型渲染不同组件
  switchComponent = () => {
    switch (this.props.type) {
      case 'VALUE':
        return this.props.valueType === '1' ? this.renderSearchSelect() : this.renderSelectTree();
      case 'PARAM':
        return (
          <Form.Item wrapperCol={{ span: 24 }}>
            {this.props.form.getFieldDecorator('candidateParam', {
              initialValue: this.props.value,
            })(<Input placeholder="请输入变量" />)}
          </Form.Item>
        );
      case 'DUBBO':
        return (
          <Form.Item wrapperCol={{ span: 24 }}>
            {this.props.form.getFieldDecorator('candidateDubbo', {
              initialValue: this.props.value,
            })(<Input placeholder="请输入Dubbo服务表达式" />)}
          </Form.Item>
        );
      case 'FUNCTION':
        return this.renderFunctionComponent();
      default:
        return null;
    }
  };

  render() {
    return this.switchComponent();
  }
}

export default EditComponent;
