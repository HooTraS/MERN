import React from 'react';
import { useParams } from 'react-router-dom';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios.js';
import ReactMarkdown from 'react-markdown';

export const FullPost = () => {
    const [data, setData] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const [comments, setComments] = React.useState([]);
    const { id } = useParams();

    React.useEffect(() => {
        axios
            .get(`/posts/${id}`)
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.warn(err);
                alert('Ошибка при получении статьи');
            });

        axios
            .get(`/comments?post=${id}`)
            .then((res) => {
                setComments(res.data);
            })
            .catch((err) => {
                console.warn(err);
                alert('Ошибка при получении комментариев');
            });
    }, [id]);

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost />;
    }

    return (
        <>
            <Post
                id={data._id}
                title={data.title}
                imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={data.commentsCount}
                tags={data.tags}
                isFullPost
            >
                <ReactMarkdown children={data.text} />
            </Post>
            <CommentsBlock items={comments} postId={data._id} isLoading={false}>
                <Index />
            </CommentsBlock>
        </>
    );
};
