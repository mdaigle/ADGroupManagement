const GraphService = require('graph-service');

module.exports = GraphClient;

function GraphClient(tenant_name, app_id, app_secret) {
    this.api = new GraphService(tenant_name, app_id, app_secret);
}

GraphClient.prototype.createSecurityGroup = function(group_name, callback) {
    var content = {
      "displayName": group_name,
      "mailEnabled": false, //We don't want a mail group
      "mailNickname": "testMail",
      "securityEnabled": true //Need this set to true to create a security group
    }

    this.api.post('/v1.0/groups', content, (err, response) => {
        if (err) {
            console.log(err);
        }
        callback(response);
    });
}

GraphClient.prototype.createSecuritySubgroup = function(parent_group_id, child_group_name) {
    createSecurityGroup(child_group_name, function(group_info) {
        addMemberToGroup(parent_group_id, group_info.id);
    });
}

// Gets an array of group objects
GraphClient.prototype.listGroups = function(callback) {
    this.api.get('/v1.0/groups', (err, response) => {
        if (err) {
            console.log(err);
        }
        //console.log(response.value);
        callback(response.value);
    });
}

GraphClient.prototype.getGroup = function(id) {
    var path = '/v1.0/groups/' + id;
    this.api.get(path, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response);
    });
}

GraphClient.prototype.renameGroup = function(id, name) {
    var path = '/v1.0/groups/' + id;

    var content = {
      "displayName": name
    }

    this.api.patch(path, content, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response);
    });
}

// Not currently supported by the API
GraphClient.prototype.deleteGroup = function(group_id) {
    var path = '/v1.0/groups/' + group_id;
    this.api.delete(path, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response);
    });
}

GraphClient.prototype.addMemberToGroup = function(group_id, user_id) {
    var path = '/v1.0/groups/' + group_id + '/members/$ref';
    var user_uri = "https://graph.microsoft.com/v1.0/directoryObjects/" + user_id;
    var user_ref = {
        "@odata.id": user_uri
    }
    this.api.post(path, user_ref, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response);
    });
}

GraphClient.prototype.removeMemberFromGroup = function(group_id, user_id) {
    var path = '/v1.0/groups/' + group_id + '/members/' + user_id + '/$ref';
    /*var user_uri = "https://graph.microsoft.com/v1.0/directoryObjects/" + user_id;
    var user_ref = {
        "@odata.id": user_uri
    }*/
    this.api.delete(path, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response);
    });
}


GraphClient.prototype.listGroupMembers = function(group_id, callback) {
    var path = '/v1.0/groups/' + group_id + '/members';

    this.api.get(path, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response.value);
        callback(response.value);
    });
}

GraphClient.prototype.getUser = function(user_id) {
    var path = '/v1.0/users/' + user_id;
    this.api.get(path, (err, response) => {
        if (err) {
            console.log(err);
        }

        console.log(response);
    });
}

GraphClient.prototype.listUsers = function() {
    this.api.get('/v1.0/users', (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response);
    });
}

GraphClient.prototype.listUserDirectGroupMembership = function(user_id) {
    var path = '/users/' + user_id + '/memberOf';
    this.api.get(path, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response);
    });
}
