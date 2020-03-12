import React, {Component} from 'react';
import Report from '../components/report';

const endpoint = '/rest/greenhopper/1.0/rapid/charts/sprintreport';
// eslint-disable-next-line max-len
const DEFAULT_TAB_URL = 'https://jira.atlassian.com/secure/RapidBoard.jspa?rapidView=446&view=reporting&chart=sprintRetrospective&sprint=6988';

class SprintReport extends Component {
  state = {
    currentUrl: '',
    reportApi: '',
    rapidViewId: '',
    sprintId: ''
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div>
        <label htmlFor="basic-url">Current Url</label>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            disabled
            value={this.state.currentUrl}
          />
        </div>
        <label>rapidViewId:</label>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            disabled
            value={this.state.rapidViewId}
          />
        </div>
        <label>sprintId:</label>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            disabled
            value={this.state.sprintId}
          />
        </div>
        <label>reportApi:</label>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            disabled
            value={this.state.reportApi}
          />
        </div>
        {this.state.reportApi && <Report reportApi={this.state.reportApi} />}
      </div>
    );
  }

  fetchData = () => {
    if (window.chrome && window.chrome.tabs) {
      window.chrome.tabs
        .query({active: true, currentWindow: true}, (tabs) => {
          this.setCurrentUrl(tabs[0].url);
        });
    } else {
      this.setCurrentUrl(DEFAULT_TAB_URL);
    }
  }

  setCurrentUrl = (url) => {
    if (!url || url === '') return;
    const {origin, search} = new URL(url);
    const searchParams = new URLSearchParams(search);
    const sprintId = searchParams.get('sprint');
    const rapidViewId = searchParams.get('rapidView');
    this.setState({
      currentUrl: url,
      sprintId,
      rapidViewId,
      reportApi:
        `${origin}${endpoint}?rapidViewId=${rapidViewId}&sprintId=${sprintId}&_=${Date.now()}`
    });
  }
}

export default SprintReport;
