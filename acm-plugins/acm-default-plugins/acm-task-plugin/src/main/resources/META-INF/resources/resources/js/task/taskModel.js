/**
 * Task.Model
 *
 * @author jwu
 */
Task.Model = Task.Model || {
    create : function() {
        if (Task.Service.create)                                    {Task.Service.create();}
        if (Task.Model.Lookup.create)                               {Task.Model.Lookup.create();}
        if (Task.Model.Tree.create)                                 {Task.Model.Tree.create();}
        if (Task.Model.Action.create)                               {Task.Model.Action.create();}
        if (Task.Model.Detail.create)                               {Task.Model.Detail.create();}
        if (Task.Model.RejectTask.onInitialized)                    {Task.Model.RejectTask.onInitialized();}
        if (Task.Model.ParentDetail.create)                         {Task.Model.ParentDetail.create();}
        if (Task.Model.Notes.create)                                {Task.Model.Notes.create();}
        if (Task.Model.History.create)                              {Task.Model.History.create();}
        if (Task.Model.WorkflowOverview.create)                     {Task.Model.WorkflowOverview.create();}
        //if (Task.Model.Attachments.create)                          {Task.Model.Attachments.create();}
        if (Task.Model.DocumentUnderReview.create)                  {Task.Model.DocumentUnderReview.create();}
        if (Task.Model.RejectComments.create)                       {Task.Model.RejectComments.create();}
        if (Task.Model.ElectronicSignature.create)                       {Task.Model.ElectronicSignature.create();}

    }
    ,onInitialized: function() {
        if (Task.Service.onInitialized)                             {Task.Service.onInitialized();}
        if (Task.Model.Lookup.onInitialized)                        {Task.Model.Lookup.onInitialized();}
        if (Task.Model.Tree.onInitialized)                          {Task.Model.Tree.onInitialized();}
        if (Task.View.Action.create)                                {Task.View.Action.create();}
        if (Task.Model.Detail.onInitialized)                        {Task.Model.Detail.onInitialized();}
        if (Task.Model.RejectTask.onInitialized)                    {Task.Model.RejectTask.onInitialized();}
        if (Task.Model.ParentDetail.onInitialized)                  {Task.Model.ParentDetail.onInitialized();}
        if (Task.Model.Notes.onInitialized)                         {Task.Model.Notes.onInitialized();}
        if (Task.Model.History.onInitialized)                       {Task.Model.History.onInitialized();}
        if (Task.Model.WorkflowOverview.onInitialized)              {Task.Model.WorkflowOverview.onInitialized();}
        //if (Task.Model.Attachments.onInitialized)                   {Task.Model.Attachments.onInitialized();}
        if (Task.Model.DocumentUnderReview.onInitialized)           {Task.Model.DocumentUnderReview.onInitialized();}
        if (Task.Model.RejectComments.onInitialized)                {Task.Model.RejectComments.onInitialized();}
        if (Task.Model.ElectronicSignature.onInitialized)                       {Task.Model.ElectronicSignature.onInitialized();}

        }

    ,interfaceNavObj: {
        apiListObjects: function() {
            return "/api/latest/plugin/search/TASK";
        }
        ,apiRetrieveObject: function(nodeType, objId) {
            return "/api/latest/plugin/task/byId/" + objId;
        }
        ,apiSaveObject: function(nodeType, objId) {
            return "/api/latest/plugin/task/save/" + objId;
        }
        ,nodeId: function(objSolr) {
            return objSolr.object_id_s;
            //return parseInt(objSolr.object_id_s);
        }
        ,nodeType: function(objSolr) {
            return (objSolr.adhocTask_b)? Task.Model.DOC_TYPE_ADHOC_TASK : Task.Model.DOC_TYPE_TASK;
        }
        ,nodeTypeSupported: function(nodeType) {
            return (Task.Model.DOC_TYPE_TASK == nodeType || Task.Model.DOC_TYPE_ADHOC_TASK == nodeType);
        }
        ,objToSolr: function(objData) {
            var solr = {};
            solr.due_tdt = objData.dueDate;
            solr.title_parseable = objData.title;
            solr.priority_s = objData.priority;
            solr.object_id_s = objData.taskId;
            solr.object_type_s = Task.Model.DOC_TYPE_TASK;
            solr.parent_object_id_i = objData.attachedToObjectId;
            solr.parent_object_type_s = objData.attachedToObjectType;
            solr.adhocTask_b = objData.adhocTask;
            solr.name = objData.title;
            return solr;
        }
        ,validateObjData: function(data) {
            return Task.Model.Detail.validateTask(data);
        }
//        ,nodeTypeMap: function() {
//            return Task.Model.Tree.Key.nodeTypeMap;
//        }
    }



    ,DOC_TYPE_COMPLAINT   : "COMPLAINT"
    ,DOC_TYPE_CASE_FILE   : "CASE_FILE"
    ,DOC_TYPE_TASK        : "TASK"
    ,DOC_TYPE_ADHOC_TASK  : "ADHOC"
    ,DOC_TYPE_FILE_SM     : "file"
    ,DOC_CATEGORY_FILE_SM : "Document"

//    ,getTaskId: function() {
//        return ObjNav.Model.getObjectId();
//    }
//    ,setTaskId: function(taskId) {
//        ObjNav.Model.setObjectId(taskId);
//    }
    ,getTask: function() {
        var nodeId = ObjNav.Model.getObjectId();
        var nodeType = ObjNav.Model.getObjectType();
        return ObjNav.Model.Detail.getCacheObject(nodeType, nodeId);
    }
    ,findTask: function(nodeType, nodeId) {
        return ObjNav.Model.Detail.getCacheObject(nodeType, nodeId);
    }

    ,Lookup: {
        create: function() {
            this._assignees    = new Acm.Model.SessionData(ThisApp.SESSION_DATA_TASK_ASSIGNEES);
            this._priorities   = new Acm.Model.SessionData(ThisApp.SESSION_DATA_TASK_PRIORITIES);
        }
        ,onInitialized: function() {
            var assignees = Task.Model.Lookup.getAssignees();
            if (Acm.isEmpty(assignees)) {
                Task.Service.Lookup.retrieveAssignees();
            } else {
                Task.Controller.modelRetrievedAssignees(assignees);
            }

            var priorities = Task.Model.Lookup.getPriorities();
            if (Acm.isEmpty(priorities)) {
                Task.Service.Lookup.retrievePriorities();
            } else {
                Task.Controller.modelRetrievedPriorities(priorities);
            }
        }


        ,getAssignees: function() {
            return this._assignees.get();
        }
        ,setAssignees: function(assignees) {
            this._assignees.set(assignees);
        }

        ,getPriorities: function() {
            return this._priorities.get();
        }
        ,setPriorities: function(priorities) {
            this._priorities.set(priorities);
        }
        ,validateAssignees: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (!Acm.isArray(data)) {
                return false;
            }
            return true;
        }
        ,validatePriorities: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (!Acm.isArray(data)) {
                return false;
            }
            return true;
        }
    }

    ,Tree: {
        create: function() {
            if (Task.Model.Tree.Key.create)        {Task.Model.Tree.Key.create();}
        }
        ,onInitialized: function() {
            if (Task.Model.Tree.Key.onInitialized)        {Task.Model.Tree.Key.onInitialized();}
        }

        ,Key: {
            create: function() {
            }
            ,onInitialized: function() {
            }

            ,NODE_TYPE_PART_DETAILS      : "det"
            ,NODE_TYPE_PART_NOTES        : "note"
            ,NODE_TYPE_PART_HISTORY      : "his"
            ,NODE_TYPE_PART_WORKFLOW     : "wkfl"
            ,NODE_TYPE_PART_ATTACHMENTS  : "att"
            ,NODE_TYPE_PART_DOCUMENTS    : "doc"
            ,NODE_TYPE_PART_REWORK       : "rewk"
            ,NODE_TYPE_PART_REJECT       : "rej"
            ,NODE_TYPE_PART_SIGNATURE    : "sig"

//            ,nodeTypeMap: [
//                {nodeType: "prevPage"    ,icon: "i i-arrow-up"     ,tabIds: ["tabBlank"]}
//                ,{nodeType: "nextPage"   ,icon: "i i-arrow-down"   ,tabIds: ["tabBlank"]}
//                ,{nodeType: "p"          ,icon: ""                 ,tabIds: ["tabBlank"]}
//                ,{nodeType: "p/TASK"     ,icon: "i i-checkmark"    ,tabIds:
//                    ["tabDetails"
//                        ,"tabDocuments"
//                        ,"tabNotes"
//                        ,"tabHistory"
//                        ,"tabReworkInstructions"
//                        ,"tabWorkflowOverview"
//                        ,"tabAttachments"
//                        ,"tabSignature"
//                    ]}
//                ,{nodeType: "p/ADHOC"     ,icon: "i i-checkmark"    ,tabIds:
//                    ["tabDetails"
//                        ,"tabNotes"
//                        ,"tabHistory"
//                        ,"tabRejectComments"
//                        ,"tabWorkflowOverview"
//                        ,"tabAttachments"
//                        ,"tabSignature"
//
//                    ]}
//                ,{nodeType: "p/TASK/det"      ,icon: "",tabIds: ["tabDetails"]}
//                ,{nodeType: "p/TASK/note"     ,icon: "",tabIds: ["tabNotes"]}
//                ,{nodeType: "p/TASK/his"      ,icon: "",tabIds: ["tabHistory"]}
//                ,{nodeType: "p/TASK/wkfl"     ,icon: "",tabIds: ["tabWorkflowOverview"]}
//                ,{nodeType: "p/TASK/att"      ,icon: "",tabIds: ["tabAttachments"]}
//                ,{nodeType: "p/TASK/doc"      ,icon: "",tabIds: ["tabDocuments"]}
//                ,{nodeType: "p/TASK/rewk"     ,icon: "",tabIds: ["tabReworkInstructions"]}
//                ,{nodeType: "p/TASK/sig"      ,icon: "",tabIds: ["tabSignature"]}
//                ,{nodeType: "p/ADHOC/det"     ,icon: "",tabIds: ["tabDetails"]}
//                ,{nodeType: "p/ADHOC/note"    ,icon: "",tabIds: ["tabNotes"]}
//                ,{nodeType: "p/ADHOC/his"     ,icon: "",tabIds: ["tabHistory"]}
//                ,{nodeType: "p/ADHOC/wkfl"    ,icon: "",tabIds: ["tabWorkflowOverview"]}
//                ,{nodeType: "p/ADHOC/att"     ,icon: "",tabIds: ["tabAttachments"]}
//                ,{nodeType: "p/ADHOC/rej"     ,icon: "",tabIds: ["tabRejectComments"]}
//                ,{nodeType: "p/ADHOC/sig"     ,icon: "",tabIds: ["tabSignature"]}
//
//            ]
        }
    }

    ,Action: {
        create: function() {
        }
        ,onInitialized: function() {
        }
    }

    ,ParentDetail: {
        create : function() {
            this.cacheParentObject = new Acm.Model.CacheFifo();

            Acm.Dispatcher.addEventListener(ObjNav.Controller.MODEL_RETRIEVED_OBJECT   ,this.onModelRetrievedObject);
            Acm.Dispatcher.addEventListener(ObjNav.Controller.VIEW_SELECTED_OBJECT     ,this.onViewSelectedObject);
        }
        ,onInitialized: function() {
        }

        ,onViewSelectedObject: function(nodeType, nodeId) {
            var task = Task.Model.findTask(nodeType, nodeId);
            Task.Model.ParentDetail._retrieveParentObject(task);
        }
        ,onModelRetrievedObject: function(objData) {
            Task.Model.ParentDetail._retrieveParentObject(objData);
        }

        ,_retrieveParentObject: function(task) {
            if (Task.Model.Detail.validateTask(task)) {
                if(Acm.isNotEmpty(task.parentObjectId) && Acm.isNotEmpty(task.parentObjectType)){
                    var parentObjData = Task.Model.ParentDetail.cacheParentObject.get(task.parentObjectId);
                    if (!Task.Model.ParentDetail.validateUnifiedData(parentObjData)) {
                        if(Task.Model.DOC_TYPE_COMPLAINT == task.parentObjectType){
                            Task.Service.ParentDetail.retrieveComplaint(task.parentObjectId);
                        } else if(Task.Model.DOC_TYPE_CASE_FILE == task.parentObjectType){
                            Task.Service.ParentDetail.retrieveCaseFile(task.parentObjectId);
                        }

                        //Task.Service.ParentDetail.retrieveParentObject(task.attachedToObjectType, task.attachedToObjectId);
                    }
                }
            }
        }
        ,getGroup: function(participants) {
            var group = null;
            if (Acm.isArray(participants)) {
                for (var i = 0; i < participants.length; i++) {
                    var participant =  participants[i];
                    if ("owning group" == participant.participantType) {
                        group = participant.participantLdapId;
                        break;
                    }
                }
            }
            return group;
        }

        ,makeUnifiedData:function(parentObj, objType){
            var unifiedData = null;
            if(Task.Model.DOC_TYPE_COMPLAINT == objType){
                if (Task.Model.ParentDetail.validateComplaint(parentObj)) {
                    unifiedData = {};
                    unifiedData.id = parentObj.complaintId;
                    unifiedData.objectType = objType;
                    unifiedData.title = parentObj.complaintTitle;
                    unifiedData.incidentDate = parentObj.created;
                    unifiedData.priority =  parentObj.priority;
                    unifiedData.assignee = parentObj.creator;
                    unifiedData.status = parentObj.status;
                    unifiedData.subjectType = parentObj.complaintType;
                    unifiedData.number = parentObj.complaintNumber;
                    unifiedData.group = Task.Model.ParentDetail.getGroup(parentObj.participants);
                }
            }
            else if(Task.Model.DOC_TYPE_CASE_FILE == objType){
                if (Task.Model.ParentDetail.validateCaseFile(parentObj)) {
                    unifiedData = {};
                    unifiedData.id = parentObj.id;
                    unifiedData.objectType = objType;
                    unifiedData.title = parentObj.title;
                    unifiedData.incidentDate = parentObj.created;
                    unifiedData.priority =  parentObj.priority;
                    unifiedData.assignee = parentObj.creator;
                    unifiedData.status = parentObj.status;
                    unifiedData.subjectType = parentObj.caseType;
                    unifiedData.number = parentObj.caseNumber;
                    unifiedData.group = Task.Model.ParentDetail.getGroup(parentObj.participants);
                }
            }
            return unifiedData;
        }

        ,validateComplaint: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.complaintId) || Acm.isEmpty(data.complaintNumber)) {
                return false;
            }
            if (!Acm.isArray(data.childObjects)) {
                return false;
            }
            if (!Acm.isArray(data.participants)) {
                return false;
            }
            if (!Acm.isArray(data.personAssociations)) {
                return false;
            }
            return true;
        }
        ,validateCaseFile: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.id) || Acm.isEmpty(data.caseNumber)) {
                return false;
            }
            if (!Acm.isArray(data.childObjects)) {
                return false;
            }
            if (!Acm.isArray(data.milestones)) {
                return false;
            }
            if (!Acm.isArray(data.participants)) {
                return false;
            }
            if (!Acm.isArray(data.personAssociations)) {
                return false;
            }
            if (!Acm.isArray(data.references)) {
                return false;
            }
            return true;
        }
        ,validateUnifiedData: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            /*if (Acm.isEmpty(data.id)) {
                return false;
            }*/

            return true;
        }
    }

    ,Detail: {
        create : function() {

            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_CHANGED_DETAIL                , this.onViewChangedDetail);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_CHANGED_REWORK_DETAILS        , this.onViewChangedReworkDetail);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_CHANGED_TITLE                 , this.onViewChangedTitle);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_CHANGED_START_DATE            , this.onViewChangedStartDate);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_CHANGED_ASSIGNEE              , this.onViewChangedAssignee);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_CHANGED_PERCENT_COMPLETED     , this.onViewChangedPercentCompleted);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_CHANGED_PRIORITY              , this.onViewChangedPriority);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_CHANGED_DUE_DATE              , this.onViewChangedDueDate);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_COMPLETED_TASK                , this.onViewCompletedTask);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_DELETED_TASK                  , this.onViewDeletedTask);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_RETRIEVED_USERS               , this.onViewRetrievedUsers);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_SIGNED_TASK                   , this.onViewSignedTask);

        }
        ,onInitialized: function() {
        }
        ,onViewSignedTask: function(taskId, $formSignature){
            Task.Service.Detail.signTask(taskId, $formSignature);
        }
        ,onViewRetrievedUsers: function(start, n, sortDirection, searchKeyword, exclude){
            Task.Service.Detail.retrieveUsers(start, n, sortDirection, searchKeyword, exclude);
        }
        ,onViewCompletedTask: function(objData){
            Task.Service.Detail.completeTask(objData);
        }
        ,onViewDeletedTask: function(taskId){
            Task.Service.Detail.deleteTask(taskId);
        }
        ,onViewChangedDetail: function(nodeType, taskId, details){
            Task.Service.Detail.saveDetail(nodeType, taskId, details);
        }
        ,onViewChangedReworkDetail: function(nodeType, taskId, reworkDetails){
            Task.Service.Detail.saveReworkDetails(nodeType, taskId, reworkDetails);
        }
        ,onViewChangedTitle: function(nodeType, taskId, title){
            Task.Service.Detail.saveTitle(nodeType, taskId, title);
        }
        ,onViewChangedStartDate: function(nodeType, taskId, startDate) {
            Task.Service.Detail.saveStartDate(nodeType, taskId, startDate);
        }
        ,onViewChangedAssignee: function(nodeType, taskId, assignee) {
            Task.Service.Detail.saveAssignee(nodeType, taskId, assignee);
        }
        ,onViewChangedPercentCompleted: function(nodeType, taskId, percent) {
            Task.Service.Detail.savePercentCompleted(nodeType, taskId, percent);
        }
        ,onViewChangedPriority: function(nodeType, taskId, priotiry) {
            Task.Service.Detail.savePriority(nodeType, taskId, priotiry);
        }
        ,onViewChangedDueDate: function(nodeType, taskId, dueDate) {
            Task.Service.Detail.saveDueDate(nodeType, taskId, dueDate);
        }

        ,validateTask: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.taskId)) {
                return false;
            }
//            if (Acm.isEmpty(data.id) || Acm.isEmpty(data.caseNumber)) {
//             return false;
//             }
//             if (!Acm.isArray(data.childObjects)) {
//             return false;
//             }
//             if (!Acm.isArray(data.participants)) {
//             return false;
//             }
//             if (!Acm.isArray(data.personAssociations)) {
//             return false;
//             }
            return true;
        }
    }

    ,RejectTask: {
        create: function() {
        }
        ,onInitialized: function() {
        }
    }
    ,Notes: {
        create : function() {
            this.cacheNoteList = new Acm.Model.CacheFifo();

            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_ADDED_NOTE     , this.onViewAddedNote);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_UPDATED_NOTE   , this.onViewUpdatedNote);
            Acm.Dispatcher.addEventListener(Task.Controller.VIEW_DELETED_NOTE   , this.onViewDeletedNote);
        }
        ,onInitialized: function() {
        }

        ,onViewAddedNote: function(note) {
            Task.Service.Notes.addNote(note);
        }
        ,onViewUpdatedNote: function(note) {
            Task.Service.Notes.updateNote(note);
        }
        ,onViewDeletedNote: function(noteId) {
            Task.Service.Notes.deleteNote(noteId);
        }

        ,validateNotes: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (!Acm.isArray(data)) {
                return false;
            }
            return true;
        }

        ,validateNote: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            /*if (Acm.isEmpty(data.id)) {
             return false;
             }*/
            if (Acm.isEmpty(data.parentId)) {
                return false;
            }
            if (Acm.isEmpty(data.note)) {
                return false;
            }
            return true;
        }

        ,validateDeletedNote: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.deletedNoteId)) {
                return false;
            }
            return true;
        }
    }

    ,History: {
        create : function() {
            this.cacheHistory = new Acm.Model.CacheFifo();
        }
        ,onInitialized: function() {
        }
        ,validateHistory: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.resultPage)) {
                return false;
            }
            if (Acm.isNotArray(data.resultPage)) {
                return false;
            }
            if (Acm.isEmpty(data.totalCount)) {
                return false;
            }
            return true;
        }
        ,validateEvent: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.eventDate)) {
                return false;
            }
            if (Acm.isEmpty(data.eventType)) {
                return false;
            }
            if (Acm.isEmpty(data.objectId)) {
                return false;
            }
            if (Acm.isEmpty(data.objectType)) {
                return false;
            }
            if (Acm.isEmpty(data.userId)) {
                return false;
            }
            return true;
        }
    }

    ,WorkflowOverview: {
        create : function() {
            this.cacheWorkflowOverview = new Acm.Model.CacheFifo();

            Acm.Dispatcher.addEventListener(ObjNav.Controller.MODEL_RETRIEVED_OBJECT    ,this.onModelRetrievedObject);
        }
        ,onInitialized: function() {
        }
        ,onModelRetrievedObject: function(task) {
            //var taskId = Task.Model.getTaskId();
            //var task = Task.Model.getObject();
            //var adhoc_b = false;
            if (Task.Model.Detail.validateTask(task)) {
                var taskId = task.taskId;
                if (Acm.isNotEmpty(task.businessProcessId)){
                    Task.Service.WorkflowOverview.retrieveWorkflowOverview(task.businessProcessId,taskId, false);
                //}else if (Acm.isNotEmpty(task.taskId)){
                } else {
                    //adhoc_b = true;
                    Task.Service.WorkflowOverview.retrieveWorkflowOverview(taskId,taskId, true);
                }

            }
        }
        ,validateWorkflowOverview: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isNotArray(data)) {
                return false;
            }
            return true;
        }
        ,validateWorkflowOverviewRecord: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.id)) {
                return false;
            }
            if (Acm.isEmpty(data.participant)) {
                return false;
            }
            /*if (Acm.isEmpty(data.role)) {
             return false;
             }*/
            if (Acm.isEmpty(data.status)) {
                return false;
            }
            if (Acm.isEmpty(data.startDate)) {
                return false;
            }
            /*if (Acm.isEmpty(data.endDate)) {
             return false;
             }*/
            return true;
        }
    }

    ,Attachments: {
        create : function() {
            this.cacheAttachments = new Acm.Model.CacheFifo();      //todo: remove this cache, use task cache instead
        }
        ,onInitialized: function() {
        }
        ,validateUploadedAttachments: function(data){
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isNotArray(data)) {
                return false;
            }
            return true;
        }
        ,validateDocuments:function(data){
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.containerObjectId)) {
                return false;
            }
            if (Acm.isEmpty(data.folderId)) {
                return false;
            }
            if (Acm.isEmpty(data.children)) {
                return false;
            }
            if (Acm.isEmpty(data.totalChildren)) {
                return false;
            }
            if (Acm.isNotArray(data.children)) {
                return false;
            }
            return true;
        }
        ,validateDocument: function(data){
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.objectId)) {
                return false;
            }
            if (Acm.isEmpty(data.name)) {
                return false;
            }
            if (Acm.isEmpty(data.created)) {
                return false;
            }
            if (Acm.isEmpty(data.creator)) {
                return false;
            }
            if (!Acm.compare(data.objectType,Task.Model.DOC_TYPE_FILE_SM)) {
                return false;
            }
            return true;
        }
        ,validateNewDocument: function(data) {
            // data will be an array of new documents
            if (Acm.isEmpty(data)) {
                return false;
            }
            if ( Acm.isNotArray(data))
            {
                return false;
            }
            for ( var a = 0; a < data.length; a++ )
            {
                var f = data[a];
                if (Acm.isEmpty(f.category)) {
                    return false;
                }
                if (!Acm.compare(f.category, Task.Model.DOC_CATEGORY_FILE_SM)) {
                    return false;
                }
                if (Acm.isEmpty(f.created)) {
                    return false;
                }
                if (Acm.isEmpty(f.creator)) {
                    return false;
                }
                if (Acm.isEmpty(f.fileId)) {
                    return false;
                }
                if (Acm.isEmpty(f.fileName)) {
                    return false;
                }
                if (Acm.isEmpty(f.fileType)) {
                    return false;
                }
            }
            return true;
        }

    }

    ,DocumentUnderReview: {
        create : function() {
            this.cacheTask = new Acm.Model.CacheFifo();
        }
        ,onInitialized: function() {
        }
        ,validateDocumentUnderReviewRecord: function(data){
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.fileId)) {
                return false;
            }
            if (Acm.isEmpty(data.fileName)) {
                return false;
            }
            if (Acm.isEmpty(data.created)) {
                return false;
            }
            if (Acm.isEmpty(data.creator)) {
                return false;
            }
            if (Acm.isEmpty(data.status)) {
                return false;
            }
            return true;
        }
        ,validateDocumentUnderReview: function(data){
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.documentUnderReview)) {
                return false;
            }
            return true;
        }
    }

    ,RejectComments: {
        create : function() {
            this.cacheRejectComments = new Acm.Model.CacheFifo();
            Acm.Dispatcher.addEventListener(Task.Controller.MODEL_RETRIEVED_TASK, this.onModelRetrievedTask);
        }
        ,onInitialized: function() {
        }

        ,_rejectNoteType: 'REJECT_COMMENT'

        ,onModelRetrievedTask: function(task) {
            if (task.hasError) {
                //empty table?
            } else {
                var taskId = ObjNav.Model.getObjectId();
                Task.Service.RejectComments.retrieveRejectComments(Task.Model.RejectComments._rejectNoteType,taskId,Task.Model.DOC_TYPE_TASK);
            }
        }

        ,validateRejectCommentRecord: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            /*if (Acm.isEmpty(data.id)) {
             return false;
             }*/
            if (Acm.isEmpty(data.parentId)) {
                return false;
            }
            if (Acm.isEmpty(data.note)) {
                return false;
            }
            return true;
        }

        ,validateRejectComments: function(data) {
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isNotArray(data)) {
                return false;
            }
            /*if (Acm.isEmpty(data.parentId)) {
             return false;
             }
             if (Acm.isEmpty(data.note)) {
             return false;
             }*/
            return true;
        }

    }

    ,ElectronicSignature: {
        create : function() {
            this.cacheElectronicSignatures = new Acm.Model.CacheFifo();

            Acm.Dispatcher.addEventListener(ObjNav.Controller.MODEL_RETRIEVED_OBJECT    ,this.onModelRetrievedObject);

        }
        ,onInitialized: function() {
        }

        ,onModelRetrievedObject: function(){
            Task.Service.ElectronicSignature.retrieveSignatures(ObjNav.Model.getObjectId());
        }
        ,validateElectronicSignatures: function(data) {
            if (Acm.isArrayEmpty(data)) {
                return false;
            }
            return true;
        }
        ,validateElectronicSignature: function(data){
            if (Acm.isEmpty(data)) {
                return false;
            }
            if (Acm.isEmpty(data.objectId)) {
                return false;
            }
            if (Acm.isEmpty(data.signatureId)) {
                return false;
            }
            if (Acm.isEmpty(data.signedBy)) {
                return false;
            }
            if (Acm.isEmpty(data.signedDate)) {
                return false;
            }
            return true;
        }
    }
};

