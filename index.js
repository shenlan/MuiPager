/**
 *var a = $('#test1').MuiPager({totalCount: 20});
 *var b = $('#test1').MuiPager('reset', {totalCount: 20});
 */
(function($){
    var pluginName = 'MuiPager';

    var Temp = {
        init: function(target){
            var self = this,
                opt = target.data(pluginName);

            self.render(target);
            self.bind(target);
        },
        render: function(target){
            var self = this,
                opt = target.data(pluginName),
                curPage = opt.curPage,
                maxPage = opt.maxPage,
                start, end,
                half = 4,
                tpl = [];


            //345 6 789
            if(maxPage <= 2 * half){
                start = 1;
                end = maxPage;
            }else{
                if(curPage <= half){
                    start = 1;
                    end = 2 * half+1;
                }else{
                    start = curPage - half;
                    end = curPage + half;
                }
                if(curPage + half > maxPage){
                    start = maxPage - 2 * half;
                    end = maxPage;
                }
            }

            if(curPage <= 1){
                tpl.push('<span>首页</span>');
                tpl.push('<span>上一页</span>');
            }else{
                tpl.push('<a href="javascript:;" data-page="1">首页</a>');
                tpl.push('<a href="javascript:;" data-page="', curPage - 1, '">上一页</a>');
            }

            for(var i = start; i <= end; i++){
                if(i == curPage){
                    tpl.push('<b>',i,'</b>');
                }else{
                    tpl.push('<a href="javascript:;" data-page="',i,'">',i,'</a>');
                }
            }

            if(curPage >= maxPage){
                tpl.push('<span>下一页</span>');
                tpl.push('<span>末页</span>');
            }else{
                tpl.push('<a href="javascript:;" data-page="', curPage + 1, '">下一页</a>');
                tpl.push('<a href="javascript:;" data-page="', maxPage, '">末页</a>');
            }

            target.html(tpl.join(''));
        },
        bind: function(target){
            var self = this;

            target.delegate('a', 'click', function(event){
                var me = $(this),
                    page = me.data('page');

                self.toPage(target, page);
            });
        },
        toPage: function(target, num){
            var self = this,
                opt = target.data(pluginName);

            opt.curPage = num;

            if(num < 1){
                opt.curPage = 1;
            }
            if(num > self.maxPage){
                opt.curPage = opt.maxPage;
            }

            target.data(pluginName, opt);

            self.html(target);

            opt.callback && opt.callback({limit: opt.limit, pageIndex: opt.curPage});
        },
        reset: function(target, options){
            var self = this,
                opts = target.data(pluginName);

            opts = $.extend({}, opts, options);
            opts.maxPage = Math.ceil(opts.totalCount / opts.limit);

            target.data(pluginName, opts);
            self.html(target);
        }
    }

    $.fn[pluginName] = function(options, args){
        if(typeof options == 'string'){
            return $.fn[pluginName].methods[options].call(this, args);
        }
        options = options || {};
        return this.each(function(){
            var setting = $.data(this, pluginName);

            if (setting) {
                setting = $.extend(setting, options);
            } else {
                var opts = $.extend({}, $.fn[pluginName].defaults, options);

                opts.curPage = opts.pageIndex;
                opts.maxPage = Math.ceil(opts.totalCount / opts.limit);

                $.data(this, pluginName, opts);

                Temp.init($(this));
            }
        });
    }
    $.fn[pluginName].methods = {
        reset: function(args){
            return this.each(function(){
                Temp.reset($(this), args);
            });
        }
    };
    $.fn[pluginName].defaults = {
        totalCount: 0,
        limit: 10,
        pageIndex: 1
    };
})(jQuery);