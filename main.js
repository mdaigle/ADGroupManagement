var bodyParser = require('body-parser');

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var GraphClient = require('./nodegraph');
var client = new GraphClient("daiglemalcolmgmail.onmicrosoft.com", "02379a4d-0f04-4f72-9e75-b7b59540ebcd", 'fi1LFEADy9Xfb2g4uZk12fEjbrF11WcQn3m1Y7ejABo=');

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.get('/users', function(req, res) {
    res.sendFile(__dirname + '/html/users.html');
})

app.get('/api/users', function(req, res) {
    //console.log("asked to list users");
    client.listUsers(function(users) {
        res.send(users);
        //console.log(users);
    });
});

app.get('/api/groups', function(req, res) {
    client.listGroups(function(groups) {
        res.send(groups);
    });
});

app.get('/api/groups/:id/members', function(req, res) {
    client.listGroupMembers(req.params.id, function(members){
        res.send(members);
    });
});

app.post('/api/groups', function(req, res) {
    var group_name = req.body.name;
    console.log("Creating group with name", group_name);
    client.createSecurityGroup(group_name, function() {
        res.sendStatus(200);
    });
});

app.post('/api/users', function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    console.log("Creating user with email", name);
    client.createUser(name, password, function() {
        res.sendStatus(200);
    });
});

app.delete('/api/users', function(req, res) {
    var id = req.body.id;
    console.log("Deleting user with id", id);
    client.deleteUser(id, function() {
        res.sendStatus(200);
    });
})

app.listen(3000);
