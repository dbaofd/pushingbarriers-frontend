import React from "react";
import {Button,Modal} from "react-bootstrap"

import '../css/ImageModal.css';
import '../config.js';
import * as MyToast from '../tools/MyToast';

class ImageModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            img:"",
            flag:"",
            driverId:"",
            driverUserName:""
        }
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleShow=(id, flag, name)=>{
        this.getImg(id, flag)
        this.setState({
            show:true,
            flag:flag,
            driverId:id,
            driverUserName:name,
        });
    }

    handleClose=()=>{
        this.setState({
            show:false,
        })
    }

    getImg(id, flag){
        let url;
        if(flag==="playerPhoto"){
            url=global.constants.api+"/downloadPlayerPhoto/"+id;
        }else if(flag==="driverLicense"){
            url=global.constants.api+"/downloadDriverLicense/"+id;
        }else if(flag==="driverBluecard"){
            url=global.constants.api+"/downloadDriverBluecard/"+id;
        }
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        fetch(url,{
            method:"get", 
            headers:headers,
        }).then(res=>res.blob()
        ).then(blob => {
            var objectURL = URL.createObjectURL(blob);
            this.setState({
                img:objectURL,
            });
        }).catch(
            (error)=>{
                MyToast.notify("Network request failed", "error");
                console.error('Error:', error);
        });
    }

    fileSize=event=>{
        //console.log(typeof event.target.files[0]);
        if(typeof event.target.files[0]!=="undefined"){
            if(event.target.files[0].size>=(5*1024*1024)){
                MyToast.notify("The photo size should be smaller than 5M!", "error");
            }else{
                //alert("all good")
                this.setState({
                    selectedImage:event.target.files[0]
                });
            }
        }else{
            
        }

    }

    handleSubmit(event){
        event.preventDefault();
        let url;
        let headers=new Headers();
        headers.append("token",localStorage.getItem("token"));
        let formData=new FormData();
        if(this.state.flag==="driverLicense"){
            url=global.constants.api+"/uploadDriverLicense";
            formData.append("driverLicense", this.state.selectedImage);
        }else if(this.state.flag==="driverBluecard"){
            url=global.constants.api+"/uploadDriverBluecard";
            formData.append("driverBluecard", this.state.selectedImage);
        }
        formData.append("driverLicense", this.state.selectedImage);
        formData.append('driverId',this.state.driverId);
        formData.append('driverUserName',this.state.driverUserName);
        fetch(url,{
            method:"post",
            body:formData,
            headers:headers,//we need to put correct token to send the request
        }).then(res => res.json()
        ).then(data => {
            if(data.code===401){
                MyToast.notify(data.message+" wrong token!", "error");
            }else{
                MyToast.notify(data.msg, "success");
                console.log(data.msg);
            }
        }).catch(
            (error)=>{
                MyToast.notify(error, "error");
                console.error('Error:', error);
        });
        this.handleClose();
    }

    componentDidMount(){
        //pass "this" to parent component in order to 
        //let parent component can execute child functions
        this.props.onRef(this)
    }

    render(){
        return(
            <Modal show={this.state.show} onHide={this.handleClose} >
                <Modal.Body>
                    <div id="img_div">
                        <img src={this.state.img}/>
                    </div>
                </Modal.Body>
                {this.state.flag==="playerPhoto" ? 
                <></> 
                : 
                <Modal.Footer>
                    <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                    <table id="upload"> 
                        <tbody>
                            {this.state.flag==="driverLicense"?
                            <tr>
                                <td><label>Driver License:</label></td>
                                <td><input type="file" name="driver_license" required="required" style={{height:30}} accept=".jpg,.png,.jpeg" onChange={this.fileSize}/></td>
                            </tr>
                            :
                            <tr>
                                <td><label>Driver Bluecard:</label></td>
                                <td><input type="file" name="driver_bluecard" required="required" style={{height:30}} accept=".jpg,.png,.jpeg" onChange={this.fileSize}/></td>
                            </tr>}
                            <tr>
                                <td colSpan="2" style={{height:65}}>
                                    <Button variant="primary" type="submit" >
                                        Upload
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </form>
                </Modal.Footer>}
            </Modal>
        );
    }
}

export default ImageModal;