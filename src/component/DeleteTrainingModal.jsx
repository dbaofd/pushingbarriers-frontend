import React from 'react';
import {Button,Modal} from "react-bootstrap"
import md5 from 'md5';

import * as MyToast from '../tools/MyToast';
import '../css/ResetDriverPasswordModal.css';
import '../config.js';

class DeleteTrainingModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show:false,
            trainingId:"",
        }
    }

    handleShow=(trainingId)=>{
        this.setState({
            show:true,
            trainingId:trainingId,
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

    deleteTraining(){
        let url=global.constants.api+"/deleteTraining";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
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
                this.props.onDeleted();
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
                <Modal.Title>Are you sure to DELETE this training?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                <Button variant="primary" onClick={this.handleClose}>
                    No
                </Button>
                <Button variant="danger" onClick={()=>this.deleteTraining()}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DeleteTrainingModal;