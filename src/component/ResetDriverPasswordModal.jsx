import React from 'react';
import {Button,Modal} from "react-bootstrap";
import md5 from 'md5';

import '../css/ResetDriverPasswordModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';

class ResetDriverPasswordModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show:false,
            driverId:"",
            driverName:"",
        }
    }

    handleShow=(driverId, driverName)=>{
        this.setState({
            show:true,
            driverId:driverId,
            driverName:driverName
        })
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

    resetPassword(){
        let url=global.constants.api+"/resetDriverPassword";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        let newPassword=md5(md5(global.constants.resetPassword+global.constants.salt));
        //console.log(newPassword);
        formData.append('password',newPassword);
        formData.append('id', this.state.driverId);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,
        }).then(res=>res.json()
        ).then(data=>{
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
        this.handleClose();
    }
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>Are you sure to reset {this.state.driverName}'s password({global.constants.resetPassword})?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                <Button variant="primary" onClick={this.handleClose}>
                    No
                </Button>
                <Button variant="danger" onClick={()=>this.resetPassword()}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ResetDriverPasswordModal;