$(document).ready(function() {
    $("button[name='submit']").on('click', function() {
        var name = $("input[name='user-name']").val();
        var password = $("input[name='user-password']").val();

        var data = {
            "name": name,
            "password": password
        };

        $.post("http://localhost:3000/api/users", data, function() {
            location.reload();
        });
    });

    $("#users").on('click', ".delete", function() {
        alert("Something happened");
        var user_id = $(this).parent().attr('id');

        var data = { "id": user_id };

        $.ajax({
            url: "http://localhost:3000/api/users",
            type: 'DELETE',
            data: data,
            success: function(response) {
                alert(response);
            }
        });
    });

    $.get("http://localhost:3000/api/users", function(users) {
        users.forEach(function(user) {
            var user_div = $('<div></div>').attr('id', user.id);
            user_div.append("<h3>" + user.displayName + "</h3>");
            user_div.append("<button type='button' class='delete'>Delete User</button>");
            $('#users').append(user_div);
        });
    });
});
