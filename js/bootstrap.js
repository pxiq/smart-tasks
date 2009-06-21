system.use("com.joyent.Sammy");
system.use("com.joyent.Resource");

var Task = new Resource('task');

// Do not return 404!
GET("/", function() {
  return redirect("/index.html");
});
// Form for a new Task:
GET(/\/tasks\/new\/?$/, function() {
  return template("form.html");
});
// Tasks list:
GET(/\/tasks\/?$/, function() {
	var tasks = Task.search({});
	if ( tasks.length ) {
		this.tasks = tasks;
		return template("list.html");
	} else {
		redirect('/tasks/new');
	}
});

// Create a new Task:
POST(/\/tasks\/?$/, function() {
  this.task = new Task();
  this.task.notes = this.request.body.notes;
  this.task.title = this.request.body.title;

  this.task.save();
  this.response.code = 201;
  return redirect('/tasks/' + this.task.id);
});
// Single task show:
GET(/\/tasks\/(.+)\/?$/, function( anId ) {
  try {
    this.task = Task.get( anId );
  } catch(e) {
    this.task = { id: null, title: null, notes: "no such task" };
  }
  return template("task.html");
});
