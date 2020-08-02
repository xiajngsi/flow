import React from 'react';
import './index.less';
import { IProps } from '../../interface';
import classnames from 'classnames';
import Icon from '../../components/icon';
import { Context, IContextValue } from '../../context';

const Approval = React.forwardRef(
  ({ node, style, className }: IProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const { name } = node;
    const classNames = classnames(className, 'approver-node');
    const context: IContextValue = React.useContext(Context);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      context.onDeleteItem(node);
    };

    const handleItemClick = () => {
      const { changeConfigPanel, configPanel } = context;
      if (configPanel.visible) {
        changeConfigPanel({ configPanel: { visible: !configPanel.visible, item: null } });
      } else {
        changeConfigPanel({ configPanel: { visible: !configPanel.visible, item: node } });
      }
    };
    return (
      <div className={classNames} style={style} ref={ref} onClick={handleItemClick}>
        {name}
        <span onClick={handleClick}>
          <Icon type="flowshanchu" />
        </span>
      </div>
    );
  },
);

export default Approval;
