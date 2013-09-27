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
      commentController: undefined
    };
  var emptyController = function () {
  };
  function stringSetter(setting, value) {
    if (typeof value === 'string') {
      config[setting] = value;
    }
  }
  function controllerSetter(setting, value) {
    if (value && typeof value === 'string' || typeof value === 'function' || angular.isArray(value)) {
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
  'commentsConfig',
  function ($compile, commentsConfig) {
    return {
      restrict: 'EA',
      require: '?^comment',
      transclude: true,
      replace: true,
      templateUrl: function () {
        return commentsConfig.containerTemplate;
      },
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
          attr.$observe('orderBy', function (newval, oldval) {
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
      templateUrl: function () {
        return commentsConfig.commentTemplate;
      },
      controller: [
        '$scope',
        '$controller',
        'commentsConfig',
        function ($scope, $controller, commentsConfig) {
          var unregister = $scope.$watch('$element', function ($element) {
              unregister();
              unregister = undefined;
              var controller = commentsConfig.commentController, controllerInstance;
              if (controller) {
                controllerInstance = $controller(controller, { '$scope': $scope });
                if (controllerInstance) {
                  $element.data('$commentController', controllerInstance);
                }
              }
            });
        }
      ],
      compile: function (scope, elem) {
        return function (scope, elem, attr, comments) {
          if (elem.parent().attr('child-comments') === 'true') {
            elem.addClass('child-comment');
          }
          scope.comment = scope.$eval(attr.commentData);
          var children = false, compiled, sub = angular.element('<comments child-comments="true" ' + 'comment-data="comment.children"></comments>');
          scope.$element = elem;
          function update(data) {
            if (angular.isArray(data) && data.length > 0 && !children) {
              compiled = $compile(sub)(scope);
              var w = scope.$watch('$$phase', function (newval) {
                  w();
                  scope.$element.append(compiled);
                  scope.$element.triggerHandler('filled.comments', compiled);
                  children = true;
                });
            } else if ((!angular.isArray(data) || !data.length) && children) {
              children = false;
              compiled.remove();
              compiled = undefined;
              scope.$element.triggerHandler('emptied.comments');
            }
          }
          scope.$watchCollection(attr.commentData, function (newval) {
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
    $templateCache.put('template/comments/comment.html', '<div class="comment">\n' + '  <div class="comment-header">\n' + '    <span class="comment-user">\n' + '      <a class="comment-username" ng-if="comment.profileUrl" ng-href="{{comment.profileUrl}}" title="{{comment.name}}">{{comment.name}}</a>\n' + '      <img class="comment-avatar" ng-if="comment.avatarUrl" ng-src="{{comment.avatarUrl}}" alt="{{comment.name}}" />\n' + '      <span class="comment-username" ng-if="!comment.profileUrl">{{comment.name}}</span>\n' + '      <span class="comment-date" ng-if="comment.date">{{comment.date}}</span>\n' + '  </div>\n' + '  <div class="comment-body" ng-bind="comment.text">\n' + '      <child-comments comment-data="comment.children"></child-comments>\n' + '  </div>\n' + '</div>');
  }
]);
angular.module('template/comments/comments.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('template/comments/comments.html', '<div class="comments">\n' + '  <comment ng-repeat="comment in self.commentData" comment-data="comment"></comment>\n' + '</div>\n' + '');
  }
]);