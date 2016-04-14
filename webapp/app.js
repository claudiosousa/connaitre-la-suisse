
//const MODE = "flashcards";
const MODE = "quiz";


function shuffle(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var rnd = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[rnd];
        array[rnd] = temp;
    }
    return array;
}
const PAGE_SIZE = 12;
angular.module('testApp', ['ngResource']).controller('appController',
    function ($scope, $resource, $timeout) {
        $scope.MODE = MODE;

        var rsc = $resource('questions.json');
        var list = rsc.query(function () {
            shuffle(list);
            list.forEach(l=> shuffle(l.choices));

            if (MODE == "flashcards") {
                if (list.length % 2)
                    list.push(angular.copy(list[list.length - 1]));
            } else {
                var left = list.length % PAGE_SIZE;
                if (left)
                    for (var i = left; i < PAGE_SIZE; i++)
                        list.push({ empty: true });

            }
            var newList = [];
            for (var i = 0; i < Math.ceil(list.length / PAGE_SIZE); i++) {
                var pageQuestions = list.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE);
                newList.push.apply(newList, pageQuestions);
                pageQuestions = angular.copy(pageQuestions);
                pageQuestions.forEach(q=> q.showAnswers = true);
                for (var j = 1; j < pageQuestions.length; j += 2) {
                    var t = pageQuestions[j];
                    pageQuestions[j] = pageQuestions[j - 1];
                    pageQuestions[j - 1] = t;
                }
                newList.push.apply(newList, pageQuestions);
            }

            $timeout(function () {
                $scope.list = newList;
            });
        });

    });

