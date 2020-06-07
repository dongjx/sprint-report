import React, {Component} from 'react';
import logo from '~/assets/logo.png';
import SprintReport from './sprintReport';

class App extends Component {
  getSprintReportUrl = () => {

  }

  render() {
    return (
      <div className="home container-fluid">
        <div className="header row flex-xl-nowrap">
          <div className="col-12">
            <div className="col logo-box">
              <img src={logo} className="logo" />
            </div>
            <div className="col">
              <h1 className="title">
                Sprint Report
                <span className="badge badge-info jira-tag">For Jira</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="content container">
          <SprintReport />
        </div>
      </div>
    );
  }
}

export default App;
