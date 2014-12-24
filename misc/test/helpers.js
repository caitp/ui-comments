// jasmine matcher for expecting an element to have a css class
// https://github.com/angular/angular.js/blob/master/test/matchers.js
beforeEach(function() {
  jasmine.addMatchers({
    toHaveClass: function(cls) {
      return {
        compare: function(actual, expected) {
          return {
            message: function() {
              return "Expected '" + angular.mock.dump(actual) + "' to have class '" + expected + "'.";
            },
            pass: angular.element(actual).hasClass(expected)
          };
        }
      };
    }
  });
});
