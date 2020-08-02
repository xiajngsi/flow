import { uniqueId, get } from 'lodash';
import { BORDER_COLOR, pointType } from '../constants';
import { LayoutType } from '../interface';
export var genUniqueSvgId = function genUniqueSvgId() {
  return uniqueId('svg');
};
export var getUniqueNodeId = function getUniqueNodeId(type) {
  return "".concat(type ? type : '', "_").concat(new Date().getTime().toString(36).substring(4), "_").concat(Math.random().toString(36).substr(3, 4));
};
export var relativePositionWithSvg = function relativePositionWithSvg(ele, svg, type, layoutType) {
  if (ele && svg) {
    var elePosition = getClientPosition(ele);
    var svgPosition = getClientPosition(svg);

    if (elePosition && svgPosition) {
      if (type == pointType.from) {
        if (layoutType === LayoutType.vertical) {
          return {
            x: elePosition.x - svgPosition.x + ele.offsetWidth / 2,
            y: elePosition.y - svgPosition.y + ele.offsetHeight
          };
        } else {
          return {
            x: elePosition.x - svgPosition.x + ele.offsetWidth,
            y: elePosition.y - svgPosition.y + ele.offsetHeight / 2
          };
        }
      }

      if (layoutType === LayoutType.vertical) {
        return {
          x: elePosition.x - svgPosition.x + ele.offsetWidth / 2,
          y: elePosition.y - svgPosition.y
        };
      } else {
        return {
          x: elePosition.x - svgPosition.x,
          y: elePosition.y - svgPosition.y + ele.offsetWidth / 2
        };
      }
    }
  }

  return {
    x: 0,
    y: 0
  };
};
export var getClientPosition = function getClientPosition(ref) {
  var bounding = null;

  if (ref.current) {
    bounding = ref.current.getBoundingClientRect();
  } else if (ref) {
    bounding = ref.getBoundingClientRect();
  }

  if (bounding) {
    return {
      x: bounding.left,
      y: bounding.top,
      width: bounding.width,
      height: bounding.height
    };
  } else {
    return bounding;
  }
};
export var getSvgAttr = function getSvgAttr() {
  return {
    stroke: BORDER_COLOR,
    fill: 'transparent',
    strokeWidth: 1
  };
};
export var getFillSvgAttr = function getFillSvgAttr() {
  return {
    stroke: BORDER_COLOR,
    fill: BORDER_COLOR,
    strokeWidth: 1
  };
};
export var contains = function contains(root, n) {
  var node = n;

  while (node) {
    if (node === root) {
      return true;
    }

    node = node.parentNode;
  }

  return false;
};
export var getControlPoint = function getControlPoint(from, to, layoutType) {
  if (layoutType === LayoutType.vertical) {
    var yDistance = Math.abs(from.y - to.y) / 2;
    return [from, {
      x: from.x,
      y: to.y - yDistance
    }, {
      x: to.x,
      y: from.y + yDistance
    }, to];
  }

  var xDistance = Math.abs(from.x - to.x) / 2;
  return [from, {
    x: to.x - xDistance,
    y: from.y
  }, {
    x: from.x + xDistance,
    y: to.y
  }, to];
};
export var getBesselLinePoint = function getBesselLinePoint(besselFourPoint, t) {
  // 如果t取值不在0到1之间，则终止操作
  var _besselFourPoint$ = besselFourPoint[0],
      x1 = _besselFourPoint$.x,
      y1 = _besselFourPoint$.y;
  var _besselFourPoint$2 = besselFourPoint[3],
      x2 = _besselFourPoint$2.x,
      y2 = _besselFourPoint$2.y;
  var _besselFourPoint$3 = besselFourPoint[1],
      cx1 = _besselFourPoint$3.x,
      cy1 = _besselFourPoint$3.y;
  var _besselFourPoint$4 = besselFourPoint[2],
      cx2 = _besselFourPoint$4.x,
      cy2 = _besselFourPoint$4.y;
  var x = x1 * (1 - t) * (1 - t) * (1 - t) + 3 * cx1 * t * (1 - t) * (1 - t) + 3 * cx2 * t * t * (1 - t) + x2 * t * t * t;
  var y = y1 * (1 - t) * (1 - t) * (1 - t) + 3 * cy1 * t * (1 - t) * (1 - t) + 3 * cy2 * t * t * (1 - t) + y2 * t * t * t;
  return [x, y];
};
export var getFieldsFromConfig = function getFieldsFromConfig(config, affiliation) {
  return get(config, [affiliation]);
};