import React from "react";
import "../css/Trainingtemplate.css";
import '../config.js';
import {Button,Table, Modal, ModalBody, ModalFooter} from "react-bootstrap"

var trainingTemTrsMonday=[];
var trainingTemTrsTuesday=[];
var trainingTemTrsWednesday=[];
var trainingTemTrsThursday=[];
class Trainingtemplate extends React.Component{
    constructor(props){
        super(props);
        this.state={
            trainingTemplateInfo: "",
        }
    }
    getTrainingTemplate(){
        let url=global.constants.api+"/alltrainingtemplateinfo";
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
                trainingTemplateInfo:data,
            });
        });
    }

    componentWillMount(){
        this.getTrainingTemplate();
    }

    trainingTemTrTemplate(training){
        return(
            <tr key={training.trainingId}>
                <td>{training.trainingId}</td>
                <td id={'training_time'+training.trainingId}>{training.trainingTime}</td>
                <td>{training.trainingPlayerId}</td>
                <td>{training.trainingPlayer}</td>
                <td>{training.trainingDriverId}</td>
                <td id={'training_driver'+training.trainingId}>{training.trainingDriver}</td>
                <td>{training.trainingClub}</td>
                <td>{training.trainingPlayerAddress}</td>
                <td>{training.trainingAddress}</td>
                <td><Button variant="info">Edit</Button></td>
            </tr>
        );
    }

    setTrainingTem(){
        trainingTemTrsMonday=[];//initialize
        trainingTemTrsTuesday=[];
        trainingTemTrsWednesday=[];
        trainingTemTrsThursday=[];
        for(let training of this.state.trainingTemplateInfo){
            if(training.trainingDay==="Monday"){
                trainingTemTrsMonday.push(
                    this.trainingTemTrTemplate(training)
                );
            }else if(training.trainingDay==="Tuesday"){
                trainingTemTrsTuesday.push(
                    this.trainingTemTrTemplate(training)
                );
            }else if(training.trainingDay==="Wednesday"){
                trainingTemTrsWednesday.push(
                    this.trainingTemTrTemplate(training)
                );
            }else if(training.trainingDay==="Thursday"){
                trainingTemTrsThursday.push(
                    this.trainingTemTrTemplate(training)
                );
            }
        }
    }

    render(){
        this.setTrainingTem();
        return(
            <div id="trainingtemplate">
                <Table striped bordered hover id="my-trainingtemplate-table">
                    <thead>
                        <tr><th>Monday</th></tr>
                        <tr>
                            <th>#</th>
                            <th>Time</th>
                            <th>Player Id</th>
                            <th>Player</th>
                            <th>Driver Id</th>
                            <th>Driver</th>
                            <th>Club</th>
                            <th>PlayerAddress</th>
                            <th>TrainingAddress</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingTemTrsMonday}
                    </tbody>
                    <thead>
                        <tr><th>Tuesday</th></tr>
                        <tr>
                            <th>#</th>
                            <th>Time</th>
                            <th>Player Id</th>
                            <th>Player</th>
                            <th>Driver Id</th>
                            <th>Driver</th>
                            <th>Club</th>
                            <th>PlayerAddress</th>
                            <th>TrainingAddress</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingTemTrsTuesday}
                    </tbody>
                    <thead>
                        <tr><th>Wednesday</th></tr>
                        <tr>
                            <th>#</th>
                            <th>Time</th>
                            <th>Player Id</th>
                            <th>Player</th>
                            <th>Driver Id</th>
                            <th>Driver</th>
                            <th>Club</th>
                            <th>PlayerAddress</th>
                            <th>TrainingAddress</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingTemTrsWednesday}
                    </tbody>
                    <thead>
                        <tr><th>Thursday</th></tr>
                        <tr>
                            <th>#</th>
                            <th>Time</th>
                            <th>Player Id</th>
                            <th>Player</th>
                            <th>Driver Id</th>
                            <th>Driver</th>
                            <th>Club</th>
                            <th>PlayerAddress</th>
                            <th>TrainingAddress</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingTemTrsThursday}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Trainingtemplate;