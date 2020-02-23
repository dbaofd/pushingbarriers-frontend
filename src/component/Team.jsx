import React from 'react';
import ReactToExcel from 'react-html-table-to-excel';
import {Button,Table} from "react-bootstrap";

import '../config.js';
import '../css/Team.css';
import * as MyToast from '../tools/MyToast';
import AddNewTeamModal from './AddNewTeamModal';
import TeamModal from './TeamModal';
var teams;
class Team extends React.Component{
    constructor(props){
        super(props);
        this.state={
            teamInfo:"",
            searchByTeamName:false,
        }
    }

    getAllTeams(){
        let url=global.constants.api+"/findAllTeams";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        fetch(url,{
            method:"get", 
            headers:headers,
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                MyToast.notify(data.message+" wrong token!", "error");
                data=[];
            }
            this.setState({
                teamInfo:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }

    searchTeam(){
        let url;
        if(this.state.searchByTeamName){
            if(this.teamNameInput.value.length!==0){
                url=global.constants.api+"/findTeamsByTeamNameContaining/"+this.teamNameInput.value;
            }else{
                url=global.constants.api+"/findAllTeams";
            }
        }else{
            if(this.selectedStatus.value!=="2"){
                url=global.constants.api+"/findTeamsByStatus/"+this.selectedStatus.value;
            }else{
                url=global.constants.api+"/findAllTeams";
            }
        }
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        fetch(url,{
            method:"get", 
            headers:headers,
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                MyToast.notify(data.message+" wrong token!", "error");
                data=[];
            }
            this.setState({
                teamInfo:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }

    componentWillMount(){
        this.getAllTeams();
    }

    teamTemplate(teamIndex){
        let mystyle={};
        let status="";
        if(this.state.teamInfo[teamIndex].teamStatus===0){
            mystyle={color:"red"};
            status="Inactive";
        }else if(this.state.teamInfo[teamIndex].teamStatus===1){
            mystyle={color:"green"};
            status="Active";
        }
        return(
            <tr key={this.state.teamInfo[teamIndex].teamId}>
                <td>{this.state.teamInfo[teamIndex].teamId}</td>
                <td>{this.state.teamInfo[teamIndex].teamName}</td>
                <td>{this.state.teamInfo[teamIndex].teamClub}</td>
                <td>{this.state.teamInfo[teamIndex].teamAddress}</td>
                <td style={mystyle}>{status}</td>
                <td><Button variant="info" onClick={()=>this.handleModalShow2(teamIndex)}>Edit</Button></td>
            </tr>
        );
    }
    setTeams(){
        teams=[];
        for(let i=0;i<this.state.teamInfo.length;i++){
            teams.push(this.teamTemplate(i));
        }
    }

    onRefForAddNewTeamModal=(ref)=>{
        this.child=ref;
    }

    onRefForTeamModal=(ref)=>{
        this.child2=ref;
    }

    handleModalShow(){//call child component function 
        this.child.handleShow();
    }
    
    handleModalShow2(index){//call child component function 
        this.child2.handleShow(index);
    }

    searchByOnChange(){
        if(this.selectedSearchBy.value==="name"){
            //alert("team");
            this.setState({
                searchByTeamName:true,
            });
        }else if(this.selectedSearchBy.value==="status"){
            //alert("club");
            this.setState({
                searchByTeamName:false,
            });
        }
    }

    render(){
        this.setTeams();
        return(
            <div id="team">
                <div id="team-bar">
                    <div id="team-export-excel">
                        <ReactToExcel 
                        table="my-team-table" 
                        filename="exportTeamInfo" 
                        sheet="exportTeamInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                    <div id="team-add">
                        <Button variant="primary" id="team-add-btn" onClick={()=>this.handleModalShow()}>New Team</Button>
                    </div>
                    <div id="team-search">
                        <Button variant="danger" id="team-search-btn" onClick={()=>this.searchTeam()}>Search</Button>
                    </div>

                    {this.state.searchByTeamName?
                    <div id="team-name-textbox">
                        <input type="text" id="team-name-input" placeholder="Search by team name" ref = {(input)=> this.teamNameInput = input}/>
                    </div>
                    :
                    <div id="team-select-box">
                        <select id="team-select" ref = {(input)=> this.selectedStatus = input}>
                            <option value="2">AllTeams</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    }
                    <div id="searchby-select-box">
                        <select id="searchby-select" ref = {(input)=> this.selectedSearchBy = input} onChange={()=>this.searchByOnChange()}>
                            <option value="status">Team Status</option>
                            <option value="name">Team Name</option>
                        </select>
                    </div>
                    <div id="totalNumberOfTeams">
                        <li>{this.state.teamInfo.length} teams in total</li>
                    </div>
                </div>
                
                <div id="team-table">
                    <Table striped bordered hover id="my-team-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Club</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams}
                        </tbody>
                    </Table>
                    <AddNewTeamModal
                    onRef={this.onRefForAddNewTeamModal}
                    onSubmited={this.getAllTeams.bind(this)}/>

                    <TeamModal
                    onRef={this.onRefForTeamModal}
                    allTeams={this.state.teamInfo}
                    onSubmited={this.getAllTeams.bind(this)}
                    />
                </div>
            </div>);
    }
}

export default Team;