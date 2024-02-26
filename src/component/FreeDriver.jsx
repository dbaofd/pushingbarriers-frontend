import React from 'react';
import {Button,Table} from "react-bootstrap";
import ReactToExcel from 'react-html-table-to-excel';
import Moment from 'moment';
import '../config.js';
import "../css/FreeDriver.css";
import * as MyToast from '../tools/MyToast';

var freeDrivers=[];
class FreeDriver extends React.Component{
    constructor(props){
        super(props);
        this.state={
            freeDrivers:"",
        }
    }

    getFreeDrivers(){
        let url;
        let headers=new Headers();
        if(this.selectedSearchBy.value==="Training"){
            url=global.constants.api+"/findFreeDriversForTraining";
        }else{
            url=global.constants.api+"/findFreeDriversForGame";
        }
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
                freeDrivers:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }
    
    freeDriversTemplate(index){
        let availability;
        let mystyle;
        if(this.state.freeDrivers[index].driverAvailability===1){
            availability="Available";
            mystyle={color:"green"}
        }else if(this.state.freeDrivers[index].driverAvailability===0){
            availability="Temporarily Unavailable";
            mystyle={color:"red"}
        }
        return(
            <tr key={this.state.freeDrivers[index].driverId}>
                <td>{this.state.freeDrivers[index].driverId}</td>
                <td>{this.state.freeDrivers[index].driverUserName}</td>
                <td>{this.state.freeDrivers[index].driverName}</td>
                <td>{this.state.freeDrivers[index].driverGender}</td>
                <td>{this.state.freeDrivers[index].driverPhoneNum}</td>
                <td>{this.state.freeDrivers[index].driverPlateNum}</td>
                <td>{Moment(this.state.freeDrivers[index].driverBirthday).format("YYYY/MM/DD")}</td>
                <td>{this.state.freeDrivers[index].driverAddress}</td>
                <td style={mystyle}>{availability}</td>
            </tr>
        );
    }

    setFreeDrivers(){
        freeDrivers=[];
        for(let i=0;i<this.state.freeDrivers.length;i++){
            //frozen account(permanently unavailable) will not be displayed
            if(this.state.freeDrivers[i].driverAvailability!==2){
                freeDrivers.push(this.freeDriversTemplate(i));
            }
        }
    }

    render(){
        this.setFreeDrivers();
        return(
            <div id="freedriver">
                <div id="freedriver-bar">
                    <div id="freedriver-export-excel">
                        <ReactToExcel 
                        table="my-freedriver-table" 
                        filename="exportfreedriverInfo" 
                        sheet="exportfreedriverInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                    <div id="freedriver-search">
                        <Button variant="danger" id="freedriver-search-btn" onClick={()=>this.getFreeDrivers()}>Search</Button>
                    </div>
                    <div id="freedriver-select-box">
                        <select id="freedriver-select" ref = {(input)=> this.selectedSearchBy = input}>
                            <option value="Training">Training</option>
                            <option value="Game">Game</option>
                        </select>
                    </div>
                    <div id="totalNumberOfFreeDrivers">
                        <li> {this.state.freeDrivers.length} drivers in total</li>
                    </div>
                </div>
                <div id="freedriver-table">
                        <Table striped bordered hover id="my-freedriver-table">
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
                                <th>Availability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {freeDrivers}
                            </tbody>
                        </Table>
                </div>
            </div>
        );
    }

}

export default FreeDriver;