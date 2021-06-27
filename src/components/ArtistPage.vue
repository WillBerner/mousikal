<template>
  <div>
    <div v-if="!albumClickedOn">
      <div>
        <h1>{{artist}}</h1>
      </div>

      <v-container>
        <v-row dense>
          <v-col v-for="album in artistInfo" :key="album.albumID" :cols="4">
            <v-card>
              <v-img
                v-on:click="albumClicked(album.albumID, album.imageURL, album.album)"
                :src="album.imageURL"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="auto"
                width="auto"
              ></v-img>
              <v-card-actions>
                <v-card-title>
                  <span class="title font-weight-light">{{album.album}}</span>
                </v-card-title>
                <div v-if="loggedInUserName!='Anonymous'">
                  <v-btn icon v-if="!checkifUserLiked(album.albumID)">
                    <v-icon color="gray" v-on:click="likeAlbum(album.albumID)">mdi-heart</v-icon>
                  </v-btn>
                  <v-btn icon v-if="checkifUserLiked(album.albumID)">
                    <v-icon color="red" v-on:click="unlikeAlbum(album.albumID)">mdi-heart</v-icon>
                  </v-btn>
                  {{albumsLikeCount(album.albumID)}}
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <br />
    <div v-if="albumClickedOn">
      <Comments
        :loggedInUserName="this.loggedInUserName"
        :albumURL="clickedOnInfo[0]"
        :albumName="clickedOnInfo[1]"
        :tracks="this.tracks"
        :artistName="this.artist"
        :albumID="clickedOnInfo[2]"
      ></Comments>
    </div>
  </div>
</template>

<script>
import Comments from "@/components/Comments.vue";

import _ from "lodash";
import { getArtistAlbums } from "../api/spotify/spotify";
import { getAlbumTracks } from "../api/spotify/spotify";

import { getLikes } from "../api/private/private";
import { createLike } from "../api/private/private";
import { updateLikes } from "../api/private/private";

import { addUserInfo } from "../api/account/User";

export default {
  components: {
    Comments
  },
  props: {
    artistID: String,
    loggedInUserName: String,
    favoriteAlbum: String,
    age: String,
    registered: Boolean
  },
  data: () => ({
    artist: "",
    artistInfo: [],
    albumClickedOn: false,
    clickedAlbumID: "",
    clickedOnInfo: [],
    tracks: [],
    albumLikes: []
  }),
  methods: {
    async getArtistInfo(id) {
      var r = await getArtistAlbums(id);
      this.artistInfo = r;
      this.extractInfo();
    },
    extractInfo() {
      this.artist = this.artistInfo[0].artist;
      this.artistInfo = _.uniqBy(this.artistInfo, "imageURL");
      this.artistInfo = _.uniqBy(this.artistInfo, "album");
    },
    async getAlbumData(albumID) {
      let result = await getAlbumTracks(albumID);
      for (var i = 0; i < result.length; i++) {
        this.tracks[i] = result[i];
      }
    },
    albumClicked(albumID, imageURL, albumName) {
      this.albumClickedOn = true;
      this.getAlbumData(albumID);
      this.clickedOnInfo[0] = imageURL;
      this.clickedOnInfo[1] = albumName;
      this.clickedOnInfo[2] = albumID;
    },
    // albumLiked(id) {
    //   //return true if album liked by user, else return false

    // },
    albumsLikeCount(albumID) {
      var likeNum = 0;
      this.albumLikes.forEach(like => {
        if (albumID == like.albumID && like.liked == "true") {
          likeNum++;
        }
      });
      return likeNum;
    },
    async likeAlbum(id) {
      await createLike({
        user: this.loggedInUserName,
        artistID: this.artistID,
        albumID: id
      });
      this.albumLikes.push({
        albumID: id,
        artistID: this.artistID,
        liked: "true",
        user: this.loggedInUserName
      });
    },
    checkifUserLiked(albumID) {
      for (var i = 0; i < this.albumLikes.length; i++) {
        if (
          albumID == this.albumLikes[i].albumID &&
          this.loggedInUserName == this.albumLikes[i].user &&
          this.albumLikes[i].liked == "true"
        ) {
          return true;
        }
      }
      return false;
    },
    async getAllLikesOfAlbum(id) {
      this.albumLikes = await getLikes({ artistID: id });
      window.console.log("before")
      window.console.log(this.albumLikes);
      if(this.albumLikes == 0) {
        this.albumLikes = [{
        albumID: 0,
        artistID: "this.artistID",
        liked: "true",
        user: "this.loggedInUserName"
      }]
      }

      //window.console.log(likes)
    },
    async unlikeAlbum(albumID) {
      for (var i = 0; i < this.albumLikes.length; i++) {
        if (
          albumID == this.albumLikes[i].albumID &&
          this.loggedInUserName == this.albumLikes[i].user &&
          this.albumLikes[i].liked == "true"
        ) {
          this.albumLikes.splice(i, 1);
        }
      }
      await updateLikes({ likes: this.albumLikes, artistID: this.artistID });
    },
    async pushUserInfo() {
      window.console.log("got to push user info");
      try {
        let res = (await addUserInfo({age: this.age, favAlbum: this.favoriteAlbum}));
        return res;
      } catch(err) {
        window.console.log(err)
      }
    }
  },
  async mounted() {
    await this.getArtistInfo(this.artistID);
    if(this.registered == true) {
      this.pushUserInfo()
    }
    this.getAllLikesOfAlbum(this.artistID);
  }
};
</script>

