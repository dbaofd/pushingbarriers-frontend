import React from "react";
import {Button,Modal} from "react-bootstrap"
import '../css/AddNewPlayerModal.css';
import '../config.js';
import Moment from 'moment';
import reactHtmlTableToExcel from "react-html-table-to-excel";

class AddNewPlayerModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
        }
    }

    handleShow=()=>{
        this.setState({
            show:true,
        });
    }

    handleClose=()=>{
        this.setState({
            show:false,
        })
    }

    handleChange=()=>{
        let year=document.getElementById("newPlayerBirthYear");
        let month=document.getElementById("newPlayerBirthMonth");
        let day=document.getElementById("newPlayerBirthDay");
        let maxiumDayOfMonth=Moment(year.value+"-"+month.value).endOf('month').format('D');
        day.options.length=0;
        for(let i=1;i<=maxiumDayOfMonth;i++){
            day.options.add(new Option(i,i));
        }
        
    }

    componentDidMount(){
        //pass "this" to parent component in order to 
        //let parent component can execute child functions
        this.props.onRef(this)
    }

    setBirthday(){
        let today = new Date();
        let thisYear=today.getFullYear();
        let optionYear=[];
        let optionMonth=[];
        for(let i=thisYear; i>=1970;i--){
            optionYear.push(<option value={i} key={i}>{i}</option>);
        }

        for(let j=1;j<=12;j++){
            optionMonth.push(<option value={j} key={j}>{j}</option>);
        }
        return (
            <>
                <select id="newPlayerBirthYear" onChange={this.handleChange}>
                    {optionYear}
                </select>
                <select id="newPlayerBirthMonth" onChange={this.handleChange}>
                    {optionMonth}
                </select>
                <select id="newPlayerBirthDay" >
                </select>
            </>
        );
    }

    addNewPlayer(){
        let url=global.constants.api+"/insertNewPlayer";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        formData.append('playerName',this.newPlayerName.value);
        formData.append('playerGender',this.newPlayerGender.value);
        formData.append('playerPhoneNum',this.newPlayerPhoneNum.value);
        formData.append("playerBirthDay",new Date(document.getElementById("newPlayerBirthYear").value+"-"+
        document.getElementById("newPlayerBirthMonth").value+"-"+document.getElementById("newPlayerBirthDay").value));
        formData.append('playerParentName',this.newPlayerParentName.value);
        formData.append('playerParentPhoneNum',this.newPlayerParentPhoneNum.value);
        formData.append('playerAddress',this.newPlayerAddress.value);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            console.log(data.msg);
            this.props.onSubmited();
        });
        this.handleClose();
    }
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header>
                <Modal.Title>New Player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="newPlayerDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Name:</label></td>
                                <td><input type="text" maxlength="100" ref = {(input)=> this.newPlayerName = input}/></td>
                            </tr>
                            <tr>
                                <td><label>Gender:</label></td>
                                <td>
                                    <select  ref = {(input)=> this.newPlayerGender = input}>
                                        <option>Female</option>
                                        <option>Male</option>
                                        <option>Other</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Birthday:</label></td>
                                <td>
                                    {this.setBirthday()}
                                </td>
                            </tr>
                            <tr>
                                <td><label>PhoneNum:</label></td>
                                <td><input type="text" maxlength="15" ref = {(input)=> this.newPlayerPhoneNum = input}/></td>
                            </tr>
                            <tr>
                                <td><label>Parent Name:</label></td>
                                <td><input type="text" maxlength="100" ref = {(input)=> this.newPlayerParentName = input}/></td>
                            </tr>
                            <tr>
                                <td><label>Parent PhoneNum:</label></td>
                                <td><input type="text"  maxlength="15" ref = {(input)=> this.newPlayerParentPhoneNum = input}/></td>
                            </tr>
                            <tr>
                                <td><label>Address:</label></td>
                                <td><textarea maxlength="170" ref = {(input)=> this.newPlayerAddress = input}/></td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>this.addNewPlayer()}>
                    Add
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default AddNewPlayerModal;