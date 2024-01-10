import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ()=> {
    const { data } = await axios.get('/posts');
    return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id)=> 
axios.delete(`/posts/${id}`),
);

const initialState = {
    posts: {
        items: [],
        status: "loading",
    },
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducer: {},
    extraReducers: {
        //Получение статей
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, actions) => {
            state.posts.items = actions.payload;
            state.posts.status = 'loaded';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },

        //Удаление статей
        [fetchRemovePost.pending]: (state, actions) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== actions.meta.arg);
        },
    },
})

export const postsReducer = postsSlice.reducer;