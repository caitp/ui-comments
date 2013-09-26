angular.module('ui.comments', [
  'ui.comments.tpls',
  'ui.comments.directive'
]);
angular.module('ui.comments.tpls', [
  'template/comments/comment.html',
  'template/comments/comments.html'
]);
angular.module('ui.comments.directive', []).constant('commentsConfig', {
  containerTemplate: 'template/comments/comments.html',
  commentTemplate: 'template/comments/comment.html',
  orderBy: 'best'
}).directive('comments', [
  '$compile',
  'commentsConfig',
  function ($compile, commentsConfig) {
    return {
      restrict: 'EA',
      require: '?^comment',
      transclude: true,
      replace: true,
      templateUrl: commentsConfig.containerTemplate,
      scope: true,
      controller: [
        '$scope',
        function ($scope) {
        }
      ],
      compile: function () {
        return function (scope, elem, attr, CommentsCtrl, CommentCtrl) {
          var isDef = angular.isDefined, $eval = scope.$eval, children = false;
          scope.self = {};
          scope.$watchCollection(attr.commentData, function (newval, oldval) {
            scope.self.commentData = angular.isArray(newval) ? newval : [];
          });
          scope.$watch(attr.orderBy, function (newval, oldval) {
            scope.self.commentOrder = newval || commentsConfig.orderBy;
          });
        };
      }
    };
  }
]).directive('comment', [
  '$compile',
  'commentsConfig',
  function ($compile, commentsConfig) {
    return {
      require: '^comments',
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: commentsConfig.commentTemplate,
      compile: function () {
        return function (scope, elem, attr, comments) {
          if (elem.parent().attr('child-comments') === 'true') {
            elem.addClass('child-comment');
          }
          scope.comment = scope.$eval(attr.commentData);
          var children = false;
          function update(data) {
            if (angular.isArray(data) && data.length > 0 && !children) {
              var e = angular.element;
              elem.append(e('<comments child-comments="true" comment-data="comment.children"></comments>'));
              elem = $compile(elem)(scope);
              children = true;
            } else if ((!angular.isArray(data) || !data.length) && children) {
              children = false;
              elem.html('');
            }
          }
          scope.$watch(attr.commentData, function (newval) {
            scope.comment = newval;
            update(scope.comment.children);
          });
        };
      }
    };
  }
]);
angular.module('template/comments/comment.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('template/comments/comment.html', '<div class="comment">\n' + '  <div class="comment-header">\n' + '    <span class="comment-user">\n' + '      <a class="comment-username" ng-if="comment.profileUrl" ng-href="comment.profileUrl" title="{{comment.name}}">{{comment.name}}</a>\n' + '      <img class="comment-avatar" ng-if="comment.avatarUrl" ng-src="comment.avatarUrl" alt="{{comment.name}}" />\n' + '      <span class="comment-username" ng-if="!comment.profileUrl">{{comment.name}}</span>\n' + '      <span class="comment-date" ng-if="comment.date">{{comment.date}}</span>\n' + '  </div>\n' + '  <div class="comment-body" ng-bind="comment.text">\n' + '      <child-comments comment-data="comment.children"></child-comments>\n' + '  </div>\n' + '</div>');
  }
]);
angular.module('template/comments/comments.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('template/comments/comments.html', '<div class="comments">\n' + '  <comment ng-repeat="comment in self.commentData" comment-data="comment"></comment>\n' + '</div>\n' + '');
  }
]);