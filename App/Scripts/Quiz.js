
var s, // access to settings
Quiz = {

    /**
     * Setting contain variables for easy access
     * @type {Object}
     */
    settings: {
        points: 0,                                      // How many right answeres user has
        answeredQuestions: [],                          // All the questions user has answerd and what he answered
        quizContainer: $('.quiz-container'),            // Selector for the quiz container
        alertContainer: $('.quiz-alerts'),              // Selector for alert container
        questionView: $("#question-template").html(),   // QuestionView Template
        finishedView: $("#quiz-finished").html(),       // FinishedView Template
        errorView: $("#quiz-error-template").html()     // ErrorView Template

    },

    /**
     * Initializes the quiz
     * @return {void} Returns nothing
     */
    init: function() {
        s = this.settings;

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
        // Gets the quiz view
        var source = inputSource;

        // Compiles the view
        var template = Handlebars.compile(source);

        // Gets random question and displays it to the user
        var context = inputContext;

        // Appends the view to the index
        outputHtml.html(template(context));
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

            //  Gets the checked radiobutton
            var answer = Number($('input[name=' + context.id + ']:checked').val());

            //  Checks if it is a number, if not user has not answered
            if (isNaN(answer) === false) {
                //  Checks how smart user is
                if (answer === context.correctAnswer) {
                    s.points++;
                } 
                // Adds question and answered to array
                s.answeredQuestions.push([context.id, answer]);
                
                // Updates the View
                Quiz.update();

                // Clears error message if there is any
                Quiz.displayMessage('clear');
            }
            else {
                //  User has not answere, error displayd
                Quiz.displayMessage('Please chooce a answer!');
            }
        });

        //  Event listener for close button on errors
        $('#close').click(function(e) {
            // Clears error
            Quiz.displayMessage('clear');
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