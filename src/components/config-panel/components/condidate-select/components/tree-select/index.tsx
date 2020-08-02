import React from 'react';
import { TreeSelect, Form } from 'antd';
import queryString from 'query-string';
import { Context } from '../../../../../../context';

export default class CandidateTreeSelect extends React.Component<any, any> {
  state = { treeData: [] };
  static contextType = Context;

  componentDidMount() {
    this.getData().then(result => {
      this.setState({ treeData: result || [] });
    });
  }

  componentDidUpdate(nextProps) {
    if (nextProps.candidateType !== this.props.candidateType) {
      this.getData().then(result => {
        this.setState({ treeData: result || [] });
      });
    }
  }

  // 获取组织架构数据
  getData = (data?: any = { hasChildren: true }, keyWord?: string) => {
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

  // 获取下级节点
  loadTreeData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      const { value, hasChildren = true, type } = treeNode.props.dataRef;

      this.getData({ value, hasChildren, type }).then(result => {
        treeNode.props.dataRef.children = result || [];
        this.setState({ treeData: [...this.state.treeData] });
        resolve();
      });
    });

  // 选择执行人
  checkTree = (value, o) => {
    console.log('check: ', value, o);
  };

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

  // 渲染树形结构节点
  renderTreeNodes = data =>
    data.map(node => {
      if (node.children) {
        return (
          <TreeSelect.TreeNode
            title={node.title}
            key={node.value + this.props.candidateType}
            value={node.value}
            dataRef={node}
          >
            {this.renderTreeNodes(node.children)}
          </TreeSelect.TreeNode>
        );
      }

      return (
        <TreeSelect.TreeNode
          title={node.title}
          key={node.value + this.props.candidateType}
          value={node.value}
          dataRef={node}
        />
      );
    });

  // 渲染树
  render() {
    // const initialValue = this.resolveValueType(this.props.value);
    const { itemId } = this.props;

    return (
      <Form.Item wrapperCol={{ span: 24 }}>
        {this.props.form.getFieldDecorator(
          itemId ? `candidateValues[${itemId}]` : 'candidateValues',
          { initialValue: this.props.initialValue },
        )(
          // eslint-disable-line
          <TreeSelect
            labelInValue
            treeCheckable
            treeCheckStrictly
            treeNodeFilterProp="key"
            loadData={this.loadTreeData}
            dropdownStyle={{ height: 400 }}
            placeholder="请选择执行人"
          >
            {this.renderTreeNodes(this.state.treeData)}
          </TreeSelect>,
        )}
      </Form.Item>
    );
  }
}
