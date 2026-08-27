module.exports = function(){
    let TableList = Object.getPrototypeOf(fw).TableList = class TableList extends fw.Component{
        static {
            // this.debug = true;
            this.createdAt  = "3.0.0";
            this.lastUpdate = "3.0.0";
            this.version = "1.0.0";
            this.tpl = utils.getNodeFromString(require('bundle-tpl:./table-list.html')).outerHTML;
            // this.describe();
            this.togglerActionsClick = document.addEventListener('click',(e)=>{
                let toggler = e.target.closest('.table-list__action--toggler');
                if (toggler) {
                    toggler.closest('.table-list__action--wrapper').classList.toggle('active')
                }
            });

            this.actionRemoveLineClick = document.addEventListener('click',(e)=>{
                let action = e.target.closest('.table-list__action[data-action=removeLine]');
                if (action) {
                    if (action.closest('.table-list').component.confirmRemoveLine)
                        if (!window.confirm("Remove line ?"))
                            return false;
                    let line = action.closest('.table-list__line,tr:not(.table-list__headline)');
                    action.closest('.table-list').component.removeLine(line)  
                }
            });

            this.togglerSeparator = document.addEventListener('click',(e)=>{
                let toggler = e.target.closest('.separator');
                if (toggler) {
                    var lines = utils.nextUntil(toggler,'.separator','.table-list__line,tr');
                    if (toggler.classList.contains('inactive')){
                        toggler.classList.remove('inactive');
                        for(var line of lines)
                            line.classList.remove('hidden')
                    }
                    else{
                        toggler.classList.add('inactive');
                        for(var line of lines)
                            line.classList.add('hidden')
                    }
                }
            });
        }
        onCreate(){
            this.container     = this.el.querySelector('.table-list__container') ?? false;
            this.headline      = this.el.querySelector('.table-list__headline')  ?? false;
            this.isTable       = (this.container.nodeName == 'TABLE');
            if (this.isTable)
                this.container = this.container.querySelector("tbody");
            this.setLines();

            this.responsive        ??= this.getData('responsive', false);
            this.minWidthBlock     ??= this.getData('minwidthblock', false);
            this.addTooltip        ??= this.getData('addtooltip', true);
            this.keepOne           ??= this.getData('keepone', true);
            this.confirmRemoveLine ??= this.getData('confirmremoveline', true);

            if (this.responsive){
                if(this.minWidthBlock)
                    for(var line of this.lines)
                        line.style.minWidth = this.minWidthBlock
            }

            // console.log(this);
        }

        convertTooltips() {
            this.el.querySelectorAll('.table-list__action').forEach((el)=>{
                if (el.getAttribute('title')) {
                    el.setAttribute('tooltip', el.getAttribute('title'))
                    el.setAttribute('title', '');
                }
            });
            utils.adjustTooltips()
        }
        getLines(){
            return this.el.querySelectorAll('.table-list__line,tr:not(.table-list__headline):not(.separator)') ?? false;
        }   
        setLines(){
            this.lines = this.getLines();
            if (this.addToolTips) 
                this.convertTooltips();
            if (this.el.classList.contains('lastColSticky'))
                this.setStickyObservers();
            if(this.headline && this.headline.querySelector('[data-label]') && this.lines.length)
                this.setLinesTitles();
            if (this.keepOne) {
                this.el.classList.remove('no-removeLine');
                if (this.lines.length <= 1)
                    this.el.classList.add('no-removeLine');
            }
        }
        setLinesTitles(){
            for(var thcell of this.headline.querySelectorAll('.table-list__cell,:is(td,th):not(.table-list__cell)').filter('[data-label]')){
                for(var line of this.lines){
                    let cell = line.querySelector('[data-name="'+thcell.getAttribute('data-name')+'"]');
                    if (cell) {
                        cell.setAttribute('data-label',thcell.getAttribute('data-label'));
                        cell.setAttribute('title',thcell.getAttribute('data-label'));
                    }
                }
            }
        }
        setStickyObservers(){
            for( var line of this.lines){
                utils.monitorStick(line.querySelector('td:last-child,.table-list__cell:last-child'), 'is-pinned', '0px -1px 0px 0px');
            }
        }
        removeLine(line){
            line.remove();
            this.setLines();
            return this;
        }
        addLine(data = false, attributes = false){ 
            var line = document.createElement(this.isTable?'tr':'div');
            var cellTag = this.isTable?'td':'div';
            var columns = [];
            this.headline.querySelectorAll('.table-list__cell,td:not(.table-list__cell),th:not(.table-list__cell)').forEach((el)=>{
                columns.push({
                    'name': el.getAttribute('data-name'),
                    'style': el.getAttribute('style'),
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
            this.container.append(line);
            this.setLines();
            return line;
        }
        onResize(){
            if (this.responsive) {
                this.el.classList.remove('mode--block');
                if (this.container.clientWidth > this.el.clientWidth)
                    this.el.classList.add('mode--block');
            }
        }
    }
    return TableList;
}