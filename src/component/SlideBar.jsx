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
                        <ion-icon name="football" className="menu-header-icon"></ion-icon><div className="menu-header">Schedules</div>
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><NavLink className="menu-item" to='/Game'>Game</NavLink></ListGroup.Item>
                                <ListGroup.Item><NavLink className="menu-item" to='/'>Training</NavLink></ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as="div" eventKey="1">
                        <ion-icon name="people" className="menu-header-icon"></ion-icon><div className="menu-header">Users</div>
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><NavLink className="menu-item" to='/'>Players</NavLink></ListGroup.Item>
                                <ListGroup.Item><NavLink className="menu-item" to='/'>Drivers</NavLink></ListGroup.Item>                          
                            </ListGroup>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as="div" eventKey="2">
                        <ion-icon name="car" className="menu-header-icon"></ion-icon><div className="menu-header">Trips</div>
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><NavLink className="menu-item" to='/'>Realtime Location</NavLink></ListGroup.Item>
                                <ListGroup.Item><NavLink className="menu-item" to='/'>History Trips</NavLink></ListGroup.Item>                          
                            </ListGroup>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                        <Accordion.Toggle as="div" eventKey="3">
                        <ion-icon name="car" className="menu-header-icon"></ion-icon>
                        <div className="menu-header">Trips</div>
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