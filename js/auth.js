system.use("auth.user")

before(function () {
	if ( this.session.userid ) {
		try {
      this.user = new User( this.session.userid );
    } catch(e) {
      delete this.session.userid;
      this.session.save();
    }
	}
	
	if( !this.user ) {
		
		if ( this.request.uri != '/login' && this.request.uri != '/' && this.request.uri != '/index.html' && !this.request.uri.match(/^\/[js|images|css]/)){
			this.session.redirect_to = this.request.uri;
			this.session.save();
			return redirect('/login');
		}
	}
	
});

GET('/login', function () {
	return template("login.html");
});

POST('/login', function () {
	try {
		aUser = new User( this.request.body.username );
		aUser.authenticate( this.request.body.password, this );
	} catch (e) {
		this.error = e;
    return template("login.html");
	}
	return redirect(this.session.redirect_to);
});

GET("/logout", function() {
  delete this.session.userid;
  this.session.save();
  redirect("/");
});
