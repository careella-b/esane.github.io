import { useState, useEffect } from "react";
import { collection, getDocs, serverTimestamp, addDoc } from "firebase/firestore"; 
import { db } from "../../Firebase";
import { useNavigate } from "react-router-dom";

function AddBlogPost() {
    const [categories, setCategories] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [author, setAuthor] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const querySnapshot = await getDocs(collection(db, "category"));
            const categoriesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoriesData);
        };
        fetchCategories();
    }, []);

    const renderMessage = () => {
        if (message) {
            const messageClass = messageType === "success" ? "alert-success" : "alert-danger";
            return (
                <div className={`alert ${messageClass}`} role="alert">
                    {message}
                </div>
            );
        }
        return null;
    };

    const handleTitleChange = (e) => {
        setPostTitle(e.target.value);
    };

    const handleBodyChange = (e) => {
        setPostBody(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategoryId(e.target.value);
    };

    const handleAuthorChange = (e) => {
        setAuthor(e.target.value);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "blogPosts"), {
                postTitle,
                postBody,
                category_id: selectedCategoryId,
                datePosted: serverTimestamp(),
                author,
            });
            setPostTitle("");
            setPostBody("");
            setSelectedCategoryId("");
            setAuthor("");
            setMessage("Blog post added successfully. You will be redirected...");
            setMessageType("success");
            setTimeout(() => [setMessage(""), navigate("/admin/blog")], 5000);

        } catch (error) {
            console.error("Error adding blog post: ", error);
            setMessage("Error adding blog post: " + error.message);
            setMessageType("error");
            setTimeout(() => setMessage(""), 10000);
        }
    };

    return (
        <div className="container pl-50 pr-50 pt-50 pb-50">
            <h3 className="black-color pb-30">Add Blog Post</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="postTitle">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="postTitle"
                        value={postTitle}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="postBody">Body</label>
                    <textarea
                        className="form-control"
                        id="postBody"
                        rows="10"
                        value={postBody}
                        onChange={handleBodyChange}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        className="form-control"
                        value={selectedCategoryId}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Select category...</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        className="form-control"
                        id="author"
                        value={author}
                        onChange={handleAuthorChange}
                    />
                </div>
                <button type="submit" className="secondary-btn mb-20">
                    Save
                </button>
                {renderMessage()}
            </form>
        </div>
    );
}

export { AddBlogPost };
