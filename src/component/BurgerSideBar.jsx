import { push as Menu } from 'react-burger-menu';
import React from 'react';
import {NavLink} from "react-router-dom";
import {Accordion,Card,ListGroup} from 'react-bootstrap';
import '../css/BurgerSideBar.css'
class BurgerSideBar extends React.Component {
  showSettings (event) {
    event.preventDefault();
  }

  changeCurrentPath(newPath){
    document.getElementById("NavigationBar-column3").innerText=newPath;
  }
  render () {
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    return (
      <Menu>
        <Accordion defaultActiveKey="0">
            <Card>
                <Card.Header>
                <Accordion.Toggle as="div" eventKey="0">
                <div className="menu-header"><ion-icon name="football" className="menu-header-icon"></ion-icon>&nbsp;Schedule</div>
                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("Schedule/Game")} to='/Game'>Game</NavLink></ListGroup.Item>
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("Schedule/Game Trip Status")} to='/GameTrip'>Game Trip Status</NavLink></ListGroup.Item>
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("Schedule/Training Status")} to='/Training'>Training Status</NavLink></ListGroup.Item>
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("Schedule/Manage Training")} to='/Trainingtemplate'>Manage Training</NavLink></ListGroup.Item>
                    </ListGroup>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                <Accordion.Toggle as="div" eventKey="1">
                <div className="menu-header"><ion-icon name="people" className="menu-header-icon"></ion-icon>&nbsp;User</div>
                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("User/Players")} to='/Player'>Players</NavLink></ListGroup.Item>
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("User/Drivers")} to='/Driver'>Drivers</NavLink></ListGroup.Item>
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("User/Free Drivers")} to='/FreeDriver'>Free Drivers</NavLink></ListGroup.Item>  
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("User/Invitation Code")} to='/InvitationCode'>Invitation Code</NavLink></ListGroup.Item>                         
                    </ListGroup>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                <Accordion.Toggle as="div" eventKey="2">
                <div className="menu-header"><ion-icon name="logo-dribbble" className="menu-header-icon"></ion-icon>&nbsp;Team</div>
                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("Team/Teams")} to='/Team'>Teams</NavLink></ListGroup.Item>
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("Team/Player-Team")} to='/PlayerTeam'>Player-Team</NavLink></ListGroup.Item>                          
                    </ListGroup>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                <Accordion.Toggle as="div" eventKey="3">
                <div className="menu-header"><ion-icon name="car" className="menu-header-icon"></ion-icon>&nbsp;Trip</div>
                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="3">
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item><NavLink className="menu-item" onClick={()=>this.changeCurrentPath("Trip/History Trips")} to='/Trip'>History Trips</NavLink></ListGroup.Item>                    
                    </ListGroup>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
      </Menu>
    );
  }
}

export default BurgerSideBar;