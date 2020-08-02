import React from 'react';
import './index.less';
import classnames from 'classnames';
import { IProps } from '../../interface';

const Start = React.forwardRef((props: IProps, ref: React.LegacyRef<HTMLDivElement>) => {
  const { className, style } = props;
  const classNames = classnames(className, 'start');
  return <div className={classNames} style={style} ref={ref} />;
});

export default Start;
