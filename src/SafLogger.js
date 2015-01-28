var SAF = SAF || {};

SAF.Logger = function (targetAppender, targetLevel) {
    'use strict';

    var appender = 0;
    var level = 0;

    /**
     *
     * @type {{CONSOLE: number}}
     */
    this.appenderOptions = {
        CONSOLE: 0
    };

    /**
     *
     * @type {{DEBUG: number, INFO: number, WARN: number, ERROR: number}}
     */
    this.levelOptions = {
        DEBUG:  0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    /**
     *
     * @param name
     * @returns {SAF.Logger}
     */
    this.group = function(name) {
        if (hasConsoleGroup()) {
            window.console.group(name);
        }

        return this;
    };

    /**
     *
     */
    this.groupEnd = function() {
        if (hasConsoleGroup()) {
            window.console.groupEnd();
        }
    };

    /**
     *
     * @param targetLevel
     * @param message
     * @returns {SAF.Logger}
     */
    this.log = function (targetLevel, message) {
        if (targetLevel === level) {
            var logEntry = formatLogEntry(message);

            switch (appender){
                case this.appenderOptions.CONSOLE:
                    if(hasConsoleLog()) {
                        window.console.log(logEntry);
                    }
                    break;
            }
        }
        return this;
    };

    /**
     *
     * @returns {Console|Console.log}
     */
    var hasConsoleLog = function() {
        return window.console && window.console.log;
    };

    /**
     *
     * @returns {Console|Console.group}
     */
    var hasConsoleGroup = function() {
        return window.console && window.console.group;
    };

    /**
     *
     * @param source
     * @param find
     * @param replace
     * @returns {string}
     */
    var replaceAll = function(source, find, replace) {
        return source.split(find).join(replace);
    };

    /**
     *
     * @returns {*}
     */
    var format = function() {
        var s = arguments[0];

        for (var i = 1; i < arguments.length; i++) {
            s = replaceAll(s, '{' + (i - 1) + '}', arguments[i]);
        }

        return s;
    };

    /**
     *
     * @param message
     * @returns {*}
     */
    var formatLogEntry = function (message) {
        var timeStamp = new Date();

        return format('{0} {1} ',
            formatDate(timeStamp),
            formatTime(timeStamp),
            message);
    };

    /**
     * Pad input string with specified character
     * @param size
     * @param padString
     * @param value
     * @returns {string}
     */
    var padLeft = function(size, padString, value) {
        var needed = size - value.toString().length;
        var padding = new Array(needed + 1).join(padString);
        return padding + value;
    };

    /**
     *
     * @param date
     */
    var formatDate = function(date) {
        return format("{0}/{1}/{2}",
            padLeft(2, 0, date.getMonth() + 1),
            padLeft(2, 0, date.getDate()),
            date.getFullYear());
    };

    /**
     *
     * @param date
     */
    var formatTime = function(date) {
        return format("{0}:{1}:{2}.{3}",
            padLeft(2, 0, date.getHours()),
            padLeft(2, 0, date.getMinutes()),
            padLeft(2, 0, date.getSeconds()),
            padLeft(2, 0, date.getMilliseconds()));
    };
};
