require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

let urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.route("/api/shorturl").post((req, res)=>{
  let url = req.body.url;
  dns.lookup(url.replace("https://", ""), (err)=>{
    if (err) {
      if (/https:\/\/[\w]/.test(url)) {
        urls.push(url);
        res.json({ original_url: url, short_url: urls.length-1});
      } else {
        res.json({ error: 'invalid url' });
      }
    } else {
      urls.push(url);
      res.json({ original_url: url, short_url: urls.length-1});
    }
  })
});

app.all("/api/shorturl/:id", (req, res)=>{
  res.redirect(urls[parseInt(req.params.id)]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
