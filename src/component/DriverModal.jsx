import React from "react";
import {Button,Modal} from "react-bootstrap"
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


import '../css/DriverModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';

class DriverModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            driverIndex:"",
            driverId:"",
            driverName:"",
            driverGender:"",
            driverPhoneNum:"",
            driverPlateNum:"",
            driverBirthday:"",
            driverAddress:"",
            driverEmail:"",
            driverStartDate:"",
            driverEndDate:"",
            driverSeatCapacity:"",
            driverAvailability:"",
            driverNote:"",
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleShow=(driverIndex)=>{
        this.setState({
            show:true,
            driverIndex:driverIndex,
            driverId:this.props.allDrivers[driverIndex].driverId,
            driverName:this.props.allDrivers[driverIndex].driverName,
            driverGender:this.props.allDrivers[driverIndex].driverGender,
            driverPhoneNum:this.props.allDrivers[driverIndex].driverPhoneNum,
            driverPlateNum:this.props.allDrivers[driverIndex].driverPlateNum,
            driverBirthday:this.props.allDrivers[driverIndex].driverBirthday===null?null:
            new Date(Moment(this.props.allDrivers[driverIndex].driverBirthday).format('YYYY'),
                    Moment(this.props.allDrivers[driverIndex].driverBirthday).format('MM'),
                    Moment(this.props.allDrivers[driverIndex].driverBirthday).format('DD')),
            driverAddress:this.props.allDrivers[driverIndex].driverAddress,
            driverEmail:this.props.allDrivers[driverIndex].driverEmail,
            driverStartDate:this.props.allDrivers[driverIndex].driverStartDate===null?null:
            new Date(Moment(this.props.allDrivers[driverIndex].driverStartDate).format('YYYY'),
                    Moment(this.props.allDrivers[driverIndex].driverStartDate).format('MM'),
                    Moment(this.props.allDrivers[driverIndex].driverStartDate).format('DD')),
            driverEndDate:this.props.allDrivers[driverIndex].driverEndDate===null?null:
            new Date(Moment(this.props.allDrivers[driverIndex].driverEndDate).format('YYYY'),
                    Moment(this.props.allDrivers[driverIndex].driverEndDate).format('MM'),
                    Moment(this.props.allDrivers[driverIndex].driverEndDate).format('DD')),
            driverSeatCapacity:this.props.allDrivers[driverIndex].driverSeatCapacity,
            driverAvailability:this.props.allDrivers[driverIndex].driverAvailability,
            driverNote:this.props.allDrivers[driverIndex].driverNote,
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
        let url=global.constants.api+"/updateAllDriverInfo";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        console.log(this.state.driverStartDate)
        formData.append('driverId',this.state.driverId);
        formData.append('driverName',this.state.driverName);
        formData.append('driverGender',this.state.driverGender);
        formData.append("driverBirthday",this.state.driverBirthday);
        formData.append('driverPhoneNum',this.state.driverPhoneNum);
        formData.append('driverPlateNum',this.state.driverPlateNum);
        formData.append('driverAddress',this.state.driverAddress);
        formData.append('driverEmail',this.state.driverEmail);
        formData.append('driverStartDate',this.state.driverStartDate);
        formData.append('driverEndDate', this.state.driverEndDate);
        formData.append('driverSeatCapacity',this.state.driverSeatCapacity);
        formData.append('driverNote',this.state.driverNote);

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
                this.props.onSubmited();
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
                <form onSubmit={this.handleSubmit}>
                <Modal.Header>
                <Modal.Title>Driver Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="driverDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Name:</label></td>
                                <td><input type="text" name="driverName" required="required" value={this.state.driverName} onChange={this.handleChange} maxLength="100"/></td>
                            </tr>
                            <tr>
                                <td><label>Gender:</label></td>
                                <td>
                                    <select  name="driverGender" value={this.state.driverGender} onChange={this.handleChange}>
                                        <option>Female</option>
                                        <option>Male</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Birthday:</label></td>
                                <td>
                                <DatePicker 
                                //transfrom database Date to js Date
                                selected={this.state.driverBirthday}
                                onChange={(date)=>this.setState({driverBirthday:date})}
                                maxDate={new Date()}
                                />
                                </td>
                            </tr>
                            <tr>
                                <td><label>PhoneNum:</label></td>
                                <td><input type="text" name="driverPhoneNum" required="required"value={this.state.driverPhoneNum} onChange={this.handleChange} maxLength="15"/></td>
                            </tr>
                            <tr>
                                <td><label>PlateNum:</label></td>
                                <td><input type="text" name="driverPlateNum" value={this.state.driverPlateNum} onChange={this.handleChange} maxLength="15"/></td>
                            </tr>
                            <tr>
                                <td><label>Address:</label></td>
                                <td><textarea name="driverAddress" required="required" value={this.state.driverAddress} onChange={this.handleChange} maxLength="170"/></td>
                            </tr>
                            <tr>
                                <td><label>Email:</label></td>
                                <td><input type="text" name="driverEmail"  value={this.state.driverEmail} onChange={this.handleChange} maxLength="60"/></td>
                            </tr>
                            <tr>
                                <td><label>Start Date:</label></td>
                                <td>
                                <DatePicker 
                                selected={this.state.driverStartDate} 
                                onChange={(date)=>this.setState({driverStartDate:date})}
                                />
                                </td>
                            </tr>
                            <tr>
                                <td><label>End Date:</label></td>
                                <td>
                                <DatePicker 
                                selected={this.state.driverEndDate} 
                                onChange={(date)=>this.setState({driverEndDate:date})}
                                />
                                </td>
                            </tr>
                            <tr>
                                <td><label>Seat Capacity:</label></td>
                                <td><input type="text" name="driverSeatCapacity"  value={this.state.driverSeatCapacity} onChange={this.handleChange} maxLength="100"/></td>
                            </tr>
                            <tr>
                                <td><label>Note:</label></td>
                                <td><textarea name="driverNote" value={this.state.driverNote} onChange={this.handleChange} maxLength="500"/></td>
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

export default DriverModal;