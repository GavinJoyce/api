import Ember from "ember";
import config from '../config/environment';

const { Route, RSVP, inject } = Ember;

export default Route.extend({
  ajax: inject.service(),
  
  model(){
    var libraries, versions;
    var library  = this.get('ajax').request('docs/index.json');

    if (!config.singleLibraryEmbedded) {
      libraries = this.get('ajax').request('/config/libraries.json');
      versions = this.get('ajax').request('%@/versions.json'.fmt(config.projectName));
    }

    return RSVP.hash({
      library: library,
      libraries: libraries,
      versions: versions
    }).then(function(responses){
      var library = responses.library;
      library.libraries = responses.libraries;
      library.versions = responses.versions;

      return library;
    });
  },
  actions: {
    versionChanged(version){
      var parser = document.createElement('a');
      parser.href = window.location;

      var port = parser.port ? ":%@".fmt(parser.port) : "";
      var location = [parser.protocol, '//', parser.hostname, port, '/', config.projectName, '/', version].join('');

      window.location = location;
    }
  }
});
