import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import tagSlice from './tagSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    tags: tagSlice

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;
