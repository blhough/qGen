var root = "http://localhost:3000"
var $questionTemplate;
var $questions;
var $chapter;

$( document ).ready( function ()
{
    console.log( "ready!" );
    $questionTemplate = $( '.question-block' ).detach();
    $questionTemplate.css( 'display', 'block' );
    $questions = $( '#questions' );
    $chapter = $( '#chapter-select' );



    var app = angular.module( 'questions', [] );

    app.controller( 'questionCtrl', function ( $scope, $http )
    {
        $scope.questions = [];
        $scope.questionCount = 0;
        $scope.chapter = 2;
        $scope.generate = function ()
        {
            $http.get( root + '/gen/' + $scope.chapter ).then( function ( response )
            {
                 $scope.questionCount++;
                console.log( response.data );
                $scope.questions.push( response.data );
            });
        }

    });

    app.directive( 'questionTemplate', function ()
    {
        return {
            templateUrl: root + '/templates/question-template'
        };
    });

});

function generate( params )
{
    var jqxhr = $.ajax( root + '/gen/' + $chapter.val() )
        .done( function ( question )
        {
            var $newQuestion = $questionTemplate.clone().appendTo( $questions );
            $newQuestion.find( '.question-text' ).html( question );
            $newQuestion.find( '.chapter-number' ).html( $chapter.val() );
        })
        .fail( function ()
        {
            alert( "error" );
        })
}

