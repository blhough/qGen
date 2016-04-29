
module.exports =
[


    // CHAPTER 1 /////////////////////////////////////////////////
    [

    ],




    // CHAPTER 2 /////////////////////////////////////////////////
    [
        // test template 1
        {
            template: "A {object1|[water_vehicle,ball]} is traveling {direction1|'north'} at {!velocity|(1,[20,40,30,10]),unit:velocity}. A sudden gust of wind gives the {object1} an acceleration of {!acceleration|( .2, 2 ),unit:acceleration}, {!direction2|(0,360),units:degree} north of east. What is the {object1}'s velocity after {!time|(2,30),unit:second} when the wind stops?",
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
            tolerance: [
                { delta: .01, percent: .5 }, // +/- , +/-%
                { delta: .01, percent: .5 } // +/- , +/-%
            ],
            chapter: 2
        },



        // test template 2
        {
            template: "A {object1|[water_vehicle,ball]} is traveling {direction1|'north'} at {!velocity|(1,[20,40,30,10]),unit:velocity}. A sudden gust of wind gives the {object1} an acceleration of {!acceleration|( .2, 2 ),unit:acceleration}, {!direction2|(0,360),units:degree} north of east. What is the {object1}'s speed after {!time|(2,30),unit:second} when the wind stops?",
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
            tolerance: [
                { delta: .01, percent: .5 } // +/- , +/-%
            ],
            chapter: 2
        }
    ]
];