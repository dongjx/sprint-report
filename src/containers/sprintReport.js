import React, {Component} from 'react';
import {
  Input, Button, Dropdown, DropdownToggle, DropdownMenu,
  DropdownItem, ListGroupItem
} from 'reactstrap';
import {isEmpty} from 'lodash';
import Report from '../components/report';
import {
  fetchBoardList, fetchSprintList,
  fetchSprintReport, fetchEpic
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
      <div>
        {this.state.error && <div className="alert alert-warning" role="alert">
          {this.state.error}
        </div>}
        <div className="flex-box search-form">
          <div className="input-group mb-3">
            <Input
              type="text"
              value={this.state.jiraUrl}
              placeholder="Input your jira url, like https://jira.atlassian.com"
              onChange={(event) => this.handleJiraUrlChange(event.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <Input
              type="text"
              value={this.state.projectName}
              placeholder="Project name"
              onChange={event => this.handleChange({projectName: event.target.value})}
            />
          </div>
          <div className="input-group-btn">
            <Button color="primary" onClick={this.handleSubmit}>GO</Button>
          </div>
        </div>
        {!isEmpty(boardList) && <div className="sprint-list-content">
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
        {!isEmpty(sprintList) && <div className="sprint-list-content">
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
        {!isEmpty(reportData) && <Report {...this.getReportData(reportData)} />}
      </div>
    );
  }

  getReportData = () => {
    const {reportData, epicList} = this.state;
    return {
      ...reportData,
      completedIssues: this.buildIssuesWithEpic(reportData.completedIssues, epicList),
      issuesNotCompletedInCurrentSprint: this
        .buildIssuesWithEpic(reportData.issuesNotCompletedInCurrentSprint, epicList),
      puntedIssues: this.buildIssuesWithEpic(reportData.puntedIssues, epicList),
    };
  }

  buildIssuesWithEpic = (issues, epicList) => issues.map(issue => {
    if (issue.epic && epicList.filter(epic => epic.key === issue.epic).length > 0) {
      return {
        ...issue,
        epic: epicList.filter(epic => epic.key === issue.epic)[0]
      };
    }
    return issue;
  });

  handleJiraUrlChange = (url) => {
    try {
      const {origin} = new URL(url);
      this.handleChange({jiraUrl: origin});
    } catch (error) {
      this.handleChange({error: 'Invalid jira url.'});
    }
  }

  handleSubmit= () => {
    this.setState({
      selectedBoardId: '',
      selectedSprintId: '',
      boardList: [],
      sprintList: [],
      epicList: [],
      reportData: {},
      error: ''
    });
    this.fetchBoardList();
  }

  fetchBoardList = () => {
    fetchBoardList(this.state.jiraUrl, this.state.projectName)
      .then((boardList) => {
        this.handleChange({
          boardList,
          selectedBoardId: '',
          selectedSprintId: '',
          sprintList: [],
          epicList: [],
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
        this.fetchEpicListByIssues(allIssues);
        this.handleChange({reportData});
      });
  }

  fetchEpicListByIssues = (issues) => issues.forEach(issue => {
    if (issue.epic) {
      fetchEpic(this.state.jiraUrl, issue.epic)
        .then(epic => this.handleChange({epicList: [...this.state.epicList, epic]}))
        .catch(error => this.handleChange({error: 'Fetch epic error'}));
    }
  })

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
