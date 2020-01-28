import React from "react";
import '../css/Training.css';
import '../config.js';
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
                <td>{this.state.trainingsInfo[index].trainingDate}</td>
                <td id={'training_time'+this.state.trainingsInfo[index].trainingId}>{this.state.trainingsInfo[index].trainingTime}</td>
                <td>{this.state.trainingsInfo[index].trainingPlayer}</td>
                <td id={'training_driver'+this.state.trainingsInfo[index].trainingId}>{this.state.trainingsInfo[index].trainingDriver}</td>
                <td>{this.state.trainingsInfo[index].trainingClub}</td>
                <td>{this.state.trainingsInfo[index].trainingPlayerAddress}</td>
                <td>{this.state.trainingsInfo[index].trainingAddress}</td>
                <td id={'training_note'+this.state.trainingsInfo[index].trainingId}><div className="training_note_div">{this.state.trainingsInfo[index].trainingNote}</div></td>
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

    

    render(){
        this.setTrainings();
        return(
            <div id="training">
                <Table striped bordered hover id="my-training-table">
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
                            <th>Confirm</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingTrsMonday}
                    </tbody>
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
                            <th>Confirm</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingTrsTuesday}
                    </tbody>
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
                            <th>Confirm</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingTrsWednesday}
                    </tbody>
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
                            <th>Confirm</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingTrsThursday}
                    </tbody>
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
                            <th>Confirm</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingTrsFriday}
                    </tbody>
                </Table>
                <TrainingModal 
                onRef={this.onRef}
                allTrainings={this.state.trainingsInfo}
                allDrivers={this.state.allDrivers}
                onSubmited={this.onChangeState.bind(this)}/>
            </div>
        );//pass onRef function by using props,
        //once child component receives it and executes it, parent component 
        //will get "this" of child coponent
    }
}

export default Training;