angular.module('starter.controllers', [])

.controller("HomeController", function ($scope, $rootScope, $cordovaSQLite, $ionicPlatform, CurrentUser) {

$scope.user = "Default";
$scope.user_id = 0;
$scope.display_user = "none";
$scope.exist_user = false;
$scope.user_list = [];
current_user = $scope.user;
current_user_id = $scope.user_id;

    $scope.lastUser = function () {

      var query = "SELECT * FROM current";
      $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query).then(function (res) {
              if (res.rows.length > 0) {
                  var user = res.rows.item(res.rows.length-1).user_id;
                  $scope.lastUserData(user);
              } 
          }, function (err) {
              console.error(err);
          });
      });
    }

    $scope.lastUser();

    $scope.lastUserData = function (user_id) {

      var query = "SELECT * FROM users WHERE user_id = ?";
      $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query,[user_id]).then(function (res) {
              if (res.rows.length > 0) {
                  $scope.user = res.rows.item(0).name;
                  $scope.user_id = res.rows.item(0).user_id;
                  CurrentUser.setCurrentUserName(res.rows.item(0).name);
                  CurrentUser.setCurrentUserId(res.rows.item(0).user_id);
                  $scope.display_user = "";
                  $scope.exist_user = true;
              } 
          }, function (err) {
              console.error(err);
          });
      });
    }


    // INSERT NEW USER
    $scope.insert = function (input_name) {
        var name = input_name.charAt(0).toUpperCase() + input_name.slice(1);
        var user_id = Math.floor(Math.random()*90000000) + 10000000;
        var result_id = Math.floor(Math.random()*90000000) + 10000000;
        var last_update = new Date().toLocaleDateString("en-AU",{weekday: "long", year:"numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"});
        var query_user = "INSERT INTO users (name, user_id) VALUES (?,?)";
        var query_result = "INSERT INTO results (name, user_id, result_id, last_update, neck_flexion , neck_extension , neck_lateral_flexion , neck_rotation , left_shoulder_flexion , left_shoulder_extension , left_shoulder_abduction , left_shoulder_internal_rotation , left_shoulder_external_rotation , right_shoulder_flexion , right_shoulder_extension , right_shoulder_abduction , right_shoulder_internal_rotation , right_shoulder_external_rotation , left_elbow_flexion , left_elbow_supination , left_elbow_pronation , left_wrist_flexion , left_wrist_extension , left_wrist_radial_deviation , left_wrist_ulnar_deviation , left_hip_flexion , left_hip_extension , left_hip_abduction , left_hip_adduction , left_knee_flexion , left_ankle_dorsiflexion , left_ankle_plantar_flexion , left_ankle_inversion , left_ankle_eversion , right_elbow_flexion , right_elbow_supination , right_elbow_pronation , right_wrist_flexion , right_wrist_extension , right_wrist_radial_deviation , right_wrist_ulnar_deviation , right_hip_flexion , right_hip_extension , right_hip_abduction , right_hip_adduction , right_knee_flexion , right_ankle_dorsiflexion , right_ankle_plantar_flexion , right_ankle_inversion , right_ankle_eversion , trunk_flexion , trunk_extension , trunk_lateral_flexion , trunk_rotation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, query_user, [name,user_id]).then(function (res) {
                  $scope.insertToCurrent(user_id);
                  $scope.lastUser();
                  console.log("User Added");
            }, function (err) {
                console.error(err);
            });
            $cordovaSQLite.execute(db, query_result, [name, user_id, result_id, last_update,"","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]).then(function (res) {
                console.log("Results Created");
            }, function (err) {
                console.error(err);
            });
        });
    }

    // INSERT NEW USER TO CURRENT USER
    $scope.insertToCurrent = function (user_id) {

        var query = "INSERT INTO current (user_id) VALUES (?)";
        $ionicPlatform.ready(function () {
            $cordovaSQLite.execute(db, query, [user_id]).then(function (res) {
                console.log("Current User: " + user_id);
            }, function (err) {
                console.error(err);
            });
        });
    }
})

.controller('ListCtrl', function($scope, $state) {
  $scope.changePage = function(){
    $state.go('view', {movieid: 1});
  }    
})

.controller("LoadReportController", function ($scope, $cordovaSQLite, $ionicPlatform, $q, CurrentUser, $cordovaFile, $cordovaToast, $stateParams) {

  var result = "";

    function showToast(message, duration, location) {
      $cordovaToast.show(message, duration, location).then(function(success) {
          console.log("The toast was shown");
      }, function (error) {
          console.log("The toast was not shown due to " + error);
      });
  }

  $scope.pullReport = function () {
    result_id = $stateParams.report_id;
    var query = "SELECT * FROM results WHERE result_id = ?";
    $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, query,[result_id]).then(function (res) {
            if (res.rows.length > 0) {
                $scope.result = res.rows.item(0);
                result = res.rows.item(0);
            } 
        }, function (err) {
            console.error(err);
        });
    });
  }

  $scope.pullReport();

  function createPdf(result) {
      return $q(function (resolve, reject) {
          var dd = createDocumentDefinition(result);
          pdfMake.createPdf(dd).getBuffer(function (buffer) {
          var utf8 = new Uint8Array(buffer); // Convert to UTF-8... 
          binaryArray = utf8.buffer; // Convert to Binary...
          $cordovaFile.writeFile(cordova.file.externalDataDirectory, "Report.pdf", binaryArray, true)
          .then(function (success) {
          console.log("pdf created");
          showToast("Exporting Report to PDF", "long", "center");
          exportData();
          }, function (error) {
          console.log("error");
          });
          });

      });
  };

  function exportData() {
      var blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      });
      $cordovaFile.writeFile(cordova.file.externalDataDirectory, "Report.xls", blob, true)
      .then(function (success) {
      console.log("excel created");
      sendReport();
      }, function (error) {
      console.log("error");
      });
  };

    function sendReport() {
        cordova.plugins.email.open({
          subject: 'Report',
          body:    'Measurement Report from SvenROMmeter.',
          attachments: ['file:///storage/emulated/0/Android/data/com.obk.svenometer/files/Report.pdf','file:///storage/emulated/0/Android/data/com.obk.svenometer/files/Report.xls']
        });
  };

  function createDocumentDefinition(result) {
    var dd = {
      content: [
            { text: 'Measurements Report', style: 'subheader' },
            {
                style: 'tableExample',
                table: {
                    widths: [200, 120, '*', '*'],
                    body: [
                        [ { text: 'Movement', style: 'tableHeader', alignment: 'center' }, { text: 'Expected Range', style: 'tableHeader', alignment: 'center' },{ text: 'Left', style: 'tableHeader', alignment: 'center' }, { text: 'Right', style: 'tableHeader', alignment: 'center' }],
                        [ { text: 'Neck', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '70º', alignment: 'center' },{ text: result.neck_flexion, alignment: 'center', colSpan: 2 }, ''],
                        ['Extension',{ text: '70º', alignment: 'center' },{ text: result.neck_extension, alignment: 'center', colSpan: 2 },''],
                        ['Lateral Flexion',{ text: '70º', alignment: 'center' },{ text: result.neck_lateral_flexion, alignment: 'center', colSpan: 2 },''],
                        ['Rotation',{ text: '70º', alignment: 'center' },{ text: result.neck_rotation, alignment: 'center', colSpan: 2 },''],
                        [{ text: 'Shoulder', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '180º', alignment: 'center' },{ text: result.left_shoulder_flexion, alignment: 'center' },{ text: result.right_shoulder_flexion, alignment: 'center' }],
                        ['Extension',{ text: '60º', alignment: 'center' },{ text: result.left_shoulder_extension, alignment: 'center' },{ text: result.right_shoulder_extension, alignment: 'center' }],
                        ['Abduction',{ text: '180º', alignment: 'center' },{ text: result.left_shoulder_abduction, alignment: 'center' },{ text: result.right_shoulder_abduction, alignment: 'center' }],
                        ['Internal Rotation',{ text: '80º', alignment: 'center' },{ text: result.left_shoulder_internal_rotation, alignment: 'center' },{ text: result.right_shoulder_internal_rotation, alignment: 'center' }],
                        ['External Rotation',{ text: '60º', alignment: 'center' },{ text: result.left_shoulder_external_rotation, alignment: 'center' },{ text: result.right_shoulder_external_rotation, alignment: 'center' }],
                        [ { text: 'Elbow & Forearm', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion/Extension',{ text: '150º', alignment: 'center' },{ text: result.left_elbow_flexion, alignment: 'center' },{ text: result.right_elbow_flexion, alignment: 'center' }],
                        ['Supination',{ text: '80º', alignment: 'center' },{ text: result.left_elbow_supination, alignment: 'center' },{ text: result.right_elbow_supination, alignment: 'center' }],
                        ['Pronation',{ text: '80º', alignment: 'center' },{ text: result.left_elbow_pronation, alignment: 'center' },{ text: result.right_elbow_pronation, alignment: 'center' }],
                        [ { text: 'Wrist', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '0-80º', alignment: 'center' },{ text: result.left_wrist_flexion, alignment: 'center' },{ text: result.right_wrist_flexion, alignment: 'center' }],
                        ['Extension',{ text: '0-70º', alignment: 'center' },{ text: result.left_wrist_extension, alignment: 'center' },{ text: result.right_wrist_extension, alignment: 'center' }],
                        ['Radial Deviation',{ text: '0-20º', alignment: 'center' },{ text: result.left_wrist_radial_deviation, alignment: 'center' },{ text: result.right_wrist_radial_deviation, alignment: 'center' }],
                        ['Ulnar Deviation',{ text: '0-30º', alignment: 'center' },{ text: result.left_wrist_ulnar_deviation, alignment: 'center' },{ text: result.right_wrist_ulnar_deviation, alignment: 'center' }],
                        [ { text: 'Trunk', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '', alignment: 'center' },{ text: result.trunk_flexion, alignment: 'center', colSpan: 2 },''],
                        ['Extension',{ text: '', alignment: 'center' },{ text: result.trunk_extension, alignment: 'center', colSpan: 2 },''],
                        ['Lateral Flexion',{ text: '', alignment: 'center' },{ text: result.trunk_lateral_flexion, alignment: 'center', colSpan: 2 },''],
                        ['Rotation',{ text: '', alignment: 'center' },{ text: result.trunk_rotation, alignment: 'center', colSpan: 2 },''],
                        [ { text: 'Hip', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '120º', alignment: 'center' },{ text: result.left_hip_flexion, alignment: 'center' },{ text: result.right_hip_flexion, alignment: 'center' }],
                        ['Extension',{ text: '30º', alignment: 'center' },{ text: result.left_hip_extension, alignment: 'center' },{ text: result.right_hip_extension, alignment: 'center' }],
                        ['Abduction',{ text: '45º', alignment: 'center' },{ text: result.left_hip_abduction, alignment: 'center' },{ text: result.right_hip_abduction, alignment: 'center' }],
                        ['Adduction',{ text: '30º', alignment: 'center' },{ text: result.left_hip_adduction, alignment: 'center' },{ text: result.right_hip_adduction, alignment: 'center' }],
                        [ { text: 'Knee', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion/Extension',{ text: '135º', alignment: 'center' },{ text: result.left_knee_flexion, alignment: 'center' },{ text: result.right_knee_flexion, alignment: 'center' }],
                        [ { text: 'Ankle', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' },'',''],
                        ['Dorsiflexion',{ text: '20º', alignment: 'center' },{ text: result.left_ankle_dorsiflexion, alignment: 'center' },{ text: result.right_ankle_dorsiflexion, alignment: 'center' }],
                        ['Plantar Flexion',{ text: '50º', alignment: 'center' },{ text: result.left_ankle_plantar_flexion, alignment: 'center' },{ text: result.right_ankle_plantar_flexion, alignment: 'center' }],
                        ['Inversion',{ text: '35º', alignment: 'center' },{ text: result.left_ankle_inversion, alignment: 'center' },{ text: result.right_ankle_inversion, alignment: 'center' }],
                        ['Eversion',{ text: '15º', alignment: 'center' },{ text: result.left_ankle_eversion, alignment: 'center' },{ text: result.right_ankle_eversion, alignment: 'center' }],
                    ]       
                }
            },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    }

      return dd;
  };

  $scope.generate_pdf = function(){
  createPdf(result);
  }

})///END

.controller("ReportController", function ($scope, $cordovaSQLite, $ionicPlatform, $q, CurrentUser, $cordovaFile, $cordovaToast) {

  var result = "";

    function showToast(message, duration, location) {
      $cordovaToast.show(message, duration, location).then(function(success) {
          console.log("The toast was shown");
      }, function (error) {
          console.log("The toast was not shown due to " + error);
      });
  }

  $scope.pullReport = function () {
    user_id =  parseInt(CurrentUser.getCurrentUserId());
    var query = "SELECT * FROM results WHERE user_id = ?";
    $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, query,[user_id]).then(function (res) {
            if (res.rows.length > 0) {
                $scope.result = res.rows.item(0);
                result = res.rows.item(0);
            } 
        }, function (err) {
            console.error(err);
        });
    });
  }

  $scope.pullReport();

  function createPdf(result) {
      return $q(function (resolve, reject) {
          var dd = createDocumentDefinition(result);
          pdfMake.createPdf(dd).getBuffer(function (buffer) {
          var utf8 = new Uint8Array(buffer); // Convert to UTF-8... 
          binaryArray = utf8.buffer; // Convert to Binary...
          $cordovaFile.writeFile(cordova.file.externalDataDirectory, "Report.pdf", binaryArray, true)
          .then(function (success) {
          console.log("pdf created");
          showToast("Exporting Report to PDF", "long", "center");
          exportData();
          }, function (error) {
          console.log("error");
          });
          });

      });
  };

  function exportData() {
      var blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      });
      $cordovaFile.writeFile(cordova.file.externalDataDirectory, "Report.xls", blob, true)
      .then(function (success) {
      console.log("excel created");
      sendReport();
      }, function (error) {
      console.log("error");
      });
  };

    function sendReport() {
        cordova.plugins.email.open({
          subject: 'Report',
          body:    'Measurement Report from SvenROMmeter.',
          attachments: ['file:///storage/emulated/0/Android/data/com.obk.svenometer/files/Report.pdf','file:///storage/emulated/0/Android/data/com.obk.svenometer/files/Report.xls']
        });
  };

  function createDocumentDefinition(result) {
    var dd = {
      content: [
            { text: 'Measurements Report', style: 'subheader' },
            {
                style: 'tableExample',
                table: {
                    widths: [200, 120, '*', '*'],
                    body: [
                        [ { text: 'Movement', style: 'tableHeader', alignment: 'center' }, { text: 'Expected Range', style: 'tableHeader', alignment: 'center' },{ text: 'Left', style: 'tableHeader', alignment: 'center' }, { text: 'Right', style: 'tableHeader', alignment: 'center' }],
                        [ { text: 'Neck', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '70º', alignment: 'center' },{ text: result.neck_flexion, alignment: 'center', colSpan: 2 }, ''],
                        ['Extension',{ text: '70º', alignment: 'center' },{ text: result.neck_extension, alignment: 'center', colSpan: 2 },''],
                        ['Lateral Flexion',{ text: '70º', alignment: 'center' },{ text: result.neck_lateral_flexion, alignment: 'center', colSpan: 2 },''],
                        ['Rotation',{ text: '70º', alignment: 'center' },{ text: result.neck_rotation, alignment: 'center', colSpan: 2 },''],
                        [{ text: 'Shoulder', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '180º', alignment: 'center' },{ text: result.left_shoulder_flexion, alignment: 'center' },{ text: result.right_shoulder_flexion, alignment: 'center' }],
                        ['Extension',{ text: '60º', alignment: 'center' },{ text: result.left_shoulder_extension, alignment: 'center' },{ text: result.right_shoulder_extension, alignment: 'center' }],
                        ['Abduction',{ text: '180º', alignment: 'center' },{ text: result.left_shoulder_abduction, alignment: 'center' },{ text: result.right_shoulder_abduction, alignment: 'center' }],
                        ['Internal Rotation',{ text: '80º', alignment: 'center' },{ text: result.left_shoulder_internal_rotation, alignment: 'center' },{ text: result.right_shoulder_internal_rotation, alignment: 'center' }],
                        ['External Rotation',{ text: '60º', alignment: 'center' },{ text: result.left_shoulder_external_rotation, alignment: 'center' },{ text: result.right_shoulder_external_rotation, alignment: 'center' }],
                        [ { text: 'Elbow & Forearm', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion/Extension',{ text: '150º', alignment: 'center' },{ text: result.left_elbow_flexion, alignment: 'center' },{ text: result.right_elbow_flexion, alignment: 'center' }],
                        ['Supination',{ text: '80º', alignment: 'center' },{ text: result.left_elbow_supination, alignment: 'center' },{ text: result.right_elbow_supination, alignment: 'center' }],
                        ['Pronation',{ text: '80º', alignment: 'center' },{ text: result.left_elbow_pronation, alignment: 'center' },{ text: result.right_elbow_pronation, alignment: 'center' }],
                        [ { text: 'Wrist', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '0-80º', alignment: 'center' },{ text: result.left_wrist_flexion, alignment: 'center' },{ text: result.right_wrist_flexion, alignment: 'center' }],
                        ['Extension',{ text: '0-70º', alignment: 'center' },{ text: result.left_wrist_extension, alignment: 'center' },{ text: result.right_wrist_extension, alignment: 'center' }],
                        ['Radial Deviation',{ text: '0-20º', alignment: 'center' },{ text: result.left_wrist_radial_deviation, alignment: 'center' },{ text: result.right_wrist_radial_deviation, alignment: 'center' }],
                        ['Ulnar Deviation',{ text: '0-30º', alignment: 'center' },{ text: result.left_wrist_ulnar_deviation, alignment: 'center' },{ text: result.right_wrist_ulnar_deviation, alignment: 'center' }],
                        [ { text: 'Trunk', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '', alignment: 'center' },{ text: result.trunk_flexion, alignment: 'center', colSpan: 2 },''],
                        ['Extension',{ text: '', alignment: 'center' },{ text: result.trunk_extension, alignment: 'center', colSpan: 2 },''],
                        ['Lateral Flexion',{ text: '', alignment: 'center' },{ text: result.trunk_lateral_flexion, alignment: 'center', colSpan: 2 },''],
                        ['Rotation',{ text: '', alignment: 'center' },{ text: result.trunk_rotation, alignment: 'center', colSpan: 2 },''],
                        [ { text: 'Hip', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion',{ text: '120º', alignment: 'center' },{ text: result.left_hip_flexion, alignment: 'center' },{ text: result.right_hip_flexion, alignment: 'center' }],
                        ['Extension',{ text: '30º', alignment: 'center' },{ text: result.left_hip_extension, alignment: 'center' },{ text: result.right_hip_extension, alignment: 'center' }],
                        ['Abduction',{ text: '45º', alignment: 'center' },{ text: result.left_hip_abduction, alignment: 'center' },{ text: result.right_hip_abduction, alignment: 'center' }],
                        ['Adduction',{ text: '30º', alignment: 'center' },{ text: result.left_hip_adduction, alignment: 'center' },{ text: result.right_hip_adduction, alignment: 'center' }],
                        [ { text: 'Knee', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' }, '', '',''],
                        ['Flexion/Extension',{ text: '135º', alignment: 'center' },{ text: result.left_knee_flexion, alignment: 'center' },{ text: result.right_knee_flexion, alignment: 'center' }],
                        [ { text: 'Ankle', italics: true, color: 'Black', colSpan: 4, fillColor: '#DEDEDE' },'',''],
                        ['Dorsiflexion',{ text: '20º', alignment: 'center' },{ text: result.left_ankle_dorsiflexion, alignment: 'center' },{ text: result.right_ankle_dorsiflexion, alignment: 'center' }],
                        ['Plantar Flexion',{ text: '50º', alignment: 'center' },{ text: result.left_ankle_plantar_flexion, alignment: 'center' },{ text: result.right_ankle_plantar_flexion, alignment: 'center' }],
                        ['Inversion',{ text: '35º', alignment: 'center' },{ text: result.left_ankle_inversion, alignment: 'center' },{ text: result.right_ankle_inversion, alignment: 'center' }],
                        ['Eversion',{ text: '15º', alignment: 'center' },{ text: result.left_ankle_eversion, alignment: 'center' },{ text: result.right_ankle_eversion, alignment: 'center' }],
                    ]       
                }
            },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    }

      return dd;
  };

  $scope.generate_pdf = function(){
  createPdf(result);
  }

})///END

.controller("ManageUsersController", function ($scope, $cordovaSQLite, $ionicPlatform, CurrentUser, $ionicPopup, $cordovaToast) {

  $scope.showToast = function(message, duration, location) {
      $cordovaToast.show(message, duration, location).then(function(success) {
          console.log("The toast was shown");
      }, function (error) {
          console.log("The toast was not shown due to " + error);
      });
  }

  //LIST ALL USERS
  $scope.list = function () {
      var query = "SELECT * FROM users";
      $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query).then(function (res) {
              if (res.rows.length > 0) {
                $scope.user_list = [];
                for(var i = 0; i < res.rows.length; i++){
                $scope.user_list.push(res.rows.item(i));
                }
              } else {
                  console.log("No results found");
              }
          }, function (err) {
              console.error(err);
          });
      });
  }

  $scope.list();

  //DELETE USER

  $scope.remove = function (id) {
      var query_delete_user = "DELETE from users WHERE user_id = ?";
      var query_delete_result = "DELETE from results WHERE user_id = ?";
      $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query_delete_user, [id]).then(function (res) {
                  $scope.list();
          }, function (err) {
              console.error(err);
          });
          $cordovaSQLite.execute(db, query_delete_result, [id]).then(function (res) {
            console.log("");
          }, function (err) {
              console.error(err);
          });
      });
  }

  $scope.delete_user = function(id) {

      if(id == CurrentUser.getCurrentUserId()){
          $scope.showToast("Unable to delete the Current User","short","center");
      }else{
        var confirmPopup = $ionicPopup.confirm({
          title: 'Delete User',
          template: 'Delete user and its report?'
        });
        confirmPopup.then(function(res) {
          if(res) {
            $scope.remove(id);
          } else {
            console.log('You are not sure');
          }
        });
      }
  }

  $scope.insertToCurrent = function (user_id, name) {

      var query = "INSERT INTO current (user_id) VALUES (?)";
      $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query, [user_id]).then(function (res) {
              console.log("Current User: " + user_id);
              CurrentUser.setCurrentUserName(name);
              CurrentUser.setCurrentUserId(user_id);
              $scope.showToast("Current User: "+name,"short","center");
          }, function (err) {
              console.error(err);
          });
      });
  }
})

.controller("ManageReportsController", function ($scope, $cordovaSQLite, $ionicPlatform, CurrentUser) {

  //LIST ALL REPORTS
  $scope.list = function () {
      var query = "SELECT * FROM results";
      $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query).then(function (res) {
              if (res.rows.length > 0) {
                $scope.reports= [];
                for(var i = 0; i < res.rows.length; i++){
                $scope.reports.push(res.rows.item(i));
                }
              } else {
                  console.log("No results found");
              }
          }, function (err) {
              console.error(err);
          });
      });
  }

  $scope.list();

})

.controller('VideoController', function($scope,$stateParams) {
  source = null;
  $scope.source = source;

  $scope.getSource = function(){
      source = "/android_asset/www/video/"+$stateParams.source+".mp4";
      $scope.source = "/android_asset/www/video/"+$stateParams.source+".mp4";
  };


  var elem = document.getElementById("myvideo");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }

  $scope.getSource();

})
 
.controller('BodyController', function($scope, $ionicModal) {
})

.controller('ModalsController', function($scope, $ionicModal) {
})

.controller('MotionController_1', function($scope, $ionicPlatform, $cordovaDeviceMotion, $cordovaDeviceOrientation, $cordovaSQLite, $stateParams, CurrentUser, $cordovaToast) {
  angle = null;
  $scope.angle = angle;
  gen_mov = null;
  $scope.gen_mov = gen_mov;
  jname = null;
  video_img = null;
  movement = null;
  joint =null;
  $scope.joint = joint;
  $scope.jname = jname;
  $scope.video_img = video_img;
  $scope.movement = movement;
  $scope.user_name = CurrentUser.getCurrentUserName();
  $scope.user_id = CurrentUser.getCurrentUserId();
  $scope.greenbtn = "visible";
  $scope.redbtn = "hidden";
  var set = 0;
  $scope.watch = null;
  $scope.prewatch =  null;


  // Value for all sensors(accelerometer and compass)
  $scope.options = {
      frequency: 100
  };

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady(){
    $scope.changeOrientationLandspace = function() {
      screen.lockOrientation('landscape');
    }
    $scope.changeOrientationPortrait = function() {
      screen.lockOrientation('portrait');
    }  
  }

  screen.lockOrientation('portrait');
  startCircle1();

   $scope.loadVideoUrl = function(){
    video_img = "img/"+$stateParams.gen_mov+".png";
    $scope.video_img = "img/"+$stateParams.gen_mov+".png";
    movement = $stateParams.movement;
    $scope.movement = $stateParams.movement;
    joint = $stateParams.joint;
    $scope.joint = $stateParams.joint;
    jname = $stateParams.jname;
    $scope.jname = $stateParams.jname;
    gen_mov = $stateParams.gen_mov;
    $scope.gen_mov = $stateParams.gen_mov;
  }

  $scope.link = "modal_"+ $stateParams.joint;

  $scope.go = function ( path ) {
    var p = "#/event/body";
    $location.path( p );
  };

  $scope.turnOn = function(btn){
    if(btn == "red"){
      $scope.greenbtn = "hidden";
      $scope.redbtn = "visible";
      set = 1;
    }
    else if(btn == "green"){
      $scope.greenbtn = "visible";
      $scope.redbtn = "hidden";
      set = 0;  
    }
  }

  $ionicPlatform.ready(function() {
    $scope.startPreAccelerometer = function() {     
          $scope.prewatch = $cordovaDeviceMotion.watchAcceleration($scope.options);
          $scope.prewatch.then(null, function(error) {
            console.log('Error');
            },function(preAccelerometerResult) {
              pre_theta = 0;
              pre_theta = Math.atan2(preAccelerometerResult.y, preAccelerometerResult.z)*180/Math.PI;
              $scope.pretheta = pre_theta;
            });
        };
        $scope.stopPreAccelerometer = function() {  
            $scope.prewatch.clearWatch();
        }
        $scope.startAccelerometer = function() {     
          $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
          $scope.watch.then(null, function(error) {
            console.log('Error');
          },function(accelerometerResult) {
            var theta = 0;
            theta = Math.atan2(accelerometerResult.y, accelerometerResult.z)*180/Math.PI;
            angle = Math.round(Math.abs(theta-pre_theta));
            $scope.angle = angle;
            circle.animate(Math.abs((Math.abs(theta-pre_theta))/360));
          });
        };
        $scope.stopAccelerometer = function() {  
          $scope.watch.clearWatch();
        }
        //ok

        $scope.$on('$ionicView.beforeLeave', function(){
             $scope.stopPreAccelerometer();
             $scope.stopAccelerometer();
         })
        $scope.$on('$ionicView.loaded', function(){
           $scope.loadVideoUrl();
        })

        $scope.startPreAccelerometer();

        $scope.start = function(){
            if(set == 0){
              $scope.turnOn("red");
              $scope.stopPreAccelerometer();
              $scope.startAccelerometer();
            }     
            else if(set == 1){
              $scope.turnOn("green");
              $scope.stopAccelerometer();
              $scope.startPreAccelerometer();
            } 
        }

  })//END READY


  $scope.showToast = function(message, duration, location) {
      $cordovaToast.show(message, duration, location).then(function(success) {
          console.log("The toast was shown");
      }, function (error) {
          console.log("The toast was not shown due to " + error);
      });
  }

  $scope.insertToReport = function () {
      var angle_deg = angle + '°';
      var user_id = CurrentUser.getCurrentUserId();
      var last_update = new Date().toLocaleDateString("en-AU",{weekday: "long", year:"numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"});
      var query = "UPDATE results SET "+ $stateParams.movement + " = ?, last_update = ?  WHERE user_id = ?";
      $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query, [angle_deg, last_update, user_id]).then(function (res) {
              console.log("Current User: " + user_id);
          }, function (err) {
              console.error(err);
          });
      });
  }

}) //END

.controller('MotionController_2', function($scope, $ionicPlatform, $cordovaDeviceMotion, $cordovaDeviceOrientation, $cordovaSQLite, $stateParams, CurrentUser, $cordovaToast) {
  angle = null;
  $scope.angle = angle;
  gen_mov = null;
  $scope.gen_mov = gen_mov;
  jname = null;
  video_img = null;
  movement = null;
  joint =null;
  $scope.joint = joint;
  $scope.jname = jname;
  $scope.video_img = video_img;
  $scope.movement = movement;
  $scope.user_name = CurrentUser.getCurrentUserName();
  $scope.user_id = CurrentUser.getCurrentUserId();
  $scope.greenbtn = "visible";
  $scope.redbtn = "hidden";
  var set = 0;
  $scope.watch = null;
  $scope.prewatch =  null;


  // Value for all sensors(accelerometer and compass)
  $scope.options = {
      frequency: 100
  };

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady(){
    $scope.changeOrientationLandspace = function() {
      screen.lockOrientation('landscape');
    }
    $scope.changeOrientationPortrait = function() {
      screen.lockOrientation('portrait');
    }  
  }

  screen.lockOrientation('portrait');
  startCircle1();

   $scope.loadVideoUrl = function(){
    video_img = "img/"+$stateParams.gen_mov+".png";
    $scope.video_img = "img/"+$stateParams.gen_mov+".png";
    movement = $stateParams.movement;
    $scope.movement = $stateParams.movement;
    joint = $stateParams.joint;
    $scope.joint = $stateParams.joint;
    jname = $stateParams.jname;
    $scope.jname = $stateParams.jname;
    gen_mov = $stateParams.gen_mov;
    $scope.gen_mov = $stateParams.gen_mov;
  }

  $scope.link = "modal_"+ $stateParams.joint;

  $scope.go = function ( path ) {
    var p = "#/event/body";
    $location.path( p );
  };

  $scope.turnOn = function(btn){
    if(btn == "red"){
      $scope.greenbtn = "hidden";
      $scope.redbtn = "visible";
      set = 1;
    }
    else if(btn == "green"){
      $scope.greenbtn = "visible";
      $scope.redbtn = "hidden";
      set = 0;  
    }
  }

  $ionicPlatform.ready(function() {
      $scope.startPreAccelerometer = function() {     
            $scope.prewatch = $cordovaDeviceMotion.watchAcceleration($scope.options);
            $scope.prewatch.then(null, function(error) {
              console.log('Error');
              },function(preAccelerometerResult) {
                pre_phi = 0;
                pre_phi = Math.atan2(-preAccelerometerResult.x, preAccelerometerResult.z)*180/Math.PI;
                $scope.prephi = pre_phi;
              });
          };
          $scope.stopPreAccelerometer = function() {  
              $scope.prewatch.clearWatch();
          }
          $scope.startAccelerometer = function() {     
            $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
            $scope.watch.then(null, function(error) {
              console.log('Error');
            },function(accelerometerResult) {
              var theta = 0;
              phi = Math.atan2(-accelerometerResult.x, accelerometerResult.z)*180/Math.PI; //For Roll
              circle.animate(Math.abs((phi-pre_phi)/360));
              angle = Math.round(Math.abs(phi-pre_phi));
            });
          };
          $scope.stopAccelerometer = function() {  
            $scope.watch.clearWatch();
          }
          //ok

          $scope.$on('$ionicView.beforeLeave', function(){
               $scope.stopPreAccelerometer();
               $scope.stopAccelerometer();
           })
          $scope.$on('$ionicView.loaded', function(){
             $scope.loadVideoUrl();
          })

          $scope.startPreAccelerometer();

          $scope.start = function(){
              if(set == 0){
                $scope.turnOn("red");
                $scope.stopPreAccelerometer();
                $scope.startAccelerometer();
              }     
              else if(set == 1){
                $scope.turnOn("green");
                $scope.stopAccelerometer();
                $scope.startPreAccelerometer();
              } 
          }

    })//END READY


  $scope.showToast = function(message, duration, location) {
      $cordovaToast.show(message, duration, location).then(function(success) {
          console.log("The toast was shown");
      }, function (error) {
          console.log("The toast was not shown due to " + error);
      });
  }

  $scope.insertToReport = function () {
      var angle_deg = angle + '°';
      var user_id = CurrentUser.getCurrentUserId();
      var query = "UPDATE results SET "+ $stateParams.movement + " = ? WHERE user_id = ?";
      $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query, [angle_deg, user_id]).then(function (res) {
              console.log("Current User: " + user_id);
          }, function (err) {
              console.error(err);
          });
      });
  }

}) //END

.controller('MotionController_3', function($scope, $ionicPlatform, $cordovaDeviceMotion, $cordovaDeviceOrientation, $cordovaSQLite, $stateParams, CurrentUser, $cordovaToast) {
  angle = null;
  $scope.angle = angle;
  gen_mov = null;
  $scope.gen_mov = gen_mov;
  jname = null;
  video_img = null;
  movement = null;
  joint =null;
  $scope.joint = joint;
  $scope.jname = jname;
  $scope.video_img = video_img;
  $scope.movement = movement;
  $scope.user_name = CurrentUser.getCurrentUserName();
  $scope.user_id = CurrentUser.getCurrentUserId();
  $scope.greenbtn = "visible";
  $scope.redbtn = "hidden";
  var set = 0;
  $scope.watchPreCompass = null;
  $scope.watchCompass =  null;


  // Value for all sensors(accelerometer and compass)
  $scope.options = {
      frequency: 100
  };

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady(){
    $scope.changeOrientationLandspace = function() {
      screen.lockOrientation('landscape');
    }
    $scope.changeOrientationPortrait = function() {
      screen.lockOrientation('portrait');
    }  
  }

  screen.lockOrientation('portrait');
  startCircle3();

   $scope.loadVideoUrl = function(){
    video_img = "img/"+$stateParams.gen_mov+".png";
    $scope.video_img = "img/"+$stateParams.gen_mov+".png";
    movement = $stateParams.movement;
    $scope.movement = $stateParams.movement;
    joint = $stateParams.joint;
    $scope.joint = $stateParams.joint;
    jname = $stateParams.jname;
    $scope.jname = $stateParams.jname;
    gen_mov = $stateParams.gen_mov;
    $scope.gen_mov = $stateParams.gen_mov;
  }

  $scope.link = "modal_"+ $stateParams.joint;

  $scope.go = function ( path ) {
    var p = "#/event/body";
    $location.path( p );
  };

  $scope.turnOn = function(btn){
    if(btn == "red"){
      $scope.greenbtn = "hidden";
      $scope.redbtn = "visible";
      set = 1;
    }
    else if(btn == "green"){
      $scope.greenbtn = "visible";
      $scope.redbtn = "hidden";
      set = 0;  
    }
  }

  $ionicPlatform.ready(function() {
    $scope.startPreCompass = function() { 
              $scope.watchPreCompass = $cordovaDeviceOrientation.watchHeading($scope.options);
              $scope.watchPreCompass.then(null, function(error) {
                console.log('Error');
              },function(preCompassResult) {
                initial_compass_value = preCompassResult.magneticHeading;
              });
            };
            $scope.stopPreCompass = function() {  
              $scope.watchPreCompass.clearWatch();
            } 
            $scope.startCompass = function() { 
              $scope.watchCompass = $cordovaDeviceOrientation.watchHeading($scope.options);
              $scope.watchCompass.then(null, function(error) {
                console.log('Error');
              },function(compassResult) {
                var magneticHeading = compassResult.magneticHeading;
                  circle.animate(Math.abs((magneticHeading-initial_compass_value)/360));
                  angle = Math.round(Math.abs(magneticHeading-initial_compass_value));
              });
            };
            $scope.stopCompass = function() {  
              $scope.watchCompass.clearWatch();
            }
        //ok

        $scope.$on('$ionicView.beforeLeave', function(){
             $scope.stopPreCompass();
             $scope.stopCompass();
         })
        $scope.$on('$ionicView.loaded', function(){
           $scope.loadVideoUrl();
        })

        $scope.startPreCompass();

        $scope.start = function(){
            if(set == 0){
              $scope.turnOn("red");
              $scope.stopPreCompass();
              $scope.startCompass();
            }     
            else if(set == 1){
              $scope.turnOn("green");
              $scope.stopCompass();
              $scope.startPreCompass();
            } 
        }

  })//END READY


  $scope.showToast = function(message, duration, location) {
      $cordovaToast.show(message, duration, location).then(function(success) {
          console.log("The toast was shown");
      }, function (error) {
          console.log("The toast was not shown due to " + error);
      });
  }

  $scope.insertToReport = function () {
      var angle_deg = angle + '°';
      var user_id = CurrentUser.getCurrentUserId();
      var query = "UPDATE results SET "+ $stateParams.movement + " = ? WHERE user_id = ?";
      $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query, [angle_deg, user_id]).then(function (res) {
              console.log("Current User: " + user_id);
          }, function (err) {
              console.error(err);
          });
      });
  }

}) //END

.controller('MyCtrl', function($scope, $ionicHistory) {
  $scope.goBack = function(){
    $ionicHistory.goBack();
  }    
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('EmptyController', function($scope) {
  
});

