import { IRule } from '../../../../interface';
// 用在条件配置的选择中， el 表达式的组成和解析都用到了，如果有修改要去确保 transfer 的 splitConditionExpression, genConditionExpression 做对应的处理
export const rules = [
  {
    types: ['Text', 'MultiText', 'RichText', 'Identifier'],
    options: {
      '=': '等于',
      [IRule.contain]: '包含',
      [IRule.notContain]: '不包含',
    },
  },
  {
    types: ['Date'],
    options: {
      '<': '早于',
      '>': '晚于',
    },
  },
  {
    types: ['Number'],
    options: {
      '=': '等于',
      '>': '大于',
      '>=': '大于等于',
      '<': '小于',
      '<=': '小于等于',
    },
  },
  {
    types: ['Boolean'],
    options: {
      [IRule.true]: '是',
      [IRule.false]: '否',
    },
  },
  {
    types: ['Enum', 'MultiEnum'],
    options: {
      '=': '等于',
      [IRule.contain]: '包含',
    },
  },
];
