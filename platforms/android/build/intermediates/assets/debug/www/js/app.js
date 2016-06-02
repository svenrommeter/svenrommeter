// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','reverseFilter'])


.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
      db = $cordovaSQLite.openDB( { name: "my.db", location:'default'});
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users (id integer primary key, name text, user_id integer)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS current (id integer primary key, user_id integer)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS results (id integer primary key, name text, user_id integer, result_id integer, last_update text, neck_flexion text, neck_extension text, neck_lateral_flexion text, neck_rotation text, left_shoulder_flexion text, left_shoulder_extension text, left_shoulder_abduction text, left_shoulder_internal_rotation text, left_shoulder_external_rotation text, right_shoulder_flexion text, right_shoulder_extension text, right_shoulder_abduction text, right_shoulder_internal_rotation text, right_shoulder_external_rotation text, left_elbow_flexion text, left_elbow_supination text, left_elbow_pronation text, left_wrist_flexion text, left_wrist_extension text, left_wrist_radial_deviation text, left_wrist_ulnar_deviation text, left_hip_flexion text, left_hip_extension text, left_hip_abduction text, left_hip_adduction text, left_knee_flexion text, left_ankle_dorsiflexion text, left_ankle_plantar_flexion text, left_ankle_inversion text, left_ankle_eversion text, right_elbow_flexion text, right_elbow_supination text, right_elbow_pronation text, right_wrist_flexion text, right_wrist_extension text, right_wrist_radial_deviation text, right_wrist_ulnar_deviation text, right_hip_flexion text, right_hip_extension text, right_hip_abduction text, right_hip_adduction text, right_knee_flexion text, right_ankle_dorsiflexion text, right_ankle_plantar_flexion text, right_ankle_inversion text, right_ankle_eversion text, trunk_flexion text, trunk_extension text, trunk_lateral_flexion text, trunk_rotation text)");
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.navBar.alignTitle('center');

  $stateProvider
    .state('eventmenu', {
          url: "/event",
          abstract: true,
          templateUrl: "templates/event-menu.html"
        })
        .state('report', {
          url: "/report",
          cache:false,
              templateUrl: "templates/report.html",
              controller: 'ReportController'
        })
        .state('help', {
          url: "/help",
              templateUrl: "templates/help.html",
              controller: 'ReportController'
        })
        .state('user_list', {
          url: "/user_list",
          cache:false,
              templateUrl: "templates/user_list.html",
              controller: 'ManageUsersController'
        })
        .state('about_us', {
          url: "/about_us",
          cache:false,
              templateUrl: "templates/about_us.html",
              controller: 'EmptyController'
        })
        .state('user_delete', {
          url: "/user_delete",
          cache:false,
              templateUrl: "templates/user_delete.html",
              controller: 'ManageUsersController'
        })
        .state('report_mgmt', {
          url: "/report_mgmt",
          cache:false,
              templateUrl: "templates/report_mgmt.html",
              controller: 'ManageReportsController'
        })
    .state('home', {
      cache: false,
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
    })
    .state('eventmenu.body', {
      url: '/body',
      views: {
        'menuContent' :{
          templateUrl: "templates/body.html",
          controller: "BodyController"
        }
      }
    })
    .state('video', {
      cache: false,
      url: '/video/:source',
      params:{
        source:{value: "default"},
      },
          templateUrl: 'templates/video.html',
          controller: 'VideoController'
    })
    .state('neck', {
      url: '/modal_neck',
      templateUrl: 'templates/modal_neck.html',
      controller: 'ModalsController'
    })
    .state('trunk', {
      url: '/modal_trunk',
      templateUrl: 'templates/modal_trunk.html',
      controller: 'ModalsController'
    })
    .state('left_shoulder', {
      url: '/modal_left_shoulder',
      templateUrl: 'templates/modal_left_shoulder.html',
      controller: 'ModalsController'
    })
    .state('right_shoulder', {
      url: '/modal_right_shoulder',
      templateUrl: 'templates/modal_right_shoulder.html',
      controller: 'ModalsController'
    })
    .state('left_elbow', {
      url: '/modal_left_elbow',
      templateUrl: 'templates/modal_left_elbow.html',
      controller: 'ModalsController'
    })
    .state('right_elbow', {
      url: '/modal_right_elbow',
      templateUrl: 'templates/modal_right_elbow.html',
      controller: 'ModalsController'
    })
    .state('left_ankle', {
      url: '/modal_left_ankle',
      templateUrl: 'templates/modal_left_ankle.html',
      controller: 'ModalsController'
    })
    .state('right_ankle', {
      url: '/modal_right_ankle',
      templateUrl: 'templates/modal_right_ankle.html',
      controller: 'ModalsController'
    })
    .state('left_hip', {
      url: '/modal_left_hip',
      templateUrl: 'templates/modal_left_hip.html',
      controller: 'ModalsController'
    })
    .state('right_hip', {
      url: '/modal_right_hip',
      templateUrl: 'templates/modal_right_hip.html',
      controller: 'ModalsController'
    })
    .state('left_wrist', {
      url: '/modal_left_wrist',
      templateUrl: 'templates/modal_left_wrist.html',
      controller: 'ModalsController'
    })
    .state('right_wrist', {
      url: '/modal_right_wrist',
      templateUrl: 'templates/modal_right_wrist.html',
      controller: 'ModalsController'
    })
    .state('left_knee', {
      url: '/modal_left_knee',
      templateUrl: 'templates/modal_left_knee.html',
      controller: 'ModalsController'
    })
    .state('right_knee', {
      url: '/modal_right_knee',
      templateUrl: 'templates/modal_right_knee.html',
      controller: 'ModalsController'
    })
    .state('load_report', {
      cache: false,
      url: '/load_report/:report_id',
      params:{
        report_id:{value: "default"},
      },
        templateUrl: 'templates/load_report.html',
        controller: 'LoadReportController'
    })

    .state('measurement_mode_1', {
      cache: false,
      url: '/measurement_mode_1/:jname?movement?joint?gen_mov',
      params:{
        jname:{value: "default"},
        movement:{value: "default"},
        joint:{value: "default"},
        gen_mov:{value: "default"},
      },
        templateUrl: 'templates/measurement_mode_1.html',
        controller: 'MotionController_1'
    })
    .state('measurement_mode_2', {
      cache: false,
      url: '/measurement_mode_2/:jname?movement?joint?gen_mov',
      params:{
        jname:{value: "default"},
        movement:{value: "default"},
        joint:{value: "default"},
        gen_mov:{value: "default"},
      },
        templateUrl: 'templates/measurement_mode_2.html',
        controller: 'MotionController_2'
    })
    .state('measurement_mode_3', {
      cache: false,
      url: '/measurement_mode_3/:jname?movement?joint?gen_mov',
      params:{
        jname:{value: "default"},
        movement:{value: "default"},
        joint:{value: "default"},
        gen_mov:{value: "default"},
      },
        templateUrl: 'templates/measurement_mode_3.html',
        controller: 'MotionController_3'
    });
 
  $urlRouterProvider.otherwise("/home");

});
