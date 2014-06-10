function typeheadDirective() {
  return {
    restrict: 'E',
    link: function(scope, elm, att) {
      scope.handleSelection = function(val) {
        scope.child.name = val;
        scope.selected = true;
      };
    },
    template: '<ul class="nav nav-pills nav-stacked" ng-hide="selected">' +
      '<li ng-repeat="item in items | filter:item track by $index" ng-click="handleSelection(item.login)" class="pointer">' +
      '<img class="avatar_img" ng-src="{{ item.avatar_url }}"/> <a>{{ item.login }}</a></li>' +
      '</ul>'
  };
}

