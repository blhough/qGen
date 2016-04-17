var root = "http://localhost:3000"
var $questionTemplate;
var $questions;

$( document ).ready(function() {
    console.log( "ready!" );
    $questionTemplate = $('.question-block').detach();
    $questionTemplate.css('display','block');
    $questions = $('#questions');
});

function generate( params )
{
    var jqxhr = $.ajax( root + '/gen/1' )
        .done( function (question)
        {
            var $newQuestion = $questionTemplate.clone().appendTo($questions);
            $newQuestion.find('.question-text').html(question);
        })
        .fail( function ()
        {
            alert( "error" );
        })
}

