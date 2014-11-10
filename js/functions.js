function render(tmpl_name, tmpl_data, error, info) {
// Load our template using AJAX and insert our template data
	if ( !render.tmpl_cache ) { 
		render.tmpl_cache = {};
	}

	if ( ! render.tmpl_cache[tmpl_name] ) {
		var tmpl_dir = 'js/templates';
		var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

		var tmpl_string;
		$.ajax({
			url: tmpl_url,
			method: 'GET',
			async: false,
			dataType: 'html',
			success: function(data) {
				tmpl_string = data;
			}
		});				
		render.tmpl_cache[tmpl_name] = _.template(tmpl_string);												
	}

	var templatedata = [];
	if (tmpl_data){
		templatedata = $.extend(templatedata, tmpl_data);
	}

	if (error){
		$.extend(templatedata, {msg: error, type: "error"});
	} else if (info) {
		$.extend(templatedata, {msg: info, type: "info"});
	}

	var rendered = render.tmpl_cache[tmpl_name](templatedata);
	//To create the jQuery classes styling, the Create event must be triggered.
	$('#maincontainer').html(rendered).trigger('create');
}