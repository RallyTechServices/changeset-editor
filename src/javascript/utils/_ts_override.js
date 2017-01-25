Ext.override(Rally.ui.grid.RowActionColumn, {

    /**
     * @private
     * @param value
     * @param metaData
     * @param record
     */
    _renderGearIcon: function(value, metaData, record) {
        metaData.tdCls = Rally.util.Test.toBrowserTestCssClass('row-action', Rally.util.Ref.getOidFromRef(record.get('_ref')));

        var gearIconHtml = '<div class="row-action-icon icon-gear"/>';
        // if(record.self.typePath === 'recyclebinentry'){
        //     return record.get('updatable') ? gearIconHtml : '';
        // }

        return gearIconHtml;
    }
});