import React, { useEffect } from 'react';
import { SideBlock } from './SideBlock';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';

import axios from 'axios';

export const CommentsBlock = ({ postId, items, children, isLoading = true }) => {
    const [users, setUsers] = React.useState({});

    useEffect(() => {
        const fetchUser = async (id) => {
            try {
                const response = await axios.get(`http://localhost:4444/users/${id}`);
                const user = response.data;
                setUsers((prevUsers) => ({
                    ...prevUsers,
                    [id]: user,
                }));
            } catch (error) {
                console.error(`Error fetching user with id ${id}:`, error);
            }
        };

        if (!isLoading) {
            items.forEach((obj) => {
                const userId = obj.user;
                if (!users[userId]) {
                    fetchUser(userId);
                }
            });
        }
    }, [items, isLoading]);

    return (
        <SideBlock title="Комментарии">
            {isLoading ? (
                <List>
                    {[...Array(5)].map((_, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Skeleton variant="circular" width={40} height={40} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Skeleton variant="text" height={25} width={120} />}
                                    secondary={<Skeleton variant="text" height={18} width={230} />}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            ) : (
                <List>
                    {items.map((obj, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                                </ListItemAvatar>
                                <ListItemText primary={users[obj.user]?.fullName} secondary={obj.comment} />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}
            {children}
        </SideBlock>
    );
};
