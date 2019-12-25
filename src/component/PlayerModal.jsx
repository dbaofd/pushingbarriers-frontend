import React from "react";
import {Button,Modal} from "react-bootstrap"
import '../css/PlayerModal.css';
import '../config.js';
import Moment from 'moment';

class PlayerModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            playerIndex:"",
            playerId:"",
            playerName:"",
            playerGender:"",
            playerPhoneNum:"",
            playerBirthYear:"",
            playerBirthMonth:"",
            playerBirthDay:"",
            playerParentName:"",
            playerParentPhoneNum:"",
            playerAddress:"",
            playerStatus:"",
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleShow=(playerIndex)=>{
        this.setState({
            show:true,
            playerIndex:playerIndex,
            playerId:this.props.allplayer[playerIndex].playerId,
            playerName:this.props.allplayer[playerIndex].playerName,
            playerGender:this.props.allplayer[playerIndex].playerGender,
            playerPhoneNum:this.props.allplayer[playerIndex].playerPhoneNum,
            playerBirthYear:Moment(this.props.allplayer[playerIndex].playerBirthday).format('Y'),
            playerBirthMonth:Moment(this.props.allplayer[playerIndex].playerBirthday).format('M'),
            playerBirthDay:Moment(this.props.allplayer[playerIndex].playerBirthday).format('D'),
            playerParentName:this.props.allplayer[playerIndex].playerParentName,
            playerParentPhoneNum:this.props.allplayer[playerIndex].playerParentPhoneNum,
            playerAddress:this.props.allplayer[playerIndex].playerAddress,
            playerStatus:this.props.allplayer[playerIndex].playerStatus,
        });
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
        let url=global.constants.api+"/updatePlayerInfo";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        formData.append('name',this.state.playerName);
        formData.append('gender',this.state.playerGender);
        formData.append('phoneNum',this.state.playerPhoneNum);
        formData.append("birthday",new Date(this.state.playerBirthYear+"-"+
        this.state.playerBirthMonth+"-"+this.state.playerBirthDay));
        formData.append('parentName',this.state.playerParentName);
        formData.append('parentPhoneNum',this.state.playerParentPhoneNum);
        formData.append('address',this.state.playerAddress);
        formData.append('status',this.state.playerStatus);
        formData.append('id',this.state.playerId);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            console.log(data.msg);
            let birthday=this.state.playerBirthYear+"/"+this.state.playerBirthMonth+"/"+this.state.playerBirthDay;
            this.props.onSubmited(this.state.playerIndex, this.state.playerName, this.state.playerGender,this.state.playerPhoneNum,
                birthday,this.state.playerParentName,this.state.playerParentPhoneNum,this.state.playerAddress, this.state.playerStatus);
        });
        this.handleClose();
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

    setBirthday(){
        let today = new Date();
        let thisYear=today.getFullYear();
        let optionYear=[];
        let optionMonth=[];
        let optionDay=[];
        for(let i=thisYear; i>=1970;i--){
            if(i==this.state.playerBirthYear){
                optionYear.push(<option value={i} key={i} selected>{i}</option>);
            }else{
                optionYear.push(<option value={i} key={i}>{i}</option>);
            }
        }

        for(let j=1;j<=12;j++){
            if(j==this.state.playerBirthMonth){
                optionMonth.push(<option value={j} key={j} selected>{j}</option>);
            }else{
                optionMonth.push(<option value={j} key={j}>{j}</option>);
            }
        }

        let maxiumDayOfMonth=Moment(this.state.playerBirthYear+"-"+this.state.playerBirthMonth).endOf('month').format('D');
        //console.log(document.getElementsByName("playerBirthDay")[0]);
        for(let k=1;k<=maxiumDayOfMonth;k++){
            if(k==this.state.playerBirthDay){
                //document.getElementsByName("playerBirthDay")[0].value=k;
                optionDay.push(<option value={k} key={k} selected>{k}</option>);
            }else{
                optionDay.push(<option value={k} key={k}>{k}</option>);
            }
        }
        //alert(Moment(this.state.playerData.playerBirthday).endOf('month').format('D'));
        return (
            <>
                <select name="playerBirthYear" onChange={this.handleChange}>
                    {optionYear}
                </select>
                <select name="playerBirthMonth" onChange={this.handleChange}>
                    {optionMonth}
                </select>
                <select name="playerBirthDay" onChange={this.handleChange} >
                    {optionDay}
                </select>
            </>
        );
    }
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <form onSubmit={this.handleSubmit}>
                <Modal.Header>
                <Modal.Title>Player Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="playerDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Name:</label></td>
                                <td><input type="text" name="playerName" value={this.state.playerName} onChange={this.handleChange} maxlength="100"/></td>
                            </tr>
                            <tr>
                                <td><label>Gender:</label></td>
                                <td>
                                    <select  name="playerGender" value={this.state.playerGender} onChange={this.handleChange}>
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
                                <td><input type="text" name="playerPhoneNum"value={this.state.playerPhoneNum} onChange={this.handleChange} maxlength="15"/></td>
                            </tr>
                            <tr>
                                <td><label>Parent Name:</label></td>
                                <td><input type="text" name="playerParentName" value={this.state.playerParentName} onChange={this.handleChange} maxlength="100"/></td>
                            </tr>
                            <tr>
                                <td><label>Parent PhoneNum:</label></td>
                                <td><input type="text" name="playerParentPhoneNum" value={this.state.playerParentPhoneNum} onChange={this.handleChange} maxlength="15"/></td>
                            </tr>
                            <tr>
                                <td><label>Address:</label></td>
                                <td><textarea name="playerAddress" value={this.state.playerAddress} onChange={this.handleChange} maxlength="170"/></td>
                            </tr>
                            <tr>
                                <td><label>Status:</label></td>
                                <td>
                                    <select  name="playerStatus" value={this.state.playerStatus} onChange={this.handleChange}>
                                        <option>1</option>
                                        <option>0</option>
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

export default PlayerModal;