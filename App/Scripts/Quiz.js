'use strict';
var s, // access to settings
Quiz = {

    /**
     * Setting contain variables for easy access
     * @type {Object}
     */
    settings: {
        points: 0,                                      // How many right answeres user has
        answeredQuestions: [],                          // All the questions user has answerd and what he answered
        quizContainer: $('.quiz--container'),            // Selector for the quiz container
        alertContainer: $('.quiz--alerts'),              // Selector for alert container
        questionView: $("#question-template").html(),   // QuestionView Template
        finishedView: $("#quiz-finished").html(),       // FinishedView Template
        errorView: $("#quiz-error-template").html()     // ErrorView Template
    },

    /**
     * Initializes the quiz
     * @return {void} Returns nothing
     */
    init: function(username) {
        s = this.settings;
        s.username = username;

        // Gets random question and displays it to the user
        var context = this.questions[Math.floor(Math.random() * this.questions.length)];

        // Loads the template
        this.template(s.questionView, context, s.quizContainer);

        // Adds the function for user to answer the question
        this.bindUIActions(context);
    },

    /**
     * Updates for new question or game finished
     * @return {void} Returns nothng
     */
    update: function() {
        if (Quiz.questions.length !== s.answeredQuestions.length) {

            // Gets random question and displays it to the user
            var context;
            do {
                // returns random question
                context = this.questions[Math.floor(Math.random() * this.questions.length)];
            } while (Quiz.isAnswered(context.id, s.answeredQuestions)); // Checks if question has been answered

            // Loads the template
            this.template(s.questionView, context, s.quizContainer);

            // Adds the function for user to answer the question
            this.bindUIActions(context);
        }
        else {
            // Returns finish view with information
           Quiz.finished();
        }

    },

    /**
     * Function for template engine
     * @param  {id}     inputSource  Where the template is located
     * @param  {object} inputContext What should be set into template variables
     * @param  {string} outputHtml   Where should the template be exported
     * @return {[void]}              Returns nothing
     */
    template: function (inputSource, inputContext, outputHtml) {
        var source = inputSource; // Gets the quiz view    
        var template = Handlebars.compile(source); // Compiles the view  
        var context = inputContext; // Gets random question and displays it to the user
        outputHtml.html(template(context)); // Appends the view to the index
    },

    /**
     * Checks if the question has already been answered
     * @param  {int}        needle   Question id
     * @param  {array}      heystack Where should the function look
     * @return {Boolean}          
     */
    isAnswered: function(needle, heystack) {
        var length = heystack.length;
        for (var i = 0; i < length; i++) {
            if (heystack[i][0] == needle) return true;
        }
        return false;
    },

    /**
     * UI actions for the quiz
     * @param  {object} context 
     * @return {void}         Returns nothing
     */
    bindUIActions: function(context) { 
        // When user clicks next question it should check if he has answeread,
        // if so it should check if hi is right and increment his score, else
        // it should display a error 
        $('#next-question').click(function(e) {
            e.preventDefault();

            // Gets the answere user choose
            var answerButton = $('input[name=' + context.id + ']:checked')

            //  Gets the checked radiobutton
            var answer = Number(answerButton.val());

            //  Checks if it is a number, if not user has not answered
            if (isNaN(answer) === false) {

                //  Checks how smart user is
                if (answer === context.correctAnswer) {
                    s.points++;

                    answerButton.next('label').addClass('rightAnswere'); // Shows the user that his answere is right
                } 
                else {
                    $('#'+context.correctAnswer).next().addClass('rightAnswere'); // Shows the right answere
                    answerButton.next('label').addClass('wrongAnswere'); // Shows user that his answere is wrong
                }

                s.answeredQuestions.push([context.id, answer]); // Adds question and answered to array

                $('#next-question').html('5 Next Question');

                $('#next-question').click(function() {
                    clearTimeout(timeout);
                    Quiz.update();
                });

                var i = 5;
                var interval = setInterval(function() {
                    i--;
                    if (i === 0)
                    {
                        clearInterval(interval);
                        Quiz.update();
                    }
                    $('#next-question').html(i + ' Next Question').click(function(event) {
                        clearInterval(interval);
                        Quiz.update();
                    });
                }, 1000)

                // Updates the View after 3500 ms
                var timeout;/* = setTimeout(function() {
                    Quiz.update();
                }, 3000);*/
                
                Quiz.displayMessage('clear'); // Clears error message if there is any
            }
            else {
                Quiz.displayMessage('Please chooce a answer!'); //  User has not answere, error displayd
            }
        });

        //  Event listener for close button on errors
        $('#close').click(function(e) {
            Quiz.displayMessage('clear'); // Clears error view
        });
    },

    /**
     * Displays the finished view
     * @return {void} nothing returns
     */
    finished: function() {

        // Loads the right template
        this.template(s.finishedView, this.settings, s.quizContainer);

        //  Event listener for retake quiz button
        $('#retake-quiz').click(function(e) {

            // Initializes answeredQuestions and points to 0
            s.answeredQuestions = [];
            s.points = 0;

            // Updates the quiz view
            Quiz.update();
        });
        
    },

    /**
     * Displays error message and clears them at the top of the page
     * @param  {string} errorMessage 
     * @return {void}              Returns nothing
     */
    displayMessage: function(errorMessage) {
        

        // Gets random question and displays it to the user
        switch(errorMessage) {
            // Clears alert View
            case 'clear':
                $('.quiz-alerts').html('');
                break;

            default:
                // Loads error with errorMessage as a message
                this.template(s.errorView, { error: errorMessage}, s.alertContainer);
                break;
        }  
    },

    /**
     * Array of objects containing questions
     * @type {Array}
     */
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

/**
 * Handlebars helper, returns how many questions are answered right / how many questions
 * @param  {string}
 * @return {string}   Concatinated points/questions
 */
Handlebars.registerHelper('finalPoints', function() {
    return s.points + '/' + Quiz.questions.length;
});