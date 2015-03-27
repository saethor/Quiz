var s, 
Quiz = {


    settings: {

    },

    init: function() {
        s = this.settings;
    },

    bindUIActions: function() {

    }

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
};