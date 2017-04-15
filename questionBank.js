function Question(subject, verb, complement, answer) {
    this.subject = subject;
    this.verb = verb;
    this.answer = answer;
    this.complement = complement;

    this.fullQuestion = function () {
        return (
            "Conjuguez le verbe *" +
            this.verb +
            "* dans cette phrase: " +
            this.subject + 
            " ______ " +
            this.complement
            );
    }

    this.fullAnswer = function () {
        return (this.subject + " " + this.answer + " " + this.complement)
    }
}

var questionBank = [
    new Question("Nous", "aller", "à la bibliothèque.", "allons"),
    new Question("Je", "aller", "à la bibliothèque.", "vais"),
    new Question("Tu", "aller", "à la bibliothèque.", "vas"),
    new Question("Il", "aller", "à la bibliothèque.", "va"),
];

module.exports = questionBank;