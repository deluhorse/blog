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
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes();
    return (Y + M + D + h + m);
}