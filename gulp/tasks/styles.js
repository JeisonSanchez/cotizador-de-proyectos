/*----------------------------------------------------------------------------*
	$STYLES
	Todas las tareas relacionadas con CSS
*----------------------------------------------------------------------------*/

// Plugins base
var gulp          = require('gulp'),
	config        = require('../config'),
	plumber       = require('gulp-plumber'),
	sourcemaps 	  = require('gulp-sourcemaps'),
	deleted       = require('gulp-deleted'),
	notify        = require('gulp-notify');

// Plugins para styles
var stylus        = require('gulp-stylus'),
	postcss       = require('gulp-postcss'),
	autoprefixer  = require('autoprefixer'),
	cssnano       = require('cssnano'),
	mqpacker      = require('css-mqpacker'), // Unificar Media Queries
	perfectionist = require('perfectionist'); // Volver CSS mas hermoso



/* ^Plugins para postcss
-----------------------------------------------------------------------------*/

var postcssPlugins = [
	// mqpacker({
	// 	sort: true
	// }),
	autoprefixer({ browsers: ['last 4 versions'] }),
	cssnano({
		core             : config.ambiente.prod() ? true : false, // minificar
		minifyFontValues : false,
		zindex           : false,
		// discardUnused    : false,
		discardComments  : {
			removeAll : config.ambiente.prod() ? true : false
		}
	})
];

// Plugins que se ejecutan solo en ambiente desarrollo
var postcssPlugins__dev = [
	perfectionist({
		cascade : false
	})
]

config.ambiente.dev() ? postcssPlugins = postcssPlugins.concat(postcssPlugins__dev) : '';

/* ^Fin - Plugins para postcss
-----------------------------------------------------------------------------*/



gulp.task('styles', ['delete-styles'], function(){

	return gulp.src( config.paths.css.src )

		.pipe( plumber() )

		.pipe( sourcemaps.init() )

		.pipe( stylus({
			'include css': true
		}))

		.pipe( postcss(postcssPlugins) )

		.pipe(config.ambiente.prod( config.plugins.cachebust.references() ))

		.pipe(config.ambiente.prod( config.plugins.cachebust.resources() ))

		.pipe( config.plugins.header.header(config.plugins.header.fs.readFileSync( config.src + '/copyright.txt', 'utf8'), { pkg : config.plugins.header.pkg, year: config.plugins.header.ano }) )

		.pipe(config.ambiente.dev( sourcemaps.write(".") ))

		.pipe(gulp.dest( config.paths.css.dist ))

		.pipe(config.ambiente.dev( config.plugins.browserSync.stream() ))

		.pipe( notify('Stylus compilado: <%= file.relative %>') )

		.on('end', function(){
			config.ambiente.prod() ? gulp.start('jade') : ''
		})

});


gulp.task('delete-styles', function(){

	return gulp.src( config.paths.css.src, {read: false} )

		.pipe( deleted(
			config.paths.css.dist,
			[
				'**/*'
			]
		))

});
