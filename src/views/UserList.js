import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function UserList() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const usersCollection = await getDocs(collection(db, 'users'));
        const usersData = usersCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setUsers(usersData);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                const userDoc = doc(db, 'users', userId);
                await updateDoc(userDoc, { username, email });
            } else {
                await addDoc(collection(db, 'users'), { username, email });
            }
            setUsername('');
            setEmail('');
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error adding/updating user: ', error);
        }
    };

    const handleEditUser = (user) => {
        setUsername(user.username);
        setEmail(user.email);
        setUserId(user.id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDeleteUser = async (id) => {
        try {
            const userDoc = doc(db, 'users', id);
            await deleteDoc(userDoc);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user: ', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setUsername('');
        setEmail('');
        setUserId(null);
    };

    return (
        <div>
            <h2>User Management</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>Add User</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEditUser(user)} className="mr-2">Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddUser}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editMode ? 'Update User' : 'Add User'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default UserList;
