const JIRA_ENDPOINTS = {
  VIEW_LIST: {
    url: '/rest/greenhopper/latest/rapidviews/list',
    defaultParams: {
      _: `${Date.now()}`
    }
  },
  SPRINT_LIST: {
    url: '/rest/greenhopper/1.0/sprintquery/{rapaidViewId}',
    pathParams: {
      rapaidViewId: ''
    },
    defaultParams: {
      includeHistoricSprints: false,
      includeFutureSprints: false,
      _: `${Date.now()}`
    }
  },
  SPRINT_REPORT: {
    url: '/rest/greenhopper/1.0/rapid/charts/sprintreport',
    defaultParams: {
      _: `${Date.now()}`
    }
  },
  GET_ISSUE: {
    url: '/rest/agile/1.0/issue/{issueKey}',
    pathParams: {
      issueKey: ''
    },
    defaultParams: {
      _: `${Date.now()}`
    }
  },
};

export default JIRA_ENDPOINTS;
