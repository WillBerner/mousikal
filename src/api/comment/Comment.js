import { getAxiosInstance } from "../../config/Axios";

const axios = getAxiosInstance('/public/comments');

//Get all comments for a certain album
export const getAlbumComments = async ({ albumID = '' }) => {
    try {
        let comments = await axios.get('');
        comments = comments.data.result;
        var albumComments = comments.filter(comment => comment.albumID == albumID);
        albumComments = albumComments.sort(function (a, b) {
            return b.date - a.date;
        });
        return albumComments;
    } catch (e) {
        return [];
    }
};

//Make a comment
export const createComment = async ({ user = '', commentBody = '', albumID = '', date = new Date().getTime() }) => {
    return (await axios.post('', {
        data: {
            albumID, user, commentBody, date
        },
        type: 'merge'
    })).data.result.posted;
};

//Delete a comment
export const updateComments = async (albumComments) => {
    return (await axios.post('', {
      data: albumComments
    })).data.result.posted;
  };
  