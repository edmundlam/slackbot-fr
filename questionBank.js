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
    new Question("Il", "fermer", "notre serveur.", "ferme"),
    new Question("Prateek", "boir", "du Soylent.", "boit"),
    new Question("Nous", "manger", "à l'extérieur tous les vendredis.", "mangeons"),
    new Question("Je", "programmer", "en javascript pour le fun.", "programme"),
    new Question("Il", "faire", "beau dehors.", "fait"),
    new Question("Je", "être", "en feu!!", "suis"),
];

module.exports = questionBank;