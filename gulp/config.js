/*----------------------------------------------------------------------------*
	$CONFIG
	Contiene las rutas y configuración general para trabajar con las tareas
*----------------------------------------------------------------------------*/

// Carpetas del proyecto
var src  = 'src',  // -> Desarrollo
	dist = 'dist'; // -> Producción

// Plugins para uso a nivel global
var browserSync  = require('browser-sync').create(),
	CacheBuster  = require('gulp-cachebust'),
	environments = require('gulp-environments'),
	fs 		     = require('fs'),
	header	 	 = require('gulp-header')
	pkg          = require('../package.json');


/**
 *
 * Variables para ambiente desarrollo y producción
 *
 * Ejecutar ambiente desarrollo: gulp --env development
 * Ejecutar ambiente producción: gulp --env production
 *
 */
var desarrollo = environments.development,
	produccion = environments.production;


// Obtener el año actual para agregar como header en los archivos css y js
var fecha = new Date(),
	ano = fecha.getFullYear();


module.exports = {
	src: src,
	dist: dist,
	ambiente: {
		dev  : desarrollo,
		prod : produccion
	},
	paths: {
		css: {
			src  : src  + '/styl/*.styl',
			all  : src  + '/styl/**/*.styl',
			dist : dist + '/assets/css'
		},
		js: {
			src    : src  + '/js/*.js',
			all    : src  + '/js/**/*.js',
			dist   : dist + '/assets/js'
		},
		tpl: {
			src    : src  + '/tpl/*.{jade,pug}',
			all    : src  + '/tpl/**/*.{jade,pug}'
		},
		img: {
			all  : src  + '/images/**/*.{jpg,jpeg,png,gif,svg,JPG,JPEG}',
			dist : dist + '/assets/images'
		}
	},
	plugins: {
		browserSync : browserSync,
		cachebust   : new CacheBuster({
			checksumLength : 10
		}),
		header : {
			fs     : fs,
			header : header,
			pkg    : pkg,
			ano    : ano
		}
	}
}
