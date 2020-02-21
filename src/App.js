import React,{Component} from 'react';
import Login from './component/Login';
import AdminPage from './component/AdminPage';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import './App.css';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class App extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <BrowserRouter>
        <Switch>
          <Route path="/Login" component={Login}/>
          <Route path="/" component={AdminPage}/>
        </Switch>
        <ToastContainer />
      </BrowserRouter>
    );
  }
}

export default App;
