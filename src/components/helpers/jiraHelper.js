import sendRequest from './apiService';
import JIRA_ENDPOINTS from './jiraServices';

const fetchBoardList = (origin, projectName) => sendRequest(
  origin,
  JIRA_ENDPOINTS.VIEW_LIST,
  {},
  {projectKey: projectName}
).then((response) => {
  const {views} = response.data;
  if (views) {
    return views.map(it => ({id: it.id, name: it.name}));
  }
  return Promise.reject();
});

const fetchSprintList = (origin, boardId) => sendRequest(
  origin,
  JIRA_ENDPOINTS.SPRINT_LIST,
  {rapaidViewId: boardId}
).then((response) => {
  const {sprints} = response.data;
  if (sprints) {
    return sprints.map(it => ({id: it.id, name: it.name}));
  }
  return Promise.reject();
});

const fetchSprintReport = (origin, boardId, sprintId) => sendRequest(
  origin,
  JIRA_ENDPOINTS.SPRINT_REPORT,
  {},
  {rapidViewId: boardId, sprintId}
).then((response) => {
  const {contents} = response.data;
  if (contents) {
    return contents;
  }
  return Promise.reject();
});

const fetchIssue = (origin, issueKey) => sendRequest(
  origin,
  JIRA_ENDPOINTS.GET_ISSUE,
  {issueKey}
).then((response) => {
  const issue = response.data;
  if (issue) {
    return issue;
  }
  return Promise.reject();
});

export {
  fetchIssue,
  fetchBoardList,
  fetchSprintList,
  fetchSprintReport
};
