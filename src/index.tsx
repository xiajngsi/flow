import React from 'react';
import { IContainer } from './interface';
import { Provider } from './context';
import Processor from './processor';
import { defaultPrimaryColor } from './constants';
import { initValue } from './utils/transfer-engine';
import { isEmpty } from 'lodash';
import './icon.js';

const Flow = (props: IContainer) => {
  const { value } = props;
  let result;
  let configValue;
  if (isEmpty(value)) {
    const { result: initedResult, configValue: initedConfig } = initValue();
    result = initedResult;
    configValue = initedConfig;
  } else {
    result = value.value;
    configValue = value.configValue;
  }
  const targetProps = { ...props, value: result, configValue: configValue };
  return (
    <Provider {...targetProps}>
      <Processor {...targetProps} primary={props.primary || defaultPrimaryColor} />
    </Provider>
  );
};

export default Flow;
