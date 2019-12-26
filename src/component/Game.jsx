import React from 'react';
import {Button,Table} from "react-bootstrap"
import '../css/Game.css';
import '../config.js';
import MyPagination from './MyPagination';
import moment from 'moment';
import ReactToExcel from 'react-html-table-to-excel';
var currentPage=1;//initialize current page, this global variable makes sense
//when we put "currentPage" in state, every time when we try to update it, 
//setState just can't immediately update its value, which may 
//cause problem in requesting data of different pages
class Game extends React.Component{
    constructor(props){
        super(props);
        this.state={
            allTeams:"",
            gameInfo:"",
            totalPages:"",
            totalElements:"100",//intialize totalElements, we need to do this for period <select>
            updateTime:"",
        }
    }

    getAllTeams(){
        let url=global.constants.api+"/allteams";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        fetch(url,{
            method:"get",
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                alert(data.message+" wrong token!");
                data=[];
            }
            this.setState({
                allTeams:data,
            });
        });
    }

    getUpdateTime(){
        let url=global.constants.api+"/get-update-time";
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
                updateTime:moment(data.gameupdatetimeDate).format('YYYY/MM/DD'),
            });
            //console.log(data.gameupdatetimeDate);
            //console.log(moment(data.gameupdatetimeDate).format('YYYY/MM/DD'))
        });
    }

    componentWillMount(){
        this.getAllTeams();
        this.getUpdateTime();
    }

    setTeamOptions(){
        const teamOptions=[];//set team options, using info graped from database.
        teamOptions.push(
            <option key="Allteam">AllTeams</option>
        );
        for(let team of this.state.allTeams){
            teamOptions.push(
                <option key={team}>{team}</option>
            )
        };
        return teamOptions;
    }

    getGameByPage=(activePage)=>{//this function will be used by child component
        currentPage=activePage;//using => to define the function has benefits
        //we don't need to put "bind(this)"  
        let url=global.constants.api+"/games/"+currentPage+"/"+this.selectedPagesize.value+"/"+this.selectedTeam.value+
        "/"+this.selectedPeriod.value+"/"+this.selectedSortedAttr.value;
        //console.log(url);
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        fetch(url,{
            method:"get",
            headers:headers,
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                alert(data.message+" wrong token!");
                data.content=[];
                data.totalPages=null;
                data.totalElements=null;
            }
            this.setState({
                gameInfo:data.content,
                totalPages:data.totalPages,
                totalElements:data.totalElements,
            });
        });
    }

    searchGameInfo(){
        currentPage=1;
        this.getGameByPage(currentPage);
        
    }

    setGameInfo(){
        const gameTrs=[];//set game info.
        for(let game of this.state.gameInfo){
            gameTrs.push(
                <tr key={game.gameId}>
                    <td>{game.gameId}</td>
                    <td>{game.gameRound}</td>
                    <td>{game.gameTeam}</td>
                    <td>{moment(game.gameDate).format('YYYY/MM/DD')}</td>
                    <td>{game.gameTime}</td>
                    <td>{game.gameVenue}</td>
                    <td>{game.gameAddress}</td>
                    <td>{game.gameOpposition}</td>
                </tr>
            );
        }
        return gameTrs;
    }

    render(){
        return(
            <div id="game">
                <div id="game-filter">
                    <div className="filter-label">team</div>
                    <div id="filter-team">
                        <select ref = {(input)=> this.selectedTeam = input}>
                            {this.setTeamOptions()}
                        </select>
                    </div>
                    <div className="filter-label">period</div>
                    <div id="filter-period">
                        <select ref = {(input)=> this.selectedPeriod = input}>
                            <option value="WHOLESEASON">whole season</option>
                            <option value="THISWEEK">this week</option>
                            <option value="NEXTWEEK">next week</option>
                        </select>
                    </div>
                    <div className="filter-label">page&nbsp;size</div>
                    <div id="filter-pagesize">
                        <select ref = {(input)=> this.selectedPagesize = input}>
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                            <option>{this.state.totalElements}</option>
                        </select>
                    </div>
                    <div className="filter-label">sort&nbsp;by</div>
                    <div id="filter-sortedattr">
                        <select ref = {(input)=> this.selectedSortedAttr = input}>
                            <option>date</option>
                            <option>team</option>
                        </select>
                    </div>
                    <div id="filter-button">
                        <Button variant="danger" onClick={()=>this.searchGameInfo()}>Search</Button>
                    </div>
                    <div id="export-excel">
                        <ReactToExcel 
                        table="my-game-table" 
                        filename="exportGameInfo" 
                        sheet="exportdriverInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                </div>
                <div id="game-table">
                    <Table striped bordered hover id="my-game-table">
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Round</th>
                            <th>Team</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Venue</th>
                            <th>Address</th>
                            <th>Opposition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.setGameInfo()}
                        </tbody>
                    </Table>
                </div>
                <div id="game-footer">
                    <MyPagination 
                    totalPages={this.state.totalPages} 
                    totalElements={this.state.totalElements} 
                    updateTime={this.state.updateTime} 
                    currentPage={currentPage} 
                    fromParentGetGameByPage={this.getGameByPage}/>
                </div>
            </div>
        );//here we don't need to write "this.getGameByPage.bind(this)"
    }
}

export default Game;
