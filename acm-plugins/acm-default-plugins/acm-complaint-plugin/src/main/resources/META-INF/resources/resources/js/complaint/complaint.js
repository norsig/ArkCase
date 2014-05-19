/**
 * Complaint is namespace component for Complaint plugin
 *
 * @author jwu
 */
var Complaint = Complaint || {
    initialize: function() {
        Complaint.Object.initialize();
        Complaint.Event.initialize();
        Complaint.Page.initialize();
        Complaint.Rule.initialize();
        Complaint.Service.initialize();
        Complaint.Callback.initialize();

        Complaint.Event.onPostInit();
    }

    ,Object: {}
    ,Event:{}
    ,Page: {}
    ,Rule: {}
    ,Service: {}
    ,Callback: {}


    ,_complaintId : undefined
    ,getComplaintId : function() {
        return this._complaintId;
    }
    ,setComplaintId : function(id) {
        this._complaintId = id;
    }
};
