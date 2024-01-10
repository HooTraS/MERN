import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

const initialState = {
    comment: [],
    loading: false,
};

export const createComment = createAsyncThunk('comment/createComment', async (post, commentt, userIdd) => {
    try {
        console.log(post);
        const postId = post.postId;
        const userId = post.userId;
        const comment = post.comment;
        const { data } = await axios.post(`/posts/comment/${postId}`, {
            postId,
            userId,
            comment,
        });
        return data;
    } catch (err) {
        console.log(err);
    }
});

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: {
        [createComment.pending]: (state) => {
            state.loading = true;
        },
        [createComment.fulfilled]: (state, actions) => {
            state.comments.items = actions.payload;
            state.loading = false;
        },
        [createComment.rejected]: (state) => {
            state.loading = false;
        },
    },
});

export const commentReducer = commentSlice.reducer;
