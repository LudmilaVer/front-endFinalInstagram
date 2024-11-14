import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTimeAgo } from "../../utils/time.js";
import { fetchComments, addComment } from "../../store/slices/postSlice";
import {
  fetchPostLikes,
  likePost,
  unlikePost,
} from "../../store/slices/likeSlice";
import smileIcon from "../../images/svg/smile.svg";
import heartIcon from "../../images/svg/Heart.svg";
import heartRedIcon from "../../images/svg/Heart-red.svg";
import punkt from "../../images/svg/111.svg";
import styles from "./PostPage.module.css";

const popularEmojis = ["😂", "😍", "😢", "👏", "🔥", "🥳", "❤"];

function ProfilePostPage({ user, post, toggleView }) {
  const [commentText, setCommentText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const dispatch = useDispatch();

  // Получаем комментарии и лайки из состояния Redux
  const comments = useSelector((state) => state.post.comments[post?._id]) || [];
  const likes =
    useSelector((state) => state.likes.likesByPost[post?._id]) || [];
  const currentUserId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (post?._id) {
      dispatch(fetchComments(post._id));
      dispatch(fetchPostLikes(post._id));
    }
  }, [dispatch, post?._id]);

  const handleEmojiClick = (emoji) => {
    setCommentText(commentText + emoji);
    setShowEmojis(false);
  };

  const onSendComment = () => {
    if (!commentText.trim()) return;
    dispatch(addComment({ postId: post._id, comment_text: commentText }));
    setCommentText("");
  };

  const onLike = () => {
    if (likes.some((like) => like.user_id === currentUserId)) {
      dispatch(unlikePost({ postId: post._id, userId: currentUserId }));
    } else {
      dispatch(likePost({ postId: post._id, userId: currentUserId }));
    }
  };

  const isLiked = likes.some((like) => like.user_id === currentUserId);

  if (!user || !post) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.postPage}>
      <div className={styles.header}>
        <div className={styles.headerHead}>
          <Link to={`/profuser/${user._id}`} className={styles.headerBtn}>
            <img
              src={user.profile_image || "default-image-url"}
              alt="Profile"
              className={styles.avatar}
            />
            <p className={styles.username}>{user.username || "Unknown User"}</p>
          </Link>
          <button className={styles.followButton}>Follow</button>
        </div>

        <button className={styles.headerBTN} onClick={toggleView}>
          <img src={punkt} alt="Options" />
        </button>
      </div>

      <div>
        <div className={styles.description}>{post.caption}</div>

        {/* Список комментариев */}
        <div className={styles.comments}>
          {comments.map((comment) => (
            <div key={comment._id} className={styles.comment}>
              <div className={styles.text}>
                <img
                  src={
                    comment.user_id?.profile_image ||
                    "default-profile-image-url"
                  }
                  alt="Profile"
                  className={styles.commentAvatar}
                />
                <div className={styles.commentsText}>
                  <span className={styles.commentUsername}>
                    {comment.user_id?.username || "Anonymous"}
                  </span>{" "}
                  {comment.comment_text}
                  <div className={styles.like_5}>
                    <span>{getTimeAgo(comment.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.likesSection}>
          <div className={styles.likesSectionHeart}>
            <button className={styles.likesSectionBTN} onClick={onLike}>
              <img
                src={isLiked ? heartRedIcon : heartIcon}
                alt="Like"
                className={isLiked ? styles.liked : ""}
              />
            </button>
            <span>{likes.length} likes</span>
          </div>

          <p className="p_10_400">1 day ago</p>
        </div>
        <div className={styles.commentInput}>
          <button
            className={styles.commentInputBtn}
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <img src={smileIcon} alt="Emoji" />
          </button>
          <input
            type="text"
            placeholder="Add comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className={styles.commentInputBtn2} onClick={onSendComment}>
            Send
          </button>
        </div>
        {showEmojis && (
          <div className={styles.emojiPicker}>
            {popularEmojis.map((emoji) => (
              <span
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className={styles.emoji}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePostPage;
