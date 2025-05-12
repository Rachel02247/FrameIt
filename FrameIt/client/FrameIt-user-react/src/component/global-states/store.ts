import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import tagSlice from './tagSlice';
import fileSlice from './fileSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    tags: tagSlice,
    files: fileSlice

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;
