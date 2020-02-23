import React from "react";
import {Button,Modal} from "react-bootstrap"
import Moment from 'moment';

import '../css/TeamModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';

class TeamModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            teamId:"",
            teamName:"",
            teamClub:"",
            teamClubAddress:"",
            teamStatus:"",
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleShow=(index)=>{
        this.setState({
            show:true,
            teamId:this.props.allTeams[index].teamId,
            teamName:this.props.allTeams[index].teamName,
            teamClub:this.props.allTeams[index].teamClub,
            teamClubAddress:this.props.allTeams[index].teamAddress,
            teamStatus:this.props.allTeams[index].teamStatus,
        });
    }
    
    componentDidMount(){
        //pass "this" to parent component in order to 
        //let parent component can execute child functions
        this.props.onRef(this)
    }

    handleClose=()=>{
        this.setState({
            show:false,
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

    handleSubmit(event){
        event.preventDefault();
        let url=global.constants.api+"/updateTeamInfo";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        formData.append('teamId', this.state.teamId)
        formData.append('teamName',this.state.teamName);
        formData.append('teamClub',this.state.teamClub);
        formData.append('teamClubAddress',this.state.teamClubAddress);
        formData.append('teamStatus', this.state.teamStatus);
        
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

    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <form onSubmit={this.handleSubmit}>
                <Modal.Header>
                <Modal.Title>Team Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="teamDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Team Name:</label></td>
                                <td><input type="text" name="teamName" required="required" value={this.state.teamName} onChange={this.handleChange} maxLength="100"/></td>
                            </tr>
                            <tr>
                                <td><label>Club Name:</label></td>
                                <td><input type="text" name="teamClub" required="required"value={this.state.teamClub} onChange={this.handleChange} maxLength="100"/></td>
                            </tr>
                            <tr>
                                <td><label>Club Address:</label></td>
                                <td><textarea name="teamClubAddress" required="required" value={this.state.teamClubAddress} onChange={this.handleChange} maxLength="170"/></td>
                            </tr>
                            <tr>
                                <td><label>Status:</label></td>
                                <td>
                                    <select  name="teamStatus" value={this.state.teamStatus} onChange={this.handleChange}>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </td>
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

export default TeamModal;