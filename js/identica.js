GET('/identi.ca', function() {
  return template("search.html");
});

POST('/identi.ca', function() {
  this.entries = new Array();
  uri = system.sprintf("http://identi.ca/api/search.atom?q=%s", this.request.body.search)
  response = system.http.request('GET', uri);
  if ( response.code == 200 && response.content ) {
    var feedXML = response.content.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, ""); // bug 336551
    var atom = Namespace("http://www.w3.org/2005/Atom");
    var feed = new XML(feedXML);
    var entry;
    for each (entry in feed.atom::entry) {
      var anEntry = {
        title: entry.atom::title.toString(),
        author: {
          name: entry.atom::author.atom::name.toString(),
          uri: entry.atom::author.atom::uri.toString()
        }
      };
      for each (link in entry.atom::link) {
        if (link.@rel == 'alternate' && link.@type == 'text/html') {
          anEntry.alternate = link.@href;
        } else if (link.@rel == 'related' && link.@type == "image/png") {
          anEntry.icon = link.@href;
        }
      }
      this.entries.push(anEntry);
    }
  return template("results.html");
  }
});


