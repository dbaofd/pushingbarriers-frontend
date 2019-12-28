import React from 'react';
import '../css/SlideBar.css';
import {NavLink} from "react-router-dom";
import {Accordion,Card,ListGroup} from 'react-bootstrap';
class SlideBar extends React.Component{
    constructor(props){ 
        super(props);
    }
    render(){
        return(
            <div id="menu">
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as="div" eventKey="0">
                        <div className="menu-header"><ion-icon name="football" className="menu-header-icon"></ion-icon>&nbsp;Schedules</div>
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><NavLink className="menu-item" to='/Game'>Game</NavLink></ListGroup.Item>
                                <ListGroup.Item><NavLink className="menu-item" to='/Training'>Training</NavLink></ListGroup.Item>
                                <ListGroup.Item><NavLink className="menu-item" to='/Trainingtemplate'>Update Training</NavLink></ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as="div" eventKey="1">
                        <div className="menu-header"><ion-icon name="people" className="menu-header-icon"></ion-icon>&nbsp;Users</div>
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><NavLink className="menu-item" to='/Player'>Players</NavLink></ListGroup.Item>
                                <ListGroup.Item><NavLink className="menu-item" to='/Driver'>Drivers</NavLink></ListGroup.Item>                          
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
                                <ListGroup.Item><NavLink className="menu-item" to='/Team'>Teams</NavLink></ListGroup.Item>
                                <ListGroup.Item><NavLink className="menu-item" to='/'>History Trips</NavLink></ListGroup.Item>                          
                            </ListGroup>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as="div" eventKey="3">
                        <div className="menu-header"><ion-icon name="car" className="menu-header-icon"></ion-icon>&nbsp;Trips</div>
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="3">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><NavLink className="menu-item" to='/'>Realtime Location</NavLink></ListGroup.Item>
                                <ListGroup.Item><NavLink className="menu-item" to='/'>History Trips</NavLink></ListGroup.Item>                          
                            </ListGroup>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        );
    }
}

export default SlideBar;