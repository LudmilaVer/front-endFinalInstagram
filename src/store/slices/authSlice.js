// import { createSlice } from '@reduxjs/toolkit';


// let user = null;
// try {
//   user = JSON.parse(localStorage.getItem('user')); // Попытка преобразовать строку JSON в объект
// } catch (error) {
//   console.error('Ошибка разбора JSON из localStorage:', error);
// }

// const initialState = {
//   token: localStorage.getItem('token') || null,
//   user: user || null,
//   isAuthenticated: !!localStorage.getItem('token'),
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setToken: (state, action) => {
//       state.token = action.payload;
//       state.isAuthenticated = true;
//       localStorage.setItem('token', action.payload);
//     },
//     setUser: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//       localStorage.setItem('user', JSON.stringify(action.payload)); // Преобразование объекта пользователя в строку JSON
//     },
//     getUser: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//       localStorage.getItem('user', JSON.stringify(action.payload)); // Преобразование объекта пользователя в строку JSON
//     },
//     removeToken: (state) => {
//       state.token = null;
//       state.user = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     },
//   },
// });

// export const { setToken, setUser, getUser, removeToken } = authSlice.actions;
// export default authSlice.reducer;

// Функция для декодирования JWT токена без использования библиотеки
import { createSlice } from '@reduxjs/toolkit';

// Функция для декодирования JWT токена без использования библиотеки
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]; // Берем вторую часть токена
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Ошибка декодирования токена:', error);
    return null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    userId: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);

      // Декодируем токен и сохраняем userId
      try {
        const decoded = decodeToken(action.payload); // Используем альтернативную функцию декодирования
        state.userId = decoded?.user_id || decoded?.id; // Попытка получить user_id или id
        console.log('Decoded Token:', decoded);
        console.log('Decoded User ID:', state.userId);
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
      }
    },
    removeToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userId = null; // Очищаем userId при выходе
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;
