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
    "cookie":"_vinted_fr_session=WUorNG1UaEZGZW96U0pBd0ZQOTVFZnNiSS9hdUZQMmNqcm52SFpGaXFUODlXVVV4N0FuNlB3V2lialF2SVlaNUhIUG5Tbmk2aGdRWG1CVzB2S0pzQ3BVTzJrbWhadGZvMkp1Qmp3WGtFdnZCM2hGdXh2U0tKdHp6aE9QQndMeTl3bWRMTExLL1E1c1JMRXNHL1kxaUduWWZ0NVIvTDMzOTFCQnZjVHRqWTRvVlorN29nc3JkZkFaVXR0eWRsbEVRRTVKSVFMQnJtNkQ0eUNxdzVqUVMxRGpEQjBSN2tjT0tVNStYUnBvTkkxSG9kbWtGak9CeXdtQ0VqZWpYV0ZiVnErM1RtcEF6YytOcEZiOElYeXN1WEUrbHBITVhYWkhxZ3N5Z1JjZk1lYm9adXNMZFl5RlNXUngra3pmaXEwYytUVlRsMHFZNTdqVEVFVnVXc3pIVjJjeGpwTWo2WXNyR2RJcm1HV0pUK1Z5UFlWM01YS0NiY2Q4anpvMnUzSFhua0NObno4RjUyYlQrbEZmeWhPOUdwaEVlV1BOMUt6SWd5NFNZSzEzUzRZdUNBODY5S2xpdy9zT3FwQ0h5ZFFyVC9mL3N2RHpLK3lVWGpJRUJlbEJJMWg1SnNHZjQwOWtBZVNyRXVLL2tmVGkxZXlDSU0vN2RvSUxoK0ZDckwrMG9HcG5FeXlVOVVpaHgrU2lRaEFhdHNWWW9aSkZGZEtUZkw3eExGaHY5NlFwbzhDcmhkQy9qbzg2VzZ1eTRVMXQ5Ry9vK21yRTUveUdST21BbWs1eDkxc2c4eWQ2SnZSMEhFblp1cTExdUw1UWY4Y2R2Q1g3bTVQTjd3MmpIRzBRWS8xeTFzaTgrWVdKelR5NEUySVl3d2ZiTFVrMmxNTUpUelhiSEx1NnlmV29NcENEWnc5bWt2M24zQ1k5VFlOajNGS1RRd1pVQVlmV1Z2aTk0ZmNjaE4yOGFxODRKdkJuQmRXUnNVQ0pCTGhhdlA4anQwUk5FUTNPeEJ1RTZwVXFoR09JeTVOQ09LbGEyMXZtUFpoMEtFZ2tKblM0QWVibFJPcVZwUTEzbE82Rnh4cDdHN2p1NnRnM0x1VGQ1clNlbFREaVZtSkpUemc5bjFaZmpZY3hIQVlJWDZiYktRTWZJOExtY1ExTzF0a24wN2NrYlFDT1dFREtGQUhNeEZ1c05kMXplbUVCT3VHQWt1L250anVSYUdMWnN4NVR1OVNDeE5wVE5aK0RNMUFNMllOUEozSGxOOS9UZUhiTkR3cjV0TmxGMGhqWi9yQUhiUnFheXlWU3V2SWNDZkxpZCtiRjFuTGN3LytsS3IwYlhwT2lOclpER0grNXBvdE5XSEFya0F3SngrWEo4enZwWFBORUd6MDJYZ0xEdk5tQ3pmMUFtMXRzWUwvUHYvT0w0SVNHN3RUdUR0VTJ0UVYxdlNQc0s1RFhzTER0MFB3UTdrWHJOdW45bnpRPT0tLUV1Q1RNQkVOT3M4Mlo1MGpwaTNwalE9PQ%3D%3D--5b66c8fa2cab3d3d020d1c486494cd3381edf308"
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
    "cookie":"_vinted_fr_session=WUorNG1UaEZGZW96U0pBd0ZQOTVFZnNiSS9hdUZQMmNqcm52SFpGaXFUODlXVVV4N0FuNlB3V2lialF2SVlaNUhIUG5Tbmk2aGdRWG1CVzB2S0pzQ3BVTzJrbWhadGZvMkp1Qmp3WGtFdnZCM2hGdXh2U0tKdHp6aE9QQndMeTl3bWRMTExLL1E1c1JMRXNHL1kxaUduWWZ0NVIvTDMzOTFCQnZjVHRqWTRvVlorN29nc3JkZkFaVXR0eWRsbEVRRTVKSVFMQnJtNkQ0eUNxdzVqUVMxRGpEQjBSN2tjT0tVNStYUnBvTkkxSG9kbWtGak9CeXdtQ0VqZWpYV0ZiVnErM1RtcEF6YytOcEZiOElYeXN1WEUrbHBITVhYWkhxZ3N5Z1JjZk1lYm9adXNMZFl5RlNXUngra3pmaXEwYytUVlRsMHFZNTdqVEVFVnVXc3pIVjJjeGpwTWo2WXNyR2RJcm1HV0pUK1Z5UFlWM01YS0NiY2Q4anpvMnUzSFhua0NObno4RjUyYlQrbEZmeWhPOUdwaEVlV1BOMUt6SWd5NFNZSzEzUzRZdUNBODY5S2xpdy9zT3FwQ0h5ZFFyVC9mL3N2RHpLK3lVWGpJRUJlbEJJMWg1SnNHZjQwOWtBZVNyRXVLL2tmVGkxZXlDSU0vN2RvSUxoK0ZDckwrMG9HcG5FeXlVOVVpaHgrU2lRaEFhdHNWWW9aSkZGZEtUZkw3eExGaHY5NlFwbzhDcmhkQy9qbzg2VzZ1eTRVMXQ5Ry9vK21yRTUveUdST21BbWs1eDkxc2c4eWQ2SnZSMEhFblp1cTExdUw1UWY4Y2R2Q1g3bTVQTjd3MmpIRzBRWS8xeTFzaTgrWVdKelR5NEUySVl3d2ZiTFVrMmxNTUpUelhiSEx1NnlmV29NcENEWnc5bWt2M24zQ1k5VFlOajNGS1RRd1pVQVlmV1Z2aTk0ZmNjaE4yOGFxODRKdkJuQmRXUnNVQ0pCTGhhdlA4anQwUk5FUTNPeEJ1RTZwVXFoR09JeTVOQ09LbGEyMXZtUFpoMEtFZ2tKblM0QWVibFJPcVZwUTEzbE82Rnh4cDdHN2p1NnRnM0x1VGQ1clNlbFREaVZtSkpUemc5bjFaZmpZY3hIQVlJWDZiYktRTWZJOExtY1ExTzF0a24wN2NrYlFDT1dFREtGQUhNeEZ1c05kMXplbUVCT3VHQWt1L250anVSYUdMWnN4NVR1OVNDeE5wVE5aK0RNMUFNMllOUEozSGxOOS9UZUhiTkR3cjV0TmxGMGhqWi9yQUhiUnFheXlWU3V2SWNDZkxpZCtiRjFuTGN3LytsS3IwYlhwT2lOclpER0grNXBvdE5XSEFya0F3SngrWEo4enZwWFBORUd6MDJYZ0xEdk5tQ3pmMUFtMXRzWUwvUHYvT0w0SVNHN3RUdUR0VTJ0UVYxdlNQc0s1RFhzTER0MFB3UTdrWHJOdW45bnpRPT0tLUV1Q1RNQkVOT3M4Mlo1MGpwaTNwalE9PQ%3D%3D--5b66c8fa2cab3d3d020d1c486494cd3381edf308"
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
