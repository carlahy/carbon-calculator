var Nerd = require('./models/nerd');

module.exports = function(app) {

    // app.get('/api/models', function(req, res) {
    //     // use mongoose to get all nerds in the database
    //     Model.find(function(err, model) {
    //
    //         // if there is an error retrieving, send the error.
    //                         // nothing after res.send(err) will execute
    //         if (err)
    //             res.send(err);
    //
    //         res.json(nerds); // return all nerds in JSON format
    //     });
    // });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
