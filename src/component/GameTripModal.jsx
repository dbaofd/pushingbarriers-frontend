import React from "react";
import {Button,Modal} from "react-bootstrap"
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import '../css/GameTripModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';

class GameTripModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            tripId:"",
            tripPlayer:"",
            tripNote:"",
            tripStatus:"",
            tripIndex:"",
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
            tripIndex:index,
            tripId:this.props.allGameTrips[index].tripId,
            tripPlayer:this.props.allGameTrips[index].tripPlayer,
            tripNote:this.props.allGameTrips[index].tripNote,
            tripStatus:this.props.allGameTrips[index].tripStatus,
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
        if(name==="tripStatus"){
            newValue=Number(target.value);
        }
        this.setState({
            [name]:newValue,
        });
    }

    setOptions(){
        if(this.state.tripStatus===0){
            return (
                <>
                    <option value="0">Unconfirmed</option>
                    <option value="3">Cancelled</option>
                </>
            );
        }else if(this.state.tripStatus===1){
            return (
                <>
                    <option value="1">Confirmed</option>
                    <option value="3">Cancelled</option>
                </>
            );
        }else if(this.state.tripStatus===3){
            return (
                <>
                    <option value="3">Cancelled</option>
                    <option value="0">Unconfirmed</option>
                </>
            );
        }
    }
    updateGameTripDetail(){
        let url=global.constants.api+"/updateGameTripStatus";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        formData.append('tripStatus',this.state.tripStatus);
        formData.append("tripNote",this.state.tripNote);
        formData.append('tripId',this.state.tripId);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                MyToast.notify(data.message+" wrong token!", "error");
                data=[];
            }else{
                MyToast.notify(data.msg, "success");
                this.props.onSubmited(this.state.tripIndex,this.state.tripStatus,this.state.tripNote);
                console.log(data.msg);
            }
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
        this.handleClose();
    }
    
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header>
                <Modal.Title>Game Trip Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="gameTripDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Player:</label></td>
                                <td>{this.state.tripPlayer}</td>
                            </tr>
                            <tr>
                                <td><label>Note:</label></td>
                                <td><textarea  name="tripNote" placeholder="No more than 500 characters" maxLength="500" onChange={this.handleChange} defaultValue={this.state.tripNote}/></td>
                            </tr>
                            <tr>
                                <td><label>Status:</label></td>
                                <td>
                                    <select name="tripStatus" onChange={this.handleChange}>
                                        {this.setOptions()}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>this.updateGameTripDetail()}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default GameTripModal;