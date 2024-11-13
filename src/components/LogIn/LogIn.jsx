import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import FadeTransition from "../../components/FadeTransition";
import ICH from "../../images/svg/ICH2.svg";
import Button from "../Button/button.jsx";
import { $api } from "../../utils/api.ts";
import styles from "./LogIn.module.css";
import phone from "../../images/png/Background111.png";
import { useDispatch } from "react-redux";
import { setUser, setToken } from '../../store/slices/authSlice.js';

// Валидационная схема с использованием Yup
const validationSchema = Yup.object().shape({
  emailOrUsername: Yup.string().required("Введите email или имя пользователя"),
  password: Yup.string()
    .required("Введите пароль")
    .min(6, "Пароль должен содержать минимум 6 символов"),
});

function LogIn() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await $api.post("/auth/login", {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      });

      const { token, user } = response.data;

      // Сохраняем токен и пользователя в Redux
      dispatch(setToken(token));
      dispatch(setUser(user));

      // Сохраняем токен и пользователя отдельно в localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Перенаправляем на домашнюю страницу
      navigate("/home");
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Ошибка при авторизации"
      );
    }
  };

  return (
    <FadeTransition>
      <div className={styles.loginbox}>
        <div className={styles.phonesimage}>
          <img src={phone} alt="" />
        </div>
        <div className={styles.LogIn_cont}>
          <div>
            <img src={ICH} alt="logo" />
          </div>
          <div className={styles.inputbox}>
            <form className={styles.Login_form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.login_cont_inp}>
                <div className={styles.LogIn_cont_input}>
                  <input
                    type="text"
                    name="emailOrUsername"
                    placeholder="Введите email или имя пользователя"
                    {...register("emailOrUsername")}
                    className={styles.LogIn_inp}
                  />
                </div>
                {errors.emailOrUsername && (
                  <p className={styles.errorText}>
                    {errors.emailOrUsername.message}
                  </p>
                )}

                <div className={styles.LogIn_cont_input}>
                  <input
                    type="password"
                    name="password"
                    placeholder="Введите пароль"
                    {...register("password")}
                    className={styles.LogIn_inp}
                  />
                </div>
                {errors.password && (
                  <p className={styles.errorText}>{errors.password.message}</p>
                )}
                {loginError && (
                  <p className={styles.errorText}>{loginError}</p>
                )}
              </div>
              <div className={styles.login_button}>
                <Button text="Войти" type="submit" />
              </div>
              <div className={styles.login_or}>
                <div className={styles.login_line}></div>
                <p>или</p>
                <div className={styles.login_line}></div>
              </div>
              <div className={styles.login_link}>
                <Link to="/reset" className="p_blue">
                  Забыли пароль?
                </Link>
              </div>
            </form>
          </div>
          <div className={styles.login_bottom}>
            <p className="p_14Small">Нет аккаунта?</p>
            <Link to="/signup" className="p_14Blue">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </FadeTransition>
  );
}

export default LogIn;
