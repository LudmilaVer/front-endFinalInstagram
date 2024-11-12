import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../store/slices/postSlice";
import styles from './ExplorePage.module.css';
import { useNavigate } from "react-router-dom";
// import PostsExplore from '../Posts/PostsExplore';
function ExplorePage() {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts);
    const postStatus = useSelector((state) => state.post.status);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        setIsVisible(true);
        
        // Загружаем посты только если они еще не загружены
        if (postStatus === 'idle') {
            dispatch(fetchPosts());
        }
    }, [dispatch, postStatus]);
    const handleImageClick = (post) => {
        navigate(`/profuser/${post.user_id._id}`)
        // setSelectedPost(post);
    };
    const handleClose = () => {
        setSelectedPost(null);
    };
    const randomPosts = [...posts]
        .sort(() => 0.5 - Math.random())
        .slice(0, 32);
    return (
        <div className={`${styles.container} ${isVisible ? styles.fadeIn : ''}`}>
            <div className={styles.cont_img}>
                {postStatus === 'loading' ? (
                    <p>Загрузка...</p>
                ) : (
                    randomPosts.map((post) => (
                        <img
                        
                            key={post._id}
                            src={post.image_url}
                            alt={post.caption || "Random post"}
                            onClick={() => handleImageClick(post)}
                        />
                    ))
                )}
            </div>
            
            {/* {selectedPost && (
                // <PostsExplore post={selectedPost} onClose={handleClose} />
            )} */}
        </div>
    );
}

export default ExplorePage;
