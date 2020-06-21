import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import BanIcon from '@material-ui/icons/Gavel';

import './styles.css';
import Icon from './../../data/userIcon.png';
import Label from './label.js';
import Table from './Table/index.js';
import Report from './Report/index.js';
import BanDialog from './BanDialog/index.js';
import UndoSnackBar from './UndoSnackBar/index.js';

const columns = [
    { id: 'name', label: 'Username', showHeader: false},
    { id: 'status', label: 'Status', showHeader: false}
];

function generateChip(user) {
    return user.isBanned ?
        <Chip className="adminHome__chip-banned" label="Banned"/> :
        user.isReported ?
            <Chip className="adminHome__chip-reported" label="Reported"/> :
            <Chip className="adminHome__chip-active" label="Active"/>;
}

function reportedFirstComparator(a, b) {
    if ((a.status.props.label === "Reported") === (b.status.props.label === "Reported")) {
        return a.name.localeCompare(b.name);
    }
    return a.status.props.label === "Reported" ? -1 : 1;
}

class AdminHome extends Component {
    state = {
        selectedUser: null,
        selectedRow: null,
        dialogOpen: false,
        oldReport: null
    }
    
    usersToRows = (users) => {
        if (!Array.isArray(users)) {
            return;
        }
        const row = [];
        for (let i = 0; i < users.length; i++) {
            row.push({
                name: users[i].username,
                status: generateChip(users[i])
            });
        }
        return row;
    }

    rowToUser = (row) => {
        const found = this.props.users.find(element => element.username === row['name']);
        return found;
    }

    handleSelect = (row) => {
        const user = this.rowToUser(row);
        if (this.state.selectedUser === user) {
            this.setState({selectedUser: null});
            this.setState({selectedRow: null});
        } else {
            this.setState({selectedUser: user});
            this.setState({selectedRow: row});
        }
    }

    handleBan = (reason) => {
        const user = this.state.selectedUser;
        user.isBanned = !user.isBanned;
        if (!user.isBanned)
            user.banReason = '';
        else {
            user.banReason = reason;}
        for (let i = 0; i < this.props.users.length; i++) {
            if (user.username === this.props.users[i].username) {
                this.props.users[i] = user;
                break;
            }
        }
        this.setState({selectedUser: user, dialogOpen: false});
    }

    handleOpenDialog = () => {
        this.setState({dialogOpen: true});
    }

    handleCloseDialog = () => {
        this.setState({dialogOpen: false});
    }

    handleOpenSnackBar = (reportType, reportContent, i) => {
        this.setState({oldReport: {type: reportType, content: reportContent, index: i}});
    }

    handleCloseSnackBar = () => {
        this.setState({oldReport: null});
    }

    handleDeleteReport = (report) => {
        const user = this.state.selectedUser;
        let type = '';
        let i = 0;
        for (i = 0; i < user.reportedMessages.length; i++) {
            if (report === user.reportedMessages[i]) {
                user.reportedMessages.splice(i , 1);
                type = 'Message';
                break;
            }
        }
        if (i === user.reportedMessages.length) {
           for (i = 0; i < user.reportedPosts.length; i++) {
                if (report === user.reportedPosts[i]) {
                    user.reportedPosts.splice(i , 1);
                    type = 'Post';
                    break;
                }
            } 
        }
        
        if (user.reportedPosts.length + user.reportedMessages.length <= 0) {
            user.isReported = false;
        }
        this.setState({selectedUser: user});
        this.handleOpenSnackBar(type, report, i);
        setTimeout(() => this.handleCloseSnackBar(), 5000);
    }

    handleUndoDelete = () => {
        const report = this.state.oldReport;
        const user = this.state.selectedUser;
        if (report.type === 'Message') {
            user.reportedMessages.splice(report.i, 0, report.content);
        } else {
            user.reportedPosts.splice(report.i, 0, report.content);
        }
        user.isReported = true;
        this.setState({selectedUser: user, oldReport: null});
    }

    render() {
        const {users} = this.props;
        const {selectedUser, selectedRow, dialogOpen, oldReport} = this.state;
        return (  
            <div className="adminHome">
                <Card className="adminHome__table">
                    <h1>Username</h1>
                    <div className="adminHome__scroll">
                        <Table columns={columns}
                            rows={this.usersToRows(users)}
                            handleSelect={this.handleSelect}
                            compareFunction={reportedFirstComparator}
                            selectedRow={selectedRow}
                        />
                    </div>
                </Card>
                <div className="adminHome__data">
                    <Card className="adminHome__user-detail">
                        <h1>User Details</h1>
                        {selectedUser && 
                            <div className="adminHome__scroll">
                                <img className="adminHome__icon" src={Icon} alt="User Icon"></img>
                                <div className="adminHome__user-detail-text">
                                    <Label primary={"Username"} secondary={selectedUser.username}/>
                                    <Label primary={"Status"} secondary={generateChip(selectedUser)}/>
                                    <Label primary={"First Name"} secondary={selectedUser.firstName}/>
                                    <Label primary={"Last Name"} secondary={selectedUser.lastName}/>
                                    <Label primary={"Location"} secondary={selectedUser.location}/>
                                    <Label primary={"Biography"} secondary={selectedUser.bio} blockText/>
                                    <Label primary={"Posts"} secondary={selectedUser.posts.length}/>
                                    <Label primary={"Messages Sent"} secondary={selectedUser.messagesSent.length}/>
                                    <Label primary={"Messages Recieved"} secondary={selectedUser.messagesRecieved.length}/>
                                </div>
                            </div>
                        }
                        {!selectedUser &&
                            <label className="adminHome__center">No User Selected</label>
                        }
                    </Card>
                    <Card className="adminHome__reported-panel">
                        <h1>Report Details</h1>
                        {selectedUser && selectedUser.isReported &&
                            <div className="adminHome__scroll">
                                {selectedUser.reportedMessages.map((report) => {
                                    return (
                                        <Report type="Message" content={report} handleDeleteReport={this.handleDeleteReport}/>
                                    );
                                })}
                                {selectedUser.reportedPosts.map((report) => {
                                    return (
                                        <Report type="Post" content={report} handleDeleteReport={this.handleDeleteReport}/>
                                    );
                                })}
                            </div>
                        }
                        {selectedUser && !selectedUser.isReported &&
                            <label className="adminHome__center">{selectedUser.username} has not been reported</label>
                        }
                        {selectedUser && !selectedUser.isBanned &&
                            <Button className="adminHome__ban-button"
                                    startIcon={<BanIcon/>}
                                    onClick={this.handleOpenDialog}>
                                Ban {selectedUser.username}
                            </Button>
                        }
                        {selectedUser && selectedUser.isBanned &&
                            <Button className="adminHome__unban-button"
                                    startIcon={<BanIcon/>}
                                    onClick={this.handleOpenDialog}>
                                UnBan {selectedUser.username}
                            </Button>
                        }
                        {!selectedUser &&
                            <div>
                                <label className="adminHome__center">No User Selected</label>
                                <Button className="adminHome__unban-button"
                                        startIcon={<BanIcon/>}
                                        disabled>
                                    Ban
                                </Button>
                            </div>
                        }
                    </Card>
                </div>
                {oldReport && <UndoSnackBar handleClose={this.handleCloseSnackBar} handleUndo={this.handleUndoDelete}/>}
                {dialogOpen && <BanDialog handleBan={this.handleBan} handleClose={this.handleCloseDialog} ban={!selectedUser.isBanned}/>}
            </div>
        );
    }
}

export default AdminHome;