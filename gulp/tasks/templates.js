/*----------------------------------------------------------------------------*
	$TEMPLATES
	Todas las tareas relacionadas con HTML
*----------------------------------------------------------------------------*/

// Plugins base
var gulp           = require('gulp'),
	config         = require('../config'),
	plumber        = require('gulp-plumber'),
	collate        = require('gulp-collate'),
	deleted        = require('gulp-deleted'),
	changed        = require('gulp-changed'),
	notify         = require('gulp-notify');

// Plugins para templates
var pug            = require('gulp-pug'),
	prettify       = require('gulp-html-prettify'),
	pugInheritance = require('gulp-pug-inheritance');



gulp.task('jade', function(){

	return gulp.src( config.paths.tpl.src )

		.pipe( plumber() )

		.pipe( pug() )

		.pipe(prettify({
			indent_size: 4
			// indent_inner_html: true
		}))

		.pipe( config.plugins.cachebust.references() )

		.pipe( collate( config.src + '/tpl' ) )
		.pipe( deleted(
			config.dist,
			[
				'**/*.{htm,html,tpl,jade,pug}'
			]
		))
		//.pipe( changed( config.dist ) )

		.pipe(gulp.dest( config.dist ))

		.pipe( notify('Jade compilado: <%= file.relative %>') )

		.on('end', function(){
			config.plugins.browserSync.reload()
		})

});
