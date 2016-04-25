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
        $scope.questionID = 0;

        $scope.generate = function ( regen = false , index = 0 )
        {
            var chapter = regen ? $scope.questions[index] : $scope.chapter;
            $http.get( '/gen/' + $scope.chapter ).then( function ( response )
            {
                var question = response.data;

                question.id = $scope.questionID;
                
                if (!regen) {
                $scope.questionCount++;
                $scope.questionID++;
                }

                var size = question.attr.length;

                switch ( size )
                {
                    case 3:
                        question.size = 3;
                        break;
                    case 2:
                        question.size = 4;
                        break;
                    case 1:
                        question.size = 6;
                        break;

                    default:
                        question.size = 3;
                        break;
                }

                console.log( question );
                
                if ( regen )
                {
                    $scope.questions[index] = question;
                }
                else
                {
                    $scope.questions.push( question );
                }
            });
        }

        $scope.remove = function ( index )
        {
            $scope.questions.splice(index,1);
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

