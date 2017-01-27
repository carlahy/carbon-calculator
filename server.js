var express 	 = require('express');
var bodyParser = require('body-parser');
var app 	     = express();
var spawnSync  = require('child_process').spawnSync;
var fs         = require('fs');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('pages/index', {modelResult: ''});
});

app.post('/parse', function(req,res) {

});

var cp = "/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/charsets.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/deploy.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/cldrdata.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/dnsns.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/jaccess.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/jfxrt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/localedata.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/nashorn.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/sunec.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/sunjce_provider.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/sunpkcs11.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/ext/zipfs.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/javaws.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jce.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jfr.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jfxswt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/jsse.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/management-agent.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/plugin.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/resources.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/jre/lib/rt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/ant-javafx.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/dt.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/javafx-mx.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/jconsole.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/packager.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/sa-jdi.jar:/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home/lib/tools.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/out/production/RADAR:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreechart-1.0.19.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/swtgraphics2d.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreechart-1.0.19-swt.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreechart-1.0.19-experimental.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/junit-4.11.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/hamcrest-core-1.3.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/servlet.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jcommon-1.0.23.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/jfreesvg-2.0.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/orsoncharts-1.4-eval-nofx.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jfreeChart/lib/orsonpdf-1.6-eval.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/orsoncharts-1.5.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/junit-4.11.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/fxgraphics2d-1.3.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/hamcrest-core-1.3.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/jfreesvg-3.0.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/orsonchart/lib/orsonpdf-1.7.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/commons-lang3-3.4.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/antlr-4.5.1-complete.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/jcommander-1.7.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/commons-math3-3.6.1.jar:/Users/carlahyenne/Documents/Year3/project/webapp/RADAR/uk.ac.ucl.cs.lib/opencsv-3.1.jar:/Applications/IntelliJ IDEA 15.app/Contents/lib/idea_rt.jar";
var outputFolder = 'radar-output';

app.post('/solve', function(req,res){
  // Save model to file
  console.log(req.body);
  var modelData = {
    name: req.body.modelName.split(' ').join(''),
    objectives: req.body.modelObjectives,
    parameters: req.body.modelParams,
    equations: req.body.modelEquations,
    decisions: req.body.modelDecisions
  };

  var model = formatModel(modelData);
  var modelName = modelData.name;
  var fileName = modelData.name+'.rdr';

  console.log(model);
  //var model = 'Model '+modelName+';' + modelObjectives + modelParams + modelEquations + modelDecisions;

  var wresult = fs.writeFileSync(fileName, model);

  // Start RADAR child process
  var radar = spawnSync('java', ['-classpath', cp, 'radar.userinterface.RADAR_CMD', '--model', fileName, '--output', outputFolder, '--solve','--debug']);
  console.log('stdout: '+radar.stdout);

  // Display output
  var result = fs.readFileSync('radar-output/'+modelName+'/ICSE/AnalysisResult/'+modelName+'.csv', 'utf8');
  console.log(result);
  // res.render('pages/index', {modelResult: result});
  res.send(result);

});


var formatModel = function (data){
  var modelResult = '';
  var eol = ';\n';
  modelResult += 'Model '+data.name+eol;

  modelResult += '//Objectives\n' + data.objectives;

  modelResult += '//Parameters\n' + data.parameters;

  modelResult += '//Equations\n' + data.equations;

  modelResult += '//Decisions\n' + data.decisions;

  return modelResult;
}


var server = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
