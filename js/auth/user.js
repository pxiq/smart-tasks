system.use("com.joyent.Resource");

enable("Sessions");

var User = new Resource('user', {
  '@constructor': function( aUsername ) {
    if (!aUsername) throw new Error("Username is required");
    if( aUsername == User.username ) {
      this.id = aUsername;
    } else {
      throw new Error("Username missmatch, try again!")
    }
  }
});

User.transient = true;
// We can change this values by whatever we want:
User.username = 'admin';
User.password = 'e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4'; // secret

User.prototype.authenticate = function( aPassword, theStack ) {
  if ( system.digest.sha1.hex( aPassword ) == User.password ) {
    theStack.session.userid = this.id;
    theStack.user = this;
    theStack.session.save();
  } else {
    throw new Error("Password missmatch");
  }
};
