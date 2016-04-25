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

        $scope.generate = function ( regen = false, index = 0 )
        {
            var chapter = regen ? $scope.questions[index] : $scope.chapter;
            $http.get( '/gen/' + $scope.chapter ).then( function ( response )
            {
                var que = response.data;

                que.id = $scope.questionID;
                que.entered = [];
                que.buttonText = "Check";
                que.buttonClass = "";
                que.panelClass = "";
                que.correct = false;
                

                if ( !regen )
                {
                    $scope.questionCount++;
                    $scope.questionID++;
                }

                var width = que.attr.length;

                switch ( width )
                {
                    case 3:
                        que.width = 3;
                        break;
                    case 2:
                        que.width = 4;
                        break;
                    case 1:
                        que.width = 6;
                        break;

                    default:
                        que.width = 3;
                        break;
                }

                console.log( que );

                if ( regen )
                {
                    $scope.questions[index] = que;
                }
                else
                {
                    $scope.questions.push( que );
                }
            });
        }

        $scope.remove = function ( index )
        {
            $scope.questions.splice( index, 1 );
        }

        $scope.checkAnswer = function ( index )
        {
            var que = $scope.questions[index];

            for ( var i = 0; i < que.answer.length; i++ )
            {
                var correct = equal( que.answer[i], que.entered[i], que.answer[i]/10000 );
                console.log( correct );
                if (!correct) {
                    que.panelClass = "panel-danger";
                    que.buttonText = "Try Again";
                    
                    return;
                }
            }
            
             que.panelClass = "panel-success";
             que.buttonClass = "disabled btn-success";
             que.buttonText = "correct";
             que.correct = true;

            console.log( que.entered );
            console.log( que.answer );
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



function equal( a, b, epsilon )
{
    absA = Math.abs( a );
    absB = Math.abs( b );
    diff = Math.abs( a - b );
    epsilon = Math.abs( epsilon );

    if ( a == b )
    { // shortcut, handles infinities
        return true;
    } else if ( a == 0 || b == 0 || diff < a.MIN_VALUE )
    {
        // a or b is zero or both are extremely close to it
        // relative error is less meaningful here
        return diff < ( epsilon * a.MIN_VALUE );
    } else
    { // use relative error
        return diff / ( absA + absB ) < epsilon;
    }
}