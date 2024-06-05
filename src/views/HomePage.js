import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from '../components/Board';
import CustomNavbar from '../components/Navbar';
import UserList from './UserList';

function HomePage() {
    return (
        <>
            <CustomNavbar />
            <Container fluid>
                <Row>
                    <Col md={8}>
                        <DndProvider backend={HTML5Backend}>
                            <Board />
                        </DndProvider>
                    </Col>
                    <Col md={4}>
                        <UserList />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default HomePage;
