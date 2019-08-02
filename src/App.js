import React,{Component} from 'react';
import Login from './component/Login';
import AdminPage from './component/AdminPage';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import './App.css';

const newroute=()=>{
  return(
    <div>hello world</div>
  );
}

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
      </BrowserRouter>
    );
  }
}

export default App;
