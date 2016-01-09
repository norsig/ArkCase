'use strict';

angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$state', '$translate', 'StoreService'
    , 'UtilService', 'ConfigService', 'Task.InfoService', 'ObjectService', 'Helper.ObjectBrowserService'
    , function ($scope, $stateParams, $state, $translate, Store
        , Util, ConfigService, TaskInfoService, ObjectService, HelperObjectBrowserService) {

        var contentHelper = new HelperObjectBrowserService.Content({
            scope: $scope
            , state: $state
            , stateParams: $stateParams
            , moduleId: "tasks"
            , getObjectInfo: TaskInfoService.getTaskInfo
            , updateObjectInfo: TaskInfoService.updateTaskInfo
            , getObjectIdFromInfo: function (taskInfo) {
                return Util.goodMapValue(taskInfo, "taskId");
            }
            , getObjectTypeFromInfo: function (taskInfo) {
                return (taskInfo.adhocTask) ? ObjectService.ObjectTypes.ADHOC_TASK : ObjectService.ObjectTypes.TASK;
            }
            ,
            initComponentLinks: function (config) {
                $scope.taskLinks = HelperObjectBrowserService.createComponentLinks(config, ObjectService.ObjectTypes.TASK);
                $scope.adhocTaskLinks = HelperObjectBrowserService.createComponentLinks(config, ObjectService.ObjectTypes.ADHOC_TASK);
                return (ObjectService.ObjectTypes.ADHOC_TASK == $stateParams.type) ? $scope.adhocTaskLinks : $scope.taskLinks;
            }
            ,
            selectComponentLinks: function (selectedTask) {
                return (ObjectService.ObjectTypes.ADHOC_TASK == selectedTask.nodeType) ? $scope.adhocTaskLinks : $scope.taskLinks;
            }
        });


        //$scope.onClickComponentLink = function (linkId) {
        //    $scope.activeLinkId = linkId;
        //    var objectId = $stateParams.id;
        //    var objectType = $stateParams.type;
        //    HelperObjectBrowserService.updateObjectSetting("tasks", linkId, objectId, objectType);
        //    $state.go('tasks.' + linkId, {
        //        type: objectType
        //        , id: objectId
        //    });
        //};

        return;

        var promiseGetModuleConfig = ConfigService.getModuleConfig("tasks").then(function (config) {
            $scope.config = config;
            $scope.taskLinks = HelperObjectBrowserService.createComponentLinks(config, ObjectService.ObjectTypes.TASK);
            $scope.adhocTaskLinks = HelperObjectBrowserService.createComponentLinks(config, ObjectService.ObjectTypes.ADHOC_TASK);
            $scope.componentLinks = (ObjectService.ObjectTypes.ADHOC_TASK == $stateParams.type) ? $scope.adhocTaskLinks : $scope.taskLinks;
            $scope.activeLinkId = "main";
            return config;
        });
        $scope.$on('req-component-config', function (e, componentId) {
            promiseGetModuleConfig.then(function (config) {
                var componentConfig = _.find(config.components, {id: componentId});
                $scope.$broadcast('component-config', componentId, componentConfig);
            });
        });
        $scope.$on('report-object-updated', function (e, taskInfo) {
            TaskInfoService.updateTaskInfo(taskInfo);
            $scope.$broadcast('object-updated', taskInfo);
        });

        $scope.$on('req-select-task', function (e, selectedTask) {
            var components = Util.goodArray(selectedTask.components);
            $scope.componentLinks = (ObjectService.ObjectTypes.ADHOC_TASK == selectedTask.nodeType) ? $scope.adhocTaskLinks : $scope.taskLinks;
            $scope.activeLinkId = (1 == components.length) ? components[0] : "main";
        });

        $scope.getActive = function (linkId) {
            return ($scope.activeLinkId == linkId) ? "active" : ""
        };

//$scope.onClickComponentLink = function (linkId) {
//    console.log("work as well");
//    $scope.activeLinkId = linkId;
//    var objectId = Util.goodMapValue($scope.objectInfo, "complaintId");
//    HelperObjectBrowserService.updateObjectSetting("complaints", objectId, linkId);
//    $state.go("complaints" + "." + linkId, {
//        id: objectId
//    });
//};
        $scope.onClickComponentLink = function (linkId) {
            $scope.activeLinkId = linkId;
            $state.go('tasks.' + linkId, {
                type: $stateParams.type
                , id: $stateParams.id
            });
        };

        $scope.linksShown = false;
        $scope.toggleShowLinks = function () {
            $scope.linksShown = !$scope.linksShown;
        };

        $scope.progressMsg = $translate.instant("tasks.progressNoTask");
        $scope.$on('req-select-task', function (e, selectedTask) {
            var componentsStore = new Store.Variable("TaskComponentsStore");
            componentsStore.set(selectedTask.components);
            $scope.$broadcast('task-selected', selectedTask);

            var id = Util.goodMapValue(selectedTask, "nodeId", null);
            loadTask(id);
        });


        var loadTask = function (id) {
            if (Util.goodPositive(id)) {
                if ($scope.taskInfo && $scope.taskInfo.taskId != id) {
                    $scope.taskInfo = null;
                }
                $scope.progressMsg = $translate.instant("tasks.progressLoading") + " " + id + "...";

                TaskInfoService.getTaskInfo(id).then(
                    function (taskInfo) {
                        $scope.progressMsg = null;
                        $scope.taskInfo = taskInfo;
                        $scope.$emit("report-object-updated", taskInfo);
                        return taskInfo;
                    }
                    , function (error) {
                        $scope.taskInfo = null;
                        $scope.progressMsg = $translate.instant("tasks.progressError") + " " + id;
                        return error;
                    }
                );
            }
        };

        loadTask($stateParams.id);
    }
]);