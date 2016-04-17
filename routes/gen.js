var express = require( 'express' );
var router = express.Router();
//var gen = require('/helpers/generator');

var title = "Generate";

var question = {
    "template": "A {object1|{[water_vehicle,'ball'],temp:{num:[[a66,bb3,345],[200,22,2323],343],unit:mass}}} is traveling {direction1|[cardinal_direction,ordinal_direction]} at {velocity|(1,[20,40,30,10]),unit:velocity}. A sudden gust of wind gives the {object1} an acceleration of {acceleration|( .2, 2 ),unit:acceleration}, {direction2|(0,360):units:degree} north of east. What is the {object1}'s velocity {time|(2,30),unit:second} when the wind stops?",
    "text": "",
    "subs": {},
    "seed": 20045,
    "answer": 0
};

/**
 * @param {Object} subs substitutes stored in the question
 * @param {string} template  question template text
 */
function extractSubs( subs, template )
{
    var subName_reg = /\{([^\{\}\(\)\[\]\,\:\<\>\']+?)(\|(.+)|)\}/
    var subName = "";
    var depth = 0; // "{" increase depth
    var subComplete = false;
    var char = "";
    var startIndex = 0;

    for ( var index = 0; index < template.length; index++ )
    {
        char = template.charAt( index );

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

        if ( depth == 0 && subComplete == true )
        {
            var subText = subName_reg.exec( template.substring( startIndex, index + 1 ) );
            subName = subText[1];

            if ( typeof subText[3] !== "undefined" && typeof subs[subName] === "undefined" )
            {
                subs[subName] = parseObjectSub( "{" + subText[3] + "}" );
            }
            else if ( typeof subText[3] === "undefined" && typeof subs[subName] !== "undefined" )
            {
                continue;
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

    return subs;
};


/**
 * @param {string} sub
 * @param {Object} obj
 * @param {string} name
 * @param {boolean} objectType
 */
function parseSubs( sub, objectType )
{
    var subArray = commaSplit( sub );
    var obj = {}

    for ( var i = 0; i < subArray.length; i++ )
    {
        if ( objectType )
        {
            var extraction = extractVarName( subArray[i] );
            var subType = parseSubType( extraction.sub );

            obj[extraction.varName] = redirectSubType( subType, extraction.sub );
        }
        else
        {
            obj = redirectSubType( parseSubType( sub ), sub );
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
function redirectSubType( subType, sub )
{
    console.log( "sub Type: " + subType + " : " + sub );

    switch ( subType )
    {
        case "{": // object
            return parseObjectSub( sub );
        case "[": //choose
            return parseChooseSub( sub );
        case "<": //tbd

            break;
        case "(": //range
            return parseRangeSub( sub );
        case "'": //literal
            return parseLiteralSub( sub );
        case "": //substitue
            return "subbed - " + sub;
        default:
            console.error( "undefined sub type: " + subType );
    }
};


/**
 * @param {string} sub
 * @param {Object} obj
 * @param {string} name
 */
function parseObjectSub( sub )
{
    sub = trimBracket( sub );
    return makeObject( sub );
};


/**
 * @param {string} sub
 * @param {Object} obj
 * @param {string} name 
 */
function parseChooseSub( sub )
{
    sub = trimBracket( sub );

    var choices = commaSplit( sub );
    return makeChoice( choices );
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

};


/**
 * @param {string} sub
 * @param {Object} obj
 */
function makeObject( sub )
{
    return parseSubs( sub, true )
}



/**
 * @param {Array<string>} choices
 * @param {Object} obj
 * @param {string} name
 * @returns {}
 */
function makeChoice( choices )
{
    var choice = Math.floor( Math.random() * choices.length );
    return parseSubs( choices[choice], false );
}





/**
 * @param {Object} obj
 * @param {string} name
 */
function makeRange( num )
{
    var rand = Math.floor( Math.random() * num );
    return parseSubs( rand, false );
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
    console.log( extractSubs( question.subs, question.template ) );
    // console.log(subs);
    res.render( 'generator', { title: title });
    console.log( req.params.category + ' ' + req.params.type );
});

/* GET home page. */
router.get( '/:chapter', function ( req, res, next )
{
    res.render( 'generator', { title: title });
    console.log( req.params.category );
});


/* GET home page. */
router.get( '/', function ( req, res, next )
{
    res.render( 'generator', { title: title });
});

module.exports = router;
