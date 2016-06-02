angular.module('starter.services', [])

.service('CurrentUser', function () {
        var current_user_name = "null";
        var current_user_id = 0;

   return {
            getCurrentUserName: function () {
                return current_user_name;
            },
            getCurrentUserId: function () {
                return current_user_id;
            },
            setCurrentUserName: function(value) {
                current_user_name = value;
            },
            setCurrentUserId: function(value) {
                current_user_id = value;
            }
      };
  });

