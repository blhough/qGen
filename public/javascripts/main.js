var root = "http://localhost:3000"
var $questionTemplate;
var $questions;
var $section;
var questionsLoaded = false;

$( document ).ready( function ()
{
	console.log( "ready!" );

	$questionTemplate = $( '.question-block' ).detach();
	$questionTemplate.css( 'display', 'block' );
	$questions = $( '#questions' );
	$section = $( '#chapter-select' );
	//testEqual();


	var app = angular.module( 'questions', ['ngAnimate'] );

	app.controller( 'questionCtrl', function ( $scope, $http, $timeout )
	{
		$scope.questions = [];

		$scope.questionCount = 0;
		$scope.questionID = 0;
		$scope.timer;
		$scope.sections = [
			{ name: 'Kinematics', value: 'kinematics' },
			{ name: 'Equilibriums', value: 'equilibriums' },
			{ name: 'Dynamics', value: 'dynamics' },
		];

		$scope.generate = function ( regen = false, index = 0 )
		{
			var url = regen ?
				$scope.questions[index].section.toLowerCase() + '/' + $scope.questions[index].tag
				: $scope.section.value;

			$http.get( '/gen/' + url ).then( function ( response )
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

				$scope.saveQuestions();
			});
		};

		$scope.remove = function ( index )
		{
			$scope.questions.splice( index, 1 );
			$scope.questionCount--;
			$scope.saveQuestions();
		};

		$scope.checkAnswer = function ( index )
		{
			var que = $scope.questions[index];

			for ( var i = 0; i < que.answer.length; i++ )
			{
				var correct = equal( que.answer[i], que.entered[i], que.tolerance[i] );
				console.log( correct );


				if ( correct == 0 || correct == 2 )
				{
					if ( $scope.timer )
					{
						$timeout.cancel( $scope.timer );
					}

					$scope.timer = $timeout( function ()
					{
						que.buttonText = "Check";
						que.buttonClass = " btn-info";
					}, 2000 );
				}
				if ( correct == 0 )
				{
					que.panelClass = "panel-danger";
					que.buttonClass = " btn-danger";
					que.buttonText = "Incorrect";
					$scope.saveQuestions();
					return;
				}
				else if ( correct == 2 )
				{
					que.panelClass = "panel-warning";
					que.buttonClass = " btn-warning";
					que.buttonText = "Almost";
					$scope.saveQuestions();
					return;
				}

			}

			que.panelClass = "panel-success";
			que.buttonClass = "btn-success";
			que.buttonText = "Correct";
			que.correct = true;
			$scope.saveQuestions();
			console.log( que.entered );
			console.log( que.answer );
		};

		$scope.saveQuestions = function ()
		{
			if ( simpleStorage.canUse() )
			{
				simpleStorage.set( "Questions", $scope.questions );
			}
		};

		$scope.loadQuestions = function ()
		{
			try
			{
				if ( simpleStorage.hasKey( "Questions" ) )
				{
					$scope.questions = simpleStorage.get( "Questions" );
					$scope.questionId = $scope.questionCount = $scope.questions.length;
				}
			}
			catch ( err )
			{
				simpleStorage.flush();
			}

			setTimeout( function(){ questionsLoaded = true; } , 200 );
		};

		$scope.loadQuestions();

	});

	app.directive( 'questionTemplate', function ()
	{
		return {
			templateUrl: '/templates/question-template'
		};
	});

	app.directive( 'newqBind', function ()
	{
		return {
			restrict: "A",
			link: function ()
			{
				scrollToBottom();
			}
		};
	});


	app.directive( "mathjaxBind", function ()
	{
		return {
			restrict: "A",
			controller: ["$scope", "$element", "$attrs",
				function ( $scope, $element, $attrs )
				{
					$scope.$watch( $attrs.mathjaxBind, function ( texExpression )
					{
						$element.html( texExpression );
						MathJax.Hub.Queue( ["Typeset", MathJax.Hub, $element[0]] );
					});
				}]
		};
	});




	function equal( a, b, tolerance )
	{
		var absA = Math.abs( a );
		var absB = Math.abs( b );
		var diff = Math.abs( a - b );

		//console.log( "a: " + a + "  b: " + b, "  tol " + tolerance.delta + "  " + tolerance.percent + "  " + diff + "   " + diff / ( absA + absB ) / .02 );

		if ( a == b )
		{ // shortcut, handles infinities
			return 1;
		}
		else if ( diff <= tolerance.delta )
		{
			return 1;
		}
		else if ( diff / ( absA + absB ) / .005 <= tolerance.percent )
		{
			return 1;
		}

		if ( diff <= tolerance.delta * 2 )
		{
			return 2;
		}
		else if ( diff / ( absA + absB ) / .005 <= tolerance.percent * 2 )
		{
			return 2;
		}

		return 0;
	}

	function testEqual()
	{
		console.log( equal( 0, 0.00000002, { delta: .01, percent: 2 }) );
		console.log( equal( 0, 0.00002, { delta: .01, percent: 2 }) );
		console.log( equal( 0, 0.00999, { delta: .01, percent: 2 }) );
		console.log( equal( 0, 0.01, { delta: .01, percent: 2 }) );
		console.log( equal( 0, 0.02, { delta: .01, percent: 2 }) );
		console.log( equal( 0, 0.2, { delta: .01, percent: 2 }) );
		console.log( equal( 0.01, 0.02, { delta: .001, percent: 2 }) );
		console.log( equal( 0.0000001, 0.00000002, { delta: .001, percent: 2 }) );
		console.log( equal( 0.00001, 0.02, { delta: .001, percent: 2 }) );
		console.log( equal( 0.00001, 0.002, { delta: .001, percent: 2 }) );
		console.log( equal( 9999.01, 9990.02, { delta: .001, percent: 1 }) );

	}

	var scrollToBottom = function ()
	{
		if ( questionsLoaded )
		{
			$( 'html, body' ).animate( {
				scrollTop: $( document ).height() - $( "#sidebar-wrapper" ).height() + 400
			},
				400
			);
		}
	};
});