import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTheme } from '../ThemeContext';

function UserList() {
    const { theme } = useTheme();
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await getDocs(collection(db, 'users'));
            const usersData = usersCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setUsers(usersData);
        };

        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'users'), { username, email });
            setUsername('');
            setEmail('');
            setShowModal(false);
            // Fetch users again to update the list
            const usersCollection = await getDocs(collection(db, 'users'));
            const usersData = usersCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setUsers(usersData);
        } catch (error) {
            console.error('Error adding user: ', error);
        }
    };

    return (
        <div className={`user-manager ${theme}`}>
            <h2>User Management</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>Add User</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
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
                            Add User
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default UserList;
