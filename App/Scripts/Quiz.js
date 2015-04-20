/* global $:false, localStorage: false, Handlebars: false, document: false, window: false, console.log: false, setTimeout: false;*/

'use strict';
var s, // access to settings
e, // access events
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
        questionView: $('#question-template').html(),   // QuestionView Template
        finishedView: $('#quiz-finished').html(),       // FinishedView Template
        errorView: $('#quiz-error-template').html()     // ErrorView Template
    },

    /**
     * Initializes the quiz
     * @return {void} Returns nothing
     */
    init: function(username) {
        s = this.settings;
        e = this.events;
        s.username = username;
        this.bindKeys();

        this.update();
    },

    /**
     * Updates for new question or game finished
     * @return {void} Returns nothng
     */
    update: function() {
        localStorage.setItem(s.username, JSON.stringify(s.answeredQuestions));

        document.addEventListener('keydown', this.events.bindKeys);

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
            //this.bindUIActions();

            this.currentQuestion = context;
            document.getElementById('next-question').addEventListener('click', e.nxt, false);
            document.getElementById('prev-question').addEventListener('click', e.prv, false);


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

    events: {
        nxt: function(evt) {
            evt.preventDefault();
            var context = this.currentQuestion;

            // Gets the answere user choose
            var answerButton = $('input[name=' + context.id + ']:checked');

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
                
                Quiz.displayMessage('clear'); // Clears error message if there is any

                setTimeout(function() {
                    Quiz.update();
                }, 1500);
            }
            else {
                Quiz.displayMessage('Please chooce a answer!'); //  User has not answere, error displayd
            }
        },

        prv: function(evt) {
            evt.preventDefault();
            var prv = s.answeredQuestions[s.answeredQuestions.length -1];
            Quiz.template(s.questionView, Quiz.questions[prv[0]], s.quizContainer);
            
            if (Quiz.validateAnswere(prv)) {
                document.getElementById(prv[1]).nextElementSibling.className += 'rightAnswere';
            } else {
                document.getElementById(prv[1]).nextElementSibling.className += 'wrongAnswere';
            }
        },

        restart: function(evt) {
            evt.preventDefault();
            s.answeredQuestions = [];
            s.points = 0;

            // Updates the quiz view
            Quiz.update();
        },

        closeError: function(evt) {
            evt.preventDefault();
            Quiz.displayMessage('clear');
        },

        bindKeys: function(evt) {
            switch(evt.which) {
                case 13:
                    e.nxt(evt);
                    break;
                case 49:
                    document.getElementById('0').checked = true;
                    break;
                case 50: 
                    document.getElementById('1').checked = true;
                    break;
                case 51:
                    document.getElementById('2').checked = true;
                    break;
                case 52:
                    document.getElementById('3').checked = true;
                    break;
                case 53:
                    document.getElementById('4').checked = true;
                    break;
                case 54:
                    document.getElementById('5').checked = true;
                    break;
            }
        },
    },

    /**
     * Displays the finished view
     * @return {void} nothing returns
     */
    finished: function() {
        s._localStorage = this.getLocalStorage();
        this.getScore();

        // Loads the right template
        this.template(s.finishedView, this, s.quizContainer);

        //  Event listener for retake quiz button
        $('#retake-quiz').click(function() {

            // Initializes answeredQuestions and points to 0
            s.answeredQuestions = [];
            s.points = 0;

            // Updates the quiz view
            Quiz.update();
        });
        
    },

    // Calculates total score for a user based on localstorage json string 
    getScore: function() {
        var _localStorage = this.getLocalStorage(),
            temp_username,
            temp_userAnsweres,
            temp_userScore;

        this.leaderboard = {};

        // Loops through each user
        for (var user in _localStorage) {
            temp_userScore = 0;
            temp_username = user;
            temp_userAnsweres = JSON.parse(_localStorage[user]);
            temp_userAnsweres.forEach(calculateScore);
            Quiz.leaderboard[temp_username] = temp_userScore;
        }

        function calculateScore(answere) {
            if (Quiz.validateAnswere(answere)) {
                temp_userScore++;
            }
        }

    },

    validateAnswere: function(answere) {
        var _questions = Quiz.questions,
            temp_quest;
        for (var question in _questions) {
            temp_quest = _questions[question];

            if (temp_quest.id === answere[0]) {
                if (temp_quest.correctAnswer === answere[1])
                    return true;
            }
        }
        return false;
    },

    getLocalStorage: function() {
        var _localStorage = {};
        for (var i = 0; i < localStorage.length; i++) {
            _localStorage[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
        }
        return _localStorage;
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
                $('.quiz--alerts').html('');
                break;

            default:
                // Loads error with errorMessage as a message
                this.template(s.errorView, { error: errorMessage}, s.alertContainer);
                document.getElementById('close').addEventListener('click', this.events.closeError);
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
