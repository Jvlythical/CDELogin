app.factory('CDEOut', [function() {
	
	var CDEOUT_OVERLAY = 'black_screen';
	var CDEOUT_STATUS_FAILURE = false;
	var CDEOUT_STATUS_SUCCESS = true;

	var Production = false;
	var Statuses = {};

// *** PUBLIC ***

	var init = function(config) {
		
		if(typeof(config) !== 'object')
			return CDEOUT_STATUS_FAILURE;

		if(config.Production !== undefined)
			Production = config.Production;
		
		Statuses.init = true;
	}

	var print2Console = function(sender, message) {
		
		if(message === undefined)
			return CDEOUT_STATUS_FAILURE;

		if(!Production) {	
		
			if(sender !== undefined)
				console.log(sender + message);
			else
				console.log(message);

		}

		return CDEOUT_STATUS_SUCCESS;
	}

	var print2Alert = function(sender, message) {
		
		if(message === undefined)
			return CDEOUT_STATUS_FAILURE;
		
		if(sender === undefined)
			alert(message)
		else
			alert(sender + message);

		return CDEOUT_STATUS_SUCCESS;
	}

	var displayOverlay = function() {
		
		var $overlay = $('#' + CDEOUT_OVERLAY);

		if(!$overlay.length) {
			var el = '<div id="' + CDEOUT_OVERLAY + '"></div>';
			$('body').append(el);
		} else {
			$overlay.css('display', 'block');
		}

		$(document).on('keyup', function(event) {
			if(event.which == 27) 
				removeOverlay();
		});
		
		return CDEOUT_OVERLAY;
	}

	var removeOverlay = function() {

		var $overlay = $('#' + CDEOUT_OVERLAY);

		if(!$overlay.length)
			return CDEOUT_STATUS_FAILURE;

		$(document).off('keyup');
		$overlay.empty();
		$overlay.css('display', 'none');

		return CDEOUT_STATUS_SUCCESS;
	}

	var displayProgressbar = function(id, percent) {
		
		if(id === undefined)
			return CDEOUT_STATUS_FAILURE;

		var $target = $('#' + id);

		if(!$target.length)
			return CDEOUT_STATUS_FAILURE;

		if(percent == 0) {
			
			$target.find('.progress').remove();
	
			return CDEOUT_STATUS_SUCCESS;
		}

		var ele = 
			'<div class="progress progress-striped active" style="border-radius:1px; margin:0;">' +
				'<div class="progress-bar progress-bar-info" role="progressbar" ' + 
					'aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100"' +
					'style="width: ' + percent + '%">' +
					'<span class="sr-only">' + percent + '% Complete</span>' + 
				'</div>' + 
			'</div>';

		$target.html(ele);

		return CDEOUT_STATUS_SUCCESS;
	}

	var newTab = function(href) {
		
		if(href === undefined)
			return CDEOUT_STATUS_FAILURE;

		window.open(href, '_blank');

		return CDEOUT_STATUS_SUCCESS;
	}

	return {
		'init' : init,
		'console' : print2Console,
		'alert' : print2Alert,
		'overlay' : displayOverlay,
		'removeOverlay' : removeOverlay,
		'progressbar' : displayProgressbar,
		'tab' : newTab
	}

}]);
