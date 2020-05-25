import React, {Component} from 'react';
import logo from '~/assets/logo.png';
import SprintReport from './sprintReport';

class App extends Component {
  getSprintReportUrl = () => {

  }

  render() {
    return (
      <div className="home">
        <div className="header" >
          <div className="logo-box">
            <img src={logo} className="logo" />
          </div>
          <h1 className="title"> Sprint Report <span className="badge badge-info jira-tag">For Jira</span></h1>
        </div>
        <div className="content"> <SprintReport /></div>
      </div>
    );
  }
}

export default App;
