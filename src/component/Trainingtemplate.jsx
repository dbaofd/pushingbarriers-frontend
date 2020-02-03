import React from "react";
import "../css/Trainingtemplate.css";
import '../config.js';
import TrainingtemplateModal from './TrainingtemplateModal';
import AddNewTrainingModal from './AddNewTrainingModal';
import DeleteTrainingModal from './DeleteTrainingModal';
import {Button,Table, Modal, ModalBody, ModalFooter} from "react-bootstrap"
import ReactToExcel from 'react-html-table-to-excel';

var trainingTemTrsMonday;
var trainingTemTrsTuesday;
var trainingTemTrsWednesday;
var trainingTemTrsThursday;
var trainingTemTrsFriday;
class Trainingtemplate extends React.Component{
    constructor(props){
        super(props);
        this.state={
            trainingTemplateInfo: "",
            allPlayers:"",
            allDrivers:"",
            allTeams:"",
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
                alert(data.message+" wrong token!");
                data=[];
            }
            this.setState({
                allPlayers:data,
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

    getAllTeamsInfo(){
        let url=global.constants.api+"/findAllTeams";
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
                allTeams:data,
            });
        });
    }

    componentWillMount(){
        this.getTrainingTemplate();
        this.getAllDriversInfo();
        this.getAllPlayersInfo();
        this.getAllTeamsInfo();
    }

    onRefForTrainingTemplateModal = (ref) => {//get "this" returned by child component
        this.child = ref;
    }

    handleModalShow(trainingIndex){
        this.child.handleShow(trainingIndex);
    }

    onRefForAddNewTrainingModal = (ref) => {
        this.child2 = ref;
    }

    handleModalShow2(){
        this.child2.handleShow();
    }

    onRefForDeleteTrainingModal = (ref) => {
        this.child3 = ref;
    }

    handleModalShow3(trainingId){
        this.child3.handleShow(trainingId);
    }

    trainingTemTrTemplate(trainingIndex){
        return(
            <tr key={this.state.trainingTemplateInfo[trainingIndex].trainingId}>
                <td>{this.state.trainingTemplateInfo[trainingIndex].trainingId}</td>
                <td id={'training_time'+this.state.trainingTemplateInfo[trainingIndex].trainingId}>{this.state.trainingTemplateInfo[trainingIndex].trainingTime}</td>
                <td>{this.state.trainingTemplateInfo[trainingIndex].trainingPlayerId}</td>
                <td>{this.state.trainingTemplateInfo[trainingIndex].trainingPlayer}</td>
                <td>{this.state.trainingTemplateInfo[trainingIndex].trainingDriverId}</td>
                <td id={'training_driver'+this.state.trainingTemplateInfo[trainingIndex].trainingId}>{this.state.trainingTemplateInfo[trainingIndex].trainingDriver}</td>
                <td>{this.state.trainingTemplateInfo[trainingIndex].trainingClub}</td>
                <td>{this.state.trainingTemplateInfo[trainingIndex].trainingPlayerAddress}</td>
                <td>{this.state.trainingTemplateInfo[trainingIndex].trainingAddress}</td>
                <td><Button variant="info" onClick={()=>this.handleModalShow(trainingIndex)}>Edit</Button></td>
                <td><Button variant="danger" style={{ float: 'left' }} onClick={()=>this.handleModalShow3(this.state.trainingTemplateInfo[trainingIndex].trainingId)}>Delete</Button></td>
            </tr>
        );
    }

    setTrainingTem(){
        trainingTemTrsMonday=[];//initialize
        trainingTemTrsTuesday=[];
        trainingTemTrsWednesday=[];
        trainingTemTrsThursday=[];
        trainingTemTrsFriday=[];
        for(let i=0;i<this.state.trainingTemplateInfo.length;i++){
            if(this.state.trainingTemplateInfo[i].trainingDay==="Monday"){
                trainingTemTrsMonday.push(
                    this.trainingTemTrTemplate(i)
                );
            }else if(this.state.trainingTemplateInfo[i].trainingDay==="Tuesday"){
                trainingTemTrsTuesday.push(
                    this.trainingTemTrTemplate(i)
                );
            }else if(this.state.trainingTemplateInfo[i].trainingDay==="Wednesday"){
                trainingTemTrsWednesday.push(
                    this.trainingTemTrTemplate(i)
                );
            }else if(this.state.trainingTemplateInfo[i].trainingDay==="Thursday"){
                trainingTemTrsThursday.push(
                    this.trainingTemTrTemplate(i)
                );
            }else if(this.state.trainingTemplateInfo[i].trainingDay==="Friday"){
                trainingTemTrsFriday.push(
                    this.trainingTemTrTemplate(i)
                );
            }
        }
    }

    //once child component update player info, child component will call this function to update this component state
    onChangeState(trainingIndex,trainingDay,trainingTime,trainingPlayerId,trainingPlayer,trainingDriverId,
    trainingDriver,trainingClub,trainingPlayerAddress,trainingAddress){
        let data=this.state.trainingTemplateInfo;
        data[trainingIndex].trainingDay=trainingDay;
        data[trainingIndex].trainingTime=trainingTime;
        data[trainingIndex].trainingPlayerId=trainingPlayerId;
        data[trainingIndex].trainingPlayer=trainingPlayer;
        data[trainingIndex].trainingDriverId=trainingDriverId;
        data[trainingIndex].trainingDriver=trainingDriver;
        data[trainingIndex].trainingClub=trainingClub;
        data[trainingIndex].trainingPlayerAddress=trainingPlayerAddress;
        data[trainingIndex].trainingAddress=trainingAddress;
        this.setState({
            trainingTemplateInfo: data,
        });
    }

    render(){
        this.setTrainingTem();
        return(
            <div id="trainingtemplate">
                <div id="trainingtemplate-bar">
                    <div id="trainingtemplate-export-excel">
                        <ReactToExcel 
                        table="my-trainingtemplate-table" 
                        filename="exporttrainingtemplateInfo" 
                        sheet="exporttrainingtemplateInfo"
                        id="export-excel-btn"
                        buttonText="Export"/>
                    </div>
                    <div id="trainingtemplate-add">
                        <Button variant="primary" id="player-add-btn" onClick={()=>this.handleModalShow2()}>New Training</Button>
                    </div>
                    <div id="totalNumberOfTrainingTrips">
                        <li>{this.state.trainingTemplateInfo.length} trips in total</li>
                    </div>
                </div>
                <div id="trainingtemplate-table">
                    <Table striped bordered hover id="my-trainingtemplate-table">
                        {trainingTemTrsMonday.length!==0?
                        <>
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
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainingTemTrsMonday}
                        </tbody>
                        </>
                        :<></>}

                        {trainingTemTrsTuesday.length!==0?
                        <>
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
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainingTemTrsTuesday}
                        </tbody>
                        </>
                        :<></>}
                        
                        {trainingTemTrsWednesday.length!==0?
                        <>
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
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainingTemTrsWednesday}
                        </tbody>
                        </>
                        :<></>}

                        {trainingTemTrsThursday.length!==0?
                        <>
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
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainingTemTrsThursday}
                        </tbody>
                        </>
                        :<></>}

                        {trainingTemTrsFriday.length!==0?
                        <>
                        <thead>
                            <tr><th>Friday</th></tr>
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
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainingTemTrsFriday}
                        </tbody>
                        </>
                        :<></>}
                    </Table>
                    <TrainingtemplateModal 
                    allPlayers={this.state.allPlayers}
                    allDrivers={this.state.allDrivers}
                    allTeams={this.state.allTeams}
                    trainingTemplate={this.state.trainingTemplateInfo} 
                    onRef={this.onRefForTrainingTemplateModal} 
                    onSubmited={this.onChangeState.bind(this)}
                    />

                    <AddNewTrainingModal
                    onRef={this.onRefForAddNewTrainingModal}
                    allPlayers={this.state.allPlayers}
                    allDrivers={this.state.allDrivers}
                    allTeams={this.state.allTeams}
                    onSubmited={this.getTrainingTemplate.bind(this)}
                    />

                    <DeleteTrainingModal
                    onRef={this.onRefForDeleteTrainingModal}
                    onDeleted={this.getTrainingTemplate.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default Trainingtemplate;