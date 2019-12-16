/*----------------------------------------------------------------------------*
	$FORMULARIOS
*----------------------------------------------------------------------------*/


/* ^Fixed al hacer scroll
-----------------------------------------------------------------------------*/


	function pedidoFixed(){
		var stickWidth = 991;
		var win = $(window);
		var menu = $(".js-pedido");
		var options = {
			offset_top: 30
		};

		if (win.width() > stickWidth) {
			menu.stick_in_parent(options);
		}

		win.resize(function () {

			if (win.width() > stickWidth) {
				menu.stick_in_parent(options);
			} else {
			    menu.trigger("sticky_kit:detach");
			}

		});
	}


/* ^Fin - Fixed al hacer scroll
-----------------------------------------------------------------------------*/




/* ^Vue.js
-----------------------------------------------------------------------------*/

	// numeral.min.js - convertir numero a moneda
	numeral.register('locale', 'es', {
		delimiters: {
			million: ",",
			thousands: '.',
			decimal: ','
		},
		abbreviations: {
			thousand: 'k',
			million: 'mm',
			billion: 'b',
			trillion: 't'
		},
		ordinal: function (number) {
			var b = number % 10;
			return (b === 1 || b === 3) ? 'er' :
				(b === 2) ? 'do' :
				(b === 7 || b === 0) ? 'mo' :
		(b === 8) ? 'vo' :
		(b === 9) ? 'no' : 'to';
		},
		currency: {
			symbol: '$'
		}
	});
	numeral.locale('es');

	var precio_anterior;

	var i_gastos = true;
	var i_sueldo = true;

	var vm = new Vue({
		el: '#app',
		data: {
			sueldo: 2500000,
			sueldo_paralelo: 2500000,
			horas_dia: 8,
			gastos_mes: 500000,
			gastos_mes_paralelo: 500000,
			actividad: '',
			horas: 1,
			costo_total: 0,
			dias: [
				{
					dia: 'Lunes',
					activo: true
				},
				{
					dia: 'Martes',
					activo: true
				},
				{
					dia: 'Miércoles',
					activo: true
				},
				{
					dia: 'Jueves',
					activo: true
				},
				{
					dia: 'Viernes',
					activo: true
				},
				{
					dia: 'Sábado',
					activo: false
				},
				{
					dia: 'Domingo',
					activo: false
				},
			],
			actividades: []

		},
		mounted: function(){

			pedidoFixed();

			var sueldo = new Slider('#sueldo', {
				formatter: function(value) {
					return 'Sueldo: ' +  numeral(value).format('$0,0');
				}
			});

			sueldo.on("slide", function(sliderValue) {
				vm.sueldo_paralelo = sliderValue;

				if(i_sueldo){
					i_sueldo = false;
					setTimeout(function(){

						setTimeout(function(){
							// console.log('movido: ' +  sueldo.getValue());
							vm.sueldo = sueldo.getValue();
							i_sueldo = true;
						},200);

					}, 100);
				}

			});


			var gastos = new Slider('#gastos', {
				formatter: function(value) {
					return 'Sueldo: ' +  numeral(value).format('$0,0');
				}
			});

			gastos.on("slide", function(sliderValue) {
				vm.gastos_mes_paralelo = sliderValue;

				if(i_gastos){
					i_gastos = false,
					setTimeout(function(){

						setTimeout(function(){
							// console.log('movido: ' +  gastos.getValue());
							vm.gastos_mes = gastos.getValue();
							i_gastos = true;
						},200);

					}, 100);
				}

			});

		},
		beforeUpdate: function(){

			if(precio_anterior != this.costo_total) {
				precio_anterior = $("#costoTotal").attr("data-valor");
			}

		},
		updated: function() {

			if(precio_anterior != this.costo_total) {

				$('#costoTotal')
					.prop('number', precio_anterior)
					.animateNumber({
						number: this.costo_total,
						numberStep: function(now, tween){
								target = $(tween.elem);
								valor = numeral(now).format('$0,0');
								target.text(valor);
						}
					});


			}

			this.costoProyecto;

		},
		computed: {
			diasSeleccinados: function() {
				return this.dias.filter(function(item){
					return item.activo;
				});
			},
			costoHora: function() {
				var dias = Object.keys(this.diasSeleccinados).length,
					dias = dias * 4;

				return ((this.sueldo + this.gastos_mes) / dias) / this.horas_dia;
			},
			costoProyecto: function() {
				var costoTotal = 0;

				this.activities.forEach(function(actividad){
					costoTotal += actividad.precio;
				});

				this.costo_total = costoTotal;

				// return costoTotal;
			},
			activities: function() {
				var actividades = this.actividades;

				var $this = this;

				actividades.forEach(function(actividad, index){
					actividad.precio = $this.costoHora * actividad.horas;
				});

				return actividades;
			}
		},
		methods: {
			agregarActividad: function() {
				this.actividades.push({
					nombre: this.actividad,
					horas: this.horas
				});

				this.actividad = '';
				this.horas = 1;

				setTimeout(function(){
					document.getElementById("agregarActividad").focus();
				}, 20);

			},
			borrarActividad: function(index, e) {
				e.preventDefault();
				this.actividades.splice(index, 1);
			}
		},
		filters: {
			money: function(value) {
				return  numeral(value).format('$0,0');
			}
		}
	});



/* ^Fin - Vue.js
-----------------------------------------------------------------------------*/
