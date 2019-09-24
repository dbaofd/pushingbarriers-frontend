import React from "react";
import '../css/Training.css';
import {Button,Table, Modal, ModalBody, ModalFooter} from "react-bootstrap"
import TrainingModal from "./TrainingModal";

var trainingTrsMonday=[];
var trainingTrsTuesday=[];
var trainingTrsWednesday=[];
var trainingTrsThursday=[];
var api="";

class Training extends React.Component{
    constructor(props){
        super(props);
        this.state={
            trainingsInfo: "",
        }
    }

    getTraining(){
        let url=api+"/alltrainings"
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

    componentWillMount(){
        this.getTraining();
    }
    //click to confirm 
    confirmTrip(e){
        if(e.target.getAttribute("class")==="btn btn-success"){
            e.target.setAttribute("class","btn btn-secondary")
            let url=api+"/updateConfirmation"
            let headers=new Headers();
            headers.append("token",localStorage.getItem("token"));
            let formData=new FormData();
            formData.append('id',e.target.getAttribute("id"));
            formData.append('status',1);
            fetch(url,{
                method:"post",
                body:formData,
                headers:headers,//we need to put correct token to send the request
            }).then(res => res.json()
            ).then(data => {
                console.log(data.msg);
            });
        }
    }
    getConfirmButtonType(status){
        if(status==="0"){
            return "success";
        }else if(status==="1"){
            return "secondary";
        }else if(status==="2"){
            return "danger";
        }
    }

    trainingTrTemplate(training,buttonType){
        
        return(
            <tr key={training.trainingId}>
                <td>{training.trainingId}</td>
                <td id={'training_time'+training.trainingId}>{training.trainingTime}</td>
                <td>{training.trainingPlayer}</td>
                <td id={'training_driver'+training.trainingId}>{training.trainingDriver}</td>
                <td>{training.trainingClub}</td>
                <td>{training.trainingPlayerAddress}</td>
                <td>{training.trainingAddress}</td>
                <td id={'training_note'+training.trainingId}><div class="training_note_div">{training.trainingNote}</div></td>
                <td><Button variant={buttonType} id={training.trainingId} onClick={(e)=>this.confirmTrip(e)}>confirm</Button></td>
                <td><Button variant="info" onClick={()=>this.handleModalShow(training)}>Edit</Button></td>
            </tr>
        );
    }

    setTrainings(){
        trainingTrsMonday=[];//initialize
        trainingTrsTuesday=[];
        trainingTrsWednesday=[];
        trainingTrsThursday=[];
        for(let training of this.state.trainingsInfo){
            if(training.trainingDay==="Monday"){
                let buttonType;
                buttonType=this.getConfirmButtonType(training.trainingConfirmation)
                trainingTrsMonday.push(
                    this.trainingTrTemplate(training,buttonType)
                );
            }else if(training.trainingDay==="Tuesday"){
                let buttonType;
                buttonType=this.getConfirmButtonType(training.trainingConfirmation)
                trainingTrsTuesday.push(
                    this.trainingTrTemplate(training,buttonType)
                );
            }else if(training.trainingDay==="Wednesday"){
                let buttonType;
                buttonType=this.getConfirmButtonType(training.trainingConfirmation)
                trainingTrsWednesday.push(
                    this.trainingTrTemplate(training,buttonType)
                );
            }else if(training.trainingDay==="Thursday"){
                let buttonType;
                buttonType=this.getConfirmButtonType(training.trainingConfirmation)
                trainingTrsThursday.push(
                    this.trainingTrTemplate(training,buttonType)
                );
            }
        }
    }

    onRef = (ref) => {//get "this" returned by child component
        this.child = ref
    }

    handleModalShow(training){
        this.child.handleShow(training);
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
                </Table>
                <TrainingModal onRef={this.onRef}/>
            </div>
        );//pass onRef function by using props,
        //once child component receives it and executes it, parent component 
        //will get "this" of child coponent
    }
}

export default Training;