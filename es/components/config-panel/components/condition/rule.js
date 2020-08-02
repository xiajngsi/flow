var _options, _options2;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { IRule } from '../../../../interface'; // 用在条件配置的选择中， el 表达式的组成和解析都用到了，如果有修改要去确保 transfer 的 splitConditionExpression, genConditionExpression 做对应的处理

export var rules = [{
  types: ['Text', 'MultiText', 'RichText', 'Identifier'],
  options: (_options = {
    '=': '等于'
  }, _defineProperty(_options, IRule.contain, '包含'), _defineProperty(_options, IRule.notContain, '不包含'), _options)
}, {
  types: ['Date'],
  options: {
    '<': '早于',
    '>': '晚于'
  }
}, {
  types: ['Number'],
  options: {
    '=': '等于',
    '>': '大于',
    '>=': '大于等于',
    '<': '小于',
    '<=': '小于等于'
  }
}, {
  types: ['Boolean'],
  options: (_options2 = {}, _defineProperty(_options2, IRule.true, '是'), _defineProperty(_options2, IRule.false, '否'), _options2)
}, {
  types: ['Enum', 'MultiEnum'],
  options: _defineProperty({
    '=': '等于'
  }, IRule.contain, '包含')
}];