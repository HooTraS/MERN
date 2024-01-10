import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const create = async (req, res) => {
    try {
        const { postId, comment, userId } = req.body;

        const newComment = new Comment({
            comment: comment,
            post: postId,
            user: userId,
        });

        await newComment.save();

        try {
            await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: newComment._id } });
        } catch (err) {
            console.log(err);
        }

        res.json(newComment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Не удалось создать комментарий' });
    }
};

export const getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.query.post;
        const comments = await Comment.find({ post: postId });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при получении комментариев' });
    }
};

export const getCommentsCountByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;

        const count = await Comment.countDocuments({ post: postId });

        res.json({ count });
    } catch (error) {
        console.error('Error retrieving comments count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
