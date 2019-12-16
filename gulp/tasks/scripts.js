/*----------------------------------------------------------------------------*
	$SCRIPTS
	Todas las tareas relacionadas con JavaScript
*----------------------------------------------------------------------------*/

// Plugins base
var gulp       = require('gulp'),
	config     = require('../config'),
	plumber    = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	deleted    = require('gulp-deleted'),
	notify     = require('gulp-notify');

// Plugins para optimizar javascript
var include    = require('gulp-include'),
	uglify     = require('gulp-uglify');



gulp.task('scripts', ['delete-scripts'], function(){

	return gulp.src( config.paths.js.src )

		.pipe( plumber() )

		.pipe( sourcemaps.init() )

		.pipe( include() )

		.pipe(config.ambiente.prod( uglify() ))

		.pipe(config.ambiente.prod( config.plugins.cachebust.resources() ))

		.pipe( config.plugins.header.header(config.plugins.header.fs.readFileSync( config.src + '/copyright.txt', 'utf8'), { pkg : config.plugins.header.pkg, year: config.plugins.header.ano }) )

		.pipe(config.ambiente.dev( sourcemaps.write(".") ))

		.pipe(gulp.dest( config.paths.js.dist ))

		.pipe(config.ambiente.dev( config.plugins.browserSync.stream() ))

		.pipe( notify('JS compilado: <%= file.relative %>') )

		.on('end', function(){
			config.ambiente.prod() ? gulp.start('jade') : ''
		})

});


gulp.task('delete-scripts', function(){

	return gulp.src( config.paths.js.src, {read: false} )

		.pipe( deleted(
			config.paths.js.dist,
			[
				'**/*'
			]
		))

});
