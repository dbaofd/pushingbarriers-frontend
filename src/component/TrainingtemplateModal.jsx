import React from 'react';
import {Button,Modal} from "react-bootstrap";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import '../css/TrainingtemplateModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';

class TrainingtemplateModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            trainingIndex:"",
            trainingDay:"",
            trainingTime:"",
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
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleShow=(trainingIndex)=>{
        this.setState({
            show:true,
            trainingIndex:trainingIndex,
            trainingDay:this.props.trainingTemplate[trainingIndex].trainingDay,
            trainingTime:this.props.trainingTemplate[trainingIndex].trainingTime,
            trainingPlayerId:this.props.trainingTemplate[trainingIndex].trainingPlayerId,
            trainingPlayer:this.props.trainingTemplate[trainingIndex].trainingPlayer,
            trainingPlayerGender:this.props.trainingTemplate[trainingIndex].trainingPlayerGender,
            trainingDriverId:this.props.trainingTemplate[trainingIndex].trainingDriverId,
            trainingDriver:this.props.trainingTemplate[trainingIndex].trainingDriver,
            trainingDriverGender:this.props.trainingTemplate[trainingIndex].trainingDriverGender,
            trainingClub:this.props.trainingTemplate[trainingIndex].trainingClub,
            trainingPlayerAddress:this.props.trainingTemplate[trainingIndex].trainingPlayerAddress,
            trainingAddress:this.props.trainingTemplate[trainingIndex].trainingAddress,
        })
    }

    handleChange(event){
        const target = event.target;
        const name=target.name;
        const newValue=target.value;
        this.setState({
            [name]:newValue,
        });
    }

    handleClose=()=>{
        this.setState({
            show:false,
        })
    }

    componentDidMount(){
        //pass "this" to parent component in order to 
        //let parent component can execute child functions
        this.props.onRef(this)
    }

    

    handleSubmit(event){
        event.preventDefault();
        let url=global.constants.api+"/updateTrainingTemplateInfo";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        formData.append('day',this.state.trainingDay);
        formData.append('time',this.state.trainingTime);
        formData.append('playerId',this.state.trainingPlayerId);
        formData.append("playerName",this.state.trainingPlayer);
        formData.append('playerGender',this.state.trainingPlayerGender);
        formData.append('driverId',this.state.trainingDriverId);
        formData.append('driverName',this.state.trainingDriver);
        formData.append('driverGender',this.state.trainingDriverGender);
        formData.append('club',this.state.trainingClub);
        formData.append('playerAddress',this.state.trainingPlayerAddress);
        formData.append('trainingAddress',this.state.trainingAddress);
        formData.append('id',this.props.trainingTemplate[this.state.trainingIndex].trainingId);
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
                this.props.onSubmited(this.state.trainingIndex,this.state.trainingDay,this.state.trainingTime,
                    this.state.trainingPlayerId,this.state.trainingPlayer,this.state.trainingDriverId,
                    this.state.trainingDriver,this.state.trainingClub,this.state.trainingPlayerAddress,
                    this.state.trainingAddress);
                console.log(data.msg);
            }
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
        this.handleClose();
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

    findDriverIndex(){
        for(let i=0;i<this.props.allDrivers.length;i++){
            if(this.props.allDrivers[i].driverId===this.state.trainingDriverId){
                return i;
            }
        }
        return 0;
    }

    findPlayerIndex(){
        for(let i=0;i<this.props.allPlayers.length;i++){
            if(this.props.allPlayers[i].driverId===this.state.trainingPlayerId){
                return i;
            }
        }
        return 0;
    }

    findTeamIndex(){
        for(let i=0;i<this.props.allTeams.length;i++){
            if(this.props.allTeams[i].teamName===this.state.trainingClub){
                return i;
            }
        }
        return 0;
    }
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <form onSubmit={this.handleSubmit}>
                <Modal.Header>
                <Modal.Title>Training Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="trainingDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Day:</label></td>
                                <td>
                                    <select name="trainingDay" value={this.state.trainingDay} onChange={this.handleChange}>
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
                                    <select name="trainingTime" value={this.state.trainingTime} onChange={this.handleChange}>
                                        {this.setTime()}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>PlayerId:</label></td>
                                <td><input type="text" disabled="disabled" name="trainingPlayerId"value={this.state.trainingPlayerId}/></td>
                            </tr>
                            <tr>
                                <td><label>Player:</label></td>
                                <td>
                                    <Autocomplete
                                    id="combo-box-demo1"
                                    defaultValue={this.props.allPlayers[this.findPlayerIndex()]}
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
                                <td><input type="text" disabled="disabled" name="trainingPlayerGender" value={this.state.trainingPlayerGender}/></td>
                            </tr>
                            <tr>
                                <td><label>DriverId:</label></td>
                                <td><input type="text" disabled="disabled" name="trainingDriverId" value={this.state.trainingDriverId}/></td>
                            </tr>
                            <tr>
                                <td><label>Driver:</label></td>
                                <td>
                                    <Autocomplete
                                    id="combo-box-demo2"
                                    defaultValue={this.props.allDrivers[this.findDriverIndex()]}
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
                                <td><input type="text" disabled="disabled" name="trainingDriverGender" value={this.state.trainingDriverGender} /></td>
                            </tr>
                            <tr>
                                <td><label>Club:</label></td>
                                <td>
                                    <Autocomplete
                                        id="combo-box-demo3"
                                        defaultValue={this.props.allTeams[this.findTeamIndex()]}
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
                                <td><input type="text" disabled="disabled" name="trainingPlayerAddress"value={this.state.trainingPlayerAddress} onChange={this.handleChange} maxLength="170"/></td>
                            </tr>
                            <tr>
                                <td><label>TrainingAddress</label></td>
                                <td><input type="text" name="trainingAddress" value={this.state.trainingAddress} onChange={this.handleChange} maxLength="170"/></td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" style={{ float:'right' }}type="submit">
                        Save Changes
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default TrainingtemplateModal;