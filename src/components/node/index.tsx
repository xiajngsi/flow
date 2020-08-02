import React from 'react';
import { INode, IType, IFlow, LayoutType } from '../../interface';
import { domLayoutInfo, marginVerticle, marginHorizontal } from '../../constants';
import { Start, Branch, Approver } from '../../processors';
import { Context } from '../../context';

interface IProps {
  value: IFlow;
}
class Node extends React.PureComponent<IProps, any> {
  static contextType = Context;
  domRefs = this.context.domRefs;
  componentDidMount() {
    this.context.changeDomRefs(this.domRefs);
  }

  componentdidUpdate() {
    this.context.changeDomRefs(this.domRefs);
  }
  render() {
    const { value } = this.props;
    const doms = [];
    const domRef = this.domRefs;
    const { layoutType } = this.context;
    const traverseProcessor = (node: INode) => {
      const commonProps = {
        key: node.nodeId,
        ref: ref => ref && (domRef[node.nodeId] = ref),
        node,
      };

      switch (node.type) {
        case IType.start:
          doms.push(
            <Start
              style={
                layoutType === LayoutType.vertical
                  ? { marginBottom: domLayoutInfo.marginVerticle }
                  : { marginRight: domLayoutInfo.marginHorizontal }
              }
              {...commonProps}
            />,
          );
          break;
        case IType.approver:
        case IType.notifier:
          doms.push(
            <Approver
              style={layoutType === LayoutType.vertical ? marginVerticle : marginHorizontal}
              {...commonProps}
            />,
          );
          break;
        case IType.route:
          doms.push(
            <Branch
              style={layoutType === LayoutType.vertical ? marginVerticle : marginHorizontal}
              {...commonProps}
            />,
          );
          break;
      }
      if (node.childNode) {
        traverseProcessor(node.childNode);
      }
    };
    traverseProcessor(value);

    return doms;
  }
}

export default Node;
