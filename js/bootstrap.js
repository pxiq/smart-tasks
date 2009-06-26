system.use("com.joyent.Sammy");
system.use("com.joyent.Resource");
system.use("org.json.json2");

var Task = new Resource('task', {
  '@save': function() {
    if (!this.completed) {
      this.completed = 0;
    }
    var tasks = Task.search({});
    if (!this.position) {
      this.position = ( tasks.length ) ? ( tasks.length + 1 ) : 1;
    }
  },
  '@remove': function() {
    var nextTasks = Task.search({ position: [ { '>': this.position } ] }, {sort: 'position'});
    nextTasks.forEach(function( aTask ){
      var theTask = Task.get( aTask.id );
      theTask.position--;
      theTask.save();
    });
  }
});

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
  // Temporary while we set values for position:
  var allTheTasks = Task.search({}, {sort: 'created'});
  for (var i=0; i < allTheTasks.length; i++) {
    var theTask = Task.get( allTheTasks[i].id );
    if (!theTask.position) {
      theTask.position = i + 1;
      theTask.save();
    }
  }
  var tasks = ( this.request.query.completed ) ? Task.search({}, {sort: 'position'}) : Task.search({completed: {'!=': 1}}, {sort: 'position'});
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

// Web form to edit existing task:
GET(/\/tasks\/(.+)\/edit\/?$/, function( anId ) {
  try {
    this.task = Task.get( anId );
  } catch(e) {
    this.task = { id: null, title: null, notes: null };
  }
  return template("form.html");
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

// Update a task:
PUT(/\/tasks\/(.+)/, function( anId ) {
  try {
    this.task = Task.get( anId );
    if ( this.request.body.title ) {
      this.task.notes = this.request.body.notes;
      this.task.title = this.request.body.title;
    } else { // This is a "complete" task request:
      this.task.completed = ( this.request.body.completed ) ? 1 : 0;
    }
    this.task.save();
    return JSON.stringify( { ok: true } );
  } catch(e) {
    return JSON.stringify( { ok: false } );
  }
});

// Delete a task:
DELETE(/\/tasks\/(.+)$/, function( anId ) {
  this.response.mime = 'application/json';
  try {
    this.task = Task.get( anId );
    this.task.remove();
    return JSON.stringify( { ok: true } );
  } catch(e) {
    return JSON.stringify( { ok: false } );
  }
});

// Reorder tasks
PUT(/\/tasks\/?$/, function() {
  try {
    var tasksSorted = this.request.content.replace(/^task\[\]=/, '').split('&task[]=');
    for ( var i=0; i < tasksSorted.length; i++ ) {
      var theTask = Task.get( tasksSorted[i] );
      theTask.position = i + 1;
      theTask.save();
    }
    return JSON.stringify( { ok: true } );
  } catch (e) {
    return JSON.stringify( { ok: false } );
  }
});
