/*----------------------------------------------------------------------------*
	$SLIDERS.js
*----------------------------------------------------------------------------*/


/* ^Slider Hero
-----------------------------------------------------------------------------*/

	$('.js-bannerFull').revolution({
		delay:9000,
		startwidth:960,
		startheight:500,

		onHoverStop:"off",						// Stop Banner Timet at Hover on Slide on/off

		thumbWidth:100,							// Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
		thumbHeight:50,
		thumbAmount:3,

		hideThumbs:0,
		navigationType:"none",				// bullet, thumb, none
		navigationArrows:"solo",				// nexttobullets, solo (old name verticalcentered), none

		navigationStyle:"round",				// round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item), custom


		navigationHAlign:"center",				// Vertical Align top,center,bottom
		navigationVAlign:"top",					// Horizontal Align left,center,right
		navigationHOffset:0,
		navigationVOffset:20,

		soloArrowLeftHalign:"left",
		soloArrowLeftValign:"center",
		soloArrowLeftHOffset:20,
		soloArrowLeftVOffset:0,

		soloArrowRightHalign:"right",
		soloArrowRightValign:"center",
		soloArrowRightHOffset:20,
		soloArrowRightVOffset:0,

		touchenabled:"on",						// Enable Swipe Function : on/off



		stopAtSlide:-1,							// Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
		stopAfterLoops:-1,						// Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic

		hideCaptionAtLimit:0,					// It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
		hideAllCaptionAtLilmit:0,				// Hide all The Captions if Width of Browser is less then this value
		hideSliderAtLimit:0,					// Hide the whole slider, and stop also functions if Width of Browser is less than this value


		fullWidth:"on",

		shadow:0								//0 = no Shadow, 1,2,3 = 3 Different Art of Shadows -  (No Shadow in Fullwidth Version !)
	});


/* ^Fin - Slider Hero
-----------------------------------------------------------------------------*/







/* ^Slider 7 razones
-----------------------------------------------------------------------------*/



	$('#slider7razones').royalSlider({
		arrowsNav: false,
		loop: true,
		keyboardNavEnabled: false,
		controlsInside: false,
		imageScaleMode: 'fill',
		arrowsNavAutoHide: false,
		autoScaleSlider: true,
		autoScaleSliderWidth: 1600,
		autoScaleSliderHeight: 766,
		controlNavigation: 'none',
		thumbsFitInViewport: false,
		navigateByClick: false,
		startSlideId: 0,
		autoPlay: {
			enabled: true,
			pauseOnHover: false,
			delay: 5000
		},
		transitionType:'fade',
		globalCaption: false,
		deeplinking: {
			enabled: true,
			change: false
		},
	});

	var slider = $("#slider7razones").data('royalSlider');

	/*
	slider.ev.on('rsBeforeMove', function(event, type, userAction ) {
	    // before any transition start (including after drag release)
	    // "type" - can be "next", "prev", or ID of slide to move
	    // userAction (Boolean) - defines if action is triggered by user (e.g. will be false if movement is triggered by autoPlay)

		// if(type == "next"){
		// 	console.log('Siguiente');
		// 	$('.js-porqueBucara').slick('slickNext');
		// }
		// else if (type == "prev"){
		// 	console.log('Anterior');
		// 	$('.js-porqueBucara').slick('slickPrev');
		// }
	});
	*/


/* ^Fin - Slider 7 razones
-----------------------------------------------------------------------------*/
