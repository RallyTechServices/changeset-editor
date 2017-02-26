Ext.define('CA.techservices.recordmenu.changesetdelete', {
    alias:'widget.tschangesetmenuitemdelete',
    extend:'Rally.ui.menu.item.RecordMenuItem',

    config:{
        predicate: function(record) {
            return true;
        },

        handler: function() {
            this._delete(this.changeset);
        },

        text: 'Delete Changeset'
    },
    
    _delete: function(changeset) {
        // a hack to get the grid.  must be a better way
        var display_store = this.store;
        changeset.destroy({
            callback: function(result, operation) {
            	display_store.load();
            }
        });
    }
});