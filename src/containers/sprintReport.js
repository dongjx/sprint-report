import React, {Component} from 'react';
import {Input, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroupItem, ListGroup} from 'reactstrap';
import {keys, isEmpty} from 'lodash';
import Report from '../components/report';
import {fetchBoradId, fetchSprintList, fetchSprintReport} from '../components/helpers/jiraHelper';

class SprintReport extends Component {
  state = {
    jiraUrl: '',
    projectName: '',
    boardId: '',
    selectedSprint: '',
    sprintList: [],
    error: '',
    reportData: {}
  }

  componentDidMount() {
  }

  render() {
    const {
      sprintList, isSprintDropdownOpen, selectedSprint, reportData
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
              onChange={(event) => this.handleChange({jiraUrl: event.target.value})}
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
        {!isEmpty(sprintList) && <div className="sprint-list-content">
          <Dropdown isOpen={isSprintDropdownOpen} toggle={this.toggleSprintDropDown}>
            <DropdownToggle caret>
              {selectedSprint ? sprintList
                .filter(sprint => sprint.id === selectedSprint)[0].name : 'Sprint List'}
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
        {!isEmpty(reportData) && <Report {...reportData} />}
      </div>
    );
  }

  handleSprintChange = (selectedSprint) => {
    this.handleChange({selectedSprint, isSprintDropdownOpen: false});
    this.fetchSprintReportData(selectedSprint);
  }

  fetchSprintReportData = (selectedSprintId) => {
    fetchSprintReport(this.state.jiraUrl, this.state.boardId, selectedSprintId)
      .then((reportData) => this.handleChange({reportData}));
  }

  toggleSprintDropDown = () => this.handleChange({
    isSprintDropdownOpen: !this.state.isSprintDropdownOpen
  });

  fetchSprintList = () => {
    // eslint-disable-next-line no-debugger
    debugger;
    fetchBoradId(this.state.jiraUrl, this.state.projectName)
      .then((boardId) => {
        this.handleChange({boardId});
        return fetchSprintList(this.state.jiraUrl, boardId);
      }).then(sprintList => {
        this.handleChange({sprintList});
      }).catch(() => {
        this.handleChange({error: 'Can not fetch data!'});
      });
  }

  handleChange = (changedData) => {
    this.setState({
      ...this.state,
      ...changedData
    });
  }

  handleSubmit= () => {
    this.setState({
      selectedSprint: '',
      sprintList: [],
      error: ''
    });
    this.fetchSprintList();
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
