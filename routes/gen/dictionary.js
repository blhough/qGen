
function flattenDict( dict, words, path )
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
				flattenDict( dict, words[key], arr );
			}
		}
	}
	else
	{
		dict[path[path.length - 1]] = path;
	}
}

var dict =
{
	"noun":
	{
		"ball":
		[
			"tennis ball",
			"baseball",
			"basketball",
			"soccer ball",
			"golf ball",
			"wiffle ball",
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
		"second":
		[
			"s"
		],

		"degree":
		[
			"°"
		],

		"velocity":
		[
			"m/s"
		],

		"acceleration":
		[
			"m/s^2"
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

module.exports = 
{
	flattenDict: function ()
	{
		flatDict = {};
		flattenDict( flatDict, dict, [] );
		return flatDict;
	},
	dictionary: dict
}
