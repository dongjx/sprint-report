import React, {Component} from 'react';
import {
  Input, Button, Dropdown, DropdownToggle, DropdownMenu,
  DropdownItem, ListGroupItem
} from 'reactstrap';
import {isEmpty, uniq} from 'lodash';
import Report from '../components/report';
import {
  fetchBoardList, fetchSprintList,
  fetchSprintReport, fetchIssue
} from '../components/helpers/jiraHelper';

class SprintReport extends Component {
  state = {
    jiraUrl: '',
    projectName: '',
    selectedBoardId: '',
    selectedSprintId: '',
    boardList: [],
    sprintList: [],
    epicList: [],
    statusList: [],
    error: '',
    reportData: {},
    isSprintDropdownOpen: false,
    isBoardDropDownOpen: false,
  }

  componentDidMount() {
  }

  render() {
    const {
      sprintList, isSprintDropdownOpen, selectedSprintId,
      reportData, boardList, selectedBoardId, isBoardDropDownOpen
    } = this.state;
    return (
      <div className="form-group">
        {this.state.error && <div className="alert alert-warning" role="alert">
          {this.state.error}
        </div>}
        <div className="flex-box search-form form-row">
          <div className="col-6">
            <Input
              type="text"
              value={this.state.jiraUrl}
              placeholder="Input your jira url, like https://jira.atlassian.com"
              onChange={(event) => this.handleJiraUrlChange(event.target.value)}
            />
          </div>
          <div className="col-4">
            <Input
              type="text"
              value={this.state.projectName}
              placeholder="Project name"
              onChange={event => this.handleChange({projectName: event.target.value.toUpperCase()})}
            />
          </div>
          <div className="col-2">
            <Button className="btn btn-primary submit" onClick={this.handleSubmit}>GO</Button>
          </div>
        </div>
        <div className="form-row">
          {!isEmpty(boardList) && <div className="sprint-list-content col">
            <Dropdown isOpen={isBoardDropDownOpen} toggle={this.toggleBoardDropDown}>
              <DropdownToggle caret>
                {selectedBoardId ? boardList
                  .filter(board => board.id === selectedBoardId)[0].name : 'Board List'}
              </DropdownToggle>
              <DropdownMenu className="no-outline">
                <div className="sprint-list">
                  {boardList.map((board, index) => (
                    <ListGroupItem
                      tag="a"
                      key={index}
                      header
                      onClick={(event) => this.handleBoardChange(board.id)}
                    >
                      {board.name}
                    </ListGroupItem>
                  ))}
                </div>
              </DropdownMenu>
            </Dropdown>
          </div>}
          {!isEmpty(sprintList) && <div className="sprint-list-content col">
            <Dropdown isOpen={isSprintDropdownOpen} toggle={this.toggleSprintDropDown}>
              <DropdownToggle caret>
                {selectedSprintId ? sprintList
                  .filter(sprint => sprint.id === selectedSprintId)[0].name : 'Sprint List'}
              </DropdownToggle>
              <DropdownMenu className="no-outline">
                <div className="sprint-list">
                  {sprintList.map((sprint, index) => (
                    <ListGroupItem
                      tag="a"
                      key={index}
                      header
                      onClick={(event) => this.handleSprintChange(sprint.id)}
                    >
                      {sprint.name}
                    </ListGroupItem>
                  ))}
                </div>
              </DropdownMenu>
            </Dropdown>
          </div>}
        </div>
        {!isEmpty(reportData) && <Report {...this.getReportData(reportData)} />}
      </div>
    );
  }

  getReportData = () => {
    const {reportData, epicList} = this.state;
    const result = {
      ...reportData,
      completedIssues: this.buildIssues(reportData.completedIssues),
      issuesNotCompletedInCurrentSprint: this
        .buildIssues(reportData.issuesNotCompletedInCurrentSprint),
      puntedIssues: this.buildIssues(reportData.puntedIssues, epicList),
    };
    return result;
  }

  buildIssues = (issues) => {
    const {epicList, statusList} = this.state;
    return issues.map(issue => {
      let newIssue = issue;
      if (issue.epic && epicList.filter(epic => epic.key === issue.epic).length > 0) {
        newIssue = {
          ...newIssue,
          epic: epicList.filter(epic => epic.key === issue.epic)[0]
        };
      }
      if (issue.statusId && statusList.filter(status => status.id === issue.statusId).length > 0) {
        newIssue = {
          ...newIssue,
          statusName: statusList.filter(status => status.id === issue.statusId)[0].name
        };
      }
      return newIssue;
    });
  }

  handleJiraUrlChange = (url) => {
    this.handleChange({jiraUrl: url});
  }

  handleSubmit= () => {
    this.setState({
      selectedBoardId: '',
      selectedSprintId: '',
      boardList: [],
      sprintList: [],
      epicList: [],
      statusList: [],
      reportData: {},
      error: ''
    });
    let jiraOrigin;
    try {
      jiraOrigin = new URL(this.state.jiraUrl).origin;
      this.setState({jiraUrl: jiraOrigin});
    } catch (error) {
      this.handleChange({error: 'Invalid jira url.'});
      return;
    }
    this.fetchBoardList(jiraOrigin);
  }

  fetchBoardList = (jiraOrigin) => {
    fetchBoardList(jiraOrigin, this.state.projectName)
      .then((boardList) => {
        this.handleChange({
          boardList,
          selectedBoardId: '',
          selectedSprintId: '',
          sprintList: [],
          epicList: [],
          statusList: [],
          reportData: {},
          error: ''
        });
      }).catch(() => {
        this.handleChange({error: 'Can not fetch board data!'});
      });
  }

  handleBoardChange = (selectedBoardId) => {
    this.handleChange({
      selectedBoardId,
      isBoardDropDownOpen: false,
      selectedSprintId: '',
      sprintList: [],
      epicList: [],
      reportData: {},
      error: ''
    });
    fetchSprintList(this.state.jiraUrl, selectedBoardId)
      .then(sprintList => {
        this.handleChange({sprintList});
      }).catch(() => {
        this.handleChange({error: 'Can not fetch data!'});
      });
  }

  handleSprintChange = (selectedSprintId) => {
    this.handleChange({selectedSprintId, isSprintDropdownOpen: false});
    this.fetchSprintReportData(selectedSprintId);
  }

  fetchSprintReportData = (selectedSprintId) => {
    fetchSprintReport(this.state.jiraUrl, this.state.selectedBoardId, selectedSprintId)
      .then((reportData) => {
        const allIssues = [...reportData.completedIssues,
          ...reportData.issuesNotCompletedInCurrentSprint,
          ...reportData.puntedIssues];
        this.fetchEpicAndStatus(allIssues);
        this.handleChange({reportData});
      });
  }

  fetchEpicAndStatus = (issues) => {
    issues.forEach(issue => {
      fetchIssue(this.state.jiraUrl, issue.key)
        .then(it => {
          if (it.fields && it.fields.epic) {
            this.handleChange({epicList: [...this.state.epicList, it.fields.epic]});
          }
          if (it.fields && it.fields.status) {
            this.handleChange({statusList: [...this.state.statusList, it.fields.status]});
          }
        });
    });
  }

  toggleSprintDropDown = () => this.handleChange({
    isSprintDropdownOpen: !this.state.isSprintDropdownOpen
  });

  toggleBoardDropDown = () => this.handleChange({
    isBoardDropDownOpen: !this.state.isBoardDropDownOpen
  });

  handleChange = (changedData) => {
    this.setState({
      ...this.state,
      ...changedData
    });
  }

  // fetchData = () => {
  //   if (window.chrome && window.chrome.tabs) {
  //     window.chrome.tabs
  //       .query({active: true, currentWindow: true}, (tabs) => {
  //         this.setCurrentUrl(tabs[0].url);
  //       });
  //   }
  // }

  // setCurrentUrl = (url) => {
  //   if (!url || url === '') return;
  //   const {origin, search} = new URL(url);
  //   const searchParams = new URLSearchParams(search);
  //   const sprintId = searchParams.get('sprint');
  //   const rapidViewId = searchParams.get('rapidView');
  //   this.setState({
  //     currentUrl: url,
  //     sprintId,
  //     rapidViewId,
  //     reportApi:
  //       `${origin}${endpoint}?rapidViewId=${rapidViewId}&sprintId=${sprintId}&_=${Date.now()}`
  //   });
  // }
}

export default SprintReport;
