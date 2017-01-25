Ext.define('CA.techservices.recordmenu.changesetcreate', {
    alias:'widget.tschangesetmenuitemcreate',
    extend:'Rally.ui.menu.item.RecordMenuItem',

    config:{
        predicate: function(record) {
            console.log(record, this._isChangesetable(record));
            return this._isChangesetable(record);
        },

        handler: function() {
            this._displayDialog(this.record);
        },

        text: 'Create Changeset...'
    },
    
    _isChangesetable: function(record) {
        var valid_types = ['hierarchicalrequirement','defect','task'];
        var record_type = record.get('_type').toLowerCase();
        
        return Ext.Array.contains(valid_types, record_type);
    },
    
    _displayDialog: function(record) {
        var me = this;
        
        var title = Ext.String.format("Create Changeset for {0}:{1}",
            record.get('FormattedID'),
            record.get('Name')
        );
        
        Ext.create('Ca.technicalservices.ChangesetCreateDialog', {
            id       : 'popup',
            width    : Ext.getBody().getWidth() - 50,
            height   : Ext.getBody().getHeight() - 50,
            title    : title,
            listeners: {
                scope: this,
                dataReady: function(dialog,value) {
                    value.Artifacts = [{ _ref: record.get('_ref')}];
                    me._makeChangeset(value);
                }
            }
        });
    },
    
    _makeChangeset: function(value) {
        var me = this;
        console.log("Saving:", value);
        
        this.setLoading("Saving...");
        
        Rally.data.ModelFactory.getModel({
            type: 'Changeset',
            success: function(model) {
                var record  = Ext.create(model, value);
                record.save({
                    callback: function(result, operation) {
                        if ( operation.wasSuccessful() ) {
                            console.log("Save Result:", result);
                            Rally.ui.notify.Notifier.showCreate({artifact: result, showRank: false});
                        } else {
                            Rally.ui.notify.Notifier.showError({message:"Problem saving changeset"});
                            console.error("Save Result:", operation);
                        }
                        me.setLoading(false);
                    }
                });
            }
        });
    }
});