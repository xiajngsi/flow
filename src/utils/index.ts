import { uniqueId, get } from 'lodash';
import { BORDER_COLOR, pointType } from '../constants';
import { LayoutType, IType } from '../interface';

export const genUniqueSvgId = () => {
  return uniqueId('svg');
};

export const getUniqueNodeId = (type?: IType) => {
  return `${type ? type : ''}_${new Date()
    .getTime()
    .toString(36)
    .substring(4)}_${Math.random()
    .toString(36)
    .substr(3, 4)}`;
};

export const relativePositionWithSvg = (ele, svg, type: pointType, layoutType: LayoutType) => {
  if (ele && svg) {
    const elePosition = getClientPosition(ele);
    const svgPosition = getClientPosition(svg);
    if (elePosition && svgPosition) {
      if (type == pointType.from) {
        if (layoutType === LayoutType.vertical) {
          return {
            x: elePosition.x - svgPosition.x + ele.offsetWidth / 2,
            y: elePosition.y - svgPosition.y + ele.offsetHeight,
          };
        } else {
          return {
            x: elePosition.x - svgPosition.x + ele.offsetWidth,
            y: elePosition.y - svgPosition.y + ele.offsetHeight / 2,
          };
        }
      }
      if (layoutType === LayoutType.vertical) {
        return {
          x: elePosition.x - svgPosition.x + ele.offsetWidth / 2,
          y: elePosition.y - svgPosition.y,
        };
      } else {
        return {
          x: elePosition.x - svgPosition.x,
          y: elePosition.y - svgPosition.y + ele.offsetWidth / 2,
        };
      }
    }
  }
  return {
    x: 0,
    y: 0,
  };
};

export const getClientPosition = ref => {
  let bounding = null;
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
      height: bounding.height,
    };
  } else {
    return bounding;
  }
};

export const getSvgAttr = () => {
  return {
    stroke: BORDER_COLOR,
    fill: 'transparent',
    strokeWidth: 1,
  };
};

export const getFillSvgAttr = () => {
  return {
    stroke: BORDER_COLOR,
    fill: BORDER_COLOR,
    strokeWidth: 1,
  };
};

export const contains = (root, n) => {
  let node = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

export const getControlPoint = (from, to, layoutType: LayoutType) => {
  if (layoutType === LayoutType.vertical) {
    const yDistance = Math.abs(from.y - to.y) / 2;
    return [from, { x: from.x, y: to.y - yDistance }, { x: to.x, y: from.y + yDistance }, to];
  }
  const xDistance = Math.abs(from.x - to.x) / 2;
  return [from, { x: to.x - xDistance, y: from.y }, { x: from.x + xDistance, y: to.y }, to];
};

export const getBesselLinePoint = (besselFourPoint, t?: number) => {
  // 如果t取值不在0到1之间，则终止操作
  const { x: x1, y: y1 } = besselFourPoint[0];
  const { x: x2, y: y2 } = besselFourPoint[3];
  const { x: cx1, y: cy1 } = besselFourPoint[1];
  const { x: cx2, y: cy2 } = besselFourPoint[2];
  let x =
    x1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cx1 * t * (1 - t) * (1 - t) +
    3 * cx2 * t * t * (1 - t) +
    x2 * t * t * t;
  let y =
    y1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cy1 * t * (1 - t) * (1 - t) +
    3 * cy2 * t * t * (1 - t) +
    y2 * t * t * t;
  return [x, y];
};

export const getFieldsFromConfig = (config: any, affiliation: string) => {
  return get(config, [affiliation]);
};
