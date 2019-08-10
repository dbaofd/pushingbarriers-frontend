import React from "react";
import '../css/Login.css';
import md5 from 'md5'
var api=""
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            namebordercolor:"#fff",
            pswbordercolor:"#fff",
        };
    }
    inputChangeForAdminName(){
        let val=this.refs.adminname.value;
        this.setState({
            adminname:val
        });
    }
    inputChangeForAdminPassword(){
        let val=this.refs.adminpassword.value;
        const salt="fjeiojgoeigjgokwao";
        let md5Pwd=md5(md5(val+salt));
        this.setState({ 
            adminpassword:md5Pwd
        });
    }
    loginRequest(){
        let url=api+"/login";
        let formData=new FormData();
        formData.append('adminName',this.state.adminname);
        formData.append('adminPassword',this.state.adminpassword);
        fetch(url,{
            method:'post',
            body: formData,
        }).then(res => res.json()
        ).then(data => {
            if (data.msg==="wrong_password"){
                this.setState({
                    namebordercolor:"#fff",
                    pswbordercolor:"red"
                })
            }else if(data.msg==="wrong_admin_name"){
                this.setState({
                    namebordercolor:"red",
                    pswbordercolor:"#fff"
                })
            }else if(data.msg==="fail_to_connect_radis"){
                alert("fail_to_connect_radis");
            }else{
                this.setState({
                    namebordercolor:"#fff",
                    pswbordercolor:"#fff"
                });
                localStorage.setItem("token",data.msg);
                localStorage.setItem("adminName",this.state.adminname);
                this.props.history.push('/');
            }
        });
    }
    render(){
        return(
            <div id="loginComponent"> 
                <div id="logocontainer"/>
                <form action="#" method="post" id="login">
                    <table className="content">
                        <tbody>
                            <tr>
                                <td><input className="mytext" style={{'borderColor':this.state.namebordercolor}} ref="adminname" onChange={()=>this.inputChangeForAdminName()} type="text" placeholder="user_name"/></td>
                            </tr>
                            <tr>
                                <td><input className="mytext" style={{'borderColor':this.state.pswbordercolor}} ref="adminpassword" onChange={()=>this.inputChangeForAdminPassword()} type="password" placeholder="password"/></td>
                            </tr>
                            <tr>
                                <td>
                                    <input className="mytext" id="btnlogin" type="button" value="Login" onClick={()=>this.loginRequest()}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <div id="copyright">copyright©www.pushingbarriers.org.All Right Reserved </div>
            </div>
        );
    }
}

export default Login;