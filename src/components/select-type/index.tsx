import React from 'react';
import classnames from 'classnames';
import './index.less';
import { contains } from '../../utils';
import { IType } from '../../interface';

interface IProps {
  onAddItem: Function;
}

// TODO: 改成可配置的选项
const type = ['approver', 'notifier', 'route'];

const SelectType = React.forwardRef(({ onAddItem }: IProps, ref) => {
  const [visible, changeVisible] = React.useState(false);
  const [position, changePosition] = React.useState({ top: 0, left: 0, from: {}, to: {} });
  const selectTypeRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    show: p => {
      changePosition(p);
      changeVisible(true);
    },
    hide: () => {
      changeVisible(false);
    },
  }));

  const handleClickHide = e => {
    if (!contains(selectTypeRef.current, e.target)) {
      changeVisible(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickHide);
    return () => {
      document.removeEventListener('mousedown', handleClickHide);
    };
  }, []);

  const className = classnames('select-type', { hide: !visible });

  const handleClick = string => {
    if (onAddItem) {
      onAddItem({ ...position, type: string });
    }
  };
  return (
    <div
      className={className}
      style={{ top: position.top, left: position.left }}
      ref={selectTypeRef}
    >
      <div className="arrow" />
      <div className="content">
        <div className="header">
          {/* <Icon type="close-fill" onClick={() => changeVisible(false)} /> */}
        </div>
        <div className="types">
          {type.map(string => {
            if (string === IType.route && position.to && position.to.type === IType.route) {
              return null;
            }
            return (
              <div key={string} onClick={() => handleClick(string)}>
                {string}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default SelectType;
