
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

			"container":
			[
				"container",
				"package",
				"crate",
				"bag"
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
				],

				"air_vehicle":
				{
					"airplane":
					[
						"plane",
						"airplane",
						"cargo plane"
					]
				}
			},

			"country":
			[
				'Afghanistan',
				'Albania',
				'Algeria',
				'Antarctica',
				'Argentina',
				'Australia',
				'Austria',
				'Bahamas',
				'Bangladesh',
				'Barbados',
				'Belarus',
				'Belgium',
				'Bermuda',
				'Bolivia',
				'Brazil',
				'Bulgaria',
				'Burundi',
				'Cambodia',
				'Cameroon',
				'Canada',
				'Chad',
				'Chile',
				'China',
				'Colombia',
				'Congo',
				'Costa Rica',
				'Cuba',
				'Czech Republic',
				'Denmark',
				'Ecuador',
				'Egypt',
				'Eritrea',
				'Estonia',
				'Fiji',
				'Finland',
				'Georgia',
				'Germany',
				'Greenland', ,
				'Guatemala',
				'Hungary',
				'Iceland',
				'India',
				'Indonesia',
				'Italy',
				'Madagascar',
				'Mexico',
				'Mongolia',
				'Morocco',
				'Nepal',
				'New Zealand',
				'Nicaragua',
				'Paraguay',
				'Peru',
				'Philippines',
				'Poland',
				'Portugal',
				'Puerto Rico',
				'Saudi Arabia',
				'Singapore',
				'Slovakia',
				'South Africa',
				'Spain',
				'Sudan',
				'Suriname',
				'Swaziland',
				'Sweden',
				'Switzerland',
				'Thailand',
				'Tunisia',
				'Turkey',
				'Tuvalu',
				'Uganda',
				'Ukraine',
				'Uruguay',
				'Uzbekistan',
				'Vanuatu',
				'Venezuela'
			]
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

			"distance":
			[
				"m"
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
