import React, { useState } from 'react';
import { Navbar, Nav, Button, Modal, NavDropdown } from 'react-bootstrap';
import TaskForm from './TaskForm';
import { useAuth } from '../AuthProvider';
import { FaTasks, FaSignOutAlt, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

function CustomNavbar() {
    const { currentUser, logout } = useAuth();
    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
                <Navbar.Brand href="/">Task Board</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {currentUser ? (
                            <>
                                <Button
                                    variant="outline-light"
                                    onClick={handleShow}
                                    className="mr-2 d-flex align-items-center"
                                >
                                    <FaTasks className="mr-1" /> Add Task
                                </Button>
                                <Button
                                    variant="outline-light"
                                    onClick={handleLogout}
                                    className="d-flex align-items-center"
                                >
                                    <FaSignOutAlt className="mr-1" /> Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link href="/login" className="d-flex align-items-center">
                                    <FaSignInAlt className="mr-1" /> Login
                                </Nav.Link>
                                <Nav.Link href="/signup" className="d-flex align-items-center">
                                    <FaUserPlus className="mr-1" /> Sign Up
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TaskForm onClose={handleClose} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CustomNavbar;
