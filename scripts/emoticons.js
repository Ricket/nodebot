// http://unicodeemoticons.com/
// http://rishida.net/tools/conversion/

listen(regexFactory.only("get mad"), function (match, data, replyTo) {
    irc.privmsg(replyTo, "(\u256F\u00B0\u25A1\u00B0\uFF09\u256F\uFE35 \u253B\u2501\u253B", true);
});

listen(regexFactory.only("soviet russia"), function (match, data, replyTo) {
    irc.privmsg(replyTo, "\u252C\u2500\u252C\uFEFF \uFE35 /(.\u25A1. \\\uFF09", true);
});

listen(regexFactory.only("calm down"), function (match, data, replyTo) {
    irc.privmsg(replyTo, "\u252C\u2500\u2500\u252C \u30CE( \u309C-\u309C\u30CE)", true);
});

listen(regexFactory.only("be cool"), function (match, data, replyTo) {
    irc.privmsg(replyTo, "\u2022_\u2022)", true);
    setTimeout(function () {
        irc.privmsg(replyTo, "( \u2022_\u2022)>\u2310\u25A0-\u25A0", true);
    }, 750);
    setTimeout(function () {
        irc.privmsg(replyTo, "(\u2310\u25A0_\u25A0)", true);
    }, 1500);
});

