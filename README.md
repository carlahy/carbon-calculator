# carbon-calculator

Below are all the technical details to download and run the carbon-calculator. The Carbon Calculator tool is a web application for sustainable decision making under uncertainty, that provides a simple web user interface for the complex RADAR modelling language and multi-objective decision analysis tool.

For more information about RADAR, you can access the tool and the paper [here](http://www0.cs.ucl.ac.uk/staff/S.Busari/RADAR/).

### Requirements:
* [Node.js](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [RADAR](http://www0.cs.ucl.ac.uk/staff/S.Busari/RADAR/)
* [Python](https://www.python.org/)

### How to run:

1. Download the source code from the github repository
2. Replace the RADAR/ directory with your local version of RADAR
3. You will need to update the RADAR classpath variable located inside the server.js file, at ```var cp = <your classpath>```
4. Open a terminal and navigate to the carbon-calculator/ directory
5. To run a local Mongo datbase, run the command ```mongod --dbpath=data --port 27017```
6. Run the command ```npm install``` to install the node modules necessary.
7. Run the command ```node server.js``` or ```npm start```
8. Open your browser and navigate to http://localhost:5000. Alternatively, change the port in server.js.

