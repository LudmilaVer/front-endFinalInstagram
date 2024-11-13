import { createSlice } from '@reduxjs/toolkit';


let user = null;
try {
  user = JSON.parse(localStorage.getItem('user')); // Попытка преобразовать строку JSON в объект
} catch (error) {
  console.error('Ошибка разбора JSON из localStorage:', error);
}

const initialState = {
  token: localStorage.getItem('token') || null,
  user: user || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Преобразование объекта пользователя в строку JSON
    },
    getUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.getItem('user', JSON.stringify(action.payload)); // Преобразование объекта пользователя в строку JSON
    },
    removeToken: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setToken, setUser, getUser, removeToken } = authSlice.actions;
export default authSlice.reducer;
