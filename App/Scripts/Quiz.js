
var s, 
Quiz = {

    settings: {
        points: 0,
        answeredQuestions: [],
        quizContainer: $('.quiz-container'),
        questionView: $("#question-template").html(),
        finishedView: $("#quiz-finished").html(),
        rightAnswerView: $("#right-answer-template").html(),
        wrongAnswerView: $("#wrong-answer-template").html(),
        errorView: $("#quiz-error-template").html()
    },

    init: function() {
        s = this.settings;

        // Gets the quiz view
        var source = s.questionView;

        // Compiles the view
        var template = Handlebars.compile(source);

        // Gets random question and displays it to the user
        var context = this.questions[Math.floor(Math.random() * this.questions.length)];

        // Appends the view to the index
        $('.quiz-container').html(template(context));

        // Adds the function for user to answer the question
        this.bindUIActions(context);
    },

    update: function() {
        if (Quiz.questions.length !== s.answeredQuestions.length) {
            // Gets the quiz view
            var source = s.questionView;

            // Compiles the view
            var template = Handlebars.compile(source);

            // Gets random question and displays it to the user
            var context;
            do {
                context = this.questions[Math.floor(Math.random() * this.questions.length)];
            } while (Quiz.isAnswered(context.id, s.answeredQuestions))

            // Appends the view to the index
            s.quizContainer.html(template(context));

            // Adds the function for user to answer the question
            this.bindUIActions(context);
        }
        else {
            // Returns finish view with information
           Quiz.finished();
        }

    },

    isAnswered: function(needle, heystack) {
        var length = heystack.length;
        for (var i = 0; i < length; i++) {
            if (heystack[i][0] == needle) return true;
        }
        return false;
    },

    bindUIActions: function(context) { 
        // When user clicks next question it should check if he has answeread,
        // if so it should check if hi is right and increment his score, else
        // it should display a error 
        $('#next-question').click(function(e) {
            e.preventDefault();

            var answer = Number($('input[name=' + context.id + ']:checked').val());

            if (isNaN(answer) === false) {
                if (answer === context.correctAnswer) {
                    s.points++;
                } 
                s.answeredQuestions.push([context.id, answer]);
                Quiz.update();
                Quiz.displayMessage('clear');
            }
            else {
                Quiz.displayMessage('Please chooce a answer!');
            }
        });

        $('#close').click(function(e) {
            Quiz.displayMessage('clear');
        });
    },

    finished: function() {
        // Gets the quiz view
        var source = s.finishedView;

        // Compiles the view
        var template = Handlebars.compile(source);

        // Gets random question and displays it to the user
        var context = this.settings;

        // Appends the view to the index
        s.quizContainer.html(template(context));

        $('#retake-quiz').click(function(e) {
            s.answeredQuestions = [];
            s.points = 0;

            Quiz.update();
        });
        
    },

    displayMessage: function(errorMessage) {
        

        // Gets random question and displays it to the user
        switch(errorMessage) {
            case 'clear':
                $('.quiz-alerts').html('');
                break;

            default:
                var source = s.errorView;
                // Compiles the view
                var template = Handlebars.compile(source);
                var context = { error: errorMessage};
                // Appends the view to the index
                $('.quiz-alerts').html(template(context));
                break;
        }  
    },

    // Handlebars The Custom Function for rendering on the go
    // http://javascriptissexy.com/handlebars-js-tutorial-learn-everything-about-handlebars-js-javascript-templating/#
    /* ​render: function(tmpl_name, tmpl_data) {
        if ( !render.tmpl_cache ) { 
            render.tmpl_cache = {};
        }
    ​
        if ( ! render.tmpl_cache[tmpl_name] ) {
            var tmpl_dir = '/static/templates';
            var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';
    ​
            var tmpl_string;
            $.ajax({
                url: tmpl_url,
                method: 'GET',
                async: false,
                success: function(data) {
                    tmpl_string = data;
                }
            });
    ​
            render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
        }
    ​
        return render.tmpl_cache[tmpl_name](tmpl_data); 
    },*/

    questions: [
        {
            id: 0,
            question: "What is 7 * 10",
            choices: [70, 80, 72, 32],
            correctAnswer: 0
        },
        {
            id: 1,
            question: "What is 90 / 4",
            choices: [25, 60, 22.5],
            correctAnswer: 2
        },
        {
            id: 2,
            question: "What is 54 + 65",
            choices: [112, 119, 540, 32, 115, 152],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "What does this question have many possible answers?",
            choices: [1, 2, 3, 4],
            correctAnswer: 3
        },
        {
            id: 4,
            question: "What is the answer to the Ultimate Question of Life, the Universe, and Everything",
            choices: ["No one know", "The Bible", 42],
            correctAnswer: 2
        }
]

    
};

function inArray(needle, heystack) {
    var length = heystack.length;
    for (var i = 0; i < length; i++)
    {
        if (heystack[i] == needle) return true;
    }
    return false;
}

Handlebars.registerHelper('finalPoints', function() {
    return s.points + '/' + Quiz.questions.length;
});

// And this is the definition of the custom function ​
function render(tmpl_name, tmpl_data) {
    if (!render.tmpl_cache) { 
        render.tmpl_cache = {};
    }

    if (!render.tmpl_cache[tmpl_name]) {
        var tmpl_dir = '/App/Views';
        var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';
        var tmpl_string;
        $.ajax({
            url: tmpl_url,
            method: 'GET',
            async: false,
            success: function(data) {
                tmpl_string = data;
            }
        });

        render.tmpl_cache[tmpl_name] = Handlebars.compile(tmpl_string);
    }

    return render.tmpl_cache[tmpl_name](tmpl_data);
}