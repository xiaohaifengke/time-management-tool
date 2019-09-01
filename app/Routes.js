import React from 'react';
import { Switch, Route } from 'react-router'; // Redirect
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import WelcomePage from './containers/WelcomePage';
import DashboardPage from './containers/DashboardPage';
import CounterPage from './containers/CounterPage';

export default () => (
  <ConfigProvider locale={zhCN}>
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.WELCOME} component={WelcomePage} />
        <Route path={routes.DASHBOARD} component={DashboardPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  </ConfigProvider>
);
