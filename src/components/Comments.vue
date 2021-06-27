<template>
  <v-container>
    <v-row>
      <v-col>
        <v-img
          v-on:click="playSound()"
          :src="this.albumURL"
          contain
          max-height="500"
          max-width="500"
        ></v-img>
        <br />
        <v-layout justify-center>
          <v-subheader class="headline font-weight-bold">{{this.artistName}}</v-subheader>
        </v-layout>
      </v-col>
    </v-row>

    <v-layout justify-center>
      <v-subheader class="font-weight-light">{{this.albumName}}</v-subheader>
    </v-layout>

    <v-layout justify-center>
      <br />
    </v-layout>
    <v-btn v-on:click="getTracks()" v-on:hover="alert()">Show tracks</v-btn>
    <br />

    <v-layout justify-center>
      <v-list v-if="tracksRequested">
        <v-list-item v-for="track in tracks" :key="track.number">
          <v-card min-width=" 600">
            <v-card-text>
              {{track.name}}
              <span style="float:right;">{{millisToMinutesAndSeconds(track.duration)}}</span>
            </v-card-text>
          </v-card>
        </v-list-item>
      </v-list>
    </v-layout>


    <v-layout text-center wrap justify-center>
      <v-flex xs6 mb-5>
        <div v-if="loggedInUserName!='Anonymous'">
          <h2 class="headline font-weight-bold mb-3">Make a comment</h2>
          <v-layout justify-center>
            <v-textarea outlined name="comment-box" label="Make a comment" value v-model="comment"></v-textarea>
          </v-layout>
          <v-btn class="white--text" color="deep-purple accent-4" @click="submitComment">Submit</v-btn>
        </div>
      </v-flex>
      <v-col cols="12">
      <v-layout justify-center v-for="comment in albumComments" :key="comment.date">
        <v-card class="mx-6 mb-6" color="green" dark max-width="600" min-width="500">
          <v-card-title>
            <v-icon large left>mdi-comment</v-icon>
            <span class="title font-weight-light">Comment</span>
          </v-card-title>

          <v-card-text
            class="headline font-weight-bold"
            v-if="comment.edit!=true"
          >{{comment.commentBody}}</v-card-text>
          <div v-else>
            <v-textarea
              outlined
              name="comment-box"
              label="Make a comment"
              value
              v-model="comment.editVersion"
            ></v-textarea>
            <v-btn
              class="white--text"
              color="deep-purple accent-4"
              v-on:click="submitEdit(comment.date)"
            >Submit</v-btn>
            <v-btn
              class="white--text"
              color="deep-purple accent-4"
              v-on:click="cancelEdit(comment.date)"
            >Cancel</v-btn>
          </div>

          <v-card-actions>
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{comment.user}}</v-list-item-title>
              </v-list-item-content>

              <v-row align="center" justify="end" v-if="comment.user == userName">
                <v-icon
                  class="mr-1"
                  v-on:click.native="editComment(comment.date)"
                  v-if="comment.edit!=true"
                >mdi-pencil</v-icon>
                <span
                  class="subheading mr-2"
                  v-on:click="editComment(comment.date)"
                  v-if="comment.edit!=true"
                >Edit</span>
                <span class="mr-1"></span>
                <v-icon class="mr-1" v-on:click="deleteComment(comment.date)">mdi-delete</v-icon>
                <span class="subheading" v-on:click="deleteComment(comment.date)">Delete</span>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-layout>
      </v-col>
    </v-layout>
  </v-container>
</template>

<script>
import { createComment } from "../api/comment/Comment";
import { getAlbumComments } from "../api/comment/Comment";
import { updateComments } from "../api/comment/Comment";

export default {
  props: {
    loggedInUserName: String,
    albumURL: String,
    albumName: String,
    tracks: [],
    artistName: String,
    albumID: String
  },
  data: () => ({
    userName: "",
    comment: "",
    albumComments: [],
    tracksRequested: false,
    playingMusic: false
  }),
  methods: {
    async submitComment() {
      let comments = await createComment({
        user: this.userName,
        commentBody: this.comment,
        albumID: this.albumID
      });
      this.albumComments.unshift({
        user: this.userName,
        commentBody: this.comment,
        edit: false,
        editVersion: "",
        albumID: this.albumID,
        date: new Date().getTime()
      });
      this.comment = "";
      return comments;
    },
    getTracks() {
      this.tracksRequested = !this.tracksRequested;
    },
    playSound() {
      if (this.playingMusic) {
        return false;
      } else {
        var audio = new Audio(this.tracks[0].sampleURL);
        this.playingMusic = true;
        setTimeout(function() {this.playingMusic = false;}, 300);
        audio.play();
      }
    },
    requestTracks() {
      var r = document.getElementById("trackList");
      for (var i = 0; i < this.tracks.length; i++) {
        r.innerHTML +=
          "<h4 onclick=this.test()><span style='float:left;'>" +
          this.tracks[i].name +
          "</span><span style='float:right;'>" +
          this.millisToMinutesAndSeconds(this.tracks[i].duration) +
          "</span></h4><br>";
      }
    },
    async fetchAlbumComments() {
      let comments = await getAlbumComments({ albumID: this.albumID });
      //this.albumComments = comments;
      // this.requestTracks();
      setTimeout(this.requestTracks, 500);
      this.albumComments = [];

      comments.forEach(comment => {
        this.albumComments.push({
          ...comment,
          edit: false,
          editVersion: ""
        });
      });
      this.loaded = true;

      return comments;
    },
    millisToMinutesAndSeconds(millis) {
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    async deleteComment(date) {
      this.albumComments = this.albumComments.filter(
        comment => comment.date !== date
      );

      var tmp = [];
      this.albumComments.forEach(comment => {
        tmp.push({
          albumID: comment.albumID,
          user: comment.user,
          commentBody: comment.commentBody,
          date: comment.date
        });
      });

      await updateComments(tmp);
    },
    async editComment(date) {
      var commentIndex = this.albumComments.findIndex(
        comment => comment.date == date
      );
      this.albumComments[commentIndex].edit = true;
      //alert("got here");
      this.albumComments[commentIndex].editVersion = this.albumComments[
        commentIndex
      ].commentBody;
      window.console.log("editing")
    },
    cancelEdit(date) {
      var commentIndex = this.albumComments.findIndex(
        comment => comment.date == date
      );
      this.albumComments[commentIndex].edit = false;
    },
    async submitEdit(date) {
      var commentIndex = this.albumComments.findIndex(
        comment => comment.date == date
      );

      this.albumComments[commentIndex].commentBody = this.albumComments[
        commentIndex
      ].editVersion;
      this.albumComments[commentIndex].edit = false;

      var tmp = [];
      this.albumComments.forEach(comment => {
        tmp.push({
          albumID: comment.albumID,
          user: comment.user,
          commentBody: comment.commentBody,
          date: comment.date
        });
      });

      await updateComments(tmp);
    }
  },
  mounted() {
    this.fetchAlbumComments();
    this.userName = this.loggedInUserName;
  }
};
</script>

