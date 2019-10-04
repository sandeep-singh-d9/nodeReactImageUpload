const AWS = require('aws-sdk');

const Busboy = require('busboy');

const BUCKET_NAME = 'formio-upload-aws';
const IAM_USER_KEY = 'AKIAVPK44AY4ZI4EVKNR';
const IAM_USER_SECRET = '7yAFFOLSmJ6fNCKAzmwbbL6ZEdL/8WQJNR1nZuAK';

function uploadToS3(file) {
    console.log('here')
  
}

module.exports = (app) => {
  // The following is an example of making file upload with additional body
  // parameters.
  // To make a call with PostMan
  // Don't put any headers (content-type)
  // Under body:
  // check form-data
  // Put the body with "element1": "test", "element2": image file

  app.post('/api/upload', function (req, res, next) {
    // console.log(req.files.file, 'asas')
    // return false
    // This grabs the additional parameters so in this case passing in
    // "element1" with a value.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); 
    const element1 = req.body.element1;

    var busboy = new Busboy({ headers: req.headers });

    // The file upload has completed
    busboy.on('finish', function() {
      console.log('Upload finished');
      
      // Your files are stored in req.files. In this case,
      // you only have one and it's req.files.element2:
      // This returns:
      // {
      //    element2: {
      //      data: ...contents of the file...,
      //      name: 'Example.jpg',
      //      encoding: '7bit',
      //      mimetype: 'image/png',
      //      truncated: false,
      //      size: 959480
      //    }
      // }
      
      // Grabs your file object from the request.
      const file = req.files.file;
    //  const file = req.file.path
      console.log(file);
      console.log('tet')
      // Begins the upload to the AWS S3
      // uploadToS3(file);

      let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
      });
      s3bucket.createBucket(function () {
          var params = {
            Bucket: BUCKET_NAME,
            Key: file.name,
            Body: file.data
          };
          s3bucket.upload(params, function (err, data) {
            if (err) {
              console.log('error in callback');
              console.log(err);
            }
            console.log('success');
            console.log(data);
            response={
              location:data.location
            }
            console.log(response)
            res.json(response);
          });
      });
    });

    req.pipe(busboy);
  });
}