import {uniq} from 'lodash';

const NO_EPIC_NAME = 'Other without epic';

const getStatusFromIssue = (issue) => issue && issue.statusName ? issue.statusName : undefined;

const getEpicFromIssue = (issue) => issue && issue.epicField &&
issue.epicField.text ? issue.epicField.text : NO_EPIC_NAME;

const getSPFromIssue = (issue) => issue &&
  issue.currentEstimateStatistic &&
  issue.currentEstimateStatistic.statFieldValue &&
  issue.currentEstimateStatistic.statFieldValue.value ?
  issue.currentEstimateStatistic.statFieldValue.value : 0;

const getEpicListFromIssues = (issues) => {
  const epicList = uniq(issues.map(issue => getEpicFromIssue(issue)));
  if (epicList.includes(NO_EPIC_NAME)) {
    return epicList.filter(it => it !== NO_EPIC_NAME).concat(NO_EPIC_NAME);
  }
  return epicList;
};

const getTotalSPByIssues = (issues) => issues.map(issue => getSPFromIssue(issue))
  .reduce((prev, cur) => prev + cur, 0);

export {
  getTotalSPByIssues,
  getEpicListFromIssues,
  getSPFromIssue,
  getEpicFromIssue,
  getStatusFromIssue
};
