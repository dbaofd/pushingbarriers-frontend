import React from "react";
import {Button,Modal} from "react-bootstrap"
import '../css/ImageModal.css';
import '../config.js';

class ImageModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
            img:"",
        }
    }

    handleShow=(id)=>{
        this.getImg(id)
        this.setState({
            show:true,
        });
    }

    handleClose=()=>{
        this.setState({
            show:false,
        })
    }

    getImg(id){
        let url=global.constants.api+"/download/"+id;
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
        });
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
            </Modal>
        );
    }
}

export default ImageModal;