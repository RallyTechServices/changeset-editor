Ext.define('Ca.technicalservices.ChangesetCreateDialog',{
    extend: 'Rally.ui.dialog.Dialog',
    alias: 'widget.tschangesetcreatedialog',
    
    closable: true,
    layout: 'fit',
    
    config: {
        title: 'Create Changeset',
        
        autoShow: true,
        /**
         * @cfg {String}
         * Text to be displayed on the button when selection is complete
         */
        selectionButtonText: 'Save',
        
        height: 400,
        width: 600
    },

    items: {
        xtype: 'panel',
        itemId: 'mainPanel',
        border: false
    },
    
    constructor: function(config) {
        this.mergeConfig(config);
        this.callParent([this.config]);
    },

    initComponent: function() {
        this.callParent(arguments);
        this._buildButtons();
        this._buildForm();
    },

    _buildForm: function() {
        var me = this,
            panel = this.down('#mainPanel');
        
        var container = panel.add({
            xtype: 'container',
            itemId: 'formContainer',
            layout: 'vbox',
            height: 500,
            defaults: {
                margin: 10,
                width: 500,
                listeners: {
                    scope: this,
                    change: this._enableDisableSaveButton
                }
            }
        });
        
        container.add({
            xtype: 'rallycombobox',
            name: 'SCMRepository',
            fieldLabel: 'SCM Repository',
            storeConfig:{
                autoLoad: true,
                model:'SCMRepository'
            }
        });
        
        container.add({
            xtype: 'rallyusercombobox',
            name: 'Author',
            fieldLabel: 'Author'
        });
        
        container.add({
            xtype: 'rallytextfield',
            name: 'CommitTimestamp',
            fieldLabel: 'Commit Timetamp',
            validator: function(v) {
                // looking for 2016-10-01T12:00:39
                var regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;
                if ( regex.test(v) ) {
                    return true;
                }
                return "Format (use time at UTC): 2016-12-01T12:00:00";
            }
        });   
        
        container.add({
            xtype: 'rallytextfield',
            name: 'Revision',
            fieldLabel: 'Revision'
        });
        
        container.add({
            xtype: 'rallytextfield',
            name: 'Uri',
            fieldLabel: 'Commit URL',
            validator: function(value) {
                if ( /^http/.test(value) ) {
                    return true;
                }
                
                return "URL must begin with http or https";
            }
        });
        
        container.add({
            xtype:'rallyrichtexteditor',
            name:'Message',
            fieldLabel: 'Commit Message',
            labelAlign: 'top'
        });
    },
    
    _enableDisableSaveButton: function() {
        var button = this.down('#saveButton')
        if ( !button) {
            return;
        }
        
        var value = this._getData();
        
        if ( Ext.isEmpty(value) || Ext.Object.isEmpty(value) ) {
            button.setDisabled(true);
            return false;
        }
        
        var disabled = false;
        Ext.Object.each(value, function(key,v){
            if ( Ext.isEmpty(v) ) {
                disabled = true;
            }
        });
        button.setDisabled(disabled);
        return disabled;
    },
    
    _getData: function() {
        var me = this,
            container = this.down('#formContainer');
        
        var value = {};
        
        var children = container.query('*');
        
        Ext.each(children, function(child){
            value[child.name] = child.getValue();
        });
                
        return value;
    },
    
    /**
     * @private
     */
    _buildButtons: function() {

        this.down('panel').addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            padding: '0 0 10 0',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            ui: 'footer',
            items: [
                {
                    xtype: 'rallybutton',
                    text: this.selectionButtonText,
                    itemId:'saveButton',
                    cls: 'primary small',
                    scope: this,
                    disabled: true,
                    userAction: 'clicked done in dialog',
                    handler: function() {
                        
                        this.fireEvent('dataReady', this, this._getData());
                        this.close();
                    }
                },
                {
                    xtype: 'rallybutton',
                    text: 'Cancel',
                    cls: 'secondary small',
                    handler: this.close,
                    scope: this,
                    ui: 'link'
                }
            ]
        });

    }
});