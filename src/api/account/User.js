import { getAxiosInstance } from "../../config/Axios";

const axios = getAxiosInstance('/user/info');

export const addUserInfo = async ({age = '', favAlbum = ''} = {}) => {
  window.console.log(age, favAlbum);
  return (await axios.post('', {
    data: {
      age, favAlbum
    },
    type: 'merge'
  })).data.result.posted;
};