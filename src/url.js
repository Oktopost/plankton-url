require('../namespace').namespace('Plankton', function(root) {
	'use strict';

	
	var is		= root.Plankton.is;
	var obj		= root.Plankton.obj;
	var array	= root.Plankton.array;
	
	
	/**
	 * @name Plankton.url
	 */
	var url = {};


	/**
	 * @param {string|*} path
	 * @param {{}=} params
	 * @returns {string}
	 */
	url.encode = function (path, params) {
		var queryParams	= {};
		var link		= path.toString();
		var encodedLink	= '';
		var addSlash	= false;
		var queryParts	= [];
		
		obj.forEach.pair(params, function (key, value) {
			if (is.bool(value)) {
				params[key] = (value ? '1' : '0');
			}
		});
		
		obj.forEach.pair(params, function (key, value) {
			if (link.indexOf('{' + key + '}') === -1) {
				queryParams[key] = value;
				return;
			}
			
			link = link.replace(new RegExp('{' + key + '}', 'g'), value.toString());
		});
		
		array.forEach(link.split('/'), function (part) {
			if (addSlash) {
				encodedLink += '/';
			} else {
				addSlash = true;
			}
			
			encodedLink += encodeURIComponent(part);
		});
		
		if (!is(queryParams)) {
			return encodedLink;
		}
		
		obj.forEach.pair(queryParams, function (key, value) {
			queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
		});
		
		return encodedLink + '?' + queryParts.join('&');
	};

	/**
	 * @param {string} url
	 * @returns {{ uri: string, path: string[], params: {} }}
	 */
	url.decode = function (url) {
		var data	= url.split('?');
		var path	= [];
		var params	= {};
		var uri		= data[0];
		
		
		if (data.length === 1) {
			data = [ data[0], '' ];
		} else if (data.length > 2) {
			data = [ data[0], data.splice(1).join('?') ];
		}
		
		array.forEach(data[0].split('/'), function (pathPart) {
			if (pathPart.length !== 0) {
				path.push(decodeURIComponent(pathPart));
			}
		});
		
		array.forEach(data[1].split('&'), function (queryExpression) {
			var query	= queryExpression.split('=');
			var key		= decodeURIComponent(query[0]);
			var value;
			
			if (key.length === 0) {
				return;	
			} if (query.length === 1) {
				value = '';
			} else if (query.length > 2) {
				value = decodeURIComponent(query.splice(1).join('='));
			} else {
				value = decodeURIComponent(query[1]);
			}
			
			params[key] = value;
		});
		
		return {
			uri:	uri,
			path:	path,
			params:	params
		};
	};
	
	
	this.url = url;
});