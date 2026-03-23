// set focus op zoeken veld in de offcanvass
// window.onload = function() {
// 	const myOffcanvas = document.getElementById('offcanvasZoeken')
// 	myOffcanvas.addEventListener('shown.bs.offcanvas', event => {
// 		document.getElementById('zoeken').focus()
// 	})
// }


// var abtContainer = document.getElementsByClassName('wpb_animate_when_almost_visible');

// if(abtContainer.length > 0) {
//     abtContainer.className += ' wpb_start_animation animated'; 
// }

jQuery.noConflict();
jQuery( document ).ready(function( $ ) {

	//
	// WPBakery Add animation class
	//
	// vc-waypoints.min.js
	//
	void 0 !== $.fn.vcwaypoint && $(".wpb_animate_when_almost_visible:not(.wpb_start_animation)").each(function() {
		var e = $(this);
		e.vcwaypoint(function() {
			e.addClass("wpb_start_animation animated")
		}, {
			offset: "85%"
		})
	})


	//
	// WPBakery Custom Spacer
	//
	// init_ckv_spacer();
	// //function for resize spacer
	// function init_ckv_spacer() {
	// 	var css = '';
	// 	$('.spacer').each(function(i,spacer){
	// 		var uid = $(spacer).data('id');
	// 		//var body_width = $("body").width();
	// 		var height_on_mob = $(spacer).data('height-mobile');
	// 		var height_on_mob_landscape = $(spacer).data('height-mobile-landscape');
	// 		var height_on_tabs = $(spacer).data('height-tab');
	// 		var height_on_tabs_portrait = $(spacer).data('height-tab-portrait');
	// 		var height = $(spacer).data('height');


	// 		if ( '' == height_on_tabs && '' == height_on_tabs_portrait && '' == height_on_mob && '' == height_on_mob_landscape ) {

	// 			css += ' .spacer-'+uid+' { height:'+height+'px } ';
	
	// 		} else {

	// 			// Normal height
	// 			if(height) {
	// 				css += ' .spacer-'+uid+' { height:'+height+'px } ';
	// 			}
	// 			// Height Tab landscape
	// 			if(height_on_tabs) {
	// 				css += ' @media (max-width: 1199px) { .spacer-'+uid+' { height:'+height_on_tabs+'px } } ';
	// 			}
	// 			// Height Tab portrait
	// 			if(height_on_tabs_portrait) {
	// 				css += ' @media (max-width: 991px) { .spacer-'+uid+' { height:'+height_on_tabs_portrait+'px } } ';
	// 			}
	// 			// Height Mob landscape
	// 			if(height_on_mob_landscape) {
	// 				css += ' @media (max-width: 767px) { .spacer-'+uid+' { height:'+height_on_mob_landscape+'px } } ';
	// 			}
	// 			// Height Mob portrait
	// 			if(height_on_mob) {
	// 				css += ' @media (max-width: 479px) { .spacer-'+uid+' { height:'+height_on_mob+'px } } ';
	// 			}
			
	// 		}

	// 	});
	// 	if(css != '') {
	// 		css = '<style>'+css+'</style>';
	// 		$('head').append(css);
	// 	}
	// }

	
	
	// Searchfield
	// $('#collapseSearch').on('shown.bs.collapse', function () {
	// 	$('.search-field').focus();
	// })
	
	// Go top button
	$('.js-gotop').on('click', function(event){
		
		event.preventDefault();
	
		$("html, body").animate({ scrollTop: 0 }, "slow");
		
		return false;
	});
	
	$(window).scroll(function(){
	
		var $win = $(window);
		if ($win.scrollTop() > 100) {
			$('.js-top').addClass('active');
		} else {
			$('.js-top').removeClass('active');
		}

	});

	//
	// WP Bakery Video
	//
	( function ( $ ) {
		$( document ).ready( function ( e ) {
			const id = $( '.ult-video' )
				.map( function () {
					return $( this ).attr( 'id' );
				} )
				.get();
			const id1 = $( '.ultv-video__outer-wrap' )
				.map( function () {
					return $( this ).attr( 'data-iconbg' );
				} )
				.get();
			const id2 = $( '.ultv-video__outer-wrap' )
				.map( function () {
					return $( this ).attr( 'data-overcolor' );
				} )
				.get();
			const id3 = $( '.ultv-video__outer-wrap' )
				.map( function () {
					return $( this ).attr( 'data-defaultbg' );
				} )
				.get();
			const play = $( '.ultv-video__outer-wrap' )
				.map( function () {
					return $( this ).attr( 'data-defaultplay' );
				} )
				.get();
			const video = $( '.ultv-video' )
				.map( function () {
					return $( this ).attr( 'data-videotype' );
				} )
				.get();

			for ( let i = id.length - 1; i >= 0; i-- ) {
				$( '#' + id[ i ] + ' .ultv-video' )
					.find( ' .ultv-video__outer-wrap' )
					.css( 'color', id1[ i ] );
				$( '#' + id[ i ] + ' .ultv-video' )
					.find( ' .ultv-youtube-icon-bg' )
					.css( { fill: id3[ i ] } );
				$( '#' + id[ i ] + ' .ultv-video' )
					.find( ' .ultv-vimeo-icon-bg' )
					.css( { fill: id3[ i ] } );
				const styleElem = document.head.appendChild(
					document.createElement( 'style' )
				);
				styleElem.innerHTML =
					'#' +
					id[ i ] +
					' .ultv-video .ultv-video__outer-wrap:before {background: ' +
					id2[ i ] +
					';}';
			}
			for ( let j = 0; j <= play.length - 1; j++ ) {
				if ( 'icon' == play[ j ] ) {
					$( '.ultv-video' )
						.find( ' .ultv-video__outer-wrap' )
						.hover(
							function () {
								const $this = $( this );
								$this.css( 'color', $this.data( 'hoverbg' ) );
							},
							function () {
								const $this = $( this );
								$this.css( 'color', $this.data( 'iconbg' ) );
							}
						);
				} else if ( 'defaulticon' == play[ j ] ) {
					if ( 'uv_iframe' == video[ j ] ) {
						$( '.ultv-video' )
							.find( ' .ultv-video__outer-wrap' )
							.hover(
								function () {
									const $this = $( this );
									$this.find( ' .ultv-youtube-icon-bg' ).css( {
										fill: $this.data( 'defaulthoverbg' ),
									} );
								},
								function () {
									const $this = $( this );
									$this
										.find( ' .ultv-youtube-icon-bg' )
										.css( { fill: $this.data( 'defaultbg' ) } );
								}
							);
					} else if ( 'vimeo_video' == video[ j ] ) {
						$( '.ultv-video' )
							.find( ' .ultv-video__outer-wrap' )
							.hover(
								function () {
									const $this = $( this );
									$this.find( ' .ultv-vimeo-icon-bg' ).css( {
										fill: $this.data( 'defaulthoverbg' ),
									} );
								},
								function () {
									const $this = $( this );
									$this
										.find( ' .ultv-vimeo-icon-bg' )
										.css( { fill: $this.data( 'defaultbg' ) } );
								}
							);
					}
				}
			}
			ultvideo();
			$( window ).resize( function ( e ) {
				ultvideo();
			} );
		} );
		function ultvideo() {
			$( '.ult-video' ).each( function () {
				this.nodeClass = '.' + $( this ).attr( 'id' );
				const outer_wrap = jQuery( this.nodeClass ).find(
					'.ultv-video__outer-wrap'
				);

				outer_wrap.off( 'click' ).on( 'click', function ( e ) {
					const selector = $( this ).find( '.ultv-video__play' );
					ultvideo_play( selector );
				} );
				if (
					'1' == outer_wrap.data( 'autoplay' ) ||
					true == outer_wrap.data( 'device' )
				) {
					ultvideo_play(
						jQuery( this.nodeClass ).find( '.ultv-video__play' )
					);
				}
			} );
		}
		function ultvideo_play( selector ) {
			const iframe = $( '<iframe/>' );
			const vurl = selector.data( 'src' );
			if ( 0 == selector.find( 'iframe' ).length ) {
				iframe.attr( 'src', vurl );
				iframe.attr( 'frameborder', '0' );
				iframe.attr( 'allowfullscreen', '1' );
				iframe.attr( 'allow', 'autoplay;encrypted-media;' );

				selector.html( iframe );
			}
			selector
				.closest( '.ultv-video__outer-wrap' )
				.find( '.ultv-vimeo-wrap' )
				.hide();
		}
	} )( jQuery );



});
