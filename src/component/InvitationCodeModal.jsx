import React from "react";
import {Button,Modal} from "react-bootstrap"
import Moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import '../css/InvitationCodeModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';


class InvitationCodeModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            code:"",
        }
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleShow=()=>{
        this.setState({
            show:true,
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

    handleSubmit(event){
        event.preventDefault();
        let url=global.constants.api+"/generateInvitationCode";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData =new FormData();
        formData.append("codeName", this.codeNameInput.value);
        fetch(url,{
            method:"post", 
            body:formData,
            headers:headers,
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                MyToast.notify(data.message+" wrong token!", "error");
                data=[];
            }else{
                this.props.onSubmited();
                MyToast.notify(data.msg, "success");
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
                <Modal.Title>Generate Invitation Code</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="newInvitationcodeDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Driver Name:</label></td>
                                <td><input type="text" required="required" ref = {(input)=> this.codeNameInput = input} maxLength="100"/></td>
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

export default InvitationCodeModal;