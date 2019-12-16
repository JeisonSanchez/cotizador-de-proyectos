/*----------------------------------------------------------------------------*
	$IMAGES
	Todas las tareas relacionadas con optimización de imágenes
*----------------------------------------------------------------------------*/

// Plugins base
var gulp     = require('gulp'),
	config   = require('../config'),
	plumber  = require('gulp-plumber'),
	collate  = require('gulp-collate'),
	deleted  = require('gulp-deleted'),
	changed  = require('gulp-changed'),
	notify   = require('gulp-notify');

// Plugins para optimizar imágenes
var imagemin               = require('gulp-imagemin'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	imageminPngquant        = require('imagemin-pngquant');



gulp.task('images', function(){

	return gulp.src( config.paths.img.all )

		.pipe( plumber() )

		.pipe( imagemin([
			imageminJpegRecompress({
				progressive: true
			}),
			imageminPngquant(),
			imagemin.gifsicle(),
			imagemin.svgo()
		]) )

		.pipe(config.ambiente.prod( config.plugins.cachebust.resources() ))

		.pipe( collate( config.src + '/images' ) )
		.pipe( deleted(
			config.paths.img.dist,
			[
				'**/*'
			]
		))
		.pipe( changed( config.paths.img.dist ) )

		.pipe(gulp.dest( config.paths.img.dist ))

		.on('end', function(){
			config.ambiente.prod() ? gulp.start('styles') : config.plugins.browserSync.reload()
		})

		.pipe( notify('Imagen optimizada: <%= file.relative %>') )

});
