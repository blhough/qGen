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
        
        $scope.generate = function ()
        {
            $http.get( '/gen/' + $scope.chapter ).then( function ( response )
            {
                $scope.questionCount++;

                var size = response.data.attr.length;

                switch ( size )
                {
                    case 3:
                        $scope.size = 3;
                        break;
                    case 2:
                        $scope.size = 4;
                        break;
                    case 1:
                        $scope.size = 6;
                        break;

                    default:
                        $scope.size = 3;
                        break;
                }

                console.log( response.data );
                $scope.questions.push( response.data );
            });
        }

    });

    app.directive( 'questionTemplate', function ()
    {
        return {
            templateUrl: '/templates/question-template'
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

