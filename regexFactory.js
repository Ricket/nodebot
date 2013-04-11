/**
 * Scripts should use these functions to populate the regex parameter
 * of the listen function in a standardized way.
 */

require("./config.js");

// http://stackoverflow.com/a/6969486
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function prefix(notPrefixed) {
    if (notPrefixed) {
        return "";
    }

    return "(?:"
        + escapeRegExp(nodebot_prefs.command_prefix) + " ?"
        + "|"
        + escapeRegExp(nodebot_prefs.nickname) + "[:,] "
        + ")";
}

exports.only = function (keyword, notPrefixed) {
    return new RegExp("PRIVMSG [^ ]+ :" + prefix(notPrefixed) + escapeRegExp(keyword) + "$", "i");
};

exports.startsWith = function (keyword, notPrefixed) {
    return new RegExp("PRIVMSG [^ ]+ :" + prefix(notPrefixed) + escapeRegExp(keyword) + "\\b(.*)$", "i");
};

