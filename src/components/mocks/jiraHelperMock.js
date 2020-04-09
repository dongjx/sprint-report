import * as jiraHelper from '../helpers/jiraHelper';
import mockViewData from './mockViewData';
import mockSprintData from './mockSprintData';
import mockSprintReportData from './mockSprintReportData';
import mockEpicData from './mockEpicData';

const fetchBoardList = (origin, projectName) => jiraHelper
  .fetchBoardList(origin, projectName)
  .catch((error) => {
    const response = mockViewData;
    const {views} = response;
    if (views) {
      return views.map(it => ({id: it.id, name: it.name}));
    }
    return Promise.reject();
  });

const fetchSprintList = (origin, boardId) => jiraHelper.fetchSprintList(origin, boardId)
  .catch((error) => {
    const response = mockSprintData;
    const {sprints} = response;
    if (sprints) {
      return sprints.map(it => ({id: it.id, name: it.name}));
    }
    return Promise.reject();
  });

const fetchSprintReport = (origin, boardId, sprintId) => jiraHelper
  .fetchSprintList(origin, boardId, sprintId)
  .catch(error => {
    const response = mockSprintReportData;
    const {contents} = response;
    if (contents) {
      return contents;
    }
    return Promise.reject();
  });

const fetchEpic = (origin, epicKey) => jiraHelper
  .fetchEpic(origin, epicKey)
  .catch(error => {
    const response = mockEpicData;
    if (response) {
      return response;
    }
    return Promise.reject();
  });

export {
  fetchEpic,
  fetchBoardList,
  fetchSprintList,
  fetchSprintReport
};
