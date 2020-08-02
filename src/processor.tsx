import React from 'react';
import { IContainer, INode, IType, LayoutType } from './interface';
import {
  defaultHeight,
  arrowYDistance,
  sDistance,
  pointType,
  addBtnRadius,
  domLayoutInfo,
} from './constants';
import './index.less';
import { End } from './processors';
import { Context } from './context';
import classnames from 'classnames';
import {
  genUniqueSvgId,
  relativePositionWithSvg,
  getSvgAttr,
  getFillSvgAttr,
  getClientPosition,
  getControlPoint,
  getBesselLinePoint,
} from './utils';
import snap from 'snapsvg-cjs';
import Node from './components/node';
import SelectType from './components/select-type';
import ConfigPanel from './components/config-panel';
import Toolbar from './components/toolbar';
import { throttle } from 'lodash';

// TODO: 数据变动或者界面 resize 重新计算 dom 和 svg 的宽高
const svgAttr = getSvgAttr();

// TODO: 改变布局后要重新计算各种元素的位置，改成统一在一个地方计算
interface IProps extends IContainer {}
class Flow extends React.PureComponent<IProps, any> {
  static contextType: any = Context;
  svgId = genUniqueSvgId();
  svg = null;
  lines = [];
  svgDomRef = null;
  endDomRef = null;
  selectTypeRef: any = React.createRef();
  nodeWrap: any = React.createRef();
  state = {
    nodeWrapInfo: {},
  };

  componentDidMount() {
    this.svg = snap(`#${this.svgId}`);
    this.calculateLine();
    this.calculateSvgRect();
    document.addEventListener('resize', this.calculateSvgRect);
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.calculateSvgRect);
  }

  calculateSvgRect = throttle(() => {
    const containerPosition = getClientPosition(this.nodeWrap);
    const endPosition = getClientPosition(this.endDomRef);
    this.setState({
      nodeWrapInfo: { width: containerPosition.width, height: endPosition.y - containerPosition.y },
    });
  }, 200);

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // context.value 改变后，dom 的高度会变化，这时候重新设置 svg 的宽高
    const {
      nodeWrapInfo: { width, height },
    } = prevState;
    const containerPosition = getClientPosition(this.nodeWrap);
    const endPosition = getClientPosition(this.endDomRef);
    const currHeight = endPosition.y - containerPosition.y;
    if (currHeight !== height || containerPosition.width !== width) {
      return { width: containerPosition.width, height: currHeight };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.calculateLine();
    if (snapshot) {
      this.setState({
        nodeWrapInfo: snapshot,
      });
    }
    return null;
  }

  calculateLine = () => {
    if (!this.svg) {
      this.svg = snap(`#${this.svgId}`);
    }
    const { layoutType } = this.context;
    this.svg.paper.clear();
    this.context.lineInfo.forEach(({ from, to }) => {
      const fromPosition = this.calculeteDomPosition(from, pointType.from);
      const toPosition = this.calculeteDomPosition(to, pointType.to);
      const controlPoint = getControlPoint(fromPosition, toPosition, layoutType);
      this.svg.paper
        .path(
          `M ${fromPosition.x} ${fromPosition.y}C${controlPoint[1].x} ${controlPoint[1].y} ${controlPoint[2].x} ${controlPoint[2].y} ${toPosition.x} ${toPosition.y}`,
        )
        .attr(svgAttr);

      this.renderArrow(toPosition);
      if (to.type !== IType.condition) {
        this.drawPlusBtn({ from, to }, controlPoint);
      }
    });
  };

  drawPlusBtn({ from, to }, controlPoint) {
    const { primary } = this.props;
    let text;
    const [x, y] = getBesselLinePoint(controlPoint, 0.5);
    const btn = this.svg.paper.circle(x, y, addBtnRadius);
    btn.attr({
      stroke: primary,
      fill: primary,
      strokeWidth: 1,
      cursor: 'pointer',
    });
    text = this.svg.paper.text(x - addBtnRadius / 2, y + addBtnRadius / 2 - 1, '+');
    text.attr({
      fill: 'white',
      strokeWidth: 1,
      cursor: 'pointer',
      'font-size': '24px',
    });
    text.click(() => {
      this.selectTypeRef.current.hide();
      this.selectTypeRef.current.show({ top: y + addBtnRadius, left: x, from, to });
    });
  }

  renderArrow(point: any) {
    // 夹角默认为 25度
    const { layoutType } = this.context;
    let xPosition: number | number[] = point.x - sDistance;
    let yPositions: number | number[] = [point.y - arrowYDistance, point.y + arrowYDistance];
    let path = `M${point.x},${point.y} L ${xPosition},${yPositions[0]} L ${xPosition}, ${yPositions[1]} L ${point.x},${point.y}Z`;
    if (layoutType === LayoutType.vertical) {
      yPositions = point.y - sDistance;
      xPosition = [point.x - arrowYDistance, point.x + arrowYDistance];
      path = `M${point.x},${point.y} L ${xPosition[0]} ${yPositions} L ${xPosition[1]} ${yPositions} L ${point.x},${point.y}Z`;
    }

    let arrow: any = this.svg.paper.path(path);
    arrow.attr(getFillSvgAttr());
    return arrow;
  }

  calculeteDomPosition = (node: INode | string, type: pointType) => {
    const { domRefs } = this.context;
    let dom = null;
    if (node === 'end') {
      dom = this.endDomRef;
    } else {
      dom = domRefs[(node as INode).nodeId];
    }
    return relativePositionWithSvg(dom, this.svgDomRef, type, this.context.layoutType);
  };

  handleAddItem = value => {
    const { onAddItem } = this.context;
    if (onAddItem) {
      onAddItem(value);
    }
  };

  render() {
    const { height = defaultHeight } = this.props;
    const { value, layoutType } = this.context;
    const className = classnames('container', { verticle: layoutType });
    return (
      <div>
        <Toolbar />
        <div className={className} style={{ minHeight: height }}>
          <svg
            className="svg"
            id={this.svgId}
            ref={ref => (this.svgDomRef = ref)}
            {...this.state.nodeWrapInfo}
          />
          <div className="node-wrap" ref={this.nodeWrap}>
            <Node value={value} />
            <End
              ref={ref => (this.endDomRef = ref)}
              style={{ marginTop: domLayoutInfo.marginVerticle }}
            />
          </div>
          <SelectType ref={this.selectTypeRef} onAddItem={this.handleAddItem} />
          <ConfigPanel />
        </div>
      </div>
    );
  }
}

export default Flow;
