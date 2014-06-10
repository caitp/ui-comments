/**
 * Created by Ariel Mashraki
 */

function githubService($http){
  var origin = 'http://api.github.com',
    fetchUsers = function(query){
      return $http({
        method: 'JSONP',
        url : origin + '/search/users?callback=JSON_CALLBACK',
        params: {q: query}
      });
    };
//  var fetchRepositories = function(){}
  return {
    fetchUsers: fetchUsers
  }
}
