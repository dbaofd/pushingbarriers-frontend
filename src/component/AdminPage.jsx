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
import '../config.js';
import '../css/AdminPage.css'
import {BrowserRouter,Route,Switch} from 'react-router-dom';


const brewing=()=>{
    return(
        <div><h1>Brewing soon</h1></div>
    );
}

class AdminPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            token:localStorage.getItem("token"),
            adminName:localStorage.getItem("adminName"),
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
                console.log("check login status successfully")
            }else if(data.msg==="unmarched_adminname"){
                this.props.history.push('/Login');
            }else if(data.msg==="wrong_token"){
                this.props.history.push('/Login');
            }else{
                this.props.history.push('/Login');
            }
        })
    }
    componentWillMount(){//before rendering the component, we need to check the admin authtication
        this.checkLoginStatus();
    }
    
    render(){
        return(
            <BrowserRouter>
            <Navigation/>
            <div id="mycontainer">
                <div id="myside">
                <SlideBar/>
                </div>
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
                    <Route component={Error}/>
                </Switch>
                </div>
            </div>
            </BrowserRouter>
        );

    }

}

export default AdminPage;