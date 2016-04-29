var express = require( 'express' );
var fs = require( 'fs' );

var queTmps = require( './gen/questions' );
var flatDict = require( './gen/dictionaryIndex' );
var dict = require( './gen/dictionary' );

var router = express.Router();

var title = "qGen | Generate";

Math.degrees = function ( rad )
{
    return rad * 180 / Math.PI;
}

Math.radians = function ( deg )
{
    return deg * Math.PI / 180;
}






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
    var choices = queTmps[chapter - 1];
    var rand = Math.floor( Math.random() * choices.length );
    var tmp = choices[rand];

    var que = {
        text: "",
        subs: {},
        formula: undefined,
        answer: [],
        attr: [],
        tolerance: [],
        chapter: 0
    };

    extractSubs( que, tmp.template );

    que.formula = tmp.formula;
    que.answer = calculateQuestionAsnwer( que, tmp );
    que.attr = tmp.attr;
    que.tolerance = tmp.tolerance;
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
                var mathType = subName.charAt( 0 ) == '!'; //if is mathType

                if ( mathType )
                {
                    subName = subName.substring( 1, subName.length );
                }

                subs[subName] = parseObjectSub( que, "{" + subText[3] + "}", true );

                if ( mathType ) //if is mathType
                {
                    subs[subName].text = '\\(' + subs[subName].text + '\\)';
                }

                que.text += subs[subName].text;
            }
            else if ( typeof subText[3] === "undefined" && typeof subs[subName] !== "undefined" )
            {
                que.text += subs[subName].text;
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
 * @param {boolean} objectType
 * @param {boolean} top
 */
function parseSubs( que, sub, objectType, top )
{
    var subArray = commaSplit( sub );
    var obj = { text: "" }

    for ( var i = 0; i < subArray.length; i++ )
    {
        if ( objectType )
        {
            var extraction = extractVarName( subArray[i] );
            var subType = parseSubType( extraction.sub );

            obj[extraction.varName] = redirectSubType( que, subType, extraction.sub );
            obj.text += obj[extraction.varName];
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
            return parseObjectSub( que, sub, false );
        case "[": //choose
            return parseChooseSub( que, sub );
        case "<": //tbd

            break;
        case "(": //range
            return parseRangeSub( sub );;
        case "'": //literal
            return trimBracket( sub );
        case "": //substitue
            return parseSubstituteSub( sub );
        default:
            console.error( "undefined sub type: " + subType );
    }
};


/**
 * @param {string} sub
 * @param {Object} obj
 * @param {Boolean} top is top level of subs
 */
function parseObjectSub( que, sub, top )
{
    sub = trimBracket( sub );
    return makeObject( que, sub, top );
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
 * @param {boolean} top
 */
function makeObject( que, sub, top )
{
    return parseSubs( que, sub, true, top )
}



/**
 * @param {Array<string>} choices
 * @param {Object} obj
 * @param {string} name
 * @returns {}
 */
function makeChoice( que, choices )
{
    var choice = Math.floor( Math.random() * choices.length );
    return parseSubs( que, choices[choice], false );
}






function makeRange( num )
{
    var rand = Math.floor( Math.random() * num );
    return rand;
}






function makeSubstitution( sub )
{
    var path = flatDict[sub];
    var isUnit = false;

    if ( typeof path === "undefined" )
    {
        return "null";
    }

    var choices = digArray( dict.dictionary, path );
    var rand = Math.floor( Math.random() * choices.length );

    return choices[rand];
}

function digArray( wordsC, path )
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



router.get( '/flattenDictionary', function ( req, res )
{
    var body = 'module.exports =';
    var dictionary = require( './gen/dictionary' );
    
    body += JSON.stringify( dictionary.flattenDict() );
    body += ';'

    filePath = __dirname + '/gen/dictionaryIndex.js';

    fs.writeFileSync( filePath, body );
    
    res.end();
});


/* GET home page. */
router.get( '/:chapter', function ( req, res, next )
{
    dict.flattenDict();
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
