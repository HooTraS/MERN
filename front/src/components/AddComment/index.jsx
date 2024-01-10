import React, { useState } from 'react';

import styles from './AddComment.module.scss';
import { useDispatch } from 'react-redux';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { createComment } from '../../redux/slices/comment.js';
import { useLocation } from 'react-router-dom';

export const Index = () => {
    const [comment, setComment] = useState('');
    const location = useLocation();
    const dispatch = useDispatch();

    const handleSubmit = () => {
        try {
            const postId = location.state.id;
            const userId = location.state.userId;
            console.log(location.state);
            dispatch(createComment({ postId, comment, userId }));
            setComment('');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className={styles.root}>
                <Avatar />
                <div className={styles.form}>
                    <TextField
                        label="Написать комментарий"
                        variant="outlined"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxRows={10}
                        multiline
                        fullWidth
                    />
                    <Button onClick={handleSubmit} variant="contained">
                        Отправить
                    </Button>
                </div>
            </div>
        </>
    );
};
