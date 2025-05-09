import React from "react";
import Error from './Error';
import Navigation from './Navigation';
import SlideBar from './SlideBar';
import Game from './Game';
import Training from'./Training';
import Trainingtemplate from './Trainingtemplate';
import Player from "./Player";
import Driver from "./Driver";
import Team from "./Team";
import PlayerTeam from "./PlayerTeam";
import GameTrip from './GameTrip';
import Trip from './Trip';
import InvitationCode from './InvitationCode';
import FreeDriver from './FreeDriver';
import BurgerSideBar from './BurgerSideBar';
import '../config.js';
import '../css/AdminPage.css';
import {BrowserRouter,Route,Switch} from 'react-router-dom';


const brewing=()=>{
    return(
        <div><h1>This is home</h1></div>
    );
}

class AdminPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            token:localStorage.getItem("token"),
            adminName:localStorage.getItem("adminName"),
            isValid:false,
        };
    }
    //check login
    checkLoginStatus(){
        let url=global.constants.api+"/checkToken";
        let formData=new FormData();
        formData.append("token",this.state.token);
        formData.append("adminName",this.state.adminName);
        fetch(url,{
            method:'post',
            body: formData,
        }).then(res => res.json()
        ).then(data => {
            if(data.msg==="success"){
                this.setState({
                    isValid:true,
                });
                console.log("check login status successfully")
            }else if(data.msg==="unmarched_adminname"){
                this.props.history.push('/Login');
            }else if(data.msg==="wrong_token"){
                this.props.history.push('/Login');
            }else{
                this.props.history.push('/Login');
            }
        }).catch(
            (error)=>{
                this.props.history.push('/Login');
        });
    }
    componentWillMount(){//before rendering the component, we need to check the admin authtication
        this.checkLoginStatus();
    }
    
    render(){
        return(
            <>
            {this.state.isValid?
            <>
            
            <BrowserRouter id="outcontainer">
                <BurgerSideBar pageWrapId={ "mycontainer "} outerContainerId={"outcontainer"}/>
                <Navigation/>
                <div id="mycontainer">
                    <div id="router-switch"> 
                        <Switch>
                            <Route path="/" component={brewing} exact/>
                            <Route path="/Game" component={Game}/>
                            <Route path="/Training" component={Training}/>
                            <Route path="/Trainingtemplate" component={Trainingtemplate}/>
                            <Route path="/Player" component={Player}/>
                            <Route path="/Driver" component={Driver}/>
                            <Route path="/Team" component={Team}/>
                            <Route path="/PlayerTeam" component={PlayerTeam}/>
                            <Route path="/GameTrip" component={GameTrip}/>
                            <Route path="/Trip" component={Trip}/>
                            <Route path="/InvitationCode" component={InvitationCode}/>
                            <Route path="/FreeDriver" component={FreeDriver}/>
                            <Route component={Error}/>
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
            </>
            :
            <>
            <div style={{color:"white"}}>
                Checking
            </div>
            </>}
            </>
        );

    }

}

export default AdminPage;