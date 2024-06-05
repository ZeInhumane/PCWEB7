import React, { useEffect, useState } from "react";
import { Button, Container, Form, Image, Nav, Navbar } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { signOut } from "firebase/auth";



export default function PostPageUpdate() {
    const params = useParams();
    const id = params.id;
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("https://zca.sg/img/placeholder");
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    async function updatePost() {
        await updateDoc(doc(db, "posts", id), { caption, image });
        navigate("/");
    }

    async function getPost(id) {
        const postDocument = await getDoc(doc(db, "posts", id));
        const post = postDocument.data();
        setCaption(post.caption);
        setPreviewImage(post.image);
        setImage(post.image);
    }

    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/login");
        getPost(id);
    }, [id, navigate, user, loading]);

    return (
        <div>
            <Navbar variant="light" bg="light">
                <Container>
                    <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/add">New Post</Nav.Link>
                        <Nav.Link onClick={(e) => signOut(auth)}>🚪</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container>
                <h1 style={{ marginBlock: "1rem" }}>Update Post</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="caption">
                        <Form.Label>Caption</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Lovely day"
                            value={caption}
                            onChange={(text) => setCaption(text.target.value)}
                        />
                    </Form.Group>
                    <Image
                        src={previewImage}
                        style={{
                            objectFit: "cover",
                            width: "10rem",
                            height: "10rem",
                        }}
                    />
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => {
                                const imageFile = e.target.files[0];
                                const previewImage = URL.createObjectURL(imageFile);
                                setImage(imageFile);
                                setPreviewImage(previewImage);
                            }}
                        />
                        <Form.Text className="text-muted">
                            Make sure the file has a image type at the end: jpg, jpeg, png.
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" onClick={(e) => updatePost()}>
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    );
}