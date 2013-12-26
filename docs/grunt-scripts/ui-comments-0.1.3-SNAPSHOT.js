angular.module('ui.comments', [
  'ui.comments.tpls',
  'ui.comments.directive'
]);
angular.module('ui.comments.tpls', [
  'template/comments/comment.html',
  'template/comments/comments.html'
]);
angular.module('ui.comments.directive', []).provider('commentsConfig', function () {
  var config = {
      containerTemplate: 'template/comments/comments.html',
      commentTemplate: 'template/comments/comment.html',
      orderBy: 'best',
      commentController: undefined,
      depthLimit: 5
    };
  var emptyController = function () {
  };
  function stringSetter(setting, value) {
    if (typeof value === 'string') {
      config[setting] = value;
    }
  }
  function controllerSetter(setting, value) {
    if (value && (angular.isString(value) && value.length || angular.isFunction(value) || angular.isArray(value))) {
      config[setting] = value;
    } else {
      config[setting] = emptyController;
    }
  }
  function numberSetter(setting, value) {
    if (typeof value === 'number') {
      config[setting] = value;
    }
  }
  var setters = {
      'containerTemplate': stringSetter,
      'commentTemplate': stringSetter,
      'orderBy': stringSetter,
      'commentController': controllerSetter,
      'depthLimit': numberSetter
    };
  this.$get = function () {
    return config;
  };
  this.set = function (name, value) {
    var fn, key, props, i;
    if (typeof name === 'string') {
      fn = setters[name];
      if (fn) {
        fn(name, value);
      }
    } else if (typeof name === 'object') {
      props = Object.keys(name);
      for (i = 0; i < props.length; ++i) {
        key = props[i];
        fn = setters[key];
        if (fn) {
          fn(key, name[key]);
        }
      }
    }
  };
}).directive('comments', [
  '$compile',
  '$interpolate',
  'commentsConfig',
  function ($compile, $interpolate, commentsConfig) {
    return {
      restrict: 'EA',
      require: '?^comment',
      transclude: true,
      replace: true,
      templateUrl: function () {
        return commentsConfig.containerTemplate;
      },
      scope: { 'comments': '=commentData' },
      controller: function () {
      },
      link: {
        pre: function (scope, elem, attr, comment) {
          var self = elem.controller('comments'), parentCollection = comment ? comment.comments : null;
          if (parentCollection) {
            self.commentsDepth = parentCollection.commentsDepth + 1;
            self.commentsRoot = parentCollection.commentsRoot;
            self.commentsParent = parentCollection;
          } else {
            self.commentsDepth = 1;
            self.commentsRoot = null;
            var depthLimit = angular.isDefined(attr.commentDepthLimit) ? attr.commentDepthLimit : commentsConfig.depthLimit;
            if (typeof depthLimit === 'string') {
              depthLimit = $interpolate(depthLimit, false)(scope.$parent);
              if (typeof depthLimit === 'string') {
                depthLimit = parseInt(depthLimit, 10);
              }
            }
            if (typeof depthLimit !== 'number' || depthLimit !== depthLimit) {
              depthLimit = 0;
            }
            self.commentsDepthLimit = depthLimit;
          }
          scope.commentsDepth = self.commentsDepth;
          attr.$observe('orderBy', function (newval, oldval) {
            scope.commentOrder = newval || commentsConfig.orderBy;
          });
        }
      }
    };
  }
]).directive('comment', [
  '$compile',
  'commentsConfig',
  '$controller',
  '$exceptionHandler',
  '$timeout',
  function ($compile, commentsConfig, $controller, $exceptionHandler, $timeout) {
    return {
      require: [
        '^comments',
        'comment'
      ],
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: function () {
        return commentsConfig.commentTemplate;
      },
      scope: { comment: '=commentData' },
      controller: [
        '$scope',
        function ($scope) {
        }
      ],
      link: function (scope, elem, attr, ctrls) {
        var comments = ctrls[0], comment = ctrls[1];
        var controller = commentsConfig.commentController, controllerInstance;
        scope.commentDepth = comments.commentsDepth;
        scope.commentDepthLimit = (comments.commentsRoot || comments).commentsDepthLimit;
        comment.comments = comments;
        if (controller) {
          controllerInstance = $controller(controller, {
            '$scope': scope,
            '$element': elem
          });
          if (controllerInstance) {
            elem.data('$CommentController', controllerInstance);
          }
        }
        if (elem.parent().attr('child-comments') === 'true') {
          elem.addClass('child-comment');
        }
        var children = false, compiled, sub = $compile('<div comments child-comments="true" ' + 'comment-data="comment.children"></div>'), transclude;
        function notify(scope, name, data) {
          if (!controllerInstance) {
            return;
          }
          var namedListeners = scope.$$listeners[name] || [], i, length, args = [data];
          for (i = 0, length = namedListeners.length; i < length; i++) {
            if (!namedListeners[i]) {
              namedListeners.splice(i, 1);
              i--;
              length--;
              continue;
            }
            try {
              namedListeners[i].apply(null, args);
            } catch (e) {
              $exceptionHandler(e);
            }
          }
        }
        function update(data) {
          if (!angular.isArray(data)) {
            data = [];
          }
          if (data.length > 0 && !children) {
            if (comments.commentsDepth >= (comments.commentsRoot || comments).commentsDepthLimit) {
              notify(scope, '$depthLimitComments', scope.comment);
              return;
            }
            compiled = sub(scope, function (dom) {
              if (comment.commentsTransclude) {
                transclude = comment.commentsTransclude.clone(true);
                comment.commentsTransclude.replaceWith(dom);
              } else {
                elem.append(dom);
              }
            });
            children = true;
            notify(scope, '$filledNestedComments', compiled);
          } else if (!data.length && children) {
            children = false;
            if (comment.commentsTransclude && transclude) {
              compiled.replaceWith(transclude);
            } else {
              compiled.remove();
            }
            notify(scope, '$emptiedNestedComments', comment.commentsTransclude || elem);
            transclude = compiled = undefined;
          }
        }
        scope.$watch('comment', function (newval) {
          update(scope.comment.children);
        }, true);
      }
    };
  }
]).directive('commentsTransclude', function () {
  return {
    restrict: 'EA',
    require: '^comment',
    link: function (scope, element, attr, comment) {
      attr.$addClass('comments-transclude');
      comment.commentsTransclude = element;
    }
  };
});
angular.module('template/comments/comment.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('template/comments/comment.html', '<div class="comment">\n' + '  <div class="comment-header">\n' + '    <span class="comment-user">\n' + '      <a class="comment-username" ng-if="comment.profileUrl" ng-href="{{comment.profileUrl}}" title="{{comment.name}}">{{comment.name}}</a>\n' + '      <img class="comment-avatar" ng-if="comment.avatarUrl" ng-src="{{comment.avatarUrl}}" alt="{{comment.name}}" />\n' + '      <span class="comment-username" ng-if="!comment.profileUrl">{{comment.name}}</span>\n' + '      <span class="comment-date" ng-if="comment.date">{{comment.date}}</span>\n' + '  </div>\n' + '  <div class="comment-body">\n' + '    <div ng-bind="comment.text"></div>\n' + '    <div comments-transclude comment-data="comment.children"></div>\n' + '  </div>\n' + '</div>');
  }
]);
angular.module('template/comments/comments.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('template/comments/comments.html', '<div class="comments">\n' + '  <comment ng-repeat="comment in comments" comment-data="comment"></comment>\n' + '</div>\n' + '');
  }
]);