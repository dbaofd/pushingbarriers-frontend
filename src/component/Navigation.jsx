import React from 'react';
import '../css/Navigation.css';
class Navigation extends React.Component{
    constructor(props){
        super(props);
        this.state={
            adminName:localStorage.getItem("adminName"),
            currentDate:new Date(),
        };
    }
    getCurrentDate(){
        return new Date().toLocaleDateString();
    }
    render(){
        return(
            <div id="NavigationBar">
                <div id="column1">Pushing Barriers Management System</div>
                <div id="column3"></div>
                <div id="column4">Welcome~ {this.state.adminName}</div>
                <div id="column5">{this.getCurrentDate()}</div>
            </div>
        );
    }
}

export default Navigation;
