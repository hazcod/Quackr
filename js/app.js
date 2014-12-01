var app = {
    initialize: function() {
	// Application Constructor
		//Setup authenticator
		log('Setting up auth0Lock');
		this.lock = new Auth0Lock('vmUb00t7jWrGtysEAiyX6CwC5XlgRR4Y', 'quackr.auth0.com');

		this.model = new Model();

		this.setupURLS();

		this.setupAJAX();

		this.loggedin = (localStorage.getItem('userID') != null);
		if (this.loggedin == true){
			log('retrieving profile..');
			this.userProfile = this.model.getProfile();
			log(this.userProfile);
			if (!this.userProfile) {
				log('Token has expired.');
				setInfoMessage('Your session has expired.');
				app.loggedin = false;
			}
		}

		this.bindEvents();
		this.route(); //!!! temporary for testing
    },

    setupURLS: function() {
	// Setup RegEx URLs of our routes
		this.loginURL = /#login/;
		this.dologinURL = /#dologin/;
		this.registerURL = /#register/;
		this.doregisterURL = /#doregister/;
		this.overviewURL = /#overview/;
		this.logoutURL = /#logout/;
		this.exitURL = /#exit/;
		this.categoriesURL = /#categories/;
		this.categoryURL = /#questions/;
    },

    bindEvents: function() {
    // Bind all our events
    	document.addEventListener('deviceready', this.onDeviceReady, false); //cordova
    	this.onDeviceReady(); //temp cuz no cordova
    },

    setupAJAX: function() {
    // Setup secure AjaX calls
        log('Setting up secure AjaX calls');
        $.ajaxSetup({
		  'beforeSend': function(xhr) {
		    if (localStorage.getItem('userToken')) {
		      xhr.setRequestHeader('AUTHORIZATION', 'Bearer ' + localStorage.getItem('userToken'));
		      if (app.userProfile){
			      xhr.setRequestHeader('ID', app.userProfile.user_id);
			  }
		    }
		  }
		});
    },

    onDeviceReady: function() {
    // When everything is loaded, do this
    	//Setup routing
    	log('Setting up routes');
        $(window).on('hashchange', $.proxy(this.route, this));
    },

    logout: function() {
    	app.loggedin = false;
    	localStorage.removeItem('token');
    	localStorage.removeItem('userID');
		userProfile = null;
		redirect('login');
    },


    route: function() {
    // route is called when a link is clicked
	    var hash = window.location.hash;
	    if (hash.match(app.exitURL)){
	    	if(navigator.app){
        		navigator.app.exitApp();
			} else if(navigator.device){
        		navigator.device.exitApp();
			}
	    } else
	    if (!app.loggedin){
	    	log('user not logged in');
	    	if (hash.match(app.registerURL)){
	    		//Process register
	    		var rv = new RegisterView();
				return;
	    	} else if (hash.match(app.doregisterURL)) {
    			var rv = new RegisterView(document.getElementById('login').value, document.getElementById('pass').value, document.getElementById('firstname').value, document.getElementById('lastname').value);
	    		return;
	    	} else if (hash.match(app.dologinURL)) {
	    		var lv = new LoginView(document.getElementById('login').value, document.getElementById('pass').value);
	    		return;
	    	} else {
	    		//Process login
	    		var lv = new LoginView();
	    		return;
	    	}
    	} else {
    		log('user is logged in!');
		    //-- we are sure user is logged in from now on
		    if (hash.match(app.logoutURL)){
		    	this.logout();
		    	return;
		    } else if (hash.match(app.categoriesURL)){
		    	var cv = new CategoriesView();
		    	return;
		    } else if (hash.match(app.categoryURL)){
		    	var idmatch = /\?id=(\d+)/;
		    	var id = hash.match(idmatch)[1];
		    	log('category id: ' + id);
		    	if (id){
		    		var cv = new CategoryView(id);
		    	} else {
		    		setErrorMessage("No category chosen!");
		    		redirect("#overview");
		    	}
		    } else {
		    	var ov = new OverviewView();
		    	return;
		    }
		}
    }

};
