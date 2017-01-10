$(document).ready(function() {
    $("button[name='submit']").on('click', function() {
        var group_name = $("input[name='group-name']").val();
        //alert(group_name);
        var data = {"name": group_name};
        $.post("http://localhost:3000/api/groups", data, function() {
            location.reload();
        });
    });

    $.get("http://localhost:3000/api/groups", function(groups) {
        groups.forEach(function(group) {

            // Create a div for the group
            var group_div = $('<div></div>').attr('id', group.id);
            group_div.append("<h2>" + group.displayName + "</h2>");

            // Create a list of the members
            var member_list = $('<ul></ul>');
            $.get("http://localhost:3000/api/groups/" + group.id + "/members", function(members) {
                members.forEach(function(user) {
                    if (user['@odata.type'] == "#microsoft.graph.group") {
                        member_list.append("<p>" + user.displayName + " [G]</p>");
                    } else {
                        member_list.append("<p>" + user.displayName + "</p>");
                    }
                });

                // Append the member list to the group div
                group_div.append(member_list);

                // Add the group div to the DOM
                $('#groups').append(group_div);
            });
        });
    });
});
