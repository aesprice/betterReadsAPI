//server related dependencies
var express = require('express');
var port = process.env.PORT || 8045;
var goodreads = require('./goodreads');
var request = require('request');
var cors=require('cors');
var bodyParser = require('body-parser');

//load credentialls locally or from azure
if (process.env.PORT===undefined) {
  var credentials = require('./credentials.js');
} else {
  var credentials = {
    key: process.env['key'],
    secret: process.env['secret']
  };
}

//initialize app and use cors & body parser
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//download html from iframe
var getIframeHtml = function(url) {
  request(url, function (error, response, body) {
    if (error) {
      throw error;
    }
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  });
};

//set up goodreads object with key and secret
var gr = new goodreads.client({
  'key': credentials.key,
  'secret': credentials.secret
});

// gr.requestToken(function() {
//   console.log(arguments);
// });

//get all user's shelves
// gr.getShelves('4067289', function(json) {
//   var userShelves=[];
//   if (json) {
//     var shelves=json.GoodreadsResponse.shelves[0].user_shelf;
//     // console.log(shelves);
//     for (var i=0; i<shelves.length; i++) {
//       var shelf = shelves[i];
//       console.log(shelf.name, shelf.id);
//       userShelves.push(shelf.name);
//     }
//     console.log(userShelves);
//   }
// });


//search for author
//only returns one result
// gr.searchAuthor('Vonnegut', function(json) {
//   if (json) {
//     console.log(json.GoodreadsResponse.author);
//   }
// });

//search for book
// gr.searchBook({query: 'vonnegut', page: 2, search: 'all'}, function(json) {
//   if (json) {
//     //list of books
//     console.log(json.GoodreadsResponse.search[0].results[0].work);
//     //book image details
//     console.log(json.GoodreadsResponse.search[0].results[0].work[0].best_book[0]);
//   }
// });

//good reads review
// returns an iframe; need to adjust CSS to as to make it look nicer
// gr.getReviewsByIsbn('1400067820', function(json) {
//   //pull out iframe data
//   var xml=json.GoodreadsResponse.book[0].reviews_widget[0];

//   //search for iframe url
//   var iframeInd = xml.indexOf('<iframe');
//   var iframeEnd = xml.indexOf('width', iframeInd);

//   var iframeUrl = xml.slice(iframeInd+29, iframeEnd-2);
//   console.log(iframeUrl);

//   //load html from iframe link
//   getIframeHtml(iframeUrl);

// });

//integrate NYT best seller API

//see friend updates

//add book to shelf (to-read, read, etc)

//rate book

app.get('/booksOnShelf', function(req, res) {
  //get all books from certain shelf
  //max per_page of 200

  //example:
  // var params = {id: '4067289', shelf: 'to-read', page: 2, per_page: 5, sort: 'bossy'};
  // gr.getSingleShelf(params, function(data) {
  //   console.log(data.GoodreadsResponse.books[0].book);
  // });
  console.log(req.query);

  var gr = new goodreads.client({
    // 'key': req.query.key,
    // 'secret': req.query.secret
    'key': credentials.key,
    'secret': credentials.secret
  });

  gr.getSingleShelf(req.query, function(data) {
    res.status(200).send(JSON.stringify(data.GoodreadsResponse.books[0].book));
  });

});


app.get('/', function(req, res){
  res.status(200).send('better reads API');
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
