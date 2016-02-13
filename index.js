var express = require('express');
var https = require('https');
var parseString = require('xml2js').parseString;
var _ = require('lodash');

var app = express();
var port = process.env.PORT || 5000;

app.set('port', port);

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {

  var getBuildStatusByProjects = function (projects) {
    var SUCCESS = 'Success';

    var allSucceded = _.every(projects, function(project) {
      return project.$.lastBuildStatus === SUCCESS;
    });

    if(allSucceded) {
      console.log('### LOG',SUCCESS);
      return SUCCESS;
    }
  };

  https.get('https://snap-ci.com/SteffiPeTaffy/conference-rating/branch/master/cctray.xml', (response) => {
    //console.log('statusCode: ', response.statusCode);
    //console.log('headers: ', response.headers);

    var completeResponse = '';
    response.on('data', function (chunk) {
      completeResponse += chunk;
    });
    response.on('end', function() {
      parseString(completeResponse, function (err, result) {
        getBuildStatusByProjects(result.Projects.Project);
      });
    })

  }).on('error', (e) => {
    console.error(e);
  });

  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



