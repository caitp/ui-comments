angular.module('ui.comments.directive', [])

//
// Default template fields:
// 
// date    The comment post date
// text    The comment text
// name    The commenter's name
// avatar  The URL for an avatar
// url     The URL for a user profile
//

.constant('commentsConfig', {
  containerTemplate: 'template/comments/comments.html',
  commentTemplate: 'template/comments/comment.html',
  orderBy: 'best'
})

.directive('comments', function($compile, commentsConfig) {
  return {
    restrict: 'EA',
    require: '?^comment',
    transclude: true,
    replace: true,
    templateUrl: commentsConfig.containerTemplate,
    scope: true,
    controller: function($scope) {},
    compile: function() {
      return function(scope, elem, attr, CommentsCtrl, CommentCtrl) {
        var isDef = angular.isDefined, $eval = scope.$eval, children = false;
        scope.self = {};
        scope.$watchCollection(attr.commentData, function(newval, oldval) {
          scope.self.commentData = angular.isArray(newval) ? newval : [];
        });
        scope.$watch(attr.orderBy, function(newval, oldval) {
          scope.self.commentOrder = newval || commentsConfig.orderBy;
        });
      };
    }
  };
})

.directive('comment', function($compile, commentsConfig) {
  return {
    require: '^comments',
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: commentsConfig.commentTemplate,
    compile: function() {
      return function(scope, elem, attr, comments) {
        if (elem.parent().attr('child-comments') === 'true') {
          elem.addClass('child-comment');
        }
        scope.comment = scope.$eval(attr.commentData);
        var children = false;

        function update(data) {
          if (angular.isArray(data) && data.length > 0 && !children) {
            var e = angular.element;
            elem.append(
              e('<comments child-comments="true" comment-data="comment.children"></comments>')
            );
            elem = $compile(elem)(scope);
            children = true;
          } else if((!angular.isArray(data) || !data.length) && children) {
            children = false;
            elem.html('');
          }
        }

        scope.$watch(attr.commentData, function(newval) {
          scope.comment = newval;
          update(scope.comment.children);
        });
      };
    }
  };
});