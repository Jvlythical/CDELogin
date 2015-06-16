app.factory('editor_data', ['$rootScope', function($rootScope) {
	return function(e_type, mode, data) {
		if(mode == undefined || e_type == undefined) return false;
		
		var mode_ar = {
			'get' : 0,
			'set' : 1,
			'get_text' : 2
		}

		try {
			switch(mode_ar[mode]) {
				case 0:
					switch(e_type) {
						case 0 : 
							if(editor == undefined) return false;
							return editor.getValue();
						case 1 :
							if(CKEDITOR.instances.editor == undefined) return false;
							else return CKEDITOR.instances.editor.getData();
						default :
							break;
					}
					break;
				case 1:
					if(data == undefined) return false;
					
					switch(e_type) {
						case 0 :
							if(editor == undefined) return false;
							var pos = editor.getCursorPosition();
							var scrollOffset = editor.session.getScrollTop();
							var sel_range = editor.session.selection.getRange();

							editor.setValue(data, -1);
							
							editor.moveCursorToPosition(pos);
							editor.session.setScrollTop(scrollOffset);
							editor.session.selection.setRange(sel_range);

							editor.resize();

							$rootScope.$broadcast('resize')
							break;
						case 1 :
							if(CKEDITOR.instances.editor == undefined) return false;
							else CKEDITOR.instances.editor.setData(data);
							break;
						case 2:
							// Firepad new data
							editor.resize();

							$rootScope.$broadcast('resize')
						default :
							break;
					}
					break;
				case 2:
					switch(e_type) {
						case 0 : 
							if(editor == undefined) return false;
							return editor.getValue();
						case 1 :
							if(CKEDITOR.instances.editor == undefined) return false;
							else return CKEDITOR.instances.editor.document.getBody().getText();
						default :
							break;
					}
					break;
				default:
					break;
			}

		} catch(err) {
			return err;
		}

		return true;
	}
}]);
