var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');
var config={
    user: 'apsmiglani',
   database: 'apsmiglani',
   host:'db.imad.hasura-app.io',
   port:'5432',
   password:process.env. DB_PASSWORD
    
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'someRamndomSecretValue',
    cookie:{ maxAge:1000*60*60*24*30}
}));
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
            ${date.toDateString()}
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
function hash(input,salt)
{
    // How do we create a hash?
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'shah512');
    return["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input', function (req, res){
   var hashedString =hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
});
app.post('/create-user',function(req,res){
   //username,password
   //JSON
   var username=req.body.username;
   var password=req.body.password;
   var salt=crypto.randomBytes(128).toString('hex');
   var dbString=hash(password,salt);
   pool.query('INSERT INTO "user"(username,password) VALUES ($1,$2)',[USERNAME,dbString],function(err,result){
     if(err) {
         res.status(500).send(err.toString());
     }
     else{
         res.send('user successfully created:'+username);
     }   
   });
});
app.post('/login',function(req,res){
  var username=req.body.username;
   var password=req.body.password;  
    pool.query('SELECT * FROM "user" WHERE username=$1',[username],function(err,result){
     if(err) {
         res.status(500).send(err.toString());
     }
     else{
         if(result.rows.length===0){
             res.send(403).send('username/password is invalid');
         }
         else{
             //match the password
             var dbString=result.rows[0].password;
             var salt=dbString.split('$')[2];
             var hashedPassword=hash(password,salt);//creating a hash based on the password submitted and the original salt
             if(hashedPassword==dbString){
              //set the session
              req.session.outh={userId: result.rows[0].id};
              //set cookie with a session id
              //internally on the server side ,it maps the session id to an objecto
              //{outh:{userid}}
         res.send('credentials correct!');
     } else{
         res.send(403).send('username/password is invalid');
     }
     }
     }
   });
});
app.get('/check-login',function(req,res){
   if(req.session && req.session.outh && req.session.outh.userid){
       res.send('You are logged in:'+req.session.outh.userId.toString());
   } 
   else
   {
       res.send('you are not logged in');
   }
});
app.get('/logout',function(req,res){
    delete req.session.outh;
    res.send('Logged out');
})
var pool=new Pool(config);
app.get('/test-db', function (req, res) {
  pool.query('SELECT * FROM test',function(err,result){
     if(err) {
         res.status(500).send(err.toString());
     }
     else{
         res.send(JSON.stringify(result.rows));
     }
  });
});
var counter=0;
app.get('/counter', function (req, res) {
    counter=counter+1;
  res.send(counter.toString());
});
var names=[];
app.get('/submit-name', function (req, res) {
  var name=req.query.name;
  
  names.push(name);
  ///Json:
  res.send(JSON.stringify(names));
  
  
});

app.get('/articles/:articleName', function (req, res){
   
   pool.query("SELECT * FROM article WHERE title= $1", [req.params.articleName],function(err,result){
       if(err) {
         res.status(500).send(err.toString());
     }
     else{
         if(result.rows.length===0){
         res.status(404).send('Article not found');
     } else{
         var articleData=result.rows[0];
         res.send(createTemplate(articleData));
     }
     } 
   });
    
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


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
