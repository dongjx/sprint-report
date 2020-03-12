import React from 'react';
import {uniq, keys} from 'lodash';
import axios from 'axios';
import mockData from './mockData';
import {
  getTotalSPByIssues,
  getEpicListFromIssues,
  getSPFromIssue,
  getEpicFromIssue,
  getStatusFromIssue
} from './reportHelper';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportApi: this.props.reportApi,
      errorMsg: this.props.errorMsg,
      completedIssues: [],
      notCompletedissues: [],
      issueKeysAdded: [],
      removedIssues: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    // const result = mockData;
    // this.setState({
    //   completedIssues: result.contents.completedIssues,
    //   notCompletedissues: result.contents.issuesNotCompletedInCurrentSprint,
    //   removedIssues: result.contents.puntedIssues,
    //   issueKeysAdded: result.contents.issueKeysAddedDuringSprint,
    // });
    axios.get(this.state.reportApi)
      .then((response) => {
        const result = response.data;
        this.setState({
          completedIssues: result.contents.completedIssues,
          notCompletedissues: result.contents.issuesNotCompletedInCurrentSprint,
          removedIssues: result.contents.puntedIssues,
          issueKeysAdded: result.contents.issueKeysAddedDuringSprint,
        });
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          errorMsg: `${error}`
        });
      });
  }

  render() {
    const {errorMsg} = this.state;
    return (
      <div>
        <div className="alert alert-warning" role="alert">
          {errorMsg}
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Epic</th>
              <th scope="col">Open</th>
              <th scope="col">In-progress</th>
              <th scope="col">Business Review</th>
              <th scope="col">Added</th>
              <th scope="col">Removed</th>
              <th scope="col">Done</th>
            </tr>
          </thead>
          <tbody>
            {getEpicListFromIssues(this.getAllIssues()).map((epic, index) => (
              <tr>
                <th key={index} scope="row">{epic}</th>
                <th key={index} scope="row">{this.getOpenedSP(epic)}</th>
                <th key={index} scope="row">{this.getProgressSP(epic)}</th>
                <th key={index} scope="row">{this.getBusinessViewSP(epic)}</th>
                <th key={index} scope="row">{this.getAddedSP(epic)}</th>
                <th key={index} scope="row">{this.getRemovedSP(epic)}</th>
                <th key={index} scope="row">{this.getDoneSP(epic)}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  getOpenedSP = (epic) => this.getTotalSPByEpicAndStatus(epic, 'Open')

  getProgressSP = (epic) => this.getTotalSPByEpicAndStatus(epic, 'In Progress')

  getBusinessViewSP = (epic) => this.getTotalSPByEpicAndStatus(epic, 'Waiting For Business Review')

  getDoneSP = (epic) => this.getTotalSPByEpicAndStatus(epic, 'Resolved') +
  this.getTotalSPByEpicAndStatus(epic, 'Closed')

  getAddedSP = (epic) => {
    const {issueKeysAdded} = this.state;
    const issueKeys = keys(issueKeysAdded).filter(key => issueKeysAdded[key]);
    return getTotalSPByIssues(this.getAllIssues()
      .filter(issue => issueKeys.includes(issue.key) &&
      getEpicFromIssue(issue) === epic));
  }

  getRemovedSP = (epic) => {
    const {removedIssues} = this.state;
    return getTotalSPByIssues(removedIssues
      .filter(issue => epic === getEpicFromIssue(issue)));
  }

  getTotalSPByEpicAndStatus = (epic, status) => getTotalSPByIssues(this.getAllIssues()
    .filter(issue => getStatusFromIssue(issue) === status &&
                                getEpicFromIssue(issue) === epic))

  getAllIssues = () => {
    const {completedIssues, notCompletedissues} = this.state;
    return completedIssues.concat(notCompletedissues);
  }
}

export default Report;
