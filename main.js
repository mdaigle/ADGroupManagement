var bodyParser = require('body-parser');

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var GraphClient = require('./nodegraph');
var client = new GraphClient(/*app info here*/);

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.get('/api/users', function(req, res) {
    var users = client.listUsers();
    res.json(users);
});

app.get('/api/groups', function(req, res) {
    client.listGroups(function(groups) {
        res.send(groups);
    });
});

app.get('/api/groups/:id/members', function(req, res) {
    //console.log("Got request for group", req.params.id);
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

app.listen(3000);
