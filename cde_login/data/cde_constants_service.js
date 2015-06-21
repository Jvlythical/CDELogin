
/*
 *   Keys must be delimited by underscores
 *   Values should be delimited by dashes
 *
 */

'use strict';

app.factory('CDEConstants', [function() {

	var bind = function($scope) {

		$scope.LEFT_COL = 'file_nav_col';
		$scope.CENTER_COL = 'editor_col';
		$scope.RIGHT_COL = 'apps_col';
		$scope.EDITOR = 'editor_wrapper';
		$scope.ACTIVE_FILE = 'file_tab_active';
		$scope.INACTIVE_FILE = 'file_tab_inactive';

		$scope.Constants = {
		
			// Adminstrative
			'EXEC_STATE_SLEEPING' : 0,
			'EXEC_STATE_READY' : 1,
			'EXEC_STATE_WAITING' : 2,
			'EXEC_STATE_DEAD' : 3,
			'T_USER' : 'user',
			'T_DEMO' : 'demo',
			'T_TEMP' : 'temp',
			'T_INTRO' : 'intro',
			
			// Display
			'FILE_NAV_WRAPPER' : 'file_nav_wrapper',
			'FILE_NAV_CONTAINER' : 'file_nav_container',
			'OVERLAY' : 'black_screen',
			'BACKGROUND' : 'background_div',
			'THREE_COL' : '3_col_split',

			// Progressbars
			'EXEC_PROGRESSBAR' : 'exec-progress'
		}
		
		$scope.ADT = {
			'File' : {
				'id' : undefined,
				'name' : undefined,
				'path' : undefined,
				'rtime' : undefined,
				'wtime' : undefined,
				'etime' : undefined,
				'open' : undefined
			},
			'Commit' : {
				'offset' : undefined,
				'id' : undefined,
				'additions' : '',
				'deletions' : '',
				'style' : undefined
			}

		}

	}

	return  {
		'bind' : bind
	}
		
}]);
