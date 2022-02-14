jQuery(document).ready(function ($) {
    $("photos img").each(function () {
        var _a = $("<a></a>").attr("href", this.src);
        $(this).wrap("<div class='photo'></div>").wrap(_a);
    })
    isImgLoad(function () {
        var photos = document.querySelector('photos');
        if (photos) {
            waterfall(photos);
        }
        $(window).resize(function () {
            if (photos) {
                waterfall(photos);
            }
        });
    });
    var t_img;
    var isLoad = true;
    function isImgLoad(callback) {
        $('photos img').each(function () {
            if (this.height === 0) {
                isLoad = false;
                return false;
            }
        });
        if (isLoad) {
            clearTimeout(t_img);
            callback();
        } else {
            isLoad = true;
            t_img = setTimeout(function () {
                isImgLoad(callback);
            }, 500);
        }
    }
});
jQuery(document).ready(function ($) {
    //灯箱
    $(".post-content img:not(.avatar)").each(function () {
        var _b = $("<a></a>").attr("href", this.src);
        $(this).wrap(_b);
    })
    $(".post-content a[rel!=link]:has(img:not(.non-box))").slimbox();
    //相对时间
    //$.lately({ 'target': '.post-date' });
    //文章 toc 固定
    var nav = $(".tocify");
    if (nav.length > 0) {
        nav.removeClass("hide");
        var navTop = $(".post-content").offset().top;
        var w = $(window).width() / 2 + 400;
        nav.css("left", w);
        nav.css("top", navTop);
        $(window).scroll(function () {
            var scrolls = $(this).scrollTop();
            if (scrolls > navTop) {
                nav.css({
                    "top": 0,
                    "position": "fixed"
                });
            } else {
                nav.css({
                    "top": navTop,
                    "position": "absolute"
                });
            };
        });
    }
    //外链新窗口
    var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
    var location_href = window.location.href.replace(parse_url, '$3');
    $('.post-content a:not(:has(img)),.author-name a,.links-item a,a.read-more').hover(function () {
        var this_href = $(this).attr('href');
        var replace_href = this_href.replace(parse_url, '$3');
        if (this_href != replace_href && location_href != replace_href) {
            $(this).attr({
                target: "_blank",
                rel: "noopener noreferrer"
            });
        }
    });
    //豆瓣图书电影条目
    $(".post-content a[href*='douban.com/subject/']").each(function () {
        var _this = $(this);
        var str = _this.attr("href");
        var db_reg = /^https\:\/\/(movie|book)\.douban\.com\/subject\/([0-9]+)\/?/;
        if (db_reg.test(str)) {
            var db_type = str.replace(db_reg, "$1");
            var db_id = str.replace(db_reg, "$2").toString();
            var db_api = "https://bm.weajs.com/api/";
            if (db_type == 'movie') {
                var ls_item = 'movie' + db_id;
                var url = db_api + "movies/" + db_id + "/";
                if (localStorage.getItem(ls_item) == null || localStorage.getItem(ls_item) == 'undefined') {
                    $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: "json",
                        success: function (data) {
                            localStorage.setItem(ls_item, JSON.stringify(data));
                            moiveShow(_this, ls_item)
                        }
                    });
                } else {
                    moiveShow(_this, ls_item)
                }
            } else if (db_type == 'book') {
                var ls_item = 'book' + db_id;
                var url = db_api + "books/" + db_id;
                if (localStorage.getItem(ls_item) == null || localStorage.getItem(ls_item) == 'undefined') {
                    $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            localStorage.setItem('book' + db_id, JSON.stringify(data));
                            bookShow(_this, ls_item)
                        }
                    });
                } else {
                    bookShow(_this, ls_item)
                }
            }
        }
    });
    function moiveShow(_this, ls_item) {
        var storage = localStorage.getItem(ls_item);
        var data = JSON.parse(storage);
        var str = _this.attr("href");
        //console.log(data)
        var db_star = Math.ceil(data.rating);
        $("<div class='post-preview'><div class='post-preview--meta'><div class='post-preview--middle'><h4 class='post-preview--title'><a target='_blank' href='" + str + "' rel='noopener noreferrer'>《" + data.title + "》</a></h4><div class='rating'><div class='rating-star allstar" + db_star + "'></div><div class='rating-average'>" + data.rating + "</div></div><time class='post-preview--date'>导演：" + data.directors + " / 类型：" + data.genres + " / " + data.pubdate + "</time><section style='max-height:75px;overflow:hidden;' class='post-preview--excerpt'>" + data.intro + "</section></div></div><img loading='lazy' class='post-preview--image' src=" + data.cover + "></div>").replaceAll(_this);
    }
    function bookShow(_this, ls_item) {
        var storage = localStorage.getItem(ls_item);
        var data = JSON.parse(storage);
        var str = _this.attr("href");
        ///console.log(data)
        var db_star = Math.ceil(data.rating);
        $("<div class='post-preview'><div class='post-preview--meta'><div class='post-preview--middle'><h4 class='post-preview--title'><a target='_blank' href='" + str + "' rel='noopener noreferrer'>《" + data.title + "》</a></h4><div class='rating'><div class='rating-star allstar" + db_star + "'></div><div class='rating-average'>" + data.rating + "</div></div><time class='post-preview--date'>作者：" + data.author + " </time><section style='max-height:75px;overflow:hidden;' class='post-preview--excerpt'>" + data.intro + "</section></div></div><img loading='lazy' class='post-preview--image' src=" + data.cover + "></div>").replaceAll(_this);
    }
});
// 回到顶部
$('.to-top').toTop({
    //options with default values
    autohide: true,
    offset: 420,
    speed: 500,
    position: true,
    right: 15,
    bottom: 30
});
// 首页调用嘀咕 JSON 版
$(document).ready(function () {
    if ($("#index-talk").length > 0) {
        jsonUrl = "https://6561-eallion-8gkunp4re49bae66-1251347414.tcb.qcloud.la/json/talks.json"
        $.getJSON(jsonUrl + "?t=" + Date.parse(new Date()), function (res) {
            var bberCount = res.count;
            var talksHtml = ''
            $.each(res.data, function (i, item) {
                d = new Date(item.date)
                date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
                dataTime = '<span class="datatime">' + date + '</span>'
                talksHtml += '<li class="item item-' + (i + 1) + '">' + dataTime + '： <a href="https://eallion.com/talk/" target="_blank" rel="noopener noreferrer">' + urlToLink(item.content) + '</a></li>'
            });
            $('#index-talk').append('<i class="iconfont icon-twitter"></i> <ul class="talk-list">' + talksHtml + '</ul>')
            Lately({
                'target': '#index-talk .datatime'
            });
        });
        function urlToLink(str) {
            var re = /\bhttps?:\/\/(?!\S+(?:jpe?g|png|bmp|gif|webp|jfif|gif))\S+/g;
            var re_forpic = /\bhttps?:[^:<>"]*\/([^:<>"]*)(\.(jpe?g)|(png)|(bmp)|(jfif)|(webp))/g;
            str = str.replace(re, function (website) {
                return '🔗';
            });
            str = str.replace(re_forpic, function (imgurl) {
                return '📷';
            });
            return str;
        }
        function Roll() {
            var list_li = $('.talk-list li'),
                cur_li = list_li.first(),
                last_li = list_li.last();
            last_li.after(cur_li);
        };
        setInterval(Roll, 3000);
        //点击关闭嘀咕 Widget
        $('button').click(function () {
            $(this).parents('#index-talk').remove();
        });
    }
});
