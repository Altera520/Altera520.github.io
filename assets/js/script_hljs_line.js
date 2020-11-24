!function (h, k) {
    function x() {
        var b = k.createElement("style");
        b.type = "text/css";
        b.innerHTML = l(".{0}{border-collapse:collapse}.{0} td{padding:0}.{1}:before{content:attr({2})}", [p, q, m]);
        k.getElementsByTagName("head")[0].appendChild(b)
    }

    function y(b) {
        "interactive" === k.readyState || "complete" === k.readyState ? r(b) : h.addEventListener("DOMContentLoaded", function () {
            r(b)
        })
    }

    function r(b) {
        try {
            var c = k.querySelectorAll("code.hljs,code.nohighlight"), a;
            for (a in c) c.hasOwnProperty(a) && t(c[a], b)
        } catch (e) {
            h.console.error("LineNumbers error: ",
                e)
        }
    }

    function t(b, c) {
        "object" == typeof b && h.setTimeout(function () {
            b.innerHTML = u(b, c)
        }, 0)
    }

    function z(b, c) {
        if ("string" == typeof b) {
            var a = document.createElement("code");
            return a.innerHTML = b, u(a, c)
        }
    }

    function u(b, c) {
        c = c || {singleLine: !1};
        c = c.singleLine ? 0 : 1;
        v(b);
        var a = b.innerHTML;
        b = 0 === a.length ? [] : a.split(n);
        if ("" === b[b.length - 1].trim() && b.pop(), b.length > c) {
            c = "";
            a = 0;
            for (var e = b.length; a < e; a++) c += l('<tr><td class="{0} {1}" {3}="{5}"><div class="{2}" {3}="{5}"></div></td><td class="{0} {4}" {3}="{5}">{6}</td></tr>',
                [A, B, q, m, w, a + 1, 0 < b[a].length ? b[a] : " "]);
            b = l('<table class="{0}">{1}</table>', [p, c])
        } else b = a;
        return b
    }

    function v(b) {
        b = b.childNodes;
        for (var c in b) if (b.hasOwnProperty(c)) {
            var a = b[c];
            if (0 < (a.textContent.trim().match(n) || []).length) if (0 < a.childNodes.length) v(a); else {
                a = a.parentNode;
                var e = a.className;
                if (/hljs-/.test(e)) {
                    var d = a.innerHTML;
                    d = 0 === d.length ? [] : d.split(n);
                    for (var f = 0, g = ""; f < d.length; f++) g += l('<span class="{0}">{1}</span>\n', [e, 0 < d[f].length ? d[f] : " "]);
                    a.innerHTML = g.trim()
                }
            }
        }
    }

    function l(b, c) {
        return b.replace(/\{(\d+)\}/g,
            function (a, b) {
                return c[b] ? c[b] : a
            })
    }

    var p = "hljs-ln", A = "hljs-ln-line", w = "hljs-ln-code", B = "hljs-ln-numbers", q = "hljs-ln-n",
        m = "data-line-number", n = /\r\n|\r|\n/g;
    h.hljs ? (h.hljs.initLineNumbersOnLoad = y, h.hljs.lineNumbersBlock = t, h.hljs.lineNumbersValue = z, x()) : h.console.error("highlight.js not detected!");
    document.addEventListener("copy", function (b) {
        var c = window.getSelection(), a;
        a:{
            for (a = c.anchorNode; a;) {
                if (a.className && -1 !== a.className.indexOf("hljs-ln-code")) {
                    a = !0;
                    break a
                }
                a = a.parentNode
            }
            a = !1
        }
        if (a) {
            if (-1 !==
                window.navigator.userAgent.indexOf("Edge")) {
                for (var e = c.toString(), d = c.anchorNode; "TD" !== d.nodeName;) d = d.parentNode;
                for (a = c.focusNode; "TD" !== a.nodeName;) a = a.parentNode;
                var f = parseInt(d.dataset.lineNumber);
                c = parseInt(a.dataset.lineNumber);
                if (f != c) {
                    var g = d.textContent;
                    a = a.textContent;
                    if (f > c) {
                        var h = f;
                        f = c;
                        c = h;
                        h = g;
                        g = a;
                        a = h
                    }
                    for (; 0 !== e.indexOf(g);) g = g.slice(1);
                    for (; -1 === e.lastIndexOf(a);) a = a.slice(0, -1);
                    for (e = g; "TABLE" !== d.nodeName;) d = d.parentNode;
                    for (f += 1; f < c; ++f) g = l('.{0}[{1}="{2}"]', [w, m, f]), g = d.querySelector(g),
                        e += "\n" + g.textContent;
                    c = e + ("\n" + a)
                } else c = e
            } else c = c.toString();
            b.clipboardData.setData("text/plain", c);
            b.preventDefault()
        }
    })
}(window, document);