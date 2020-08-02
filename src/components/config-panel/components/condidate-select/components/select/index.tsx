import React from 'react';
import { Select, Form } from 'antd';
import queryString from 'query-string';
import { Context } from '../../../../../../context';

export default class CandidateSelect extends React.Component<any, any> {
  state = { searchData: [] };
  static contextType = Context;

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

  // 获取组织架构数据
  getData = (data = { hasChildren: true }, keyWord) => {
    // console.log(data);
    const sequence = this.props.valueSequence || [];
    const originType = data.type || sequence[0];
    const currentIndex = sequence.findIndex(value => value === originType);
    if (data.hasChildren === false && sequence.length > currentIndex + 1) {
      const type = sequence[currentIndex + 1];
      const query = queryString.stringify({
        type,
        parentId: data.value,
        keyWord,
      });

      return this.context.getCandidates(query);
    }

    if (data.hasChildren) {
      const query = queryString.stringify({
        type: sequence[0],
        parentId: data.value,
        keyWord,
      });
      return this.context.getCandidates(query);
    }

    return new Promise(resolve => resolve());
  };

  // 模糊搜索
  searchData = value => {
    this.getData(undefined, value).then(result => {
      this.setState({ searchData: result || [] });
    });
  };

  // 渲染模糊搜索组件
  render() {
    const { itemId } = this.props;
    console.log('xxx this.context ', this.context);
    return (
      <Form.Item wrapperCol={{ span: 24 }}>
        {this.props.form.getFieldDecorator(
          itemId ? `candidateValues[${itemId}]` : 'candidateValues',
          { initialValue: this.props.value },
        )(
          <Select
            mode="multiple"
            labelInValue
            placeholder="请输入候选项"
            notFoundContent="请输入候选项"
            filterOption={false}
            onSearch={this.searchData}
            style={{ width: '100%' }}
          >
            {this.state.searchData.map(s => (
              <Select.Option key={s.value} value={s.value}>
                {s.title}
              </Select.Option>
            ))}
          </Select>,
        ) // eslint-disable-line
        }
      </Form.Item>
    );
  }
}
