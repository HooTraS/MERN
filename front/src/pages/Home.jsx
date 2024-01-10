import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts } from '../redux/slices/posts.js';
import axios from 'axios';

export const Home = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    const { posts } = useSelector((state) => state.posts);
    const [commentsCountMap, setCommentsCountMap] = React.useState({});

    const isPostsLoading = posts.status === 'loading';

    React.useEffect(() => {
        dispatch(fetchPosts());
    }, []);

    React.useEffect(() => {
        const fetchCommentsCount = async (postId) => {
            try {
                const response = await axios.get(`http://localhost:4444/posts/commentsCount/${postId}`);
                return response.data.count;
            } catch (error) {
                console.error(`Error fetching comments count for post with id ${postId}:`, error);
                return 0;
            }
        };

        const updateCommentsCount = async () => {
            const countMap = {};

            for (const post of posts.items) {
                const count = await fetchCommentsCount(post._id);
                countMap[post._id] = count;
            }

            setCommentsCountMap(countMap);
        };

        updateCommentsCount();
    }, [posts.items]);

    const renderPosts = () => {
        if (isPostsLoading) {
            return [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />);
        }

        return posts.items.map((obj, index) => (
            <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={commentsCountMap[obj._id]}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
            />
        ));
    };

    return (
        <>
            <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
                <Tab label="Новые" />
                
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={12} item>
                    {renderPosts()}
                </Grid>
            </Grid>
        </>
    );
};
