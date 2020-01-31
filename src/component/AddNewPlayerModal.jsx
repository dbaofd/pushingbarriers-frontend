import React from "react";
import {Button,Modal} from "react-bootstrap"
import '../css/AddNewPlayerModal.css';
import '../config.js';
import Moment from 'moment';
import reactHtmlTableToExcel from "react-html-table-to-excel";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

var selectedTeams=[];
class AddNewPlayerModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            selectedImage:"",
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
                    <option value="1" key="1">1</option>
                </select>
            </>
        );
    }

    fileSize=event=>{
        //console.log(typeof event.target.files[0]);
        if(typeof event.target.files[0]!=="undefined"){
            if(event.target.files[0].size>=(5*1024*1024)){
                alert("The photo size should be smaller than 5M!");
            }else{
                //alert("all good")
                this.setState({
                    selectedImage:event.target.files[0]
                });
            }
        }else{
            
        }

    }
    handleSubmit=(event)=>{
        event.preventDefault();
        //if(selectedTeams!=null&&selectedTeams!=""){
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
        formData.append('playerPhoto', this.state.selectedImage);
        formData.append('playerAddress',this.newPlayerAddress.value);
        formData.append('playerStatus', this.selectedStatus.value);
        let teamList=[];
        for(let i=0;i<selectedTeams.length;i++){
            teamList.push(selectedTeams[i].teamId);
        }
        formData.append('teamList',teamList);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            console.log(data.msg);
            this.props.onSubmited();
        }).catch(
            (error)=>{
                console.error('Error:', error);
        });
        this.handleClose();
        // }else{
        //     alert("Please fill all the infomation!");
        // }
    }

    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose} >
                <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                <Modal.Header>
                <Modal.Title>New Player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="newPlayerDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Name:</label></td>
                                <td><input type="text" maxLength="100" required="required" ref = {(input)=> this.newPlayerName = input}/></td>
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
                                <td><input type="text" maxLength="15" required="required" ref = {(input)=> this.newPlayerPhoneNum = input}/></td>
                            </tr>
                            <tr>
                                <td><label>Parent Name:</label></td>
                                <td><input type="text" maxLength="100" required="required" ref = {(input)=> this.newPlayerParentName = input}/></td>
                            </tr>
                            <tr>
                                <td><label>Parent PhoneNum:</label></td>
                                <td><input type="text"  maxLength="15" required="required" ref = {(input)=> this.newPlayerParentPhoneNum = input}/></td>
                            </tr>
                            <tr>
                                <td><label>Address:</label></td>
                                <td><textarea maxLength="170" required="required" ref = {(input)=> this.newPlayerAddress = input}/></td>
                            </tr>
                            <tr>
                                <td><label>Player Photo:</label></td>
                                <td><input type="file" name="player_photo" required="required"  style={{height:30}} ref={imageInput=>this.imageInput=imageInput} accept=".jpg,.png,.jpeg" onChange={this.fileSize}/></td>
                            </tr>
                            <tr>
                                <td><label>Player Status</label></td>
                                <td>
                                <select ref = {(input)=> this.selectedStatus = input}>
                                    <option value="1">Active</option>
                                    <option value="2">Waiting</option>
                                </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Team:</label></td>
                                <td>
                                    <Autocomplete
                                        multiple
                                        id="tags-standard"
                                        options={this.props.allteam}
                                        getOptionLabel={option => option.teamName}
                                        renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            placeholder="Add teams"
                                            fullWidth
                                        />
                                        )}
                                        onChange={(event, value) =>{
                                            selectedTeams=value;
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" type="submit">
                    Add
                </Button>
                </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export default AddNewPlayerModal;