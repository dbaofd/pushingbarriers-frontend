import React from 'react';
import {Button,Modal} from "react-bootstrap"
import '../css/FreezeDriverAccountModal.css';
import '../config.js';
import md5 from 'md5';
class FreezeDriverAccountModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show:false,
            driverId:"",
            driverName:""
        }
    }

    handleShow=(driverId, driverName, driverAvailability)=>{
        this.setState({
            show:true,
            driverId:driverId,
            driverName:driverName,
            driverAvailability:driverAvailability,
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

    freezeDriver(){
        let url=global.constants.api+"/updateDriverStatus";
        let headers=new Headers();
        let newAvailability=(this.state.driverAvailability===2?1:2);
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        formData.append('driverId',this.state.driverId);
        formData.append('status', newAvailability);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,
        }).then(res=>res.json()
        ).then(data=>{
            this.props.onSubmited();
            console.log(data.msg);
        });
        this.handleClose();
    }
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>{this.state.driverAvailability===2?"Are you sure to unfreeze":"Are you sure to freeze"} {this.state.driverName}?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                <Button variant="primary" onClick={this.handleClose}>
                    No
                </Button>
                <Button variant="danger" onClick={()=>this.freezeDriver()}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FreezeDriverAccountModal;