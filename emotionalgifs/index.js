var fetch = require('node-fetch')
var multipart = require('parse-multipart');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // here's your boundary:
    context.log(req.headers)
    var boundary = multipart.getBoundary(req.headers['content-type']);
    
    // TODO: assign the body variable the correct value
    var body = req.body

    // parse the body
    var parts = multipart.Parse(body, boundary);
//analyze the image
    var result = await analyzeImage(parts[0].data);
    context.res = {
        body: {
            result
        }
    };
    console.log(result)
    context.done(); 
}

async function analyzeImage(img) {
    const subKey = process.env.SUBSCRIPTIONKEY;
    const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';
    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'     //FILL IN THIS LINE
    })

    //COMPLETE THE CODE
    let resp = await fetch(uriBase + '?' + params.toString(), {
        method: 'POST',  //WHAT TYPE OF REQUEST?
        body: img,  //WHAT ARE WE SENDING TO THE API?
      
      	//ADD YOUR TWO HEADERS HERE
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subKey
        }
    })

    let data = await resp.json()
    return data
}