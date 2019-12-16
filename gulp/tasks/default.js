/*----------------------------------------------------------------------------*
	$DEFAULT
	Ejecutar y vigilar cambios en las tareas para volver a compilar
*----------------------------------------------------------------------------*/

// Plugins base
var gulp        = require('gulp'),
	config      = require('../config');


// Vigilar cambios sobre las tareas
gulp.task('watch', function(){

	gulp.watch( config.paths.tpl.all, ['jade'] );
	gulp.watch( config.paths.css.all, ['styles'] );
	gulp.watch( config.paths.js.all, ['scripts'] );
	gulp.watch( config.paths.img.all, ['images'] );

});


// Ejecutar tareas
gulp.task('build', ['jade', 'styles', 'scripts', 'images']);


// Tareas que se ejecutan por defecto al iniciar
gulp.task('default', ['build', 'watch'], function(){

	// Servidor http
	config.plugins.browserSync.init({
		server: config.dist,
		// proxy: 'localhost:8888',
		open: false,
		notify: false
    });

});
