var express = require( 'express' );
var router = express.Router();

var title = "qGen | Generate";

Math.degrees = function ( rad )
{
    return rad * ( 180 / Math.PI );
}

Math.radians = function ( deg )
{
    return deg * ( Math.PI / 180 );
}


var words =
    {
        "noun":
        {
            "ball":
            [
                "tennis ball",
                "baseball",
                "large ball"
            ],

            "vehicle":
            {
                "land_vehicle":
                {
                    "truck":
                    [
                        "truck",
                        "garbage truck"
                    ],

                    "car":
                    [
                        "coupe",
                        "sedan",
                        "telsa"
                    ]
                },

                "water_vehicle":
                [
                    "boat",
                    "sailboat",
                    "jetski"
                ]
            }
        },

        "unit":
        {
            "velocity":
            [
                "m/s"
            ],

            "acceleration":
            [
                "\(m/s^2\)"
            ]
        },
        
        "cardinal_direction":
        [
            "north",
            "south",
            "east",
            "west"
        ],
        
                "ordinal_direction":
        [
            "northeast",
            "southeast",
            "northwest",
            "southwest"
        ]
    };

var flatWords = {};

function flattenWords( words, path )
{
    if ( typeof words === "object" && !Array.isArray( words ) )
    {

        for ( var key in words )
        {
            if ( words.hasOwnProperty( key ) )
            {
                var arr = path.slice();
                arr.push( key );
                console.log( arr );
                flattenWords( words[key], arr );
            }
        }
    }
    else
    {
        flatWords[path[path.length - 1]] = path;
    }
}

var questionTemplate_ch2 = {
    template: "A {object1|[water_vehicle,ball]} is traveling {direction1|'north'} at {velocity|(1,[20,40,30,10]),unit:velocity}. A sudden gust of wind gives the {object1} an acceleration of {acceleration|( .2, 2 ),unit:acceleration}, {direction2|(0,360),units:'°'} north of east. What is the {object1}'s velocity after {time|(2,30),unit:'s'} when the wind stops?",
    formula: function ()
    {
        var q = this.subs;
        var vx = q.acceleration.value * q.time.value * Math.cos( Math.radians( q.direction2.value ) ) + q.velocity.value * Math.cos( Math.radians( 90 ) );
        var vy = q.acceleration.value * q.time.value * Math.sin( Math.radians( q.direction2.value ) ) + q.velocity.value * Math.sin( Math.radians( 90 ) );

        return [vx, vy];
    },
    attr: [
        { label: 'Vx', unit: 'm/s' },
        { label: 'Vy', unit: 'm/s' }
    ],
    chapter: 2
};




var questionTemplate_ch2b = {
    template: "A {object1|[water_vehicle,ball]} is traveling {direction1|'north'} at {velocity|(1,[20,40,30,10]),unit:velocity}. A sudden gust of wind gives the {object1} an acceleration of {acceleration|( .2, 2 ),unit:acceleration}, {direction2|(0,360),units:'°'} north of east. What is the {object1}'s speed after {time|(2,30),unit:'s'} when the wind stops?",
    formula: function ()
    {
        var q = this.subs;
        var vx = q.acceleration.value * q.time.value * Math.cos( Math.radians( q.direction2.value ) ) + q.velocity.value * Math.cos( Math.radians( 90 ) );
        var vy = q.acceleration.value * q.time.value * Math.sin( Math.radians( q.direction2.value ) ) + q.velocity.value * Math.sin( Math.radians( 90 ) );
        var speed = Math.sqrt( vx * vx + vy * vy );
        
        return [speed];
    },
    attr: [
        { label: 'speed', unit: 'm/s' }
    ],
    chapter: 2
};


var questionTemplates = 
[
    [],
    [
        questionTemplate_ch2,
        questionTemplate_ch2b
    ]
];

/**
 * @param {Object<question>} question
 * @return {Object}
 */
function calculateQuestionAsnwer( tmp )
{
    return tmp.formula();
}



/**
 * @param {Object<question>} question
 * @return {Object}
 */
function buildQuestion( chapter )
{
    var choices = questionTemplates[ chapter - 1 ];
    var rand =  Math.floor( Math.random() * choices.length );
    var tmp = choices[ rand ];
    
    var que = {
        text: "",
        subs: {},
        formula: undefined,
        answer: [],
        attr: [],
        chapter: 0
    };

    extractSubs( que, tmp.template );

    que.formula = tmp.formula;
    que.answer = calculateQuestionAsnwer( que, tmp );
    que.attr = tmp.attr;
    que.chapter = tmp.chapter;

    return que;
}





/**
 * @param {Object} subs substitutes stored in the question
 * @param {string} template  question template text
 */
function extractSubs( que, tmp )
{
    var subs = que.subs;
    var subName_reg = /\{([^\{\}\(\)\[\]\,\:\<\>\']+?)(\|(.+)|)\}/
    var subName = "";
    var depth = 0; // "{" increase depth
    var subComplete = false;
    var char = "";
    var startIndex = 0;

    for ( var index = 0; index < tmp.length; index++ )
    {
        char = tmp.charAt( index );

        if ( char == "{" )
        {
            if ( depth == 0 )
            {
                startIndex = index;
            }
            depth++;
            subComplete = true;
        }
        else if ( char == "}" )
        {
            depth--;
        }

        if ( depth == 0 && subComplete == false )
        {
            que.text += char;
        }

        if ( depth == 0 && subComplete == true )
        {
            var subText = subName_reg.exec( tmp.substring( startIndex, index + 1 ) );
            subName = subText[1];

            if ( typeof subText[3] !== "undefined" && typeof subs[subName] === "undefined" )
            {
                subs[subName] = parseObjectSub( que, "{" + subText[3] + "}" );
            }
            else if ( typeof subText[3] === "undefined" && typeof subs[subName] !== "undefined" )
            {
                que.text += subs[subName].value;
            }
            else
            {
                console.error( "Substitution undefined or redefined" );
            }

            subComplete = false;
        }


    }

    if ( depth != 0 )
    {
        console.error( "unclosed brace in question template" );
    }
};


/**
 * @param {string} sub
 * @param {Object} obj
 * @param {string} name
 * @param {boolean} objectType
 */
function parseSubs( que, sub, objectType )
{
    var subArray = commaSplit( sub );
    var obj = {}

    for ( var i = 0; i < subArray.length; i++ )
    {
        if ( objectType )
        {
            var extraction = extractVarName( subArray[i] );
            var subType = parseSubType( extraction.sub );

            obj[extraction.varName] = redirectSubType( que, subType, extraction.sub );
        }
        else
        {
            obj = redirectSubType( que, parseSubType( sub ), sub );
        }
    }

    return obj;
};








/**
 * @param {string} sub
 * @return {string} varName
 */
function extractVarName( sub )
{
    var varName_reg = /(^[^\{\}\(\)\[\]\,\:\<\>\']+?):/
    var varName = varName_reg.exec( sub );
    if ( varName == null )
    {
        varName = [];
        varName[1] = "value";
    }
    else
    {
        sub = sub.substring( varName[0].length, sub.length );
    }

    return { varName: varName[1], sub: sub };
}


/**
 * @param {string} sub
 * @return {}
 */
function parseSubType( sub )
{
    var type = "";

    if ( typeof sub === "string" )
    {
        var char = sub.charAt( 0 );

        switch ( char )
        {
            case "{":
            case "[":
            case "<":
            case "(":
            case "'":
                type = char;
                break;
        }
    }

    return type;
};



/**
 * @param {string} subType
 * @param {string} sub
 * @param {Object} obj
 * @param {string} name
 * @return {}
 */
function redirectSubType( que, subType, sub )
{
    console.log( "sub Type: " + subType + " : " + sub );

    switch ( subType )
    {
        case "{": // object
            return parseObjectSub( que, sub );
        case "[": //choose
            return parseChooseSub( que, sub );
        case "<": //tbd

            break;
        case "(": //range
            var temp = parseRangeSub( sub );
            que.text += temp;
            return temp;
        case "'": //literal
            que.text += trimBracket( sub );
            return parseLiteralSub( sub );
        case "": //substitue
            var temp = parseSubstituteSub( sub );
            que.text += temp;
            return temp;
        default:
            console.error( "undefined sub type: " + subType );
    }
};


/**
 * @param {string} sub
 * @param {Object} obj
 * @param {string} name
 */
function parseObjectSub( que, sub )
{
    sub = trimBracket( sub );
    return makeObject( que, sub );
};


/**
 * @param {string} sub
 * @param {Object} obj
 * @param {string} name 
 */
function parseChooseSub( que, sub )
{
    sub = trimBracket( sub );

    var choices = commaSplit( sub );
    return makeChoice( que, choices );
    //obj[name] = choices[Math.floor(( Math.random() * commaSplit.length ) )];
};


/**
 * @param {string} sub
 */
function parseRangeSub( sub )
{
    sub = trimBracket( sub );
    return makeRange( 10 );
};


/**
 * @param {string} sub
 */
function parseLiteralSub( sub )
{
    return trimBracket( sub );
};


/**
 * @param {string} sub
 */
function parseSubstituteSub( sub )
{
    return makeSubstitution( sub );
};


/**
 * @param {string} sub
 * @param {Object} obj
 */
function makeObject( que, sub )
{
    return parseSubs( que, sub, true )
}



/**
 * @param {Array<string>} choices
 * @param {Object} obj
 * @param {string} name
 * @returns {}
 */
function makeChoice( que,  choices )
{
    var choice = Math.floor( Math.random() * choices.length );
    return parseSubs( que , choices[choice] , false);
}






function makeRange( num )
{
    var rand = Math.floor( Math.random() * num );
    return rand;
}






function makeSubstitution( sub )
{
    var path = flatWords[sub];
    if (typeof path === "undefined") {
        return "null";
    }
    var choices = digArray( words, path );
    var rand = Math.floor( Math.random() * choices.length );
    return choices[rand];
}

function digArray( wordsC , path )
{
    if ( path.length > 1 )
    {
        var arr = path.slice();
        arr.shift();
        return digArray( wordsC[path[0]], arr );
    }
    else
    {
        return wordsC[path[0]];
    }
}




/**
 * removes surrounding brackets
 * @param {string} text
 * @return {string} 
 */
function trimBracket( text )
{
    var char = text.charAt( 0 );

    switch ( char )
    {
        case "{":
        case "[":
        case "<":
        case "(":
        case "'":
            text = text.substring( 1, text.length - 1 ); //trim brackets
            break;
        default:
            break;
    }

    return text;
}



/**
 * @param {string} sub
 */
function commaSplit( sub )
{
    var counter = 0;
    var quote = false;
    var char = "";
    var subArray = [];
    var index = 0;

    for ( var i = 0; i < sub.length; i++ )
    {
        char = sub.charAt( i );

        switch ( char )
        {
            case "{":
            case "[":
            case "<":
            case "(":
                if ( quote == false )
                {
                    counter++;
                }
                break;

            case "}":
            case "]":
            case ">":
            case ")":
                if ( quote == false )
                {
                    counter--;
                }
                break;

            case "'":
                quote = !quote;
                break;

            case ",":
                if ( counter == 0 && quote == false )
                {
                    subArray[index++] = sub.substring( 0, i );
                    sub = sub.substring( i + 1, sub.length );
                    i = -1;
                }
                break;
        }
    }

    subArray[index] = sub;
    return subArray;
};



function extractSubNames( subs )
{
    var subName_reg = /\{(.*?)(:(.*?)\}|\})/;
    var subNames;
    var question = {};
    subs.forEach( function ( sub )
    {
        subNames = subName_reg.exec( sub );
        if ( subNames[3] )
        {

            question[subNames[1]] = subNames[3];
        }
    });
    console.log( question );
}




/* GET home page. */
router.get( '/:category/:type', function ( req, res, next )
{
    console.log( extractSubs( questionTemplate_ch2.subs, questionTemplate_ch2.template ) );
    // console.log(subs);
    res.render( 'generator', { title: title, question: questionTemplate_ch2 });
    console.log( req.params.category + ' ' + req.params.type );
});

/* GET home page. */
router.get( '/:chapter', function ( req, res, next )
{
    flattenWords( words, [] );
    var preparedQuestion = buildQuestion( req.params.chapter );
    console.log( preparedQuestion );
    res.send( preparedQuestion );
});


/* GET home page. */
router.get( '/', function ( req, res, next )
{
    res.render( 'generator', { title: title });
});



module.exports = router;
