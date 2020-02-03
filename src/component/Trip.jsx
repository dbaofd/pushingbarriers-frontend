import React from 'react';
import '../config.js';
import '../css/Trip.css';
import MyPagination from './MyPagination';
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ReactToExcel from 'react-html-table-to-excel';
import {Button,Table, Modal, ModalBody, ModalFooter} from "react-bootstrap";

var currentTripPage=1;
class Trip extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tripInfo:"",
            searchby:"driver",
            startDate:new Date(),
            endDate:new Date(),
            totalPages:"",
            totalElements:"",
            updateTime:"",
        }
    }

    getTripsByPage=(activePage)=>{
        let url;
        currentTripPage=activePage;
        if(this.state.searchby==="driver"){
            if(this.tripNameInput.value.length!==0){
                url=global.constants.api+"/getTripsByDriverName/"+activePage+"/"+this.selectedPagesize.value+"/"+this.tripNameInput.value;
            }else{
                url=global.constants.api+"/allTrips/"+activePage+"/"+this.selectedPagesize.value;
            }
        }else if(this.state.searchby==="player"){
            if(this.tripNameInput.value.length!==0){
                url=global.constants.api+"/getTripsByPalyerName/"+activePage+"/"+this.selectedPagesize.value+"/"+this.tripNameInput.value;
            }else{
                url=global.constants.api+"/allTrips/"+activePage+"/"+this.selectedPagesize.value;
            }
        }else if(this.state.searchby==="status"){
            if(Number(this.selectedStatus.value)!==4){
                url=global.constants.api+"/getTripsByStatus/"+activePage+"/"+this.selectedPagesize.value+"/"+this.selectedStatus.value;
            }else{
                url=global.constants.api+"/allTrips/"+activePage+"/"+this.selectedPagesize.value;
            }
        }else if(this.state.searchby==="driver-date-range"){
            if(this.tripNameInput.value.length!==0){
                url=global.constants.api+"/getTripsByDriverNameAndDateRange/"+activePage+"/"+this.selectedPagesize.value+"/"+this.tripNameInput.value+"/"+this.state.startDate+"/"+this.state.endDate;
            }else{
                url=global.constants.api+"/getTripsBetweenDateRange/"+activePage+"/"+this.selectedPagesize.value+"/"+this.state.startDate+"/"+this.state.endDate;
            }
        }else if(this.state.searchby==="player-date-range"){
            if(this.tripNameInput.value.length!==0){
                url=global.constants.api+"/getTripsByPlayerNameAndDateRange/"+activePage+"/"+this.selectedPagesize.value+"/"+this.tripNameInput.value+"/"+this.state.startDate+"/"+this.state.endDate;
            }else{
                url=global.constants.api+"/getTripsBetweenDateRange/"+activePage+"/"+this.selectedPagesize.value+"/"+this.state.startDate+"/"+this.state.endDate;
            }
        }else if(this.state.searchby==="status-date-range"){
            if(Number(this.selectedStatus.value)!==4){
                url=global.constants.api+"/getTripsByStatusAndDateRange/"+activePage+"/"+this.selectedPagesize.value+"/"+this.selectedStatus.value+"/"+this.state.startDate+"/"+this.state.endDate;
            }else{
                url=global.constants.api+"/getTripsBetweenDateRange/"+activePage+"/"+this.selectedPagesize.value+"/"+this.state.startDate+"/"+this.state.endDate;
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
                alert(data.message+" wrong token!");
                data.content=[];
                data.totalPages=null;
                data.totalElements=null;
            }
            this.setState({
                tripInfo:data.content,
                totalPages:data.totalPages,
                totalElements:data.totalElements,
            });
        });
    }

    searchTrips(){
        currentTripPage=1;
        this.getTripsByPage(currentTripPage);
    }

    getUpdateTime(){
        let url=global.constants.api+"/get-update-time/2";
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
                updateTime:Moment(data.gameupdatetimeDate).format('YYYY/MM/DD'),
            });
        });
    }

    componentWillMount(){
        this.getUpdateTime();
    }

    setTripSearchby(){
        if(this.state.searchby==="driver"||this.state.searchby==="driver-date-range"){
            return(
                <input type="text" placeholder="name" id="trip-name-input" ref = {(input)=> this.tripNameInput = input}/>
            );
        }else if(this.state.searchby==="player"||this.state.searchby==="player-date-range"){
            return(
                <input type="text" placeholder="name" id="trip-name-input" ref = {(input)=> this.tripNameInput = input}/>
            );
        }else if(this.state.searchby==="status"||this.state.searchby==="status-date-range"){
            return(
                <select id="trip-status-select" ref = {(input)=> this.selectedStatus = input}>
                    <option value="4">All</option>
                    <option value="1">Confirmed</option>
                    <option value="3">Cancelled</option>
                </select>
            );
        }
    }

    handleChangeForStart=date=> {
        this.setState({
        startDate: date
        });
    }

    handleChangeForEnd=date=> {
        this.setState({
        endDate: date
        });
    }

    setDateRange(){
        if(this.state.searchby==="driver-date-range"||this.state.searchby==="player-date-range"||this.state.searchby==="status-date-range"){
            return(
                <div id="trip-date-range">
                    From:
                    <DatePicker 
                        selected={this.state.startDate} 
                        onChange={this.handleChangeForStart}
                        maxDate={new Date()}
                        />
                    To:
                    <DatePicker 
                        selected={this.state.endDate} 
                        onChange={this.handleChangeForEnd}
                        maxDate={new Date()}
                        />
                </div>
            );
        }
    }

    searchByOnChange(){
        if(this.selectedSearchBy.value==="driver"){
            this.setState({
                searchby:"driver",
            });
        }else if(this.selectedSearchBy.value==="player"){
            this.setState({
                searchby:"player",
            });
        }else if(this.selectedSearchBy.value==="status"){
            this.setState({
                searchby:"status",
            });
        }else if(this.selectedSearchBy.value==="driver-date-range"){
            this.setState({
                searchby:"driver-date-range",
            });
        }else if(this.selectedSearchBy.value==="player-date-range"){
            this.setState({
                searchby:"player-date-range",
            });
        }else if(this.selectedSearchBy.value==="status-date-range"){
            this.setState({
                searchby:"status-date-range",
            });
        }
    }

    setTripInfo(){
        let tripTrs=[];
        for(let trip of this.state.tripInfo){
            tripTrs.push(
                <tr key={trip.tripId}>
                    <td>{trip.tripId}</td>
                    <td>{Moment(trip.tripDate).format('YYYY/MM/DD')}</td>
                    <td>{trip.tripTime}</td>
                    <td>{trip.tripPlayerId}</td>
                    <td>{trip.tripPlayer}</td>
                    <td>{trip.tripDriverId}</td>
                    <td>{trip.tripDriver}</td>
                    <td>{trip.tripTeam}</td>
                    <td>{trip.tripPlayerAddress}</td>
                    <td>{trip.tripAddress}</td>
                    <td>{trip.tripNote}</td>
                    <td>{trip.tripStatus}</td>
                </tr>
            );
        }
        return tripTrs;
    }

    render(){
        return(
            <div id="trip">
                <div id="trip-bar">
                    <div id="trip-export-excel">
                        <ReactToExcel 
                        table="my-trip-table" 
                        filename="exportTripInfo" 
                        sheet="exportTripInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                    <div id="trip-search">
                        <Button variant="danger" id="trip-search-btn" onClick={()=>this.searchTrips()}>Search</Button>
                    </div>
                    <div id="trip-pagesize">
                        <select ref = {(input)=> this.selectedPagesize = input}>
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                            <option>{this.state.totalElements}</option>
                        </select>
                    </div>
                    <div id="trip-pagesize-label">page&nbsp;size</div>
                    <div id="trip-searchby">
                        {this.setTripSearchby()}
                    </div>
                    {this.setDateRange()}
                    <div id="trip-searchby-select-box">
                        <select id="searchby-select" ref = {(input)=> this.selectedSearchBy = input} onChange={()=>this.searchByOnChange()}>
                            <option value="driver">Search by driver name</option>
                            <option value="player">Search by player name</option>
                            <option value="status">Search by trip status</option>
                            <option value="driver-date-range">Search by driver name(period)</option>
                            <option value="player-date-range">Search by player name(period)</option>
                            <option value="status-date-range">Search by trip status(period)</option>
                        </select>
                    </div>
                </div>
                <div id="trip-table">
                    <Table striped bordered hover id="my-trip-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>PlayerId</th>
                                <th>Player</th>
                                <th>DriverId</th>
                                <th>Driver</th>
                                <th>Team</th>
                                <th>PlayerAddress</th>
                                <th>TripAddress</th>
                                <th>Note</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.setTripInfo()}
                        </tbody>
                    </Table>
                </div>
                <div id="trip-footer">
                    <MyPagination 
                    totalPages={this.state.totalPages} 
                    totalElements={this.state.totalElements} 
                    updateTime={this.state.updateTime} 
                    currentPage={currentTripPage} 
                    loadNewPage={this.getTripsByPage}/>
                </div>
            </div>
        );
    }
}

export default Trip