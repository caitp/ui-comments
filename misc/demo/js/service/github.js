function githubService($http) {
  var origin = 'http://api.github.com';
  var fetchUsers = function(query) {
    return $http({
      method: 'JSONP',
      url : origin + '/search/users?callback=JSON_CALLBACK',
      params: {q: query}
    });
  };

  return {
    fetchUsers: fetchUsers
  };
}

