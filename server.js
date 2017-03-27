const express 	 = require('express');
const bodyParser = require('body-parser');
const app 	     = express();
const spawnSync  = require('child_process').spawnSync;
const exec       = require('child_process').exec;
const fs         = require('fs');
const PythonShell= require('python-shell')
const assert     = require('assert');
const mongoose   = require('mongoose');

/////////// Database ///////////

// Connect to MongoDB and create/use database called CarbonDB
mongoose.connect('mongodb://localhost/carbondb');
// Create a schema
var Schema = new mongoose.Schema({
  id: String,
  body: JSON
  // updated_at: { type: Date, default: Date.now },
});

var Model = mongoose.model('Model', Schema);

/////////// Classpath ///////////

var cp = "/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/charsets.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/deploy.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/cldrdata.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/dnsns.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/jaccess.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/jfxrt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/localedata.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/nashorn.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/sunec.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/sunjce_provider.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/sunpkcs11.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/zipfs.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/javaws.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jce.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jfr.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jfxswt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jsse.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/management-agent.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/plugin.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/resources.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/rt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/ant-javafx.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/dt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/javafx-mx.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/jconsole.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/packager.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/sa-jdi.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/tools.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/out/production/RADAR:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/junit-4.11.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreechart-1.0.19-experimental.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/hamcrest-core-1.3.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/orsonpdf-1.6-eval.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreesvg-2.0.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jcommon-1.0.23.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/orsoncharts-1.4-eval-nofx.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreechart-1.0.19.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/servlet.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreechart-1.0.19-swt.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/swtgraphics2d.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/commons-math3-3.6.1.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/antlr-4.5.1-complete.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/commons-lang3-3.4.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/GraphvizVisualiser.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/opencsv-3.1.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/jcommander-1.7.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/fxgraphics2d-1.3.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/orsonpdf-1.7.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/junit-4.11.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/hamcrest-core-1.3.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/jfreesvg-3.0.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/orsoncharts-1.5.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/RADAR_GUI.zip:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/SyntheticModels.zip:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/ModelExamples.zip:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/RADAR.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/SyntheticModelGenerator.jar:/Users/carlahyenne/Documents/Year3/project/carbon-calculator/RADAR/uk.ac.ucl.cs.docs/RADAR.zip:/Applications/IntelliJ IDEA 15.app/Contents/lib/idea_rt.jar";
var outputFolder = __dirname + '/radar-output';

app.set('port', (process.env.PORT || 5000))
  .set('view engine', 'ejs')
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(express.static(__dirname + '/public'))

  .get('/', function(req, res) {
    res.render('index');
  })

  .post('/models', function (req, res) {
    var result = {};
    var model = new Model( {body:req.body.model} );
    model.id = model._id;
    result.id = model.id;
    model.save(function (err) {
      if(err) return res.status(404).send(err);
      result.model = model;
      res.send(result)
    });
  })

  .get('/models', function(req,res){
    Model.findById(req.query.id, function(err, model) {
      if(err) return res.status(404).send(err);
      res.send(model.body);
    });
  })

  .put('/models', function(req,res){
    Model.findById(req.body.id, function(err, model) {
      if(err) return res.status(404).send(err);
      model.body = req.body.model;
      model.save( function ( err, model ){
        if(err) {
          res.send(err);
          return;
        }
        res.send(model.id);
      });
    });
  })

  .post('/submit', function(req,res){
    var modelData = req.body;
    var model = modelData.modelBody;
    var result = {};

    // Save model to file
    var modelName = modelData.modelName.split(' ').join('');
    var fileName = modelName + '.rdr';
    var filePath = __dirname+'/radar-models/'+fileName;

    fs.writeFileSync(filePath, model);

    // Always parse model
    var radar = spawnSync('java', ['-classpath', cp, 'radar.userinterface.RADAR_CMD', '--model', filePath, '--output', outputFolder, '--parse','--debug']);

    if(radar.stderr != '') {
      result.body = radar.stderr.toString().trim();
      result.type = 'error';
      console.log('Error during parse ', result.body);
      res.send(result);
      return;
    } else {
      result.body = 'Model was parsed successfully';
      result.type = 'success';
      console.log('Parsed successfully');
      if(modelData.command == 'parse') {
        res.send(result);
        return;
      }
    }

    // If command is solve
    if (modelData.command == 'solve'){
      // Start RADAR child process
      var radar = spawnSync('java', ['-classpath', cp, 'radar.userinterface.RADAR_CMD', '--model', filePath, '--output', outputFolder, '--solve', '--debug']);

      // RADAR unsuccessfully solved model, send error
      if(radar.stderr != '') {
        console.log('Error during solve');
        result.body = radar.stderr.toString().trim();
        result.type = 'error';
        res.send(result);
        return;
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
              result.body = err.toString().trim();
              result.type = 'error';
              console.log('Pyshell error >> ',err);
              res.send(result);
            } else {
              result.body = fs.readFileSync(resfilepath, 'utf8');
              result.decisions = pyres[0];
              result.objectives = pyres[1];
              result.type = 'csvresult';
              res.send(result);
            }
            return;
          });

          console.log('Successfully ran python shell');
          return;

        } catch (err) {
          // Error reading radar output
          console.log('Unsuccessfully ran python shell');
          result.body = err;
          result.type = 'error';
          res.send(result);
          return;
        }
      }
    }
    res.send(result);
    return;
  });

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
