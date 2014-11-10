 var app = { 

    initialize: function() {
	// Application Constructor	
		this.loggedin = false;

        this.bindEvents();
		
		this.setupURLS();
		
		this.route();
    },

    setupURLS: function() {
	// Setup RegEx URLs of our routes
		this.loginURL = /#login/;
		this.registerURL = /#register/;
		this.overviewURL = /#overview/;
    },

    bindEvents: function() {
    // Bind all our events
    	document.addEventListener('deviceready', this.onDeviceReady, false); //cordova
    	$(window).hashchange( this.route );	//temp for without cordova
    },
	
    onDeviceReady: function() {
    // When everything is loaded, do this
        $(window).on('hashchange', $.proxy(this.route, this));
    },
	
	
    route: function() {
    // route is called when a link is clicked
	    var hash = window.location.hash;
	    
	    render('login', {}, "le error", {});
	    return;

	    if (!this.loggedin){
	    	if (hash.match(app.registerURL)){
	    		//Process register
	    		var rv = new RegisterView(document.getElementById('login').value, document.getElementById('pass').value, document.getElementById('firstname').value, document.getElementById('lastname').value);
	    		return;
	    	} else if (hash.match(app.loginURL) || hash.match("")){
	    		//Process login
	    		var lv = new LoginView(document.getElementById('login').value, document.getElementById('pass').value);
	    		return;
	    	} else {
		    	//Just show register as failsave
		    	console.log('ERROR Invalid URL while not logged in: ' + hash);
		    	render('login', {});
	    		return;
	    	}
    	} else {
		    //-- we are sure user is logged in from now on
		    var match = hash.match(app.overviewURL);
		    if (match) {
		        render('overview', {});
				return;
		    }

    	    console.log('ERROR Invalid URL while logged in: ' + hash);
	    	render('overview', {});
	    	return;
		}
    }
};
