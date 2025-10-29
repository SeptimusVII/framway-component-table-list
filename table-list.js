module.exports = function(app){
    var TableList = Object.getPrototypeOf(app).TableList = new app.Component("table-list");
    // TableList.debug = true;
    TableList.createdAt      = "2.0.0";
    TableList.lastUpdate     = "2.7.0";
    TableList.version        = "1.6.3";
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
        table.isTable       = (table.$container.get(0).nodeName == 'TABLE');

        if (table.responsive){
            table.$lines.last().after('<tr class="table-list__line filler"></tr><tr class="table-list__line filler"></tr>');
            if(table.minWidthBlock)
                table.$el.find('.table-list__line').css('min-width',table.minWidthBlock)
            table.onResize();   
        }

        if (table.$headline && table.$headline.find('[data-label]').length && table.$lines.length) {
            table.$headline.find('[data-label]').each(function(){
                table.$lines.find('.table-list__cell,td:not(.table-list__cell)').filter('[data-name="'+this.getAttribute('data-name')+'"]').attr('data-label',this.getAttribute('data-label'))
            })
        }

        if (table.addTooltip) 
            table.convertTooltips();

        // console.log(table);
        return table;
    };

    TableList.prototype.removeLine = function(line){
        var table = this;
        line.remove();
        table.$lines = table.$el.find('.table-list__line,tr:not(.table-list__headline)');
        return table;
    }
    TableList.prototype.addLine = function(data = false, attributes = false){
        var table = this;
        var line = document.createElement(table.isTable?'tr':'div');
        var cellTag = table.isTable?'td':'div';
        var columns = []
        table.$headline.find('.table-list__cell,td:not(.table-list__cell),th:not(.table-list__cell)').each(function(){
            columns.push({
                'name': this.getAttribute('data-name'),
                'style': this.getAttribute('style'),
            });
        })
        if (!data) {
            for(var i in columns)
                line.innerHTML += '<'+cellTag+' class="table-list__cell" data-name="'+columns[i].name+'" '+(columns[i].style?'style="'+columns[i].style+'"':'')+'></'+cellTag+'>';
        } else {
            if (Array.isArray(data)) {
                for(var i in columns)
                    line.innerHTML += '<'+cellTag+' class="table-list__cell" data-name="'+columns[i].name+'" '+(columns[i].style?'style="'+columns[i].style+'"':'')+'>'+(data[i]?data[i]:'')+'</'+cellTag+'>';
            } else if (typeof data === 'object' && data !== null){
                for(var i in columns)
                    line.innerHTML += '<'+cellTag+' class="table-list__cell" data-name="'+columns[i].name+'" '+(columns[i].style?'style="'+columns[i].style+'"':'')+'>'+(data[columns[i].name]?data[columns[i].name]:'')+'</'+cellTag+'>';
            }
        }
        if (attributes){
            for(var attr in attributes)
                line.setAttribute(attr,attributes[attr]);
        }
        table.$container.append(line);
        if (table.addTooltip) 
            table.convertTooltips();
        table.$lines = table.$el.find('.table-list__line,tr:not(.table-list__headline)');
        return line;
    }

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
        table.log('resize', this);
    }

    $(function(){
        $('body').on('click','.separator',function(e){
            var lines = $(this).nextUntil('.separator','.table-list__line,tr');
            if ($(this).hasClass('inactive'))
                $(this).removeClass('inactive').nextUntil('.separator','.table-list__line,tr').show();
            else
                $(this).addClass('inactive').nextUntil('.separator','.table-list__line,tr').hide();
        });

        $('body').on('click','.table-list__action--toggler',function(e){
            $(this).closest('.table-list__cell,td').toggleClass('toggled');
        });
    });
    return TableList;
}