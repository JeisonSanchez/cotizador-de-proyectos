/*----------------------------------------------------------------------------*
	$CALENDARIOS.js
*----------------------------------------------------------------------------*/


/* ^Calendario Home
-----------------------------------------------------------------------------*/

$('#calendarHome').jalendar({
	type: 'selector',
	color: 'rgba(255,201,107,.8)',
	color2: 'rgba(255,201,107,0)',
	lang: 'ES',
	weekColor: '#fff',
	// todayColor: '#fff',
	dateType: 'yyyy-mm-dd',
	done: function() {

		var fecha = $('#calendarHome input.data1').val();

		var idioma = $('#calendarHome').attr('data-idioma');

		// alert(fecha);


		js_eventos(fecha, idioma);

	}
});

/* ^Fin - Calendario Home
-----------------------------------------------------------------------------*/





/* ^Calendario Page
-----------------------------------------------------------------------------*/

$('#calendarPage').jalendar({
	type: 'selector',
	color: '#f0f0f0',
	color2: '#dbd9d9',
	// color: '#ffab5e',
	// color2: '#e74853',
	// color2: 'rgba(255,201,107,0)',
	lang: 'ES',
	titleColor: '#2f3336',
	weekColor: '#e74853',
	todayColor: '#d21f07',
	dateType: 'yyyy-mm-dd',
	done: function() {

		var fecha = $('#calendarPage input.data1').val();

		var idioma = $('#calendarPage').attr('data-idioma');
		var pagina = $('#calendarPage').attr('data-slug');

		// alert(fecha);

		js_eventos_page(fecha, idioma, pagina);

	}
});

/* ^Fin - Calendario Page
-----------------------------------------------------------------------------*/






/* ^Cargar eventos de acuerdo a la fecha seleccionada
-----------------------------------------------------------------------------*/

	// Funcion para cargar eventos en popup
	function js_eventos(fecha, idioma){


		$('html').css({
			'overflow':'hidden',
			'margin-right': scrollbarSize
		});

		$('header').css('padding-right',scrollbarSize);

		$('.js-menu-mobile-overlay').fadeIn(200);

		// Mostrar cargador
		$('.js-loader').fadeIn(400);

		// Se carga el evento
		$('.js-load-events').load('/php/calendario/eventos.php?mes=' + fecha + '&lang=' + idioma, function(){
			// Ocultar cargador
			$('.js-loader').fadeOut(400);
			$('.js-calendario').addClass('is-visible');
		});

		// $('.js-loader').fadeOut(400);
		// $('.js-calendario').addClass('is-visible');

		rutas.setLocation('/'+ idioma +'/#/eventos/' + fecha);

	}

	// Funcion para cargar eventos en la pagina de calendario
	function js_eventos_page(fecha, idioma, pagina){


		// Mostrar cargador
		$('.js-menu-mobile-overlay').fadeIn(200);
		$('.js-loader').fadeIn(400);

		// Se carga el evento
		$('.js-load-events-page').load('/php/calendario/eventos-page.php?mes=' + fecha + '&lang=' + idioma, function(){

			setTimeout(function(){
				// Ocultar cargador
				$('.js-menu-mobile-overlay').fadeOut(200);
				$('.js-loader').fadeOut(400);
			},200);

		});

		rutas.setLocation('/'+ idioma + '/'+ pagina +'/' + fecha + '/');

	}

	// Cerrar el popup
	$('.js-menu-mobile-overlay').on('click', function(){

		$('html').css({
			'overflow':'',
			'margin-right': ''
		});

		$('header').css('padding-right','');

		$('.js-calendario').removeClass('is-visible');

		$('.js-menu-mobile-overlay').fadeOut(200);

		// rutas.setLocation('');
	});

	// Cerrar el popup Calendario
	$('.js-calendario-close').on('click', function(){

		var idioma_close = $('#calendarHome').attr('data-idioma');

		$('html').css({
			'overflow':'',
			'margin-right': ''
		});

		$('header').css('padding-right','');

		$('.js-calendario').removeClass('is-visible');

		$('.js-menu-mobile-overlay').fadeOut(200);

		rutas.setLocation('/' + idioma_close + '/');
	});

/* ^Fin - Cargar eventos de acuerdo a la fecha seleccionada
-----------------------------------------------------------------------------*/





/* ^Calendario formulario
-----------------------------------------------------------------------------*/

	// Comprobar si esta definido el calendario para no mostrar error
	if( typeof dhtmlXCalendarObject !== 'undefined' && jQuery.isFunction( dhtmlXCalendarObject ) ) {

		var myCalendar1,
			myCalendar2;

		// Campo Día inicio
		myCalendar1 = new dhtmlXCalendarObject(["calendar_input1"]);
		myCalendar1_2 = new dhtmlXCalendarObject({
			input: "calendar_input1",
			button: "calendar_icon1"
		});
		myCalendar1.hideTime();
		myCalendar1_2.hideTime();


		// Campo Día cierre
		myCalendar2 = new dhtmlXCalendarObject(["calendar_input2"]);
		myCalendar2_2 = new dhtmlXCalendarObject({
			input: "calendar_input2",
			button: "calendar_icon2"
		});
		myCalendar2.hideTime();
		myCalendar2_2.hideTime();

	}



/* ^Fin - Calendario formulario
-----------------------------------------------------------------------------*/
