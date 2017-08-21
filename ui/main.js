console.log('Loaded!');
//var element=document.getElementById('main-text');
//element.innerHTML='New value';
var img=document.getElementById('madi');
var marginLeft=0;
function moveRight(){
    marginLeft= marginLeft+1;
    img.style.marginLeft= marginLeft+'px';
    
}
img.onclick=function()
{
    var interval= setInterval(moveRight,50);
};

//submit username/passwordto login
var submit=document.getElementById('submit_btn');
submit.onclick=function()
{
var request=new XMLHttpRequest();
  request.onreadystatechange=function()
  {
    if(request.readyState == XMLHttpRequest.DONE)
    {
        if(request.status == 200)
        {
            console.log('user logged in');
            alert('Logged in Successfully');
    
    }
    else if(request.status == 403)
    {
        alert('username/password is incorrect');
    }
     else if(request.status == 500)
    {
        alert('something went wrong on the server');
    }
    
        }
    
  };
  var username=document.getElementById('username').value;
  var password=document.getElementById('password').value;
  console.log(username);
  console.log(password);
  request.open('POST','http://apsmiglani.imad.hasura-app.io/login' , true);
  reuest.setRequestHeader('Content-type','application/json');
  request.send(JSON.stringify({username: username,password: password}));
};
   
    
