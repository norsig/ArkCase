/**
 * Topbar is namespace component for Topbar plugin
 *
 * @author jwu
 */
var Topbar = Topbar || {
    initialize: function() {
        Topbar.Object.initialize();
        Topbar.Event.initialize();
        Topbar.Page.initialize();
        Topbar.Rule.initialize();
        Topbar.Service.initialize();
        Topbar.Callback.initialize();

        Acm.deferred(Topbar.Event.onPostInit);
    }

    ,Object: {}
    ,Event:{}
    ,Page: {}
    ,Rule: {}
    ,Service: {}
    ,Callback: {}


    ,getQuickSearchTerm: function() {
        var term = localStorage.getItem("AcmQuickSearchTerm");
        if (term === "null") {
            console.log("null term in getQuickSearchTerm!")
            return null;
        }
        return term;
    }
    ,setQuickSearchTerm: function(term) {
        if (term === "null") {
            console.log("null term in ssssssssssssssetQuickSearchTerm!")
            //todo: remove from localStorage???
        }
        localStorage.setItem("AcmQuickSearchTerm", term);
    }
};

