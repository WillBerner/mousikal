# Mousikal-client

The client code for a music discussion web application using Vue.js, Axios, and JWTs. Built as a group final project for UNC-CH's Modern Web Development course. The primary function of searching no longer works - my Spotify API key has expired and the application never got hosted anywhere permanently.

Users could register an account, saved in an Express/Node backend with a basic data-store implementation, and then login and recieve a jwt to send authorized requests with. The user could then perform CRUD operations on this data-store database by way of commenting on and favoriting certain album pulled from Spotify's API, allowing the user to discuss the album with other users.

# Some images of the application:

Registering and logging in:
<img width="1050" alt="Register Page" src="https://user-images.githubusercontent.com/25047954/123529563-8a296b80-d6bf-11eb-87d7-20be132dfb7f.png">

After successful login:
<img width="1050" alt="LoggedIn" src="https://user-images.githubusercontent.com/25047954/123529651-64509680-d6c0-11eb-87df-08059c507f58.png">
