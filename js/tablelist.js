/*
 * 表格(table)数据显示处理类
 */
(function($) {
    var TableList = function TableList(element, options) {
        this.init(element, options);
    }, old = null;
    TableList.prototype = {
        init:function(element, options) {
            this.$table = $(element);
            this.$thead = this.$table.find("thead"), this.$tbody = this.$table.find("tbody"), 
            this.$tfoot = this.$table.find("tfoot");
            var self = this;
            this.$table.dragTable();
            this.$table.stupidtable({
                date:function(a, b) {
                    var aDate = new Date(a.replace(/-/g, "/"));
                    var bDate = new Date(b.replace(/-/g, "/"));
                    return aDate - bDate;
                },
                moveBlanks:function(a, b) {
                    if (a < b) {
                        if (a == "") return 1; else return -1;
                    }
                    if (a > b) {
                        if (b == "") return -1; else return 1;
                    }
                    return 0;
                },
                moveBlanksDesc:function(a, b) {
                    if (a < b) return 1;
                    if (a > b) return -1;
                    return 0;
                }
            });
            this.$table.on("aftertablesort", function(event, data) {
                var th = $(this).find("th");
                th.find(".arrow").remove();
                var dir = $.fn.stupidtable.dir;
                var arrow = data.direction === dir.ASC ? "&uarr;" :"&darr;";
                th.eq(data.column).append('<span class="arrow">' + arrow + "</span>");
            });
            this.$thead.find("input[type='checkbox']").change(function() {
                var isChecked = $(this).is(":checked");
                self.$tbody.find("input[type='checkbox']").each(function() {
                    $(this).prop("checked", isChecked);
                });
            });
            this.setOptions(options);
        },
        setOptions:function(options) {
            this.options = $.extend({}, this.options || $.fn.tableList.defaults, options);
            this.$table.tableScroll(this.options.height, this.options.cutHeight);
            var currentPage = 1;
            if (Boolean(this.options.url)) {
                if (Boolean(this.options.searchForm)) {
                    var searchParams = JSON.parse(window.sessionStorage.getItem(window.location.href + "_searchParams"));
                    if (Boolean(searchParams)) {
                        window.sessionStorage.removeItem(window.location.href + "_searchParams");
                        for (key in searchParams) {
                            $(this.options.searchForm + " input[data-key='" + key + "']").val(searchParams[key]);
                            $(this.options.searchForm + " select[data-key='" + key + "']").find("option[value='" + searchParams[key] + "']").attr("selected", true);
                        }
                        var searchParams = $(this.options.searchForm).serialize();
                        var self = this, flag = false;
                        searchParams.split("&").forEach(function(item) {
                            if (self.options.param.indexOf(item.split("=")[0]) > -1) {
                                flag = true;
                                return;
                            }
                        });
                        if (flag) this.options.param = $(this.options.searchForm).serialize(); else this.options.param += "&" + $(this.options.searchForm).serialize();
                    }
                }
                currentPage = window.sessionStorage.getItem(window.location.href + "_currentPage");
                if (Boolean(currentPage)) window.sessionStorage.removeItem(window.location.href + "_currentPage"); else currentPage = 1;
            }
            if (this.options.paging) {
                var self = this;
                this.page_options = {
                    size:"small",
                    alignment:"left",
                    currentPage:currentPage,
                    totalPages:1,
                    itemContainerClass:function(type, page, current) {
                        return page === current ? "active" :"pointer-cursor";
                    },
                    onPageClicked:function(e, originalEvent, type, page) {
                        self.$thead.find("th span.arrow").remove();
                        if (page >= self.page_options.totalPages) self.page_options.currentPage = self.page_options.totalPages; else self.page_options.currentPage = page;
                        self.page_param = "&page.startIndex=" + (self.page_options.currentPage - 1) * self.options.pageSize;
                        self.page_param += "&page.pageSize=" + self.options.pageSize;
                        self.initTableList();
                    },
                    tooltipTitles:function(type, page, current) {
                        switch (type) {
                          case "first":
                            return page_message_options.first;

                          case "prev":
                            return page_message_options.prev;

                          case "next":
                            return page_message_options.next;

                          case "last":
                            return page_message_options.last;

                          case "page":
                            return page === current ? page_message_options.current_page + page :page_message_options.goto_page + page + page_message_options.page;
                        }
                    }
                };
                this.page_param = "&page.startIndex=" + (this.page_options.currentPage - 1) * this.options.pageSize;
                this.page_param += "&page.pageSize=" + this.options.pageSize;
            }
            this.initTableList();
        },
        initTableList:function() {
            if (!Boolean(this.options.url)) return;
            var self = this;
            this.$thead.find("input[type='checkbox']").prop("checked", false);
            this.$tbody.empty();
            this.$tfoot.find("td").html("&nbsp;");
            this.dataList = null;
            var param = this.options.param;
            if (this.options.paging) param += this.page_param;
            $.post(this.options.url, param, function(data) {
                if (self.options.paging) {
                    var pageObj = data[self.options.dataKey];
                    self.dataList = pageObj.records;
                    if (self.dataList.length == 0 && self.page_options.currentPage > 1) {
                        self.page_options.currentPage--;
                        self.page_param = "&page.startIndex=" + (self.page_options.currentPage - 1) * self.options.pageSize;
                        self.page_param += "&page.pageSize=" + self.options.pageSize;
                        self.initTableList();
                        return;
                    }
                    self.page_options.totalPages = pageObj.totalCount % self.options.pageSize == 0 ? Math.floor(pageObj.totalCount / self.options.pageSize) :Math.floor(pageObj.totalCount / self.options.pageSize) + 1;
                    if (self.page_options.totalPages > 1) {
                        self.$tfoot.find("td").attr("style", "text-align:" + self.page_options.alignment + ";padding-left:15px");
                        self.$tfoot.find("td").bootstrapPaginator(self.page_options);
                    } else {
                        self.$tfoot.find("td").html("&nbsp;");
                    }
                } else {
                    self.dataList = data[self.options.dataKey];
                }
                self.$tbody.empty();
                var html = "";
                if (Boolean(self.dataList) && self.dataList.length > 0) {
                    $.each(self.dataList, function(i) {
                        if (typeof self.options.template === "function") {
                            if (self.options.paging) html += self.options.template(i, this, (self.page_options.currentPage - 1) * self.options.pageSize + i + 1); else html += self.options.template(i, this);
                        }
                    });
                } else {
                    html += '<tr><td colspan="' + self.$thead.find("th").length + '">' + tip_message.no_data + "</td></tr>";
                }
                self.$tbody.append(html);
                $(".alt").tooltip({
                    html:true,
                    placement:"bottom"
                });
                self.$tbody.find("input[type='checkbox']").change(function() {
                    if (self.$tbody.find("input[type='checkbox']").length == self.$tbody.find("input[type='checkbox']:checked").length) {
                        self.$thead.find("input[type='checkbox']").prop("checked", true);
                    } else {
                        self.$thead.find("input[type='checkbox']").prop("checked", false);
                    }
                });
                if (typeof self.options.finishCallBack === "function") self.options.finishCallBack(self.dataList);
            });
        },
        refresh:function() {
            this.initTableList();
        },
        search:function(options) {
            if (this.options.paging) this.page_options.currentPage = 1;
            this.setOptions(options);
        },
        initTableListByData:function(dataList) {
            var self = this;
            this.$thead.find("input[type='checkbox']").prop("checked", false);
            this.$tbody.empty();
            this.dataList = dataList;
            $.each(this.dataList, function(i) {
                if (typeof self.options.template === "function") {
                    self.$tbody.append(self.options.template(i, this));
                }
            });
            $(".alt").tooltip({
                placement:"bottom"
            });
            this.$tbody.find("input[type='checkbox']").change(function() {
                if (self.$tbody.find("input[type='checkbox']").length == self.$tbody.find("input[type='checkbox']:checked").length) {
                    self.$thead.find("input[type='checkbox']").prop("checked", true);
                } else {
                    self.$thead.find("input[type='checkbox']").prop("checked", false);
                }
            });
            if (typeof self.options.finishCallBack === "function") self.options.finishCallBack(self.dataList);
        },
        saveSearchParams:function() {
            if (Boolean(this.options.searchForm)) {
                var searchParams = {};
                $(this.options.searchForm + " input," + this.options.searchForm + " select").each(function() {
                    searchParams[$(this).attr("data-key")] = $(this).val();
                });
                window.sessionStorage.setItem(window.location.href + "_searchParams", JSON.stringify(searchParams));
            }
            window.sessionStorage.setItem(window.location.href + "_currentPage", this.page_options.currentPage);
        }
    };
    old = $.fn.tableList;
    $.fn.tableList = function(option) {
        var result = null;
        $(this).each(function(i, item) {
            var $this = $(item), data = $this.data("tableList"), options = typeof option !== "object" ? null :option;
            if (!data) {
                $this.data("tableList", data = new TableList(this, options));
            } else {
                data.setOptions(options);
            }
            result = data;
        });
        return result;
    };
    $.fn.tableList.defaults = {
        height:0,
        cutHeight:70,
        url:"",
        param:"",
        dataKey:"list",
        finishCallBack:function() {},
        template:function() {},
        paging:false,
        pageSize:30,
        searchForm:""
    };
})(jQuery);