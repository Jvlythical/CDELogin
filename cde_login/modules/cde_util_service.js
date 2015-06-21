'use strict';

app.factory('CDEUtil', [function() {

	var debug_flag = false;

// *** PUBLIC ***

	var alphaHash = function(l, pos) { 
		var charCode = l.toLowerCase().charCodeAt(pos);
		var base = 'a'.charCodeAt(0);
		return charCode - base;
	};

	var argsNotUndefined = function(args, len) {

		for(var i = 0; i < len; ++i) 
			if(args[i] === undefined)
				return false;

		return true;

	}

	var checkBrowser = function () {
		var c = navigator.userAgent.search("Chrome");
    var f = navigator.userAgent.search("Firefox");
    var m8 = navigator.userAgent.search("MSIE 8.0");
    var m9 = navigator.userAgent.search("MSIE 9.0");
   	var brwsr = undefined;

    if (c > -1){
      brwsr = "Chrome";
    } else if(f > -1){
      brwsr = "Firefox";
    } else if (m9 > -1){
      brwsr ="MSIE 9.0";
    } else if (m8 > -1){
      brwsr ="MSIE 8.0";
    }

    return brwsr;
	};

	var convertUrl = function(url) {
		var params = url.substr(url.indexOf('?'));

		return 'http://' + location.host + '/#/CDE' + params;
	}

	var getActiveTab = function(TabContents) {
		for(var i in TabContents) {
			if(TabContents[i].tab_class == 'file_tab_active') 
				return TabContents[i];
		}

		return undefined;
	};

	var getParameter = function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		
		results = regex.exec(location.href);
	  
	  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var htmlspecialchars_encode = function(text) {
		var map = {
			'&' : '&amp;',
			'<' : '&lt;',
			'>' : '&gt;',
			'"' : '&quot;',
			"'" : '&#039;',
			'\n' : '<p>'
		};

  	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	};

	var htmlspecialchars_decode = function(text) {
		var map = {
			'<br/>' : '\n',
			'<br />' : '\n',
			'&amp;' : '&',
			'<' : '&lt;',
			'>' : '&gt;',
			'"' : '&quot;',
			"'" : '&#039;'
		};
		
		for(var key in map) text = text.replaceAll(map[key], key);

		return text;
	};

	var isInspectOpen = function() {
    console.profile(); 
    console.profileEnd(); 
    
    if (console.clear) console.clear();
    return console.profiles.length > 0;
	};

// *** PRIVATE ***

/* ---------------------------
 *   Util public API
 *   	~ Returns an object
 * ---------------------------
 */

	return {
		'alphaHash' : alphaHash,
		'argsNotUndefined' : argsNotUndefined,
		'checkBrowser' : checkBrowser,
		'convertUrl' : convertUrl,
		'getActiveTab' : getActiveTab,
		'getParameter' : getParameter,
		'htmlspecialchars_encode' : htmlspecialchars_encode,
		'htmlspecialchars_decode' : htmlspecialchars_decode,
		'isInspectOpen' : isInspectOpen,
	}

}]);
