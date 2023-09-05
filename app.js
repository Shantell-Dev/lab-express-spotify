require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index'); 
  });
  // Artist Search Route
app.get('/artist-search', (req, res) => {
    const artistName = req.query.artistName; // artistName
    spotifyApi
      .searchArtists(artistName)
      .then(data => {
        const artists = data.body.artists.items; 
        console.log(artists);
        res.render('artist-search-results', { artists });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/artist-albums/:id', (req, res) => {
    const artistId = req.params.id; 
    res.send(`View albums for artist with ID: ${artistId}`);
});

//const urlParams = new URLSearchParams(window.location.search);
const albumId = urlParams.get('album_id');

spotifyApi
  .getAlbumTracks(albumId)
  .then((data) => {
    const tracks = data.body.items;

    tracks.forEach((track) => {
      const trackName = document.createElement('div');
      trackName.textContent = track.name;
      document.body.appendChild(trackName);
    });
  })
  .catch((error) => {
    console.error('Error fetching album tracks:', error);
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
