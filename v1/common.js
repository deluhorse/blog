/**
 * @author: delu
 * @file: common.js
 * @time: 18/8/31 22:11
 */

function timestamp_to_str(timestamp){
    timestamp = parseInt(timestamp) * 1000;
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return (Y + M + D + h + m);
}

/**
 * html转义, 防止js注入
 * @param str
 * @returns {jQuery}
 */
function htmlEncodeJQ (str) {
    return $('<span/>').text(str).html();
}

/**
 * html
 * @param str
 * @returns {jQuery}
 */
function htmlDecodeJQ (str) {
    return $('<span/>').html(str).text();
}