var s, 
Quiz = {


    settings: {
        points: 0,
        questionView: $("#question-template").html(),
        rightAnswearView: $("#right-answear-template").html(),
        wrongAnswearView: $("#wrong-answear-template").html()

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

        // Adds the function for user to answear the question
        this.bindUIActions(context.choices, context.correctAnswer);
    },

    update: function() {
        // Gets the quiz view
        var source = s.questionView;

        // Compiles the view
        var template = Handlebars.compile(source);

        // Gets random question and displays it to the user
        var context = this.questions[Math.floor(Math.random() * this.questions.length)];

        // Appends the view to the index
        $('.quiz-container').html(template(context));

        // Adds the function for user to answear the question
        this.bindUIActions(context.choices, context.correctAnswer);
    },

    bindUIActions: function(choices, correctAnswer) { 
        $('.choice').click(function(event) {
            if ($(this).text() == choices[correctAnswer]){
                Quiz.rightAnswear();
            }
            else {
                Quiz.wrongAnswear();
            }

        });
    },

    rightAnswear: function() {
        // Gets the quiz view
        var source = s.rightAnswearView;

        // Compiles the view
        var template = Handlebars.compile(source);

        // Gets random question and displays it to the user
        var context = this.questions[Math.floor(Math.random() * this.questions.length)];

        // Appends the view to the index
        $('.quiz-container').html(template(context));

        s.points++;

        console.log(s.points);

        $('#next-question').click(function(e) {
            Quiz.update();
        });
    },

    wrongAnswear: function() {
        // Gets the quiz view
        var source = s.wrongAnswearView;

        // Compiles the view
        var template = Handlebars.compile(source);

        // Gets random question and displays it to the user
        var context = this.questions[Math.floor(Math.random() * this.questions.length)];

        // Appends the view to the index
        $('.quiz-container').html(template(context));

        $('#next-question').click(function(e) {
            Quiz.update();
        });
    },

    questions: [
        {
            question: "What is 7 * 10",
            choices: [70, 80, 72, 32],
            correctAnswer: 0
        },
        {
            question: "What is 90 / 4",
            choices: [25, 60, 22.5],
            correctAnswer: 2
        },
        {
            question: "What is 54 + 65",
            choices: [112, 119, 540, 32, 115, 152],
            correctAnswer: 1
        },
        {
            question: "What does this question have many possible answears?",
            choices: [1, 2, 3, 4],
            correctAnswer: 3
        },
        {
            question: "What is the answer to the Ultimate Question of Life, the Universe, and Everything",
            choices: ["No one know", "The Bible", 42],
            correctAnswer: 2
        }
    ]

    // Handlebars The Custom Function for rendering on the go
    // http://javascriptissexy.com/handlebars-js-tutorial-learn-everything-about-handlebars-js-javascript-templating/#
    // ​render: function (tmpl_name, tmpl_data) {
    //     if ( !render.tmpl_cache ) { 
    //         render.tmpl_cache = {};
    //     }
    // ​
    //     if ( ! render.tmpl_cache[tmpl_name] ) {
    //         var tmpl_dir = '/static/templates';
    //         var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';
    // ​
    //         var tmpl_string;
    //         $.ajax({
    //             url: tmpl_url,
    //             method: 'GET',
    //             async: false,
    //             success: function(data) {
    //                 tmpl_string = data;
    //             }
    //         });
    // ​
    //         render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
    //     }
    // ​
    //     return render.tmpl_cache[tmpl_name](tmpl_data);
    // }
};

