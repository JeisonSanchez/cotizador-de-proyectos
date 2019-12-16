/*----------------------------------------------------------------------------*
	$HTACCESS
	Generar un archivo .htaccess con la configuración recomendada para
	mejorar el rendimiento del sitio Web
*----------------------------------------------------------------------------*/

// Plugins base
var gulp     = require('gulp'),
	config   = require('../config'),
	notify   = require('gulp-notify');



gulp.task('htaccess', function(){

	/**
	 * .htaccess contiene configuraciones del servidor Apache
	 */
	gulp.src( config.src + '/.htaccess' )
		.pipe(gulp.dest( config.dist ))

		.pipe( notify('Archivo .htaccess generado en /dist') )

	/*
	 *	Con este archivo luego se podrá cambiar el estado a mantenimiento
	 *	del sitio completo. Revisar instrucciones en el archivo .htaccess
	 *	en la sección PÁGINA EN MANTENIMIENTO
	 */
	gulp.src( config.src + '/mantenimiento.desactivar' )
		.pipe(gulp.dest( config.dist ))


	/**
	 * humans.txt ==
	 * Contiene la información sobre las personas que han intervenido en
	 * el desarrollo de la Web
	 */
	gulp.src( config.src + '/humans.txt' )
		.pipe(gulp.dest( config.dist ))

		.pipe( notify('Archivo .htaccess generado en /dist') )


});
