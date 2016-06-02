angular.module('reverseFilter', []).filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});