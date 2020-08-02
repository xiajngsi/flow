import { Drawer, Form, Button } from 'antd';
import React from 'react';
import { Context } from '../../context';
import { FormComponentProps } from 'antd/es/form';
import ConditionForm from './components/condition-form';
import { IType } from '../../interface';
import CondidateForm from './components/condidate-form';
interface IProps extends FormComponentProps {
  item: any;
  config: any; // 配置
  value: any; // 值
}

class DrawerForm extends React.Component<IProps, any> {
  static contextType = Context;

  onClose = () => {
    this.context.changeConfigPanel({ configPanel: { visible: false, item: null } });
  };

  render() {
    const { config, configPanel } = this.context;
    if (!config || !configPanel.item) {
      return null;
    }

    return (
      <div className="config-panel">
        <Drawer
          title="配置"
          width={720}
          onClose={this.onClose}
          visible={this.context.configPanel.visible}
          placement="right"
        >
          {configPanel.item.type === IType.condition ? <ConditionForm /> : <CondidateForm />}
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.onClose} type="primary">
              保存
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}
export default Form.create()(DrawerForm);
