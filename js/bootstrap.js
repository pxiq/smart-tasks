system.use("com.joyent.Sammy");
system.use("com.joyent.Resource");

var Task = new Resource('task');

GET("/", function() {
  return redirect("/index.html");
});

GET(/\/tasks\/new\/?$/, function() {
  return template("form.html");
});
