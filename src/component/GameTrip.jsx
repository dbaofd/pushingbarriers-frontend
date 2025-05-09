import React from 'react';
import Moment from 'moment';
import ReactToExcel from 'react-html-table-to-excel';
import {Button,Table, Modal, ModalBody, ModalFooter} from "react-bootstrap";

import GameTripModal from './GameTripModal';
import '../config.js';
import '../css/GameTrip.css';
import * as MyToast from '../tools/MyToast';

var gameTrsSaturday=[];
var gameTrsSunday=[];
class GameTrip extends React.Component{
    constructor(props){
        super(props);
        this.state={
            gameTrips:"",
        }
    }

    getGameTrips(){
        let url=global.constants.api+"/allGameTrips"
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        fetch(url,{
            method:"get",
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                MyToast.notify(data.message+" wrong token!", "error");
                data=[];
            }
            this.setState({
                gameTrips:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }

    onRefForGameTripModal=(ref)=>{
        this.child=ref;
    }

    handleModalShow(tripIndex){//call child component function 
        this.child.handleShow(tripIndex);
    }

    componentWillMount(){
        this.getGameTrips();
    }

    gameTripTrTemplate(index){
        let statusText="";
        let buttonType="";
        let tripType="";
        if(this.state.gameTrips[index].tripStatus===0){
            statusText="Waiting";
            buttonType="success";
        }else if(this.state.gameTrips[index].tripStatus===1){
            statusText="Confirmed";
            buttonType="secondary";
        }else if(this.state.gameTrips[index].tripStatus===3){
            statusText="Cancelled";
            buttonType="danger";
        }

        if(this.state.gameTrips[index].tripType===1){
            tripType="return";
        }else if(this.state.gameTrips[index].tripType===2){
            tripType="player address to game address";
        }else if(this.state.gameTrips[index].tripType===3){
            tripType="game address to player address";
        }
        

        return(
            <tr key={this.state.gameTrips[index].tripId}>
                <td>{this.state.gameTrips[index].tripId}</td>
                <td>{Moment(this.state.gameTrips[index].tripDate).format('YYYY/MM/DD')}</td>
                <td>{this.state.gameTrips[index].tripTime}</td>
                <td>{this.state.gameTrips[index].tripPlayer}</td>
                <td>{this.state.gameTrips[index].tripDriverId}</td>
                <td>{this.state.gameTrips[index].tripDriver}</td>
                <td>{this.state.gameTrips[index].tripTeam}</td>
                <td>{this.state.gameTrips[index].tripPlayerAddress}</td>
                <td>{this.state.gameTrips[index].tripAddress}</td>
                <td><div className="gametrip_note_div">{this.state.gameTrips[index].tripNote}</div></td>
                <td>{tripType}</td>
                <td><Button variant={buttonType} id={this.state.gameTrips[index].trainingId}>{statusText}</Button></td>
                <td><Button variant="info" onClick={()=>this.handleModalShow(index)}>Edit</Button></td>
            </tr>
        );
    }

    onChangeState(index,tripStatus,tripNote){
        let data=this.state.gameTrips;
        data[index].tripStatus=tripStatus;
        data[index].tripNote=tripNote;
        this.setState({
            gameTrips:data,
        });
    }

    setGameTrips(){
        gameTrsSaturday=[];//initialize
        gameTrsSunday=[];
        for(let i=0;i<this.state.gameTrips.length;i++){
            if(this.state.gameTrips[i].tripDay==="Saturday"){
                gameTrsSaturday.push(
                    this.gameTripTrTemplate(i)
                );
            }else if(this.state.gameTrips[i].tripDay==="Sunday"){
                gameTrsSunday.push(
                    this.gameTripTrTemplate(i)
                );
            }
        }
    }

    searchGameTripsByStatus(){
        //alert(Number(this.selectedStatus.value)===3)
        let url;
        if(Number(this.selectedStatus.value)==4){
            url=global.constants.api+"/allGameTrips";
        }else{
            url=global.constants.api+"/getGameTripsByStatus/"+this.selectedStatus.value;
        }
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        fetch(url,{
            method:"get",
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                MyToast.notify(data.message+" wrong token!", "error");
                data=[];
            }
            this.setState({
                gameTrips:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }
    render(){
        this.setGameTrips();
        return(
            <div id="gametrip">
                <div id="gametrip-bar">
                    <div id="gametrip-export-excel">
                        <ReactToExcel 
                        table="my-gametrip-table" 
                        filename="exportGameTripInfo" 
                        sheet="exportGameTripInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                    <div id="gametrip-search">
                        <Button variant="danger" id="gametrip-search-btn" onClick={()=>this.searchGameTripsByStatus()}>Search</Button>
                    </div>
                    <div id="gametrip-status-select">
                        <select ref = {(input)=> this.selectedStatus = input}>
                            <option value="4">All</option>
                            <option value="0">Waiting</option>
                            <option value="1">Confirmed</option>
                            <option value="3">Cancelled</option>
                        </select>
                    </div>
                    <div id="totalNumberOfGameTrips">
                        <li> {this.state.gameTrips.length} trips in total</li>
                    </div>
                </div>
                <div id="gametrip-table">
                    <Table striped bordered hover id="my-gametrip-table">
                        {gameTrsSaturday.length!==0?
                        <>
                            <thead>
                                <tr><th>Saturday</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Player</th>
                                    <th>DriverId</th>
                                    <th>Driver</th>
                                    <th>Team</th>
                                    <th>PlayerAddress</th>
                                    <th>GameAddress</th>
                                    <th>Note</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gameTrsSaturday}
                            </tbody>
                        </>
                        :<></>}

                        {gameTrsSunday.length!==0?
                        <>
                            <thead>
                                <tr><th>Sunday</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Player</th>
                                    <th>DriverId</th>
                                    <th>Driver</th>
                                    <th>Team</th>
                                    <th>PlayerAddress</th>
                                    <th>GameAddress</th>
                                    <th>Note</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gameTrsSunday}
                            </tbody>
                        </>
                        :<></>}
                    </Table>
                    <GameTripModal 
                     allGameTrips={this.state.gameTrips} 
                     onRef={this.onRefForGameTripModal}
                     onSubmited={this.onChangeState.bind(this)}/>
                </div>
            </div>
        );
    }
}
export default GameTrip