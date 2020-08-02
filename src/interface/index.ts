export interface IContainer {
  height?: number /** 默认的高度 */;
  value: IValue;
  primary?: string;
  layoutType?: LayoutType;
  config: any; //配置需要的数据,
  taskTypes: any; // 会签类型
  getCondidates: () => Promise<any>; // 获取成员的数据
  candidateStructure: any; // 执行人规则结构化数据
  onChange: Function;
}

interface IValue {
  value: IFlow; // 流程图结构
  configValue: any; // 配置值
}
export enum LayoutType {
  vertical = 'vertical',
  horizontal = 'horizontal',
}
export interface IFlow {
  name?: string; // 条件分支没有name
  nodeId: string;
  type: IType;
  childNode: INode;
}

export enum IType {
  start = 'start',
  route = 'route',
  notifier = 'notifier',
  approver = 'approver',
  condition = 'condition',
  end = 'end',
}
export interface INode extends IFlow {
  prevId?: string;
  nextId?: string;
  properties?: INodeProperty;
  conditionNodes?: INode[];
  conditionConvergeId?: string; // 条件结束节点对应的条件前的节点
}

export interface INodeProperty {
  actionerRules: any[];
}

export interface IStyleAbout {
  style?: React.CSSProperties;
  className?: string;
}

export interface IProps extends IStyleAbout {
  node: INode;
  onAddItem?: Function;
  onDeleteItem?: Function;
}

export interface ICondition {
  value: string;
  rule: string;
  key: string;
}
export interface IConditionsConfig {
  priority: number;
  affiliation: string;
  conditions: ICondition[];
}

export enum IRelation {
  and = '$',
  or = '||',
}

export enum IRule {
  contain = 'contain',
  notContain = 'notContain',
  'false' = 'false',
  'true' = 'true',
}

export enum IsupportFieldTypes {
  Identifier = 'Identifier',
  Text = 'Text',
  MultiText = 'MultiText',
  RichText = 'RichText',
  Date = 'Date',
  Number = 'Number',
  Boolean = 'Boolean',
  Enum = 'Enum',
  Dictionary = 'Dictionary',
}
