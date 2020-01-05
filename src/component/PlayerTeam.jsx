import React from 'react';
import ReactToExcel from 'react-html-table-to-excel';
import "../css/PlayerTeam.css";
import '../config.js';
import {Button,Table, Modal, ModalBody, ModalFooter} from "react-bootstrap";
import Moment from 'moment';

var playerTeamMapping;
class PlayerTeam extends React.Component{
    constructor(props){
        super(props);
        this.state={
            playerTeamMapping:"",
            allTeams:"",
        }
    }

    getPlayerTeamMapping(){
        let url=global.constants.api+"/getAllPlayerTeamMapping";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        fetch(url,{
            method:"get", 
            headers:headers,
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                alert(data.message+" wrong token!");
                data=[];
            }
            let teams=[];
            for(let i=0;i<data.length;i++){
                teams.push(data[i].teamName);
            }
            this.setState({
                playerTeamMapping:data,
                allTeams:teams,
            });

        });
    }

    componentWillMount(){
        this.getPlayerTeamMapping();
    }
    
    playerTeamMappingTemplate(teamIndex, playerListIndex,count){
        return(
            <tr key={count}>
                <td>{count}</td>
                <td>{this.state.playerTeamMapping[teamIndex].playerList[playerListIndex].playerId}</td>
                <td>{this.state.playerTeamMapping[teamIndex].playerList[playerListIndex].playerName}</td>
                <td>{this.state.playerTeamMapping[teamIndex].teamId}</td>
                <td>{this.state.playerTeamMapping[teamIndex].teamName}</td>
            </tr>
        );
    }

    setPlayerTeamMapping(){
        playerTeamMapping=[];
        let count=1;
        for(let i=0;i<this.state.playerTeamMapping.length;i++){
            for(let j=0;j<this.state.playerTeamMapping[i].playerList.length;j++){
                playerTeamMapping.push(this.playerTeamMappingTemplate(i,j,count));
                count++;
            }
        }
        
    }

    setTeamOptions(){
        let teamOptions=[];//set team options, using info graped from database.
        teamOptions.push(
            <option key="Allteams">AllTeams</option>
        );
        for(let i=0;i< this.state.allTeams.length;i++){
            teamOptions.push(
                <option key={this.state.allTeams[i]}>{this.state.allTeams[i]}</option>
            )
        };
        return teamOptions;
    }

    getMappingByTeamName(){
        if(this.selectedTeam.value!=="AllTeams"){
            let url=global.constants.api+"/findTeamByName/"+this.selectedTeam.value;
            let headers=new Headers();
            headers.append("token",localStorage.getItem("token"));
            fetch(url,{
                method:"get", 
                headers:headers,
            }).then(res => res.json()
            ).then(data => {
                if(data.code===401){
                    alert(data.message+" wrong token!");
                    data=[];
                }
                this.setState({
                    playerTeamMapping:data,
                });
            });
        }else{
            this.getPlayerTeamMapping()
        }
    }
    render(){
        this.setPlayerTeamMapping();
        return(
            <div id="playerteam">
                <div id="playerteam-bar">
                    <div id="playerteam-export-excel">
                        <ReactToExcel 
                        table="my-playerteam-table" 
                        filename="exportPlayerTeamInfo" 
                        sheet="exportPlayerTeamInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                    <div id="playerteam-search">
                        <Button variant="danger" id="player-search-btn" onClick={()=>this.getMappingByTeamName()}>Search</Button>
                    </div>
                    <div id="playerteam-select-box">
                        <select id="playerteam-select" ref = {(input)=> this.selectedTeam = input}>
                            {this.setTeamOptions()}
                        </select>
                    </div>
                    <div id="totalNumberOfPlayers">
                        <li>{playerTeamMapping.length} items in total</li>
                    </div>
                </div>
                <div id="playerteam-table">
                        <Table striped bordered hover id="my-playerteam-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>PlayerId</th>
                                    <th>PlayerName</th>
                                    <th>TeamId</th>
                                    <th>TeamName</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playerTeamMapping}
                            </tbody>
                        </Table>
                </div>
            </div>
        );
    }

}

export default PlayerTeam;