app.factory('CDEWrite', [function() {
	
	var debug_flag = 1;

	var displayBlackScreen = function() {

		var OVERLAY = 'black_screen';
		var $black_screen = $('#' + OVERLAY);

		$black_screen.css('display', 'block');

		$(document).off('keyup');
		$(document).on('keyup', function(event) {
				if(event.which == 27) {
					$black_screen.empty();
					$black_screen.css('display', 'none');
				}
		});
	}
	
	return function(message, format, description) {
		var format_ar = {
			'console' : 0,
			'black_screen' : 1,
			'alert' : 2,
			'progressbar' : 3
		}
		
		if(format_ar[format] == undefined) {
			console.log('Unable to display the message!');
			return false;
		}
		
		switch(format_ar[format]) {
			case 0:
				
				if(description != undefined) 
					message = description + message;

				if(debug_flag)	
					console.log(message);

				break;
			case 1:
				displayBlackScreen();
				return OVERLAY;
			case 2: 
				if(description != undefined) message = description + message;
				alert(message);
				break;
			case 3:
				var $target = $('#' + description);

				if(message == 0) {
					$target.find('.progress').remove();
					return false;
				}

  			var ele = 
  				'<div class="progress progress-striped active" style="border-radius:1px; margin:0;">' +
  					'<div class="progress-bar progress-bar-info" role="progressbar" ' + 
  						'aria-valuenow="' + message + '" aria-valuemin="0" aria-valuemax="100"' +
  						'style="width: ' + message + '%">' +
   	 					'<span class="sr-only">' + message + '% Complete</span>' + 
   	 				'</div>' + 
   	 			'</div>';


   	 		$target.html(ele);

   	 		break;
			default:
				break;
		}
	}

}]);
