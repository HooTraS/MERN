import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { CommentController, UserController, PostController } from './controllers/index.js';

mongoose
    //.connect('mongodb+srv://root:SKfbtqF1GPLxsitt@cluster0.hehmewn.mongodb.net/?retryWrites=true&w=majority')
    .connect('mongodb://localhost:27017/blog')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.post('/posts/comment/:id', checkAuth, handleValidationErrors, CommentController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.get('/comments', CommentController.getCommentsByPostId);
app.get('/posts/commentsCount/:postId', CommentController.getCommentsCountByPostId);
app.get('/users/:id', UserController.getUserById);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
