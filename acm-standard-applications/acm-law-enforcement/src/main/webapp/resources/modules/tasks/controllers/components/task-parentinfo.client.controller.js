'use strict';

angular.module('tasks').controller('Tasks.ParentInfoController', ['$scope', '$stateParams'
    , 'UtilService', 'ConfigService', 'ObjectService', 'Case.InfoService', 'Complaint.InfoService', 'Task.InfoService'
    , 'CostTracking.InfoService', 'TimeTracking.InfoService', 'Object.ModelService', 'LookupService', 'Helper.ObjectBrowserService'
    , function ($scope, $stateParams
        , Util, ConfigService, ObjectService, CaseInfoService, ComplaintInfoService, TaskInfoService
        , CostTrackingInfoService, TimeTrackingInfoService, ObjectModelService, LookupService, HelperObjectBrowserService) {

        new HelperObjectBrowserService.Component({
            moduleId: "tasks"
            , componentId: "parentinfo"
            , scope: $scope
            , stateParams: $stateParams
            , retrieveObjectInfo: TaskInfoService.getTaskInfo
            , validateObjectInfo: TaskInfoService.validateTaskInfo
            , onObjectInfoRetrieved: function (objectInfo) {
                onObjectInfoRetrieved(objectInfo);
            }
        });

        LookupService.getUsers().then(
            function (users) {
                var options = [];
                _.each(users, function (user) {
                    options.push({object_id_s: user.object_id_s, name: user.name});
                });
                $scope.assignableUsers = options;
                return users;
            }
        );

        $scope.onClickTitle = function () {
            if ($scope.parentCaseInfo) {
                ObjectService.gotoUrl(ObjectService.ObjectTypes.CASE_FILE, $scope.parentCaseInfo.id);
            } else if ($scope.parentComplaintInfo) {
                ObjectService.gotoUrl(ObjectService.ObjectTypes.COMPLAINT, $scope.parentComplaintInfo.complaintId);
            }else if ($scope.parentCostsheetInfo){
                ObjectService.gotoUrl(ObjectService.ObjectTypes.COSTSHEET, $scope.parentCostsheetInfo.id);
            } else if ($scope.parentTimesheetInfo){
                ObjectService.gotoUrl(ObjectService.ObjectTypes.TIMESHEET, $scope.parentTimesheetInfo.id);
            }else {
                $log.error('parentCaseInfo is undefined, cannot redirect to the parent case');
            }
        };

        var onObjectInfoRetrieved = function (objectInfo) {
            $scope.objectInfo = objectInfo;

            if (Util.isEmpty($scope.objectInfo.parentObjectId)) {
                return;
            }

            //for test
            //if (1148 == $scope.objectInfo.taskId) {
            //    $scope.objectInfo.parentObjectType = "COMPLAINT";
            //    $scope.objectInfo.parentObjectId = 123;
            //}


            if (ObjectService.ObjectTypes.CASE_FILE == $scope.objectInfo.parentObjectType) {
                CaseInfoService.getCaseInfo($scope.objectInfo.parentObjectId).then(
                    function (caseInfo) {
                        $scope.parentCaseInfo = caseInfo;
                        $scope.owningGroup = ObjectModelService.getGroup(caseInfo);
                        $scope.assignee = ObjectModelService.getAssignee(caseInfo);
                        return caseInfo;
                    }
                );
            } else if (ObjectService.ObjectTypes.COMPLAINT == $scope.objectInfo.parentObjectType) {
                ComplaintInfoService.getComplaintInfo($scope.objectInfo.parentObjectId).then(
                    function (complaintInfo) {
                        $scope.parentComplaintInfo = complaintInfo;
                        $scope.owningGroup = ObjectModelService.getGroup(complaintInfo);
                        $scope.assignee = ObjectModelService.getAssignee(complaintInfo);
                        return complaintInfo;
                    }
                );
            } else if (ObjectService.ObjectTypes.COSTSHEET == $scope.objectInfo.parentObjectType) {
                CostTrackingInfoService.getCostsheetInfo($scope.objectInfo.parentObjectId).then(
                    function (costsheetInfo) {
                        $scope.parentCostsheetInfo = costsheetInfo;
                        $scope.costsheetApprover = ObjectModelService.getParticipantByType(costsheetInfo, "approver");
                        return costsheetInfo;
                    }
                );
            }else if (ObjectService.ObjectTypes.TIMESHEET == $scope.objectInfo.parentObjectType) {
                TimeTrackingInfoService.getTimesheetInfo($scope.objectInfo.parentObjectId).then(
                    function(timesheetInfo){
                        $scope.parentTimesheetInfo = timesheetInfo;
                        $scope.timesheetApprover = ObjectModelService.getParticipantByType(timesheetInfo, "approver");
                        return timesheetInfo;
                    }
                );
            }
        };
    }
]);