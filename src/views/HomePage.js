import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from '../components/Board';
import CustomNavbar from '../components/Navbar';
import UserList from './UserList';
import { useTheme } from '../ThemeContext';

function HomePage() {
    const { theme } = useTheme();

    return (
        <div className={`home-page ${theme}`}>
            <CustomNavbar />
            <Container fluid >
                <Row>
                    <Col md={8} className={theme}>
                        <DndProvider backend={HTML5Backend}>
                            <Board />
                        </DndProvider>
                    </Col>
                    <Col md={4} className={theme}>
                        <UserList />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default HomePage;

