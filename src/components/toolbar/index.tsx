import React, { useContext } from 'react';
import { Button } from 'antd';
import { Context } from '../../context';
import { transferValueToFlow } from '../../utils/transfer-flow';
import styles from './index.less';
const Toolbar = () => {
  const context = useContext(Context);
  const handleSubmit = () => {
    const value = transferValueToFlow(context.value, context.configValue, context.config);
    const result = {
      ...value,
      flowData: { value: context.value, configValue: context.configValue },
    };
    console.log('xxx result', result);
    if (context.onChange) {
      context.onChange(result);
    }
  };
  return (
    <div className={styles.toolbar}>
      <span className="margin-right-small">放大</span>
      <span className="margin-right-small">缩小</span>
      <span className="margin-right-small">全屏</span>
      <Button onClick={handleSubmit}>保存</Button>
    </div>
  );
};

export default Toolbar;
