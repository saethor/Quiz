(function() {
    'use strict';

    document.onkeypress = function(e) {
        e = e || window.event;
        if (e.which === 13) {
            startGame();
        }
    };

    $('#username').keyup(function() {
        if ($(this).val().length === 0) {
            $('#start-quiz').attr('disabled', 'disabled');
        } else {
            $('#start-quiz').removeAttr('disabled');
        }
    });

    $('#start-quiz').click(function(e) {
        e.preventDefault();
        startGame();
    });

    function startGame() {
        var username = $('#username').val();

        if (username !== '') {
            Quiz.init(username);
        }
    }
}());