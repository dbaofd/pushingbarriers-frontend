import React from "react";
import {Button,Modal} from "react-bootstrap"
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import '../css/TrainingModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';

class TrainingModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            trainingId:"",
            trainingPlayer:"",
            trainingDriver:"",
            trainingDriverId:"",
            trainingDriverGender:"",
            trainingTime:"",
            trainingNote:"",
            trainingStatus:"",
            trainingIndex:"",
        }
    }

    componentDidMount(){
        //pass "this" to parent component in order to 
        //let parent component can execute child functions
        this.props.onRef(this)
    }

    handleShow=(index)=>{
        this.setState({
            show:true,
            trainingIndex:index,
            trainingId:this.props.allTrainings[index].trainingId,
            trainingPlayer:this.props.allTrainings[index].trainingPlayer,
            trainingDriver:this.props.allTrainings[index].trainingDriver,
            trainingDriverId:this.props.allTrainings[index].trainingDriverId,
            trainingDriverGender:this.props.allTrainings[index].trainingDriverGender,
            trainingTime:this.props.allTrainings[index].trainingTime,
            trainingNote:this.props.allTrainings[index].trainingNote,
            trainingStatus:this.props.allTrainings[index].trainingStatus,
        })
    }

    handleClose=()=>{
        this.setState({
            show:false,
        })
    }

    handleChange=(event)=>{
        const target = event.target;
        const name=target.name;
        let newValue=target.value;
        if(name==="trainingStatus"){
            newValue=Number(target.value);
        }
        this.setState({
            [name]:newValue,
        });
    }

    setOptions(){
        if(this.state.trainingStatus===0){
            return (
                <>
                    <option value="0">Unconfirmed</option>
                    <option name="shouldremove" value="1">Confirmed</option>
                    <option value="3">Cancelled</option>
                </>
            );
        }else if(this.state.trainingStatus===1){
            return (
                <>
                    <option value="1">Confirmed</option>
                    <option name="shouldremove" value="0">Unconfirmed</option>
                    <option value="3">Cancelled</option>
                </>
            );
        }else if(this.state.trainingStatus===2){
            return (
                <>
                    <option value="0">Unconfirmed</option>
                    <option name="shouldremove" value="1">Confirmed</option>
                    <option value="3">Cancelled</option>
                </>
            );
        }else if(this.state.trainingStatus===3){
            return (
                <>
                    <option value="3">Cancelled</option>
                    <option name="shouldremove" value="1">Confirmed</option>
                    <option value="0">Unconfirmed</option>
                </>
            );
        }
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
    updateTrainingDetail(){
        let url=global.constants.api+"/updateTrainingDetail";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        formData.append('driver',this.state.trainingDriver);
        formData.append('driverId',this.state.trainingDriverId);
        formData.append('driverGender',this.state.trainingDriverGender);
        formData.append('time',this.state.trainingTime);
        formData.append('status',this.state.trainingStatus);
        formData.append("note",this.state.trainingNote)
        formData.append('id',this.state.trainingId);
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
                console.log(data.msg);
            }
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
        this.props.onSubmited(this.state.trainingIndex,this.state.trainingDriver,this.state.trainingDriverId,
            this.state.trainingDriverGender,this.state.trainingTime,this.state.trainingStatus,this.state.trainingNote);
        this.handleClose();
    }
    
    findDriverIndex(){
        for(let i=0;i<this.props.allDrivers.length;i++){
            if(this.props.allDrivers[i].driverId===this.state.trainingDriverId){
                return i;
            }
        }
        return 0;
    }
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header>
                <Modal.Title>Training Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="trainingDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Player:</label></td>
                                <td>{this.state.trainingPlayer}</td>
                            </tr>
                            <tr>
                                <td><label>Driver:</label></td>
                                <td>
                                    <Autocomplete
                                        id="combo-box-demo1"
                                        defaultValue={this.props.allDrivers[this.findDriverIndex()]}
                                        options={this.props.allDrivers}
                                        getOptionLabel={option => option.driverName}
                                        style={{ width: 200 }}
                                        renderInput={params => (
                                            <TextField {...params}   fullWidth />
                                        )}
                                        onChange={(event, value) =>{
                                            if(value!=null){
                                                //alert(value.driverName+value.driverId+value.driverGender)
                                                this.setState({
                                                    trainingDriver:value.driverName,
                                                    trainingDriverId:value.driverId,
                                                    trainingDriverGender:value.driverGender,
                                                });
                                            }
                                        }}
                                        />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Driver Id:</label></td>
                                <td><input type="text" disabled="disabled" value={this.state.trainingDriverId}/></td>
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
                                <td><label>Note:</label></td>
                                <td><textarea  name="trainingNote" placeholder="No more than 500 characters" maxLength="500" onChange={this.handleChange} defaultValue={this.state.trainingNote}/></td>
                            </tr>
                            <tr>
                                <td><label>Status:</label></td>
                                <td>
                                    <select name="trainingStatus" value={this.state.trainingStatus} onChange={this.handleChange}>
                                        {this.setOptions()}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>this.updateTrainingDetail()}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default TrainingModal;