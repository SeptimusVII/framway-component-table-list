module.exports = function(app){
    var TableList = Object.getPrototypeOf(app).TableList = new app.Component("table-list");
    // TableList.debug = true;
    TableList.createdAt      = "2.0.0";
    TableList.lastUpdate     = "2.0.0";
    TableList.version        = "1";
    // TableList.factoryExclude = true;
    // TableList.loadingMsg     = "This message will display in the console when component will be loaded.";
    // TableList.requires       = [];

    // TableList.prototype.onCreate = function(){
    // do thing after element's creation
    // }
    return TableList;
}