module.exports = function(app){
    var TableList = Object.getPrototypeOf(app).TableList = new app.Component("table-list");
    // TableList.debug = true;
    TableList.createdAt      = "2.0.0";
    TableList.lastUpdate     = "2.4.0";
    TableList.version        = "1.3.0";
    // TableList.factoryExclude = true;
    // TableList.loadingMsg     = "This message will display in the console when component will be loaded.";
    // TableList.requires       = [];

    TableList.prototype.onCreate = function(){
        var table = this;
        table.$container    = table.$el.find('.table-list__container').length                          ? table.$el.find('.table-list__container')                          : false;
        table.$headline     = table.$el.find('.table-list__headline').length                           ? table.$el.find('.table-list__headline')                           : false;
        table.$lines        = table.$el.find('.table-list__line,tr:not(.table-list__headline)').length ? table.$el.find('.table-list__line,tr:not(.table-list__headline)') : false;
        table.responsive    = (table.responsive !== undefined)                                         ? table.responsive                                                  : table.getData('responsive', false);
        table.minWidthBlock = (table.minWidthBlock !== undefined)                                      ? table.minWidthBlock                                               : table.getData('minwidthblock', false);
        table.addTooltip    = (table.addTooltip !== undefined)                                         ? table.addTooltip                                                  : table.getData('addtooltip', true);

        if (table.responsive){
            table.$lines.last().after('<tr class="table-list__line filler"></tr><tr class="table-list__line filler"></tr>');
            if(table.minWidthBlock)
                table.$el.find('.table-list__line').css('min-width',table.minWidthBlock)
        }

        if (table.$headline && table.$headline.find('[data-label]').length) {
            table.$headline.find('[data-label]').each(function(){
                table.$lines.find('.table-list__cell,td').filter('[data-name="'+this.getAttribute('data-name')+'"]').attr('data-label',this.getAttribute('data-label'))
            })
        }

        if (table.addTooltip) 
            table.convertTooltips();

        // console.log(table);
        return table;
    };

    TableList.prototype.convertTooltips = function(){
        var table = this;
        table.$el.find('.table-list__action').each((i,el) => {
            if (el.getAttribute('title')) {
                el.setAttribute('tooltip', el.getAttribute('title'))
                el.setAttribute('title', '');
            }
        });
        app.adjustTooltips()
    }
    TableList.prototype.onResize = function(){
        var table = this;
        if (table.responsive) {
            table.$el.removeClass('mode--block');
            if (table.$container.width() > table.$el.width())
                table.$el.addClass('mode--block');
        }
    }

    $(function(){
        $('body').on('click','.separator',function(e){
            var lines = $(this).nextUntil('.separator','.table-list__line,tr');
            if ($(this).hasClass('inactive'))
                $(this).removeClass('inactive').nextUntil('.separator','.table-list__line,tr').show();
            else
                $(this).addClass('inactive').nextUntil('.separator','.table-list__line,tr').hide();
        });
    });
    return TableList;
}