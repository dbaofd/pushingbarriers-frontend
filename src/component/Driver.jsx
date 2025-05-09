import React from 'react';
import {Button,Table, Modal, ModalBody, ModalFooter, Dropdown, DropdownButton} from "react-bootstrap";
import Moment from 'moment';
import ReactToExcel from 'react-html-table-to-excel';

import "../css/Driver.css";
import '../config.js';
import ResetDriverPasswordModal from './ResetDriverPasswordModal';
import FreezeDriverAccountModal from './FreezeDriverAccountModal';
import ImageModal from './ImageModal';
import DriverModal from './DriverModal';
import * as MyToast from '../tools/MyToast';

var drivers;
class Driver extends React.Component{
    constructor(props){
        super(props);
        this.state={
            driverInfo:"",
        }
    }

    getAllDriversInfo(){
        let url=global.constants.api+"/allDrivers";
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
                driverInfo:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }

    componentWillMount(){
        this.getAllDriversInfo();
    }

    onRefForResetPassword = (ref) => {//get "this" returned by child component
        this.child = ref;
    }

    onRefForImageModal = (ref) =>{
        this.child2=ref;
    }

    onRefForFreezeDriverAccount = (ref) =>{
        this.child3=ref;
    }

    onRefForDriverModal = (ref) =>{
        this.child4=ref;
    }

    handleModalShow(driverId, driverName){
        this.child.handleShow(driverId, driverName);
    }
    
    handleModalShow2(driverId, flag, driverUserName){
        this.child2.handleShow(driverId, flag, driverUserName);
    }

    handleModalShow3(driverId, driverName, driverAvailability){
        this.child3.handleShow(driverId, driverName, driverAvailability);
    }

    handleModalShow4(driverIndex){
        this.child4.handleShow(driverIndex);
    }
    availabilityTransformation(availability){
        if(availability===0){
            return "Temporarily Unavailable"
        }else if(availability===2){
            return "Permanently Unavailable"
        }else if(availability===1){
            return "Available"
        }
    }

    driverTemplate(driverIndex){
        let tdStyle={};
        if(this.state.driverInfo[driverIndex].driverAvailability===2){
            tdStyle={
                color:"red"
            };
        }else if(this.state.driverInfo[driverIndex].driverAvailability===0){
            tdStyle={
                color:"orange"
            };
        }else if(this.state.driverInfo[driverIndex].driverAvailability===1){
            tdStyle={
                color:"green"
            };
        }
        return(
            <tr key={this.state.driverInfo[driverIndex].driverId}>
                <td>{this.state.driverInfo[driverIndex].driverId}</td>
                <td>{this.state.driverInfo[driverIndex].driverUserName}</td>
                <td>{this.state.driverInfo[driverIndex].driverName}</td>
                <td>{this.state.driverInfo[driverIndex].driverGender}</td>
                <td>{this.state.driverInfo[driverIndex].driverPhoneNum}</td>
                <td>{this.state.driverInfo[driverIndex].driverPlateNum}</td>
                <td>{Moment(this.state.driverInfo[driverIndex].driverBirthday).format('YYYY/MM/DD')}</td>
                <td>{this.state.driverInfo[driverIndex].driverAddress}</td>
                <td>{this.state.driverInfo[driverIndex].driverEmail}</td>
                <td>{this.state.driverInfo[driverIndex].driverStartDate===null?"NA":Moment(this.state.driverInfo[driverIndex].driverStartDate).format('YYYY/MM/DD')}</td>
                <td>{this.state.driverInfo[driverIndex].driverEndDate===null?"NA":Moment(this.state.driverInfo[driverIndex].driverEndDate).format('YYYY/MM/DD')}</td>
                <td>{this.state.driverInfo[driverIndex].driverSeatCapacity}</td>
                <td style={tdStyle}>{this.availabilityTransformation(this.state.driverInfo[driverIndex].driverAvailability)}</td>
                <td><div className="driver_note_div">{this.state.driverInfo[driverIndex].driverNote}</div></td>
                <td><Button variant="info" onClick={()=>this.handleModalShow2(this.state.driverInfo[driverIndex].driverId,"driverLicense",this.state.driverInfo[driverIndex].driverUserName)}>License</Button></td>
                <td><Button variant="info" onClick={()=>this.handleModalShow2(this.state.driverInfo[driverIndex].driverId,"driverBluecard",this.state.driverInfo[driverIndex].driverUserName)}>Bluecard</Button></td>
                <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Operations
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        <Dropdown.Item onClick={()=>this.handleModalShow(this.state.driverInfo[driverIndex].driverId,this.state.driverInfo[driverIndex].driverName)}>Reset</Dropdown.Item>
                        <Dropdown.Item onClick={()=>this.handleModalShow3(this.state.driverInfo[driverIndex].driverId, this.state.driverInfo[driverIndex].driverName, this.state.driverInfo[driverIndex].driverAvailability)}>{this.state.driverInfo[driverIndex].driverAvailability===2?"Unfreeze":"Freeze"}</Dropdown.Item>
                        <Dropdown.Item onClick={()=>this.handleModalShow4(driverIndex)}>Edit</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        );
    }

    setdrivers(){
        drivers=[];
        // for(let driver of this.state.driverInfo){
        //     drivers.push(this.driverTemplate(driver));
        // }
        for(let i=0;i<this.state.driverInfo.length;i++){
            drivers.push(this.driverTemplate(i));
        }
    }

    searchDriverByName(){
        let url;
        if(this.driverNameInput.value.length!==0){
            url=global.constants.api+"/findDriversByName/"+this.driverNameInput.value+"/"+this.selectedStatus.value;
        }else if(this.driverNameInput.value.length===0&&this.selectedStatus.value!=="3"){
            url=global.constants.api+"/findDriversByDriverAvailability/"+this.selectedStatus.value;
        }else if(this.driverNameInput.value.length===0&&this.selectedStatus.value==="3"){
            url=global.constants.api+"/allDrivers";
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
                driverInfo:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }

    render(){
        this.setdrivers();
        return(
            <div id="driver">
                <div id="driver-bar">
                    <div id="driver-export-excel">
                        <ReactToExcel 
                        table="my-driver-table" 
                        filename="exportdriverInfo" 
                        sheet="exportdriverInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                    <div id="driver-search">
                        <Button variant="danger" id="driver-search-btn" onClick={()=>this.searchDriverByName()}>Search</Button>
                    </div>
                    <div id="driver-status-select">
                        <select ref = {(input)=> this.selectedStatus = input}>
                            <option value="3">All</option>
                            <option value="0">Temporarily Unavailable</option>
                            <option value="1">Available</option>
                            <option value="2">Permanently Unavailable</option>
                        </select>
                    </div>
                    <div id="driver-name-textbox">
                        <input type="text" id="driver-name-input" placeholder="Search by driver name" ref = {(input)=> this.driverNameInput = input}/>
                    </div>
                    <div id="totalNumberOfDrivers">
                        <li>{drivers.length} drivers in total</li>
                    </div>
                </div>
                <div id="driver-table">
                    <Table striped bordered hover id="my-driver-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>UserName</th>
                                <th>RealName</th>
                                <th>Gender</th>
                                <th>PhoneNum</th>
                                <th>PlateNum</th>
                                <th>Birthday</th>
                                <th>Address</th>
                                <th>Email</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Seat Capacity</th>
                                <th>Availability</th>
                                <th>Note</th>
                                <th>License</th>
                                <th>Bluecard</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers}
                        </tbody>
                    </Table>
                    <ResetDriverPasswordModal onRef={this.onRefForResetPassword}/>
                    <ImageModal onRef={this.onRefForImageModal}/>
                    <FreezeDriverAccountModal onRef={this.onRefForFreezeDriverAccount} onSubmited={this.searchDriverByName.bind(this)}/>
                    <DriverModal 
                    onRef={this.onRefForDriverModal}
                    allDrivers={this.state.driverInfo}
                    onSubmited={this.searchDriverByName.bind(this)}/>
                </div>
            </div>);
    }
}

export default Driver;