
module.exports =
	{
		g: 9.80665,
		
		directionToRadian: function ( dir ) 
		{
			dir = dir.trim();
			dir = dir.toLowerCase();

			switch ( dir )
			{
				case 'east':
				case 'e':
					return 0;
				case 'north':
				case 'n':
					return Math.PI / 2;
				case 'west':
				case 'w':
					return Math.PI;
				case 'south':
				case 's':
					return 3 * Math.PI / 2;
				default:
					return 0;
			}
		}
	};