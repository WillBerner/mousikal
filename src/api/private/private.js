import { getAxiosInstance } from "../../config/Axios";

const axios = getAxiosInstance('/private/likes');


//Get all likes for a certain album
export const getLikes = async ({ artistID = '' }) => {
    try {
        let likes = await axios.get('/'+artistID);
        //alert('reaches')
        //alert(comments.data.result[1].user)
        //console.log(result.data.result);
        likes = likes.data.result;
        //likes = likes.filter(like => like.artistID == artistID);
        return likes;
    } catch (e) {
        return 0;
    }
};

//Make a like
export const createLike = async ({ user = '', artistID = '', albumID = '', liked = "true" }) => {
    return (await axios.post('/'+artistID, {
        data: {
            artistID, albumID, user, liked
        },
        type: 'merge'
    })).data.result.posted;
};

//Delete a comment
export const updateLikes = async ({likes ='', artistID = ''}) => {
    return (await axios.post('/'+artistID, {
      data: likes
    })).data.result.posted;
  };