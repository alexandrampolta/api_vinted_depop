const express = require('express');
const fetch= require('node-fetch');
const cron = require('node-cron');

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
app.use(bodyParser.json());
const port = 8080;

//get first impression :
let cookies_vinted;

fetch("https://www.vinted.co.uk/", {
    "body": null,
    "method": "get"
})
.then(response => {
    const setCookieHeader = response.headers.get('Set-Cookie');
    return response.text().then(body => ({
        headers: setCookieHeader,
        body: body
    }));
})
.then(data => {

cookies_vinted =  data.headers.split("_vinted_fr_session=")[1].split(";")[0]
console.log("updated token");

})
.catch(error => {
    console.log(error);
});






cron.schedule('*/5 * * * *', () => {
  // Run task here
  // This function will be called every 5 minutes
 //getting the token and cookies or vinted.co.uk
 fetch('https://ntfy.sh/testers', {
    method: 'POST',
    body: 'Updating the cookies_vinted',
  })

 fetch("https://www.vinted.co.uk/", {
    "body": null,
    "method": "get"
})
.then(response => {
    const setCookieHeader = response.headers.get('Set-Cookie');
    return response.text().then(body => ({
        headers: setCookieHeader,
        body: body
    }));
})
.then(data => {

cookies_vinted =  data.headers.split("_vinted_fr_session=")[1].split(";")[0]
console.log("updated token");

})
.catch(error => {
    console.log(error);
});



});


app.get("/search", urlencodedParser, async (req, res) => {
    platform = req.query.platform || "";
    q = req.query.q || "";
    let count = (req.query.count && !isNaN(req.query.count)) ? Number(req.query.count) : 30;
    let page = (req.query.page && !isNaN(req.query.page)) ? Number(req.query.page) : 0;
    cursor = req.query.cursor || "";

    // platform = req.params.platform || "";
    if(platform=="vinted"){
vintedonly(page,count,q)
    }else if(platform=="depop"){
depoponly(cursor,count,q)
     }else{
        vintpop()
     }

function vintedonly(page,count,q){
    fetch("https://www.vinted.co.uk/api/v2/catalog/items?page="+page+"&per_page="+count+"&search_text="+q, {
        "headers": {
    "cookie":"_vinted_fr_session="+cookies_vinted
        },
        "body": null,
        "method": "GET"
      }) .then(response => response.json()).then(data => {
              res.json(data)
    
         })
          .catch(error => {
            res.json({code:400})
          });
    
};
function depoponly(cursor,count,q){

    fetch("https://webapi.depop.com/api/v2/search/products/?what="+q+"&itemsPerPage="+count+"&country=gb&currency=GBP&cursor="+cursor, {
      
        "body": null,
        "method": "GET"
      }) .then(response => response.json()).then(data => {
              res.json(data)
    
         })
          .catch(error => {
            res.json({code:400})
          });

}

function vintpop(){
//still in work
    res.json({error:"missing platform param"})

}

})



app.get("/product/:platform/:item", function (req, res) {
    platform = req.params.platform
    item = req.params.item
    console.log(item);
if(platform=="vinted"){



    fetch("https://www.vinted.co.uk/api/v2/items/"+item, {
        "headers": {
    "cookie":"_vinted_fr_session="+cookies_vinted
        },
        "body": null,
        "method": "GET"
      }) .then(response => response.json()).then(data => {
        console.log(data);
              res.json(data)
    
         })
          .catch(error => {
            res.json({code:400})
          });
    






}else if(platform=="depop"){

fetch("https://webapi.depop.com/api/v2/product/"+item+"/?lang=en", {
      
"body": null,
"method": "GET"
}) .then(response => response.json()).then(data => {
      res.json(data)

 })
  .catch(error => {
    res.json({code:400})
  });




    
}else{
    res.send({error:"NO_Platform"});

}

});


app.get("/", function (req, res) {

    res.send({code:200});
});

app.get('*', function(req, res){

    res.send({code:404,example:"/search?q=nike&platform=vinted"})
   
   });
   app.post('*', function(req, res){

    res.send({code:404})
   
   });       
   app.on("uncaughtException", function (err) {
    console.log("Node NOT Exiting...");
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
