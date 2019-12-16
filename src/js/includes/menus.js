/*----------------------------------------------------------------------------*
	$MENUS.js
*----------------------------------------------------------------------------*/


/*	^Detectar ancho de scroll
-------------------------------------------------------------*/

	var scrollDiv = document.createElement("div");
	scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';

	document.body.appendChild(scrollDiv);

	scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);


/*	^Fin - Detectar ancho de scroll
-------------------------------------------------------------*/





/* ^reducir menu al hacer scroll
-----------------------------------------------------------------------------*/

	$(window).scroll(function(){

		var scrollTop = $(this).scrollTop();

		if(scrollTop > 6){
			$('.js-c-block-1').addClass('c-block-1--scroll');
			// $('.header__block2').addClass('header__block2--scroll');
			// $('.topBar').addClass('topBar--scroll');
			// $('.main-logo').addClass('main-logo--scroll');
		} else {
			$('.js-c-block-1').removeClass('c-block-1--scroll');
			// $('.header__block2').removeClass('header__block2--scroll');
			// $('.topBar').removeClass('topBar--scroll');
			// $('.main-logo').removeClass('main-logo--scroll');
		}
	});

/* ^Fin - reducir menu al hacer scroll
-----------------------------------------------------------------------------*/






/* ^Menu responsive - slicknav.js
-----------------------------------------------------------------------------*/

	$('.c-nav-main').slicknav({
		prependTo: '#menuMovil'
	});

	$(document).on('click', '.js-menuHamburguesa', function(e){
		e.preventDefault();
		$('.c-nav-main').slicknav('toggle');
	});

/* ^Fin - Menu responsive - slicknav.js
-----------------------------------------------------------------------------*/





/* ^circulos en menu lateral
-----------------------------------------------------------------------------*/

	var altoMenu = $('.js-nav-lateral').height();
	var distanciaTop = altoMenu - 19;

	console.log(distanciaTop);


	$('.js-block-6').css("background-position",  "0 " + distanciaTop + "px");

/* ^Fin - circulos en menu lateral
-----------------------------------------------------------------------------*/






/* ^Fixed al hacer scroll
-----------------------------------------------------------------------------*/


	var stickWidth = 991;
	var win = $(window);
	var menu = $(".js-categoria-list");
	var options = {
		offset_top: 100
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


/* ^Fin - Fixed al hacer scroll
-----------------------------------------------------------------------------*/
