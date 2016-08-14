(function() {

    angular.module('testApp', [])
        .controller('attendanceController', ['$scope', '$http', function($scope, $http) {

            $http({
                method: 'GET',
                url: './students.json'
            }).then(function successCallback(response) {

                var validateInput = function(input){
                    if(input.length)
                        {
                            for(var i = 0 ; i<input.length ; i++)
                            {
                                if(!(input[i].firstName && input[i].lastName && input[i].image  && input[i].attendanceMark && input[i].attendanceMark.hasOwnProperty('present') && input[i].attendanceMark.hasOwnProperty('late') && input[i].attendanceMark.hasOwnProperty('absent')))
                                {
                                    //wrong JSON
                                    window.location.href = 'http://www.google.com';
                                }
                            }
                        }
                    else
                    {
                        //wrong JSON
                        window.location.href = 'http://www.google.com';
                    }
                };

                //we check if json is set correctly, if not
                //we redirect to error page
                validateInput(response.data);

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
                    if(student.attendanceMark)
                    {
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
                    }
                    else
                    {//JSON invalid
                    }
                };

                //for reset button
                $scope.resetAttendance = function() {
                    for (var i = 0; i < $scope.students.length; i++) {
                        $scope.students[i].attendanceMark.present = false;
                        $scope.students[i].attendanceMark.late = false;
                        $scope.students[i].attendanceMark.absent = false;
                    }
                    $scope.attendance.present = [];
                    $scope.attendance.late = [];
                    $scope.attendance.absent = [];
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
        //checks if we can open image
        //if not, replaces with default
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