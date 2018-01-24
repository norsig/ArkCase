'use strict';

/**
 * @ngdoc service
 * @name services:DocTreeExt.ReviewDoc
 *
 * @description
 * DocTree extension for review document.
 */
angular.module('services').factory('DocTreeExt.ReviewDoc', [ 'ModalDialogService', function(ModalDialogService) {

    var reviewDocument = {

        /**
         * @ngdoc method
         * @name getColumnRenderers
         * @methodOf services:DocTreeExt.ReviewDoc
         *
         * @description
         * No renderer is needed; return empty list of renderers.
         *
         * @param {Object} DocTree  DocTree object defined in doc-tree directive
         *
         */
        getColumnRenderers : function(DocTree) {
            return [];
        },
        /**
         * @ngdoc method
         * @name getCommandHandlers
         * @methodOf services:DocTreeExt.ReviewDoc
         *
         * @description
         * Return list of command handlers this extension provides. This function is required for a docTree extension
         *
         * @param {Object} DocTree  DocTree object defined in doc-tree directive
         *
         */
        getCommandHandlers : function(DocTree) {
            return [ {
                name : 'reviewDocument',
                execute : function(nodes, args) {
                    reviewDocument.openModal(DocTree, nodes);
                }
            } ];
        },
        openModal : function(DocTree, nodes) {
            var params = {};
            if (DocTree._objType === 'CASE_FILE') {
                params.parentType = DocTree._objType;
                params.parentId = DocTree._objId;
                params.parentObject = DocTree.objectInfo.caseNumber;
                params.parentTitle = DocTree.objectInfo.title;
            } else if (DocTree._objType === 'COMPLAINT') {
                params.parentType = DocTree._objType;
                params.parentId = DocTree._objId;
                params.parentObject = DocTree.objectInfo.complaintNumber;
                params.parentTitle = DocTree.objectInfo.complaintTitle;
            }
            params.documentsToReview = nodes;
            params.taskType = 'REVIEW_DOCUMENT';
            var modalMetadata = {
                moduleName : 'tasks',
                templateUrl : 'modules/tasks/views/components/task-new-task.client.view.html',
                controllerName : 'Tasks.NewTaskController',
                params : params
            };
            ModalDialogService.showModal(modalMetadata);
        }

    };

    return reviewDocument;
} ]);