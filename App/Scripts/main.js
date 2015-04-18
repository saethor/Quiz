(function() {
    'use strict';

    $('#username').keyup(function() {
        if ($(this).val().length === 0) {
            $('#start-quiz').attr('disabled', 'disabled');
        } else {
            $('#start-quiz').removeAttr('disabled');
        }
    });

    $('#start-quiz').click(function(e) {
        e.preventDefault();

        var username = $('#username').val()

        if (username !== '')
        {
            Quiz.init(username);
        }
    });
}());