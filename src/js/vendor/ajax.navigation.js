/* 
* Plugin Name: Ajax.Navigation
* Plugin URI: http://codecanyon.net/item/ajaxnavigation-/13125428
* Description:  Ajax.Navigation loads and inserts new content into certain areas dynamically.
* Version: 1.1 
* Author: Imba28 
* Author URI: http://luxs.at
*/

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) 
{
	
	"use strict";
		// Create the defaults once
		var pluginName = "ajaxNavigation",
			defaults = 
			{
				areas : null, // Elements where the magic happens. This has to be defined in order to initiate the plugin.
				
				charset : "application/x-www-form-urlencoded; charset=UTF-8", // ajax call charset type
				
				highlightActiveLinks: true, // If is set to true, Ajax.Navigation will search for anchor elements, which are equal to the current URL and give them a specific class, which is defined in `classActiveLinks`. 
				classActiveLinks: "ajax_active", // if set to true, Ajax.Navigation will search for anchor elements, which are equal to the current URL and mark them with a class. 				
				
				loader : true, // If is set to true, a loading sign will be shown while the progress.
				loaderLayout : '<div class="loader"><div class="ball"></div><div class="ball1"></div></div>', // The loading sign's HTML markup.
				loaderTimeout : 1500, // 
				
				fetchContent : true, // If set to true, ajax.Navigation prefetchs a link's contents on hover, which drastically improves the performance.
				cacheSize : 10, // amount of pages that are getting cached.
				
				transitionDefault: "default", // Default transition effect. If no "data-ajax-effect" attribute is set, this one will be used.
				transitionDuration : 800, // Amount of time effects take to complete (in milliseconds).
				transitionEasing: "ease-out", // Kind of timing function. Available inputs: ease|linear|ease-in|ease-out|ease-in-out|cubic-bezier()|initial|inherit
				
				timeout: 10000, // Amount of time (in milliseconds) ajax.Navigation waits for the ajax call to be completed until it performs a normal page load. 
				
				reloadOnDoubleTrigger: false, // If another anchor is clicked while the last page is not finished loading yet, the page performs a reload. 
				
				// event funtions
				beforeInit: function() {}, // callback function before Ajax.Navigation is initialized.
				beforeLoadContent: function() {}, // callback function before a new page is being loaded via ajax.
				beforeInsertNewContent: function() {}, // callback function before the new content is being inserted into the different `areas`.
				afterInsertNewContent: function() {}, // callback function after the new content was inserted into the different `areas`.
				afterTransitionEnd: function() {}, // callback function after all transition effects are finished.			
				noContentChange: function() {} // callback function if no change was made to the areas. -> Loaded content was equal to the current one.
		};	
				
		var loading = false; // whether there is a page load going on or not.
		
		// list of all available effects
		var effects = ["slide-left","slide-right","slide-top","slide-bottom","stack-left","stack-right","stack-top","stack-bottom","scale-stack-in","scale-stack-out","carousel-left","carousel-right","carousel-top","carousel-bottom","side-rotate-left","side-rotate-right","fold-left","fold-right","fold-top","fold-bottom","blend","fade","blur","grayscale","contrast","scale-in","scale-out","custom-1","custom-2","rise","fall","wipe","exchange","rotate","default"];

		var cache = {}; // Object where pages are stored
		var loadedContent, // last loaded content is stored here. Variable is needed for callbacks.
			lastLoadedURL; // last loaded URL is stored here. Variable is needed for callbacks.
		
		// The actual plugin constructor
		 $.ajaxNavigation = function(element, options) 
		 {
		 	var plugin = this;
		 	 	
			plugin.element = element;
			
			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. 
			plugin.settings = $.extend( {}, defaults, options );
			
			plugin._defaults = defaults;
			plugin._name = pluginName;
											
			plugin.init = function () 
			{
				var $this = $(this); // refers to the actual jQuery object.

				if (history && history.pushState) // only continue if the browser supports html5's history API.
				{
					if (plugin.settings.beforeInit() !== undefined) plugin.settings.beforeInit(); 
					
					window.addEventListener('popstate', function(event) // Add an event listener to detect changes in the URL.
					{
						if (event.state)  // Check if state is set. Some browsers (e.g iOS Safari) trigger a popstate event after the page is loaded, although the url did not change. 
						{	
							var url = window.location.pathname; // save URL
				        	
							if (url.toString().indexOf("#") <= 0) // Only proceed if the clicked anchor element did not contain any hash values. e.g <a href="#test">Test</a>
							{
								plugin.loadContent(url, false); // load new page via ajax.
							}	
						}
					}, false);
					
					plugin.prepareAreaForNewContent(plugin.settings.areas); // wrap all areas in the needed markup
					
					// adds transitions with the specified transition duration to elements containing loaded and current content. Furthermore animation durations are defined.
					$("<style type='text/css'>.ajax-effect-exchange .page_loading_effect.effect_active .ajax_new_content {-moz-animation: exchange-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-webkit-animation: exchange-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-ms-animation: exchange-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-o-animation: exchange-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";animation: exchange-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+"; } .ajax-effect-exchange .page_loading_effect.effect_active .ajax_old_content { -webkit-animation: exchange-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-moz-animation: exchange-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-ms-animation: exchange-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-o-animation: exchange-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";animation: exchange-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";}  .ajax-effect-custom-1 .ajax_old_content, .ajax-effect-custom-1 .ajax_new_content, .ajax-effect-custom-2 .ajax_old_content, .ajax-effect-custom-2 .ajax_new_content, .ajax-effect-scale-stack-in .ajax_old_content, .ajax-effect-scale-stack-in .ajax_new_content, .ajax-effect-scale-stack-out .ajax_old_content, .ajax-effect-scale-stack-out .ajax_new_content, .ajax-effect-rotate .ajax_old_content, .ajax-effect-rotate .ajax_new_content, .ajax-effect-stack-right .ajax_old_content, .ajax-effect-stack-right .ajax_new_content, .ajax-effect-stack-left .ajax_old_content, .ajax-effect-stack-left .ajax_new_content, .ajax-effect-stack-top .ajax_old_content, .ajax-effect-stack-top .ajax_new_content, .ajax-effect-stack-bottom .ajax_old_content, .ajax-effect-stack-bottom .ajax_new_content, .ajax-effect-slide-top .ajax_old_content, .ajax-effect-slide-top .ajax_new_content, .ajax-effect-slide-bottom .ajax_old_content, .ajax-effect-slide-bottom .ajax_new_content, .ajax-effect-slide-left .ajax_old_content, .ajax-effect-slide-left .ajax_new_content, .ajax-effect-slide-right .ajax_old_content, .ajax-effect-slide-right .ajax_new_content, .ajax-effect-rise .ajax_old_content, .ajax-effect-rise .ajax_new_content, .ajax-effect-fall .ajax_old_content, .ajax-effect-fall .ajax_new_content, .ajax-effect-carousel-right .ajax_new_content , .ajax-effect-carousel-right .ajax_old_content, .ajax-effect-carousel-left .ajax_new_content , .ajax-effect-carousel-left .ajax_old_content, .ajax-effect-carousel-bottom .ajax_new_content, .ajax-effect-carousel-bottom .ajax_old_content, .ajax-effect-carousel-top .ajax_new_content, .ajax-effect-carousel-top .ajax_old_content, .ajax-effect-fold-right .ajax_new_content , .ajax-effect-fold-right .ajax_old_content, .ajax-effect-fold-left .ajax_new_content , .ajax-effect-fold-left .ajax_old_content, .ajax-effect-fold-bottom .ajax_new_content, .ajax-effect-fold-bottom .ajax_old_content, .ajax-effect-fold-top .ajax_new_content, .ajax-effect-fold-top .ajax_old_content, .ajax-effect-side-rotate-left .ajax_old_content, .ajax-effect-side-rotate-left .ajax_new_content, .ajax-effect-side-rotate-right .ajax_old_content, .ajax-effect-side-rotate-right .ajax_new_content, .ajax-effect-blend .ajax_old_content, .ajax-effect-blend .ajax_new_content{ -webkit-transition: "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+",height 0s;-moz-transition: "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+",height 0s;-ms-transition: "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+",height 0s;-o-transition: "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+",height 0s;transition: "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+",height 0s;}  .ajax-effect-scale-stack-in .ajax_new_content,.ajax-effect-scale-stack-out .ajax_new_content { -webkit-transition-delay: "+plugin.settings.transitionDuration/4+"ms;-moz-transition-delay:"+plugin.settings.transitionDuration/4+"ms;-ms-transition-delay: "+plugin.settings.transitionDuration/4+"ms;-o-transition-delay: "+plugin.settings.transitionDuration/4+"ms;transition-delay: "+plugin.settings.transitionDuration/4+"ms;} .page_loading_effect{-ms-transition: all "+plugin.settings.transitionDuration/2+"ms;-moz-transition: all "+plugin.settings.transitionDuration/2+"ms;-webkit-transition: all "+plugin.settings.transitionDuration/2+"ms;-o-transition: all "+plugin.settings.transitionDuration/2+"ms;transition: all "+plugin.settings.transitionDuration/2+"ms;} .ajax-navigation-area {-ms-transition: all "+plugin.settings.transitionDuration+"ms;-moz-transition: all "+plugin.settings.transitionDuration+"ms;-webkit-transition: all "+plugin.settings.transitionDuration+"ms;-o-transition: all "+plugin.settings.transitionDuration+"ms;transition: all "+plugin.settings.transitionDuration+"ms;}.ajax-effect-wipe .page_loading_effect.effect_active .ajax_new_content {-moz-animation: wipe-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-webkit-animation: wipe-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-ms-animation: wipe-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-o-animation: wipe-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";animation: wipe-2 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+"; } .ajax-effect-wipe .page_loading_effect.effect_active .ajax_old_content { -webkit-animation: wipe-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-moz-animation: wipe-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-ms-animation: wipe-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";-o-animation: wipe-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";animation: wipe-1 "+plugin.settings.transitionDuration+"ms "+plugin.settings.transitionEasing+";}</style>").appendTo("head");						
					if(plugin.settings.fetchContent === true)
					{
						$("body").delegate(plugin.element.selector, "mouseenter", plugin.fetchContent)
								 .delegate(plugin.element.selector, "click", plugin.clickHandler);	// attach fetching function				
					}
					else $("body").delegate(plugin.element.selector, "click", plugin.clickHandler);	// attach click handler
				}
				
			};
			
			// methods start
			plugin.returnLoadedContent = function()
			{
				return loadedContent;
			};
			
			plugin.returnEffects = function()
			{
				return effects;
			};
			
			plugin.returnAreas = function()
			{
				return settings.areas;
			};
			
			plugin.returnLastLoadedURL = function()
			{
				return lastLoadedURL;
			};		
			
			plugin.setSelectorActive = function(elem) // set selector active
			{
				$(elem).attr("data-ajax-ignore", "false");
			};
			
			plugin.setSelectorInactive = function(elem) // set selector inactive. Clicking on a hyperlink after executing setSelectorInactive() on it results in the page being loaded normally.
			{
				$(elem).attr("data-ajax-ignore", "true");
			};
			
			plugin.removeAjaxNavigation = function() // set selector inactive. Clicking on a hyperlink after executing setSelectorInactive() on it results in the page being loaded normally.
			{
				$(plugin.settings.areas).removeClass("ajax-navigation-area").find(".ajax-navigation-loader").remove();
				$(plugin.settings.areas).find(".page_loading_effect").children().unwrap();
				
				if(plugin.settings.fetchContent === true) $("body").undelegate(plugin.element.selector, "mouseenter", plugin.fetchContent);	// remove fetching function					
				$("body").undelegate(plugin.element.selector, "click", plugin.clickHandler);	// remove click handler
				console.log("AjaxNavigation was successfully removed.");
			};		
			// methods end
			
			plugin.isLocalLink = function(url)
			{
			   	return (!(/^(http)/).test(url)) || (url.indexOf(location.hostname) > -1);
			};
			
			plugin.getHrefFromElem = function(elem)
			{
				if($(elem).attr("href") === undefined) // if the clicked element does not have an href attribute.
				{
					if($(elem).closest(plugin.element.selector).length >= 1) // Check if there is any parent element with the specified anchor class. e.g image wrapped in anchor element.
					{	
						return $(elem).closest(plugin.element.selector).attr("href"); // save the href
					}
					else 
					{
						return undefined; // no link was clicked.
					}
				}
				else 
				{
					return $(elem).attr("href"); // the element itself has an href attribute
				}
			};
			
			plugin.clickHandler = function(e) // attach a click handler for all elements that match the selector. So, clicking on an anchor that was added dynamically to the DOM triggers the function as well.
			{
				if($(e.target).attr("data-ajax-ignore") !== "true") // check if anchor is set active			
				{					
					var link = plugin.getHrefFromElem($(e.target));
					
					if(plugin.isLocalLink(link)) // if link is not external
					{
						if(link !== undefined) // if anchor element with href attribute was clicked
						{								
							if (link.toLowerCase().indexOf("#") <= 0) // Only proceed if the clicked anchor element did not contain any hash values. e.g <a href="#test">Test</a>
							{							
								plugin.settings.beforeLoadContent(); // execute function before the ajax call fires.				
								lastLoadedURL = link;
								
								plugin.loadContent(link, true); // load new page via ajax
							}							
						}
						e.preventDefault(); // prevent browser from loading the new page
					}
				} 											
			};		
			
			plugin.deleteCacheIfFull = function()
			{
				if(Object.keys(cache).length > plugin.settings.cacheSize){
					cache = {}; // empty cache
				}
			};
			
			plugin.fetchContent = function(e) // gets html content and caches it.
			{
				if($(e.target).attr("data-ajax-ignore") !== "true"){ // check if anchor is set active
					var link = plugin.getHrefFromElem($(e.target));
					
					if(link !== undefined) // if anchor element with href attribute was clicked
					{								
						if (link.toLowerCase().indexOf("#") <= 0) // Only proceed if the clicked anchor element did not contain any hash values. e.g <a href="#test">Test</a>
						{					
							if(typeof cache[link] == "object") return; // abort if cache entry already exists.
														
							cache[link] = { status : "fetching content"}; // create cache entry with loading status.
							
							$.ajax({ // ajax call
								url: link,
								type: "GET",		
								dataType: "html",
								cache: false,
								contentType: plugin.settings.charset,
								success: function (html) 
								{																															
									plugin.deleteCacheIfFull();

									cache[link] = 
									{
										status : "done",
										content : html
									};
								},
								error: function (xhr){
						    		cache[link] = { status : "error"};
						    		console.log("Cache entry failed. Details belows!");
						    		console.log(xhr);
								}	
							});
						}							
					}
					e.preventDefault(); // prevent browser from loading the new page
				} 				
			};
			
			plugin.prepareAreaForNewContent = function(elem) // wrap all areas in the needed markup
			{			
				$(elem).addClass("ajax-navigation-area").wrapInner("<div class='page_loading_effect'/>"); // add `.ajax-navigation-area` class to the area
			};
			
			plugin.getNewContent = function(elem, html) // look for the ID inside the loaded document.
			{
				var id = $(elem).attr("id");
				return $(html).find("#"+id).html(); // return the new content
			};
			
			plugin.getNewTransitionEffect = function(elem, html) // look for the ID inside the loaded document.
			{
				var id = "#"+$(elem).attr("id");	
				return $(html).find(id).attr("data-ajax-effect") !== undefined && $(html).find(id).attr("data-ajax-effect").length > 0 ? $(html).find(id).attr("data-ajax-effect") : plugin.settings.transitionDefault; // returns new effect type
			};
			
			plugin.loadContent = function(page, dir) // function which is loading and inserting the new content
			{													
				if(loading === false){ // if there is no other page loading
					loading = true; // set loading to true in order to prevent double page load progress
					
					if(plugin.settings.highlightActiveLinks === true){
						$("a").each(function(e){ // Checks document for anchor elements
							if($(this).attr("href") == page) $(this).closest("li").addClass(plugin.settings.classActiveLinks); // add active_class if the href is equal to the loaded url
							else $(this).closest("li").removeClass(plugin.settings.classActiveLinks); // remove class
						});		
					}
					if(plugin.settings.fetchContent === true && dir === true){
						var cacheObj = cache[page];
						
						if(cacheObj.status.length >= 1){ // a cache entry was found!
							if(cacheObj.status == "fetching content") // if cache entry is not finished loading yet
							{
								var waitForFetching = setInterval(function(){ // set an invertval
									if(cache[page].status == "done") // and check every round if it is finished.
									{
										clearInterval(waitForFetching); // removes interval
										plugin.insertContent(cache[page].content, dir, page); // insert content
									}
									else if(cache[page].status == "error") // check if any error occured
									{
										clearInterval(waitForFetching); // removes interval
										window.location = page; // reload page with new url
									}
									console.log("Waiting for cache["+page+"] to get finished loading.");
								}, 20);
							}
							else if(cacheObj.status == "done") // if cache status is ready
							{
								plugin.insertContent(cacheObj.content, dir, page); // insert content
							}
							else if(cacheObj.status == "error") { // cache entry is faulty
								window.location = page; // reload page with new url
							}
						}
					}
					else 
					{
						var timer = setTimeout(function(){$(".ajax-navigation-page-loader").fadeIn(500);}, plugin.settings.loaderTimeout); // set timer
						
						$.ajax({ // ajax call
							url: page,
							type: "GET",		
							dataType: "html",
							cache: false,
							timeout: plugin.settings.timeout, // how long the ajax call waits to get completed, until it gets aborted.
							contentType: plugin.settings.charset,
							success: function (html) 
							{	
								if($(".ajax-navigation-page-loader").is(":visible"))
								{
									$(".ajax-navigation-page-loader").fadeOut(500); // hide loader
								}
								clearTimeout(timer); // removes interval that reveals loading sign
								plugin.insertContent(html, dir, page); // insert content
							},
						    error: function (xhr, ajaxOptions, thrownError){
						    	if(xhr.status == 0) {
						    		window.location = page;
						    	}
						    	console.log(xhr);
						        alert(thrownError);
							}	
						});
					}
				}
				else 
				{
					if(plugin.settings.reloadOnDoubleTrigger) window.location = page; // if another anchor is clicked while the last page is not finished loading yet, the page is loaded conventionally.
				}
			};
			
			plugin.insertContent = function(html, dir, page)
			{
				loadedContent = html;																			
				var html = $.parseHTML(html, true); // parse content to html. Second parameter tells browser to include scripts passed in the HTML string.			
				var elementsChanged = 0;
				
				if(dir === true) history.pushState({}, '', page);// create an entry in the browser's history
				
				var newTitle = $(html).filter('title').text(); // find title tag and save its value
				document.title = newTitle; // update page title
								
				if(plugin.settings.beforeInsertNewContent() !== undefined) plugin.settings.beforeInsertNewContent();
				
				$(plugin.settings.areas).each(function(e)
				{						
					var $this = $(this); // current area
					
					if($this.length <= 0){ 
						return false; // do not continue if area does not exist
					}
									
					var old_content = $this.find(".page_loading_effect").html(); // current content
					var new_content = plugin.getNewContent($this, html); // calls function which returns the new content
																			
					if($.trim(old_content).replace(/\s+/g, '') !== $.trim(new_content).replace(/\s+/g, '')) // remove all whitespaces and check if the content has changed
					{
						elementsChanged++;
						
						var transition_effect =  $this.attr("data-ajax-effect") !== undefined && $this.attr("data-ajax-effect").length > 0 ? $this.attr("data-ajax-effect") : plugin.settings.transitionDefault; // get the transition effect
						$this.addClass("ajax-effect-"+transition_effect); // add the right class to area 
						
						var n_transition_effect = plugin.getNewTransitionEffect($this, html); // new transition effect 
						
						if(n_transition_effect !== transition_effect){ // check if the new effect is different to the current one			
							$this.removeClass (function (index, css) { 
							    return (css.match (/\bajax-effect-\S+/g) || []).join(' '); // remove old effect class
							});
							console.log(n_transition_effect);
							$this.addClass("ajax-effect-"+n_transition_effect); // add new effect class
							$this.attr("data-ajax-effect", n_transition_effect); // update data attribute
						}
						
						switch(transition_effect) // distinguish between different effects
						{
							// effects that don't need any special markup. Basically, we just have to hide the area, update its content, and show it again.
							case 'scale-out':
							case 'scale-in':
							case 'invert':
							case 'grayscale':
							case 'contrast':
							case 'blur':
							case 'fade':
								$this.find(".page_loading_effect").addClass("effect_active");	
				
								setTimeout(function(){
									$this.find(".page_loading_effect").removeClass("effect_active").html(new_content);
									
									
									if(plugin.settings.loader) $this.find(".ajax-navigation-loader").fadeOut(plugin.settings.transitionDuration);	
								}, plugin.settings.transitionDuration);
							break;			
								
							// These effects show new and old content at the same time.	This requires additional markup.		
							case 'slide-left':
							case 'slide-right':
							case 'slide-top':
							case 'slide-bottom':
							
							case 'custom-2':
							case 'custom-1':	
							
							case 'side-rotate-right':
							case 'side-rotate-left':
							
							case 'stack-top':	
							case 'stack-bottom':
							case 'stack-right':
							case 'stack-left':
										
							case 'rise':
							case 'fall':
							
							case 'exchange':
							case 'rotate':
							
							case 'fold-top':	
							case 'fold-bottom':								
							case 'fold-left':
							case 'fold-right':
							
							case 'carousel-top':	
							case 'carousel-bottom':						
							case 'carousel-left':
							case 'carousel-right':
							
							case 'wipe':
							case 'blend':
								var $page_loading = $this.find(".page_loading_effect");			

								$page_loading.wrapInner("<div class='ajax-slide-wrapper'><div class='ajax-slide-inner'><div class='ajax_old_content'/></div></div>"); // add additional markup. Current content is stored inside .ajax_old_content.
								
								$this.find(".ajax_old_content").after("<div class='ajax_new_content'>"+new_content+"</div>"); // add an element containing the new content
								
								// var height = $this.find(".ajax_old_content").height();
								var height = $this.find(".ajax_old_content").height();
								var n_height = $this.find(".ajax_new_content").height();
								
								$this.addClass("no-transition").css({ // add clas that prevents any transition in order to avoid a bug
									"height": height,
									"overflow": "hidden"
								});
															
								setTimeout(function(){
									$page_loading.addClass("effect_active"); // start transition

									var content = $this.find(".ajax_new_content").children();

									$this.removeClass("no-transition").css("height", n_height);
									
									setTimeout(function(){
										$this.find(".ajax_old_content").remove(); // remove old content
										
										content.unwrap().unwrap().unwrap();	
																																																					
										$page_loading.removeClass("effect_active"); // removes class which started the transition
										$this.addClass("no-transition").css({ // add class that prevents any transition in order to avoid a bug
											"height": "",
											"overflow": "visible"
										}); // set element's height to auto.
										
									}, plugin.settings.transitionDuration);
								}, 10);
							break;
							
							// effects where whether the new or the old content has a transition delay.
							case 'scale-stack-in':		
							case 'scale-stack-out':																	
								$this.find(".page_loading_effect").wrapInner("<div class='ajax-slide-wrapper'><div class='ajax-slide-inner'><div class='ajax_old_content'/></div></div>");
								$this.find(".ajax_old_content").after("<div class='ajax_new_content'>"+new_content+"</div>");
								
								var height = $this.find(".ajax_old_content").height();
								var n_height = $this.find(".ajax_new_content").height();
								
								$this.addClass("no-transition").css("height", height);
						
								setTimeout(function()
								{
									$this.find(".page_loading_effect").addClass("effect_active");	

									var content = $this.find(".ajax_new_content").children();
									$this.removeClass("no-transition").css("height", n_height);
									
									setTimeout(function()
									{
										$this.find(".ajax_old_content").remove();
										
										content.unwrap().unwrap().unwrap();	// unwrap content until its parent is .page_loading_effect					
																																														
										$this.find(".page_loading_effect").removeClass("effect_active"); //
										$this.addClass("no-transition").css("height", "");
									}, plugin.settings.transitionDuration + plugin.settings.transitionDuration/4);													
								}, 10);
							break;
							
							// There is no effect. Simply update the content without much fuss.
							case 'default':
							default:							
								$this.find(".page_loading_effect").html(new_content);
							break;
						}
					}										
				});
				if(plugin.settings.afterInsertNewContent() !== undefined) plugin.settings.afterInsertNewContent();
				
				// after all transitions are finished
				if(elementsChanged > 0) // if atleast one element was changed
				{
					setTimeout(function(){				
						if(plugin.settings.afterTransitionEnd() !== undefined) plugin.settings.afterTransitionEnd();
						$(plugin.settings.areas).removeClass("no-transition"); /*remove class which prevents transitions. Having an active transition while changing the height causes problems. 
																	See here: http://n12v.com/css-transition-to-from-auto/ */
						loading = false; // set loading to false. Now the plugin is ready for another run!
					}, plugin.settings.transitionDuration+plugin.settings.transitionDuration*0.1);
				}
				else 
				{
					if(plugin.settings.noContentChange() !== undefined) plugin.settings.noContentChange();
					loading = false; // set loading to false. Now the plugin is ready for another run!
				}
			};
			
			if(plugin.settings.areas != null)
			{
				if($("body").find(plugin.settings.areas).length >= 1) // if areas exists in DOM
				{
					plugin.init(); // Initiate if there are areas set and found
				}
				//else console.log("ERROR: ajaxNavigation could not be initiated because no areas were found inside the document."); // else throw an error
			} 
			//else console.log("ERROR: ajaxNavigation could not be initiated because there are no areas set."); // else throw an error
		};

		$.fn.ajaxNavigation = function(options)	//  add function to $.fn
		{
			if (undefined == $(this).data('ajaxNavigation')) 
			{
                var plugin = new $.ajaxNavigation( this, options );
                return $(this).data('ajaxNavigation', plugin); // return the selector in order to make it chainable          
            }
			else return this;						
		};
})( jQuery, window, document );