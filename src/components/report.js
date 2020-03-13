import React from 'react';
import {uniq, keys} from 'lodash';
import {
  STATUS_MAP,
  getTotalSPByIssues,
  getEpicListFromIssues,
  getEpicFromIssue,
  getStatusFromIssue
} from './helpers/reportHelper';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      completedIssues: [],
      issuesNotCompletedInCurrentSprint: [],
      issueKeysAddedDuringSprint: [],
      puntedIssues: []
    };
  }

  render() {
    const epicList = getEpicListFromIssues(this.getAllIssues());
    return (
      <div>
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
            {epicList.map((epic, index) => (
              <tr>
                <th key={index} scope="row">{epic}</th>
                <th key={index} scope="row">{this.getOpenedTotalSP(epic)}</th>
                <th key={index} scope="row">{this.getProgressTotalSP(epic)}</th>
                <th key={index} scope="row">{this.getBusinessViewTotalSP(epic)}</th>
                <th key={index} scope="row">{this.getAddedTotalSP(epic)}</th>
                <th key={index} scope="row">{this.getRemovedTotalSP(epic)}</th>
                <th key={index} scope="row">{this.getDoneTotalSP(epic)}</th>
              </tr>
            ))}
            <tr>
              <th key={1} scope="row">Total</th>
              <th key={2} scope="row">{this.getOpenedTotalSP()}</th>
              <th key={3} scope="row">{this.getProgressTotalSP()}</th>
              <th key={4} scope="row">{this.getBusinessViewTotalSP()}</th>
              <th key={5} scope="row">{this.getAddedTotalSP()}</th>
              <th key={6} scope="row">{this.getRemovedTotalSP()}</th>
              <th key={7} scope="row">{this.getDoneTotalSP()}</th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  getOpenedTotalSP = (epic) => this.getTotalSP(epic, STATUS_MAP.OPEN)

  getProgressTotalSP = (epic) => this.getTotalSP(epic, STATUS_MAP.PROGRESS)

  getBusinessViewTotalSP = (epic) => this.getTotalSP(epic, STATUS_MAP.BUSINESS_REVIEW)

  getDoneTotalSP = (epic) => this.getTotalSP(epic, STATUS_MAP.RESOLVED) +
  this.getTotalSP(epic, STATUS_MAP.CLOSED)

  getAddedTotalSP = (epic) => {
    const {issueKeysAddedDuringSprint} = this.props;
    const issueKeys = keys(issueKeysAddedDuringSprint)
      .filter(key => issueKeysAddedDuringSprint[key]);
    return getTotalSPByIssues(this.getAllIssues()
      .filter(issue => issueKeys.includes(issue.key) &&
      (!epic || getEpicFromIssue(issue) === epic)));
  }

  getRemovedTotalSP = (epic) => {
    const {puntedIssues} = this.props;
    return getTotalSPByIssues(puntedIssues
      .filter(issue => !epic || epic === getEpicFromIssue(issue)));
  }

  getTotalSP = (epic, status) => getTotalSPByIssues(this.getAllIssues()
    .filter(issue => (!status || getStatusFromIssue(issue) === status) &&
                    (!epic || getEpicFromIssue(issue) === epic)))

  getAllIssues = () => {
    const {completedIssues, issuesNotCompletedInCurrentSprint, puntedIssues} = this.props;
    return completedIssues.concat(issuesNotCompletedInCurrentSprint).concat(puntedIssues);
  }
}

export default Report;
