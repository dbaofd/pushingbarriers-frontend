import React from "react";
import {Button,Table, Modal, ModalBody, ModalFooter} from "react-bootstrap";
import Moment from 'moment';
import ReactToExcel from 'react-html-table-to-excel';

import "../css/Player.css";
import '../config.js';
import * as MyToast from '../tools/MyToast';
import PlayerModal from "./PlayerModal";
import AddNewPlayerModal from "./AddNewPlayerModal";
import ImageModal from "./ImageModal";
var players=[];
class Player extends React.Component{
    constructor(props){
        super(props);
        
        this.state={
            playerInfo:"",
            teamInfo:"",
        }
    }

    getAllPlayersInfo(){
        let url=global.constants.api+"/allPlayers";
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
                playerInfo:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
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
        this.getAllPlayersInfo();
        this.getAllTeams();
    }

    
    playerTemplate(playerIndex){
        let tdStyle={};
        let status="";
        //here need to use "==" rather than "===", because playerStatus will be set to string type
        //when innitially get playerStatus from database, it is integer, when update player info
        //playerStatus will be char, when compare char with 0 by using "===", they don't equal.
        //e.g. '0'==0 true, '0'===0 false
        if(this.state.playerInfo[playerIndex].playerStatus==0){
            tdStyle={
                color:"red"
            };
            status="Inactive";
        }else if(this.state.playerInfo[playerIndex].playerStatus==1){
            tdStyle={
                color:"green"
            };
            status="Active";
        }else if(this.state.playerInfo[playerIndex].playerStatus==2){
            tdStyle={
                color:"orange"
            };
            status="Waiting"
        }
        return(
            <tr key={this.state.playerInfo[playerIndex].playerId}>
                <td>{this.state.playerInfo[playerIndex].playerId}</td>
                <td><Button variant="info" onClick={()=>this.handleModalShow3(this.state.playerInfo[playerIndex].playerId)}>Show</Button></td>
                <td>{this.state.playerInfo[playerIndex].playerName}</td>
                <td>{this.state.playerInfo[playerIndex].playerGender}</td>
                <td>{this.state.playerInfo[playerIndex].playerPhoneNum}</td>
                <td>{Moment(this.state.playerInfo[playerIndex].playerBirthday).format('YYYY/MM/DD')}</td>
                <td>{this.state.playerInfo[playerIndex].playerAddress}</td>
                <td>{this.state.playerInfo[playerIndex].playerReferralPerspon}</td>
                <td>{this.state.playerInfo[playerIndex].playerParentName}</td>
                <td>{this.state.playerInfo[playerIndex].playerParentPhoneNum}</td>
                <td>{this.state.playerInfo[playerIndex].playerSport}</td>
                <td>{this.state.playerInfo[playerIndex].playerSchool}</td>
                <td>{this.state.playerInfo[playerIndex].playerConsent}</td>
                <td>{this.state.playerInfo[playerIndex].playerCoachManager}</td>
                <td>{this.state.playerInfo[playerIndex].playerVisa}</td>
                <td><div className="player_note_div">{this.state.playerInfo[playerIndex].playerNote}</div></td>
                <td style={tdStyle}>{status}</td>
                <td><Button variant="info" onClick={()=>this.handleModalShow(playerIndex)}>Edit</Button></td>
            </tr>
        );
    }

    setPlayers(){
        players=[];
        for(let i=0;i<this.state.playerInfo.length;i++){
            players.push(this.playerTemplate(i));
        }
    }

    onRefForPlayerModal = (ref) => {//get "this" returned by child component
        this.child = ref;
    }

    onRefForAddNewPlayerModal = (ref)=>{
        this.child2=ref;
    }

    onRefForImageModal=(ref)=>{
        this.child3=ref;
    }

    handleModalShow(playerIndex){//call child component function 
        this.child.handleShow(playerIndex);
    }

    handleModalShow2(){
        this.child2.handleShow();
    }

    handleModalShow3(id){
        this.child3.handleShow(id,"playerPhoto","");
    }

    //once child component update player info, child component will call this function to update this component state
    onChangeState(playerIndex,name,gender,phoneNum,birthday,
        parentName,parentPhoneNum,address,status,photo,referralPerspon,
        school, consent, coachManager, visa, note, sport){
        let data=this.state.playerInfo;
        data[playerIndex].playerName=name;
        data[playerIndex].playerGender=gender;
        data[playerIndex].playerPhoneNum=phoneNum;
        data[playerIndex].playerBirthday=birthday;
        data[playerIndex].playerParentName=parentName;
        data[playerIndex].playerParentPhoneNum=parentPhoneNum;
        data[playerIndex].playerAddress=address;
        data[playerIndex].playerStatus=status;
        data[playerIndex].playerPhoto=photo;
        data[playerIndex].playerReferralPerspon=referralPerspon;
        data[playerIndex].playerSport=sport;
        data[playerIndex].playerSchool=school;
        data[playerIndex].playerConsent=consent;
        data[playerIndex].playerCoachManager=coachManager;
        data[playerIndex].playerVisa=visa;
        data[playerIndex].playerNote=note;
        this.setState({
            playerInfo: data,
        });
    }

    searchPlayerByName(){
        let url;
        if(this.playerNameInput.value.length!==0){
            url=global.constants.api+"/findPlayersByPlayerName/"+this.playerNameInput.value+"/"+this.selectedStatus.value;
        }else if(this.playerNameInput.value.length===0&&this.selectedStatus.value!=="3"){
            url=global.constants.api+"/findPlayersByPlayerStatus/"+this.selectedStatus.value;
            //this.selectedStatus.value is string
        }else if(this.playerNameInput.value.length===0&&this.selectedStatus.value==="3"){
            url=global.constants.api+"/allPlayers";
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
                playerInfo:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }
    render(){
        this.setPlayers();
        return(
            <div id="player">
                <div id="player-bar">
                    <div id="player-export-excel">
                        <ReactToExcel 
                        table="my-player-table" 
                        filename="exportPlayerInfo" 
                        sheet="exportPlayerInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                    <div id="player-add">
                        <Button variant="primary" id="player-add-btn" onClick={()=>this.handleModalShow2()}>New Player</Button>
                    </div>
                    <div id="playerteam-search">
                        <Button variant="danger" id="playerteam-search-btn" onClick={()=>this.searchPlayerByName()}>Search</Button>
                    </div>
                    <div id="playe-status-select">
                        <select ref = {(input)=> this.selectedStatus = input}>
                            <option value="3">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                            <option value="2">Waiting</option>
                        </select>
                    </div>
                    <div id="player-name-textbox">
                        <input type="text" id="player-name-input" placeholder="Search by player name" ref = {(input)=> this.playerNameInput = input}/>
                    </div>
                    <div id="totalNumberOfPlayers">
                        <li>{players.length} players in total</li>
                    </div>
                </div>
                <div id="player-table">
                    <Table striped bordered hover id="my-player-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>PhoneNum</th>
                                <th>Birthday</th>
                                <th>Address</th>
                                <th>Referral Perspon</th>
                                <th>Parent Name</th>
                                <th>Parent PhoneNum</th>
                                <th>Sport</th>
                                <th>School</th>
                                <th>Consent</th>
                                <th>Coach Manager</th>
                                <th>Visa</th>
                                <th>Note</th>
                                <th>Status</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players}
                        </tbody>
                    </Table>
                    <PlayerModal allplayer={this.state.playerInfo}  allteam={this.state.teamInfo} onRef={this.onRefForPlayerModal} onSubmited={this.onChangeState.bind(this)}/>
                    <AddNewPlayerModal onRef={this.onRefForAddNewPlayerModal} allteam={this.state.teamInfo} onSubmited={this.searchPlayerByName.bind(this)}/>
                    <ImageModal onRef={this.onRefForImageModal} />
                </div>
            </div>);
    }
}

export default Player