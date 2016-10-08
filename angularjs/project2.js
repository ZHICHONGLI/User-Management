 var app = angular.module('myApp', ['ngRoute', 'infinite-scroll']);


 app.factory('usersFactory', ['$http', function($http) {


     var idcounter;
     var scrollCounter = 1;
     return {
         loadList: function($scope) {
             $http.get('/api/users').success(function(response) {
                 console.log(response);
                 $scope.users = response;
                 console.log($scope.users);
                 $scope.userData = $scope.users.slice(0, 5);
                 console.log("first 5 load");
                 if ($scope.users.length == 0) {
                     $scope.idcount = 1;
                     idcounter = 1;
                 } else {
                     $scope.idcount = $scope.users[$scope.users.length - 1].id + 1;
                 };
                 idcounter = $scope.idcount;
                 console.log('id count +1= ' + $scope.idcount);
                 console.log($scope.users);
                 $scope.scrollMore = function() {

                     console.log("scrollMore: " + scrollCounter);
                     $scope.userData = $scope.users.slice(0, $scope.userData.length + 2);
                     console.log($scope.userData);
                     scrollCounter += 1;
                 }
             }).error(function(response) {
                 console.log('load list error');
             })
         },
         /*
                  scrollMore: function($scope) {
                      //$scope.userData = $scope.users.slice(0, 5);
                      //console.log("first 5 load");
                      console.log("scrollMore +1");
                      $scope.userData = $scope.users.slice(0, $scope.userData.length + 2);
                      console.log($scope.userData);
                  }, */

         loadEmp: function($scope) {
             $http.get('/api/users').success(function(response) {
                 $scope.mgrOpt = response;
                 console.log($scope.mgrOpt);
             }).error(function(response) {
                 console.log('load list error');
             })
         },

         loadEmpfilt: function($scope) {
             $http.get('/api/users').success(function(response) {
                 $scope.mgrOpt = response;
                 console.log(response);
                 var dnumber;
                 var orilength;
                 var countlow = function($scope) {
                     console.log('run function');
                     orilength = $scope.lowarr.length;
                     console.log(orilength);
                     for (i = 0; i < $scope.lowarr.length; i++) {
                         for (j = 0; j < $scope.mgrOpt.length; j++) {
                             if ($scope.lowarr[i].id == $scope.mgrOpt[j].mgrId) {
                                 $scope.lowarr.push($scope.mgrOpt[j]);
                             };
                         };
                     };
                     console.log($scope.lowarr);
                 };
                 $scope.mgropt1 = [{ mgrId: null, mgrName: 'Set as No Manager', Title: "No Manager", Sex: "No Manager" }];
                 //console.log('test userid in Factory' + $scope.imgid);
                 for (i = 0; i < $scope.mgrOpt.length; i++) {
                     if ($scope.mgrOpt[i].id != $scope.imgid) {
                         $scope.mgropt1.push($scope.mgrOpt[i])
                     } else {
                         dnumber = $scope.mgrOpt[i].drNum;
                         console.log('get dp number as :' + dnumber);
                     };

                 };
                 console.log('array list without itself');
                 console.log($scope.mgropt1);
                 $scope.mgrOpt = $scope.mgropt1;
                 $scope.mgrtest = $scope.mgrOpt;
                 ////////////////////////////////////////////////////////////////////////
                 $scope.firstlevel = [];
                 $scope.lowarr = [];
                 if (dnumber != 0) {
                     for (i = 0; i < $scope.mgropt1.length; i++) {
                         if ($scope.mgropt1[i].mgrId == $scope.imgid) {
                             $scope.firstlevel.push($scope.mgropt1[i]);
                         };
                     };
                     for (j = 0; j < $scope.firstlevel.length; j++) {
                         $scope.lowarr.push($scope.firstlevel[j])
                     };
                 };
                 console.log($scope.lowarr);
                 if ($scope.lowarr.length == 0) {
                     console.log('lowarr no more');
                 } else {
                     countlow($scope);
                     /*if (orilength != $scope.lowarr.length) {
                         countlow($scope);
                     } else { console.log('no more lower dps'); }; */
                     console.log($scope.lowarr);
                 };
                 /////////update mgrtest array take off obj in lowarr
                 for (i = 0; i < $scope.lowarr.length; i++) {
                     for (j = 0; j < $scope.mgrtest.length; j++) {
                         if ($scope.lowarr[i].id == $scope.mgrtest[j].id) {
                             $scope.mgrtest.splice(j, 1);
                         }
                     };
                 };
                 console.log($scope.mgrtest);
                 ////////////////////////////////////////////////////////////////////////
             }).error(function(response) {
                 console.log('load manager list error');
             })
         },

         delUser: function($scope, userid) {
             $http.delete('/api/users/' + userid).success(function(res) {
                 console.log('delete done');
                 //console.log(res)
                 $scope.users = res;
                 $scope.userData = $scope.users;
                 console.log($scope.users);
             }).error(function(res) {
                 console.log("delete error");
             })
         },

         loadDetail: function($scope, userid) {
             //console.log(userid); 
             $http.get('/api/users/' + userid).success(function(res) {
                 console.log('get done');
                 //console.log(res)
                 $scope.user = res;
                 console.log($scope.user);
                 $scope.Name = $scope.user.Name;
                 $scope.Sex = $scope.user.Sex;
                 $scope.Title = $scope.user.Title;
                 $scope.cPhone = $scope.user.cPhone;
                 $scope.email = $scope.user.email;
                 $scope.mgrId = $scope.user.mgrId;
                 $scope.mgrName = $scope.user.mgrName;
                 $scope.drNum = $scope.user.drNum;
                 $scope.imageId = $scope.user.id;
                 $scope.imgPath = 'http://localhost:8080/images/' + $scope.imageId + '.jpg';
                 $scope.premgrid = $scope.user.mgrId;
             }).error(function(res) {
                 console.log("get error");
             })
         },

         refreshmgr: function($scope, userid) {
             //console.log(userid); 
             $http.get('/api/users/' + userid).success(function(res) {
                 console.log('refress' + userid + 'done');
             }).error(function(res) {
                 console.log("refresh error");
             })
         },

         saveEdit: function($scope, userid) {
             var data = {
                 "Name": $scope.Name,
                 "cPhone": $scope.cPhone,
                 "Title": $scope.Title,
                 "email": $scope.email,
                 "Sex": $scope.Sex,
                 "drNum": $scope.drNum,
                 "mgrId": $scope.mgrId,
                 "mgrName": $scope.mgrName
             };
             $scope.refreshmgr = function(managerid) {
                     $http.get('/api/users/' + managerid).success(function(res) {
                         console.log('refresh_' + managerid + '_done');
                     }).error(function(res) {
                         console.log("refresh error");
                     })
                 },
                 $http.put('/api/users/' + userid, data).success(function(res) {
                     console.log('edit done');
                     console.log('pre mgr id' + $scope.premgrid);
                     // update dr num for pre n cur manager
                     if ($scope.premgrid == $scope.mgrId) {
                         console.log('manager no  change no need action');
                     } else if ($scope.premgrid == null && $scope.mgrId != null) {
                         console.log('from null to sb.');
                         $scope.refreshmgr($scope.mgrId);
                     } else if ($scope.premgrid != null && $scope.mgrId == null) {
                         console.log('from sb. to null');
                         $scope.refreshmgr($scope.premgrid);
                     } else if ($scope.premgrid != null && $scope.mgrId != null) {
                         console.log('from a to b');
                         $scope.refreshmgr($scope.premgrid);
                         $scope.refreshmgr($scope.mgrId);
                     };
                     /////////////////////////////////////////////////////
                 }).error(function(res) {
                     console.log("edit error");
                 })
         },

         addUser: function($scope, popId, $location) {
             var data = {
                 "Name": $scope.Name,
                 "cPhone": $scope.cPhone,
                 "Title": $scope.Title,
                 "Sex": $scope.Sex,
                 "email": $scope.email,
                 "mgrName": $scope.mgrName,
                 "mgrId": $scope.mgrId,
                 "drNum": $scope.drNum,
                 "id": popId
             };
             $http.post('/api/users/', data).success(function(res) {
                 console.log('add done');
                 $location.path('/list');
             }).error(function(res) {
                 console.log("add error");
             })
         }
     }


 }]);

 app.config(['$routeProvider', function($routeProvider) {
     $routeProvider

         .when('/', {
             redirectTo: '/list'
         })
         .when('/list', {
             templateUrl: 'list1.html',
             controller: 'UserCtrl'
         })
         .when('/edit/:id', {
             templateUrl: 'edit.html',
             controller: 'EditCtrl'
         })
         .when('/add/:id', {
             templateUrl: 'add.html',
             controller: 'Adduser'
         })
         .when('/detail/:id', {
             templateUrl: 'detail.html',
             controller: 'DetailCtrl'
         })
         .when('/drlist/:id', {
             templateUrl: 'drlist.html',
             controller: 'drlistCtrl'
         });
 }]);

 app.controller('UserCtrl', function($scope, usersFactory, $location) {

     $scope.error = false;
     $scope.incomplete = false;
     $scope.hideform = true;
     usersFactory.loadList($scope);

     $scope.editUser = function(userid) {
         $location.path('/edit/' + userid);

     };

     $scope.userDetail = function(userid) {
         $location.path('/detail/' + userid);
     };

     $scope.delUser = function(userid) {
         usersFactory.delUser($scope, userid);
         //$location.path('/');
     };
     $scope.sort = function(sortBy) {
         $scope.sortKey = sortBy;
         $scope.reverse = !$scope.reverse;
     }


     $scope.$watch('passw1', function() { $scope.test(); });
     $scope.$watch('passw2', function() { $scope.test(); });
     $scope.$watch('fName', function() { $scope.test(); });
     $scope.$watch('lName', function() { $scope.test(); });

     $scope.test = function() {
         if ($scope.passw1 !== $scope.passw2) {
             $scope.error = true;
         } else {
             $scope.error = false;
         }
         $scope.incomplete = false;
         if ($scope.edit && (!$scope.fName.length ||
                 !$scope.lName.length ||
                 !$scope.passw1.length || !$scope.passw2.length)) {
             $scope.incomplete = true;
         }
     };


 });

 app.controller("Adduser", function($scope, $location, usersFactory, $routeParams) {
     $scope.Name = '';
     $scope.cPhone = '';
     $scope.Title = '';
     $scope.Sex = '';
     $scope.Age = '';
     $scope.email = '';
     $scope.mgrName = '';
     $scope.mgrId = '';
     $scope.drNum = '';
     $scope.currentId = $routeParams.id;
     var popId = $scope.currentId;
     console.log("Current ID" + $scope.currentId);
     usersFactory.loadEmp($scope);
     $scope.titleSelect = ['CEO', 'VP', 'Engineer', 'Secretary', 'Assistant', 'Intern', 'Others'];
     $scope.genderOption = ['Male', 'Female'];

     $scope.$watchCollection('mgrObj', function(newData, oldDaata) {

         if ((newData != undefined) && (newData != null)) {
             var mgr_obj = JSON.parse(newData);
             $scope.mgrobj = mgr_obj;
             console.log($scope.mgrobj);
             $scope.mgrId = mgr_obj.id;
             $scope.mgrName = mgr_obj.Name;
         }
         //$scope.mgr_obj = newData;
         //console.log($scope.mgr_obj);
         //$scope.mgr_id = newData.id;
         //console.log($scope.mgr_id);
     });

     $scope.addUser = function() {
         usersFactory.addUser($scope, popId, $location);
         console.log(popId);
         // $location.path('/list');
     };
     $scope.filename = "";
     $scope.fileN = 'test-initial';
     document.getElementById('photoPre').onchange = function() {
         //alert('Selected file: ' + this.value);
         console.log($scope.filename);
         $scope.filename = this.value;
         $scope.fileExt = $scope.filename.split('.').pop();
         $scope.fileN = $scope.currentId + '.' + $scope.fileExt;
         $scope.$digest();
         console.log($scope.filename);
         var reader = new FileReader();

         reader.onload = function(e) {
             // get loaded data and render thumbnail.
             document.getElementById("showPre").src = e.target.result;
         };

         // read the image file as a data URL.
         reader.readAsDataURL(this.files[0]);
     };
 });

 app.controller('EditCtrl', function($scope, $location, usersFactory, $routeParams) {
     $scope.edit = true;
     $scope.neveredit = true;
     var userid = $routeParams.id;
     $scope.saveEdit = function() {
         usersFactory.saveEdit($scope, userid);
         //$location.path('/list');
     };

 });

 app.controller('drlistCtrl', function($scope, $location, usersFactory, $routeParams) {
     $scope.mgridx = JSON.parse($routeParams.id);
     usersFactory.loadEmp($scope);
     console.log($scope.mgridx);
 });

 app.controller('DetailCtrl', function($scope, $location, usersFactory, $routeParams) {
     $scope.edit = false;
     $scope.editImgdo = false;
     var userid = $routeParams.id;
     $scope.imgid = $routeParams.id;
     usersFactory.loadDetail($scope, userid);
     $scope.titleSelect = ['CEO', 'VP', 'Engineer', 'Secretary', 'Assistant', 'Intern', 'Others'];
     $scope.genderOption = ['Male', 'Female'];
     usersFactory.loadEmpfilt($scope);
     // need to filt out lower level in mgrOpt
     //    console.log($scope.mgrOpt);

     $scope.$watchCollection('mgrObj', function(newData, oldDaata) {

         if ((newData != undefined) && (newData != null)) {
             var mgr_obj = JSON.parse(newData);
             $scope.mgrobj = mgr_obj;
             console.log($scope.mgrobj);
             $scope.mgrId = mgr_obj.id;
             $scope.mgrName = mgr_obj.Name;
         }
     });
     $scope.doEdit = function() {
         $scope.edit = !$scope.edit;
     };
     $scope.editImg = function() {
         $scope.editImgdo = !$scope.editImgdo;
     };
     $scope.saveEdit = function() {
         usersFactory.saveEdit($scope, userid);
     };
     $scope.testbtn = function() {
         if ($scope.premgrid == $scope.mgrId) {
             console.log('equal');
             console.log($scope.premgrid);
             console.log($scope.mgrId);
         } else if ($scope.premgrid == null && $scope.mgrId != null) {
             console.log('from null to sb.');
             console.log($scope.premgrid);
             console.log($scope.mgrId);
         } else if ($scope.premgrid != null && $scope.mgrId == null) {
             console.log('from sb. to null');
             console.log($scope.premgrid);
             console.log($scope.mgrId);
         } else if ($scope.premgrid != null && $scope.mgrId != null) {
             console.log('from a to b');
             console.log($scope.premgrid);
             console.log($scope.mgrId);
         };

     };
     $scope.clrmgr = function() {
         console.log('clear manager trigger');
         $scope.mgrId = null;
         $scope.mgrName = '';
     };

     ///////////////for upload//////////////////////



 });