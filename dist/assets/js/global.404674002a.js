/**
 *
 * @author      Jeison Sanchez <jeison@nigma.co>
 * @website     http://www.nigma.co
 * @copyright   2019 Jeison Sanchez
 *
 * @frontend-framework
 * Name        : Nigma Framework
 * Description : Código pre-horneado listo para mezclar, probar y disfrutar! ♥
 * Version     : 3.0.0
 * Author      : Jeison Sanchez <jeison@nigma.co>
 * Website     : http://www.nigma.co
 * License     : MIT
 *
 */
$(function(){function t(){var t=$(window),o=$(".js-pedido"),i={offset_top:30};t.width()>991&&o.stick_in_parent(i),t.resize(function(){t.width()>991?o.stick_in_parent(i):o.trigger("sticky_kit:detach")})}numeral.register("locale","es",{delimiters:{million:",",thousands:".",decimal:","},abbreviations:{thousand:"k",million:"mm",billion:"b",trillion:"t"},ordinal:function(t){var o=t%10;return 1===o||3===o?"er":2===o?"do":7===o||0===o?"mo":8===o?"vo":9===o?"no":"to"},currency:{symbol:"$"}}),numeral.locale("es");var o,i=!0,e=!0,a=new Vue({el:"#app",data:{sueldo:25e5,sueldo_paralelo:25e5,horas_dia:8,gastos_mes:5e5,gastos_mes_paralelo:5e5,actividad:"",horas:1,costo_total:0,dias:[{dia:"Lunes",activo:!0},{dia:"Martes",activo:!0},{dia:"Miércoles",activo:!0},{dia:"Jueves",activo:!0},{dia:"Viernes",activo:!0},{dia:"Sábado",activo:!1},{dia:"Domingo",activo:!1}],actividades:[]},mounted:function(){t();var o=new Slider("#sueldo",{formatter:function(t){return"Sueldo: "+numeral(t).format("$0,0")}});o.on("slide",function(t){a.sueldo_paralelo=t,e&&(e=!1,setTimeout(function(){setTimeout(function(){a.sueldo=o.getValue(),e=!0},200)},100))});var s=new Slider("#gastos",{formatter:function(t){return"Gastos: "+numeral(t).format("$0,0")}});s.on("slide",function(t){a.gastos_mes_paralelo=t,i&&(i=!1,setTimeout(function(){setTimeout(function(){a.gastos_mes=s.getValue(),i=!0},200)},100))})},beforeUpdate:function(){o!=this.costo_total&&(o=$("#costoTotal").attr("data-valor"))},updated:function(){o!=this.costo_total&&$("#costoTotal").prop("number",o).animateNumber({number:this.costo_total,numberStep:function(t,o){target=$(o.elem),valor=numeral(t).format("$0,0"),target.text(valor)}}),this.costoProyecto},computed:{diasSeleccinados:function(){return this.dias.filter(function(t){return t.activo})},costoHora:function(){var t=Object.keys(this.diasSeleccinados).length,t=4*t;return(this.sueldo+this.gastos_mes)/t/this.horas_dia},costoProyecto:function(){var t=0;this.activities.forEach(function(o){t+=o.precio}),this.costo_total=t},activities:function(){var t=this.actividades,o=this;return t.forEach(function(t,i){t.precio=o.costoHora*t.horas}),t}},methods:{agregarActividad:function(){this.actividades.push({nombre:this.actividad,horas:this.horas}),this.actividad="",this.horas=1,setTimeout(function(){document.getElementById("agregarActividad").focus()},20)},borrarActividad:function(t,o){o.preventDefault(),this.actividades.splice(t,1)}},filters:{money:function(t){return numeral(t).format("$0,0")}}})});