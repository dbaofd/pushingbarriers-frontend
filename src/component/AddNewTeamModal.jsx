import React from 'react';
import {Button,Modal} from "react-bootstrap"

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import '../css/AddNewTeamModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';

class AddNewTeamModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            teamName:"",
            teamClub:"",
            teamClubAddress:"",
        }
    }

    handleShow=()=>{
        this.setState({
            show:true,
            teamName:"",
            teamClub:"",
            teamClubAddress:"",
            teamCoachName:"",
            teamCoachPhoneNum:"",
            teamManagerName:"",
            teamManagerPhoneNum:"",
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
        let url=global.constants.api+"/insertNewTeam";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        formData.append('teamName',this.state.teamName);
        formData.append('teamClub',this.state.teamClub);
        formData.append('teamClubAddress',this.state.teamClubAddress);
        formData.append('teamCoachName',this.state.teamCoachName);
        formData.append('teamCoachPhoneNum',this.state.teamCoachPhoneNum);
        formData.append('teamManagerName',this.state.teamManagerName);
        formData.append('teamManagerPhoneNum', this.state.teamManagerPhoneNum);
        
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                MyToast.notify(data.message+" wrong token!", "error");
            }else{
                console.log(data.msg);
                MyToast.notify(data.msg, "success");
                this.props.onSubmited();
            }
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
        this.handleClose();
    }

    componentDidMount(){
        //pass "this" to parent component in order to 
        //let parent component can execute child functions
        this.props.onRef(this)
    }
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <form onSubmit={this.handleSubmit}>
                <Modal.Header>
                <Modal.Title>New Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="newTeamDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Name:</label></td>
                                <td><input type="text" required name="teamName" value={this.state.teamName} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Club:</label></td>
                                <td><input type="text" required name="teamClub" value={this.state.teamClub} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Club Address:</label></td>
                                <td><input type="text" required name="teamClubAddress" value={this.state.teamClubAddress} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Coach:</label></td>
                                <td><input type="text" name="teamCoachName" value={this.state.teamCoachName} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Coach Phone:</label></td>
                                <td><input type="text" name="teamCoachPhoneNum" value={this.state.teamCoachPhoneNum} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Manager:</label></td>
                                <td><input type="text" name="teamManagerName" value={this.state.teamManagerName} onChange={this.handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Manager Phone:</label></td>
                                <td><input type="text" name="teamManagerPhoneNum" value={this.state.teamManagerPhoneNum} onChange={this.handleChange}/></td>
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

export default AddNewTeamModal;