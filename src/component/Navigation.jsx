import React from 'react';
import Moment from 'moment';
import '../css/Navigation.css';
class Navigation extends React.Component{
    constructor(props){
        super(props);
        this.state={
            adminName:localStorage.getItem("adminName"),
            currentDate:new Date(),
        };
    }
    render(){
        return(
            <div id="NavigationBar">
                <div id="NavigationBar-column1"></div>
                <div id="NavigationBar-column2">Pushing Barriers Management System</div>
                <div id="NavigationBar-column3"></div>
                <div id="NavigationBar-column4">Welcome~ {this.state.adminName}</div>
                <div id="NavigationBar-column5">{Moment(new Date).format('YYYY/MM/DD')}</div>
            </div>
        );
    }
}

export default Navigation;
