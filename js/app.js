function unescape(html, $sanitize) {
  if (!html) return '';
  html = html.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace();
  return $sanitize ? $sanitize(html) : html;
}

angular.module("views/comment.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/comment.html",
    "<div class=\"container comment\">\n" +
    "  <div class=\"page-header\">\n" +
    "    <div class=\"comment-header\">\n" +
    "      <button ng-if=\"comment.children\" class=\"icon-2x clear-square glyphicon\" " +
    "              ng-class=\"{'icon-minus-sign-alt': !collapsed, 'icon-plus-sign-alt': collapsed}\" " + 
    "              title=\"toggle children\" ng-click=\"collapse()\"></button>" +
    "      <button ng-if=\"!comment.children\" class=\"icon-2x clear-square\"></button>" +
    "      <h4 class=\"comment-user\">\n" +
    "        <span class=\"comment-username\" ng-if=\"!comment.profileUrl\">{{comment.name}}</span>\n" +
    "        <a class=\"comment-username\" ng-if=\"comment.profileUrl\" ng-href=\"{{comment.profileUrl}}\" " +
    "           title=\"{{comment.name}}\">{{comment.name}}</a>\n" +
    "        <small class=\"comment-date\" ng-if=\"comment.date\" title=\"{{comment.date | calendar}}\">" +
    "          {{comment.date | timeago}}" +
    "        </small>\n" +
    "      </h4>\n" +
    "      <img class=\"comment-avatar\" ng-if=\"comment.avatarUrl\" ng-src=\"{{comment.avatarUrl}}\" " +
    "           alt=\"{{comment.name}}\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"comment-body\" ng-bind-html=\"comment.text\"></div>" +
    "  <div comments-transclude></div>" +
    "</div>");
}]);

angular.module("views/comments.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/comments.html",
    "<div class=\"comments panel panel-default\">\n" +
    "  <comment ng-repeat=\"comment in comments\" comment-data=\"comment\"></comment>\n" +
    "</div>\n" +
    "");
}]);

angular.module('commentsDemo', ['ngRoute', 'ngSanitize', 'views/comments.html', 'views/comment.html', 'ui.comments'])
.config(function($rootScopeProvider, $sceDelegateProvider) {
  //$rootScopeProvider.digestTtl(100);
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    /.*\.redditmedia\.com.*/
  ]);
})
.run(function($rootScope) {
  $rootScope.baseUrl = window.location.href.replace(window.location.hash, '');
})

.config(function(commentsConfigProvider) {
  commentsConfigProvider.set({
    containerTemplate: 'views/comments.html',
    commentTemplate: 'views/comment.html',
    commentController: 'CommentCtrl'
  });
})

.controller('CommentCtrl', function($scope, $element, $timeout) {
  var children;
  $scope.collapsed = true;
  $scope.$on('$filledNestedComments', function(nodes) {
    children = nodes;
    children.collapse('hide');
    // This is a really stupid hack, Angular really needs to provide a better
    // way to do this sort of thing :(
    $timeout(function() {
      children.collapse('hide');
    }, 500);
  });
  $scope.$on('$emptiedNestedComments', function(nodes) {
    children = undefined;
  });
  $scope.collapse = function() {
    $scope.collapsed = children.hasClass('in');
    children.collapse('toggle');
  };
})

.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/demo.html',
    controller: 'DemoCtrl'
  });
})

.controller('DemoCtrl', function($scope, $rootScope) {
  $rootScope.demo = true;
  $rootScope.reddit = false;
  $rootScope.subreddit = false;
  $rootScope.article = false;
  $scope.comments = [
    {
      name: '@caitp',
      date: new Date(),
      profileUrl: 'https://github.com/caitp',
      text: 'UI-Comments is designed to simplify the process of creating comment systems similar to Reddit, Imgur or Discuss in AngularJS.',
      children: [{
        name: '@bizarro-caitp',
        date: new Date(),
        profileUrl: 'https://github.com/bizarro-caitp',
        text: 'We support nested comments, in a very simple fashion. It\'s great!',
        children: [{
          name: '@caitp',
          date: new Date(),
          profileUrl: 'https://github.com/caitp',
          text: 'These nested comments can descend arbitrarily deep, into many levels. This can be used to reflect a long and detailed conversation about typical folly which occurs in comments',
          children: [{
            name: '@bizarro-caitp',
            date: new Date(),
            profileUrl: 'https://github.com/bizarro-caitp',
            text: 'Having deep conversations on the internet can be used to drive and derive data about important topics, from marketing demographic information to political affiliation and even sexual orientation if you care to find out about that. Isn\'t that exciting?'
          }]
        },{
          name: '@bizarro-caitp',
          date: new Date(),
          profileUrl: 'https://github.com/bizarro-caitp',
          text: 'Is it REALLY all that wonderful? People tend to populate comments with innane nonsense that ought to get them hellbanned!',
          comments: [{
            name: '@caitp',
            date: new Date(),
            profileUrl: 'https://github.com/caitp',
            text: 'Oh whatever lady, whatever'
          }]
        }]
      }]
    }, {
      name: '@caitp',
      date: new Date(),
      profileUrl: 'https://github.com/caitp',
      text: 'We can have multiple threads of comments at a given moment...',
    }, {
      name: '@bizarro-caitp',
      date: new Date(),
      profileUrl: 'https://github.com/bizarro-caitp',
      text: 'We can do other fancy things too, maybe...',
      children: [{
        name: '@caitp',
        date: new Date(),
        profileUrl: 'https://github.com/caitp',
        text: '...other fancy things, you say?',
      }, {
        name: '@caitp',
        date: new Date(),
        profileUrl: 'https://github.com/caitp',
        text: 'suddenly I\'m all curious, what else can we do...',
        children: [{
          name: '@bizarro-caitp',
          date: new Date(),
          profileUrl: 'https://github.com/bizarro-caitp',
          text: 'Oh, you\'ll see...',
        }]
      }]
    }]
})

.config(function($routeProvider) {
  var route = {
    templateUrl: 'views/reddit.html',
    controller: 'RedditCtrl',
    resolve: {
      popular: function($http, $rootScope) {
        return $http.jsonp('http://api.reddit.com/subreddits/popular.json?limit=10&jsonp=JSON_CALLBACK',
          {cache: true})
        .then(function(res) {
          if (!res.status || !res.data || res.status >= 400 || res.status < 200) {
            return [];
          }
          return $.map(res.data.data.children, mapSubreddits);
          function mapSubreddits(item) {
            var name = item.data.url.replace(/^\//, '');
            return {
              name: name,
              description: item.data.public_description,
              short_description: item.data.public_description.length > 140
                               ? item.data.public_description.substring(0, 140) + ' ...'
                               : item.data.public_description,
              subscribers: item.data.subscribers,
              sfw: !item.data.over18,
              url: $rootScope.baseUrl + '#/' + name
            };
          }
        });
      }
    }
  };
  $routeProvider.when('/r', route).when('/reddit', route);
})

.controller('RedditCtrl', function($scope, $rootScope, $http, $location, popular) {
  $rootScope.demo = false;
  $rootScope.reddit = true;
  $rootScope.subreddit = false;
  $rootScope.article = false;
  $scope.name = '';
  $scope.popular = popular;
  $scope.go = function(name) {
    var escaped = escape(name);
    $http.jsonp('http://api.reddit.com/r/'+ escaped +'/about.json' +
              '?jsonp=JSON_CALLBACK', {cache: true})
    .success(function(data) {
      $location.path('/r/' + escaped);
    });
  };
})

.config(function($routeProvider) {
  $routeProvider.when('/r/:subreddit', {
    templateUrl: 'views/subreddit.html',
    controller: 'SubRedditCtrl',
    resolve: {
      subreddit: function($route, $http) {
        delete $http.defaults.headers.common['X-Requested-With'];
        return $http.jsonp('http://api.reddit.com/r/'+$route.current.params.subreddit+'/hot.json' +
          '?jsonp=JSON_CALLBACK&limit=10', {cache: true});
      },
      about: function($route, $http) {
        delete $http.defaults.headers.common['X-Requested-With'];
        return $http.jsonp('http://api.reddit.com/r/'+$route.current.params.subreddit+'/about.json' +
          '?jsonp=JSON_CALLBACK', {cache: true});
      }
    }
  });
})

.controller('SubRedditCtrl', function($scope, subreddit, about, $rootScope) {
  if (angular.isFunction(subreddit.headers)) {
    subreddit = subreddit.data;
  }
  if (angular.isFunction(about.headers)) {
    about = about.data;
  }
  $scope.subreddit = 'r/' + about.data.display_name;
  $scope.description = about.data.public_description || about.data.description || "";
  var articles = subreddit && subreddit.data && subreddit.data.children && subreddit.data.children;
  $scope.articles = $.map(articles, mapArticles) || [];

  $rootScope.demo = false;
  $rootScope.reddit = false;
  $rootScope.subreddit = $scope.subreddit;
  $rootScope.article = false;

  function mapArticles(item) {
    return {
      domain: item.data.domain,
      author: '@' + item.data.author,
      profileUrl: 'http://www.reddit.com/user/' + item.data.author + '/',
      score: item.data.score,
      thumbnail: (item.data.thumbnail !== "self" && item.data.thumbnail) || undefined,
      title: item.data.title,
      url: item.data.url,
      id: item.data.id,
      comments: $scope.baseUrl + '#/' + $scope.subreddit + '/' + item.data.id
    };
  }
})

.config(function($routeProvider) {
  $routeProvider.when('/r/:subreddit/:article', {
    templateUrl: 'views/article.html',
    controller: 'RedditArticleCtrl',
    resolve: {
      article: function($route, $http, $q, $sanitize) {
        delete $http.defaults.headers.common['X-Requested-With'];
        var promises = {
          comments: $http.jsonp('http://api.reddit.com/r/'+$route.current.params.subreddit+'/comments/' +
            $route.current.params.article + '.json?limit=10&jsonp=JSON_CALLBACK', {cache: true}),
          about: $http.jsonp('http://api.reddit.com/r/'+$route.current.params.subreddit+'/about.json' +
            '?jsonp=JSON_CALLBACK', {cache: true})
        };

        return $q.all(promises).then(setup);

        function setup(data) {
          var comments = data.comments, about = data.about;
          if (angular.isFunction(comments.headers)) {
            comments = comments.data;
          }
          if (angular.isFunction(about.headers)) {
            about = about.data;
          }
          var article = angular.isArray(comments) && angular.isObject(comments[0].data) && comments[0].data;
              comments = angular.isArray(comments) && comments.length > 0 &&
                         angular.isObject(comments[1].data) && comments[1].data;
          article = angular.isArray(article.children) && article.children.length && article.children[0];
          article = article.data;
    
          return {
            subreddit: about.data.display_name.replace(/^\/?r\//, ''),
            description: about.data.public_description || about.data.description || "",
            comments: comments && $.map(comments.children, mapComments),
            url: article ? article.url : "#",
            title: article.title || "Invalid article",
            selftext: article && unescape(article.selftext_html, $sanitize),
            thumbnail: (article.thumbnail !== "self" && article.thumbnail) || undefined,
            id: article.id
          };

          function mapComments(item) {
            if (!item.data || !item.data.author) {
              return undefined;
            }
            var children = angular.isObject(item) && angular.isObject(item.data) && angular.isObject(item.data.replies) &&
                angular.isObject(item.data.replies.data) && angular.isArray(item.data.replies.data.children) &&
                item.data.replies.data.children;
            return {
              name: '@' + item.data.author,
              date: new Date(item.data.created_utc * 1000),
              profileUrl: 'http://www.reddit.com/user/' + item.data.author + '/',
              text: unescape(item.data.body_html, $sanitize),
              children: $.map(children, mapComments) || []
            };
          }
        }
      }
    }
  });
})

.controller('RedditArticleCtrl', function($scope, article, $rootScope) {
  angular.extend($scope, article);
  $rootScope.demo = false;
  $rootScope.reddit = false;
  $rootScope.subreddit = article.subreddit;
  $rootScope.article = article.id;
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
