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
    "cookie":"_vinted_fr_session=dTEzZ0ZObGpacGtZS3VQNkV5SzFsMnVhV3ZDR2h6OGUzcXdTL25Bb1ZRM0dON3NYZndKKzlqYWE5cTdKMVBSSnVFbmdFMmtmMTV1N2lFa3Bsdm1yZmRwSVBSd2puRnFraE9kTnROQ1REeHIxQ1pObnV6Q1J3SkI1U3h4SU1IS2NWTVFBL2dOS2w3SzJ5THpycStadk5ycStaUEFudjdIQ3ZOQ1JucnpkTThqTnRscitlaStrb3c0MnpITjRRdGpacCtoS2VNMCtPM2ZRMncydmU0dDNhSjVJeWlpcjgxbDBVYnRaY1RKL0ZheENBMFdGL0gvaVVHQWNzL05meGJCemNOTFlzcW9EWTBrVmxXV2JXblVIUW5HRitJK3RJV0VXVVlzVGdyeXhBdHJJVVl1YTNlOEJObXFpclc2TS8zd0hzMEhVUjJhaksydFkxSVhoTlJpdmdncStWSitUSHZtMHozMTFha2UwODhjQWNCdjFxUlJVei9KWDNjejZ6bzNIcjcyaWhoK0Z5UTltanBPdFVGS2lSVjh3TFZBWTBCa0lJVThUZzluQjVIeUMyUFdVL2Q3aWFHVGhTQjJUZWRYRThldzU2RXdMdzBUNzZzVXVpNFc1R01rU0lTM3RseXo0QUw0SXUyVVl0OUpPazlhdE5tazI1b05qNXpCMVZhYXRZOUw3dFdySkpQazQzVk9KZGkyMkNlNCtMZ1oxMkFObTVUVE81OXlsNEFjSzdLN0ViS2tlNUttNjhTTDhkOGF5cC9QaTJnZHNxVGJEOWIyS3NWZjJzakpCbWU5cEk5ZGxVQktXZm5reGplcSs2QzBrYkIvMHQyYUdacW1SeEt1Y1pZYTNLcXpaVlVLVlNIZ2YvVHcvNDVSdG1FRVpPSUVodU5COUtWZEltTEhJMy8wWER5bVhIY2xVeWtJN1hXb3lUTVhuUUNoZmxqZUlsQmdDOGhjSDdJY2w4RFJmakVPVVozWjlib29FWmdVcG5ybEZ3MHcrQ210aUpGeXJpR2NjVzRVbVNrYklkOVF4ZWVFS1Qwc3E1WllPakZKRnpoMDlSb2ltVEMrc1NXdGpSTzlOaWhRV1JrNlJaa0taSTBIOG53WGNRSzk1SXM5SVJtTlV0SjR4T1RneFRzVkFYTnRTcFlvc09vL1IvNEhUdUNCN0FHSWhpWHNZc2MzTTRrS0F0UUxDeENUejdseWJZNEFyTGQvWFZIM1BncCtVM3REeHJ1aFRZMFJ5aXVmS0ppb0drQk1KellYM2VvZVhJQ3hOcjVxaUxCd2lJUkcwdGowcTg2bUJVMFhjQUphV01KUDdSa3R5eFk0Qm55cnh3VXdYMEttTVRlUzRFelNHREZzOHJGUXNEcjZIMnp1eGt2ZTNKaVJ4aEhDSTFpait2SVNVb2VMWVdva2Frd0l0MC9IMDc5eHAzQzdYWW9CaUgrNnVsbG1tUXRFbW9qYkJta2VQeGZsditBPT0tLXdURWtaT1IzTWtmYTlVZGU4S3JFT0E9PQ%3D%3D--83aa6fe5936f94d7c37577bb9f533792f828ebe5"
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
    "cookie":"_vinted_fr_session=dTEzZ0ZObGpacGtZS3VQNkV5SzFsMnVhV3ZDR2h6OGUzcXdTL25Bb1ZRM0dON3NYZndKKzlqYWE5cTdKMVBSSnVFbmdFMmtmMTV1N2lFa3Bsdm1yZmRwSVBSd2puRnFraE9kTnROQ1REeHIxQ1pObnV6Q1J3SkI1U3h4SU1IS2NWTVFBL2dOS2w3SzJ5THpycStadk5ycStaUEFudjdIQ3ZOQ1JucnpkTThqTnRscitlaStrb3c0MnpITjRRdGpacCtoS2VNMCtPM2ZRMncydmU0dDNhSjVJeWlpcjgxbDBVYnRaY1RKL0ZheENBMFdGL0gvaVVHQWNzL05meGJCemNOTFlzcW9EWTBrVmxXV2JXblVIUW5HRitJK3RJV0VXVVlzVGdyeXhBdHJJVVl1YTNlOEJObXFpclc2TS8zd0hzMEhVUjJhaksydFkxSVhoTlJpdmdncStWSitUSHZtMHozMTFha2UwODhjQWNCdjFxUlJVei9KWDNjejZ6bzNIcjcyaWhoK0Z5UTltanBPdFVGS2lSVjh3TFZBWTBCa0lJVThUZzluQjVIeUMyUFdVL2Q3aWFHVGhTQjJUZWRYRThldzU2RXdMdzBUNzZzVXVpNFc1R01rU0lTM3RseXo0QUw0SXUyVVl0OUpPazlhdE5tazI1b05qNXpCMVZhYXRZOUw3dFdySkpQazQzVk9KZGkyMkNlNCtMZ1oxMkFObTVUVE81OXlsNEFjSzdLN0ViS2tlNUttNjhTTDhkOGF5cC9QaTJnZHNxVGJEOWIyS3NWZjJzakpCbWU5cEk5ZGxVQktXZm5reGplcSs2QzBrYkIvMHQyYUdacW1SeEt1Y1pZYTNLcXpaVlVLVlNIZ2YvVHcvNDVSdG1FRVpPSUVodU5COUtWZEltTEhJMy8wWER5bVhIY2xVeWtJN1hXb3lUTVhuUUNoZmxqZUlsQmdDOGhjSDdJY2w4RFJmakVPVVozWjlib29FWmdVcG5ybEZ3MHcrQ210aUpGeXJpR2NjVzRVbVNrYklkOVF4ZWVFS1Qwc3E1WllPakZKRnpoMDlSb2ltVEMrc1NXdGpSTzlOaWhRV1JrNlJaa0taSTBIOG53WGNRSzk1SXM5SVJtTlV0SjR4T1RneFRzVkFYTnRTcFlvc09vL1IvNEhUdUNCN0FHSWhpWHNZc2MzTTRrS0F0UUxDeENUejdseWJZNEFyTGQvWFZIM1BncCtVM3REeHJ1aFRZMFJ5aXVmS0ppb0drQk1KellYM2VvZVhJQ3hOcjVxaUxCd2lJUkcwdGowcTg2bUJVMFhjQUphV01KUDdSa3R5eFk0Qm55cnh3VXdYMEttTVRlUzRFelNHREZzOHJGUXNEcjZIMnp1eGt2ZTNKaVJ4aEhDSTFpait2SVNVb2VMWVdva2Frd0l0MC9IMDc5eHAzQzdYWW9CaUgrNnVsbG1tUXRFbW9qYkJta2VQeGZsditBPT0tLXdURWtaT1IzTWtmYTlVZGU4S3JFT0E9PQ%3D%3D--83aa6fe5936f94d7c37577bb9f533792f828ebe5"
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
