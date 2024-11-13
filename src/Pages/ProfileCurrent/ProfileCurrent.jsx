import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../store/slices/authSlice";
import styles from "./ProfileCurrent.module.css";

function ProfileCurrent() { 
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Запрашиваем данные о текущем пользователе при каждом открытии профиля
    dispatch(getUser());
  }, [dispatch]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Ошибка загрузки профиля: {error}</div>;

  if (!user) {
    return <div>Данные профиля не найдены.</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profileMain}>
        <div className={styles.profileHeader}>
          <div className={styles.profileLogo}>
            <button className={styles.profileBtn}>
              <img
                src={user.profile_image || "path/to/default/avatar.jpg"}
                alt="logo"
              />
            </button>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileContent_it}>
              <p className={`${styles.profileLink_1} h3_20`}>
                {user.username || "Username"}
              </p>
              <p className={`${styles.profileLinkMyProf} p_14Bold_black`}>
                Edit profile
              </p>
            </div>
            <div className={styles.profilePosts}>
              <p><span className="p_16Bold">{user.posts_count || 0}</span> post</p>
              <p><span className="p_16Bold">{user.followers_count || 0}</span> followers</p>
              <p><span className="p_16Bold">{user.following_count || 0}</span> following</p>
            </div>
            <div className={styles.profilePosts_content}>
              <p className="p_14Small">{user.bio || "No bio available."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCurrent;
