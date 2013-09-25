angular.module("views/comment.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/comment.html",
    "<div class=\"container comment\">\n" +
    "  <div class=\"page-header\">\n" +
    "    <div class=\"comment-header\">\n" +
    "      <h4 class=\"comment-user\">\n" +
    "        <span class=\"comment-username\" ng-if=\"!comment.profileUrl\">{{comment.name}}</span>\n" +
    "        <a class=\"comment-username\" ng-if=\"comment.profileUrl\" ng-href=\"{{comment.profileUrl}}\" title=\"{{comment.name}}\">{{comment.name}}</a>\n" +
    "        <small class=\"comment-date\" ng-if=\"comment.date\" title=\"{{comment.date | calendar}}\">{{comment.date | timeago}}</small>\n" +
    "       </h4>\n" +
    "      <img class=\"comment-avatar\" ng-if=\"comment.avatarUrl\" ng-src=\"{{comment.avatarUrl}}\" alt=\"{{comment.name}}\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"container comment-body\" ng-bind=\"comment.text\"></div>\n" +
    "  </div>\n" +
    "  <child-comments comment-data=\"comment.children\"></child-comments>\n" +
    "</div>");
}]);

angular.module("views/comments.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/comments.html",
    "<div class=\"comments panel panel-default\">\n" +
    "  <comment ng-repeat=\"comment in self.commentData\" comment-data=\"comment\"></comment>\n" +
    "</div>\n" +
    "");
}]);

angular.module('commentsDemo', ['views/comments.html', 'views/comment.html', 'ui.comments'])

.constant('commentsConfig', {
  containerTemplate: 'views/comments.html',
  commentTemplate: 'views/comment.html'
})

.controller('DemoCtrl', function($scope) {
  $scope.data = {};
  $scope.data.comments = [
    {
      name: '@caitp',
      date: new Date(),
      profileUrl: 'https://github.com/caitp',
      text: 'UI-Comments is designed to simplify the process of creating comment systems similar to Reddit, Imgur or Discuss in AngularJS.',
      children: [
        {
          name: '@caitp',
          date: new Date(),
          profileUrl: 'https://github.com/caitp',
          text: 'We support nested comments'
        }
      ]
    }
  ]
})

.filter('timeago', function() {
  return function(date) {
    return moment(date).fromNow();
  };
})
.filter('calendar', function() {
  return function(date) {
    return moment(date).calendar();
  };
});
