import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {hot} from 'react-hot-loader';
import App from '../containers/app';
import SprintReport from '../containers/sprintReport';


const Router = ({component: Component, children, ...rest}) => (
  <Route
    {...rest}
    render={props => (
      <Component {...props} ><Switch>{children}</Switch></Component>
    )}
  />
);

const Root = () => (
  <BrowserRouter>
    <div className="router-content">
      <Switch>
        <Router path="/" component={App} >
          <Router exact path="/report" component={SprintReport} />
        </Router>
      </Switch>
    </div>
  </BrowserRouter>
);

export default hot(module)(Root);
