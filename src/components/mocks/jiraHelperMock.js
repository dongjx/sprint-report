import * as jiraHelper from '../helpers/jiraHelper';
import mockViewData from './mockViewData';
import mockSprintData from './mockSprintData';
import mockSprintReportData from './mockSprintReportData';

const fetchBoradId = (origin, projectName) => jiraHelper
  .fetchBoradId(origin, projectName)
  .catch((error) => {
    const response = mockViewData;
    const {views} = response;
    const view = views && views.filter(it => it.name === projectName)[0];
    if (view && view.id) {
      return view.id;
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

export {
  fetchBoradId,
  fetchSprintList,
  fetchSprintReport
};
