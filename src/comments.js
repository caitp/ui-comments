angular.module('ui.comments.directive', [])

/**
 * @ngdoc service
 * @name ui.comments.commentsConfig
 * @function
 *
 * @description
 *
 * The commentsConfig service offers a provider which may be injected
 * into config blocks:
 *
 * <pre>
 * angular.module('example', ['ui.comments'])
 * .config(function(commentsConfig) {
 *   commentsConfig.set('commentController', 'MyController');
 *   commentsConfig.set({
 *     containerTemplate: 'my/custom/views/comments.html'
 *   });
 * });
 * </pre>
 *
 * Injected as a service, it is simply the configuration object in its current state.
 *
 * It is wise not to write to the service outside of config blocks, because the
 * <code>set()</code> method provides some safety checks to ensure that only valid values are
 * written. It should not be necessary for an application to inject commentsConfig anywhere
 * except config blocks.
 */
.provider('commentsConfig', function() {
  var config = {
    /**
     * @ngdoc property
     * @name ui.comments.commentsConfig#containerTemplate
     * @propertyOf ui.comments.commentsConfig
     *
     * @description
     *
     * The template URL for collections of comments. Support for inline templates is not yet
     * available, and so this must be a valid URL or cached ng-template
     */
    containerTemplate: 'template/comments/comments.html',
    /**
     * @ngdoc property
     * @name ui.comments.commentsConfig#commentTemplate
     * @propertyOf ui.comments.commentsConfig
     *
     * @description
     *
     * The template URL for a single comment. Support for inline templates is not yet
     * available, and so this must be a valid URL or cached ng-template
     *
     * If this template manually includes a {@link ui.comments.directive:comments comments}
     * directive, it will result in an infinite $compile loop. Instead,
     * {@link ui.comments.directive:comment comment} generates child collections programmatically.
     * Currently, these are simply appended to the body of the comment.
     */
    commentTemplate: 'template/comments/comment.html',
    /**
     * @ngdoc property
     * @name ui.comments.commentsConfig#orderBy
     * @propertyOf ui.comments.commentsConfig
     *
     * @description
     *
     * Presently, this configuration item is not actually used.
     *
     * **TODO**: Its intended purpose is to provide a default comment ordering rule. However,
     * currently there is no machinery for ordering templates at all. This is intended for a later
     * release.
     */
    orderBy: 'best',
    /**
     * @ngdoc property
     * @name ui.comments.commentsConfig#commentController
     * @propertyOf ui.comments.commentsConfig
     *
     * @description
     *
     * Custom controller to be instantiated for each comment. The instantiated controller is
     * given the property `$element` in scope. This allows the instantiated controller
     * to bind to comment events.
     *
     * The controller may be specified either as a registered controller (string), a function,
     * or by array notation.
     *
     */
    commentController: undefined
  };
  var emptyController = function() {};
  function stringSetter(setting, value) {
    if (typeof value === 'string') {
      config[setting] = value;
    }
  }
  function controllerSetter(setting, value) {
    if (value && (angular.isString(value) && value.length ||
        angular.isFunction(value) ||
        angular.isArray(value))) {
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
  
  /**
   * @ngdoc function
   * @name ui.comments.commentsConfig#set
   * @methodOf ui.comments.commentsConfig
   * @function
   *
   * @description
   *
   * _When injected into a config block_, this method allows the manipulate the comments
   * configuration.
   *
   * This method performs validation and only permits the setting of known properties, and
   * will only set values of acceptable types. Further validation, such as detecting whether or
   * not a controller is actually registered, is not performed.
   *
   * @param {string|object} name Either the name of the property to be accessed, or an object
   *                             containing keys and values to extend the configuration with.
   *
   * @param {*} value The value to set the named key to. Its type depends on the
   *                  property being set.
   *
   * @returns {undefined} Currently, this method is not chainable.
   */
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

/**
 * @ngdoc directive
 * @name ui.comments.directive:comments
 * @restrict EA
 * @element div
 * @scope
 *
 * @param {expression} comment-data Data model containing a collection of comments.
 * @param {string} order-by Override the default orderBy value.
 *
 * @description
 *
 * This directive is replaced by the transcluded
 * {@link ui.comments.commentsConfig#containerTemplate containerTemplate} from
 * {@link ui.comments.commentsConfig commentsConfig}.
 *
 * The comments container produces an isolate scope, and injected into the isolate scope is the
 * the following:
 *
 * - _comments_: Collection of comments, shared with the parent scope.
 *
 * **TODO**: Expose the child-container status in _status_, so that it may be ng-if'd in templates.
 *
 * The container should contain an `ng-repeat` directive for child comments. A very simple example
 * of the {@link ui.comments.commentsConfig#containerTemplate containerTemplate} might look like
 * the following:
 *
 * <pre>
 * <div class="comments">
 *   <comment ng-repeat="comment in comments" comment-data="comment"></comment>
 * </div>
 * </pre>
 */
.directive('comments', function($compile, commentsConfig) {
  return {
    restrict: 'EA',
    require: ['?^comment'],
    transclude: true,
    replace: true,
    templateUrl: function() { return commentsConfig.containerTemplate; },
    scope: {
      'comments': '=commentData'
    },
    controller: function() {},
    compile: function() {
      return function(scope, elem, attr, ctrl) {
        attr.$observe('orderBy', function(newval, oldval) {
          scope.commentOrder = newval || commentsConfig.orderBy;
        });
      };
    }
  };
})

/**
 * @ngdoc directive
 * @name ui.comments.directive:comment
 * @restrict EA
 * @element div
 * @scope
 *
 * @param {expression} comment-data Data model containing the specific comment.
 *
 * @description
 *
 * The {@link ui.comments.directive:comment comment} directive is primarily used automatically by
 * the {@link ui.comments.directive:comments comments} directive, by automatically
 * building comment directives for each element in the collection.
 *
 * When a {@link ui.comments.commentsConfig#commentController commentController} is specified in
 * {@link ui.comments.commentsConfig commentsConfig}, it is instantiated for each comment. The
 * comment data is exposed to scope through {@link ui.comments.directive:comment comment}, and so
 * templates may access comment properties through expressions like `comment.text`.
 *
 * An example template might look like the following:
 * <pre>
 * <div class="comment">
 *   <div class="comment-header">
 *    <a class="comment-avatar"
 *       ng-href="{{comment.profileUrl}}">
 *      <img ng-src="{{comment.avatarUrl}}"
 *           alt="{{comment.name}}" />
 *    </a>
 *    <a class="comment-username"
 *       ng-href="{{comment.profileUrl}}"
 *       title="{{comment.username}}">{{comment.name}}</a>
 *     <span class="comment-date">{{comment.date | timeAgo}}</span>
 *   </div>
 *   <div class="comment-body" ng-bind="comment.text"></div>
 * </div>
 * </pre>
 *
 * **IMPORANT**: Do **not** use the {@link ui.comments.directive:comments comments} directive in a
 * {@link ui.comments.commentsConfig#commentTemplate commentTemplate}. This will cause an
 * infinite {@link http://docs.angularjs.org/api/ng.$compile $compile} loop, and eat a lot of
 * memory.
 */
.directive('comment', function($compile, commentsConfig, $controller, $exceptionHandler, $timeout) {
  return {
    require: ['^comments', 'comment'],
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: function() { return commentsConfig.commentTemplate; },
    scope: {
      comment: '=commentData'
    },
    controller: function($scope) {},
    compile: function(scope, elem) {
      return function(scope, elem, attr, ctrls) {
        var comments = ctrls[0], comment = ctrls[1];
        var controller = commentsConfig.commentController, controllerInstance;
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
        var children = false, compiled,
            sub = angular.element('<comments child-comments="true" ' +
                        'comment-data="comment.children"></comments>'),
            transclude;
        // Notify controller without bubbling
        function notify(scope, name, data) {
          if (!controllerInstance) { return; }
          var namedListeners = scope.$$listeners[name] || [], i, length, args = [data];
          for (i=0, length=namedListeners.length; i<length; i++) {
            // if listeners were deregistered, defragment the array
            if (!namedListeners[i]) {
              namedListeners.splice(i, 1);
              i--;
              length--;
              continue;
            }
            try {
              //allow all listeners attached to the current scope to run
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
            compiled = $compile(sub)(scope);
            if (comment.commentsTransclude) {
              transclude = comment.commentsTransclude.clone(true);
              comment.commentsTransclude.replaceWith(compiled);
            } else {
              elem.append(compiled);
            }
            children = true;
            var w = scope.$watch(function() { return compiled.children().length; }, function(val) {
              if (val >= data.length) {
                w();
                notify(scope, '$filledNestedComments', compiled);
              }
            });
          } else if(!data.length && children) {
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
        
        scope.$watch('comment', function(newval) {
          update(scope.comment.children);
        }, true);
      };
    }
  };
})

/**
 * @ngdoc directive
 * @name ui.comments.directive:commentsTransclude
 * @restrict EA
 * @element div
 *
 * @description
 *
 * This directive is a helper which allows a user to specify in a
 * {@link ui.comments.directive:comment comment} template where they wish child comments to be
 * inserted.
 *
 * If this directive is not used, then the child comments are merely appended to the end of a
 * comment template, which is the behaviour of the default templates.
 *
 * It is not a literal transclusion, and so any class names or categories are completely ignored.
 * Instead, the element is replaced by a {@link ui.comments.directive:comments comments} collection
 * when comments are available.
 *
 * An example template might look like the following:
 * <pre>
 * <div class="comment">
 *   <div class="comment-header">
 *    <a class="comment-avatar"
 *       ng-href="{{comment.profileUrl}}">
 *      <img ng-src="{{comment.avatarUrl}}"
 *           alt="{{comment.name}}" />
 *    </a>
 *    <a class="comment-username"
 *       ng-href="{{comment.profileUrl}}"
 *       title="{{comment.username}}">{{comment.name}}</a>
 *     <span class="comment-date">{{comment.date | timeAgo}}</span>
 *   </div>
 *   <div class="comment-body" ng-bind="comment.text"></div>
 *   <div comments-transclude></div>
 * </div>
 * </pre>
 */
.directive('commentsTransclude', function() {
  return {
    restrict: 'EA',
    require: '^comment',
    link: {
      post: function(scope, element, attr, comment) {
        element.addClass('comments-transclude');
        comment.commentsTransclude = element;
      }
    }
  };
});