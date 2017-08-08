var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles={
    
   'article-one'  : {
        title:     ' Article one | Amanpreet Singh',
     heading:   ' Article one',
     date:       ' 4 August,2017',
     content: `
     <p>
                This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
           </p>
            <p>
                This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
           </p>
           <p>
               This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
           </p>`
    },
    'article-two' : {
        title:     ' Article two | Amanpreet Singh',
     heading:   ' Article two',
     date:       ' 5 August,2017',
     content: `
    
           <p>
               This is the content for my second article.
           </p>`
    },
    'article-three' :{
         title:     ' Article three | Amanpreet Singh',
         heading:   ' Article three',
         date:       ' 5 August,2017',
         content: `
    
           <p>
               This is the content for my third article.
           </p>`
    }
    
};

function createTemplate (data){
    var title=data.title;
    var heading=data.heading;
    var date=data.date;
    var content=data.content;

var htmlTemplate =`
<html>
    <head>
        <title>
            {title}
        </title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <style>
          .container{
              max-width: 800px;
              margin: 0auto;
              color: grey;
              font-family: sans-serif;
              padding-top: 60px;
              padding-left: 20px;
              padding-right: 20px;
          }
        </style>
   </head>
           <body>
       <div>
           <a href="/">Home</a>
       </div>
        <hr/>
        <h3>
           ${heading}
       </h3>
        <div>
            ${date}
        </div>
        <div>
            ${content}
        </div>
    </body>
</html> `;

return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var counter=0;
app.get('/counter', function (req, res) {
    counter=counter+1;
  res.send(counter.toString());
});
app.get('/:articlename', function (req, res){
    var articlename=req.params.articlename;
    res.send(createTemplate(articles[articlename]));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
var names=[];
app.get('/submit-name/:name', function (req, res) {
  var name=req.params.name;
  
  names.push(name);
  ///Json:
  res.send(JSON.stringify(names));
  
  
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
