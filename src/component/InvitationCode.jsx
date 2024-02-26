import React from "react";
import {Button,Table, Modal, ModalBody, ModalFooter} from "react-bootstrap";
import Moment from 'moment';
import ReactToExcel from 'react-html-table-to-excel';

import "../css/InvitationCode.css";
import '../config.js';
import * as MyToast from '../tools/MyToast';
import InvitationCodeModal from './InvitationCodeModal';

var codes=[]
;
class InvitationCode extends React.Component{
    constructor(props){
        super(props);
        
        this.state={
            invitationCodeInfo:"",
        }
    }

    componentDidMount(){
        this.getInvitationCode();
    }

    onRef = (ref) => {//get "this" returned by child component
        this.child = ref;
    }

    
    handleModalShow(){//call child component function 
        this.child.handleShow();
    }

    getInvitationCode(){
        let url=global.constants.api+"/findAllInvitationCode";
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        fetch(url,{
            method:"get", 
            headers:headers,
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                MyToast.notify(data.message+" wrong token!", "error");
                data=[];
            }
            this.setState({
                invitationCodeInfo:data,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }

    searchInvitationCode(){
        if(this.driverNameInput.value.length!==0){
            let url=global.constants.api+"/getInvitationCodeByName/"+this.driverNameInput.value;
            let headers=new Headers();
            headers.append("token",localStorage.getItem("token"));
            fetch(url,{
                method:"get", 
                headers:headers,
            }).then(res => res.json()
            ).then(data => {
                if(data.code===401){
                    MyToast.notify(data.message+" wrong token!", "error");
                    data=[];
                }
                this.setState({
                    invitationCodeInfo:data,
                });
            }).catch(
                (error)=>{
                    MyToast.notify("Network request failed", "error");
                    console.error('Error:', error);
            });
        }else{
            this.getInvitationCode()
        }
    }

    invitationCodeTemplate(index){
        let status="";
        let mystyle={};
        if(this.state.invitationCodeInfo[index].codeStatus===0){
            status="Invalid";
            mystyle={color:"red"};
        }else if(this.state.invitationCodeInfo[index].codeStatus===1){
            status="Valid";
            mystyle={color:"green"};
        }
        return(
            <tr key={this.state.invitationCodeInfo[index].codeId}>
                <td>{this.state.invitationCodeInfo[index].codeId}</td>
                <td>{this.state.invitationCodeInfo[index].codeString}</td>
                <td>{this.state.invitationCodeInfo[index].codeName}</td>
                <td style={mystyle}>{status}</td>
            </tr>
        );
    }

    setInvitationCodes(){
        codes=[];
        for(let i=0;i<this.state.invitationCodeInfo.length;i++){
            codes.push(this.invitationCodeTemplate(i));
        }
    }
    render(){
        this.setInvitationCodes();
        return(
            <div id="invitationcode">
                <div id="invitationcode-bar">
                    <div id="newInvitationcode">
                        <Button variant="primary" id="newInvitationcode-btn" onClick={()=>this.handleModalShow()}>Generate</Button>
                    </div>
                    <div id="invitationcode-search">
                        <Button variant="danger" id="invitationcode-search-btn" onClick={()=>this.searchInvitationCode()}>Search</Button>
                    </div>
                    <div id="invitationcode-name-textbox">
                        <input type="text" id="invitationcode-name-input" placeholder="Search by driver name" ref = {(input)=> this.driverNameInput = input}/>
                    </div>
                    <div id="totalNumberOfCodes">
                        <li> {this.state.invitationCodeInfo.length} codes in total</li>
                    </div>
                </div>
                <div id="invitationcode-table">
                    <Table striped bordered hover id="my-invitationcode-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {codes}
                        </tbody>
                    </Table>
                    <InvitationCodeModal
                    onRef={this.onRef}
                    onSubmited={this.getInvitationCode.bind(this)}/>
                </div>
            </div>);
    }
}

export default InvitationCode