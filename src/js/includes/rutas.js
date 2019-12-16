/*----------------------------------------------------------------------------*
	$RUTAS
*----------------------------------------------------------------------------*/


var rutas = $.sammy(function(){


	// this.get(':lang/#/eventos/:date',function(){
	//
	// 	js_eventos(this.params['date'], this.params['lang']);
	// 	// console.log(this.params['date']);
	//
	// });

	this.notFound = function(){};

});

rutas.run();
