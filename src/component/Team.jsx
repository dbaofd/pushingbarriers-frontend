import React from 'react';

import {Button,Table} from "react-bootstrap";

import '../config.js';
import * as MyToast from '../tools/MyToast';
var teams;
class Team extends React.Component{
    constructor(props){
        super(props);
        this.state={
            teamInfo:"",
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

    componentWillMount(){
        this.getAllTeams();
    }

    teamTemplate(teamIndex){
        return(
            <tr key={this.state.teamInfo[teamIndex].teamId}>
                <td>{this.state.teamInfo[teamIndex].teamId}</td>
                <td>{this.state.teamInfo[teamIndex].teamName}</td>
            </tr>
        );
    }
    setTeams(){
        teams=[];
        for(let i=0;i<this.state.teamInfo.length;i++){
            teams.push(this.teamTemplate(i));
        }
    }
    render(){
        this.setTeams();
        return(
            <div id="team">
                <div id="team-table">
                    <Table striped bordered hover id="my-team-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams}
                        </tbody>
                    </Table>
                </div>
            </div>);
    }
}

export default Team;