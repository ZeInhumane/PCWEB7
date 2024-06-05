import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import TaskList from './TaskList';
import { useAuth } from '../AuthProvider';
import Navbar from './Navbar';

function Board() {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (currentUser) {
            const q = query(collection(db, 'tasks'), where('uid', '==', currentUser.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const tasksData = [];
                snapshot.forEach((doc) =>
                    tasksData.push({ ...doc.data(), id: doc.id })
                );
                setTasks(tasksData);
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await getDocs(collection(db, 'users'));
            const usersData = usersCollection.docs.map(doc => doc.data());
            setUsers(usersData);
        };

        fetchUsers();
    }, []);

    const handleDropTask = (id, newStatus) => {
        const taskDoc = doc(db, 'tasks', id);
        updateDoc(taskDoc, { status: newStatus });
    };

    return (
        <Container fluid>
            <h1 className="text-center my-4">Task Manager</h1>
            <Row>
                <Col md={4}>
                    <TaskList
                        status="To Do"
                        tasks={tasks.filter((task) => task.status === 'To Do')}
                        onDropTask={handleDropTask}
                        users={users}
                    />
                </Col>
                <Col md={4}>
                    <TaskList
                        status="In Progress"
                        tasks={tasks.filter((task) => task.status === 'In Progress')}
                        onDropTask={handleDropTask}
                        users={users}
                    />
                </Col>
                <Col md={4}>
                    <TaskList
                        status="Done"
                        tasks={tasks.filter((task) => task.status === 'Done')}
                        onDropTask={handleDropTask}
                        users={users}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Board;
