system.use("com.joyent.Sammy");
system.use("com.joyent.Resource");

var Task = new Resource('task');

GET("/", function() {
  return redirect("/index.html");
});

GET(/\/tasks\/new\/?$/, function() {
  return template("form.html");
});

POST(/\/tasks\/?$/, function() {
  this.task = new Task();
  this.task.notes = this.request.body.notes;
  this.task.title = this.request.body.title;

	this.task.save();
  return template("task.html");
});
