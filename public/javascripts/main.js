var root = "http://localhost:3000"
var $questionTemplate;
var $questions;
var $chapter;

$( document ).ready(function() {
    console.log( "ready!" );
    $questionTemplate = $('.question-block').detach();
    $questionTemplate.css('display','block');
    $questions = $('#questions');
    $chapter = $('#chapter-select');
});

function generate( params )
{
    var jqxhr = $.ajax( root + '/gen/' + $chapter.val() )
        .done( function (question)
        {
            var $newQuestion = $questionTemplate.clone().appendTo($questions);
            $newQuestion.find('.question-text').html(question);
            $newQuestion.find('.chapter-number').html($chapter.val());
        })
        .fail( function ()
        {
            alert( "error" );
        })
}

