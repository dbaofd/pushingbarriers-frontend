import React from "react";
import {Button,Modal} from "react-bootstrap"
import '../css/TrainingModal.css';

var api="";

class TrainingModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            trainingData:"",
        }
    }
    componentDidMount(){
        //pass "this" to parent component in order to 
        //let parent component can execute child functions
        this.props.onRef(this)
    }

    handleShow=(training)=>{
        this.setState({
            show:true,
            trainingData:training,
        })
    }

    handleClose=()=>{
        this.setState({
            show:false,
        })
    }

    setSelect(){
        if(this.state.trainingData.trainingConfirmation==="1"){
            return (
                <select ref = {(input)=> this.selectedStatus = input}>
                    <option value="1">Confirmed</option>
                    <option value="0">Unconfirmed</option>
                    <option value="2">Cancelled</option>
                </select>
            );
        }else if(this.state.trainingData.trainingConfirmation==="0"){
            return (
                <select ref = {(input)=> this.selectedStatus = input}>
                    <option value="0">Unconfirmed</option>
                    <option value="1">Confirmed</option>
                    <option value="2">Cancelled</option>
                </select>
            );
        }else if(this.state.trainingData.trainingConfirmation==="2"){
            return (
                <select ref = {(input)=> this.selectedStatus = input}>
                    <option value="2">Cancelled</option>
                    <option value="0">Unconfirmed</option>
                    <option value="1">Confirmed</option>
                </select>
            );
        }
    }

    updateTrainingDetail(){
        let url=api+"/updateTrainingDetail"
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        formData.append('driver',this.driver.value);
        formData.append('time',this.time.value);
        formData.append('status',this.selectedStatus.value);
        formData.append('id',this.state.trainingData.trainingId);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            console.log(data.msg);
        });
        this.updateConfirmButton();
        this.handleClose();
    }
    
    updateConfirmButton(){
        let confirmBtn=document.getElementById(this.state.trainingData.trainingId);
        if(this.selectedStatus.value==="0"){
            confirmBtn.setAttribute("class","btn btn-success");
        }else if(this.selectedStatus.value==="1"){
            confirmBtn.setAttribute("class","btn btn-secondary");
        }else if(this.selectedStatus.value==="2"){
            confirmBtn.setAttribute("class","btn btn-danger");
        }
        let time=document.getElementById('training_time'+this.state.trainingData.trainingId)
        let driver=document.getElementById('training_driver'+this.state.trainingData.trainingId);
        time.innerText=this.time.value;
        driver.innerText=this.driver.value;
    }
    render(){
        return(
            <>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header>
                    <Modal.Title>Training Detail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table id="trainingDetail"> 
                            <tbody>
                                <tr>
                                    <td><label>Player:</label></td>
                                    <td>{this.state.trainingData.trainingPlayer}</td>
                                </tr>
                                <tr>
                                    <td><label>Driver:</label></td>
                                    <td><input type="text" ref = {(input)=> this.driver = input} defaultValue={this.state.trainingData.trainingDriver}/></td>
                                </tr>
                                <tr>
                                    <td><label>Time:</label></td>
                                    <td><input type="text" ref = {(input)=> this.time = input} defaultValue={this.state.trainingData.trainingTime}/></td>
                                </tr>
                                <tr>
                                    <td><label>Status:</label></td>
                                    <td>{this.setSelect()}</td>
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
            </>
        );
    }
}

export default TrainingModal;