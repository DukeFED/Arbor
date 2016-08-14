(function() {

    angular.module('testApp', [])
        .controller('attendanceController', ['$scope', '$http', function($scope, $http) {

            $http({
                method: 'GET',
                url: './students.json'
            }).then(function successCallback(response) {
                $scope.students = response.data;

                //tracking attendance of all students
                $scope.attendance = {
                    present: [],
                    late: [],
                    absent: [],
                    unassigned: 0
                };

                $scope.countAllAttendance = function() {
                    for (var i = 0; i < $scope.students.length; i++) {
                        $scope.checkStudentAttendance($scope.students[i]);
                    }
                };

                $scope.checkStudentAttendance = function(student) {
                    if (student.attendanceMark.present) {
                        $scope.attendance.present.push(student.firstName + ' ' + student.lastName);
                        $scope.attendance.unassigned--;
                    } else if (student.attendanceMark.late) {
                        $scope.attendance.late.push(student.firstName + ' ' + student.lastName);
                        $scope.attendance.unassigned--;
                    } else if (student.attendanceMark.absent) {
                        $scope.attendance.absent.push(student.firstName + ' ' + student.lastName);
                        $scope.attendance.unassigned--;
                    }
                };

                //for reset button
                $scope.resetAttendance = function() {
                    for (var i = 0; i < $scope.students.length; i++) {
                        $scope.students[i].attendanceMark.present = false;
                        $scope.students[i].attendanceMark.late = false;
                        $scope.students[i].attendanceMark.absent = false;
                    }
                    $scope.attendance.present = 0;
                    $scope.attendance.late = 0;
                    $scope.attendance.absent = 0;
                    $scope.attendance.unassigned = i;
                };

                $scope.countUnassigned = function(){
                    $scope.attendance.unassigned = $scope.students.length;
                };

                $scope.isOnClass = function(student) {
                    student.attendanceMark.present = true;
                    student.attendanceMark.late = false;
                    student.attendanceMark.absent = false;
                    $scope.checkStudentAttendance(student);
                };
                $scope.wasLate = function(student) {
                    student.attendanceMark.present = false;
                    student.attendanceMark.late = true;
                    student.attendanceMark.absent = false;
                    $scope.checkStudentAttendance(student);
                };
                $scope.notOnClass = function(student) {
                    student.attendanceMark.present = false;
                    student.attendanceMark.late = false;
                    student.attendanceMark.absent = true;
                    $scope.checkStudentAttendance(student);
                };

                //initiate
                //reseting counts unassigned as well
                $scope.countUnassigned();
                $scope.countAllAttendance();

            }, function errorCallback(response) {
                console.log(response);
            });

        }])
        .directive('attendance', function() {
            return {
                restrict: 'E',
                templateUrl: 'template/attendance.html'
            };
        })
        .directive('onErrorSrc', function() {
            console.log(123);
            return {
                link: function(scope, element, attrs) {
                  element.bind('error', function() {
                    if (attrs.src != attrs.onErrorSrc) {
                      attrs.$set('src', attrs.onErrorSrc);
                    }
                  });
                }
            }
        });

})();