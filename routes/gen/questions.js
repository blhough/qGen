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
					return dist;
				},
				attr: [
					{ label: 'Distance', unit: 'm' }
				],
				tolerance: [
					{ delta: .1, percent: .5 }, // +/- , +/-%
				],
				chapter: 'Kinematics'
			},



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
					{ delta: .01, percent: .5 }, // +/- , +/-%
					{ delta: .01, percent: .5 } // +/- , +/-%
				],
				chapter: 'Kinematics'
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
					{ delta: .01, percent: .5 } // +/- , +/-%
				],
				chapter: '2D-Kinematics'
			}
		]
	};