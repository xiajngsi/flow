function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React from 'react';
import classnames from 'classnames';
import './index.less';
import { contains } from '../../utils';
import { IType } from '../../interface';
// TODO: 改成可配置的选项
var type = ['approver', 'notifier', 'route'];
var SelectType = React.forwardRef(function (_ref, ref) {
  var onAddItem = _ref.onAddItem;

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      visible = _React$useState2[0],
      changeVisible = _React$useState2[1];

  var _React$useState3 = React.useState({
    top: 0,
    left: 0,
    from: {},
    to: {}
  }),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      position = _React$useState4[0],
      changePosition = _React$useState4[1];

  var selectTypeRef = React.useRef();
  React.useImperativeHandle(ref, function () {
    return {
      show: function show(p) {
        changePosition(p);
        changeVisible(true);
      },
      hide: function hide() {
        changeVisible(false);
      }
    };
  });

  var handleClickHide = function handleClickHide(e) {
    if (!contains(selectTypeRef.current, e.target)) {
      changeVisible(false);
    }
  };

  React.useEffect(function () {
    document.addEventListener('mousedown', handleClickHide);
    return function () {
      document.removeEventListener('mousedown', handleClickHide);
    };
  }, []);
  var className = classnames('select-type', {
    hide: !visible
  });

  var handleClick = function handleClick(string) {
    if (onAddItem) {
      onAddItem(_objectSpread({}, position, {
        type: string
      }));
    }
  };

  return React.createElement("div", {
    className: className,
    style: {
      top: position.top,
      left: position.left
    },
    ref: selectTypeRef
  }, React.createElement("div", {
    className: "arrow"
  }), React.createElement("div", {
    className: "content"
  }, React.createElement("div", {
    className: "header"
  }), React.createElement("div", {
    className: "types"
  }, type.map(function (string) {
    if (string === IType.route && position.to && position.to.type === IType.route) {
      return null;
    }

    return React.createElement("div", {
      key: string,
      onClick: function onClick() {
        return handleClick(string);
      }
    }, string);
  }))));
});
export default SelectType;