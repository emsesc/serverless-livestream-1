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
    
    let emotions = result[0].faceAttributes.emotion;

    let objects = Object.values(emotions);
// FILL IT IN
// What your array could look like: [0.01, 0.34, .....]
    const main_emotion = Object.keys(emotions).find(key => emotions[key] === Math.max(...objects));

    context.res = {
        body: {
            main_emotion
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