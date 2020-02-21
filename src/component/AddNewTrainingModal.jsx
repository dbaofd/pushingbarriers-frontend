import React from 'react';
import {Button,Modal} from "react-bootstrap"

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import '../css/AddNewTrainingModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';

class AddNewTrainingModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            trainingPlayerId:"",
            trainingPlayer:"",
            trainingPlayerGender:"",
            trainingDriverId:"",
            trainingDriver:"",
            trainingDriverGender:"",
            trainingClub:"",
            trainingPlayerAddress:"",
            trainingAddress:"",
        }
    }

    handleShow=()=>{
        this.setState({
            show:true,
        });
    }

    handleClose=()=>{
        this.setState({
            show:false,
        })
    }

    handleChange=(event)=>{
        const target = event.target;
        const name=target.name;
        const newValue=target.value;
        this.setState({
            [name]:newValue,
        });
    }

    componentDidMount(){
        //pass "this" to parent component in order to 
        //let parent component can execute child functions
        this.props.onRef(this)
    }
    handleSubmit=(event)=>{
        event.preventDefault();//this one is necessary
        if(this.state.trainingPlayerId!==""&&this.state.trainingDriverId!==""&&
            this.state.trainingClub!==""){
            let url=global.constants.api+"/insertNewTraining";
            let headers=new Headers();
            headers.append("token",localStorage.getItem("token"));
            let formData=new FormData();
            formData.append('day',document.getElementById("newTrainingDay").value);
            formData.append('time',document.getElementById("newTrainingTime").value);
            formData.append('playerId',this.state.trainingPlayerId);
            formData.append("playerName",this.state.trainingPlayer);
            formData.append('playerGender',this.state.trainingPlayerGender);
            formData.append('driverId',this.state.trainingDriverId);
            formData.append('driverName',this.state.trainingDriver);
            formData.append('driverGender',this.state.trainingDriverGender);
            formData.append('club',this.state.trainingClub);
            formData.append('playerAddress',this.state.trainingPlayerAddress);
            formData.append('trainingAddress',this.state.trainingAddress);
            fetch(url,{
                method:"post",
                body:formData,
                headers:headers,//we need to put correct token to send the request
            }).then(res => res.json()
            ).then(data => {
                if(data.code===401){
                    MyToast.notify(data.message+" wrong token!", "error");
                }else{
                    MyToast.notify(data.msg, "success");
                    this.props.onSubmited();
                    console.log(data.msg);
                }
            }).catch(
                (error)=>{
                    MyToast.notify("Network request failed", "error");
                    console.error('Error:', error);
            });
            this.handleClose();
        }else{
            alert("Please fill all the empty fields!")
        }
    }

    componentDidMount(){
        //pass "this" to parent component in order to 
        //let parent component can execute child functions
        this.props.onRef(this)
    }
    setTime(){
        let timeOptions=[];
        let a,b;
        let count=0;
        for(let i=0;i<12;i++){
            for(let j=0;j<60;j=j+15){
                count++;
                if(i<10){
                    a='0'+i;
                }else{
                    a=i;
                }
                if(j<10){
                    b='0'+j
                }else{
                    b=j;
                }
                timeOptions.push(<option key={count}>{a+":"+b+"am"}</option>);
            }
        }
        for(let j=0;j<60;j=j+15){
            count++;
            if(j<10){
                b='0'+j
            }else{
                b=j;
            }
            timeOptions.push(<option key={count}>{12+":"+b+"pm"}</option>);
        }
        for(let i=1;i<12;i++){
            for(let j=0;j<60;j=j+15){
                count++;
                if(i<10){
                    a='0'+i;
                }else{
                    a=i;
                }
                if(j<10){
                    b='0'+j
                }else{
                    b=j;
                }
                timeOptions.push(<option key={count}>{a+":"+b+"pm"}</option>);
            }
        }
        return timeOptions;
    }
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <form onSubmit={this.handleSubmit}>
                <Modal.Header>
                <Modal.Title>New Training</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="newTrainingDetail"> 
                    <tbody>
                            <tr>
                                <td><label>Day:</label></td>
                                <td>
                                    <select id="newTrainingDay">
                                        <option>Monday</option>
                                        <option>Tuesday</option>
                                        <option>Wednesday</option>
                                        <option>Thursday</option>
                                        <option>Friday</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Time:</label></td>
                                <td>
                                    <select id="newTrainingTime">
                                        {this.setTime()}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>PlayerId:</label></td>
                                <td><input type="text" required disabled="disabled" name="trainingPlayerId" value={this.state.trainingPlayerId} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Player:</label></td>
                                <td>
                                    <Autocomplete
                                    id="combo-box-demo4"
                                    defaultValue={this.state.trainingPlayer}
                                    options={this.props.allPlayers}
                                    getOptionLabel={option => option.playerName}
                                    style={{ width: 200 }}
                                    renderInput={params => (
                                        <TextField {...params}   fullWidth />
                                    )}
                                    onChange={(event, value) =>{
                                        if(value!=null){
                                            this.setState({
                                                trainingPlayerId:value.playerId,
                                                trainingPlayerGender:value.playerGender,
                                                trainingPlayerAddress:value.playerAddress,
                                                trainingPlayer:value.playerName,
                                            });
                                        }
                                    }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>PlayerGender</label></td>
                                <td><input type="text" disabled="disabled" name="trainingPlayerGender" value={this.state.trainingPlayerGender} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>DriverId:</label></td>
                                <td><input type="text" disabled="disabled" name="trainingDriverId" value={this.state.trainingDriverId} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Driver:</label></td>
                                <td>
                                    <Autocomplete
                                    id="combo-box-demo5"
                                    defaultValue={this.state.trainingDriver}
                                    options={this.props.allDrivers}
                                    getOptionLabel={option => option.driverName}
                                    style={{ width: 200 }}
                                    renderInput={params => (
                                        <TextField {...params}   fullWidth />
                                    )}
                                    onChange={(event, value) =>{
                                        if(value!=null){
                                            this.setState({
                                                trainingDriverId:value.driverId,
                                                trainingDriverGender:value.driverGender,
                                                trainingDriver:value.driverName,
                                            });
                                        }
                                    }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>DriverGender</label></td>
                                <td><input type="text" disabled="disabled" name="trainingDriverGender"  value={this.state.trainingDriverGender} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Club:</label></td>
                                <td>
                                <Autocomplete
                                    id="combo-box-demo6"
                                    defaultValue={this.state.trainingClub}
                                    options={this.props.allTeams}
                                    getOptionLabel={option => option.teamName}
                                    style={{ width: 200 }}
                                    renderInput={params => (
                                        <TextField {...params}   fullWidth />
                                    )}
                                    onChange={(event, value) =>{
                                        if(value!=null){
                                            this.setState({
                                                trainingClub:value.teamName,
                                            });
                                        }
                                    }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><label>PlayerAddress:</label></td>
                                <td><input type="text" disabled="disabled" name="trainingPlayerAddress" value={this.state.trainingPlayerAddress} onChange={this.handleChange} maxLength="170"/></td>
                            </tr>
                            <tr>
                                <td><label>TrainingAddress</label></td>
                                <td><input type="text" required name="trainingAddress" onChange={this.handleChange} maxLength="170"/></td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default AddNewTrainingModal;