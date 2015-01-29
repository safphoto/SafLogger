var SAF = SAF || {};

SAF.Logger = function () {
    'use strict';

    var self = this;
    var appender = function(logEntry) {};
    var level = 0;

    /**
     * User specified appender options
     * @type {{}}
     */
    this.appenderOptions = {};

    /**
     * Canned appenders. The user can specify a custom appender by passing in a
     * function reference as the appender.
     * @type {{CONSOLE: Function, HTML: Function}}
     */
    this.appenders = {
        CONSOLE: function(logEntry) {
            if(hasConsoleLog()) {
                window.console.log(logEntry);
            }
        },
        HTML: function(logEntry, options) {
            if(options.hasOwnProperty('elementId')) {
                var element = document.getElementById(options.elementId);
                var newLine = document.createElement("br");
                element.appendChild(newLine);
                var entry = document.createTextNode(logEntry);
                element.appendChild(entry);
            }
        }
    };

    /**
     * Log levels that can be used with this logger
     * @type {{DEBUG: number, INFO: number, WARN: number, ERROR: number}}
     */
    this.levels = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    /**
     * Initialize the logger by passing to it the log level, the appender, and the appender options
     * @param targetLevel
     * @param targetAppender
     * @param targetAppenderOptions
     */
    this.init = function(targetLevel, targetAppender, targetAppenderOptions) {
        level = targetLevel;
        appender = targetAppender;
        this.appenderOptions = targetAppenderOptions;

        return this;
    };

    /**
     * Begin the console group
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
     * End the console group
     */
    this.groupEnd = function() {
        if (hasConsoleGroup()) {
            window.console.groupEnd();
        }
    };

    /**
     * Write out a log entry, formatting it first
     * @param targetLevel
     * @param message
     * @returns {SAF.Logger}
     */
    this.log = function (targetLevel, message) {
        if (targetLevel >= level) {
            var logEntry = formatLogEntry(message);
            appender(logEntry, self.appenderOptions);
        }
        return this;
    };

    /**
     * Verifies that the window has a console
     * @returns {Console|Console.log}
     */
    var hasConsoleLog = function() {
        return window.console && window.console.log;
    };

    /**
     * Verifies that the window has a console group
     * @returns {Console|Console.group}
     */
    var hasConsoleGroup = function() {
        return window.console && window.console.group;
    };

    /**
     * Replace all instances of a substring with the specified string
     * @param source
     * @param find
     * @param replace
     * @returns {string}
     */
    var replaceAll = function(source, find, replace) {
        return source.split(find).join(replace);
    };

    /**
     * Javascript implementation of the standard string.format(template, values[])
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
     * Formatting the log entry with a timestamp
     * @param message
     * @returns {*}
     */
    var formatLogEntry = function (message) {
        var timeStamp = new Date();

        return format('{0} {1} {2}',
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
     * Creates a date string with elements padded left with zeros
     * @param date
     */
    var formatDate = function(date) {
        return format("{0}/{1}/{2}",
            padLeft(2, 0, date.getMonth() + 1),
            padLeft(2, 0, date.getDate()),
            date.getFullYear());
    };

    /**
     * Creates a time string with elements padded left with zeros
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