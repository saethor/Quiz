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
        answeredQuestions: [],                                                    // All the questions user has answerd and what he answered
        quizContainer:  document.getElementById('quiz'),                          // Selector for the quiz container
        alertContainer: document.getElementById('alerts'),                        // Selector for alert container
        questionView:   document.getElementById('question-template').innerHTML,   // QuestionView Template
        finishedView:   document.getElementById('quiz-finished').innerHTML,       // FinishedView Template
        errorView:      document.getElementById('quiz-error-template').innerHTML  // ErrorView Template
    },

    /**
     * Initializes the quiz
     * @return {void} Returns nothing
     */
    init: function(username) {
        s = this.settings;
        e = this.events;

        s.username = new User(username, null);

        // Gets the questions with a json call
        XHR('data/questions.json', function(json) {
            Quiz.questions = json.questions;
            Quiz.update(); // Inside the callback so its waits after XHR is done fetching questions
        });
    },

    /**
     * Updates for new question or game finished
     * @return {void} Returns nothng
     */
    update: function(question) {
        localStorage.setItem(s.username.name, JSON.stringify(s.answeredQuestions));
    
        // Gets random question and displays it to the user
        var context;

        // Checks if user still has a unanswered questions
        if (Quiz.questions.length !== s.answeredQuestions.length) {

            // Checks if user is coming back for the specific question or a new random
            if (question === undefined) {
                
                do {
                    // returns random question
                    context = this.questions[Math.floor(Math.random() * this.questions.length)];
                } while (Quiz.isAnswered(context.id, s.answeredQuestions)); // Checks if question has been answered
            
            } else {
                context = question;
            }

            // Loads the question module and calls its display method
            var currQuestion = new Question(context.id, context.question, context.choices, context.correctAnswer);
            currQuestion.displayQuestion();

            // Disables back button if there is no going back
            if (s.answeredQuestions.length > 0) {
                document.getElementById('prev-question').disabled = false; 
            } else {
                document.getElementById('prev-question').disabled = true;
            }

            this.currentQuestion = currQuestion;
            document.addEventListener('keydown', this.events.bindKeys);
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
        outputHtml.innerHTML = template(context); // Appends the view to the index
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
     * Module for events binding
     * @type {Object}
     */
    events: {
        /**
         * Displays next question and validates answer
         * @param  {event} evt Current event
         */
        nxt: function(evt) {
            evt.preventDefault();
            var context = Quiz.currentQuestion;


            // Gets the answere user choose
            var answerButton = document.querySelector('input[name="' + context.id + '"]:checked');

            //  Gets the checked radiobutton
            var answer = (answerButton) ? Number(answerButton.value) : -1;

            //  Checks if it is a number, if not user has not answered
            if (isNaN(answer) === false && answer !== -1) {
                Quiz.currentQuestion.userAnswer = answer;

                //  Checks how smart user is
                if (Quiz.currentQuestion.validateAnswere()) {
                    s.username.currentScore++;

                    answerButton.nextElementSibling.className = ' rightAnswere'; // Shows the user that his answere is right
                } 
                else {
                    document.getElementById(context.correctAnswer).nextElementSibling.className = ' rightAnswere'; // Shows the right answere
                    answerButton.nextElementSibling.className = 'wrongAnswere'; // Shows user that his answere is wrong
                }

                s.answeredQuestions.push([context.id, answer]); // Adds question and answered to array
                
                Quiz.displayMessage('clear'); // Clears error message if there is any

                document.removeEventListener('keydown', e.nxt, false);
                document.getElementById('next-question').removeEventListener('click', e.nxt, false);

                setTimeout(function() {
                    Quiz.update();
                }, 1500);
            }
            else {
                Quiz.displayMessage('Please chooce a answer!'); //  User has not answere, error displayd
            }
        },

        /**
         * Goes to previous question (Only possible to go one back at this time)
         * @param  {event} evt Current event
         */
        prv: function(evt) {
            evt.preventDefault();

            if (s.answeredQuestions.length > 0) {
                var prv = s.answeredQuestions[s.answeredQuestions.length -1];
                var prvQuestion = Quiz.questions[prv[0]];

                Quiz.template(s.questionView, Quiz.questions[prv[0]], s.quizContainer);
                
                if (Quiz.validateAnswere(prv)) {
                    document.getElementById(prv[1]).nextElementSibling.className = 'rightAnswere';
                } else {
                    document.getElementById(prvQuestion.correctAnswer).nextElementSibling.className = 'rightAnswere';
                    document.getElementById(prv[1]).nextElementSibling.className = 'wrongAnswere';
                }

                document.getElementById('next-question').addEventListener('click', function() {
                    Quiz.update(Quiz.currentQuestion);
                });
                document.removeEventListener('keydown', e.nxt, false);
                document.addEventListener('keydown', function() {
                    Quiz.update(Quiz.currentQuestion);
                });
            }
        },

        /**
         * Restarts the quiz
         * @param  {event} evt Current event
         */
        restart: function() {
            window.location.reload();
        },

        /**
         * Closes error window at the top
         * @param  {event} evt Current event
         */
        closeError: function(evt) {
            evt.preventDefault();
            Quiz.displayMessage('clear');
        },

        /**
         * Binds keyboard keys to a specific functions
         * @param  {event} evt Current event
         */
        bindKeys: function(evt) {
            switch(evt.which) {
                case 13:
                    e.nxt(evt);
                    break;
                case 37:
                    e.prv(evt);
                    break;
                case 39:
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
        document.getElementById('retake-quiz').addEventListener('click', function() {
            e.restart();
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

    /**
     * Validates question to check if the answer is right
     * @param  {array} 
     * @return {bool}         
     */
    validateAnswere: function(answere) {
        var _questions = Quiz.questions, // Underscore to prevent conflict
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

    /**
     * Returns localstorage as a object
     * @return {object} Localstorage object
     */
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
                document.getElementById('alerts').innerHTML = '';
                break;

            default:
                // Loads error with errorMessage as a message
                this.template(s.errorView, { error: errorMessage}, s.alertContainer);
                document.getElementById('close').addEventListener('click', this.events.closeError);
                break;
        }  
    }
};


/**
 * User constructor object from http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
 * @param {string} name  Username form input in the begining
 * @param {string} email Currently not used
 */
function User(name, email) {
    this.name = name;
    this.email = email;
    this.quizScores = [];
    this.currentScore = 0;
}

User.prototype = {
    constructor: User,

    saveScore: function(scoreToAdd) {
        this.quizScores.push(scoreToAdd);
    },

    showScore: function() {
        return this.currentScore;
    },

    showNameAndScore: function() {
        var scores  = this.quizScores.length > 0 ? this.quizScores.join(',') : 'No Scores Yet';
        return this.name + ' Scores: ' + scores;
    },

    changeEmail: function(newEmail) {
        this.email = newEmail;
        return 'New Email saved: ' + this.email;
    }
};



/**
 * Question constructor from http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
 * @param {int}    id            Id of each question to keep track of what question is left
 * @param {string} question      
 * @param {array}  choices       
 * @param {int}    correctAnswer 
 */
function Question(id, question, choices, correctAnswer) {
    this.id = id;
    this.question = question;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
    this.userAnswer = '';

    var newDate = new Date(),
        QUIZ_CREATED_DATE = newDate.toLocaleDateString();

    this.getQuizDate = function() {
        return QUIZ_CREATED_DATE;
    };
}

// Returns correct answer
Question.prototype.getCorrectAnswer = function() {
    return this.correctAnswer;
};

// Returns what user answerd
Question.prototype.getUserAnswer = function() {
    return this.userAnswer;
};

// Displays question view
Question.prototype.displayQuestion = function() {
    var source = s.questionView; // Gets the quiz view    
    var template = Handlebars.compile(source); // Compiles the view  
    var context = this; // Gets random question and displays it to the user
    s.quizContainer.innerHTML = template(context); // Appends the view to the index
};

// Return true || false if question is correct answered
Question.prototype.validateAnswere = function() {
    if (this.userAnswer === this.correctAnswer)
        return true;
    else 
        return false;
};



/**
 * Handlebars helper, returns how many questions are answered right / how many questions
 * @param  {string}
 * @return {string}   Concatinated points/questions
 */
Handlebars.registerHelper('finalPoints', function() {
    return s.username.showScore() + '/' + Quiz.questions.length;
});


/**
 * Ajax Wrapper JavaScript - The Definitive Guide (p.501)
 * @param {string}   url      
 * @param {Function} callback 
 */
function XHR(url, callback) {
    var request = new XMLHttpRequest(); // Instatiate the XMLHttpRequest object
    request.open('GET', // HTTP method
                 url); // requested url

    request.onreadystatechange = function() { // Event listener
        // Checks if the request is complete and was successful
        if (request.readyState === 4 && request.status === 200) {
            // Get the type of response
            var type = request.getResponseHeader('Content-Type');
            // Check the type. Avoiding HTML.
            if (type === 'application/json') 
                callback(JSON.parse(request.responseText)); // Json response
        }
    };
    request.send(null);  // Sending the response
}
