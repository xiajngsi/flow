import React from 'react';
import './index.less';
import Approver from '../approver';
import { IProps, LayoutType } from '../../interface';
import Node from '../../components/node';
import { domLayoutInfo } from '../../constants';
import { Context, IContextValue } from '../../context';

export default React.forwardRef(({ node, ...rest }: IProps, ref: React.RefObject<any>) => {
  const { conditionNodes: nodes } = node;
  const context: IContextValue = React.useContext(Context);
  const domRefs = context.domRefs;
  React.useEffect(() => {
    context.changeDomRefs(domRefs);
  }, []);
  return (
    <div className="branch-wrap" {...rest}>
      <div className="branch-box-wrap">
        <button
          className="add-branch"
          style={
            context.layoutType === LayoutType.vertical
              ? { marginBottom: domLayoutInfo.marginVerticle * 2 }
              : { marginRight: domLayoutInfo.marginHorizontal * 2 }
          }
          ref={ref}
          onClick={() => context.onAddCondition(node)}
        >
          添加条件
        </button>
        <div className="col-box">
          {nodes.map((item, index) => {
            return (
              <div
                key={item.nodeId}
                className="branch"
                style={
                  context.layoutType === LayoutType.vertical
                    ? {
                        marginRight:
                          index !== nodes.length - 1 ? domLayoutInfo.marginHorizontal : 0,
                      }
                    : {
                        marginBottom: index !== nodes.length - 1 ? domLayoutInfo.marginVerticle : 0,
                      }
                }
              >
                <Approver
                  node={item}
                  {...item}
                  style={
                    context.layoutType === LayoutType.vertical
                      ? {
                          marginBottom: domLayoutInfo.marginHorizontal,
                        }
                      : {
                          marginRight: domLayoutInfo.marginHorizontal,
                        }
                  }
                  ref={ref => ref && (domRefs[item.nodeId] = ref)}
                />
                <Node value={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
