/**
 * @author: delu
 * @file: about.js
 * @time: 18/10/19 16:50
 */
var app = new Vue({
    el: '#app',
    data: function() {
        return {
            activeIndex: '4'
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        }
    }
});