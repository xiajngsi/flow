export var LayoutType;

(function (LayoutType) {
  LayoutType["vertical"] = "vertical";
  LayoutType["horizontal"] = "horizontal";
})(LayoutType || (LayoutType = {}));

export var IType;

(function (IType) {
  IType["start"] = "start";
  IType["route"] = "route";
  IType["notifier"] = "notifier";
  IType["approver"] = "approver";
  IType["condition"] = "condition";
  IType["end"] = "end";
})(IType || (IType = {}));

export var IRelation;

(function (IRelation) {
  IRelation["and"] = "$";
  IRelation["or"] = "||";
})(IRelation || (IRelation = {}));

export var IRule;

(function (IRule) {
  IRule["contain"] = "contain";
  IRule["notContain"] = "notContain";
  IRule["false"] = "false";
  IRule["true"] = "true";
})(IRule || (IRule = {}));

export var IsupportFieldTypes;

(function (IsupportFieldTypes) {
  IsupportFieldTypes["Identifier"] = "Identifier";
  IsupportFieldTypes["Text"] = "Text";
  IsupportFieldTypes["MultiText"] = "MultiText";
  IsupportFieldTypes["RichText"] = "RichText";
  IsupportFieldTypes["Date"] = "Date";
  IsupportFieldTypes["Number"] = "Number";
  IsupportFieldTypes["Boolean"] = "Boolean";
  IsupportFieldTypes["Enum"] = "Enum";
  IsupportFieldTypes["Dictionary"] = "Dictionary";
})(IsupportFieldTypes || (IsupportFieldTypes = {}));