/*
 * 
 *
 */
console.log("============================================================");
console.log("==============        欢迎使用MyDog            ==============");
console.log("============================================================");

/*
require(['http'],function(http){
    alert(http.add(1,1));
})
*/

if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

// universal http request 
(function(global,$,undefined){
    'use strict';
    var statusCode = {
        401: function() {
            // 清除sessionStorage
            sessionStorage.removeItem('um');
            location.href = 'login.html';
        },
        403: function(){
            // 清除sessionStorage
            sessionStorage.removeItem('um');
            location.href = 'login.html';
        },
        404: function() {
            location.href = '404.html';
        },
        500: function(){
            // 最好是微提示
            alert(err || err.message || '服务器异常');
        }
    };
    var request = function(options){
        return $.ajax({
            url: options.url,
            headers:{
                Authorization:sessionStorage.getItem('um') || ''
            },
            data:options.data,
            type: options.type || 'get',
            // 文件上传请去掉contentType
            contentType: (options.extra && options.extra.contentType) || 'application/json; charset=UTF-8',
            statusCode: statusCode,
            beforeSend: function() {
                // 显示加载的loading...
            },
            complete:function(){
                // 关闭loading...
            },
            success:function(data, textStatus, jqXHR){
                // 2xx~3xx

            },
            error: function(xhr,statusText,err){
                // 4xx~5xx
            }
        });
    };
    var $_ajax = {
        get: function(url,data,extra){
            var opt = {url:url,data:data,type:'get'};
            if (extra) {opt.extra=extra;}
            //if(extra && extra.headers) opt.headers = extra.headers;
            //if(extra && extra.dataType) opt.dataType = extra.dataType;
            return request(opt);
        },
        post: function(url,data,extra){
            var opt = {url:url,data:data,type:'post'};
            if (extra) {opt.extra=extra;}
            //if(extra && extra.headers) opt.headers = extra.headers;
            //if(extra && extra.dataType) opt.dataType = extra.dataType;
            return request(opt);
        },
        put: function(url,data,extra){
            var opt = {url:url,data:data,type:'put'};
            if (extra) {opt.extra=extra;}
            //if(extra && extra.headers) opt.headers = extra.headers;
            //if(extra && extra.dataType) opt.dataType = extra.dataType;
            return request(opt);
        },
        delete: function(url,data,extra){
            var opt = {url:url,data:data,type:'delete'};
            if (extra) {opt.extra=extra;}
            //if(extra && extra.headers) opt.headers = extra.headers;
            //if(extra && extra.dataType) opt.dataType = extra.dataType;
            return request(opt);
        }
    };
    global.$_ajax = $_ajax;



})(window, jQuery);


// load menu
function loadMenu(){
    // debugger;
    // $_ajax.get('menu.html',{},{dataType:'jsonp',success: function(res){
    //     console.log(res);
    //     $("#menu-box").html(res);
    // }})
}
$(document).ready(function () {

    loadMenu();

    // Add body-small class if window less than 768px
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }

    // MetisMenu
    $('#side-menu').metisMenu();

    // Collapse ibox function
    $('.collapse-link').on('click', function () {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        var content = ibox.children('.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    });

    // Close ibox function
    $('.close-link').on('click', function () {
        var content = $(this).closest('div.ibox');
        content.remove();
    });

    // Fullscreen ibox function
    $('.fullscreen-link').on('click', function () {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        $('body').toggleClass('fullscreen-ibox-mode');
        button.toggleClass('fa-expand').toggleClass('fa-compress');
        ibox.toggleClass('fullscreen');
        setTimeout(function () {
            $(window).trigger('resize');
        }, 100);
    });

    // Close menu in canvas mode
    $('.close-canvas-menu').on('click', function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });

    // Run menu of canvas
    $('body.canvas-menu .sidebar-collapse').slimScroll({
        height: '100%',
        railOpacity: 0.9
    });

    // Open close right sidebar
    $('.right-sidebar-toggle').on('click', function () {
        $('#right-sidebar').toggleClass('sidebar-open');
    });

    // Initialize slimscroll for right sidebar
    $('.sidebar-container').slimScroll({
        height: '100%',
        railOpacity: 0.4,
        wheelStep: 10
    });

    // Open close small chat
    $('.open-small-chat').on('click', function () {
        $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
        $('.small-chat-box').toggleClass('active');
    });

    // Initialize slimscroll for small chat
    $('.small-chat-box .content').slimScroll({
        height: '234px',
        railOpacity: 0.4
    });

    // Small todo handler
    $('.check-link').on('click', function () {
        var button = $(this).find('i');
        var label = $(this).next('span');
        button.toggleClass('fa-check-square').toggleClass('fa-square-o');
        label.toggleClass('todo-completed');
        return false;
    });

    // Append config box / Only for demo purpose
    // Uncomment on server mode to enable XHR calls
    //$.get("skin-config.html", function (data) {
    //    if (!$('body').hasClass('no-skin-config'))
    //        $('body').append(data);
    //});

    // Minimalize menu
    $('.navbar-minimalize').on('click', function (event) {
        event.preventDefault();
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();

    });

    // Tooltips demo
    $('.tooltip-demo').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });


    // Full height of sidebar
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebar-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarheight = $('nav.navbar-default').height();
        var wrapperHeight = $('#page-wrapper').height();

        if (navbarheight > wrapperHeight) {
            $('#page-wrapper').css("min-height", navbarheight + "px");
        }

        if (navbarheight < wrapperHeight) {
            $('#page-wrapper').css("min-height", $(window).height() + "px");
        }

        if ($('body').hasClass('fixed-nav')) {
            if (navbarheight > wrapperHeight) {
                $('#page-wrapper').css("min-height", navbarheight + "px");
            } else {
                $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
            }
        }

    }

    fix_height();

    // Fixed Sidebar
    $(window).bind("load", function () {
        if ($("body").hasClass('fixed-sidebar')) {
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }
    });

    // Move right sidebar top after scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    $(window).bind("load resize scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    $("[data-toggle=popover]")
        .popover();

    // Add slimscroll to element
    $('.full-height-scroll').slimscroll({
        height: '100%'
    })
});


// Minimalize menu when screen is less than 768px
$(window).bind("resize", function () {
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }
});

// Local Storage functions
// Set proper body class and plugins based on user configuration
$(document).ready(function () {
    if (localStorageSupport()) {

        var collapse = localStorage.getItem("collapse_menu");
        var fixedsidebar = localStorage.getItem("fixedsidebar");
        var fixednavbar = localStorage.getItem("fixednavbar");
        var boxedlayout = localStorage.getItem("boxedlayout");
        var fixedfooter = localStorage.getItem("fixedfooter");

        var body = $('body');

        if (fixedsidebar == 'on') {
            body.addClass('fixed-sidebar');
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }

        if (collapse == 'on') {
            if (body.hasClass('fixed-sidebar')) {
                if (!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                }
            } else {
                if (!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                }

            }
        }

        if (fixednavbar == 'on') {
            $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
            body.addClass('fixed-nav');
        }

        if (boxedlayout == 'on') {
            body.addClass('boxed-layout');
        }

        if (fixedfooter == 'on') {
            $(".footer").addClass('fixed');
        }
    }
});

// check if browser support HTML5 local storage
function localStorageSupport() {
    return (('localStorage' in window) && window['localStorage'] !== null)
}

// For demo purpose - animation css script
function animationHover(element, animation) {
    element = $(element);
    element.hover(
        function () {
            element.addClass('animated ' + animation);
        },
        function () {
            //wait for animation to finish before removing classes
            window.setTimeout(function () {
                element.removeClass('animated ' + animation);
            }, 2000);
        });
}

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        $('#side-menu').hide();
        // For smoothly turn on menu
        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 200);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(400);
            }, 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $('#side-menu').removeAttr('style');
    }
}

// Dragable panels
function WinMove() {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    var connect = "[class*=col]";
    $(element).sortable(
        {
            handle: handle,
            connectWith: connect,
            tolerance: 'pointer',
            forcePlaceholderSize: true,
            opacity: 0.8
        })
        .disableSelection();
}

// add feature animal
function featurePanelOpen(e){
    var $parent       = getParent($(e))
    //var relatedTarget = { relatedTarget: this }

    if (!$parent.hasClass('open')) {
        $(e).attr('aria-expanded', 'true');
        $parent.addClass('open');
    }else{
        $(e).attr('aria-expanded', 'false');
        $parent.removeClass('open');
    }
}

// find parent
function getParent($this) {
    var selector = $this.attr('data-target')
    if (!selector) {
        selector = $this.attr('href')
        selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }
    var $parent = selector && $(selector)
    return $parent && $parent.length ? $parent : $this.parent()
}

// register mydog plugin ajax request
(function ($,$_ajax) {
    'use strict';
    // mydog

})(jQuery,$_ajax)

/*
    序列化form表单的数据
 */
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function mydogSubmit(){
    var myDogProjectParams = $("form[name='myDogProjectParams']").serializeObject();
    var myDogDataSourceParams = $("form[name='myDogDataSourceParams']").serializeObject();
    var myDogEntityParams = $("form[name='myDogEntityParams']").serializeObject();
    var myDogEntityUIParams = $("form[name='myDogEntityUIParams']").serializeObject();
    var myDogPluginsParams = {
            myDogProjectParams: myDogProjectParams,
            myDogDataSourceParams:myDogDataSourceParams,
            myDogEntityParams:myDogEntityParams,
            myDogEntityUIParams:myDogEntityUIParams
    }
    console.log(JSON.stringify(myDogPluginsParams));
    var data = JSON.stringify(myDogPluginsParams);
    /*var extra={
        contentType:"application/x-www-form-urlencoded"
    }*/
    $_ajax.post('http://localhost:8985/v1/mydog/plugin/mydogPlugins',data)

}
