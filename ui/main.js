
var button=document.getElementById('counter');
var counter=0;
button.onclick=function()
{
  var request=new XMLHttpRequest();
  request.onreadystatechange=function()
  {
    if(request.readyState===XMLHttpRequest.DONE)
    {
        if(request.status===200)
        {
            var counter=request.responseText;
            var span=documen.getElementById('count');
            span.innerHtml=counter.toString();
        }
    }
  };
  request.open('Get','http://apsmiglani.imad.hasura-app.io/counter',true);
  request.send(null);
};