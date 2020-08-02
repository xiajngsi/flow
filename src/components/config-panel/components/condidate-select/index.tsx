import React from 'react';
import { Row, Col, Modal, Card, Radio, message } from 'antd';
// import request from 'utils/request';
import EditComponent from './components/edit-component';
import { Context } from '../../../../context';

// const mock = [{ flowCandidateType: { id: '1', value: '用户' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '2', value: '员工' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '3', value: '部门' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '4', value: '岗位' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '5', value: '角色' }, candidateValueDefinitions: ['VALUE', 'PARAM', 'DUBBO'], candidateFunction: null }, { flowCandidateType: { id: '6', value: '部门-岗位' }, candidateValueDefinitions: ['FUNCTION'], candidateFunction: { type: 1, callPath: 'io.terminus.flow.app.service.FlowTaskLogReadService.callMethod', paramList: [{ paramClass: 'java.lang.String', type: 2, paramName: '门店部门', candidateValues: null, candidateParam: null }, { paramClass: 'java.lang.String', type: 1, paramName: '岗位', candidateValues: null, candidateParam: null }] } }, { flowCandidateType: { id: '7', value: '岗位-角色' }, candidateValueDefinitions: ['FUNCTION'], candidateFunction: { type: 1, callPath: 'io.terminus.flow.app.service.FlowTaskLogReadService.callMethod', paramList: [{ paramClass: 'java.lang.String', type: 2, paramName: '岗位', candidateValues: null, candidateParam: null }, { paramClass: 'java.lang.String', type: 1, paramName: '角色', candidateValues: null, candidateParam: null }] } }];
export default class Auth extends React.Component {
  static resolveNode(node, item) {
    return item.defaultValue;
  }
  static contextType = Context;

  state = {
    candidateType: false, // 执行人类别
    candidateValueType: '', // 执行人规则值类别
    candidateValueSelectType: '', // 执行人选值交互类型， 1: 模糊搜索， 2: 树形结构
    candidateValue: '', // 执行人规则值
    valueSequence: [], // 执行人规则数据顺序
  };

  // 获取候选项结构
  componentDidMount() {
    this.initValue(this.context.candidateStructure);
  }

  // 初始化
  initValue = structure => {
    const { defaultValue } = this.props;
    if (defaultValue && defaultValue[0]) {
      const value = defaultValue[0];
      const candidateType = value.candidateType.toString();
      const { candidateValueType, candidateValue } = this.switchValueType(value);
      const curStructure = structure.find(s => s.flowCandidateType.id === candidateType);
      const candidateValueSelectType = curStructure.dataType;
      const { valueSequence } = curStructure.candidateValueDefinitions.find(
        d => d.candidateValueEnum === candidateValueType,
      );

      this.setState({
        candidateType,
        candidateValueType,
        candidateValueSelectType,
        candidateValue,
        valueSequence,
      });
    }
  };
  // 初始化回填时，根据值返回赋值类型
  switchValueType = value => {
    if (value.candidateParam) {
      return {
        candidateValueType: 'PARAM',
        candidateValue: value.candidateParam,
      };
    }
    if (value.candidateValues) {
      return {
        candidateValueType: 'VALUE',
        candidateValue: value.candidateValues,
      };
    }
    if (value.candidateFunction) {
      return {
        candidateValueType: 'FUNCTION',
        candidateValue: value.candidateFunction,
      };
    }
    if (value.candidateDubbo) {
      return {
        candidateValueType: 'DUBBO',
        candidateValue: value.candidateDubbo,
      };
    }

    return {};
  };
  // 切换执行人类别
  changeCandidateType = ({ target: { value } }) => {
    const { form } = this.props;
    const structure = this.context.candidateStructure.find(cs => cs.flowCandidateType.id === value);
    if (form && structure.candidateValueDefinitions[0].candidateValueEnum === 'VALUE') {
      // 选值有两种情况，树形结构和模糊搜索，值的结构不同，需要清空值
      form.setFieldsValue({ candidateValues: [] });
    }
    this.setState({
      candidateType: value,
      candidateValueType: structure.candidateValueDefinitions[0].candidateValueEnum,
      valueSequence: structure.candidateValueDefinitions[0].valueSequence,
      candidateValueSelectType: structure.dataType,
      candidateValue: '',
    });
  };
  // 执行人规则值映射
  candidateValueTypeMap = {
    VALUE: '选值',
    PARAM: '变量',
    DUBBO: 'Dubbo服务',
    FUNCTION: 'Function',
  };
  // 切换值类型
  changeValueType = ({ target: { option, value } }) => {
    this.setState({
      valueSequence: option.valueSequence,
      candidateValueType: value,
      candidateValue: '',
    });
  };
  // 保存结果
  save = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const query = this.makeupQuery(values);
        this.props.updateFlowNodeList(this.props.curNode.id, 'taskCandidates', query);
        message.success('执行人信息保存成功');
      }
    });
  };
  // 执行人结果
  makeupQuery = values => {
    const { candidateValueType } = this.state;
    const query = { candidateType: this.state.candidateType };
    // 参数和Dubbo表达式简单赋值
    if (candidateValueType === 'PARAM' || candidateValueType === 'DUBBO') {
      Object.assign(query, values);
    }
    // 选值形式需要将值转为对象
    if (candidateValueType === 'VALUE') {
      const candidateValues = {};
      values.candidateValues.forEach(v => {
        candidateValues[v.value || v.key] = v.label;
      });
      Object.assign(query, { candidateValues });
    }
    // Function形式需要按照对应结构返回
    if (candidateValueType === 'FUNCTION') {
      Object.assign(query, { candidateFunction: this.makeupFunctionQuery(values) });
    }
    return [query];
  };

  // function类型
  makeupFunctionQuery = values => {
    const { candidateType } = this.state;
    const { candidateFunction } = this.context.candidateStructure.find(
      cs => cs.flowCandidateType.id === candidateType,
    );

    const query = Object.assign({}, candidateFunction);
    // 函数类型可能会有多个参数，暂时只能以函数名称做为key来标识
    query.paramList.forEach(param => {
      if (param.type === 1) {
        param.candidateValues = param.candidateValues || {};
        values.candidateValues[param.paramName] &&
          values.candidateValues[param.paramName].forEach(v => {
            param.candidateValues[v.key || v.value] = v.label;
          });
      } else {
        param.candidateParam = values.candidateParam[param.paramName];
      }
    });

    return query;
  };

  render() {
    const {
      candidateType,
      candidateValueType,
      candidateValue,
      valueSequence,
      candidateValueSelectType,
    } = this.state;
    const { candidateStructure } = this.context;

    // function类型结构数据
    const functionStructure =
      candidateValueType === 'FUNCTION'
        ? candidateStructure.find(cs => cs.flowCandidateType.id === candidateType).candidateFunction
        : {};
    return (
      <Row gutter={16}>
        <Col span={6}>
          <Card title="执行人类别" style={{ marginBottom: 8 }}>
            <Radio.Group value={candidateType} onChange={this.changeCandidateType}>
              {candidateStructure.map(cs => (
                <Radio
                  style={{ paddingBottom: '10px' }}
                  key={cs.flowCandidateType.id}
                  value={cs.flowCandidateType.id}
                >
                  {cs.flowCandidateType.value}
                </Radio>
              ))}
            </Radio.Group>
          </Card>
          <Card title="赋值方式">
            {candidateType ? (
              <Radio.Group value={candidateValueType} onChange={this.changeValueType}>
                {candidateStructure
                  .find(cs => cs.flowCandidateType.id === candidateType)
                  .candidateValueDefinitions.map(enums => (
                    <Radio
                      key={enums.candidateValueEnum}
                      value={enums.candidateValueEnum}
                      option={enums}
                    >
                      {this.candidateValueTypeMap[enums.candidateValueEnum]}
                    </Radio>
                  ))}
              </Radio.Group>
            ) : (
              <p>请选择执行人类别</p>
            )}
          </Card>
        </Col>
        <Col span={18}>
          <Card title="执行人">
            {candidateValueType ? (
              <div style={{ maxHeight: 350, overflow: 'auto' }}>
                <EditComponent
                  valueSequence={valueSequence}
                  type={candidateValueType}
                  candidateType={candidateType}
                  valueType={candidateValueSelectType}
                  value={candidateValue}
                  functionStructure={functionStructure}
                  form={this.props.form}
                />
              </div>
            ) : (
              <p>请选择执行人类别</p>
            )}
          </Card>
        </Col>
      </Row>
    );
  }
}
