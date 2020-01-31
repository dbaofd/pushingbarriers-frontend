import React from "react";
import {Button,Modal} from "react-bootstrap"
import '../css/PlayerModal.css';
import '../config.js';
import Moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

var updatedTeams;
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
            selectedImage:null,
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
            selectedImage:null,
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
        let url;
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        if(this.state.selectedImage!==null){
            url=global.constants.api+"/updatePlayerInfo";
            formData.append('photo',this.state.selectedImage);
        }else{
            url=global.constants.api+"/updatePlayerInfoWithoutPhoto";
        }
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
        let teamList=[];
        if(updatedTeams!=null){
            for(let i=0;i<updatedTeams.length;i++){
                teamList.push(updatedTeams[i].teamId);
            }
        }
        formData.append('teams',teamList);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            let birthday=this.state.playerBirthYear+"/"+this.state.playerBirthMonth+"/"+this.state.playerBirthDay;
            this.props.onSubmited(this.state.playerIndex, this.state.playerName, this.state.playerGender,this.state.playerPhoneNum,
                birthday,this.state.playerParentName,this.state.playerParentPhoneNum,this.state.playerAddress, this.state.playerStatus, "okokok");
            console.log(data.msg);
        });
        this.handleClose();
    }

    setBirthday(){
        let today = new Date();
        let thisYear=today.getFullYear();
        let optionYear=[];
        let optionMonth=[];
        let optionDay=[];
        //here still can't use "===", this.state.playerBirthYear and playerBirthMonth etc,are all string type
        //which are different with i j.
        for(let i=thisYear; i>=1970;i--){
            optionYear.push(<option value={i} key={i}>{i}</option>);
        }

        for(let j=1;j<=12;j++){
            optionMonth.push(<option value={j} key={j}>{j}</option>);
        }

        let maxiumDayOfMonth=Moment(this.state.playerBirthYear+"-"+this.state.playerBirthMonth).endOf('month').format('D');
        //console.log(document.getElementsByName("playerBirthDay")[0]);
        for(let k=1;k<=maxiumDayOfMonth;k++){
            optionDay.push(<option value={k} key={k}>{k}</option>);
        }
        //alert(Moment(this.state.playerData.playerBirthday).endOf('month').format('D'));
        return (
            <>
                <select name="playerBirthYear" value={this.state.playerBirthYear} onChange={this.handleChange}>
                    {optionYear}
                </select>
                <select name="playerBirthMonth" value={this.state.playerBirthMonth} onChange={this.handleChange}>
                    {optionMonth}
                </select>
                <select name="playerBirthDay" value={this.state.playerBirthDay} onChange={this.handleChange} >
                    {optionDay}
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
    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose}>
                <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                <Modal.Header>
                <Modal.Title>Player Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table id="playerDetail"> 
                        <tbody>
                            <tr>
                                <td><label>Name:</label></td>
                                <td><input type="text" name="playerName" required="required" value={this.state.playerName} onChange={this.handleChange} maxLength="100"/></td>
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
                                <td><input type="text" name="playerPhoneNum" required="required"value={this.state.playerPhoneNum} onChange={this.handleChange} maxLength="15"/></td>
                            </tr>
                            <tr>
                                <td><label>Parent Name:</label></td>
                                <td><input type="text" name="playerParentName" required="required" value={this.state.playerParentName} onChange={this.handleChange} maxLength="100"/></td>
                            </tr>
                            <tr>
                                <td><label>Parent PhoneNum:</label></td>
                                <td><input type="text" name="playerParentPhoneNum" required="required" value={this.state.playerParentPhoneNum} onChange={this.handleChange} maxLength="15"/></td>
                            </tr>
                            <tr>
                                <td><label>Address:</label></td>
                                <td><textarea name="playerAddress" required="required" value={this.state.playerAddress} onChange={this.handleChange} maxLength="170"/></td>
                            </tr>
                            <tr>
                                <td><label>Player Photo:</label></td>
                                <td><input type="file" name="player_photo" style={{height:30}} accept=".jpg,.png,.jpeg" onChange={this.fileSize}/></td>
                            </tr>
                            <tr>
                                <td><label>Status:</label></td>
                                <td>
                                    <select  name="playerStatus" value={this.state.playerStatus} onChange={this.handleChange}>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                        <option value="2">Waiting</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Team:</label></td>
                                <td>
                                    <Autocomplete
                                        multiple
                                        options={this.props.allteam}
                                        getOptionLabel={option => option.teamName}
                                        renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            placeholder="Update team"
                                            fullWidth
                                        />
                                        )}
                                        onChange={(event, value) =>{
                                            updatedTeams=value;
                                        }}
                                    />
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