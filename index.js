var imageDataURI = require('image-data-uri');
var sharp = require('sharp');
var all = require(__dirname + '/resources/contacts.json');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

//console.log(all);
var convert = async(function(all) {
  //console.log(all);

  all.data.forEach(function(item, idx) {
    var json = JSON.parse(item.attributes.json);
    var logoGraphic = json.logoGraphic;

    if(logoGraphic && logoGraphic.length) {

      var dataUri = logoGraphic[0].fileUri[0].uri;
      var image = dataUri.match('data:') ? imageDataURI.decode(
          dataUri) :
        null;
      //dataUri.match('http:') ? imageDataURI.decode(imageDataURI.encodeFromURL(dataUri)) : null;
      if(image) {
        var rs = sharp(image.dataBuffer)
          .resize(75);
        await (
          rs.toBuffer()
          .then(data => {
            var newURI = imageDataURI.encode(data, image.imageType);
            // console.log(logoGraphic);
            //
            // console.log(data);
            // console.log(newURI);

            json.logoGraphic[0].fileUri[0].uri = newURI;
            all.data[idx].attributes.json = JSON.stringify(json);
            //console.log(item.attributes.json);
          })
          .catch(err => {
            console.log(logoGraphic);

            console.log(err);
          })
        );
      }
    }
  });

});

convert(all)
  .then(() => {
    console.log(JSON.stringify(all));
  })
  .catch(function(err) {
    console.log('Something went wrong: ' + err);
  });
