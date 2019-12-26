import React from 'react';
import {Button,Modal} from "react-bootstrap"
import '../css/ResetDriverPasswordModal.css';
import '../config.js';
import md5 from 'md5';

class ResetDriverPasswordModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show:false,
            driverId:"",
        }
    }

    handleShow=(driverId)=>{
        this.setState({
            show:true,
            driverId:driverId,
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
        let newPassword=md5(md5("123456"+global.constants.salt));
        //console.log(newPassword);
        formData.append('password',newPassword);
        formData.append('id', this.state.driverId);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,
        }).then(res=>res.json()
        ).then(data=>{
            console.log(data.msg);
        });
        this.handleClose();
    }
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header>
                <Modal.Title>Are you sure to reset the password?</Modal.Title>
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