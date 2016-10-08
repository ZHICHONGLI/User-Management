// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');

// 2nd part -- connect database and add data table
var User = require('./app/models/user');

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@jello.modulusmongo.net:27017/ve4Resow'); // connect to our database
// 2nd part

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/angularjs')));
//app.use(multer({ dest: './angularjs/images/' }).single('photoFile')); //This will tell multer to store any uploaded files in the images subdirectory

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// 2nd part -- add actual routing

var storage = multer.diskStorage({
    destination: function(request, file, callback) {
        callback(null, './angularjs/images');
    },
    filename: function(request, file, callback) {
        console.log(file);
        console.log("form value" + request.body.photoName);
        callback(null, request.body.photoName)
    }
});


var uploadFile = multer({ storage: storage }).single('photoFile');
// multer storge
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
// 2nd part

// 3rd part - insert a bear POST
// on routes that end in /bears
// ----------------------------------------------------
router.route('/users')

// create a user (accessed at POST http://localhost:8080/api/users)
.post(function(req, res) {

        var user = new User(); // create a new instance of the Bear model
        user.Name = req.body.Name; // set the users name (comes from the request)
        user.Age = req.body.Age;
        user.Title = req.body.Title;
        user.Sex = req.body.Sex;
        user.id = req.body.id;
        user.cPhone = req.body.cPhone;
        user.email = req.body.email;
        user.mgrName = req.body.mgrName;
        user.mgrId = req.body.mgrId;
        user.drNum = 0;
        var updatemgrId = req.body.mgrId; // set manager id which needs be updated 


        if (updatemgrId != '') {
            User.findOne({ 'id': updatemgrId }, function(err, manager) {
                if (err)
                    res.send(err);
                console.log("line90: find mgr id need be add 1 is :" + updatemgrId);
                manager.drNum += 1;
                // save the user
                manager.save(function(err) {
                    console.log('94: save manager');
                    if (err)
                        res.send(err);
                    //save new who has manager
                    user.save(function(err) {
                        if (err)
                            res.send(err);

                        res.json({ message: 'User created!' });
                    });
                    //
                });
            });
        } else {
            console.log('no manager and save new');
            // save the user and check for errors
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User created!' });
            });
        };



    })
    //;
    // 3rd part

// 4th part -- get the bear list
// get all the users (accessed at GET http://localhost:8080/api/users)
.get(function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
});
// 4th part

// 5th part - access an individual user
// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

// get the bear with that id (accessed at GET http://localhost:8080/api/users/:user_id)
.get(function(req, res) {
        var idx = req.params.user_id;
        var dirnumofuser;
        /*      
        User.find({ 'mgrId': idx }).count({}, function(err, countnum) {
            console.log(countnum);
            dirnumofuser = countnum;
        });
        User.findOne({ 'id': idx }, function(err, user) {
            if (err)
                res.send(err);
            user.drNum = dirnumofuser;
            console.log('user.drNum is ' + user.drNum);
            user.save(function(err) {
                if (err)
                    res.send(err);
                //res.json({ message: 'User updated!' });
                res.send(user);
            });
        });
*/
        User.findOne({ 'id': idx }, function(err, user) {
            if (err)
                res.send(err);
            User.find({ 'mgrId': idx }).count({}, function(err, countnum) {
                console.log('line 167: getting dp count num:' + countnum);
                dirnumofuser = countnum;
                user.drNum = dirnumofuser;
                console.log('line 170: user.drNum is ' + user.drNum);
                user.save(function(err) {
                    if (err)
                        res.send(err);
                    //res.json({ message: 'User updated!' });
                    res.send(user);
                });
            });
        });
        /*
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
		*/
    })
    //;
    // 5th part

// 6th part -- update
// update the bear with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
.put(function(req, res) {

        // use our bear model to find the bear we want
        //Bear.findById(req.params.user_id, function(err, bear) {
        var idx = req.params.user_id;
        var premgrid;
        User.findOne({ 'id': idx }, function(err, user) {
            if (err)
                res.send(err);
            premgrid = user.mgrId;
            //bear.name = req.body.name;  // update the bears info
            user.Name = req.body.Name; // set the users name (comes from the request)
            user.Age = req.body.Age;
            user.Title = req.body.Title;
            user.Sex = req.body.Sex;
            user.cPhone = req.body.cPhone;
            user.email = req.body.email;
            user.mgrName = req.body.mgrName;
            user.mgrId = req.body.mgrId;
            //user.drNum = req.body.drNum;
            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User updated!' });
            });
        });
    })
    //;
    // 6th part

// 7th part - delete
// delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
.delete(function(req, res) {
    var idx = req.params.user_id;
    // do dr prople, clear manager infos for them
    User.find({ 'mgrId': idx }, function(err, res) {
        console.log('line229 this is dp array:' + res);
        if (res.length != 0) // only operate for people has dr 
            for (i = 0; i < res.length; i++) {
            User.findOne({ 'id': res[i].id }, function(err, user) {
                if (err)
                    res.send(err);
                //console.log("this is user" + user);
                console.log("line 236: DOING THIS EMPLOEE" + user);
                user.mgrId = '';
                user.mgrName = '';
                user.save(function(err) {
                    if (err)
                        res.send(err);
                });
            });
        };
        if (res.length == 0)
            console.log('line246: dr array empty');
    });

    // do manager reduce drNum by 1 for manager
    User.findOne({ 'id': idx }, function(err, user) {
        if (err)
            res.send(err);
        // update this person's manager's drNum if this person's mgrId id not null
        if (user.mgrId != null) {
            User.findOne({ 'id': user.mgrId }, function(err, user) {
                if (err)
                    res.send(err);
                console.log("line 258: find mgr need be updated is :" + user.id);
                user.drNum -= 1;
                console.log('line 260: managers drnum updated ');
                // save the user
                user.save(function(err) {
                    if (err)
                        res.send(err);
                    ////
                    ////
                    console.log('line 267: mgrid of deleted peoson' + user.mgrId);
                    // remove after this person's user info got 
                    User.remove({
                        id: req.params.user_id
                    }, function(err, user) {
                        if (err)
                            res.send(err);

                        User.find(function(err, users) {
                            if (err)
                                res.send(err);
                            console.log('line 278: doing delete now');
                            res.json(users);
                        });
                        //    res.json(users);
                    });
                    ////
                });
            });

        } else {
            console.log('line 276: no manager remove user only');
            // remove after this person's user info got 
            User.remove({
                id: req.params.user_id
            }, function(err, user) {
                if (err)
                    res.send(err);

                User.find(function(err, users) {
                    if (err)
                        res.send(err);
                    console.log('line 287: doing delete now');
                    res.json(users);
                });
                //    res.json(users);
            });
        };


    });

    /////////////////  put this into above code to prevent asy happening
    /*
        User.remove({
            id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            User.find(function(err, users) {
                if (err)
                    res.send(err);

                res.json(users);
            });
            //    res.json(users);
        });   */
});
// 7th part 

app.get('/', function(resuest, response) {
    response.sendFile('index.html');
});

app.post('/uploadPhoto', function(req, res) {
    var str = '<!DOCTYPE html><html><button onclick="goBack()">Go Back</button><br><br>';
    var str2 = '<script>function goBack() {window.history.back(); }</script></html>';
    uploadFile(req, res, function(err) {
        console.log(req.body.photoName);
        console.log('upload testing');
        console.log(req.file);
        if (err) {
            console.log(err);
        } else {}
        res.send(str + req.file.path + str2);
    })
});

// multer post 

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);