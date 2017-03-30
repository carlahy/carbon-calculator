const express 	 = require('express');
const bodyParser = require('body-parser');
const app 	     = express();
const spawnSync  = require('child_process').spawnSync;
const exec       = require('child_process').exec;
const fs         = require('fs');
const PythonShell= require('python-shell')
const mongoose   = require('mongoose');
const nconf      = require('nconf');

/////////// Database ///////////


nconf.argv().env().file('keys.json');

const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');

// [START client]
let uri = `mongodb://${user}:${pass}@${host}:${port}`;

if (nconf.get('mongoDatabase')) {
  uri = `${uri}/${nconf.get('mongoDatabase')}`;
}


// var dburl = 'mongodb://localhost/carbondb'
mongoose.connect(uri);

var modelSchema = new mongoose.Schema({
    name: String,
    content: String,
    type: String,
    updated_at: { type: Date, default: Date.now }
});

var orgSchema = new mongoose.Schema({
  name: String,
  models: [modelSchema]
});

var Org = mongoose.model('Organisation', orgSchema);

/////////// Classpath ///////////

var cp = "/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/charsets.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/deploy.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/cldrdata.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/dnsns.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/jaccess.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/jfxrt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/localedata.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/nashorn.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/sunec.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/sunjce_provider.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/sunpkcs11.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/zipfs.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/javaws.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jce.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jfr.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jfxswt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jsse.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/management-agent.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/plugin.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/resources.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/rt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/ant-javafx.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/dt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/javafx-mx.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/jconsole.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/packager.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/sa-jdi.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/tools.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/out/production/RADAR:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/junit-4.11.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreechart-1.0.19-experimental.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/hamcrest-core-1.3.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/orsonpdf-1.6-eval.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreesvg-2.0.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jcommon-1.0.23.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/orsoncharts-1.4-eval-nofx.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreechart-1.0.19.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/servlet.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreechart-1.0.19-swt.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/swtgraphics2d.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/commons-math3-3.6.1.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/antlr-4.5.1-complete.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/commons-lang3-3.4.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/GraphvizVisualiser.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/opencsv-3.1.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jcommander-1.7.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/fxgraphics2d-1.3.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/orsonpdf-1.7.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/junit-4.11.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/hamcrest-core-1.3.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/jfreesvg-3.0.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/orsoncharts-1.5.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/RADAR_GUI.zip:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/SyntheticModels.zip:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/ModelExamples.zip:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/RADAR.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/SyntheticModelGenerator.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/RADAR.zip:/Applications/IntelliJ IDEA 15.app/Contents/lib/idea_rt.jar";

var outputFolder = __dirname + '/radar-output';

app.set('port', (process.env.PORT || 5000))

  .use(bodyParser.json())

  .use(bodyParser.urlencoded({ extended: false }))

  .use(express.static(__dirname + '/public'))

  .get('/', function(req, res) {
    res.sendfile('./public/views/index.html');
  })

  .get('/organisations', function(req,res) {
    Org.findOne({name:req.query.name}, function(err,org){
      if(!org || err) {
        org = new Org({ name: req.query.name });
        org.save(function(err) {
          if (err) return handleError(res,err);
          return res.send({
            id: org._id,
            name: org.name
          });
        });
      } else {
        return res.send({
          id:org._id
        });
      }
    })
  })

  .get('/models', function(req,res){

    Org.findById(req.query.orgId, function(err,org){
      if(!org || err) return res.status(404).send(err);
      console.log('org is ',org);
      var model = org.models.id(req.query.modelId);

      res.send({
        model: model.content,
        type: model.type
      });
    })

    // Model.findById(req.query.id, function(err, model) {
    //   if(err) return res.status(404).send(err);
    //   res.send({
    //     model: model.content,
    //     type: model.type
    //   });
    // });
  })

  .post('/models', function (req, res) {

    Org.findById(req.body.orgId, function(err,org){
      if(!org || err) return res.status(404).send(err);

      var model = {
        content: req.body.content,
        type: req.body.type,
        _id: mongoose.Types.ObjectId()
      };

      org.models.push(model);
      org.save(function(err){
        if (err) return handleError(res,err);
      });
      console.log('pushed model ',model)
      res.send({
        model: model.content,
        type: model.type,
        id: model._id
      });
    })
  })

  .put('/models', function(req,res){
    Org.findById(req.body.orgId, function(err,org){
      if (err) return handleError(res,err);
      // console.log(model);
      var model = org.models.id(req.body.modelId);
      console.log(model);

      model.content = req.body.content;
      model.type = req.body.type;

      org.save( function (err){
        if (err) return handleError(res,err);
        console.log(org);
        res.send({
          id: model._id,
          type: model.type
        });
      });
    });
  })

  .post('/parse', function(req,res){

    var modelName = req.body.modelName.split(' ').join('');
    var fileName = modelName + '.rdr';
    var filePath = __dirname+'/radar-models/'+fileName;

    fs.writeFileSync(filePath, req.body.modelContent);

    var radar = spawnSync('java', ['-classpath', cp, 'radar.userinterface.RADAR_CMD', '--model', filePath, '--output', outputFolder, '--parse','--debug']);

    if(radar.stderr != '') {
      console.log('Parsed not successful',radar.stderr);
      return res.send({
        message: radar.stderr.toString().trim(),
        success: false
      });
    } else {
      console.log('Parsed successfully');
      return res.send({
        message: 'Model was parsed successfully',
        success: true
      });
    }
  })

  .post('/solve', function(req,res){

    // Save model to file
    var modelName = req.body.modelName.split(' ').join('');
    var fileName = modelName + '.rdr';
    var filePath = __dirname+'/radar-models/'+fileName;

    fs.writeFileSync(filePath, req.body.modelContent);

    // Start RADAR child process
    var radar = spawnSync('java', ['-classpath', cp, 'radar.userinterface.RADAR_CMD', '--model', filePath, '--output', outputFolder, '--solve', '--debug']);

    // RADAR unsuccessfully solved model, send error
    if(radar.stderr != '') {
      console.log('Error during solve');
      console.log(radar.stderr);
      return res.send({
        message:radar.stderr.toString().trim(),
        success: false
      });
    }

    // RADAR successfully solved model
    else {
      // Read RADAR csv output
      console.log('Successfully solved model');
      try {
        var resfilepath = outputFolder+'/'+modelName+'/ICSE/AnalysisResult/10000/'+modelName+'.csv';

        var pyoptions = {
            mode: 'json',
            args: [resfilepath]
        }

        // Process RADAR output in python
        PythonShell.run('processing.py', pyoptions, function(err, pyres){
          if(err){
            console.log('Pyshell error >> ',err);
            return res.send({
              message:err.toString().trim(),
              success: false
            });
          } else {
            var graphPath = outputFolder+'/'+modelName+'/ICSE/AnalysisResult/10000/graph/'+modelName;

            return res.send({
              matrix: fs.readFileSync(resfilepath, 'utf8'),
              dgraph: fs.readFileSync(graphPath+'dgraph.dot','utf8'),
              vgraph: fs.readFileSync(graphPath+'vgraph.dot','utf8'),
              decisions: pyres[0],
              // objectives: pyres[1],
              success: true
            });
          }
        });

        console.log('Successfully ran python shell');
        return;

      } catch (err) {
        // Error reading radar output
        console.log('Unsuccessfully ran python shell');
        return res.send({
          message: err,
          success: false
        });
      }
    }

    fs.close();
    return;
  });

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

function handleError(res,err) {
  return res.status(404).send(err);
}
