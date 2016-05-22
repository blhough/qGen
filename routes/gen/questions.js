var cnv = require( './conversions' );

module.exports =
	{


		// CHAPTER 1 /////////////////////////////////////////////////
		'one': [

		],



		// CHAPTER 2 /////////////////////////////////////////////////
		'two': [

		],




		// CHAPTER 3 /////////////////////////////////////////////////
		'three': [

		],



		// CHAPTER 4 /////////////////////////////////////////////////
		'kinematics': [

			// section 4.2, #6 pg 110
			/*
			A sailboat is travieling east at 5.0 m/s. A sudden gust of wind gives the boat an acceleration a = (0.80 m/s^2, 40degree north of east). What are the boat's speed and direction 6.0s later when the gust subsides?
			*/
			{
				template: "A {object1|[water_vehicle,ball]} is traveling {!dir1|cardinal_direction} at {!vel|( 1, 10, 1),unit:velocity}. A sudden gust of wind gives the {object1} an acceleration of {!acc|( .2, 2, .1 ),unit:acceleration} at {!dir2|(0,360),unit:degree} north of east. What is the {object1}'s velocity after {!time|(5,30),unit:second} when the wind stops?",
				formula: function ()
				{
					var q = this.subs;
					var dir1 = cnv.directionToRadian( q.dir1.value );

					var vx = q.acc.value * q.time.value * Math.cos( Math.radians( q.dir2.value ) ) + q.vel.value * Math.cos( dir1 );
					var vy = q.acc.value * q.time.value * Math.sin( Math.radians( q.dir2.value ) ) + q.vel.value * Math.sin( dir1 );

					return [vx, vy];
				},
				attr: [
					{ label: 'Vx', unit: 'm/s' },
					{ label: 'Vy', unit: 'm/s' }
				],
				tolerance: [
					{ delta: .8, percent: 1 }, // +/- , +/-%
					{ delta: .8, percent: 1 } // +/- , +/-%
				],
				subsection: 'Kinematics'
			},



			// section 4.2, #6 pg 110
			/*
			A sailboat is travieling east at 5.0 m/s. A sudden gust of wind gives the boat an acceleration a = (0.80 m/s^2, 40degree north of east). What are the boat's speed and direction 6.0s later when the gust subsides?
			*/
			{
				template: "A {object1|[water_vehicle,ball]} is traveling {!dir1|cardinal_direction} at {!vel| ( 2.5, 10, .1 ),unit:velocity}. A sudden gust of wind gives the {object1} an acceleration of {!acc|( .2, 2, .1 ),unit:acceleration} at {!dir2|(0,360,5),unit:degree} north of east. What is the {object1}'s speed after {!time|(2,30),unit:second} when the wind stops?",
				formula: function ()
				{
					var q = this.subs;
					var dir1 = cnv.directionToRadian( q.dir1.value );

					var vx = q.acc.value * q.time.value * Math.cos( Math.radians( q.dir2.value ) ) + q.vel.value * Math.cos( dir1 );
					var vy = q.acc.value * q.time.value * Math.sin( Math.radians( q.dir2.value ) ) + q.vel.value * Math.sin( dir1 );
					var speed = Math.sqrt( vx * vx + vy * vy );

					return [speed];
				},
				attr: [
					{ label: 'speed', unit: 'm/s' }
				],
				tolerance: [
					{ delta: .8, percent: 1 } // +/- , +/-%
				],
				subsection: '2D-Kinematics'
			},


			// section 4.2, #7 pg 110
			/*
			A model rocket is launched from rest with an upward acceleration of 6.00 m/s^2 and, due to a strong wind, a horizontal acceleration of 1.50 m/s^2. How far is the rocket from the launch pad 6.00s later when the rocket engine runs out of fuel? 
			*/
			{
				template: "A {object|['model','toy','small']} rocket is launched from rest with an upward acceleration of {!acc1|(2,10,.5),unit:acceleration} and, due to a strong wind, a horizontal acceleration of {!acc2|(.5,3,.1),unit:acceleration}. How far is the rocket from the launch pad {!time|(2,17,1),unit:second} later when the rocket engine {a|['runs out of fuel','stops']}?",
				formula: function ()
				{
					var q = this.subs;
					var px = .5 * q.acc1.value * Math.pow( q.time.value, 2 );
					var py = .5 * q.acc2.value * Math.pow( q.time.value, 2 );
					var dist = Math.sqrt( px * px + py * py );
					return [dist];
				},
				attr: [
					{ label: 'Distance', unit: 'm' }
				],
				tolerance: [
					{ delta: 1, percent: 1 }, // +/- , +/-%
				],
				subsection: 'Kinematics'
			},

			// section 4.3, #12 pg 111
			/*
			A ball thrown horizontally at 25m/s travels a horizontal distance of 50m before hitting the ground. From what height was the ball thrown?
			*/
			{
				template: "A {obj|ball} thrown horizontally at {!vel|(10,40),unit:velocity} travels a horizontal distance of {!dist|(10,100,5),unit:distance} before hitting the ground. From what initial height was the ball thrown?",
				formula: function ()
				{
					var q = this.subs;
					var t = q.dist.value / q.vel.value;
					var height = 0.5 * cnv.g * t * t;

					return [height];
				},
				attr: [
					{ label: 'Height', unit: 'm' }
				],
				tolerance: [
					{ delta: .8, percent: 1 }, // +/- , +/-%
				],
				subsection: 'Projectile Motion'
			},


			// section 4.3, #14 pg 111
			/*
			A supply plane needs to drop a package of food to scientists working on a glacier in Greenland. The plane flies 100m above the glacier at a speed of 150m/s. How far short of the target should it drop the package?
			*/
			{
				template: "A {obj1|airplane} needs to drop a {obj2|container} of {obj3|['food','supplies']} to {a|['geologists','scientists']} working in a remote part of {obj4|country}. The plane flies {!dist1|(80,300,10),unit:distance} above the ground at a speed of {!vel1|(150,250,5),unit:velocity}. How far short of the target should it release the {obj2}?",
				formula: function ()
				{
					var q = this.subs;
					var t = Math.sqrt( 2 * q.dist1.value / cnv.g );
					var px = q.vel1.value * t;

					return [px];
				},
				attr: [
					{ label: 'Distance', unit: 'm' }
				],
				tolerance: [
					{ delta: 5, percent: .3 }, // +/- , +/-%
				],
				subsection: 'Projectile Motion'
			},

		],

		'equilibriums': [

			// section 6.1, #5 pg 161
			/*
			A construction worker with a weight of 850N stands on a roof that is sloped at 20degree. What is the magnitude of the normal force of the roof on the worker?
			*/
			{
				template: "A {obj1|['person','hiker','mountain climber','woman','man']} with a weight of {!force|(650,1000,5),unit:force} stands on a slope of {!slope|(10,40),unit:degree}. What is the magnitude of the normal force of the sloped ground on the {obj1}?",
				formula: function ()
				{
					var q = this.subs;

					var N = Math.cos( Math.radians( q.slope.value ) ) * q.force.value;

					return [N];
				},
				attr: [
					{ label: 'Force', unit: 'N' }
				],
				tolerance: [
					{ delta: 3, percent: .3 }, // +/- , +/-%
				],
				subsection: 'Projectile Motion'
			},

			// section 6.1, #3 pg 161
			/*
			A 20kg loudspeaker is suspended 2.0m below the ceiling by two 3.0m long cables that angle outward at equal angles. What is the tensions in the cables?
			*/
			{
				template: "A {!mass|(4,25),unit:mass} {obj1|['loudspeaker','birdcage','potted plant','lamp']} is suspended {!dist1|(.5,2,.1),unit:distance} below the ceiling by two {!dist2|(2.2,4,.2),unit:distance} long cables that angle outward at equal angles. What is the tensions in the cables?",
				formula: function ()
				{
					var q = this.subs;

					var F = 0.5 * q.mass.value * cnv.g * q.dist2.value / q.dist1.value;

					return [F];
				},
				attr: [
					{ label: 'Force', unit: 'N' }
				],
				tolerance: [
					{ delta: 3, percent: .3 }, // +/- , +/-%
				],
				subsection: 'Projectile Motion'
			},


			// section 6.1, #4 pg 161
			/*
			A football coach sits on a sled while two of his players build their strength by dragging the sled across the field with ropes. The friction force on the sled is 1000N and the angle between the two ropes is 20degrees. How hard must each player pull to drag the coach a steady 2.0m/s?
			*/
			{
				template: "A football coach sits on a sled while two of his players build their strength by dragging the sled across the field with ropes. The sled weighs {!mass|(60,140),unit:mass} and has a coefficient of friction of {!fric|(.2,.8,.05)}. The angle between the two ropes is {!ang|(5,35),unit:degree}. How hard must each player pull to drag the coach a steady {!vel|(1,3,.1),unit:velocity}?",
				formula: function ()
				{
					var q = this.subs;

					var F = q.mass.value * cnv.g * q.fric.value / ( 2 * Math.cos( Math.radians( q.ang.value / 2 ) ) );

					return [F];
				},
				attr: [
					{ label: 'Force', unit: 'N' }
				],
				tolerance: [
					{ delta: 2, percent: .3 }, // +/- , +/-%
				],
				subsection: 'Projectile Motion'
			},
		],
	};