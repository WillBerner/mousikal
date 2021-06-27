import {getAxiosInstance} from "../../config/Axios";

const axios = getAxiosInstance('/spotify');

export async function getArtist(artistName) {
    try {
      return (await axios.get(`/artist`, {
        params: {
          searchTerm: artistName,
        },
      })).data;
    } catch (error) {
      return false;
    }
  }

  export async function getArtistAlbums(artistID) {
    try {
      return (await axios.get(`/artistAlbums`, {
        params: {
          searchTerm: artistID,
        },
      })).data;
    } catch (error) {
      return false;
    }
  }
  
  export async function getAlbumTracks(ID) {
    try {
      return (await axios.get(`/albumTracks`, {
        params: {
          searchTerm: ID,
        },
      })).data;
    } catch (error) {
      return false;
    }
  }
  