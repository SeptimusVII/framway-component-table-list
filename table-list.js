module.exports = function(app){
    var TableList = Object.getPrototypeOf(app).TableList = new app.Component("table-list");
    // TableList.debug = true;
    TableList.createdAt      = "2.0.0";
    TableList.lastUpdate     = "2.0.0";
    TableList.version        = "1";
    // TableList.factoryExclude = true;
    // TableList.loadingMsg     = "This message will display in the console when component will be loaded.";
    // TableList.requires       = [];

    $(function(){
        $('body').on('click','.table-list__line.separator',function(e){
            var lines = $(this).nextUntil('.table-list__line.separator','.table-list__line');
            if ($(this).hasClass('inactive'))
                $(this).removeClass('inactive').nextUntil('.table-list__line.separator','.table-list__line').show();
            else
                $(this).addClass('inactive').nextUntil('.table-list__line.separator','.table-list__line').hide();
        });
    });
    return TableList;
}