// (c) 2015 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// The admins library keeps track of administrative users. It should be used
// sparingly in scripts; prefer the "listen_admin" sandbox function for
// defining commands that can only be used by admins.
// TODO: Track the user better. Nickname is not a reliable indicator of a user,
// easy to impersonate (even if only for a short time thanks to NickServ guard)

var db = require('./listdb').getDB('admins');

exports.is = function (nickname) {
    return db.hasValue(nickname, true);
}

exports.add = function (nickname) {
    db.add(nickname);
}

exports.remove = function (nickname) {
    db.remove(nickname, true);
}

// Returns list of admins as a comma-separated string
exports.list = function () {
    return db.getAll().join(",");
};

