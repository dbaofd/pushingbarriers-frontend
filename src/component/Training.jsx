import React from "react";
import '../css/Training.css';
import '../config.js';
import Moment from 'moment';
import ReactToExcel from 'react-html-table-to-excel';
import {Button,Table, Modal, ModalBody, ModalFooter} from "react-bootstrap";
import TrainingModal from "./TrainingModal";

var trainingTrsMonday=[];
var trainingTrsTuesday=[];
var trainingTrsWednesday=[];
var trainingTrsThursday=[];
var trainingTrsFriday=[];

class Training extends React.Component{
    constructor(props){
        super(props);
        this.state={
            trainingsInfo: "",
            allDrivers:"",
        }
    }

    getTraining(){
        let url=global.constants.api+"/alltrainings"
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
                trainingsInfo:data,
            });
        });
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
                alert(data.message+" wrong token!");
                data=[];
            }
            this.setState({
                allDrivers:data,
            });
        });
    }

    componentWillMount(){
        this.getTraining();
        this.getAllDriversInfo();
    }
    //click to confirm 
    // confirmTrip(e){
    //     if(e.target.getAttribute("class")==="btn btn-success"){
    //         e.target.setAttribute("class","btn btn-secondary")
    //         let url=global.constants.api+"/updateTrainingStatus"
    //         let headers=new Headers();
    //         headers.append("token",localStorage.getItem("token"));
    //         let formData=new FormData();
    //         formData.append('id',e.target.getAttribute("id"));
    //         formData.append('status',1);
    //         fetch(url,{
    //             method:"post",
    //             body:formData,
    //             headers:headers,//we need to put correct token to send the request
    //         }).then(res => res.json()
    //         ).then(data => {
    //             console.log(data.msg);
    //         });
    //     }
    // }
    getConfirmButtonType(status){
        if(status===0){
            return "success";
        }else if(status===1){
            return "secondary";
        }else if(status===2){
            return "warning";
        }else if(status===3){
            return "danger";
        }
    }

    trainingTrTemplate(index,buttonType){
        let status="";
        if(buttonType==="success"){
            status="Unconfirmed";
        }else if(buttonType==="secondary"){
            status="Confirmed";
        }else if(buttonType==="warning"){
            status="Refused";
        }else if(buttonType==="danger"){
            status="Cancelled";
        }
        return(
            <tr key={this.state.trainingsInfo[index].trainingId}>
                <td>{this.state.trainingsInfo[index].trainingId}</td>
                <td>{Moment(this.state.trainingsInfo[index].trainingDate).format('YYYY/MM/DD')}</td>
                <td>{this.state.trainingsInfo[index].trainingTime}</td>
                <td>{this.state.trainingsInfo[index].trainingPlayer}</td>
                <td>{this.state.trainingsInfo[index].trainingDriver}</td>
                <td>{this.state.trainingsInfo[index].trainingClub}</td>
                <td>{this.state.trainingsInfo[index].trainingPlayerAddress}</td>
                <td>{this.state.trainingsInfo[index].trainingAddress}</td>
                <td><div className="training_note_div">{this.state.trainingsInfo[index].trainingNote}</div></td>
                <td><Button variant={buttonType} id={this.state.trainingsInfo[index].trainingId}>{status}</Button></td>
                <td><Button variant="info" onClick={()=>this.handleModalShow(index)}>Edit</Button></td>
            </tr>
        );
    }

    setTrainings(){
        trainingTrsMonday=[];//initialize
        trainingTrsTuesday=[];
        trainingTrsWednesday=[];
        trainingTrsThursday=[];
        trainingTrsFriday=[];
        for(let i=0;i<this.state.trainingsInfo.length;i++){
            if(this.state.trainingsInfo[i].trainingDay==="Monday"){
                let buttonType;
                buttonType=this.getConfirmButtonType(this.state.trainingsInfo[i].trainingStatus)
                trainingTrsMonday.push(
                    this.trainingTrTemplate(i,buttonType)
                );
            }else if(this.state.trainingsInfo[i].trainingDay==="Tuesday"){
                let buttonType;
                buttonType=this.getConfirmButtonType(this.state.trainingsInfo[i].trainingStatus)
                trainingTrsTuesday.push(
                    this.trainingTrTemplate(i,buttonType)
                );
            }else if(this.state.trainingsInfo[i].trainingDay==="Wednesday"){
                let buttonType;
                buttonType=this.getConfirmButtonType(this.state.trainingsInfo[i].trainingStatus)
                trainingTrsWednesday.push(
                    this.trainingTrTemplate(i,buttonType)
                );
            }else if(this.state.trainingsInfo[i].trainingDay==="Thursday"){
                let buttonType;
                buttonType=this.getConfirmButtonType(this.state.trainingsInfo[i].trainingStatus)
                trainingTrsThursday.push(
                    this.trainingTrTemplate(i,buttonType)
                );
            }else if(this.state.trainingsInfo[i].trainingDay==="Friday"){
                let buttonType;
                buttonType=this.getConfirmButtonType(this.state.trainingsInfo[i].trainingStatus)
                trainingTrsFriday.push(
                    this.trainingTrTemplate(i,buttonType)
                );
            }
        }
    }

    onRef = (ref) => {//get "this" returned by child component
        this.child = ref
    }

    handleModalShow(index){//call child component function 
        this.child.handleShow(index);
    }

    onChangeState(index,trainingDriver,trainingDriverId,trainingDriverGender,trainingTime,trainingStatus,trainingNote){
        let data=this.state.trainingsInfo;
        data[index].trainingDriver=trainingDriver;
        data[index].trainingDriverId=trainingDriverId;
        data[index].trainingDriverGender=trainingDriverGender;
        data[index].trainingTime=trainingTime;
        data[index].trainingStatus=trainingStatus;
        data[index].trainingNote=trainingNote;
        this.setState({
            trainingsInfo:data,
        });
    }

    searchTrainingsByStatus(){
        let url;
        if(Number(this.selectedStatus.value)==4){
            url=global.constants.api+"/alltrainings";
        }else{
            url=global.constants.api+"/getTrainingsByStatus/"+this.selectedStatus.value;
        }
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
                trainingsInfo:data,
            });
        });
    }
    

    render(){
        this.setTrainings();
        return(
            <div id="training">
                <div id="training-bar">
                    <div id="training-export-excel">
                        <ReactToExcel 
                        table="my-training-table" 
                        filename="exportTrainingInfo" 
                        sheet="exportTrainingInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                    <div id="training-search">
                        <Button variant="danger" id="training-search-btn" onClick={()=>this.searchTrainingsByStatus()}>Search</Button>
                    </div>
                    <div id="training-status-select">
                        <select ref = {(input)=> this.selectedStatus = input}>
                            <option value="4">All</option>
                            <option value="0">Unconfirmed</option>
                            <option value="1">Confirmed</option>
                            <option value="2">Refused</option>
                            <option value="3">Cancelled</option>
                        </select>
                    </div>
                    <div id="totalNumberOfTrainings">
                        <li> {this.state.trainingsInfo.length} trainings in total</li>
                    </div>
                </div>
                <div id="training-table">
                    <Table striped bordered hover id="my-training-table">
                        {trainingTrsMonday.length!==0?
                        <>
                            <thead>
                                <tr><th>Monday</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Player</th>
                                    <th>Driver</th>
                                    <th>Club</th>
                                    <th>PlayerAddress</th>
                                    <th>TrainingAddress</th>
                                    <th>Note</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainingTrsMonday}
                            </tbody>
                        </>
                        :
                        <></>}

                        {trainingTrsTuesday.length!==0?
                        <>
                            <thead>
                                <tr><th>Tuesday</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Player</th>
                                    <th>Driver</th>
                                    <th>Club</th>
                                    <th>PlayerAddress</th>
                                    <th>TrainingAddress</th>
                                    <th>Note</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainingTrsTuesday}
                            </tbody>
                        </>
                        :
                        <></>}

                        {trainingTrsWednesday.length!==0?
                        <>
                            <thead>
                                <tr><th>Wednesday</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Player</th>
                                    <th>Driver</th>
                                    <th>Club</th>
                                    <th>PlayerAddress</th>
                                    <th>TrainingAddress</th>
                                    <th>Note</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainingTrsWednesday}
                            </tbody>
                        </>
                        :
                        <></>}

                        {trainingTrsThursday.length!==0?
                        <>
                            <thead>
                                <tr><th>Thursday</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Player</th>
                                    <th>Driver</th>
                                    <th>Club</th>
                                    <th>PlayerAddress</th>
                                    <th>TrainingAddress</th>
                                    <th>Note</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainingTrsThursday}
                            </tbody>
                        </>
                        :
                        <></>}

                        {trainingTrsFriday.length!==0?
                        <>
                            <thead>
                                <tr><th>Friday</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Player</th>
                                    <th>Driver</th>
                                    <th>Club</th>
                                    <th>PlayerAddress</th>
                                    <th>TrainingAddress</th>
                                    <th>Note</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainingTrsFriday}
                            </tbody>
                        </>
                        :
                        <></>}
                    </Table>
                    <TrainingModal 
                    onRef={this.onRef}
                    allTrainings={this.state.trainingsInfo}
                    allDrivers={this.state.allDrivers}
                    onSubmited={this.onChangeState.bind(this)}/>
                </div>
            </div>
        );//pass onRef function by using props,
        //once child component receives it and executes it, parent component 
        //will get "this" of child coponent
    }
}

export default Training;