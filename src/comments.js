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

.provider('commentsConfig', function() {
  var config = {
    containerTemplate: 'template/comments/comments.html',
    commentTemplate: 'template/comments/comment.html',
    orderBy: 'best',
    commentController: undefined
  };
  var emptyController = function() {};
  function stringSetter(setting, value) {
    if (typeof value === 'string') {
      config[setting] = value;
    }
  }
  function controllerSetter(setting, value) {
    if (value && typeof value === 'string' ||
        typeof value === 'function' ||
        angular.isArray(value)) {
      config[setting] = value;
    } else {
      config[setting] = emptyController;
    }
  }
  
  var setters = {
    'containerTemplate': stringSetter,
    'commentTemplate': stringSetter,
    'orderBy': stringSetter,
    'commentController': controllerSetter
  };
  this.$get = function() {
    return config;
  };
  this.set = function(name, value) {
    var fn, key, props, i;
    if (typeof name === 'string') {
      fn = setters[name];
      if (fn) {
        fn(name, value);
      }
    } else if (typeof name === 'object') {
      props = Object.keys(name);
      for(i=0; i<props.length; ++i) {
        key = props[i];
        fn = setters[key];
        if (fn) {
          fn(key, name[key]);
        }
      }
    }
  };
})

.directive('comments', function($compile, commentsConfig) {
  return {
    restrict: 'EA',
    require: '?^comment',
    transclude: true,
    replace: true,
    templateUrl: function() { return commentsConfig.containerTemplate; },
    scope: true,
    controller: function($scope) {},
    compile: function() {
      return function(scope, elem, attr, CommentsCtrl, CommentCtrl) {
        var isDef = angular.isDefined, $eval = scope.$eval, children = false;
        scope.self = {};
        scope.$watchCollection(attr.commentData, function(newval, oldval) {
          scope.self.commentData = angular.isArray(newval) ? newval : [];
        });
        attr.$observe('orderBy', function(newval, oldval) {
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
    templateUrl: function() { return commentsConfig.commentTemplate; },
    controller: function($scope, $controller, commentsConfig) {
      var unregister = $scope.$watch('$element', function($element) {
        unregister();
        unregister = undefined;
        var controller = commentsConfig.commentController,
            controllerInstance;
        if (controller) {
          controllerInstance = $controller(controller, {
            '$scope': $scope
          });
          if (controllerInstance) {
            $element.data('$commentController', controllerInstance);
          }
        }
      });
    },
    compile: function(scope, elem) {
      return function(scope, elem, attr, comments) {
        if (elem.parent().attr('child-comments') === 'true') {
          elem.addClass('child-comment');
        }
        scope.comment = scope.$eval(attr.commentData);
        var children = false, compiled, sub =
        angular.element('<comments child-comments="true" ' +
                        'comment-data="comment.children"></comments>');
        scope.$element = elem;
        function update(data) {
          if (angular.isArray(data) && data.length > 0 && !children) {
            compiled = $compile(sub)(scope);
            scope.$element.append(compiled);
            scope.$element.triggerHandler('comments.filled');
            children = true;
          } else if((!angular.isArray(data) || !data.length) && children) {
            children = false;
            compiled.remove();
            compiled = undefined;
            scope.$element.triggerHandler('comments.emptied');
          }
        }

        scope.$watchCollection(attr.commentData, function(newval) {
          scope.comment = newval;
          update(scope.comment.children);
        });
      };
    }
  };
});