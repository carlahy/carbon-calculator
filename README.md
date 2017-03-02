# carbon-calculator

This should include all the technical details that would enable a student to continue your project next year, 
and be able to amend or extend your code. For example, Where is the code?, What do you do to compile and install it?	

The Carbon Calculator tool is a web application for sustainable decision making under uncertainty.
It implements the RADAR modelling language and decision analysis tool.

### Requirements:
* [Node.js](https://nodejs.org/en/)
* [RADAR](http://www0.cs.ucl.ac.uk/staff/S.Busari/RADAR/)

### How to run:

1. Replace the RADAR/ directory with your download of RADAR
2. You will need to update the RADAR classpath variable located inside the server.js file (```var cp = <your classpath>```) to your own
3. From your command line, run ```node server.js ```
4. Open your browser and navigate to http://localhost:5000. You can change the port in the server.js file

### Front-end:

The front-end is written in [AngularJs](https://angularjs.org/).

### Back-end:

The back-end is in Node.js with an [Express](http://expressjs.com/) server 

### RADAR:

You can download RADAR [here](http://www0.cs.ucl.ac.uk/staff/S.Busari/RADAR/)
