var bodyParser = require('body-parser');

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var GraphClient = require('./nodegraph');

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.get('/users', function(req, res) {
    res.sendFile(__dirname + '/html/users.html');
})

app.get('/api/users', function(req, res) {
    //console.log("asked to list users");
    var client = createClientFromReq(req);
    client.listUsers(function(users) {
        res.send(users);
        //console.log(users);
    });
});

app.get('/api/groups', function(req, res) {
    var client = createClientFromReq(req);
    client.listGroups(function(groups) {
        res.send(groups);
    });
});

app.get('/api/groups/:id/members', function(req, res) {
    var client = createClientFromReq(req);
    client.listGroupMembers(req.params.id, function(members){
        res.send(members);
    });
});

app.post('/api/groups', function(req, res) {
    var group_name = req.body.name;
    console.log("Creating group with name", group_name);
    var client = createClientFromReq(req);
    client.createSecurityGroup(group_name, function() {
        res.sendStatus(200);
    });
});

app.post('/api/users', function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    console.log("Creating user with email", name);
    var client = createClientFromReq(req);
    client.createUser(name, password, function() {
        res.sendStatus(200);
    });
});

app.delete('/api/users', function(req, res) {
    var id = req.body.id;
    console.log("Deleting user with id", id);
    var client = createClientFromReq(req);
    client.deleteUser(id, function() {
        res.sendStatus(200);
    });
});

function createClientFromReq(req) {
    var tenantId = req.body.credential.tenantId;
    var appId = req.body.credential.appId;
    var key = req.body.credential.key;
    return new GraphClient(tenantId, appId, key);
}

app.listen(3000);
