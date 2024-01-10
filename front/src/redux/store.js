import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts.js";
import { authReducer } from "./slices/auth.js";
import { commentReducer } from "./slices/comment.js";

const store = configureStore({
    reducer:{
        posts: postsReducer,
        auth: authReducer,
        comment: commentReducer,
    }
});

export default store;