const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

// require spotify-web-api-node package here:



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = 'b79b10bd0d1d44d3a5acc36879f307e2',
    clientSecret = '9fe44eb5be014f278d6f5106738865e1';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })





// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  const artistSearch = req.query.searchInput
  spotifyApi.searchArtists(artistSearch)
    .then(data => {
      const artistsArray = data.body.artists.items
      res.render('artists', {artistsArray} );
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  const {artistId} = req.params
  spotifyApi.getArtistAlbums(artistId)
  .then(albumInfo => {
    const albumArray = albumInfo.body.items
    res.render('albums', {albumArray} );
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.get('/tracks/:tracks', (req, res, next) => {
  const {tracks} = req.params
  spotifyApi.getAlbumTracks(tracks)
  .then(trackInfo => {
    const trackArray = trackInfo.body.items
    console.log(trackArray)
    res.render('tracks', {trackArray} );
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
