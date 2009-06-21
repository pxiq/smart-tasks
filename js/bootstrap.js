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
  this.response.code = 201;
  return redirect('/tasks/' + this.task.id);
});

GET(/\/tasks\/(.+)\/?$/, function( anId ) {
  try {
    this.task = Task.get( anId );
  } catch(e) {
    this.task = { id: null, title: null, notes: "no such task" };
  }
  return template("task.html");
});
