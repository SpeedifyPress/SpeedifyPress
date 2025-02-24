function e(e) {
    const t = Object.create(null);
    for (const n of e.split(",")) t[n] = 1;
    return e => e in t
}! function() {
    const e = document.createElement("link").relList;
    if (!(e && e.supports && e.supports("modulepreload"))) {
        for (const e of document.querySelectorAll('link[rel="modulepreload"]')) t(e);
        new MutationObserver((e => {
            for (const n of e)
                if ("childList" === n.type)
                    for (const e of n.addedNodes) "LINK" === e.tagName && "modulepreload" === e.rel && t(e)
        })).observe(document, {
            childList: !0,
            subtree: !0
        })
    }

    function t(e) {
        if (e.ep) return;
        e.ep = !0;
        const t = function(e) {
            const t = {};
            return e.integrity && (t.integrity = e.integrity), e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy), "use-credentials" === e.crossOrigin ? t.credentials = "include" : "anonymous" === e.crossOrigin ? t.credentials = "omit" : t.credentials = "same-origin", t
        }(e);
        fetch(e.href, t)
    }
}();
const t = {},
    n = [],
    i = () => {},
    r = () => !1,
    o = e => 111 === e.charCodeAt(0) && 110 === e.charCodeAt(1) && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
    s = e => e.startsWith("onUpdate:"),
    a = Object.assign,
    l = (e, t) => {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1)
    },
    c = Object.prototype.hasOwnProperty,
    d = (e, t) => c.call(e, t),
    u = Array.isArray,
    h = e => "[object Map]" === w(e),
    p = e => "[object Set]" === w(e),
    f = e => "function" == typeof e,
    g = e => "string" == typeof e,
    m = e => "symbol" == typeof e,
    v = e => null !== e && "object" == typeof e,
    y = e => (v(e) || f(e)) && f(e.then) && f(e.catch),
    b = Object.prototype.toString,
    w = e => b.call(e),
    _ = e => "[object Object]" === w(e),
    x = e => g(e) && "NaN" !== e && "-" !== e[0] && "" + parseInt(e, 10) === e,
    k = e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),
    E = e => {
        const t = Object.create(null);
        return n => t[n] || (t[n] = e(n))
    },
    C = /-(\w)/g,
    S = E((e => e.replace(C, ((e, t) => t ? t.toUpperCase() : "")))),
    O = /\B([A-Z])/g,
    L = E((e => e.replace(O, "-$1").toLowerCase())),
    A = E((e => e.charAt(0).toUpperCase() + e.slice(1))),
    D = E((e => e ? `on${A(e)}` : "")),
    T = (e, t) => !Object.is(e, t),
    I = (e, ...t) => {
        for (let n = 0; n < e.length; n++) e[n](...t)
    },
    M = (e, t, n, i = !1) => {
        Object.defineProperty(e, t, {
            configurable: !0,
            enumerable: !1,
            writable: i,
            value: n
        })
    },
    j = e => {
        const t = parseFloat(e);
        return isNaN(t) ? e : t
    };
let P;
const R = () => P || (P = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {});

function F(e) {
    if (u(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) {
            const i = e[n],
                r = g(i) ? z(i) : F(i);
            if (r)
                for (const e in r) t[e] = r[e]
        }
        return t
    }
    if (g(e) || v(e)) return e
}
const B = /;(?![^(]*\))/g,
    H = /:([^]+)/,
    N = /\/\*[^]*?\*\//g;

function z(e) {
    const t = {};
    return e.replace(N, "").split(B).forEach((e => {
        if (e) {
            const n = e.split(H);
            n.length > 1 && (t[n[0].trim()] = n[1].trim())
        }
    })), t
}

function V(e) {
    let t = "";
    if (g(e)) t = e;
    else if (u(e))
        for (let n = 0; n < e.length; n++) {
            const i = V(e[n]);
            i && (t += i + " ")
        } else if (v(e))
            for (const n in e) e[n] && (t += n + " ");
    return t.trim()
}
const U = e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");

function q(e) {
    return !!e || "" === e
}
const W = e => !(!e || !0 !== e.__v_isRef),
    K = e => g(e) ? e : null == e ? "" : u(e) || v(e) && (e.toString === b || !f(e.toString)) ? W(e) ? K(e.value) : JSON.stringify(e, $, 2) : String(e),
    $ = (e, t) => W(t) ? $(e, t.value) : h(t) ? {
        [`Map(${t.size})`]: [...t.entries()].reduce(((e, [t, n], i) => (e[Y(t, i) + " =>"] = n, e)), {})
    } : p(t) ? {
        [`Set(${t.size})`]: [...t.values()].map((e => Y(e)))
    } : m(t) ? Y(t) : !v(t) || u(t) || _(t) ? t : String(t),
    Y = (e, t = "") => {
        var n;
        return m(e) ? `Symbol(${null!=(n=e.description)?n:t})` : e
    };
let J, G;
class EffectScope {
    constructor(e = !1) {
        this.detached = e, this._active = !0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = J, !e && J && (this.index = (J.scopes || (J.scopes = [])).push(this) - 1)
    }
    get active() {
        return this._active
    }
    pause() {
        if (this._active) {
            let e, t;
            if (this._isPaused = !0, this.scopes)
                for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].pause();
            for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause()
        }
    }
    resume() {
        if (this._active && this._isPaused) {
            let e, t;
            if (this._isPaused = !1, this.scopes)
                for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].resume();
            for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].resume()
        }
    }
    run(e) {
        if (this._active) {
            const t = J;
            try {
                return J = this, e()
            } finally {
                J = t
            }
        }
    }
    on() {
        J = this
    }
    off() {
        J = this.parent
    }
    stop(e) {
        if (this._active) {
            let t, n;
            for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
            for (t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
            if (this.scopes)
                for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].stop(!0);
            if (!this.detached && this.parent && !e) {
                const e = this.parent.scopes.pop();
                e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index)
            }
            this.parent = void 0, this._active = !1
        }
    }
}
const Z = new WeakSet;
class ReactiveEffect {
    constructor(e) {
        this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, J && J.active && J.effects.push(this)
    }
    pause() {
        this.flags |= 64
    }
    resume() {
        64 & this.flags && (this.flags &= -65, Z.has(this) && (Z.delete(this), this.trigger()))
    }
    notify() {
        2 & this.flags && !(32 & this.flags) || 8 & this.flags || ee(this)
    }
    run() {
        if (!(1 & this.flags)) return this.fn();
        this.flags |= 2, pe(this), ie(this);
        const e = G,
            t = ce;
        G = this, ce = !0;
        try {
            return this.fn()
        } finally {
            re(this), G = e, ce = t, this.flags &= -3
        }
    }
    stop() {
        if (1 & this.flags) {
            for (let e = this.deps; e; e = e.nextDep) ae(e);
            this.deps = this.depsTail = void 0, pe(this), this.onStop && this.onStop(), this.flags &= -2
        }
    }
    trigger() {
        64 & this.flags ? Z.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty()
    }
    runIfDirty() {
        oe(this) && this.run()
    }
    get dirty() {
        return oe(this)
    }
}
let X, Q = 0;

function ee(e) {
    e.flags |= 8, e.next = X, X = e
}

function te() {
    Q++
}

function ne() {
    if (--Q > 0) return;
    let e;
    for (; X;) {
        let n = X;
        for (X = void 0; n;) {
            const i = n.next;
            if (n.next = void 0, n.flags &= -9, 1 & n.flags) try {
                n.trigger()
            } catch (t) {
                e || (e = t)
            }
            n = i
        }
    }
    if (e) throw e
}

function ie(e) {
    for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t
}

function re(e) {
    let t, n = e.depsTail,
        i = n;
    for (; i;) {
        const e = i.prevDep; - 1 === i.version ? (i === n && (n = e), ae(i), le(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = e
    }
    e.deps = t, e.depsTail = n
}

function oe(e) {
    for (let t = e.deps; t; t = t.nextDep)
        if (t.dep.version !== t.version || t.dep.computed && (se(t.dep.computed) || t.dep.version !== t.version)) return !0;
    return !!e._dirty
}

function se(e) {
    if (4 & e.flags && !(16 & e.flags)) return;
    if (e.flags &= -17, e.globalVersion === fe) return;
    e.globalVersion = fe;
    const t = e.dep;
    if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !oe(e)) return void(e.flags &= -3);
    const n = G,
        i = ce;
    G = e, ce = !0;
    try {
        ie(e);
        const n = e.fn(e._value);
        (0 === t.version || T(n, e._value)) && (e._value = n, t.version++)
    } catch (r) {
        throw t.version++, r
    } finally {
        G = n, ce = i, re(e), e.flags &= -3
    }
}

function ae(e) {
    const {
        dep: t,
        prevSub: n,
        nextSub: i
    } = e;
    if (n && (n.nextSub = i, e.prevSub = void 0), i && (i.prevSub = n, e.nextSub = void 0), t.subs === e && (t.subs = n), !t.subs && t.computed) {
        t.computed.flags &= -5;
        for (let e = t.computed.deps; e; e = e.nextDep) ae(e)
    }
}

function le(e) {
    const {
        prevDep: t,
        nextDep: n
    } = e;
    t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0)
}
let ce = !0;
const de = [];

function ue() {
    de.push(ce), ce = !1
}

function he() {
    const e = de.pop();
    ce = void 0 === e || e
}

function pe(e) {
    const {
        cleanup: t
    } = e;
    if (e.cleanup = void 0, t) {
        const e = G;
        G = void 0;
        try {
            t()
        } finally {
            G = e
        }
    }
}
let fe = 0;
class Link {
    constructor(e, t) {
        this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0
    }
}
class Dep {
    constructor(e) {
        this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0
    }
    track(e) {
        if (!G || !ce || G === this.computed) return;
        let t = this.activeLink;
        if (void 0 === t || t.sub !== G) t = this.activeLink = new Link(G, this), G.deps ? (t.prevDep = G.depsTail, G.depsTail.nextDep = t, G.depsTail = t) : G.deps = G.depsTail = t, 4 & G.flags && ge(t);
        else if (-1 === t.version && (t.version = this.version, t.nextDep)) {
            const e = t.nextDep;
            e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = G.depsTail, t.nextDep = void 0, G.depsTail.nextDep = t, G.depsTail = t, G.deps === t && (G.deps = e)
        }
        return t
    }
    trigger(e) {
        this.version++, fe++, this.notify(e)
    }
    notify(e) {
        te();
        try {
            0;
            for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify()
        } finally {
            ne()
        }
    }
}

function ge(e) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
        t.flags |= 20;
        for (let e = t.deps; e; e = e.nextDep) ge(e)
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e
}
const me = new WeakMap,
    ve = Symbol(""),
    ye = Symbol(""),
    be = Symbol("");

function we(e, t, n) {
    if (ce && G) {
        let t = me.get(e);
        t || me.set(e, t = new Map);
        let i = t.get(n);
        i || t.set(n, i = new Dep), i.track()
    }
}

function _e(e, t, n, i, r, o) {
    const s = me.get(e);
    if (!s) return void fe++;
    const a = e => {
        e && e.trigger()
    };
    if (te(), "clear" === t) s.forEach(a);
    else {
        const r = u(e),
            o = r && x(n);
        if (r && "length" === n) {
            const e = Number(i);
            s.forEach(((t, n) => {
                ("length" === n || n === be || !m(n) && n >= e) && a(t)
            }))
        } else switch (void 0 !== n && a(s.get(n)), o && a(s.get(be)), t) {
            case "add":
                r ? o && a(s.get("length")) : (a(s.get(ve)), h(e) && a(s.get(ye)));
                break;
            case "delete":
                r || (a(s.get(ve)), h(e) && a(s.get(ye)));
                break;
            case "set":
                h(e) && a(s.get(ve))
        }
    }
    ne()
}

function xe(e) {
    const t = mt(e);
    return t === e ? t : (we(t, 0, be), ft(e) ? t : t.map(vt))
}

function ke(e) {
    return we(e = mt(e), 0, be), e
}
const Ee = {
    __proto__: null,
    [Symbol.iterator]() {
        return Ce(this, Symbol.iterator, vt)
    },
    concat(...e) {
        return xe(this).concat(...e.map((e => u(e) ? xe(e) : e)))
    },
    entries() {
        return Ce(this, "entries", (e => (e[1] = vt(e[1]), e)))
    },
    every(e, t) {
        return Oe(this, "every", e, t, void 0, arguments)
    },
    filter(e, t) {
        return Oe(this, "filter", e, t, (e => e.map(vt)), arguments)
    },
    find(e, t) {
        return Oe(this, "find", e, t, vt, arguments)
    },
    findIndex(e, t) {
        return Oe(this, "findIndex", e, t, void 0, arguments)
    },
    findLast(e, t) {
        return Oe(this, "findLast", e, t, vt, arguments)
    },
    findLastIndex(e, t) {
        return Oe(this, "findLastIndex", e, t, void 0, arguments)
    },
    forEach(e, t) {
        return Oe(this, "forEach", e, t, void 0, arguments)
    },
    includes(...e) {
        return Ae(this, "includes", e)
    },
    indexOf(...e) {
        return Ae(this, "indexOf", e)
    },
    join(e) {
        return xe(this).join(e)
    },
    lastIndexOf(...e) {
        return Ae(this, "lastIndexOf", e)
    },
    map(e, t) {
        return Oe(this, "map", e, t, void 0, arguments)
    },
    pop() {
        return De(this, "pop")
    },
    push(...e) {
        return De(this, "push", e)
    },
    reduce(e, ...t) {
        return Le(this, "reduce", e, t)
    },
    reduceRight(e, ...t) {
        return Le(this, "reduceRight", e, t)
    },
    shift() {
        return De(this, "shift")
    },
    some(e, t) {
        return Oe(this, "some", e, t, void 0, arguments)
    },
    splice(...e) {
        return De(this, "splice", e)
    },
    toReversed() {
        return xe(this).toReversed()
    },
    toSorted(e) {
        return xe(this).toSorted(e)
    },
    toSpliced(...e) {
        return xe(this).toSpliced(...e)
    },
    unshift(...e) {
        return De(this, "unshift", e)
    },
    values() {
        return Ce(this, "values", vt)
    }
};

function Ce(e, t, n) {
    const i = ke(e),
        r = i[t]();
    return i === e || ft(e) || (r._next = r.next, r.next = () => {
        const e = r._next();
        return e.value && (e.value = n(e.value)), e
    }), r
}
const Se = Array.prototype;

function Oe(e, t, n, i, r, o) {
    const s = ke(e),
        a = s !== e && !ft(e),
        l = s[t];
    if (l !== Se[t]) {
        const t = l.apply(e, o);
        return a ? vt(t) : t
    }
    let c = n;
    s !== e && (a ? c = function(t, i) {
        return n.call(this, vt(t), i, e)
    } : n.length > 2 && (c = function(t, i) {
        return n.call(this, t, i, e)
    }));
    const d = l.call(s, c, i);
    return a && r ? r(d) : d
}

function Le(e, t, n, i) {
    const r = ke(e);
    let o = n;
    return r !== e && (ft(e) ? n.length > 3 && (o = function(t, i, r) {
        return n.call(this, t, i, r, e)
    }) : o = function(t, i, r) {
        return n.call(this, t, vt(i), r, e)
    }), r[t](o, ...i)
}

function Ae(e, t, n) {
    const i = mt(e);
    we(i, 0, be);
    const r = i[t](...n);
    return -1 !== r && !1 !== r || !gt(n[0]) ? r : (n[0] = mt(n[0]), i[t](...n))
}

function De(e, t, n = []) {
    ue(), te();
    const i = mt(e)[t].apply(e, n);
    return ne(), he(), i
}
const Te = e("__proto__,__v_isRef,__isVue"),
    Ie = new Set(Object.getOwnPropertyNames(Symbol).filter((e => "arguments" !== e && "caller" !== e)).map((e => Symbol[e])).filter(m));

function Me(e) {
    m(e) || (e = String(e));
    const t = mt(this);
    return we(t, 0, e), t.hasOwnProperty(e)
}
class BaseReactiveHandler {
    constructor(e = !1, t = !1) {
        this._isReadonly = e, this._isShallow = t
    }
    get(e, t, n) {
        const i = this._isReadonly,
            r = this._isShallow;
        if ("__v_isReactive" === t) return !i;
        if ("__v_isReadonly" === t) return i;
        if ("__v_isShallow" === t) return r;
        if ("__v_raw" === t) return n === (i ? r ? at : st : r ? ot : rt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
        const o = u(e);
        if (!i) {
            let e;
            if (o && (e = Ee[t])) return e;
            if ("hasOwnProperty" === t) return Me
        }
        const s = Reflect.get(e, t, bt(e) ? e : n);
        return (m(t) ? Ie.has(t) : Te(t)) ? s : (i || we(e, 0, t), r ? s : bt(s) ? o && x(t) ? s : s.value : v(s) ? i ? dt(s) : ct(s) : s)
    }
}
class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(e = !1) {
        super(!1, e)
    }
    set(e, t, n, i) {
        let r = e[t];
        if (!this._isShallow) {
            const t = pt(r);
            if (ft(n) || pt(n) || (r = mt(r), n = mt(n)), !u(e) && bt(r) && !bt(n)) return !t && (r.value = n, !0)
        }
        const o = u(e) && x(t) ? Number(t) < e.length : d(e, t),
            s = Reflect.set(e, t, n, bt(e) ? e : i);
        return e === mt(i) && (o ? T(n, r) && _e(e, "set", t, n) : _e(e, "add", t, n)), s
    }
    deleteProperty(e, t) {
        const n = d(e, t);
        e[t];
        const i = Reflect.deleteProperty(e, t);
        return i && n && _e(e, "delete", t, void 0), i
    }
    has(e, t) {
        const n = Reflect.has(e, t);
        return m(t) && Ie.has(t) || we(e, 0, t), n
    }
    ownKeys(e) {
        return we(e, 0, u(e) ? "length" : ve), Reflect.ownKeys(e)
    }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(e = !1) {
        super(!0, e)
    }
    set(e, t) {
        return !0
    }
    deleteProperty(e, t) {
        return !0
    }
}
const je = new MutableReactiveHandler,
    Pe = new ReadonlyReactiveHandler,
    Re = new MutableReactiveHandler(!0),
    Fe = e => e,
    Be = e => Reflect.getPrototypeOf(e);

function He(e, t, n = !1, i = !1) {
    const r = mt(e = e.__v_raw),
        o = mt(t);
    n || (T(t, o) && we(r, 0, t), we(r, 0, o));
    const {
        has: s
    } = Be(r), a = i ? Fe : n ? yt : vt;
    return s.call(r, t) ? a(e.get(t)) : s.call(r, o) ? a(e.get(o)) : void(e !== r && e.get(t))
}

function Ne(e, t = !1) {
    const n = this.__v_raw,
        i = mt(n),
        r = mt(e);
    return t || (T(e, r) && we(i, 0, e), we(i, 0, r)), e === r ? n.has(e) : n.has(e) || n.has(r)
}

function ze(e, t = !1) {
    return e = e.__v_raw, !t && we(mt(e), 0, ve), Reflect.get(e, "size", e)
}

function Ve(e, t = !1) {
    t || ft(e) || pt(e) || (e = mt(e));
    const n = mt(this);
    return Be(n).has.call(n, e) || (n.add(e), _e(n, "add", e, e)), this
}

function Ue(e, t, n = !1) {
    n || ft(t) || pt(t) || (t = mt(t));
    const i = mt(this),
        {
            has: r,
            get: o
        } = Be(i);
    let s = r.call(i, e);
    s || (e = mt(e), s = r.call(i, e));
    const a = o.call(i, e);
    return i.set(e, t), s ? T(t, a) && _e(i, "set", e, t) : _e(i, "add", e, t), this
}

function qe(e) {
    const t = mt(this),
        {
            has: n,
            get: i
        } = Be(t);
    let r = n.call(t, e);
    r || (e = mt(e), r = n.call(t, e)), i && i.call(t, e);
    const o = t.delete(e);
    return r && _e(t, "delete", e, void 0), o
}

function We() {
    const e = mt(this),
        t = 0 !== e.size,
        n = e.clear();
    return t && _e(e, "clear", void 0, void 0), n
}

function Ke(e, t) {
    return function(n, i) {
        const r = this,
            o = r.__v_raw,
            s = mt(o),
            a = t ? Fe : e ? yt : vt;
        return !e && we(s, 0, ve), o.forEach(((e, t) => n.call(i, a(e), a(t), r)))
    }
}

function $e(e, t, n) {
    return function(...i) {
        const r = this.__v_raw,
            o = mt(r),
            s = h(o),
            a = "entries" === e || e === Symbol.iterator && s,
            l = "keys" === e && s,
            c = r[e](...i),
            d = n ? Fe : t ? yt : vt;
        return !t && we(o, 0, l ? ye : ve), {
            next() {
                const {
                    value: e,
                    done: t
                } = c.next();
                return t ? {
                    value: e,
                    done: t
                } : {
                    value: a ? [d(e[0]), d(e[1])] : d(e),
                    done: t
                }
            },
            [Symbol.iterator]() {
                return this
            }
        }
    }
}

function Ye(e) {
    return function(...t) {
        return "delete" !== e && ("clear" === e ? void 0 : this)
    }
}

function Je() {
    const e = {
            get(e) {
                return He(this, e)
            },
            get size() {
                return ze(this)
            },
            has: Ne,
            add: Ve,
            set: Ue,
            delete: qe,
            clear: We,
            forEach: Ke(!1, !1)
        },
        t = {
            get(e) {
                return He(this, e, !1, !0)
            },
            get size() {
                return ze(this)
            },
            has: Ne,
            add(e) {
                return Ve.call(this, e, !0)
            },
            set(e, t) {
                return Ue.call(this, e, t, !0)
            },
            delete: qe,
            clear: We,
            forEach: Ke(!1, !0)
        },
        n = {
            get(e) {
                return He(this, e, !0)
            },
            get size() {
                return ze(this, !0)
            },
            has(e) {
                return Ne.call(this, e, !0)
            },
            add: Ye("add"),
            set: Ye("set"),
            delete: Ye("delete"),
            clear: Ye("clear"),
            forEach: Ke(!0, !1)
        },
        i = {
            get(e) {
                return He(this, e, !0, !0)
            },
            get size() {
                return ze(this, !0)
            },
            has(e) {
                return Ne.call(this, e, !0)
            },
            add: Ye("add"),
            set: Ye("set"),
            delete: Ye("delete"),
            clear: Ye("clear"),
            forEach: Ke(!0, !0)
        };
    return ["keys", "values", "entries", Symbol.iterator].forEach((r => {
        e[r] = $e(r, !1, !1), n[r] = $e(r, !0, !1), t[r] = $e(r, !1, !0), i[r] = $e(r, !0, !0)
    })), [e, n, t, i]
}
const [Ge, Ze, Xe, Qe] = Je();

function et(e, t) {
    const n = t ? e ? Qe : Xe : e ? Ze : Ge;
    return (t, i, r) => "__v_isReactive" === i ? !e : "__v_isReadonly" === i ? e : "__v_raw" === i ? t : Reflect.get(d(n, i) && i in t ? n : t, i, r)
}
const tt = {
        get: et(!1, !1)
    },
    nt = {
        get: et(!1, !0)
    },
    it = {
        get: et(!0, !1)
    },
    rt = new WeakMap,
    ot = new WeakMap,
    st = new WeakMap,
    at = new WeakMap;

function lt(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : function(e) {
        switch (e) {
            case "Object":
            case "Array":
                return 1;
            case "Map":
            case "Set":
            case "WeakMap":
            case "WeakSet":
                return 2;
            default:
                return 0
        }
    }((e => w(e).slice(8, -1))(e))
}

function ct(e) {
    return pt(e) ? e : ut(e, !1, je, tt, rt)
}

function dt(e) {
    return ut(e, !0, Pe, it, st)
}

function ut(e, t, n, i, r) {
    if (!v(e)) return e;
    if (e.__v_raw && (!t || !e.__v_isReactive)) return e;
    const o = r.get(e);
    if (o) return o;
    const s = lt(e);
    if (0 === s) return e;
    const a = new Proxy(e, 2 === s ? i : n);
    return r.set(e, a), a
}

function ht(e) {
    return pt(e) ? ht(e.__v_raw) : !(!e || !e.__v_isReactive)
}

function pt(e) {
    return !(!e || !e.__v_isReadonly)
}

function ft(e) {
    return !(!e || !e.__v_isShallow)
}

function gt(e) {
    return !!e && !!e.__v_raw
}

function mt(e) {
    const t = e && e.__v_raw;
    return t ? mt(t) : e
}
const vt = e => v(e) ? ct(e) : e,
    yt = e => v(e) ? dt(e) : e;

function bt(e) {
    return !!e && !0 === e.__v_isRef
}

function wt(e) {
    return function(e, t) {
        if (bt(e)) return e;
        return new RefImpl(e, t)
    }(e, !1)
}
class RefImpl {
    constructor(e, t) {
        this.dep = new Dep, this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : mt(e), this._value = t ? e : vt(e), this.__v_isShallow = t
    }
    get value() {
        return this.dep.track(), this._value
    }
    set value(e) {
        const t = this._rawValue,
            n = this.__v_isShallow || ft(e) || pt(e);
        e = n ? e : mt(e), T(e, t) && (this._rawValue = e, this._value = n ? e : vt(e), this.dep.trigger())
    }
}
const _t = {
    get: (e, t, n) => {
        return "__v_raw" === t ? e : bt(i = Reflect.get(e, t, n)) ? i.value : i;
        var i
    },
    set: (e, t, n, i) => {
        const r = e[t];
        return bt(r) && !bt(n) ? (r.value = n, !0) : Reflect.set(e, t, n, i)
    }
};

function xt(e) {
    return ht(e) ? e : new Proxy(e, _t)
}
class ComputedRefImpl {
    constructor(e, t, n) {
        this.fn = e, this.setter = t, this._value = void 0, this.dep = new Dep(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = fe - 1, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n
    }
    notify() {
        if (this.flags |= 16, !(8 & this.flags) && G !== this) return ee(this), !0
    }
    get value() {
        const e = this.dep.track();
        return se(this), e && (e.version = this.dep.version), this._value
    }
    set value(e) {
        this.setter && this.setter(e)
    }
}
const kt = {},
    Et = new WeakMap;
let Ct;

function St(e, n, r = t) {
    const {
        immediate: o,
        deep: s,
        once: a,
        scheduler: c,
        augmentJob: d,
        call: h
    } = r, p = e => s ? e : ft(e) || !1 === s || 0 === s ? Ot(e, 1) : Ot(e);
    let g, m, v, y, b = !1,
        w = !1;
    if (bt(e) ? (m = () => e.value, b = ft(e)) : ht(e) ? (m = () => p(e), b = !0) : u(e) ? (w = !0, b = e.some((e => ht(e) || ft(e))), m = () => e.map((e => bt(e) ? e.value : ht(e) ? p(e) : f(e) ? h ? h(e, 2) : e() : void 0))) : m = f(e) ? n ? h ? () => h(e, 2) : e : () => {
            if (v) {
                ue();
                try {
                    v()
                } finally {
                    he()
                }
            }
            const t = Ct;
            Ct = g;
            try {
                return h ? h(e, 3, [y]) : e(y)
            } finally {
                Ct = t
            }
        } : i, n && s) {
        const e = m,
            t = !0 === s ? 1 / 0 : s;
        m = () => Ot(e(), t)
    }
    const _ = J,
        x = () => {
            g.stop(), _ && l(_.effects, g)
        };
    if (a && n) {
        const e = n;
        n = (...t) => {
            e(...t), x()
        }
    }
    let k = w ? new Array(e.length).fill(kt) : kt;
    const E = e => {
        if (1 & g.flags && (g.dirty || e))
            if (n) {
                const e = g.run();
                if (s || b || (w ? e.some(((e, t) => T(e, k[t]))) : T(e, k))) {
                    v && v();
                    const t = Ct;
                    Ct = g;
                    try {
                        const t = [e, k === kt ? void 0 : w && k[0] === kt ? [] : k, y];
                        h ? h(n, 3, t) : n(...t), k = e
                    } finally {
                        Ct = t
                    }
                }
            } else g.run()
    };
    return d && d(E), g = new ReactiveEffect(m), g.scheduler = c ? () => c(E, !1) : E, y = e => function(e, t = !1, n = Ct) {
        if (n) {
            let t = Et.get(n);
            t || Et.set(n, t = []), t.push(e)
        }
    }(e, !1, g), v = g.onStop = () => {
        const e = Et.get(g);
        if (e) {
            if (h) h(e, 4);
            else
                for (const t of e) t();
            Et.delete(g)
        }
    }, n ? o ? E(!0) : k = g.run() : c ? c(E.bind(null, !0), !0) : g.run(), x.pause = g.pause.bind(g), x.resume = g.resume.bind(g), x.stop = x, x
}

function Ot(e, t = 1 / 0, n) {
    if (t <= 0 || !v(e) || e.__v_skip) return e;
    if ((n = n || new Set).has(e)) return e;
    if (n.add(e), t--, bt(e)) Ot(e.value, t, n);
    else if (u(e))
        for (let i = 0; i < e.length; i++) Ot(e[i], t, n);
    else if (p(e) || h(e)) e.forEach((e => {
        Ot(e, t, n)
    }));
    else if (_(e)) {
        for (const i in e) Ot(e[i], t, n);
        for (const i of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, i) && Ot(e[i], t, n)
    }
    return e
}

function Lt(e, t, n, i) {
    try {
        return i ? e(...i) : e()
    } catch (r) {
        Dt(r, t, n)
    }
}

function At(e, t, n, i) {
    if (f(e)) {
        const r = Lt(e, t, n, i);
        return r && y(r) && r.catch((e => {
            Dt(e, t, n)
        })), r
    }
    if (u(e)) {
        const r = [];
        for (let o = 0; o < e.length; o++) r.push(At(e[o], t, n, i));
        return r
    }
}

function Dt(e, n, i, r = !0) {
    n && n.vnode;
    const {
        errorHandler: o,
        throwUnhandledErrorInProduction: s
    } = n && n.appContext.config || t;
    if (n) {
        let t = n.parent;
        const r = n.proxy,
            s = `https://vuejs.org/error-reference/#runtime-${i}`;
        for (; t;) {
            const n = t.ec;
            if (n)
                for (let t = 0; t < n.length; t++)
                    if (!1 === n[t](e, r, s)) return;
            t = t.parent
        }
        if (o) return ue(), Lt(o, null, 10, [e, r, s]), void he()
    }! function(e, t, n, i = !0, r = !1) {
        if (r) throw e;
        console.error(e)
    }(e, 0, 0, r, s)
}
let Tt = !1,
    It = !1;
const Mt = [];
let jt = 0;
const Pt = [];
let Rt = null,
    Ft = 0;
const Bt = Promise.resolve();
let Ht = null;

function Nt(e) {
    const t = Ht || Bt;
    return e ? t.then(this ? e.bind(this) : e) : t
}

function zt(e) {
    if (!(1 & e.flags)) {
        const t = Wt(e),
            n = Mt[Mt.length - 1];
        !n || !(2 & e.flags) && t >= Wt(n) ? Mt.push(e) : Mt.splice(function(e) {
            let t = Tt ? jt + 1 : 0,
                n = Mt.length;
            for (; t < n;) {
                const i = t + n >>> 1,
                    r = Mt[i],
                    o = Wt(r);
                o < e || o === e && 2 & r.flags ? t = i + 1 : n = i
            }
            return t
        }(t), 0, e), e.flags |= 1, Vt()
    }
}

function Vt() {
    Tt || It || (It = !0, Ht = Bt.then(Kt))
}

function Ut(e, t, n = (Tt ? jt + 1 : 0)) {
    for (; n < Mt.length; n++) {
        const t = Mt[n];
        if (t && 2 & t.flags) {
            if (e && t.id !== e.uid) continue;
            Mt.splice(n, 1), n--, 4 & t.flags && (t.flags &= -2), t(), t.flags &= -2
        }
    }
}

function qt(e) {
    if (Pt.length) {
        const e = [...new Set(Pt)].sort(((e, t) => Wt(e) - Wt(t)));
        if (Pt.length = 0, Rt) return void Rt.push(...e);
        for (Rt = e, Ft = 0; Ft < Rt.length; Ft++) {
            const e = Rt[Ft];
            4 & e.flags && (e.flags &= -2), 8 & e.flags || e(), e.flags &= -2
        }
        Rt = null, Ft = 0
    }
}
const Wt = e => null == e.id ? 2 & e.flags ? -1 : 1 / 0 : e.id;

function Kt(e) {
    It = !1, Tt = !0;
    try {
        for (jt = 0; jt < Mt.length; jt++) {
            const e = Mt[jt];
            !e || 8 & e.flags || (4 & e.flags && (e.flags &= -2), Lt(e, e.i, e.i ? 15 : 14), e.flags &= -2)
        }
    } finally {
        for (; jt < Mt.length; jt++) {
            const e = Mt[jt];
            e && (e.flags &= -2)
        }
        jt = 0, Mt.length = 0, qt(), Tt = !1, Ht = null, (Mt.length || Pt.length) && Kt()
    }
}
let $t = null,
    Yt = null;

function Jt(e) {
    const t = $t;
    return $t = e, Yt = e && e.type.__scopeId || null, t
}

function Gt(e, t = $t, n) {
    if (!t) return e;
    if (e._n) return e;
    const i = (...n) => {
        i._d && Xi(-1);
        const r = Jt(t);
        let o;
        try {
            o = e(...n)
        } finally {
            Jt(r), i._d && Xi(1)
        }
        return o
    };
    return i._n = !0, i._c = !0, i._d = !0, i
}

function Zt(e, n) {
    if (null === $t) return e;
    const i = Dr($t),
        r = e.dirs || (e.dirs = []);
    for (let o = 0; o < n.length; o++) {
        let [e, s, a, l = t] = n[o];
        e && (f(e) && (e = {
            mounted: e,
            updated: e
        }), e.deep && Ot(s), r.push({
            dir: e,
            instance: i,
            value: s,
            oldValue: void 0,
            arg: a,
            modifiers: l
        }))
    }
    return e
}

function Xt(e, t, n, i) {
    const r = e.dirs,
        o = t && t.dirs;
    for (let s = 0; s < r.length; s++) {
        const a = r[s];
        o && (a.oldValue = o[s].value);
        let l = a.dir[i];
        l && (ue(), At(l, n, 8, [e.el, a, e, t]), he())
    }
}
const Qt = Symbol("_vte"),
    en = e => e.__isTeleport,
    tn = Symbol("_leaveCb"),
    nn = Symbol("_enterCb");
const rn = [Function, Array],
    on = {
        mode: String,
        appear: Boolean,
        persisted: Boolean,
        onBeforeEnter: rn,
        onEnter: rn,
        onAfterEnter: rn,
        onEnterCancelled: rn,
        onBeforeLeave: rn,
        onLeave: rn,
        onAfterLeave: rn,
        onLeaveCancelled: rn,
        onBeforeAppear: rn,
        onAppear: rn,
        onAfterAppear: rn,
        onAppearCancelled: rn
    },
    sn = e => {
        const t = e.subTree;
        return t.component ? sn(t.component) : t
    };

function an(e) {
    let t = e[0];
    if (e.length > 1)
        for (const n of e)
            if (n.type !== Ki) {
                t = n;
                break
            } return t
}
const ln = {
    name: "BaseTransition",
    props: on,
    setup(e, {
        slots: t
    }) {
        const n = br(),
            i = function() {
                const e = {
                    isMounted: !1,
                    isLeaving: !1,
                    isUnmounting: !1,
                    leavingVNodes: new Map
                };
                return Sn((() => {
                    e.isMounted = !0
                })), An((() => {
                    e.isUnmounting = !0
                })), e
            }();
        return () => {
            const r = t.default && fn(t.default(), !0);
            if (!r || !r.length) return;
            const o = an(r),
                s = mt(e),
                {
                    mode: a
                } = s;
            if (i.isLeaving) return un(o);
            const l = hn(o);
            if (!l) return un(o);
            let c = dn(l, s, i, n, (e => c = e));
            l.type !== Ki && pn(l, c);
            const d = n.subTree,
                u = d && hn(d);
            if (u && u.type !== Ki && !ir(l, u) && sn(n).type !== Ki) {
                const e = dn(u, s, i, n);
                if (pn(u, e), "out-in" === a && l.type !== Ki) return i.isLeaving = !0, e.afterLeave = () => {
                    i.isLeaving = !1, 8 & n.job.flags || n.update(), delete e.afterLeave
                }, un(o);
                "in-out" === a && l.type !== Ki && (e.delayLeave = (e, t, n) => {
                    cn(i, u)[String(u.key)] = u, e[tn] = () => {
                        t(), e[tn] = void 0, delete c.delayedLeave
                    }, c.delayedLeave = n
                })
            }
            return o
        }
    }
};

function cn(e, t) {
    const {
        leavingVNodes: n
    } = e;
    let i = n.get(t.type);
    return i || (i = Object.create(null), n.set(t.type, i)), i
}

function dn(e, t, n, i, r) {
    const {
        appear: o,
        mode: s,
        persisted: a = !1,
        onBeforeEnter: l,
        onEnter: c,
        onAfterEnter: d,
        onEnterCancelled: h,
        onBeforeLeave: p,
        onLeave: f,
        onAfterLeave: g,
        onLeaveCancelled: m,
        onBeforeAppear: v,
        onAppear: y,
        onAfterAppear: b,
        onAppearCancelled: w
    } = t, _ = String(e.key), x = cn(n, e), k = (e, t) => {
        e && At(e, i, 9, t)
    }, E = (e, t) => {
        const n = t[1];
        k(e, t), u(e) ? e.every((e => e.length <= 1)) && n() : e.length <= 1 && n()
    }, C = {
        mode: s,
        persisted: a,
        beforeEnter(t) {
            let i = l;
            if (!n.isMounted) {
                if (!o) return;
                i = v || l
            }
            t[tn] && t[tn](!0);
            const r = x[_];
            r && ir(e, r) && r.el[tn] && r.el[tn](), k(i, [t])
        },
        enter(e) {
            let t = c,
                i = d,
                r = h;
            if (!n.isMounted) {
                if (!o) return;
                t = y || c, i = b || d, r = w || h
            }
            let s = !1;
            const a = e[nn] = t => {
                s || (s = !0, k(t ? r : i, [e]), C.delayedLeave && C.delayedLeave(), e[nn] = void 0)
            };
            t ? E(t, [e, a]) : a()
        },
        leave(t, i) {
            const r = String(e.key);
            if (t[nn] && t[nn](!0), n.isUnmounting) return i();
            k(p, [t]);
            let o = !1;
            const s = t[tn] = n => {
                o || (o = !0, i(), k(n ? m : g, [t]), t[tn] = void 0, x[r] === e && delete x[r])
            };
            x[r] = e, f ? E(f, [t, s]) : s()
        },
        clone(e) {
            const o = dn(e, t, n, i, r);
            return r && r(o), o
        }
    };
    return C
}

function un(e) {
    if (yn(e)) return (e = lr(e)).children = null, e
}

function hn(e) {
    if (!yn(e)) return en(e.type) && e.children ? an(e.children) : e;
    const {
        shapeFlag: t,
        children: n
    } = e;
    if (n) {
        if (16 & t) return n[0];
        if (32 & t && f(n.default)) return n.default()
    }
}

function pn(e, t) {
    6 & e.shapeFlag && e.component ? (e.transition = t, pn(e.component.subTree, t)) : 128 & e.shapeFlag ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t
}

function fn(e, t = !1, n) {
    let i = [],
        r = 0;
    for (let o = 0; o < e.length; o++) {
        let s = e[o];
        const a = null == n ? s.key : String(n) + String(null != s.key ? s.key : o);
        s.type === qi ? (128 & s.patchFlag && r++, i = i.concat(fn(s.children, t, a))) : (t || s.type !== Ki) && i.push(null != a ? lr(s, {
            key: a
        }) : s)
    }
    if (r > 1)
        for (let o = 0; o < i.length; o++) i[o].patchFlag = -2;
    return i
}

function gn(e) {
    e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0]
}

function mn(e, n, i, r, o = !1) {
    if (u(e)) return void e.forEach(((e, t) => mn(e, n && (u(n) ? n[t] : n), i, r, o)));
    if (vn(r) && !o) return;
    const s = 4 & r.shapeFlag ? Dr(r.component) : r.el,
        a = o ? null : s,
        {
            i: c,
            r: h
        } = e,
        p = n && n.r,
        m = c.refs === t ? c.refs = {} : c.refs,
        v = c.setupState,
        y = mt(v),
        b = v === t ? () => !1 : e => d(y, e);
    if (null != p && p !== h && (g(p) ? (m[p] = null, b(p) && (v[p] = null)) : bt(p) && (p.value = null)), f(h)) Lt(h, c, 12, [a, m]);
    else {
        const t = g(h),
            n = bt(h);
        if (t || n) {
            const r = () => {
                if (e.f) {
                    const n = t ? b(h) ? v[h] : m[h] : h.value;
                    o ? u(n) && l(n, s) : u(n) ? n.includes(s) || n.push(s) : t ? (m[h] = [s], b(h) && (v[h] = m[h])) : (h.value = [s], e.k && (m[e.k] = h.value))
                } else t ? (m[h] = a, b(h) && (v[h] = a)) : n && (h.value = a, e.k && (m[e.k] = a))
            };
            a ? (r.id = -1, xi(r, i)) : r()
        }
    }
}
const vn = e => !!e.type.__asyncLoader,
    yn = e => e.type.__isKeepAlive;

function bn(e, t) {
    _n(e, "a", t)
}

function wn(e, t) {
    _n(e, "da", t)
}

function _n(e, t, n = yr) {
    const i = e.__wdc || (e.__wdc = () => {
        let t = n;
        for (; t;) {
            if (t.isDeactivated) return;
            t = t.parent
        }
        return e()
    });
    if (kn(t, i, n), n) {
        let e = n.parent;
        for (; e && e.parent;) yn(e.parent.vnode) && xn(i, t, n, e), e = e.parent
    }
}

function xn(e, t, n, i) {
    const r = kn(t, e, i, !0);
    Dn((() => {
        l(i[t], r)
    }), n)
}

function kn(e, t, n = yr, i = !1) {
    if (n) {
        const r = n[e] || (n[e] = []),
            o = t.__weh || (t.__weh = (...i) => {
                ue();
                const r = xr(n),
                    o = At(t, n, e, i);
                return r(), he(), o
            });
        return i ? r.unshift(o) : r.push(o), o
    }
}
const En = e => (t, n = yr) => {
        Sr && "sp" !== e || kn(e, ((...e) => t(...e)), n)
    },
    Cn = En("bm"),
    Sn = En("m"),
    On = En("bu"),
    Ln = En("u"),
    An = En("bum"),
    Dn = En("um"),
    Tn = En("sp"),
    In = En("rtg"),
    Mn = En("rtc");

function jn(e, t = yr) {
    kn("ec", e, t)
}
const Pn = Symbol.for("v-ndc");

function Rn(e) {
    return g(e) ? function(e, t, n = !0, i = !1) {
        const r = $t || yr;
        if (r) {
            const n = r.type;
            {
                const e = Tr(n, !1);
                if (e && (e === t || e === S(t) || e === A(S(t)))) return n
            }
            const o = Fn(r[e] || n[e], t) || Fn(r.appContext[e], t);
            return !o && i ? n : o
        }
    }("components", e, !1) || e : e || Pn
}

function Fn(e, t) {
    return e && (e[t] || e[S(t)] || e[A(S(t))])
}

function Bn(e, t, n, i) {
    let r;
    const o = n,
        s = u(e);
    if (s || g(e)) {
        let n = !1;
        s && ht(e) && (n = !ft(e), e = ke(e)), r = new Array(e.length);
        for (let i = 0, s = e.length; i < s; i++) r[i] = t(n ? vt(e[i]) : e[i], i, void 0, o)
    } else if ("number" == typeof e) {
        r = new Array(e);
        for (let n = 0; n < e; n++) r[n] = t(n + 1, n, void 0, o)
    } else if (v(e))
        if (e[Symbol.iterator]) r = Array.from(e, ((e, n) => t(e, n, void 0, o)));
        else {
            const n = Object.keys(e);
            r = new Array(n.length);
            for (let i = 0, s = n.length; i < s; i++) {
                const s = n[i];
                r[i] = t(e[s], s, i, o)
            }
        }
    else r = [];
    return r
}
const Hn = e => e ? Er(e) ? Dr(e) : Hn(e.parent) : null,
    Nn = a(Object.create(null), {
        $: e => e,
        $el: e => e.vnode.el,
        $data: e => e.data,
        $props: e => e.props,
        $attrs: e => e.attrs,
        $slots: e => e.slots,
        $refs: e => e.refs,
        $parent: e => Hn(e.parent),
        $root: e => Hn(e.root),
        $host: e => e.ce,
        $emit: e => e.emit,
        $options: e => Yn(e),
        $forceUpdate: e => e.f || (e.f = () => {
            zt(e.update)
        }),
        $nextTick: e => e.n || (e.n = Nt.bind(e.proxy)),
        $watch: e => Mi.bind(e)
    }),
    zn = (e, n) => e !== t && !e.__isScriptSetup && d(e, n),
    Vn = {
        get({
            _: e
        }, n) {
            if ("__v_skip" === n) return !0;
            const {
                ctx: i,
                setupState: r,
                data: o,
                props: s,
                accessCache: a,
                type: l,
                appContext: c
            } = e;
            let u;
            if ("$" !== n[0]) {
                const l = a[n];
                if (void 0 !== l) switch (l) {
                    case 1:
                        return r[n];
                    case 2:
                        return o[n];
                    case 4:
                        return i[n];
                    case 3:
                        return s[n]
                } else {
                    if (zn(r, n)) return a[n] = 1, r[n];
                    if (o !== t && d(o, n)) return a[n] = 2, o[n];
                    if ((u = e.propsOptions[0]) && d(u, n)) return a[n] = 3, s[n];
                    if (i !== t && d(i, n)) return a[n] = 4, i[n];
                    qn && (a[n] = 0)
                }
            }
            const h = Nn[n];
            let p, f;
            return h ? ("$attrs" === n && we(e.attrs, 0, ""), h(e)) : (p = l.__cssModules) && (p = p[n]) ? p : i !== t && d(i, n) ? (a[n] = 4, i[n]) : (f = c.config.globalProperties, d(f, n) ? f[n] : void 0)
        },
        set({
            _: e
        }, n, i) {
            const {
                data: r,
                setupState: o,
                ctx: s
            } = e;
            return zn(o, n) ? (o[n] = i, !0) : r !== t && d(r, n) ? (r[n] = i, !0) : !d(e.props, n) && (("$" !== n[0] || !(n.slice(1) in e)) && (s[n] = i, !0))
        },
        has({
            _: {
                data: e,
                setupState: n,
                accessCache: i,
                ctx: r,
                appContext: o,
                propsOptions: s
            }
        }, a) {
            let l;
            return !!i[a] || e !== t && d(e, a) || zn(n, a) || (l = s[0]) && d(l, a) || d(r, a) || d(Nn, a) || d(o.config.globalProperties, a)
        },
        defineProperty(e, t, n) {
            return null != n.get ? e._.accessCache[t] = 0 : d(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n)
        }
    };

function Un(e) {
    return u(e) ? e.reduce(((e, t) => (e[t] = null, e)), {}) : e
}
let qn = !0;

function Wn(e) {
    const t = Yn(e),
        n = e.proxy,
        r = e.ctx;
    qn = !1, t.beforeCreate && Kn(t.beforeCreate, e, "bc");
    const {
        data: o,
        computed: s,
        methods: a,
        watch: l,
        provide: c,
        inject: d,
        created: h,
        beforeMount: p,
        mounted: g,
        beforeUpdate: m,
        updated: y,
        activated: b,
        deactivated: w,
        beforeDestroy: _,
        beforeUnmount: x,
        destroyed: k,
        unmounted: E,
        render: C,
        renderTracked: S,
        renderTriggered: O,
        errorCaptured: L,
        serverPrefetch: A,
        expose: D,
        inheritAttrs: T,
        components: I,
        directives: M,
        filters: j
    } = t;
    if (d && function(e, t) {
            u(e) && (e = Xn(e));
            for (const n in e) {
                const i = e[n];
                let r;
                r = v(i) ? "default" in i ? si(i.from || n, i.default, !0) : si(i.from || n) : si(i), bt(r) ? Object.defineProperty(t, n, {
                    enumerable: !0,
                    configurable: !0,
                    get: () => r.value,
                    set: e => r.value = e
                }) : t[n] = r
            }
        }(d, r, null), a)
        for (const i in a) {
            const e = a[i];
            f(e) && (r[i] = e.bind(n))
        }
    if (o) {
        const t = o.call(n, n);
        v(t) && (e.data = ct(t))
    }
    if (qn = !0, s)
        for (const u in s) {
            const e = s[u],
                t = f(e) ? e.bind(n, n) : f(e.get) ? e.get.bind(n, n) : i,
                o = !f(e) && f(e.set) ? e.set.bind(n) : i,
                a = Ir({
                    get: t,
                    set: o
                });
            Object.defineProperty(r, u, {
                enumerable: !0,
                configurable: !0,
                get: () => a.value,
                set: e => a.value = e
            })
        }
    if (l)
        for (const i in l) $n(l[i], r, n, i);
    if (c) {
        const e = f(c) ? c.call(n) : c;
        Reflect.ownKeys(e).forEach((t => {
            ! function(e, t) {
                if (yr) {
                    let n = yr.provides;
                    const i = yr.parent && yr.parent.provides;
                    i === n && (n = yr.provides = Object.create(i)), n[e] = t
                } else;
            }(t, e[t])
        }))
    }

    function P(e, t) {
        u(t) ? t.forEach((t => e(t.bind(n)))) : t && e(t.bind(n))
    }
    if (h && Kn(h, e, "c"), P(Cn, p), P(Sn, g), P(On, m), P(Ln, y), P(bn, b), P(wn, w), P(jn, L), P(Mn, S), P(In, O), P(An, x), P(Dn, E), P(Tn, A), u(D))
        if (D.length) {
            const t = e.exposed || (e.exposed = {});
            D.forEach((e => {
                Object.defineProperty(t, e, {
                    get: () => n[e],
                    set: t => n[e] = t
                })
            }))
        } else e.exposed || (e.exposed = {});
    C && e.render === i && (e.render = C), null != T && (e.inheritAttrs = T), I && (e.components = I), M && (e.directives = M), A && gn(e)
}

function Kn(e, t, n) {
    At(u(e) ? e.map((e => e.bind(t.proxy))) : e.bind(t.proxy), t, n)
}

function $n(e, t, n, i) {
    let r = i.includes(".") ? ji(n, i) : () => n[i];
    if (g(e)) {
        const n = t[e];
        f(n) && Ti(r, n)
    } else if (f(e)) Ti(r, e.bind(n));
    else if (v(e))
        if (u(e)) e.forEach((e => $n(e, t, n, i)));
        else {
            const i = f(e.handler) ? e.handler.bind(n) : t[e.handler];
            f(i) && Ti(r, i, e)
        }
}

function Yn(e) {
    const t = e.type,
        {
            mixins: n,
            extends: i
        } = t,
        {
            mixins: r,
            optionsCache: o,
            config: {
                optionMergeStrategies: s
            }
        } = e.appContext,
        a = o.get(t);
    let l;
    return a ? l = a : r.length || n || i ? (l = {}, r.length && r.forEach((e => Jn(l, e, s, !0))), Jn(l, t, s)) : l = t, v(t) && o.set(t, l), l
}

function Jn(e, t, n, i = !1) {
    const {
        mixins: r,
        extends: o
    } = t;
    o && Jn(e, o, n, !0), r && r.forEach((t => Jn(e, t, n, !0)));
    for (const s in t)
        if (i && "expose" === s);
        else {
            const i = Gn[s] || n && n[s];
            e[s] = i ? i(e[s], t[s]) : t[s]
        } return e
}
const Gn = {
    data: Zn,
    props: ti,
    emits: ti,
    methods: ei,
    computed: ei,
    beforeCreate: Qn,
    created: Qn,
    beforeMount: Qn,
    mounted: Qn,
    beforeUpdate: Qn,
    updated: Qn,
    beforeDestroy: Qn,
    beforeUnmount: Qn,
    destroyed: Qn,
    unmounted: Qn,
    activated: Qn,
    deactivated: Qn,
    errorCaptured: Qn,
    serverPrefetch: Qn,
    components: ei,
    directives: ei,
    watch: function(e, t) {
        if (!e) return t;
        if (!t) return e;
        const n = a(Object.create(null), e);
        for (const i in t) n[i] = Qn(e[i], t[i]);
        return n
    },
    provide: Zn,
    inject: function(e, t) {
        return ei(Xn(e), Xn(t))
    }
};

function Zn(e, t) {
    return t ? e ? function() {
        return a(f(e) ? e.call(this, this) : e, f(t) ? t.call(this, this) : t)
    } : t : e
}

function Xn(e) {
    if (u(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
        return t
    }
    return e
}

function Qn(e, t) {
    return e ? [...new Set([].concat(e, t))] : t
}

function ei(e, t) {
    return e ? a(Object.create(null), e, t) : t
}

function ti(e, t) {
    return e ? u(e) && u(t) ? [...new Set([...e, ...t])] : a(Object.create(null), Un(e), Un(null != t ? t : {})) : t
}

function ni() {
    return {
        app: null,
        config: {
            isNativeTag: r,
            performance: !1,
            globalProperties: {},
            optionMergeStrategies: {},
            errorHandler: void 0,
            warnHandler: void 0,
            compilerOptions: {}
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null),
        optionsCache: new WeakMap,
        propsCache: new WeakMap,
        emitsCache: new WeakMap
    }
}
let ii = 0;

function ri(e, t) {
    return function(n, i = null) {
        f(n) || (n = a({}, n)), null == i || v(i) || (i = null);
        const r = ni(),
            o = new WeakSet,
            s = [];
        let l = !1;
        const c = r.app = {
            _uid: ii++,
            _component: n,
            _props: i,
            _container: null,
            _context: r,
            _instance: null,
            version: Mr,
            get config() {
                return r.config
            },
            set config(e) {},
            use: (e, ...t) => (o.has(e) || (e && f(e.install) ? (o.add(e), e.install(c, ...t)) : f(e) && (o.add(e), e(c, ...t))), c),
            mixin: e => (r.mixins.includes(e) || r.mixins.push(e), c),
            component: (e, t) => t ? (r.components[e] = t, c) : r.components[e],
            directive: (e, t) => t ? (r.directives[e] = t, c) : r.directives[e],
            mount(o, s, a) {
                if (!l) {
                    const d = c._ceVNode || ar(n, i);
                    return d.appContext = r, !0 === a ? a = "svg" : !1 === a && (a = void 0), s && t ? t(d, o) : e(d, o, a), l = !0, c._container = o, o.__vue_app__ = c, Dr(d.component)
                }
            },
            onUnmount(e) {
                s.push(e)
            },
            unmount() {
                l && (At(s, c._instance, 16), e(null, c._container), delete c._container.__vue_app__)
            },
            provide: (e, t) => (r.provides[e] = t, c),
            runWithContext(e) {
                const t = oi;
                oi = c;
                try {
                    return e()
                } finally {
                    oi = t
                }
            }
        };
        return c
    }
}
let oi = null;

function si(e, t, n = !1) {
    const i = yr || $t;
    if (i || oi) {
        const r = oi ? oi._context.provides : i ? null == i.parent ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
        if (r && e in r) return r[e];
        if (arguments.length > 1) return n && f(t) ? t.call(i && i.proxy) : t
    }
}
const ai = {},
    li = () => Object.create(ai),
    ci = e => Object.getPrototypeOf(e) === ai;

function di(e, t, n, i = !1) {
    const r = {},
        o = li();
    e.propsDefaults = Object.create(null), ui(e, t, r, o);
    for (const s in e.propsOptions[0]) s in r || (r[s] = void 0);
    n ? e.props = i ? r : ut(r, !1, Re, nt, ot) : e.type.props ? e.props = r : e.props = o, e.attrs = o
}

function ui(e, n, i, r) {
    const [o, s] = e.propsOptions;
    let a, l = !1;
    if (n)
        for (let t in n) {
            if (k(t)) continue;
            const c = n[t];
            let u;
            o && d(o, u = S(t)) ? s && s.includes(u) ? (a || (a = {}))[u] = c : i[u] = c : Bi(e.emitsOptions, t) || t in r && c === r[t] || (r[t] = c, l = !0)
        }
    if (s) {
        const n = mt(i),
            r = a || t;
        for (let t = 0; t < s.length; t++) {
            const a = s[t];
            i[a] = hi(o, n, a, r[a], e, !d(r, a))
        }
    }
    return l
}

function hi(e, t, n, i, r, o) {
    const s = e[n];
    if (null != s) {
        const e = d(s, "default");
        if (e && void 0 === i) {
            const e = s.default;
            if (s.type !== Function && !s.skipFactory && f(e)) {
                const {
                    propsDefaults: o
                } = r;
                if (n in o) i = o[n];
                else {
                    const s = xr(r);
                    i = o[n] = e.call(null, t), s()
                }
            } else i = e;
            r.ce && r.ce._setProp(n, i)
        }
        s[0] && (o && !e ? i = !1 : !s[1] || "" !== i && i !== L(n) || (i = !0))
    }
    return i
}
const pi = new WeakMap;

function fi(e, i, r = !1) {
    const o = r ? pi : i.propsCache,
        s = o.get(e);
    if (s) return s;
    const l = e.props,
        c = {},
        h = [];
    let p = !1;
    if (!f(e)) {
        const t = e => {
            p = !0;
            const [t, n] = fi(e, i, !0);
            a(c, t), n && h.push(...n)
        };
        !r && i.mixins.length && i.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t)
    }
    if (!l && !p) return v(e) && o.set(e, n), n;
    if (u(l))
        for (let n = 0; n < l.length; n++) {
            const e = S(l[n]);
            gi(e) && (c[e] = t)
        } else if (l)
            for (const t in l) {
                const e = S(t);
                if (gi(e)) {
                    const n = l[t],
                        i = c[e] = u(n) || f(n) ? {
                            type: n
                        } : a({}, n),
                        r = i.type;
                    let o = !1,
                        s = !0;
                    if (u(r))
                        for (let e = 0; e < r.length; ++e) {
                            const t = r[e],
                                n = f(t) && t.name;
                            if ("Boolean" === n) {
                                o = !0;
                                break
                            }
                            "String" === n && (s = !1)
                        } else o = f(r) && "Boolean" === r.name;
                    i[0] = o, i[1] = s, (o || d(i, "default")) && h.push(e)
                }
            }
    const g = [c, h];
    return v(e) && o.set(e, g), g
}

function gi(e) {
    return "$" !== e[0] && !k(e)
}
const mi = e => "_" === e[0] || "$stable" === e,
    vi = e => u(e) ? e.map(hr) : [hr(e)],
    yi = (e, t, n) => {
        if (t._n) return t;
        const i = Gt(((...e) => vi(t(...e))), n);
        return i._c = !1, i
    },
    bi = (e, t, n) => {
        const i = e._ctx;
        for (const r in e) {
            if (mi(r)) continue;
            const n = e[r];
            if (f(n)) t[r] = yi(0, n, i);
            else if (null != n) {
                const e = vi(n);
                t[r] = () => e
            }
        }
    },
    wi = (e, t) => {
        const n = vi(t);
        e.slots.default = () => n
    },
    _i = (e, t, n) => {
        for (const i in t)(n || "_" !== i) && (e[i] = t[i])
    },
    xi = function(e, t) {
        t && t.pendingBranch ? u(e) ? t.effects.push(...e) : t.effects.push(e) : (u(n = e) ? Pt.push(...n) : Rt && -1 === n.id ? Rt.splice(Ft + 1, 0, n) : 1 & n.flags || (Pt.push(n), n.flags |= 1), Vt());
        var n
    };

function ki(e) {
    return function(e) {
        R().__VUE__ = !0;
        const {
            insert: r,
            remove: o,
            patchProp: s,
            createElement: a,
            createText: l,
            createComment: c,
            setText: u,
            setElementText: h,
            parentNode: p,
            nextSibling: f,
            setScopeId: g = i,
            insertStaticContent: m
        } = e, v = (e, t, n, i = null, r = null, o = null, s = void 0, a = null, l = !!t.dynamicChildren) => {
            if (e === t) return;
            e && !ir(e, t) && (i = X(e), $(e, r, o, !0), e = null), -2 === t.patchFlag && (l = !1, t.dynamicChildren = null);
            const {
                type: c,
                ref: d,
                shapeFlag: u
            } = t;
            switch (c) {
                case Wi:
                    b(e, t, n, i);
                    break;
                case Ki:
                    w(e, t, n, i);
                    break;
                case $i:
                    null == e && _(t, n, i, s);
                    break;
                case qi:
                    F(e, t, n, i, r, o, s, a, l);
                    break;
                default:
                    1 & u ? C(e, t, n, i, r, o, s, a, l) : 6 & u ? B(e, t, n, i, r, o, s, a, l) : (64 & u || 128 & u) && c.process(e, t, n, i, r, o, s, a, l, te)
            }
            null != d && r && mn(d, e && e.ref, o, t || e, !t)
        }, b = (e, t, n, i) => {
            if (null == e) r(t.el = l(t.children), n, i);
            else {
                const n = t.el = e.el;
                t.children !== e.children && u(n, t.children)
            }
        }, w = (e, t, n, i) => {
            null == e ? r(t.el = c(t.children || ""), n, i) : t.el = e.el
        }, _ = (e, t, n, i) => {
            [e.el, e.anchor] = m(e.children, t, n, i, e.el, e.anchor)
        }, x = ({
            el: e,
            anchor: t
        }, n, i) => {
            let o;
            for (; e && e !== t;) o = f(e), r(e, n, i), e = o;
            r(t, n, i)
        }, E = ({
            el: e,
            anchor: t
        }) => {
            let n;
            for (; e && e !== t;) n = f(e), o(e), e = n;
            o(t)
        }, C = (e, t, n, i, r, o, s, a, l) => {
            "svg" === t.type ? s = "svg" : "math" === t.type && (s = "mathml"), null == e ? O(t, n, i, r, o, s, a, l) : T(e, t, r, o, s, a, l)
        }, O = (e, t, n, i, o, l, c, d) => {
            let u, p;
            const {
                props: f,
                shapeFlag: g,
                transition: m,
                dirs: v
            } = e;
            if (u = e.el = a(e.type, l, f && f.is, f), 8 & g ? h(u, e.children) : 16 & g && D(e.children, u, null, i, o, Ei(e, l), c, d), v && Xt(e, null, i, "created"), A(u, e, e.scopeId, c, i), f) {
                for (const e in f) "value" === e || k(e) || s(u, e, null, f[e], l, i);
                "value" in f && s(u, "value", null, f.value, l), (p = f.onVnodeBeforeMount) && gr(p, i, e)
            }
            v && Xt(e, null, i, "beforeMount");
            const y = function(e, t) {
                return (!e || e && !e.pendingBranch) && t && !t.persisted
            }(o, m);
            y && m.beforeEnter(u), r(u, t, n), ((p = f && f.onVnodeMounted) || y || v) && xi((() => {
                p && gr(p, i, e), y && m.enter(u), v && Xt(e, null, i, "mounted")
            }), o)
        }, A = (e, t, n, i, r) => {
            if (n && g(e, n), i)
                for (let o = 0; o < i.length; o++) g(e, i[o]);
            if (r) {
                let n = r.subTree;
                if (t === n || Ui(n.type) && (n.ssContent === t || n.ssFallback === t)) {
                    const t = r.vnode;
                    A(e, t, t.scopeId, t.slotScopeIds, r.parent)
                }
            }
        }, D = (e, t, n, i, r, o, s, a, l = 0) => {
            for (let c = l; c < e.length; c++) {
                const l = e[c] = a ? pr(e[c]) : hr(e[c]);
                v(null, l, t, n, i, r, o, s, a)
            }
        }, T = (e, n, i, r, o, a, l) => {
            const c = n.el = e.el;
            let {
                patchFlag: d,
                dynamicChildren: u,
                dirs: p
            } = n;
            d |= 16 & e.patchFlag;
            const f = e.props || t,
                g = n.props || t;
            let m;
            if (i && Ci(i, !1), (m = g.onVnodeBeforeUpdate) && gr(m, i, n, e), p && Xt(n, e, i, "beforeUpdate"), i && Ci(i, !0), (f.innerHTML && null == g.innerHTML || f.textContent && null == g.textContent) && h(c, ""), u ? j(e.dynamicChildren, u, c, i, r, Ei(n, o), a) : l || U(e, n, c, null, i, r, Ei(n, o), a, !1), d > 0) {
                if (16 & d) P(c, f, g, i, o);
                else if (2 & d && f.class !== g.class && s(c, "class", null, g.class, o), 4 & d && s(c, "style", f.style, g.style, o), 8 & d) {
                    const e = n.dynamicProps;
                    for (let t = 0; t < e.length; t++) {
                        const n = e[t],
                            r = f[n],
                            a = g[n];
                        a === r && "value" !== n || s(c, n, r, a, o, i)
                    }
                }
                1 & d && e.children !== n.children && h(c, n.children)
            } else l || null != u || P(c, f, g, i, o);
            ((m = g.onVnodeUpdated) || p) && xi((() => {
                m && gr(m, i, n, e), p && Xt(n, e, i, "updated")
            }), r)
        }, j = (e, t, n, i, r, o, s) => {
            for (let a = 0; a < t.length; a++) {
                const l = e[a],
                    c = t[a],
                    d = l.el && (l.type === qi || !ir(l, c) || 70 & l.shapeFlag) ? p(l.el) : n;
                v(l, c, d, null, i, r, o, s, !0)
            }
        }, P = (e, n, i, r, o) => {
            if (n !== i) {
                if (n !== t)
                    for (const t in n) k(t) || t in i || s(e, t, n[t], null, o, r);
                for (const t in i) {
                    if (k(t)) continue;
                    const a = i[t],
                        l = n[t];
                    a !== l && "value" !== t && s(e, t, l, a, o, r)
                }
                "value" in i && s(e, "value", n.value, i.value, o)
            }
        }, F = (e, t, n, i, o, s, a, c, d) => {
            const u = t.el = e ? e.el : l(""),
                h = t.anchor = e ? e.anchor : l("");
            let {
                patchFlag: p,
                dynamicChildren: f,
                slotScopeIds: g
            } = t;
            g && (c = c ? c.concat(g) : g), null == e ? (r(u, n, i), r(h, n, i), D(t.children || [], n, h, o, s, a, c, d)) : p > 0 && 64 & p && f && e.dynamicChildren ? (j(e.dynamicChildren, f, n, o, s, a, c), (null != t.key || o && t === o.subTree) && Si(e, t, !0)) : U(e, t, n, h, o, s, a, c, d)
        }, B = (e, t, n, i, r, o, s, a, l) => {
            t.slotScopeIds = a, null == e ? 512 & t.shapeFlag ? r.ctx.activate(t, n, i, s, l) : H(t, n, i, r, o, s, l) : N(e, t, l)
        }, H = (e, n, i, r, o, s, a) => {
            const l = e.component = function(e, n, i) {
                const r = e.type,
                    o = (n ? n.appContext : e.appContext) || mr,
                    s = {
                        uid: vr++,
                        vnode: e,
                        type: r,
                        parent: n,
                        appContext: o,
                        root: null,
                        next: null,
                        subTree: null,
                        effect: null,
                        update: null,
                        job: null,
                        scope: new EffectScope(!0),
                        render: null,
                        proxy: null,
                        exposed: null,
                        exposeProxy: null,
                        withProxy: null,
                        provides: n ? n.provides : Object.create(o.provides),
                        ids: n ? n.ids : ["", 0, 0],
                        accessCache: null,
                        renderCache: [],
                        components: null,
                        directives: null,
                        propsOptions: fi(r, o),
                        emitsOptions: Fi(r, o),
                        emit: null,
                        emitted: null,
                        propsDefaults: t,
                        inheritAttrs: r.inheritAttrs,
                        ctx: t,
                        data: t,
                        props: t,
                        attrs: t,
                        slots: t,
                        refs: t,
                        setupState: t,
                        setupContext: null,
                        suspense: i,
                        suspenseId: i ? i.pendingId : 0,
                        asyncDep: null,
                        asyncResolved: !1,
                        isMounted: !1,
                        isUnmounted: !1,
                        isDeactivated: !1,
                        bc: null,
                        c: null,
                        bm: null,
                        m: null,
                        bu: null,
                        u: null,
                        um: null,
                        bum: null,
                        da: null,
                        a: null,
                        rtg: null,
                        rtc: null,
                        ec: null,
                        sp: null
                    };
                s.ctx = {
                    _: s
                }, s.root = n ? n.root : s, s.emit = Ri.bind(null, s), e.ce && e.ce(s);
                return s
            }(e, r, o);
            if (yn(e) && (l.ctx.renderer = te), function(e, t = !1, n = !1) {
                    t && _r(t);
                    const {
                        props: i,
                        children: r
                    } = e.vnode, o = Er(e);
                    di(e, i, o, t), ((e, t, n) => {
                        const i = e.slots = li();
                        if (32 & e.vnode.shapeFlag) {
                            const e = t._;
                            e ? (_i(i, t, n), n && M(i, "_", e, !0)) : bi(t, i)
                        } else t && wi(e, t)
                    })(e, r, n);
                    const s = o ? function(e, t) {
                        const n = e.type;
                        e.accessCache = Object.create(null), e.proxy = new Proxy(e.ctx, Vn);
                        const {
                            setup: i
                        } = n;
                        if (i) {
                            const n = e.setupContext = i.length > 1 ? function(e) {
                                    const t = t => {
                                        e.exposed = t || {}
                                    };
                                    return {
                                        attrs: new Proxy(e.attrs, Ar),
                                        slots: e.slots,
                                        emit: e.emit,
                                        expose: t
                                    }
                                }(e) : null,
                                r = xr(e);
                            ue();
                            const o = Lt(i, e, 0, [e.props, n]);
                            if (he(), r(), y(o)) {
                                if (vn(e) || gn(e), o.then(kr, kr), t) return o.then((n => {
                                    Or(e, n, t)
                                })).catch((t => {
                                    Dt(t, e, 0)
                                }));
                                e.asyncDep = o
                            } else Or(e, o, t)
                        } else Lr(e, t)
                    }(e, t) : void 0;
                    t && _r(!1)
                }(l, !1, a), l.asyncDep) {
                if (o && o.registerDep(l, z, a), !e.el) {
                    const e = l.subTree = ar(Ki);
                    w(null, e, n, i)
                }
            } else z(l, e, n, i, o, s, a)
        }, N = (e, t, n) => {
            const i = t.component = e.component;
            if (function(e, t, n) {
                    const {
                        props: i,
                        children: r,
                        component: o
                    } = e, {
                        props: s,
                        children: a,
                        patchFlag: l
                    } = t, c = o.emitsOptions;
                    if (t.dirs || t.transition) return !0;
                    if (!(n && l >= 0)) return !(!r && !a || a && a.$stable) || i !== s && (i ? !s || Vi(i, s, c) : !!s);
                    if (1024 & l) return !0;
                    if (16 & l) return i ? Vi(i, s, c) : !!s;
                    if (8 & l) {
                        const e = t.dynamicProps;
                        for (let t = 0; t < e.length; t++) {
                            const n = e[t];
                            if (s[n] !== i[n] && !Bi(c, n)) return !0
                        }
                    }
                    return !1
                }(e, t, n)) {
                if (i.asyncDep && !i.asyncResolved) return void V(i, t, n);
                i.next = t, i.update()
            } else t.el = e.el, i.vnode = t
        }, z = (e, t, n, i, r, o, s) => {
            const a = () => {
                if (e.isMounted) {
                    let {
                        next: t,
                        bu: n,
                        u: i,
                        parent: l,
                        vnode: c
                    } = e;
                    {
                        const n = Oi(e);
                        if (n) return t && (t.el = c.el, V(e, t, s)), void n.asyncDep.then((() => {
                            e.isUnmounted || a()
                        }))
                    }
                    let d, u = t;
                    Ci(e, !1), t ? (t.el = c.el, V(e, t, s)) : t = c, n && I(n), (d = t.props && t.props.onVnodeBeforeUpdate) && gr(d, l, t, c), Ci(e, !0);
                    const h = Hi(e),
                        f = e.subTree;
                    e.subTree = h, v(f, h, p(f.el), X(f), e, r, o), t.el = h.el, null === u && function({
                        vnode: e,
                        parent: t
                    }, n) {
                        for (; t;) {
                            const i = t.subTree;
                            if (i.suspense && i.suspense.activeBranch === e && (i.el = e.el), i !== e) break;
                            (e = t.vnode).el = n, t = t.parent
                        }
                    }(e, h.el), i && xi(i, r), (d = t.props && t.props.onVnodeUpdated) && xi((() => gr(d, l, t, c)), r)
                } else {
                    let s;
                    const {
                        el: a,
                        props: l
                    } = t, {
                        bm: c,
                        m: d,
                        parent: u,
                        root: h,
                        type: p
                    } = e, f = vn(t);
                    if (Ci(e, !1), c && I(c), !f && (s = l && l.onVnodeBeforeMount) && gr(s, u, t), Ci(e, !0), a && ie) {
                        const t = () => {
                            e.subTree = Hi(e), ie(a, e.subTree, e, r, null)
                        };
                        f && p.__asyncHydrate ? p.__asyncHydrate(a, e, t) : t()
                    } else {
                        h.ce && h.ce._injectChildStyle(p);
                        const s = e.subTree = Hi(e);
                        v(null, s, n, i, e, r, o), t.el = s.el
                    }
                    if (d && xi(d, r), !f && (s = l && l.onVnodeMounted)) {
                        const e = t;
                        xi((() => gr(s, u, e)), r)
                    }(256 & t.shapeFlag || u && vn(u.vnode) && 256 & u.vnode.shapeFlag) && e.a && xi(e.a, r), e.isMounted = !0, t = n = i = null
                }
            };
            e.scope.on();
            const l = e.effect = new ReactiveEffect(a);
            e.scope.off();
            const c = e.update = l.run.bind(l),
                d = e.job = l.runIfDirty.bind(l);
            d.i = e, d.id = e.uid, l.scheduler = () => zt(d), Ci(e, !0), c()
        }, V = (e, n, i) => {
            n.component = e;
            const r = e.vnode.props;
            e.vnode = n, e.next = null,
                function(e, t, n, i) {
                    const {
                        props: r,
                        attrs: o,
                        vnode: {
                            patchFlag: s
                        }
                    } = e, a = mt(r), [l] = e.propsOptions;
                    let c = !1;
                    if (!(i || s > 0) || 16 & s) {
                        let i;
                        ui(e, t, r, o) && (c = !0);
                        for (const o in a) t && (d(t, o) || (i = L(o)) !== o && d(t, i)) || (l ? !n || void 0 === n[o] && void 0 === n[i] || (r[o] = hi(l, a, o, void 0, e, !0)) : delete r[o]);
                        if (o !== a)
                            for (const e in o) t && d(t, e) || (delete o[e], c = !0)
                    } else if (8 & s) {
                        const n = e.vnode.dynamicProps;
                        for (let i = 0; i < n.length; i++) {
                            let s = n[i];
                            if (Bi(e.emitsOptions, s)) continue;
                            const u = t[s];
                            if (l)
                                if (d(o, s)) u !== o[s] && (o[s] = u, c = !0);
                                else {
                                    const t = S(s);
                                    r[t] = hi(l, a, t, u, e, !1)
                                }
                            else u !== o[s] && (o[s] = u, c = !0)
                        }
                    }
                    c && _e(e.attrs, "set", "")
                }(e, n.props, r, i), ((e, n, i) => {
                    const {
                        vnode: r,
                        slots: o
                    } = e;
                    let s = !0,
                        a = t;
                    if (32 & r.shapeFlag) {
                        const e = n._;
                        e ? i && 1 === e ? s = !1 : _i(o, n, i) : (s = !n.$stable, bi(n, o)), a = n
                    } else n && (wi(e, n), a = {
                        default: 1
                    });
                    if (s)
                        for (const t in o) mi(t) || null != a[t] || delete o[t]
                })(e, n.children, i), ue(), Ut(e), he()
        }, U = (e, t, n, i, r, o, s, a, l = !1) => {
            const c = e && e.children,
                d = e ? e.shapeFlag : 0,
                u = t.children,
                {
                    patchFlag: p,
                    shapeFlag: f
                } = t;
            if (p > 0) {
                if (128 & p) return void W(c, u, n, i, r, o, s, a, l);
                if (256 & p) return void q(c, u, n, i, r, o, s, a, l)
            }
            8 & f ? (16 & d && Z(c, r, o), u !== c && h(n, u)) : 16 & d ? 16 & f ? W(c, u, n, i, r, o, s, a, l) : Z(c, r, o, !0) : (8 & d && h(n, ""), 16 & f && D(u, n, i, r, o, s, a, l))
        }, q = (e, t, i, r, o, s, a, l, c) => {
            t = t || n;
            const d = (e = e || n).length,
                u = t.length,
                h = Math.min(d, u);
            let p;
            for (p = 0; p < h; p++) {
                const n = t[p] = c ? pr(t[p]) : hr(t[p]);
                v(e[p], n, i, null, o, s, a, l, c)
            }
            d > u ? Z(e, o, s, !0, !1, h) : D(t, i, r, o, s, a, l, c, h)
        }, W = (e, t, i, r, o, s, a, l, c) => {
            let d = 0;
            const u = t.length;
            let h = e.length - 1,
                p = u - 1;
            for (; d <= h && d <= p;) {
                const n = e[d],
                    r = t[d] = c ? pr(t[d]) : hr(t[d]);
                if (!ir(n, r)) break;
                v(n, r, i, null, o, s, a, l, c), d++
            }
            for (; d <= h && d <= p;) {
                const n = e[h],
                    r = t[p] = c ? pr(t[p]) : hr(t[p]);
                if (!ir(n, r)) break;
                v(n, r, i, null, o, s, a, l, c), h--, p--
            }
            if (d > h) {
                if (d <= p) {
                    const e = p + 1,
                        n = e < u ? t[e].el : r;
                    for (; d <= p;) v(null, t[d] = c ? pr(t[d]) : hr(t[d]), i, n, o, s, a, l, c), d++
                }
            } else if (d > p)
                for (; d <= h;) $(e[d], o, s, !0), d++;
            else {
                const f = d,
                    g = d,
                    m = new Map;
                for (d = g; d <= p; d++) {
                    const e = t[d] = c ? pr(t[d]) : hr(t[d]);
                    null != e.key && m.set(e.key, d)
                }
                let y, b = 0;
                const w = p - g + 1;
                let _ = !1,
                    x = 0;
                const k = new Array(w);
                for (d = 0; d < w; d++) k[d] = 0;
                for (d = f; d <= h; d++) {
                    const n = e[d];
                    if (b >= w) {
                        $(n, o, s, !0);
                        continue
                    }
                    let r;
                    if (null != n.key) r = m.get(n.key);
                    else
                        for (y = g; y <= p; y++)
                            if (0 === k[y - g] && ir(n, t[y])) {
                                r = y;
                                break
                            } void 0 === r ? $(n, o, s, !0) : (k[r - g] = d + 1, r >= x ? x = r : _ = !0, v(n, t[r], i, null, o, s, a, l, c), b++)
                }
                const E = _ ? function(e) {
                    const t = e.slice(),
                        n = [0];
                    let i, r, o, s, a;
                    const l = e.length;
                    for (i = 0; i < l; i++) {
                        const l = e[i];
                        if (0 !== l) {
                            if (r = n[n.length - 1], e[r] < l) {
                                t[i] = r, n.push(i);
                                continue
                            }
                            for (o = 0, s = n.length - 1; o < s;) a = o + s >> 1, e[n[a]] < l ? o = a + 1 : s = a;
                            l < e[n[o]] && (o > 0 && (t[i] = n[o - 1]), n[o] = i)
                        }
                    }
                    o = n.length, s = n[o - 1];
                    for (; o-- > 0;) n[o] = s, s = t[s];
                    return n
                }(k) : n;
                for (y = E.length - 1, d = w - 1; d >= 0; d--) {
                    const e = g + d,
                        n = t[e],
                        h = e + 1 < u ? t[e + 1].el : r;
                    0 === k[d] ? v(null, n, i, h, o, s, a, l, c) : _ && (y < 0 || d !== E[y] ? K(n, i, h, 2) : y--)
                }
            }
        }, K = (e, t, n, i, o = null) => {
            const {
                el: s,
                type: a,
                transition: l,
                children: c,
                shapeFlag: d
            } = e;
            if (6 & d) return void K(e.component.subTree, t, n, i);
            if (128 & d) return void e.suspense.move(t, n, i);
            if (64 & d) return void a.move(e, t, n, te);
            if (a === qi) {
                r(s, t, n);
                for (let e = 0; e < c.length; e++) K(c[e], t, n, i);
                return void r(e.anchor, t, n)
            }
            if (a === $i) return void x(e, t, n);
            if (2 !== i && 1 & d && l)
                if (0 === i) l.beforeEnter(s), r(s, t, n), xi((() => l.enter(s)), o);
                else {
                    const {
                        leave: e,
                        delayLeave: i,
                        afterLeave: o
                    } = l, a = () => r(s, t, n), c = () => {
                        e(s, (() => {
                            a(), o && o()
                        }))
                    };
                    i ? i(s, a, c) : c()
                }
            else r(s, t, n)
        }, $ = (e, t, n, i = !1, r = !1) => {
            const {
                type: o,
                props: s,
                ref: a,
                children: l,
                dynamicChildren: c,
                shapeFlag: d,
                patchFlag: u,
                dirs: h,
                cacheIndex: p
            } = e;
            if (-2 === u && (r = !1), null != a && mn(a, null, n, e, !0), null != p && (t.renderCache[p] = void 0), 256 & d) return void t.ctx.deactivate(e);
            const f = 1 & d && h,
                g = !vn(e);
            let m;
            if (g && (m = s && s.onVnodeBeforeUnmount) && gr(m, t, e), 6 & d) G(e.component, n, i);
            else {
                if (128 & d) return void e.suspense.unmount(n, i);
                f && Xt(e, null, t, "beforeUnmount"), 64 & d ? e.type.remove(e, t, n, te, i) : c && !c.hasOnce && (o !== qi || u > 0 && 64 & u) ? Z(c, t, n, !1, !0) : (o === qi && 384 & u || !r && 16 & d) && Z(l, t, n), i && Y(e)
            }(g && (m = s && s.onVnodeUnmounted) || f) && xi((() => {
                m && gr(m, t, e), f && Xt(e, null, t, "unmounted")
            }), n)
        }, Y = e => {
            const {
                type: t,
                el: n,
                anchor: i,
                transition: r
            } = e;
            if (t === qi) return void J(n, i);
            if (t === $i) return void E(e);
            const s = () => {
                o(n), r && !r.persisted && r.afterLeave && r.afterLeave()
            };
            if (1 & e.shapeFlag && r && !r.persisted) {
                const {
                    leave: t,
                    delayLeave: i
                } = r, o = () => t(n, s);
                i ? i(e.el, s, o) : o()
            } else s()
        }, J = (e, t) => {
            let n;
            for (; e !== t;) n = f(e), o(e), e = n;
            o(t)
        }, G = (e, t, n) => {
            const {
                bum: i,
                scope: r,
                job: o,
                subTree: s,
                um: a,
                m: l,
                a: c
            } = e;
            Li(l), Li(c), i && I(i), r.stop(), o && (o.flags |= 8, $(s, e, t, n)), a && xi(a, t), xi((() => {
                e.isUnmounted = !0
            }), t), t && t.pendingBranch && !t.isUnmounted && e.asyncDep && !e.asyncResolved && e.suspenseId === t.pendingId && (t.deps--, 0 === t.deps && t.resolve())
        }, Z = (e, t, n, i = !1, r = !1, o = 0) => {
            for (let s = o; s < e.length; s++) $(e[s], t, n, i, r)
        }, X = e => {
            if (6 & e.shapeFlag) return X(e.component.subTree);
            if (128 & e.shapeFlag) return e.suspense.next();
            const t = f(e.anchor || e.el),
                n = t && t[Qt];
            return n ? f(n) : t
        };
        let Q = !1;
        const ee = (e, t, n) => {
                null == e ? t._vnode && $(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, Q || (Q = !0, Ut(), qt(), Q = !1)
            },
            te = {
                p: v,
                um: $,
                m: K,
                r: Y,
                mt: H,
                mc: D,
                pc: U,
                pbc: j,
                n: X,
                o: e
            };
        let ne, ie;
        return {
            render: ee,
            hydrate: ne,
            createApp: ri(ee, ne)
        }
    }(e)
}

function Ei({
    type: e,
    props: t
}, n) {
    return "svg" === n && "foreignObject" === e || "mathml" === n && "annotation-xml" === e && t && t.encoding && t.encoding.includes("html") ? void 0 : n
}

function Ci({
    effect: e,
    job: t
}, n) {
    n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5)
}

function Si(e, t, n = !1) {
    const i = e.children,
        r = t.children;
    if (u(i) && u(r))
        for (let o = 0; o < i.length; o++) {
            const e = i[o];
            let t = r[o];
            1 & t.shapeFlag && !t.dynamicChildren && ((t.patchFlag <= 0 || 32 === t.patchFlag) && (t = r[o] = pr(r[o]), t.el = e.el), n || -2 === t.patchFlag || Si(e, t)), t.type === Wi && (t.el = e.el)
        }
}

function Oi(e) {
    const t = e.subTree.component;
    if (t) return t.asyncDep && !t.asyncResolved ? t : Oi(t)
}

function Li(e) {
    if (e)
        for (let t = 0; t < e.length; t++) e[t].flags |= 8
}
const Ai = Symbol.for("v-scx"),
    Di = () => si(Ai);

function Ti(e, t, n) {
    return Ii(e, t, n)
}

function Ii(e, n, r = t) {
    const {
        immediate: o,
        deep: s,
        flush: l,
        once: c
    } = r, d = a({}, r);
    let u;
    if (Sr)
        if ("sync" === l) {
            const e = Di();
            u = e.__watcherHandles || (e.__watcherHandles = [])
        } else {
            if (n && !o) {
                const e = () => {};
                return e.stop = i, e.resume = i, e.pause = i, e
            }
            d.once = !0
        } const h = yr;
    d.call = (e, t, n) => At(e, h, t, n);
    let p = !1;
    "post" === l ? d.scheduler = e => {
        xi(e, h && h.suspense)
    } : "sync" !== l && (p = !0, d.scheduler = (e, t) => {
        t ? e() : zt(e)
    }), d.augmentJob = e => {
        n && (e.flags |= 4), p && (e.flags |= 2, h && (e.id = h.uid, e.i = h))
    };
    const f = St(e, n, d);
    return u && u.push(f), f
}

function Mi(e, t, n) {
    const i = this.proxy,
        r = g(e) ? e.includes(".") ? ji(i, e) : () => i[e] : e.bind(i, i);
    let o;
    f(t) ? o = t : (o = t.handler, n = t);
    const s = xr(this),
        a = Ii(r, o.bind(i), n);
    return s(), a
}

function ji(e, t) {
    const n = t.split(".");
    return () => {
        let t = e;
        for (let e = 0; e < n.length && t; e++) t = t[n[e]];
        return t
    }
}
const Pi = (e, t) => "modelValue" === t || "model-value" === t ? e.modelModifiers : e[`${t}Modifiers`] || e[`${S(t)}Modifiers`] || e[`${L(t)}Modifiers`];

function Ri(e, n, ...i) {
    if (e.isUnmounted) return;
    const r = e.vnode.props || t;
    let o = i;
    const s = n.startsWith("update:"),
        a = s && Pi(r, n.slice(7));
    let l;
    a && (a.trim && (o = i.map((e => g(e) ? e.trim() : e))), a.number && (o = i.map(j)));
    let c = r[l = D(n)] || r[l = D(S(n))];
    !c && s && (c = r[l = D(L(n))]), c && At(c, e, 6, o);
    const d = r[l + "Once"];
    if (d) {
        if (e.emitted) {
            if (e.emitted[l]) return
        } else e.emitted = {};
        e.emitted[l] = !0, At(d, e, 6, o)
    }
}

function Fi(e, t, n = !1) {
    const i = t.emitsCache,
        r = i.get(e);
    if (void 0 !== r) return r;
    const o = e.emits;
    let s = {},
        l = !1;
    if (!f(e)) {
        const i = e => {
            const n = Fi(e, t, !0);
            n && (l = !0, a(s, n))
        };
        !n && t.mixins.length && t.mixins.forEach(i), e.extends && i(e.extends), e.mixins && e.mixins.forEach(i)
    }
    return o || l ? (u(o) ? o.forEach((e => s[e] = null)) : a(s, o), v(e) && i.set(e, s), s) : (v(e) && i.set(e, null), null)
}

function Bi(e, t) {
    return !(!e || !o(t)) && (t = t.slice(2).replace(/Once$/, ""), d(e, t[0].toLowerCase() + t.slice(1)) || d(e, L(t)) || d(e, t))
}

function Hi(e) {
    const {
        type: t,
        vnode: n,
        proxy: i,
        withProxy: r,
        propsOptions: [o],
        slots: a,
        attrs: l,
        emit: c,
        render: d,
        renderCache: u,
        props: h,
        data: p,
        setupState: f,
        ctx: g,
        inheritAttrs: m
    } = e, v = Jt(e);
    let y, b;
    try {
        if (4 & n.shapeFlag) {
            const e = r || i,
                t = e;
            y = hr(d.call(t, e, u, h, f, p, g)), b = l
        } else {
            const e = t;
            0, y = hr(e.length > 1 ? e(h, {
                attrs: l,
                slots: a,
                emit: c
            }) : e(h, null)), b = t.props ? l : Ni(l)
        }
    } catch (_) {
        Yi.length = 0, Dt(_, e, 1), y = ar(Ki)
    }
    let w = y;
    if (b && !1 !== m) {
        const e = Object.keys(b),
            {
                shapeFlag: t
            } = w;
        e.length && 7 & t && (o && e.some(s) && (b = zi(b, o)), w = lr(w, b, !1, !0))
    }
    return n.dirs && (w = lr(w, null, !1, !0), w.dirs = w.dirs ? w.dirs.concat(n.dirs) : n.dirs), n.transition && pn(w, n.transition), y = w, Jt(v), y
}
const Ni = e => {
        let t;
        for (const n in e)("class" === n || "style" === n || o(n)) && ((t || (t = {}))[n] = e[n]);
        return t
    },
    zi = (e, t) => {
        const n = {};
        for (const i in e) s(i) && i.slice(9) in t || (n[i] = e[i]);
        return n
    };

function Vi(e, t, n) {
    const i = Object.keys(t);
    if (i.length !== Object.keys(e).length) return !0;
    for (let r = 0; r < i.length; r++) {
        const o = i[r];
        if (t[o] !== e[o] && !Bi(n, o)) return !0
    }
    return !1
}
const Ui = e => e.__isSuspense;
const qi = Symbol.for("v-fgt"),
    Wi = Symbol.for("v-txt"),
    Ki = Symbol.for("v-cmt"),
    $i = Symbol.for("v-stc"),
    Yi = [];
let Ji = null;

function Gi(e = !1) {
    Yi.push(Ji = e ? null : [])
}
let Zi = 1;

function Xi(e) {
    Zi += e, e < 0 && Ji && (Ji.hasOnce = !0)
}

function Qi(e) {
    return e.dynamicChildren = Zi > 0 ? Ji || n : null, Yi.pop(), Ji = Yi[Yi.length - 1] || null, Zi > 0 && Ji && Ji.push(e), e
}

function er(e, t, n, i, r, o) {
    return Qi(sr(e, t, n, i, r, o, !0))
}

function tr(e, t, n, i, r) {
    return Qi(ar(e, t, n, i, r, !0))
}

function nr(e) {
    return !!e && !0 === e.__v_isVNode
}

function ir(e, t) {
    return e.type === t.type && e.key === t.key
}
const rr = ({
        key: e
    }) => null != e ? e : null,
    or = ({
        ref: e,
        ref_key: t,
        ref_for: n
    }) => ("number" == typeof e && (e = "" + e), null != e ? g(e) || bt(e) || f(e) ? {
        i: $t,
        r: e,
        k: t,
        f: !!n
    } : e : null);

function sr(e, t = null, n = null, i = 0, r = null, o = (e === qi ? 0 : 1), s = !1, a = !1) {
    const l = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e,
        props: t,
        key: t && rr(t),
        ref: t && or(t),
        scopeId: Yt,
        slotScopeIds: null,
        children: n,
        component: null,
        suspense: null,
        ssContent: null,
        ssFallback: null,
        dirs: null,
        transition: null,
        el: null,
        anchor: null,
        target: null,
        targetStart: null,
        targetAnchor: null,
        staticCount: 0,
        shapeFlag: o,
        patchFlag: i,
        dynamicProps: r,
        dynamicChildren: null,
        appContext: null,
        ctx: $t
    };
    return a ? (fr(l, n), 128 & o && e.normalize(l)) : n && (l.shapeFlag |= g(n) ? 8 : 16), Zi > 0 && !s && Ji && (l.patchFlag > 0 || 6 & o) && 32 !== l.patchFlag && Ji.push(l), l
}
const ar = function(e, t = null, n = null, i = 0, r = null, o = !1) {
    e && e !== Pn || (e = Ki);
    if (nr(e)) {
        const i = lr(e, t, !0);
        return n && fr(i, n), Zi > 0 && !o && Ji && (6 & i.shapeFlag ? Ji[Ji.indexOf(e)] = i : Ji.push(i)), i.patchFlag = -2, i
    }
    s = e, f(s) && "__vccOpts" in s && (e = e.__vccOpts);
    var s;
    if (t) {
        t = function(e) {
            return e ? gt(e) || ci(e) ? a({}, e) : e : null
        }(t);
        let {
            class: e,
            style: n
        } = t;
        e && !g(e) && (t.class = V(e)), v(n) && (gt(n) && !u(n) && (n = a({}, n)), t.style = F(n))
    }
    const l = g(e) ? 1 : Ui(e) ? 128 : en(e) ? 64 : v(e) ? 4 : f(e) ? 2 : 0;
    return sr(e, t, n, i, r, l, o, !0)
};

function lr(e, t, n = !1, i = !1) {
    const {
        props: r,
        ref: s,
        patchFlag: a,
        children: l,
        transition: c
    } = e, d = t ? function(...e) {
        const t = {};
        for (let n = 0; n < e.length; n++) {
            const i = e[n];
            for (const e in i)
                if ("class" === e) t.class !== i.class && (t.class = V([t.class, i.class]));
                else if ("style" === e) t.style = F([t.style, i.style]);
            else if (o(e)) {
                const n = t[e],
                    r = i[e];
                !r || n === r || u(n) && n.includes(r) || (t[e] = n ? [].concat(n, r) : r)
            } else "" !== e && (t[e] = i[e])
        }
        return t
    }(r || {}, t) : r, h = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e.type,
        props: d,
        key: d && rr(d),
        ref: t && t.ref ? n && s ? u(s) ? s.concat(or(t)) : [s, or(t)] : or(t) : s,
        scopeId: e.scopeId,
        slotScopeIds: e.slotScopeIds,
        children: l,
        target: e.target,
        targetStart: e.targetStart,
        targetAnchor: e.targetAnchor,
        staticCount: e.staticCount,
        shapeFlag: e.shapeFlag,
        patchFlag: t && e.type !== qi ? -1 === a ? 16 : 16 | a : a,
        dynamicProps: e.dynamicProps,
        dynamicChildren: e.dynamicChildren,
        appContext: e.appContext,
        dirs: e.dirs,
        transition: c,
        component: e.component,
        suspense: e.suspense,
        ssContent: e.ssContent && lr(e.ssContent),
        ssFallback: e.ssFallback && lr(e.ssFallback),
        el: e.el,
        anchor: e.anchor,
        ctx: e.ctx,
        ce: e.ce
    };
    return c && i && pn(h, c.clone(h)), h
}

function cr(e = " ", t = 0) {
    return ar(Wi, null, e, t)
}

function dr(e, t) {
    const n = ar($i, null, e);
    return n.staticCount = t, n
}

function ur(e = "", t = !1) {
    return t ? (Gi(), tr(Ki, null, e)) : ar(Ki, null, e)
}

function hr(e) {
    return null == e || "boolean" == typeof e ? ar(Ki) : u(e) ? ar(qi, null, e.slice()) : "object" == typeof e ? pr(e) : ar(Wi, null, String(e))
}

function pr(e) {
    return null === e.el && -1 !== e.patchFlag || e.memo ? e : lr(e)
}

function fr(e, t) {
    let n = 0;
    const {
        shapeFlag: i
    } = e;
    if (null == t) t = null;
    else if (u(t)) n = 16;
    else if ("object" == typeof t) {
        if (65 & i) {
            const n = t.default;
            return void(n && (n._c && (n._d = !1), fr(e, n()), n._c && (n._d = !0)))
        } {
            n = 32;
            const i = t._;
            i || ci(t) ? 3 === i && $t && (1 === $t.slots._ ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024)) : t._ctx = $t
        }
    } else f(t) ? (t = {
        default: t,
        _ctx: $t
    }, n = 32) : (t = String(t), 64 & i ? (n = 16, t = [cr(t)]) : n = 8);
    e.children = t, e.shapeFlag |= n
}

function gr(e, t, n, i = null) {
    At(e, t, 7, [n, i])
}
const mr = ni();
let vr = 0;
let yr = null;
const br = () => yr || $t;
let wr, _r;
{
    const e = R(),
        t = (t, n) => {
            let i;
            return (i = e[t]) || (i = e[t] = []), i.push(n), e => {
                i.length > 1 ? i.forEach((t => t(e))) : i[0](e)
            }
        };
    wr = t("__VUE_INSTANCE_SETTERS__", (e => yr = e)), _r = t("__VUE_SSR_SETTERS__", (e => Sr = e))
}
const xr = e => {
        const t = yr;
        return wr(e), e.scope.on(), () => {
            e.scope.off(), wr(t)
        }
    },
    kr = () => {
        yr && yr.scope.off(), wr(null)
    };

function Er(e) {
    return 4 & e.vnode.shapeFlag
}
let Cr, Sr = !1;

function Or(e, t, n) {
    f(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = xt(t)), Lr(e, n)
}

function Lr(e, t, n) {
    const r = e.type;
    if (!e.render) {
        if (!t && Cr && !r.render) {
            const t = r.template || Yn(e).template;
            if (t) {
                const {
                    isCustomElement: n,
                    compilerOptions: i
                } = e.appContext.config, {
                    delimiters: o,
                    compilerOptions: s
                } = r, l = a(a({
                    isCustomElement: n,
                    delimiters: o
                }, i), s);
                r.render = Cr(t, l)
            }
        }
        e.render = r.render || i
    } {
        const t = xr(e);
        ue();
        try {
            Wn(e)
        } finally {
            he(), t()
        }
    }
}
const Ar = {
    get: (e, t) => (we(e, 0, ""), e[t])
};

function Dr(e) {
    return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(xt((t = e.exposed, !d(t, "__v_skip") && Object.isExtensible(t) && M(t, "__v_skip", !0), t)), {
        get: (t, n) => n in t ? t[n] : n in Nn ? Nn[n](e) : void 0,
        has: (e, t) => t in e || t in Nn
    })) : e.proxy;
    var t
}

function Tr(e, t = !0) {
    return f(e) ? e.displayName || e.name : e.name || t && e.__name
}
const Ir = (e, t) => {
    const n = function(e, t, n = !1) {
        let i, r;
        return f(e) ? i = e : (i = e.get, r = e.set), new ComputedRefImpl(i, r, n)
    }(e, 0, Sr);
    return n
};
const Mr = "3.5.6";
let jr;
const Pr = "undefined" != typeof window && window.trustedTypes;
if (Pr) try {
    jr = Pr.createPolicy("vue", {
        createHTML: e => e
    })
} catch (lg) {}
const Rr = jr ? e => jr.createHTML(e) : e => e,
    Fr = "undefined" != typeof document ? document : null,
    Br = Fr && Fr.createElement("template"),
    Hr = {
        insert: (e, t, n) => {
            t.insertBefore(e, n || null)
        },
        remove: e => {
            const t = e.parentNode;
            t && t.removeChild(e)
        },
        createElement: (e, t, n, i) => {
            const r = "svg" === t ? Fr.createElementNS("http://www.w3.org/2000/svg", e) : "mathml" === t ? Fr.createElementNS("http://www.w3.org/1998/Math/MathML", e) : n ? Fr.createElement(e, {
                is: n
            }) : Fr.createElement(e);
            return "select" === e && i && null != i.multiple && r.setAttribute("multiple", i.multiple), r
        },
        createText: e => Fr.createTextNode(e),
        createComment: e => Fr.createComment(e),
        setText: (e, t) => {
            e.nodeValue = t
        },
        setElementText: (e, t) => {
            e.textContent = t
        },
        parentNode: e => e.parentNode,
        nextSibling: e => e.nextSibling,
        querySelector: e => Fr.querySelector(e),
        setScopeId(e, t) {
            e.setAttribute(t, "")
        },
        insertStaticContent(e, t, n, i, r, o) {
            const s = n ? n.previousSibling : t.lastChild;
            if (r && (r === o || r.nextSibling))
                for (; t.insertBefore(r.cloneNode(!0), n), r !== o && (r = r.nextSibling););
            else {
                Br.innerHTML = Rr("svg" === i ? `<svg>${e}</svg>` : "mathml" === i ? `<math>${e}</math>` : e);
                const r = Br.content;
                if ("svg" === i || "mathml" === i) {
                    const e = r.firstChild;
                    for (; e.firstChild;) r.appendChild(e.firstChild);
                    r.removeChild(e)
                }
                t.insertBefore(r, n)
            }
            return [s ? s.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild]
        }
    },
    Nr = "transition",
    zr = "animation",
    Vr = Symbol("_vtc"),
    Ur = {
        name: String,
        type: String,
        css: {
            type: Boolean,
            default: !0
        },
        duration: [String, Number, Object],
        enterFromClass: String,
        enterActiveClass: String,
        enterToClass: String,
        appearFromClass: String,
        appearActiveClass: String,
        appearToClass: String,
        leaveFromClass: String,
        leaveActiveClass: String,
        leaveToClass: String
    },
    qr = a({}, on, Ur),
    Wr = (e => (e.displayName = "Transition", e.props = qr, e))(((e, {
        slots: t
    }) => function(e, t, n) {
        const i = arguments.length;
        return 2 === i ? v(t) && !u(t) ? nr(t) ? ar(e, null, [t]) : ar(e, t) : ar(e, null, t) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : 3 === i && nr(n) && (n = [n]), ar(e, t, n))
    }(ln, function(e) {
        const t = {};
        for (const a in e) a in Ur || (t[a] = e[a]);
        if (!1 === e.css) return t;
        const {
            name: n = "v",
            type: i,
            duration: r,
            enterFromClass: o = `${n}-enter-from`,
            enterActiveClass: s = `${n}-enter-active`,
            enterToClass: l = `${n}-enter-to`,
            appearFromClass: c = o,
            appearActiveClass: d = s,
            appearToClass: u = l,
            leaveFromClass: h = `${n}-leave-from`,
            leaveActiveClass: p = `${n}-leave-active`,
            leaveToClass: f = `${n}-leave-to`
        } = e, g = function(e) {
            if (null == e) return null;
            if (v(e)) return [Yr(e.enter), Yr(e.leave)];
            {
                const t = Yr(e);
                return [t, t]
            }
        }(r), m = g && g[0], y = g && g[1], {
            onBeforeEnter: b,
            onEnter: w,
            onEnterCancelled: _,
            onLeave: x,
            onLeaveCancelled: k,
            onBeforeAppear: E = b,
            onAppear: C = w,
            onAppearCancelled: S = _
        } = t, O = (e, t, n) => {
            Gr(e, t ? u : l), Gr(e, t ? d : s), n && n()
        }, L = (e, t) => {
            e._isLeaving = !1, Gr(e, h), Gr(e, f), Gr(e, p), t && t()
        }, A = e => (t, n) => {
            const r = e ? C : w,
                s = () => O(t, e, n);
            Kr(r, [t, s]), Zr((() => {
                Gr(t, e ? c : o), Jr(t, e ? u : l), $r(r) || Qr(t, i, m, s)
            }))
        };
        return a(t, {
            onBeforeEnter(e) {
                Kr(b, [e]), Jr(e, o), Jr(e, s)
            },
            onBeforeAppear(e) {
                Kr(E, [e]), Jr(e, c), Jr(e, d)
            },
            onEnter: A(!1),
            onAppear: A(!0),
            onLeave(e, t) {
                e._isLeaving = !0;
                const n = () => L(e, t);
                Jr(e, h), Jr(e, p), document.body.offsetHeight, Zr((() => {
                    e._isLeaving && (Gr(e, h), Jr(e, f), $r(x) || Qr(e, i, y, n))
                })), Kr(x, [e, n])
            },
            onEnterCancelled(e) {
                O(e, !1), Kr(_, [e])
            },
            onAppearCancelled(e) {
                O(e, !0), Kr(S, [e])
            },
            onLeaveCancelled(e) {
                L(e), Kr(k, [e])
            }
        })
    }(e), t))),
    Kr = (e, t = []) => {
        u(e) ? e.forEach((e => e(...t))) : e && e(...t)
    },
    $r = e => !!e && (u(e) ? e.some((e => e.length > 1)) : e.length > 1);

function Yr(e) {
    const t = (e => {
        const t = g(e) ? Number(e) : NaN;
        return isNaN(t) ? e : t
    })(e);
    return t
}

function Jr(e, t) {
    t.split(/\s+/).forEach((t => t && e.classList.add(t))), (e[Vr] || (e[Vr] = new Set)).add(t)
}

function Gr(e, t) {
    t.split(/\s+/).forEach((t => t && e.classList.remove(t)));
    const n = e[Vr];
    n && (n.delete(t), n.size || (e[Vr] = void 0))
}

function Zr(e) {
    requestAnimationFrame((() => {
        requestAnimationFrame(e)
    }))
}
let Xr = 0;

function Qr(e, t, n, i) {
    const r = e._endId = ++Xr,
        o = () => {
            r === e._endId && i()
        };
    if (n) return setTimeout(o, n);
    const {
        type: s,
        timeout: a,
        propCount: l
    } = function(e, t) {
        const n = window.getComputedStyle(e),
            i = e => (n[e] || "").split(", "),
            r = i(`${Nr}Delay`),
            o = i(`${Nr}Duration`),
            s = eo(r, o),
            a = i(`${zr}Delay`),
            l = i(`${zr}Duration`),
            c = eo(a, l);
        let d = null,
            u = 0,
            h = 0;
        t === Nr ? s > 0 && (d = Nr, u = s, h = o.length) : t === zr ? c > 0 && (d = zr, u = c, h = l.length) : (u = Math.max(s, c), d = u > 0 ? s > c ? Nr : zr : null, h = d ? d === Nr ? o.length : l.length : 0);
        const p = d === Nr && /\b(transform|all)(,|$)/.test(i(`${Nr}Property`).toString());
        return {
            type: d,
            timeout: u,
            propCount: h,
            hasTransform: p
        }
    }(e, t);
    if (!s) return i();
    const c = s + "end";
    let d = 0;
    const u = () => {
            e.removeEventListener(c, h), o()
        },
        h = t => {
            t.target === e && ++d >= l && u()
        };
    setTimeout((() => {
        d < l && u()
    }), a + 1), e.addEventListener(c, h)
}

function eo(e, t) {
    for (; e.length < t.length;) e = e.concat(e);
    return Math.max(...t.map(((t, n) => to(t) + to(e[n]))))
}

function to(e) {
    return "auto" === e ? 0 : 1e3 * Number(e.slice(0, -1).replace(",", "."))
}
const no = Symbol("_vod"),
    io = Symbol("_vsh"),
    ro = Symbol(""),
    oo = /(^|;)\s*display\s*:/;
const so = /\s*!important$/;

function ao(e, t, n) {
    if (u(n)) n.forEach((n => ao(e, t, n)));
    else if (null == n && (n = ""), t.startsWith("--")) e.setProperty(t, n);
    else {
        const i = function(e, t) {
            const n = co[t];
            if (n) return n;
            let i = S(t);
            if ("filter" !== i && i in e) return co[t] = i;
            i = A(i);
            for (let r = 0; r < lo.length; r++) {
                const n = lo[r] + i;
                if (n in e) return co[t] = n
            }
            return t
        }(e, t);
        so.test(n) ? e.setProperty(L(i), n.replace(so, ""), "important") : e[i] = n
    }
}
const lo = ["Webkit", "Moz", "ms"],
    co = {};
const uo = "http://www.w3.org/1999/xlink";

function ho(e, t, n, i, r, o = U(t)) {
    i && t.startsWith("xlink:") ? null == n ? e.removeAttributeNS(uo, t.slice(6, t.length)) : e.setAttributeNS(uo, t, n) : null == n || o && !q(n) ? e.removeAttribute(t) : e.setAttribute(t, o ? "" : m(n) ? String(n) : n)
}

function po(e, t, n, i) {
    e.addEventListener(t, n, i)
}
const fo = Symbol("_vei");

function go(e, t, n, i, r = null) {
    const o = e[fo] || (e[fo] = {}),
        s = o[t];
    if (i && s) s.value = i;
    else {
        const [n, a] = function(e) {
            let t;
            if (mo.test(e)) {
                let n;
                for (t = {}; n = e.match(mo);) e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0
            }
            const n = ":" === e[2] ? e.slice(3) : L(e.slice(2));
            return [n, t]
        }(t);
        if (i) {
            const s = o[t] = function(e, t) {
                const n = e => {
                    if (e._vts) {
                        if (e._vts <= n.attached) return
                    } else e._vts = Date.now();
                    At(function(e, t) {
                        if (u(t)) {
                            const n = e.stopImmediatePropagation;
                            return e.stopImmediatePropagation = () => {
                                n.call(e), e._stopped = !0
                            }, t.map((e => t => !t._stopped && e && e(t)))
                        }
                        return t
                    }(e, n.value), t, 5, [e])
                };
                return n.value = e, n.attached = bo(), n
            }(i, r);
            po(e, n, s, a)
        } else s && (! function(e, t, n, i) {
            e.removeEventListener(t, n, i)
        }(e, n, s, a), o[t] = void 0)
    }
}
const mo = /(?:Once|Passive|Capture)$/;
let vo = 0;
const yo = Promise.resolve(),
    bo = () => vo || (yo.then((() => vo = 0)), vo = Date.now());
const wo = e => 111 === e.charCodeAt(0) && 110 === e.charCodeAt(1) && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123;
const _o = e => {
    const t = e.props["onUpdate:modelValue"] || !1;
    return u(t) ? e => I(t, e) : t
};

function xo(e) {
    e.target.composing = !0
}

function ko(e) {
    const t = e.target;
    t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")))
}
const Eo = Symbol("_assign"),
    Co = {
        created(e, {
            modifiers: {
                lazy: t,
                trim: n,
                number: i
            }
        }, r) {
            e[Eo] = _o(r);
            const o = i || r.props && "number" === r.props.type;
            po(e, t ? "change" : "input", (t => {
                if (t.target.composing) return;
                let i = e.value;
                n && (i = i.trim()), o && (i = j(i)), e[Eo](i)
            })), n && po(e, "change", (() => {
                e.value = e.value.trim()
            })), t || (po(e, "compositionstart", xo), po(e, "compositionend", ko), po(e, "change", ko))
        },
        mounted(e, {
            value: t
        }) {
            e.value = null == t ? "" : t
        },
        beforeUpdate(e, {
            value: t,
            oldValue: n,
            modifiers: {
                lazy: i,
                trim: r,
                number: o
            }
        }, s) {
            if (e[Eo] = _o(s), e.composing) return;
            const a = null == t ? "" : t;
            if ((!o && "number" !== e.type || /^0\d/.test(e.value) ? e.value : j(e.value)) !== a) {
                if (document.activeElement === e && "range" !== e.type) {
                    if (i && t === n) return;
                    if (r && e.value.trim() === a) return
                }
                e.value = a
            }
        }
    },
    So = ["ctrl", "shift", "alt", "meta"],
    Oo = {
        stop: e => e.stopPropagation(),
        prevent: e => e.preventDefault(),
        self: e => e.target !== e.currentTarget,
        ctrl: e => !e.ctrlKey,
        shift: e => !e.shiftKey,
        alt: e => !e.altKey,
        meta: e => !e.metaKey,
        left: e => "button" in e && 0 !== e.button,
        middle: e => "button" in e && 1 !== e.button,
        right: e => "button" in e && 2 !== e.button,
        exact: (e, t) => So.some((n => e[`${n}Key`] && !t.includes(n)))
    },
    Lo = (e, t) => {
        const n = e._withMods || (e._withMods = {}),
            i = t.join(".");
        return n[i] || (n[i] = (n, ...i) => {
            for (let e = 0; e < t.length; e++) {
                const i = Oo[t[e]];
                if (i && i(n, t)) return
            }
            return e(n, ...i)
        })
    },
    Ao = a({
        patchProp: (e, t, n, i, r, a) => {
            const l = "svg" === r;
            "class" === t ? function(e, t, n) {
                const i = e[Vr];
                i && (t = (t ? [t, ...i] : [...i]).join(" ")), null == t ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t
            }(e, i, l) : "style" === t ? function(e, t, n) {
                const i = e.style,
                    r = g(n);
                let o = !1;
                if (n && !r) {
                    if (t)
                        if (g(t))
                            for (const e of t.split(";")) {
                                const t = e.slice(0, e.indexOf(":")).trim();
                                null == n[t] && ao(i, t, "")
                            } else
                                for (const e in t) null == n[e] && ao(i, e, "");
                    for (const e in n) "display" === e && (o = !0), ao(i, e, n[e])
                } else if (r) {
                    if (t !== n) {
                        const e = i[ro];
                        e && (n += ";" + e), i.cssText = n, o = oo.test(n)
                    }
                } else t && e.removeAttribute("style");
                no in e && (e[no] = o ? i.display : "", e[io] && (i.display = "none"))
            }(e, n, i) : o(t) ? s(t) || go(e, t, 0, i, a) : ("." === t[0] ? (t = t.slice(1), 1) : "^" === t[0] ? (t = t.slice(1), 0) : function(e, t, n, i) {
                if (i) return "innerHTML" === t || "textContent" === t || !!(t in e && wo(t) && f(n));
                if ("spellcheck" === t || "draggable" === t || "translate" === t) return !1;
                if ("form" === t) return !1;
                if ("list" === t && "INPUT" === e.tagName) return !1;
                if ("type" === t && "TEXTAREA" === e.tagName) return !1;
                if ("width" === t || "height" === t) {
                    const t = e.tagName;
                    if ("IMG" === t || "VIDEO" === t || "CANVAS" === t || "SOURCE" === t) return !1
                }
                if (wo(t) && g(n)) return !1;
                if (t in e) return !0;
                if (e._isVueCE && (/[A-Z]/.test(t) || !g(n))) return !0;
                return !1
            }(e, t, i, l)) ? (! function(e, t, n) {
                if ("innerHTML" === t || "textContent" === t) return void(null != n && (e[t] = "innerHTML" === t ? Rr(n) : n));
                const i = e.tagName;
                if ("value" === t && "PROGRESS" !== i && !i.includes("-")) {
                    const r = "OPTION" === i ? e.getAttribute("value") || "" : e.value,
                        o = null == n ? "checkbox" === e.type ? "on" : "" : String(n);
                    return r === o && "_value" in e || (e.value = o), null == n && e.removeAttribute(t), void(e._value = n)
                }
                let r = !1;
                if ("" === n || null == n) {
                    const i = typeof e[t];
                    "boolean" === i ? n = q(n) : null == n && "string" === i ? (n = "", r = !0) : "number" === i && (n = 0, r = !0)
                }
                try {
                    e[t] = n
                } catch (lg) {}
                r && e.removeAttribute(t)
            }(e, t, i), e.tagName.includes("-") || "value" !== t && "checked" !== t && "selected" !== t || ho(e, t, i, l, 0, "value" !== t)) : ("true-value" === t ? e._trueValue = i : "false-value" === t && (e._falseValue = i), ho(e, t, i, l))
        }
    }, Hr);
let Do;
const To = {
    __name: "Skeleton",
    props: {
        mr: {
            type: String,
            required: !1
        },
        width: {
            type: String,
            required: !1
        }
    },
    setup: e => (t, n) => (Gi(), er("div", {
        role: "status",
        class: V(`w-full ${e.mr?"mr-"+e.mr:""} ${e.width?e.width:"max-w-md"} p-4 mb-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700`)
    }, n[0] || (n[0] = [dr('<div class="flex items-center justify-between"><div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div><div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div></div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div></div><div class="flex items-center justify-between pt-4"><div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div><div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div></div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div></div><div class="flex items-center justify-between pt-4"><div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div><div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div></div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div></div><div class="flex items-center justify-between pt-4"><div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div><div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div></div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div></div><div class="flex items-center justify-between pt-4"><div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div><div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div></div><div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div></div><span class="sr-only">Loading...</span>', 6)]), 2))
};

function Io(e, t) {
    return function() {
        return e.apply(t, arguments)
    }
}
const {
    toString: Mo
} = Object.prototype, {
    getPrototypeOf: jo
} = Object, Po = (e => t => {
    const n = Mo.call(t);
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase())
})(Object.create(null)), Ro = e => (e = e.toLowerCase(), t => Po(t) === e), Fo = e => t => typeof t === e, {
    isArray: Bo
} = Array, Ho = Fo("undefined");
const No = Ro("ArrayBuffer");
const zo = Fo("string"),
    Vo = Fo("function"),
    Uo = Fo("number"),
    qo = e => null !== e && "object" == typeof e,
    Wo = e => {
        if ("object" !== Po(e)) return !1;
        const t = jo(e);
        return !(null !== t && t !== Object.prototype && null !== Object.getPrototypeOf(t) || Symbol.toStringTag in e || Symbol.iterator in e)
    },
    Ko = Ro("Date"),
    $o = Ro("File"),
    Yo = Ro("Blob"),
    Jo = Ro("FileList"),
    Go = Ro("URLSearchParams"),
    [Zo, Xo, Qo, es] = ["ReadableStream", "Request", "Response", "Headers"].map(Ro);

function ts(e, t, {
    allOwnKeys: n = !1
} = {}) {
    if (null == e) return;
    let i, r;
    if ("object" != typeof e && (e = [e]), Bo(e))
        for (i = 0, r = e.length; i < r; i++) t.call(null, e[i], i, e);
    else {
        const r = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
            o = r.length;
        let s;
        for (i = 0; i < o; i++) s = r[i], t.call(null, e[s], s, e)
    }
}

function ns(e, t) {
    t = t.toLowerCase();
    const n = Object.keys(e);
    let i, r = n.length;
    for (; r-- > 0;)
        if (i = n[r], t === i.toLowerCase()) return i;
    return null
}
const is = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : global,
    rs = e => !Ho(e) && e !== is;
const os = (e => t => e && t instanceof e)("undefined" != typeof Uint8Array && jo(Uint8Array)),
    ss = Ro("HTMLFormElement"),
    as = (({
        hasOwnProperty: e
    }) => (t, n) => e.call(t, n))(Object.prototype),
    ls = Ro("RegExp"),
    cs = (e, t) => {
        const n = Object.getOwnPropertyDescriptors(e),
            i = {};
        ts(n, ((n, r) => {
            let o;
            !1 !== (o = t(n, r, e)) && (i[r] = o || n)
        })), Object.defineProperties(e, i)
    },
    ds = "abcdefghijklmnopqrstuvwxyz",
    us = "0123456789",
    hs = {
        DIGIT: us,
        ALPHA: ds,
        ALPHA_DIGIT: ds + ds.toUpperCase() + us
    };
const ps = Ro("AsyncFunction"),
    fs = (gs = "function" == typeof setImmediate, ms = Vo(is.postMessage), gs ? setImmediate : ms ? (vs = `axios@${Math.random()}`, ys = [], is.addEventListener("message", (({
        source: e,
        data: t
    }) => {
        e === is && t === vs && ys.length && ys.shift()()
    }), !1), e => {
        ys.push(e), is.postMessage(vs, "*")
    }) : e => setTimeout(e));
var gs, ms, vs, ys;
const bs = "undefined" != typeof queueMicrotask ? queueMicrotask.bind(is) : "undefined" != typeof process && process.nextTick || fs,
    ws = {
        isArray: Bo,
        isArrayBuffer: No,
        isBuffer: function(e) {
            return null !== e && !Ho(e) && null !== e.constructor && !Ho(e.constructor) && Vo(e.constructor.isBuffer) && e.constructor.isBuffer(e)
        },
        isFormData: e => {
            let t;
            return e && ("function" == typeof FormData && e instanceof FormData || Vo(e.append) && ("formdata" === (t = Po(e)) || "object" === t && Vo(e.toString) && "[object FormData]" === e.toString()))
        },
        isArrayBufferView: function(e) {
            let t;
            return t = "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && No(e.buffer), t
        },
        isString: zo,
        isNumber: Uo,
        isBoolean: e => !0 === e || !1 === e,
        isObject: qo,
        isPlainObject: Wo,
        isReadableStream: Zo,
        isRequest: Xo,
        isResponse: Qo,
        isHeaders: es,
        isUndefined: Ho,
        isDate: Ko,
        isFile: $o,
        isBlob: Yo,
        isRegExp: ls,
        isFunction: Vo,
        isStream: e => qo(e) && Vo(e.pipe),
        isURLSearchParams: Go,
        isTypedArray: os,
        isFileList: Jo,
        forEach: ts,
        merge: function e() {
            const {
                caseless: t
            } = rs(this) && this || {}, n = {}, i = (i, r) => {
                const o = t && ns(n, r) || r;
                Wo(n[o]) && Wo(i) ? n[o] = e(n[o], i) : Wo(i) ? n[o] = e({}, i) : Bo(i) ? n[o] = i.slice() : n[o] = i
            };
            for (let r = 0, o = arguments.length; r < o; r++) arguments[r] && ts(arguments[r], i);
            return n
        },
        extend: (e, t, n, {
            allOwnKeys: i
        } = {}) => (ts(t, ((t, i) => {
            n && Vo(t) ? e[i] = Io(t, n) : e[i] = t
        }), {
            allOwnKeys: i
        }), e),
        trim: e => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""),
        stripBOM: e => (65279 === e.charCodeAt(0) && (e = e.slice(1)), e),
        inherits: (e, t, n, i) => {
            e.prototype = Object.create(t.prototype, i), e.prototype.constructor = e, Object.defineProperty(e, "super", {
                value: t.prototype
            }), n && Object.assign(e.prototype, n)
        },
        toFlatObject: (e, t, n, i) => {
            let r, o, s;
            const a = {};
            if (t = t || {}, null == e) return t;
            do {
                for (r = Object.getOwnPropertyNames(e), o = r.length; o-- > 0;) s = r[o], i && !i(s, e, t) || a[s] || (t[s] = e[s], a[s] = !0);
                e = !1 !== n && jo(e)
            } while (e && (!n || n(e, t)) && e !== Object.prototype);
            return t
        },
        kindOf: Po,
        kindOfTest: Ro,
        endsWith: (e, t, n) => {
            e = String(e), (void 0 === n || n > e.length) && (n = e.length), n -= t.length;
            const i = e.indexOf(t, n);
            return -1 !== i && i === n
        },
        toArray: e => {
            if (!e) return null;
            if (Bo(e)) return e;
            let t = e.length;
            if (!Uo(t)) return null;
            const n = new Array(t);
            for (; t-- > 0;) n[t] = e[t];
            return n
        },
        forEachEntry: (e, t) => {
            const n = (e && e[Symbol.iterator]).call(e);
            let i;
            for (;
                (i = n.next()) && !i.done;) {
                const n = i.value;
                t.call(e, n[0], n[1])
            }
        },
        matchAll: (e, t) => {
            let n;
            const i = [];
            for (; null !== (n = e.exec(t));) i.push(n);
            return i
        },
        isHTMLForm: ss,
        hasOwnProperty: as,
        hasOwnProp: as,
        reduceDescriptors: cs,
        freezeMethods: e => {
            cs(e, ((t, n) => {
                if (Vo(e) && -1 !== ["arguments", "caller", "callee"].indexOf(n)) return !1;
                const i = e[n];
                Vo(i) && (t.enumerable = !1, "writable" in t ? t.writable = !1 : t.set || (t.set = () => {
                    throw Error("Can not rewrite read-only method '" + n + "'")
                }))
            }))
        },
        toObjectSet: (e, t) => {
            const n = {},
                i = e => {
                    e.forEach((e => {
                        n[e] = !0
                    }))
                };
            return Bo(e) ? i(e) : i(String(e).split(t)), n
        },
        toCamelCase: e => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, (function(e, t, n) {
            return t.toUpperCase() + n
        })),
        noop: () => {},
        toFiniteNumber: (e, t) => null != e && Number.isFinite(e = +e) ? e : t,
        findKey: ns,
        global: is,
        isContextDefined: rs,
        ALPHABET: hs,
        generateString: (e = 16, t = hs.ALPHA_DIGIT) => {
            let n = "";
            const {
                length: i
            } = t;
            for (; e--;) n += t[Math.random() * i | 0];
            return n
        },
        isSpecCompliantForm: function(e) {
            return !!(e && Vo(e.append) && "FormData" === e[Symbol.toStringTag] && e[Symbol.iterator])
        },
        toJSONObject: e => {
            const t = new Array(10),
                n = (e, i) => {
                    if (qo(e)) {
                        if (t.indexOf(e) >= 0) return;
                        if (!("toJSON" in e)) {
                            t[i] = e;
                            const r = Bo(e) ? [] : {};
                            return ts(e, ((e, t) => {
                                const o = n(e, i + 1);
                                !Ho(o) && (r[t] = o)
                            })), t[i] = void 0, r
                        }
                    }
                    return e
                };
            return n(e, 0)
        },
        isAsyncFn: ps,
        isThenable: e => e && (qo(e) || Vo(e)) && Vo(e.then) && Vo(e.catch),
        setImmediate: fs,
        asap: bs
    };

function _s(e, t, n, i, r) {
    Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (new Error).stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), i && (this.request = i), r && (this.response = r, this.status = r.status ? r.status : null)
}
ws.inherits(_s, Error, {
    toJSON: function() {
        return {
            message: this.message,
            name: this.name,
            description: this.description,
            number: this.number,
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            config: ws.toJSONObject(this.config),
            code: this.code,
            status: this.status
        }
    }
});
const xs = _s.prototype,
    ks = {};
["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED", "ERR_NOT_SUPPORT", "ERR_INVALID_URL"].forEach((e => {
    ks[e] = {
        value: e
    }
})), Object.defineProperties(_s, ks), Object.defineProperty(xs, "isAxiosError", {
    value: !0
}), _s.from = (e, t, n, i, r, o) => {
    const s = Object.create(xs);
    return ws.toFlatObject(e, s, (function(e) {
        return e !== Error.prototype
    }), (e => "isAxiosError" !== e)), _s.call(s, e.message, t, n, i, r), s.cause = e, s.name = e.name, o && Object.assign(s, o), s
};

function Es(e) {
    return ws.isPlainObject(e) || ws.isArray(e)
}

function Cs(e) {
    return ws.endsWith(e, "[]") ? e.slice(0, -2) : e
}

function Ss(e, t, n) {
    return e ? e.concat(t).map((function(e, t) {
        return e = Cs(e), !n && t ? "[" + e + "]" : e
    })).join(n ? "." : "") : t
}
const Os = ws.toFlatObject(ws, {}, null, (function(e) {
    return /^is[A-Z]/.test(e)
}));

function Ls(e, t, n) {
    if (!ws.isObject(e)) throw new TypeError("target must be an object");
    t = t || new FormData;
    const i = (n = ws.toFlatObject(n, {
            metaTokens: !0,
            dots: !1,
            indexes: !1
        }, !1, (function(e, t) {
            return !ws.isUndefined(t[e])
        }))).metaTokens,
        r = n.visitor || c,
        o = n.dots,
        s = n.indexes,
        a = (n.Blob || "undefined" != typeof Blob && Blob) && ws.isSpecCompliantForm(t);
    if (!ws.isFunction(r)) throw new TypeError("visitor must be a function");

    function l(e) {
        if (null === e) return "";
        if (ws.isDate(e)) return e.toISOString();
        if (!a && ws.isBlob(e)) throw new _s("Blob is not supported. Use a Buffer instead.");
        return ws.isArrayBuffer(e) || ws.isTypedArray(e) ? a && "function" == typeof Blob ? new Blob([e]) : Buffer.from(e) : e
    }

    function c(e, n, r) {
        let a = e;
        if (e && !r && "object" == typeof e)
            if (ws.endsWith(n, "{}")) n = i ? n : n.slice(0, -2), e = JSON.stringify(e);
            else if (ws.isArray(e) && function(e) {
                return ws.isArray(e) && !e.some(Es)
            }(e) || (ws.isFileList(e) || ws.endsWith(n, "[]")) && (a = ws.toArray(e))) return n = Cs(n), a.forEach((function(e, i) {
            !ws.isUndefined(e) && null !== e && t.append(!0 === s ? Ss([n], i, o) : null === s ? n : n + "[]", l(e))
        })), !1;
        return !!Es(e) || (t.append(Ss(r, n, o), l(e)), !1)
    }
    const d = [],
        u = Object.assign(Os, {
            defaultVisitor: c,
            convertValue: l,
            isVisitable: Es
        });
    if (!ws.isObject(e)) throw new TypeError("data must be an object");
    return function e(n, i) {
        if (!ws.isUndefined(n)) {
            if (-1 !== d.indexOf(n)) throw Error("Circular reference detected in " + i.join("."));
            d.push(n), ws.forEach(n, (function(n, o) {
                !0 === (!(ws.isUndefined(n) || null === n) && r.call(t, n, ws.isString(o) ? o.trim() : o, i, u)) && e(n, i ? i.concat(o) : [o])
            })), d.pop()
        }
    }(e), t
}

function As(e) {
    const t = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\0"
    };
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, (function(e) {
        return t[e]
    }))
}

function Ds(e, t) {
    this._pairs = [], e && Ls(e, this, t)
}
const Ts = Ds.prototype;

function Is(e) {
    return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]")
}

function Ms(e, t, n) {
    if (!t) return e;
    const i = n && n.encode || Is,
        r = n && n.serialize;
    let o;
    if (o = r ? r(t, n) : ws.isURLSearchParams(t) ? t.toString() : new Ds(t, n).toString(i), o) {
        const t = e.indexOf("#"); - 1 !== t && (e = e.slice(0, t)), e += (-1 === e.indexOf("?") ? "?" : "&") + o
    }
    return e
}
Ts.append = function(e, t) {
    this._pairs.push([e, t])
}, Ts.toString = function(e) {
    const t = e ? function(t) {
        return e.call(this, t, As)
    } : As;
    return this._pairs.map((function(e) {
        return t(e[0]) + "=" + t(e[1])
    }), "").join("&")
};
class InterceptorManager {
    constructor() {
        this.handlers = []
    }
    use(e, t, n) {
        return this.handlers.push({
            fulfilled: e,
            rejected: t,
            synchronous: !!n && n.synchronous,
            runWhen: n ? n.runWhen : null
        }), this.handlers.length - 1
    }
    eject(e) {
        this.handlers[e] && (this.handlers[e] = null)
    }
    clear() {
        this.handlers && (this.handlers = [])
    }
    forEach(e) {
        ws.forEach(this.handlers, (function(t) {
            null !== t && e(t)
        }))
    }
}
const js = {
        silentJSONParsing: !0,
        forcedJSONParsing: !0,
        clarifyTimeoutError: !1
    },
    Ps = {
        isBrowser: !0,
        classes: {
            URLSearchParams: "undefined" != typeof URLSearchParams ? URLSearchParams : Ds,
            FormData: "undefined" != typeof FormData ? FormData : null,
            Blob: "undefined" != typeof Blob ? Blob : null
        },
        protocols: ["http", "https", "file", "blob", "url", "data"]
    },
    Rs = "undefined" != typeof window && "undefined" != typeof document,
    Fs = "object" == typeof navigator && navigator || void 0,
    Bs = Rs && (!Fs || ["ReactNative", "NativeScript", "NS"].indexOf(Fs.product) < 0),
    Hs = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && "function" == typeof self.importScripts,
    Ns = Rs && window.location.href || "http://localhost",
    zs = {
        ...Object.freeze(Object.defineProperty({
            __proto__: null,
            hasBrowserEnv: Rs,
            hasStandardBrowserEnv: Bs,
            hasStandardBrowserWebWorkerEnv: Hs,
            navigator: Fs,
            origin: Ns
        }, Symbol.toStringTag, {
            value: "Module"
        })),
        ...Ps
    };

function Vs(e) {
    function t(e, n, i, r) {
        let o = e[r++];
        if ("__proto__" === o) return !0;
        const s = Number.isFinite(+o),
            a = r >= e.length;
        if (o = !o && ws.isArray(i) ? i.length : o, a) return ws.hasOwnProp(i, o) ? i[o] = [i[o], n] : i[o] = n, !s;
        i[o] && ws.isObject(i[o]) || (i[o] = []);
        return t(e, n, i[o], r) && ws.isArray(i[o]) && (i[o] = function(e) {
            const t = {},
                n = Object.keys(e);
            let i;
            const r = n.length;
            let o;
            for (i = 0; i < r; i++) o = n[i], t[o] = e[o];
            return t
        }(i[o])), !s
    }
    if (ws.isFormData(e) && ws.isFunction(e.entries)) {
        const n = {};
        return ws.forEachEntry(e, ((e, i) => {
            t(function(e) {
                return ws.matchAll(/\w+|\[(\w*)]/g, e).map((e => "[]" === e[0] ? "" : e[1] || e[0]))
            }(e), i, n, 0)
        })), n
    }
    return null
}
const Us = {
    transitional: js,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function(e, t) {
        const n = t.getContentType() || "",
            i = n.indexOf("application/json") > -1,
            r = ws.isObject(e);
        r && ws.isHTMLForm(e) && (e = new FormData(e));
        if (ws.isFormData(e)) return i ? JSON.stringify(Vs(e)) : e;
        if (ws.isArrayBuffer(e) || ws.isBuffer(e) || ws.isStream(e) || ws.isFile(e) || ws.isBlob(e) || ws.isReadableStream(e)) return e;
        if (ws.isArrayBufferView(e)) return e.buffer;
        if (ws.isURLSearchParams(e)) return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
        let o;
        if (r) {
            if (n.indexOf("application/x-www-form-urlencoded") > -1) return function(e, t) {
                return Ls(e, new zs.classes.URLSearchParams, Object.assign({
                    visitor: function(e, t, n, i) {
                        return zs.isNode && ws.isBuffer(e) ? (this.append(t, e.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments)
                    }
                }, t))
            }(e, this.formSerializer).toString();
            if ((o = ws.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
                const t = this.env && this.env.FormData;
                return Ls(o ? {
                    "files[]": e
                } : e, t && new t, this.formSerializer)
            }
        }
        return r || i ? (t.setContentType("application/json", !1), function(e, t) {
            if (ws.isString(e)) try {
                return (t || JSON.parse)(e), ws.trim(e)
            } catch (lg) {
                if ("SyntaxError" !== lg.name) throw lg
            }
            return (0, JSON.stringify)(e)
        }(e)) : e
    }],
    transformResponse: [function(e) {
        const t = this.transitional || Us.transitional,
            n = t && t.forcedJSONParsing,
            i = "json" === this.responseType;
        if (ws.isResponse(e) || ws.isReadableStream(e)) return e;
        if (e && ws.isString(e) && (n && !this.responseType || i)) {
            const n = !(t && t.silentJSONParsing) && i;
            try {
                return JSON.parse(e)
            } catch (lg) {
                if (n) {
                    if ("SyntaxError" === lg.name) throw _s.from(lg, _s.ERR_BAD_RESPONSE, this, null, this.response);
                    throw lg
                }
            }
        }
        return e
    }],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
        FormData: zs.classes.FormData,
        Blob: zs.classes.Blob
    },
    validateStatus: function(e) {
        return e >= 200 && e < 300
    },
    headers: {
        common: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": void 0
        }
    }
};
ws.forEach(["delete", "get", "head", "post", "put", "patch"], (e => {
    Us.headers[e] = {}
}));
const qs = ws.toObjectSet(["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"]),
    Ws = Symbol("internals");

function Ks(e) {
    return e && String(e).trim().toLowerCase()
}

function $s(e) {
    return !1 === e || null == e ? e : ws.isArray(e) ? e.map($s) : String(e)
}

function Ys(e, t, n, i, r) {
    return ws.isFunction(i) ? i.call(this, t, n) : (r && (t = n), ws.isString(t) ? ws.isString(i) ? -1 !== t.indexOf(i) : ws.isRegExp(i) ? i.test(t) : void 0 : void 0)
}
class AxiosHeaders {
    constructor(e) {
        e && this.set(e)
    }
    set(e, t, n) {
        const i = this;

        function r(e, t, n) {
            const r = Ks(t);
            if (!r) throw new Error("header name must be a non-empty string");
            const o = ws.findKey(i, r);
            (!o || void 0 === i[o] || !0 === n || void 0 === n && !1 !== i[o]) && (i[o || t] = $s(e))
        }
        const o = (e, t) => ws.forEach(e, ((e, n) => r(e, n, t)));
        if (ws.isPlainObject(e) || e instanceof this.constructor) o(e, t);
        else if (ws.isString(e) && (e = e.trim()) && !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())) o((e => {
            const t = {};
            let n, i, r;
            return e && e.split("\n").forEach((function(e) {
                r = e.indexOf(":"), n = e.substring(0, r).trim().toLowerCase(), i = e.substring(r + 1).trim(), !n || t[n] && qs[n] || ("set-cookie" === n ? t[n] ? t[n].push(i) : t[n] = [i] : t[n] = t[n] ? t[n] + ", " + i : i)
            })), t
        })(e), t);
        else if (ws.isHeaders(e))
            for (const [s, a] of e.entries()) r(a, s, n);
        else null != e && r(t, e, n);
        return this
    }
    get(e, t) {
        if (e = Ks(e)) {
            const n = ws.findKey(this, e);
            if (n) {
                const e = this[n];
                if (!t) return e;
                if (!0 === t) return function(e) {
                    const t = Object.create(null),
                        n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
                    let i;
                    for (; i = n.exec(e);) t[i[1]] = i[2];
                    return t
                }(e);
                if (ws.isFunction(t)) return t.call(this, e, n);
                if (ws.isRegExp(t)) return t.exec(e);
                throw new TypeError("parser must be boolean|regexp|function")
            }
        }
    }
    has(e, t) {
        if (e = Ks(e)) {
            const n = ws.findKey(this, e);
            return !(!n || void 0 === this[n] || t && !Ys(0, this[n], n, t))
        }
        return !1
    }
    delete(e, t) {
        const n = this;
        let i = !1;

        function r(e) {
            if (e = Ks(e)) {
                const r = ws.findKey(n, e);
                !r || t && !Ys(0, n[r], r, t) || (delete n[r], i = !0)
            }
        }
        return ws.isArray(e) ? e.forEach(r) : r(e), i
    }
    clear(e) {
        const t = Object.keys(this);
        let n = t.length,
            i = !1;
        for (; n--;) {
            const r = t[n];
            e && !Ys(0, this[r], r, e, !0) || (delete this[r], i = !0)
        }
        return i
    }
    normalize(e) {
        const t = this,
            n = {};
        return ws.forEach(this, ((i, r) => {
            const o = ws.findKey(n, r);
            if (o) return t[o] = $s(i), void delete t[r];
            const s = e ? function(e) {
                return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, ((e, t, n) => t.toUpperCase() + n))
            }(r) : String(r).trim();
            s !== r && delete t[r], t[s] = $s(i), n[s] = !0
        })), this
    }
    concat(...e) {
        return this.constructor.concat(this, ...e)
    }
    toJSON(e) {
        const t = Object.create(null);
        return ws.forEach(this, ((n, i) => {
            null != n && !1 !== n && (t[i] = e && ws.isArray(n) ? n.join(", ") : n)
        })), t
    } [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]()
    }
    toString() {
        return Object.entries(this.toJSON()).map((([e, t]) => e + ": " + t)).join("\n")
    }
    get[Symbol.toStringTag]() {
        return "AxiosHeaders"
    }
    static from(e) {
        return e instanceof this ? e : new this(e)
    }
    static concat(e, ...t) {
        const n = new this(e);
        return t.forEach((e => n.set(e))), n
    }
    static accessor(e) {
        const t = (this[Ws] = this[Ws] = {
                accessors: {}
            }).accessors,
            n = this.prototype;

        function i(e) {
            const i = Ks(e);
            t[i] || (! function(e, t) {
                const n = ws.toCamelCase(" " + t);
                ["get", "set", "has"].forEach((i => {
                    Object.defineProperty(e, i + n, {
                        value: function(e, n, r) {
                            return this[i].call(this, t, e, n, r)
                        },
                        configurable: !0
                    })
                }))
            }(n, e), t[i] = !0)
        }
        return ws.isArray(e) ? e.forEach(i) : i(e), this
    }
}

function Js(e, t) {
    const n = this || Us,
        i = t || n,
        r = AxiosHeaders.from(i.headers);
    let o = i.data;
    return ws.forEach(e, (function(e) {
        o = e.call(n, o, r.normalize(), t ? t.status : void 0)
    })), r.normalize(), o
}

function Gs(e) {
    return !(!e || !e.__CANCEL__)
}

function Zs(e, t, n) {
    _s.call(this, null == e ? "canceled" : e, _s.ERR_CANCELED, t, n), this.name = "CanceledError"
}

function Xs(e, t, n) {
    const i = n.config.validateStatus;
    n.status && i && !i(n.status) ? t(new _s("Request failed with status code " + n.status, [_s.ERR_BAD_REQUEST, _s.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4], n.config, n.request, n)) : e(n)
}
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]), ws.reduceDescriptors(AxiosHeaders.prototype, (({
    value: e
}, t) => {
    let n = t[0].toUpperCase() + t.slice(1);
    return {
        get: () => e,
        set(e) {
            this[n] = e
        }
    }
})), ws.freezeMethods(AxiosHeaders), ws.inherits(Zs, _s, {
    __CANCEL__: !0
});
const Qs = (e, t, n = 3) => {
        let i = 0;
        const r = function(e, t) {
            e = e || 10;
            const n = new Array(e),
                i = new Array(e);
            let r, o = 0,
                s = 0;
            return t = void 0 !== t ? t : 1e3,
                function(a) {
                    const l = Date.now(),
                        c = i[s];
                    r || (r = l), n[o] = a, i[o] = l;
                    let d = s,
                        u = 0;
                    for (; d !== o;) u += n[d++], d %= e;
                    if (o = (o + 1) % e, o === s && (s = (s + 1) % e), l - r < t) return;
                    const h = c && l - c;
                    return h ? Math.round(1e3 * u / h) : void 0
                }
        }(50, 250);
        return function(e, t) {
            let n, i, r = 0,
                o = 1e3 / t;
            const s = (t, o = Date.now()) => {
                r = o, n = null, i && (clearTimeout(i), i = null), e.apply(null, t)
            };
            return [(...e) => {
                const t = Date.now(),
                    a = t - r;
                a >= o ? s(e, t) : (n = e, i || (i = setTimeout((() => {
                    i = null, s(n)
                }), o - a)))
            }, () => n && s(n)]
        }((n => {
            const o = n.loaded,
                s = n.lengthComputable ? n.total : void 0,
                a = o - i,
                l = r(a);
            i = o;
            e({
                loaded: o,
                total: s,
                progress: s ? o / s : void 0,
                bytes: a,
                rate: l || void 0,
                estimated: l && s && o <= s ? (s - o) / l : void 0,
                event: n,
                lengthComputable: null != s,
                [t ? "download" : "upload"]: !0
            })
        }), n)
    },
    ea = (e, t) => {
        const n = null != e;
        return [i => t[0]({
            lengthComputable: n,
            total: e,
            loaded: i
        }), t[1]]
    },
    ta = e => (...t) => ws.asap((() => e(...t))),
    na = zs.hasStandardBrowserEnv ? function() {
        const e = zs.navigator && /(msie|trident)/i.test(zs.navigator.userAgent),
            t = document.createElement("a");
        let n;

        function i(n) {
            let i = n;
            return e && (t.setAttribute("href", i), i = t.href), t.setAttribute("href", i), {
                href: t.href,
                protocol: t.protocol ? t.protocol.replace(/:$/, "") : "",
                host: t.host,
                search: t.search ? t.search.replace(/^\?/, "") : "",
                hash: t.hash ? t.hash.replace(/^#/, "") : "",
                hostname: t.hostname,
                port: t.port,
                pathname: "/" === t.pathname.charAt(0) ? t.pathname : "/" + t.pathname
            }
        }
        return n = i(window.location.href),
            function(e) {
                const t = ws.isString(e) ? i(e) : e;
                return t.protocol === n.protocol && t.host === n.host
            }
    }() : function() {
        return function() {
            return !0
        }
    }(),
    ia = zs.hasStandardBrowserEnv ? {
        write(e, t, n, i, r, o) {
            const s = [e + "=" + encodeURIComponent(t)];
            ws.isNumber(n) && s.push("expires=" + new Date(n).toGMTString()), ws.isString(i) && s.push("path=" + i), ws.isString(r) && s.push("domain=" + r), !0 === o && s.push("secure"), document.cookie = s.join("; ")
        },
        read(e) {
            const t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
            return t ? decodeURIComponent(t[3]) : null
        },
        remove(e) {
            this.write(e, "", Date.now() - 864e5)
        }
    } : {
        write() {},
        read: () => null,
        remove() {}
    };

function ra(e, t) {
    return e && !/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t) ? function(e, t) {
        return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e
    }(e, t) : t
}
const oa = e => e instanceof AxiosHeaders ? {
    ...e
} : e;

function sa(e, t) {
    t = t || {};
    const n = {};

    function i(e, t, n) {
        return ws.isPlainObject(e) && ws.isPlainObject(t) ? ws.merge.call({
            caseless: n
        }, e, t) : ws.isPlainObject(t) ? ws.merge({}, t) : ws.isArray(t) ? t.slice() : t
    }

    function r(e, t, n) {
        return ws.isUndefined(t) ? ws.isUndefined(e) ? void 0 : i(void 0, e, n) : i(e, t, n)
    }

    function o(e, t) {
        if (!ws.isUndefined(t)) return i(void 0, t)
    }

    function s(e, t) {
        return ws.isUndefined(t) ? ws.isUndefined(e) ? void 0 : i(void 0, e) : i(void 0, t)
    }

    function a(n, r, o) {
        return o in t ? i(n, r) : o in e ? i(void 0, n) : void 0
    }
    const l = {
        url: o,
        method: o,
        data: o,
        baseURL: s,
        transformRequest: s,
        transformResponse: s,
        paramsSerializer: s,
        timeout: s,
        timeoutMessage: s,
        withCredentials: s,
        withXSRFToken: s,
        adapter: s,
        responseType: s,
        xsrfCookieName: s,
        xsrfHeaderName: s,
        onUploadProgress: s,
        onDownloadProgress: s,
        decompress: s,
        maxContentLength: s,
        maxBodyLength: s,
        beforeRedirect: s,
        transport: s,
        httpAgent: s,
        httpsAgent: s,
        cancelToken: s,
        socketPath: s,
        responseEncoding: s,
        validateStatus: a,
        headers: (e, t) => r(oa(e), oa(t), !0)
    };
    return ws.forEach(Object.keys(Object.assign({}, e, t)), (function(i) {
        const o = l[i] || r,
            s = o(e[i], t[i], i);
        ws.isUndefined(s) && o !== a || (n[i] = s)
    })), n
}
const aa = e => {
        const t = sa({}, e);
        let n, {
            data: i,
            withXSRFToken: r,
            xsrfHeaderName: o,
            xsrfCookieName: s,
            headers: a,
            auth: l
        } = t;
        if (t.headers = a = AxiosHeaders.from(a), t.url = Ms(ra(t.baseURL, t.url), e.params, e.paramsSerializer), l && a.set("Authorization", "Basic " + btoa((l.username || "") + ":" + (l.password ? unescape(encodeURIComponent(l.password)) : ""))), ws.isFormData(i))
            if (zs.hasStandardBrowserEnv || zs.hasStandardBrowserWebWorkerEnv) a.setContentType(void 0);
            else if (!1 !== (n = a.getContentType())) {
            const [e, ...t] = n ? n.split(";").map((e => e.trim())).filter(Boolean) : [];
            a.setContentType([e || "multipart/form-data", ...t].join("; "))
        }
        if (zs.hasStandardBrowserEnv && (r && ws.isFunction(r) && (r = r(t)), r || !1 !== r && na(t.url))) {
            const e = o && s && ia.read(s);
            e && a.set(o, e)
        }
        return t
    },
    la = "undefined" != typeof XMLHttpRequest && function(e) {
        return new Promise((function(t, n) {
            const i = aa(e);
            let r = i.data;
            const o = AxiosHeaders.from(i.headers).normalize();
            let s, a, l, c, d, {
                responseType: u,
                onUploadProgress: h,
                onDownloadProgress: p
            } = i;

            function f() {
                c && c(), d && d(), i.cancelToken && i.cancelToken.unsubscribe(s), i.signal && i.signal.removeEventListener("abort", s)
            }
            let g = new XMLHttpRequest;

            function m() {
                if (!g) return;
                const i = AxiosHeaders.from("getAllResponseHeaders" in g && g.getAllResponseHeaders());
                Xs((function(e) {
                    t(e), f()
                }), (function(e) {
                    n(e), f()
                }), {
                    data: u && "text" !== u && "json" !== u ? g.response : g.responseText,
                    status: g.status,
                    statusText: g.statusText,
                    headers: i,
                    config: e,
                    request: g
                }), g = null
            }
            g.open(i.method.toUpperCase(), i.url, !0), g.timeout = i.timeout, "onloadend" in g ? g.onloadend = m : g.onreadystatechange = function() {
                g && 4 === g.readyState && (0 !== g.status || g.responseURL && 0 === g.responseURL.indexOf("file:")) && setTimeout(m)
            }, g.onabort = function() {
                g && (n(new _s("Request aborted", _s.ECONNABORTED, e, g)), g = null)
            }, g.onerror = function() {
                n(new _s("Network Error", _s.ERR_NETWORK, e, g)), g = null
            }, g.ontimeout = function() {
                let t = i.timeout ? "timeout of " + i.timeout + "ms exceeded" : "timeout exceeded";
                const r = i.transitional || js;
                i.timeoutErrorMessage && (t = i.timeoutErrorMessage), n(new _s(t, r.clarifyTimeoutError ? _s.ETIMEDOUT : _s.ECONNABORTED, e, g)), g = null
            }, void 0 === r && o.setContentType(null), "setRequestHeader" in g && ws.forEach(o.toJSON(), (function(e, t) {
                g.setRequestHeader(t, e)
            })), ws.isUndefined(i.withCredentials) || (g.withCredentials = !!i.withCredentials), u && "json" !== u && (g.responseType = i.responseType), p && ([l, d] = Qs(p, !0), g.addEventListener("progress", l)), h && g.upload && ([a, c] = Qs(h), g.upload.addEventListener("progress", a), g.upload.addEventListener("loadend", c)), (i.cancelToken || i.signal) && (s = t => {
                g && (n(!t || t.type ? new Zs(null, e, g) : t), g.abort(), g = null)
            }, i.cancelToken && i.cancelToken.subscribe(s), i.signal && (i.signal.aborted ? s() : i.signal.addEventListener("abort", s)));
            const v = function(e) {
                const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
                return t && t[1] || ""
            }(i.url);
            v && -1 === zs.protocols.indexOf(v) ? n(new _s("Unsupported protocol " + v + ":", _s.ERR_BAD_REQUEST, e)) : g.send(r || null)
        }))
    },
    ca = (e, t) => {
        const {
            length: n
        } = e = e ? e.filter(Boolean) : [];
        if (t || n) {
            let n, i = new AbortController;
            const r = function(e) {
                if (!n) {
                    n = !0, s();
                    const t = e instanceof Error ? e : this.reason;
                    i.abort(t instanceof _s ? t : new Zs(t instanceof Error ? t.message : t))
                }
            };
            let o = t && setTimeout((() => {
                o = null, r(new _s(`timeout ${t} of ms exceeded`, _s.ETIMEDOUT))
            }), t);
            const s = () => {
                e && (o && clearTimeout(o), o = null, e.forEach((e => {
                    e.unsubscribe ? e.unsubscribe(r) : e.removeEventListener("abort", r)
                })), e = null)
            };
            e.forEach((e => e.addEventListener("abort", r)));
            const {
                signal: a
            } = i;
            return a.unsubscribe = () => ws.asap(s), a
        }
    },
    da = function*(e, t) {
        let n = e.byteLength;
        if (n < t) return void(yield e);
        let i, r = 0;
        for (; r < n;) i = r + t, yield e.slice(r, i), r = i
    },
    ua = async function*(e) {
        if (e[Symbol.asyncIterator]) return void(yield* e);
        const t = e.getReader();
        try {
            for (;;) {
                const {
                    done: e,
                    value: n
                } = await t.read();
                if (e) break;
                yield n
            }
        } finally {
            await t.cancel()
        }
    }, ha = (e, t, n, i) => {
        const r = async function*(e, t) {
            for await (const n of ua(e)) yield* da(n, t)
        }(e, t);
        let o, s = 0,
            a = e => {
                o || (o = !0, i && i(e))
            };
        return new ReadableStream({
            async pull(e) {
                try {
                    const {
                        done: t,
                        value: i
                    } = await r.next();
                    if (t) return a(), void e.close();
                    let o = i.byteLength;
                    if (n) {
                        let e = s += o;
                        n(e)
                    }
                    e.enqueue(new Uint8Array(i))
                } catch (t) {
                    throw a(t), t
                }
            },
            cancel: e => (a(e), r.return())
        }, {
            highWaterMark: 2
        })
    }, pa = "function" == typeof fetch && "function" == typeof Request && "function" == typeof Response, fa = pa && "function" == typeof ReadableStream, ga = pa && ("function" == typeof TextEncoder ? (e => t => e.encode(t))(new TextEncoder) : async e => new Uint8Array(await new Response(e).arrayBuffer())), ma = (e, ...t) => {
        try {
            return !!e(...t)
        } catch (lg) {
            return !1
        }
    }, va = fa && ma((() => {
        let e = !1;
        const t = new Request(zs.origin, {
            body: new ReadableStream,
            method: "POST",
            get duplex() {
                return e = !0, "half"
            }
        }).headers.has("Content-Type");
        return e && !t
    })), ya = fa && ma((() => ws.isReadableStream(new Response("").body))), ba = {
        stream: ya && (e => e.body)
    };
var wa;
pa && (wa = new Response, ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e => {
    !ba[e] && (ba[e] = ws.isFunction(wa[e]) ? t => t[e]() : (t, n) => {
        throw new _s(`Response type '${e}' is not supported`, _s.ERR_NOT_SUPPORT, n)
    })
})));
const _a = async (e, t) => {
    const n = ws.toFiniteNumber(e.getContentLength());
    return null == n ? (async e => {
        if (null == e) return 0;
        if (ws.isBlob(e)) return e.size;
        if (ws.isSpecCompliantForm(e)) {
            const t = new Request(zs.origin, {
                method: "POST",
                body: e
            });
            return (await t.arrayBuffer()).byteLength
        }
        return ws.isArrayBufferView(e) || ws.isArrayBuffer(e) ? e.byteLength : (ws.isURLSearchParams(e) && (e += ""), ws.isString(e) ? (await ga(e)).byteLength : void 0)
    })(t) : n
}, xa = {
    http: null,
    xhr: la,
    fetch: pa && (async e => {
        let {
            url: t,
            method: n,
            data: i,
            signal: r,
            cancelToken: o,
            timeout: s,
            onDownloadProgress: a,
            onUploadProgress: l,
            responseType: c,
            headers: d,
            withCredentials: u = "same-origin",
            fetchOptions: h
        } = aa(e);
        c = c ? (c + "").toLowerCase() : "text";
        let p, f = ca([r, o && o.toAbortSignal()], s);
        const g = f && f.unsubscribe && (() => {
            f.unsubscribe()
        });
        let m;
        try {
            if (l && va && "get" !== n && "head" !== n && 0 !== (m = await _a(d, i))) {
                let e, n = new Request(t, {
                    method: "POST",
                    body: i,
                    duplex: "half"
                });
                if (ws.isFormData(i) && (e = n.headers.get("content-type")) && d.setContentType(e), n.body) {
                    const [e, t] = ea(m, Qs(ta(l)));
                    i = ha(n.body, 65536, e, t)
                }
            }
            ws.isString(u) || (u = u ? "include" : "omit");
            const r = "credentials" in Request.prototype;
            p = new Request(t, {
                ...h,
                signal: f,
                method: n.toUpperCase(),
                headers: d.normalize().toJSON(),
                body: i,
                duplex: "half",
                credentials: r ? u : void 0
            });
            let o = await fetch(p);
            const s = ya && ("stream" === c || "response" === c);
            if (ya && (a || s && g)) {
                const e = {};
                ["status", "statusText", "headers"].forEach((t => {
                    e[t] = o[t]
                }));
                const t = ws.toFiniteNumber(o.headers.get("content-length")),
                    [n, i] = a && ea(t, Qs(ta(a), !0)) || [];
                o = new Response(ha(o.body, 65536, n, (() => {
                    i && i(), g && g()
                })), e)
            }
            c = c || "text";
            let v = await ba[ws.findKey(ba, c) || "text"](o, e);
            return !s && g && g(), await new Promise(((t, n) => {
                Xs(t, n, {
                    data: v,
                    headers: AxiosHeaders.from(o.headers),
                    status: o.status,
                    statusText: o.statusText,
                    config: e,
                    request: p
                })
            }))
        } catch (v) {
            if (g && g(), v && "TypeError" === v.name && /fetch/i.test(v.message)) throw Object.assign(new _s("Network Error", _s.ERR_NETWORK, e, p), {
                cause: v.cause || v
            });
            throw _s.from(v, v && v.code, e, p)
        }
    })
};
ws.forEach(xa, ((e, t) => {
    if (e) {
        try {
            Object.defineProperty(e, "name", {
                value: t
            })
        } catch (lg) {}
        Object.defineProperty(e, "adapterName", {
            value: t
        })
    }
}));
const ka = e => `- ${e}`,
    Ea = e => ws.isFunction(e) || null === e || !1 === e,
    Ca = e => {
        e = ws.isArray(e) ? e : [e];
        const {
            length: t
        } = e;
        let n, i;
        const r = {};
        for (let o = 0; o < t; o++) {
            let t;
            if (n = e[o], i = n, !Ea(n) && (i = xa[(t = String(n)).toLowerCase()], void 0 === i)) throw new _s(`Unknown adapter '${t}'`);
            if (i) break;
            r[t || "#" + o] = i
        }
        if (!i) {
            const e = Object.entries(r).map((([e, t]) => `adapter ${e} ` + (!1 === t ? "is not supported by the environment" : "is not available in the build")));
            throw new _s("There is no suitable adapter to dispatch the request " + (t ? e.length > 1 ? "since :\n" + e.map(ka).join("\n") : " " + ka(e[0]) : "as no adapter specified"), "ERR_NOT_SUPPORT")
        }
        return i
    };

function Sa(e) {
    if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted) throw new Zs(null, e)
}

function Oa(e) {
    Sa(e), e.headers = AxiosHeaders.from(e.headers), e.data = Js.call(e, e.transformRequest), -1 !== ["post", "put", "patch"].indexOf(e.method) && e.headers.setContentType("application/x-www-form-urlencoded", !1);
    return Ca(e.adapter || Us.adapter)(e).then((function(t) {
        return Sa(e), t.data = Js.call(e, e.transformResponse, t), t.headers = AxiosHeaders.from(t.headers), t
    }), (function(t) {
        return Gs(t) || (Sa(e), t && t.response && (t.response.data = Js.call(e, e.transformResponse, t.response), t.response.headers = AxiosHeaders.from(t.response.headers))), Promise.reject(t)
    }))
}
const La = "1.7.7",
    Aa = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(((e, t) => {
    Aa[e] = function(n) {
        return typeof n === e || "a" + (t < 1 ? "n " : " ") + e
    }
}));
const Da = {};
Aa.transitional = function(e, t, n) {
    function i(e, t) {
        return "[Axios v1.7.7] Transitional option '" + e + "'" + t + (n ? ". " + n : "")
    }
    return (n, r, o) => {
        if (!1 === e) throw new _s(i(r, " has been removed" + (t ? " in " + t : "")), _s.ERR_DEPRECATED);
        return t && !Da[r] && (Da[r] = !0, console.warn(i(r, " has been deprecated since v" + t + " and will be removed in the near future"))), !e || e(n, r, o)
    }
};
const Ta = {
        assertOptions: function(e, t, n) {
            if ("object" != typeof e) throw new _s("options must be an object", _s.ERR_BAD_OPTION_VALUE);
            const i = Object.keys(e);
            let r = i.length;
            for (; r-- > 0;) {
                const o = i[r],
                    s = t[o];
                if (s) {
                    const t = e[o],
                        n = void 0 === t || s(t, o, e);
                    if (!0 !== n) throw new _s("option " + o + " must be " + n, _s.ERR_BAD_OPTION_VALUE)
                } else if (!0 !== n) throw new _s("Unknown option " + o, _s.ERR_BAD_OPTION)
            }
        },
        validators: Aa
    },
    Ia = Ta.validators;
class Axios {
    constructor(e) {
        this.defaults = e, this.interceptors = {
            request: new InterceptorManager,
            response: new InterceptorManager
        }
    }
    async request(e, t) {
        try {
            return await this._request(e, t)
        } catch (n) {
            if (n instanceof Error) {
                let e;
                Error.captureStackTrace ? Error.captureStackTrace(e = {}) : e = new Error;
                const t = e.stack ? e.stack.replace(/^.+\n/, "") : "";
                try {
                    n.stack ? t && !String(n.stack).endsWith(t.replace(/^.+\n.+\n/, "")) && (n.stack += "\n" + t) : n.stack = t
                } catch (lg) {}
            }
            throw n
        }
    }
    _request(e, t) {
        "string" == typeof e ? (t = t || {}).url = e : t = e || {}, t = sa(this.defaults, t);
        const {
            transitional: n,
            paramsSerializer: i,
            headers: r
        } = t;
        void 0 !== n && Ta.assertOptions(n, {
            silentJSONParsing: Ia.transitional(Ia.boolean),
            forcedJSONParsing: Ia.transitional(Ia.boolean),
            clarifyTimeoutError: Ia.transitional(Ia.boolean)
        }, !1), null != i && (ws.isFunction(i) ? t.paramsSerializer = {
            serialize: i
        } : Ta.assertOptions(i, {
            encode: Ia.function,
            serialize: Ia.function
        }, !0)), t.method = (t.method || this.defaults.method || "get").toLowerCase();
        let o = r && ws.merge(r.common, r[t.method]);
        r && ws.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (e => {
            delete r[e]
        })), t.headers = AxiosHeaders.concat(o, r);
        const s = [];
        let a = !0;
        this.interceptors.request.forEach((function(e) {
            "function" == typeof e.runWhen && !1 === e.runWhen(t) || (a = a && e.synchronous, s.unshift(e.fulfilled, e.rejected))
        }));
        const l = [];
        let c;
        this.interceptors.response.forEach((function(e) {
            l.push(e.fulfilled, e.rejected)
        }));
        let d, u = 0;
        if (!a) {
            const e = [Oa.bind(this), void 0];
            for (e.unshift.apply(e, s), e.push.apply(e, l), d = e.length, c = Promise.resolve(t); u < d;) c = c.then(e[u++], e[u++]);
            return c
        }
        d = s.length;
        let h = t;
        for (u = 0; u < d;) {
            const e = s[u++],
                t = s[u++];
            try {
                h = e(h)
            } catch (p) {
                t.call(this, p);
                break
            }
        }
        try {
            c = Oa.call(this, h)
        } catch (p) {
            return Promise.reject(p)
        }
        for (u = 0, d = l.length; u < d;) c = c.then(l[u++], l[u++]);
        return c
    }
    getUri(e) {
        return Ms(ra((e = sa(this.defaults, e)).baseURL, e.url), e.params, e.paramsSerializer)
    }
}
ws.forEach(["delete", "get", "head", "options"], (function(e) {
    Axios.prototype[e] = function(t, n) {
        return this.request(sa(n || {}, {
            method: e,
            url: t,
            data: (n || {}).data
        }))
    }
})), ws.forEach(["post", "put", "patch"], (function(e) {
    function t(t) {
        return function(n, i, r) {
            return this.request(sa(r || {}, {
                method: e,
                headers: t ? {
                    "Content-Type": "multipart/form-data"
                } : {},
                url: n,
                data: i
            }))
        }
    }
    Axios.prototype[e] = t(), Axios.prototype[e + "Form"] = t(!0)
}));
class CancelToken {
    constructor(e) {
        if ("function" != typeof e) throw new TypeError("executor must be a function.");
        let t;
        this.promise = new Promise((function(e) {
            t = e
        }));
        const n = this;
        this.promise.then((e => {
            if (!n._listeners) return;
            let t = n._listeners.length;
            for (; t-- > 0;) n._listeners[t](e);
            n._listeners = null
        })), this.promise.then = e => {
            let t;
            const i = new Promise((e => {
                n.subscribe(e), t = e
            })).then(e);
            return i.cancel = function() {
                n.unsubscribe(t)
            }, i
        }, e((function(e, i, r) {
            n.reason || (n.reason = new Zs(e, i, r), t(n.reason))
        }))
    }
    throwIfRequested() {
        if (this.reason) throw this.reason
    }
    subscribe(e) {
        this.reason ? e(this.reason) : this._listeners ? this._listeners.push(e) : this._listeners = [e]
    }
    unsubscribe(e) {
        if (!this._listeners) return;
        const t = this._listeners.indexOf(e); - 1 !== t && this._listeners.splice(t, 1)
    }
    toAbortSignal() {
        const e = new AbortController,
            t = t => {
                e.abort(t)
            };
        return this.subscribe(t), e.signal.unsubscribe = () => this.unsubscribe(t), e.signal
    }
    static source() {
        let e;
        return {
            token: new CancelToken((function(t) {
                e = t
            })),
            cancel: e
        }
    }
}
const Ma = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
};
Object.entries(Ma).forEach((([e, t]) => {
    Ma[t] = e
}));
const ja = function e(t) {
    const n = new Axios(t),
        i = Io(Axios.prototype.request, n);
    return ws.extend(i, Axios.prototype, n, {
        allOwnKeys: !0
    }), ws.extend(i, n, null, {
        allOwnKeys: !0
    }), i.create = function(n) {
        return e(sa(t, n))
    }, i
}(Us);
ja.Axios = Axios, ja.CanceledError = Zs, ja.CancelToken = CancelToken, ja.isCancel = Gs, ja.VERSION = La, ja.toFormData = Ls, ja.AxiosError = _s, ja.Cancel = ja.CanceledError, ja.all = function(e) {
    return Promise.all(e)
}, ja.spread = function(e) {
    return function(t) {
        return e.apply(null, t)
    }
}, ja.isAxiosError = function(e) {
    return ws.isObject(e) && !0 === e.isAxiosError
}, ja.mergeConfig = sa, ja.AxiosHeaders = AxiosHeaders, ja.formToJSON = e => Vs(ws.isHTMLForm(e) ? new FormData(e) : e), ja.getAdapter = Ca, ja.HttpStatusCode = Ma, ja.default = ja;
const Pa = {
        key: 0,
        class: "flex flex-wrap items-start"
    },
    Ra = {
        class: "w-full p-2 mr-4"
    },
    Fa = {
        class: "flex items-left mb-4"
    },
    Ba = ["innerHTML"],
    Ha = {
        class: "w-full max-w-lg p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow"
    },
    Na = {
        class: "flow-root"
    },
    za = {
        key: 0,
        class: ""
    },
    Va = {
        class: "flex items-left mb-4"
    },
    Ua = {
        class: "text-lg font-bold leading-none text-gray-900 dark:text-white"
    },
    qa = {
        key: 0,
        class: "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"
    },
    Wa = {
        key: 1,
        class: "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
    },
    Ka = {
        key: 2,
        class: "bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-700 dark:text-yellow-300"
    },
    $a = {
        key: 3,
        class: "bg-indigo-200 text-indigo-900 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-800 dark:text-indigo-300"
    },
    Ya = {
        class: "grid grid-cols-[20px_1fr] gap-4"
    },
    Ja = {
        class: "flex-1 ms-3 text-sm font-normal"
    },
    Ga = {
        class: "mb-1 text-sm font-semibold text-gray-900 dark:text-white"
    },
    Za = {
        key: 0
    },
    Xa = {
        key: 1
    },
    Qa = {
        key: 2
    },
    el = {
        key: 3
    },
    tl = {
        key: 0,
        class: "mb-2 text-sm font-normal"
    },
    nl = {
        key: 1,
        class: "mb-2 text-sm font-normal"
    },
    il = {
        key: 2,
        class: "mb-2 text-sm font-normal"
    },
    rl = {
        key: 3,
        class: "mb-2 text-sm font-normal"
    },
    ol = {
        class: "w-[200px]"
    },
    sl = {
        key: 1,
        class: "flex flex-wrap mt-4"
    },
    al = {
        class: "w-full max-w-sm p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow"
    },
    ll = {
        class: "flex items-left mb-4"
    },
    cl = {
        key: 1,
        class: "flex-shrink-0 w-4 h-4 inline-block mt-[-1px] animate-spin ml-auto no-gradient",
        viewBox: "0 0 20 20",
        xmlns: "http://www.w3.org/2000/svg"
    },
    dl = {
        class: "flow-root"
    },
    ul = {
        key: 0,
        class: "ml-0"
    },
    hl = {
        class: "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    },
    pl = {
        class: "text-right"
    },
    fl = {
        class: "text-right"
    },
    gl = {
        class: "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md text-cyan-700"
    },
    ml = {
        key: 0,
        "aria-hidden": "true",
        role: "status",
        class: "inline w-4 h-4 me-3 text-white animate-spin mt-[-3px]",
        viewBox: "0 0 100 101",
        xmlns: "http://www.w3.org/2000/svg"
    },
    vl = {
        key: 0,
        class: "inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient",
        viewBox: "0 0 512 512",
        "xml:space": "preserve",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
    },
    yl = {
        key: 1,
        class: "inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient",
        viewBox: "0 0 612 792",
        "xml:space": "preserve",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
    },
    bl = {
        key: 1
    },
    wl = {
        key: 2
    },
    _l = {
        key: 1,
        class: "flex flex-wrap mt-4"
    },
    xl = {
        class: "w-full max-w-lg p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow"
    },
    kl = {
        class: "flex items-left mb-4"
    },
    El = {
        class: "flow-root p-2"
    },
    Cl = {
        class: "text-sm font-normal"
    },
    Sl = {
        class: "w-full max-w-sm p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow"
    },
    Ol = {
        class: "flex items-left mb-4"
    },
    Ll = {
        class: "flow-root"
    },
    Al = {
        class: "text-sm font-normal"
    },
    Dl = {
        key: 1,
        class: "flex flex-wrap"
    },
    Tl = {
        data: () => ({
            dashboardData: null,
            loading: !1,
            clearing: {},
            refreshing: !1,
            livechat_loaded: !1,
            mode: window.upress_namespace.config.speed_css.css_mode.value,
            include_patterns: window.upress_namespace.config.speed_css.include_patterns.value,
            include_patterns_helper: window.upress_namespace.config.speed_css.include_patterns.helper
        }),
        mounted() {
            this.fetchData(), this.setupLivechat(), setInterval((() => {
                "Dashboard" == (window.upress_namespace.activeItem.name ?? !1) && this.refreshCache()
            }), 1e4), window.addEventListener("beforeunload", this.clearLocalStorage)
        },
        beforeDestroy() {
            window.removeEventListener("beforeunload", this.clearLocalStorage)
        },
        methods: {
            setupLivechat() {
                var e, t;
                e = document.createElement("script"), t = document.getElementsByTagName("script")[0], e.async = !0, e.src = "https://embed.tawk.to/671a26b52480f5b4f5932801/1iav2edi4", e.charset = "UTF-8", e.setAttribute("crossorigin", "*"), t.parentNode.insertBefore(e, t), this.checkTawkBranding()
            },
            checkTawkBranding() {
                let e = 0;
                const t = setInterval((() => {
                    for (let e = 0; e < 10; e++) {
                        const n = document.querySelectorAll("iframe[title='chat widget']")[e] ?? !1;
                        if (n && n.contentDocument) {
                            n.contentDocument.querySelector("a.tawk-branding") && (n.contentDocument.querySelectorAll("a.tawk-branding").forEach((e => {
                                e.style.display = "none"
                            })), clearInterval(t))
                        }
                    }
                    e++, e >= 10 && clearInterval(t)
                }), 1e3)
            },
            openLiveChat() {
                Tawk_API.toggle(), this.checkTawkBranding()
            },
            fetchData() {
                const e = localStorage.getItem("dashboardData");
                e ? this.dashboardData = JSON.parse(e) : ja.get("/wp-json/speedifypress/get_dashboard_data").then((e => {
                    this.dashboardData = e.data, this.clearing = {}, this.refreshing = !1, localStorage.setItem("dashboardData", JSON.stringify(e.data))
                })).catch((e => {
                    console.error(e)
                }))
            },
            clearCache(e) {
                this.clearing.spinner = !0, this.clearing.text = !0, ja.get("/wp-json/speedifypress/clear_css_cache").then((e => {
                    this.setButton("clearing", "success"), localStorage.removeItem("dashboardData")
                })).catch((e => {
                    this.setButton("clearing", "failure"), console.error(e)
                }))
            },
            setButton(e, t) {
                const n = this[e];
                "success" == t ? (n.spinner = !1, n.success = !0, setTimeout((() => {
                    n.text = !1, n.success = !1
                }), 1e3)) : "failure" == t && (n.spinner = !1, n.failure = !0, setTimeout((() => {
                    n.text = !1, n.failure = !1
                }), 1e3))
            },
            refreshCache() {
                this.refreshing = !0, localStorage.removeItem("dashboardData"), this.fetchData()
            },
            submitForm(e) {
                e.preventDefault(), this.loading = !0, new FormData(this.$refs.speedForm);
                const t = this.$refs.speedForm.elements;
                let n = {};
                Array.from(t).forEach((e => {
                    "checkbox" === e.type ? n[e.name] = e.checked : "radio" === e.type ? !0 === e.checked && (n[e.name] = e.value) : n[e.name] = e.value
                }));
                for (let i in n) n[i] = btoa(n[i]);
                ja.post("/wp-json/speedifypress/update_config", n).then((e => {
                    console.log(e.data)
                })).catch((e => {
                    console.error(e)
                })).finally((() => {
                    this.loading = !1
                }))
            },
            clearLocalStorage() {
                localStorage.removeItem("dashboardData")
            }
        }
    },
    Il = Object.assign(Tl, {
        __name: "Dashboard",
        props: {
            icon: {
                type: String,
                required: !1
            },
            iconclass: {
                type: String,
                required: !1
            }
        },
        emits: ["changeColumn"],
        setup(e, {
            emit: t
        }) {
            const n = t;

            function i(e) {
                n("changeColumn", e)
            }
            return (t, n) => (Gi(), er("div", null, [t.dashboardData ? (Gi(), er("div", Pa, [sr("div", Ra, [sr("div", Fa, [sr("span", {
                innerHTML: e.icon,
                class: "mr-2"
            }, null, 8, Ba), n[6] || (n[6] = sr("h5", {
                class: "text-xl font-bold leading-none text-raisin dark:text-white"
            }, "Dashboard", -1))]), n[7] || (n[7] = sr("hr", {
                class: "h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
            }, null, -1))]), sr("div", Ha, [sr("div", Na, [t.dashboardData.cache_data ? (Gi(), er("div", za, [sr("div", Va, [(Gi(), er("svg", {
                class: V([e.iconclass, "mr-2"]),
                viewBox: "-31.872 -3.842 64.203 26.304",
                "xml:space": "preserve",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink"
            }, n[8] || (n[8] = [dr('<defs><linearGradient id="gradient_upress" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1;"></stop><stop offset="100%" style="stop-color:#3f83f8;stop-opacity:1;"></stop></linearGradient></defs><g stroke-miterlimit="10" stroke-width="2"><path d="m-29.704 9.172c0-2.688 0.839-4.932 2.515-6.739 1.678-1.805 3.52-3.011 5.533-3.612 0.462-0.161 0.926-0.277 1.389-0.348 0.46-0.071 0.912-0.104 1.352-0.104l24.561-0.034v2.704h-23.834c-2.797 0.277-4.925 1.251-6.382 2.914-1.457 1.664-2.199 3.469-2.222 5.412v0.102c0 0.441 0.06 0.972 0.176 1.598s0.321 1.259 0.625 1.908c0.507 1.158 1.368 2.22 2.582 3.179 1.218 0.96 2.957 1.433 5.223 1.433h2.462v2.639h-3.918c-3.215-0.093-5.696-1.18-7.441-3.265-1.748-2.082-2.62-4.668-2.62-7.75v-0.037z"></path><path d="m-6.46 17.551c0.97 0.023 1.75-0.159 2.339-0.553 0.59-0.396 0.943-1.018 1.058-1.875 0-0.74-0.243-1.422-0.728-2.045-0.486-0.626-1.214-1.184-2.186-1.67-0.186-0.091-0.378-0.181-0.573-0.271-0.198-0.096-0.397-0.193-0.607-0.283-0.022-0.022-0.054-0.039-0.088-0.05-0.033-0.012-0.065-0.028-0.087-0.051-1.711-0.835-3.277-1.728-4.7-2.688-1.42-0.958-2.132-2.269-2.132-3.937 0.023-0.07 0.035-0.127 0.035-0.175 0-0.045 5e-3 -0.079 0.016-0.104 0.012-0.023 0.018-0.046 0.018-0.069 0-1.605 0.458-2.816 1.373-3.63 0.911-0.816 1.911-1.349 2.997-1.606 0.165-0.047 0.331-0.082 0.505-0.104 0.173-0.026 0.339-0.048 0.503-0.071l7.63-0.034v2.704h-7.145c-0.811 0.023-1.457 0.275-1.941 0.746-0.486 0.474-0.788 1.002-0.904 1.578 0 0.093-6e-3 0.181-0.017 0.262-0.012 0.08-0.017 0.155-0.017 0.224 0 0.325 0.082 0.642 0.242 0.954 0.161 0.313 0.381 0.564 0.658 0.745 0.949 0.672 1.84 1.219 2.672 1.632 0.833 0.417 1.607 0.795 2.324 1.145 0.209 0.112 0.409 0.226 0.607 0.328 0.194 0.102 0.386 0.213 0.573 0.327 0.161 0.096 0.328 0.193 0.503 0.301 0.172 0.102 0.341 0.209 0.501 0.327 0.718 0.536 1.381 1.203 1.997 2.016 0.612 0.807 0.917 1.812 0.917 3.015 0 0.305-0.017 0.632-0.05 1.004-0.035 0.373-0.111 0.745-0.226 1.113-0.253 0.896-0.781 1.714-1.577 2.444-0.799 0.726-2.053 0.811-3.764 0.811h-0.104-0.104-0.034c-0.048 0-0.093-0.011-0.141-0.022-0.045-0.012-0.079-0.012-0.103-0.012l-8.118-0.038v-2.388h7.878z"></path><path d="m9.634 17.551c0.971 0.023 1.751-0.159 2.337-0.553 0.594-0.396 0.948-1.018 1.062-1.875 0-0.74-0.243-1.422-0.729-2.045-0.484-0.626-1.213-1.184-2.185-1.67-0.184-0.091-0.377-0.181-0.571-0.271-0.199-0.096-0.398-0.193-0.607-0.283-0.023-0.022-0.055-0.039-0.087-0.05-0.035-0.012-0.066-0.028-0.088-0.051-1.711-0.835-3.277-1.728-4.701-2.688-1.419-0.959-2.131-2.269-2.131-3.937 0.022-0.07 0.034-0.128 0.034-0.175 0-0.045 6e-3 -0.079 0.017-0.104 0.012-0.023 0.017-0.046 0.017-0.069 0-1.605 0.458-2.816 1.371-3.63 0.912-0.816 1.911-1.349 2.999-1.606 0.162-0.048 0.33-0.083 0.505-0.104 0.172-0.026 0.337-0.048 0.5-0.071l7.631-0.034v2.704h-7.144c-0.81 0.023-1.457 0.275-1.942 0.746-0.484 0.474-0.786 1.002-0.903 1.578 0 0.093-6e-3 0.181-0.016 0.262-0.012 0.08-0.018 0.155-0.018 0.224 0 0.325 0.083 0.642 0.243 0.954 0.16 0.313 0.381 0.564 0.658 0.745 0.949 0.672 1.84 1.219 2.674 1.632 0.832 0.417 1.606 0.795 2.322 1.145 0.209 0.112 0.412 0.226 0.605 0.328 0.197 0.102 0.389 0.213 0.576 0.327 0.158 0.096 0.327 0.193 0.502 0.301 0.174 0.102 0.343 0.209 0.502 0.327 0.717 0.536 1.377 1.203 2 2.016 0.607 0.807 0.914 1.812 0.914 3.015 0 0.305-0.018 0.632-0.052 1.004-0.033 0.373-0.107 0.745-0.225 1.113-0.255 0.897-0.785 1.715-1.576 2.445-0.803 0.726-2.054 0.811-3.766 0.811h-0.107-0.102-0.035c-0.044 0-0.088-0.011-0.14-0.022-0.044-0.012-0.078-0.012-0.102-0.012l-8.119-0.038v-2.388h7.877z"></path><path d="m30.159 9.208c0 3.083-0.87 5.669-2.62 7.749-1.743 2.084-4.225 3.17-7.441 3.264h-33.84v-2.639h32.384c2.264 0 4.004-0.473 5.222-1.432 1.214-0.957 2.078-2.02 2.586-3.174 0.299-0.651 0.507-1.286 0.622-1.912 0.119-0.626 0.174-1.156 0.174-1.598v-0.102c-0.023-1.943-0.762-3.748-2.218-5.412-1.458-1.663-3.592-2.637-6.386-2.914h-11.012v-2.704l11.313 0.034c0.441 0 1.319 0.033 1.777 0.104 0.462 0.071 0.926 0.187 1.389 0.348 2.013 0.601 3.861 1.807 5.538 3.612 1.676 1.807 2.513 4.051 2.513 6.739v0.037z"></path></g>', 2)]), 2)), sr("h5", Ua, [n[9] || (n[9] = cr("Unused CSS Mode - ")), "disabled" == t.mode ? (Gi(), er("span", qa, "Disabled")) : ur("", !0), "enabled" == t.mode ? (Gi(), er("span", Wa, "Enabled")) : ur("", !0), "preview" == t.mode ? (Gi(), er("span", Ka, "Preview Mode")) : ur("", !0), "stats" == t.mode ? (Gi(), er("span", $a, "Stats Only")) : ur("", !0)])]), n[13] || (n[13] = sr("hr", {
                class: "h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
            }, null, -1)), sr("div", Ya, [n[12] || (n[12] = dr('<div class="w-[20px]"><div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900"><svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"></path></g></svg><span class="sr-only">Info icon</span></div></div>', 1)), sr("div", Ja, [sr("span", Ga, ["enabled" == t.mode ? (Gi(), er("span", Za, "Complete functionality enabled")) : ur("", !0), "preview" == t.mode ? (Gi(), er("span", Xa, "Just enabled for admins")) : ur("", !0), "stats" == t.mode ? (Gi(), er("span", Qa, "Will just gather stats")) : ur("", !0), "disabled" == t.mode ? (Gi(), er("span", el, "No replacements are made, you can just view existing stats")) : ur("", !0)]), "enabled" == t.mode ? (Gi(), er("div", tl, "Every new page view will generate unused CSS. Subsequent page views will use new CSS.")) : ur("", !0), "preview" == t.mode ? (Gi(), er("div", nl, "As an admin you can view pages, test CSS and adjust. Users will get normal CSS.")) : ur("", !0), "stats" == t.mode ? (Gi(), er("div", il, [n[10] || (n[10] = cr("Plugin is just gathering stats. ")), sr("a", {
                href: "#",
                onClick: n[0] || (n[0] = Lo((e => i("Stats")), ["prevent"]))
            }, "View them here.")])) : ur("", !0), "disabled" == t.mode ? (Gi(), er("div", rl, "Plugin will not change CSS in any way")) : ur("", !0)]), sr("div", ol, [sr("a", {
                onClick: n[1] || (n[1] = Lo((e => i("Settings")), ["prevent"])),
                href: "#",
                class: "inline-flex justify-center w-xs px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white hover:shadow-md"
            }, n[11] || (n[11] = [sr("svg", {
                class: "flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white no-gradient mr-1",
                viewBox: "0 0 48 48",
                width: "48",
                xmlns: "http://www.w3.org/2000/svg"
            }, [sr("path", {
                d: "M0 0h48v48H0z",
                fill: "none"
            }), sr("path", {
                d: "M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97L29 4.84c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97L9.9 10.1c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31C9.06 22.69 9 23.34 9 24s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zM24 31c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
            })], -1), cr(" Change Settings ")]))])])])) : (Gi(), er("div", sl, [ar(To)]))])]), sr("div", al, [sr("div", ll, [(Gi(), er("svg", {
                class: V([e.iconclass, "mr-2"]),
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg"
            }, n[14] || (n[14] = [sr("path", {
                d: "M19,12 L19,8.62081119 C17.3445598,9.50508911 14.8145288,10 12,10 C9.18547122,10 6.65544022,9.50508911 5,8.62081119 L5,12.0000003 C5,12.8370203 8.10127922,14 12,14 C15.8987208,14 19,12.8370203 19,12 Z M19,14.6208112 C17.3445598,15.5050891 14.8145288,16 12,16 C9.18547122,16 6.65544022,15.5050891 5,14.6208112 L5,18 C5,18.8370203 8.10127922,20 12,20 C15.8987208,20 19,18.8370203 19,18 L19,14.6208112 Z M3,6 C3,3.52331179 7.06216478,2 12,2 C16.9378352,2 21,3.52331179 21,6 L21,18 C21,20.4766882 16.9378352,22 12,22 C7.06216478,22 3,20.4766882 3,18 L3,6 Z M12,8 C15.8987208,8 19,6.83702029 19,6 C19,5.16297971 15.8987208,4 12,4 C8.10127922,4 5,5.16297971 5,6 C5,6.83702029 8.10127922,8 12,8 Z",
                "fill-rule": "evenodd"
            }, null, -1)]), 2)), n[17] || (n[17] = sr("h5", {
                class: "text-lg font-bold leading-none text-gray-900 dark:text-white"
            }, "Cache Status", -1)), t.refreshing ? ur("", !0) : (Gi(), er("svg", {
                key: 0,
                onClick: n[2] || (n[2] = (...e) => t.refreshCache && t.refreshCache(...e)),
                class: "flex-shrink-0 w-4 h-4 inline-block mt-[-1px] cursor-pointer ml-auto no-gradient",
                viewBox: "0 0 20 20",
                xmlns: "http://www.w3.org/2000/svg"
            }, n[15] || (n[15] = [sr("path", {
                d: "M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"
            }, null, -1)]))), t.refreshing ? (Gi(), er("svg", cl, n[16] || (n[16] = [sr("path", {
                d: "M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"
            }, null, -1)]))) : ur("", !0)]), n[23] || (n[23] = sr("hr", {
                class: "h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
            }, null, -1)), sr("div", dl, [t.dashboardData.cache_data ? (Gi(), er("div", ul, [sr("p", null, [sr("table", hl, [sr("tr", null, [n[18] || (n[18] = sr("td", null, "Unique CSS files", -1)), sr("td", pl, K(t.dashboardData.cache_data.num_css_files), 1)]), sr("tr", null, [n[19] || (n[19] = sr("td", null, "Number of pages", -1)), sr("td", fl, K(t.dashboardData.cache_data.num_lookup_files), 1)])])]), sr("button", {
                onClick: n[3] || (n[3] = (...e) => t.clearCache && t.clearCache(...e)),
                type: "submit",
                class: "mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl hover:shadow-md"
            }, [sr("span", gl, [t.clearing.spinner ? (Gi(), er("svg", ml, n[20] || (n[20] = [sr("path", {
                d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            }, null, -1), sr("path", {
                d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            }, null, -1)]))) : ur("", !0), ar(Wr, {
                "enter-active-class": "transition-opacity duration-700 ease-out",
                "enter-from-class": "opacity-0",
                "enter-to-class": "opacity-100",
                "leave-active-class": "transition-opacity duration-0",
                "leave-from-class": "opacity-100",
                "leave-to-class": "opacity-0",
                mode: "out-in"
            }, {
                default: Gt((() => [t.clearing.success ? (Gi(), er("svg", vl, n[21] || (n[21] = [sr("g", null, [sr("polygon", {
                    class: "st0",
                    points: "434.8,49 174.2,309.7 76.8,212.3 0,289.2 174.1,463.3 196.6,440.9 196.6,440.9 511.7,125.8 434.8,49",
                    fill: "#41AD49"
                })], -1)]))) : ur("", !0), t.clearing.failure ? (Gi(), er("svg", yl, n[22] || (n[22] = [sr("g", null, [sr("polygon", {
                    class: "st0",
                    points: "382.2,396.4 560.8,217.8 484,141 305.4,319.6 126.8,141 50,217.8 228.6,396.4 50,575 126.8,651.8    305.4,473.2 484,651.8 560.8,575 382.2,396.4  ",
                    fill: "#E44061"
                })], -1)]))) : ur("", !0)])),
                _: 1
            }), t.clearing.text ? (Gi(), er("span", bl, "Clearing")) : (Gi(), er("span", wl, "Clear Cache"))])])])) : (Gi(), er("div", _l, [ar(To)]))])]), sr("div", xl, [sr("div", kl, [(Gi(), er("svg", {
                class: V([e.iconclass, "mr-2"]),
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg"
            }, n[24] || (n[24] = [sr("g", null, [sr("path", {
                d: "M0 0h24v24H0z",
                fill: "none"
            }), sr("path", {
                d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"
            })], -1)]), 2)), n[25] || (n[25] = sr("h5", {
                class: "text-lg font-bold leading-none text-gray-900 dark:text-white"
            }, "Documentation", -1))]), n[27] || (n[27] = sr("hr", {
                class: "h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
            }, null, -1)), sr("div", El, [sr("p", Cl, [n[26] || (n[26] = cr("Learn best practices on how to use this plugin in our ")), sr("a", {
                onClick: n[4] || (n[4] = Lo((e => i("How to use")), ["prevent"])),
                href: ""
            }, "how to use guide.")])])]), sr("div", Sl, [sr("div", Ol, [(Gi(), er("svg", {
                class: V([e.iconclass, "mr-2"]),
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg"
            }, n[28] || (n[28] = [sr("g", null, [sr("path", {
                d: "M0 0h24v24H0z",
                fill: "none"
            }), sr("path", {
                d: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"
            })], -1)]), 2)), n[29] || (n[29] = sr("h5", {
                class: "text-lg font-bold leading-none text-gray-900 dark:text-white"
            }, "Get Help", -1))]), n[32] || (n[32] = sr("hr", {
                class: "h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
            }, null, -1)), sr("div", Ll, [sr("p", Al, [n[30] || (n[30] = cr("Want to talk to someone? ")), sr("a", {
                href: "#",
                onClick: n[5] || (n[5] = Lo((e => t.openLiveChat()), ["prevent"]))
            }, "Click here"), n[31] || (n[31] = cr(" to chat"))])])])])) : (Gi(), er("div", Dl, [ar(To, {
                mr: "4",
                width: "max-w-lg"
            }), ar(To, {
                width: "max-w-sm"
            })]))]))
        }
    }),
    Ml = {
        key: 0,
        class: "flex flex-wrap items-start"
    },
    jl = {
        class: "w-full p-2 mr-4"
    },
    Pl = {
        class: "flex items-left mb-4"
    },
    Rl = ["innerHTML"],
    Fl = {
        class: "w-full max-w-xl p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow"
    },
    Bl = {
        class: "flow-root"
    },
    Hl = {
        key: 0,
        class: "ml-3"
    },
    Nl = {
        class: "flex items-left mb-4"
    },
    zl = {
        class: "grid w-full gap-2 md:grid-cols-4 mb-3"
    },
    Vl = ["checked"],
    Ul = ["checked"],
    ql = ["checked"],
    Wl = ["checked"],
    Kl = {
        type: "submit",
        class: "mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl hover:shadow-md"
    },
    $l = {
        class: "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md text-cyan-700"
    },
    Yl = {
        key: 0,
        "aria-hidden": "true",
        role: "status",
        class: "inline w-4 h-4 me-3 text-white animate-spin mt-[-3px]",
        viewBox: "0 0 100 101",
        xmlns: "http://www.w3.org/2000/svg"
    },
    Jl = {
        key: 0,
        class: "inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient",
        viewBox: "0 0 512 512",
        "xml:space": "preserve",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
    },
    Gl = {
        key: 1,
        class: "inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient",
        viewBox: "0 0 612 792",
        "xml:space": "preserve",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
    },
    Zl = {
        key: 1
    },
    Xl = {
        key: 2
    },
    Ql = {
        key: 1,
        class: "flex flex-wrap mt-4"
    },
    ec = {
        class: "w-full max-w-xs p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow"
    },
    tc = {
        class: "flow-root"
    },
    nc = {
        key: 0,
        class: "ml-3"
    },
    ic = {
        class: "flex items-left mb-4"
    },
    rc = {
        id: "helper-text-explanation",
        class: "mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400"
    },
    oc = {
        type: "submit",
        class: "mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl hover:shadow-md"
    },
    sc = {
        class: "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md text-cyan-700"
    },
    ac = {
        key: 0,
        "aria-hidden": "true",
        role: "status",
        class: "inline w-4 h-4 me-3 text-white animate-spin mt-[-3px]",
        viewBox: "0 0 100 101",
        xmlns: "http://www.w3.org/2000/svg"
    },
    lc = {
        key: 0,
        class: "inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient",
        viewBox: "0 0 512 512",
        "xml:space": "preserve",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
    },
    cc = {
        key: 1,
        class: "inline w-4 h-4 me-3 text-white mt-[-3px] no-gradient",
        viewBox: "0 0 612 792",
        "xml:space": "preserve",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink"
    },
    dc = {
        key: 1
    },
    uc = {
        key: 2
    },
    hc = {
        key: 1,
        class: "flex flex-wrap mt-4"
    },
    pc = {
        key: 1,
        class: "flex flex-wrap"
    },
    fc = {
        data: () => ({
            dashboardData: null,
            button_selectors: {},
            button_mode: {},
            mode: window.upress_namespace.config.speed_css.css_mode.value,
            include_patterns: window.upress_namespace.config.speed_css.include_patterns.value,
            include_patterns_helper: window.upress_namespace.config.speed_css.include_patterns.helper
        }),
        mounted() {
            this.fetchData(), window.addEventListener("beforeunload", this.clearLocalStorage)
        },
        beforeDestroy() {
            window.removeEventListener("beforeunload", this.clearLocalStorage)
        },
        methods: {
            fetchData() {
                const e = localStorage.getItem("dashboardData");
                e ? this.dashboardData = JSON.parse(e) : ja.get("/wp-json/speedifypress/get_dashboard_data").then((e => {
                    this.dashboardData = e.data, localStorage.setItem("dashboardData", JSON.stringify(e.data))
                })).catch((e => {
                    console.error(e)
                }))
            },
            submitForm(e) {
                e.preventDefault();
                const t = e.target.dataset.ref,
                    n = e.target.elements;
                "modeForm" == t ? (this.button_mode.spinner = !0, this.button_mode.text = !0) : "selectorForm" == t && (this.button_selectors.spinner = !0, this.button_selectors.text = !0);
                let i = {};
                Array.from(n).forEach((e => {
                    "checkbox" === e.type ? i[e.name] = e.checked : "radio" === e.type ? !0 === e.checked && (i[e.name] = e.value, "css_mode" == e.name && (window.upress_namespace.config.speed_css.css_mode.value = e.value)) : i[e.name] = e.value
                }));
                for (let r in i) i[r] = btoa(i[r]);
                ja.post("/wp-json/speedifypress/update_config", i).then((e => {
                    console.log(e.data)
                })).catch((e => {
                    console.error(e)
                })).finally((() => {
                    "modeForm" == t ? this.setButton("button_mode", "success") : "selectorForm" == t && this.setButton("button_selectors", "success")
                }))
            },
            setButton(e, t) {
                const n = this[e];
                "success" == t ? (n.spinner = !1, n.success = !0, setTimeout((() => {
                    n.text = !1, n.success = !1
                }), 1e3)) : "failure" == t && (n.spinner = !1, n.failure = !0, setTimeout((() => {
                    n.text = !1, n.failure = !1
                }), 1e3))
            },
            clearLocalStorage() {
                localStorage.removeItem("dashboardData")
            }
        }
    },
    gc = Object.assign(fc, {
        __name: "Settings",
        props: {
            icon: {
                type: String,
                required: !1
            },
            iconclass: {
                type: String,
                required: !1
            }
        },
        setup: e => (t, n) => (Gi(), er("div", null, [t.dashboardData ? (Gi(), er("div", Ml, [sr("div", jl, [sr("div", Pl, [sr("span", {
            innerHTML: e.icon,
            class: "mr-2"
        }, null, 8, Rl), n[3] || (n[3] = sr("h5", {
            class: "text-xl font-bold leading-none text-raisin dark:text-white"
        }, "Settings", -1))]), n[4] || (n[4] = sr("hr", {
            class: "h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
        }, null, -1))]), sr("div", Fl, [sr("div", Bl, [t.dashboardData.cache_data ? (Gi(), er("div", Hl, [sr("form", {
            onSubmit: n[0] || (n[0] = Lo(((...e) => t.submitForm && t.submitForm(...e)), ["prevent"])),
            class: "max-w-xl mx-auto",
            "data-ref": "modeForm",
            ref: "modeForm"
        }, [sr("div", Nl, [(Gi(), er("svg", {
            class: V([e.iconclass, "mr-2"]),
            viewBox: "-31.872 -3.842 64.203 26.304",
            "xml:space": "preserve",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink"
        }, n[5] || (n[5] = [dr('<defs><linearGradient id="gradient_upress" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1;"></stop><stop offset="100%" style="stop-color:#3f83f8;stop-opacity:1;"></stop></linearGradient></defs><g stroke-miterlimit="10" stroke-width="2"><path d="m-29.704 9.172c0-2.688 0.839-4.932 2.515-6.739 1.678-1.805 3.52-3.011 5.533-3.612 0.462-0.161 0.926-0.277 1.389-0.348 0.46-0.071 0.912-0.104 1.352-0.104l24.561-0.034v2.704h-23.834c-2.797 0.277-4.925 1.251-6.382 2.914-1.457 1.664-2.199 3.469-2.222 5.412v0.102c0 0.441 0.06 0.972 0.176 1.598s0.321 1.259 0.625 1.908c0.507 1.158 1.368 2.22 2.582 3.179 1.218 0.96 2.957 1.433 5.223 1.433h2.462v2.639h-3.918c-3.215-0.093-5.696-1.18-7.441-3.265-1.748-2.082-2.62-4.668-2.62-7.75v-0.037z"></path><path d="m-6.46 17.551c0.97 0.023 1.75-0.159 2.339-0.553 0.59-0.396 0.943-1.018 1.058-1.875 0-0.74-0.243-1.422-0.728-2.045-0.486-0.626-1.214-1.184-2.186-1.67-0.186-0.091-0.378-0.181-0.573-0.271-0.198-0.096-0.397-0.193-0.607-0.283-0.022-0.022-0.054-0.039-0.088-0.05-0.033-0.012-0.065-0.028-0.087-0.051-1.711-0.835-3.277-1.728-4.7-2.688-1.42-0.958-2.132-2.269-2.132-3.937 0.023-0.07 0.035-0.127 0.035-0.175 0-0.045 5e-3 -0.079 0.016-0.104 0.012-0.023 0.018-0.046 0.018-0.069 0-1.605 0.458-2.816 1.373-3.63 0.911-0.816 1.911-1.349 2.997-1.606 0.165-0.047 0.331-0.082 0.505-0.104 0.173-0.026 0.339-0.048 0.503-0.071l7.63-0.034v2.704h-7.145c-0.811 0.023-1.457 0.275-1.941 0.746-0.486 0.474-0.788 1.002-0.904 1.578 0 0.093-6e-3 0.181-0.017 0.262-0.012 0.08-0.017 0.155-0.017 0.224 0 0.325 0.082 0.642 0.242 0.954 0.161 0.313 0.381 0.564 0.658 0.745 0.949 0.672 1.84 1.219 2.672 1.632 0.833 0.417 1.607 0.795 2.324 1.145 0.209 0.112 0.409 0.226 0.607 0.328 0.194 0.102 0.386 0.213 0.573 0.327 0.161 0.096 0.328 0.193 0.503 0.301 0.172 0.102 0.341 0.209 0.501 0.327 0.718 0.536 1.381 1.203 1.997 2.016 0.612 0.807 0.917 1.812 0.917 3.015 0 0.305-0.017 0.632-0.05 1.004-0.035 0.373-0.111 0.745-0.226 1.113-0.253 0.896-0.781 1.714-1.577 2.444-0.799 0.726-2.053 0.811-3.764 0.811h-0.104-0.104-0.034c-0.048 0-0.093-0.011-0.141-0.022-0.045-0.012-0.079-0.012-0.103-0.012l-8.118-0.038v-2.388h7.878z"></path><path d="m9.634 17.551c0.971 0.023 1.751-0.159 2.337-0.553 0.594-0.396 0.948-1.018 1.062-1.875 0-0.74-0.243-1.422-0.729-2.045-0.484-0.626-1.213-1.184-2.185-1.67-0.184-0.091-0.377-0.181-0.571-0.271-0.199-0.096-0.398-0.193-0.607-0.283-0.023-0.022-0.055-0.039-0.087-0.05-0.035-0.012-0.066-0.028-0.088-0.051-1.711-0.835-3.277-1.728-4.701-2.688-1.419-0.959-2.131-2.269-2.131-3.937 0.022-0.07 0.034-0.128 0.034-0.175 0-0.045 6e-3 -0.079 0.017-0.104 0.012-0.023 0.017-0.046 0.017-0.069 0-1.605 0.458-2.816 1.371-3.63 0.912-0.816 1.911-1.349 2.999-1.606 0.162-0.048 0.33-0.083 0.505-0.104 0.172-0.026 0.337-0.048 0.5-0.071l7.631-0.034v2.704h-7.144c-0.81 0.023-1.457 0.275-1.942 0.746-0.484 0.474-0.786 1.002-0.903 1.578 0 0.093-6e-3 0.181-0.016 0.262-0.012 0.08-0.018 0.155-0.018 0.224 0 0.325 0.083 0.642 0.243 0.954 0.16 0.313 0.381 0.564 0.658 0.745 0.949 0.672 1.84 1.219 2.674 1.632 0.832 0.417 1.606 0.795 2.322 1.145 0.209 0.112 0.412 0.226 0.605 0.328 0.197 0.102 0.389 0.213 0.576 0.327 0.158 0.096 0.327 0.193 0.502 0.301 0.174 0.102 0.343 0.209 0.502 0.327 0.717 0.536 1.377 1.203 2 2.016 0.607 0.807 0.914 1.812 0.914 3.015 0 0.305-0.018 0.632-0.052 1.004-0.033 0.373-0.107 0.745-0.225 1.113-0.255 0.897-0.785 1.715-1.576 2.445-0.803 0.726-2.054 0.811-3.766 0.811h-0.107-0.102-0.035c-0.044 0-0.088-0.011-0.14-0.022-0.044-0.012-0.078-0.012-0.102-0.012l-8.119-0.038v-2.388h7.877z"></path><path d="m30.159 9.208c0 3.083-0.87 5.669-2.62 7.749-1.743 2.084-4.225 3.17-7.441 3.264h-33.84v-2.639h32.384c2.264 0 4.004-0.473 5.222-1.432 1.214-0.957 2.078-2.02 2.586-3.174 0.299-0.651 0.507-1.286 0.622-1.912 0.119-0.626 0.174-1.156 0.174-1.598v-0.102c-0.023-1.943-0.762-3.748-2.218-5.412-1.458-1.663-3.592-2.637-6.386-2.914h-11.012v-2.704l11.313 0.034c0.441 0 1.319 0.033 1.777 0.104 0.462 0.071 0.926 0.187 1.389 0.348 2.013 0.601 3.861 1.807 5.538 3.612 1.676 1.807 2.513 4.051 2.513 6.739v0.037z"></path></g>', 2)]), 2)), n[6] || (n[6] = sr("h5", {
            class: "text-lg font-bold leading-none text-gray-900 dark:text-white"
        }, "Choose the Unused CSS mode", -1))]), sr("ul", zl, [sr("li", null, [sr("input", {
            type: "radio",
            id: "mode-enabled",
            name: "css_mode",
            value: "enabled",
            class: "!hidden peer",
            required: "",
            checked: "enabled" === t.mode
        }, null, 8, Vl), n[7] || (n[7] = sr("label", {
            for: "mode-enabled",
            class: "inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:peer-checked:text-blue-600 peer-checked:border-green-700 peer-checked:text-green-800 peer-checked:bg-green-100"
        }, [sr("div", {
            class: "block"
        }, [sr("div", {
            class: "w-full text-lg font-semibold"
        }, "Fully Enabled"), sr("div", {
            class: "w-full"
        }, "Replaces files, gathers stats")])], -1))]), sr("li", null, [sr("input", {
            type: "radio",
            id: "mode-preview",
            name: "css_mode",
            value: "preview",
            class: "!hidden peer",
            required: "",
            checked: "preview" === t.mode
        }, null, 8, Ul), n[8] || (n[8] = sr("label", {
            for: "mode-preview",
            class: "inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-yellow-700 peer-checked:text-yellow-800 peer-checked:bg-yellow-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        }, [sr("div", {
            class: "block"
        }, [sr("div", {
            class: "w-full text-lg font-semibold"
        }, "Preview Mode"), sr("div", {
            class: "w-full"
        }, "Enabled only for admins")])], -1))]), sr("li", null, [sr("input", {
            type: "radio",
            id: "mode-stats",
            name: "css_mode",
            value: "stats",
            class: "!hidden peer",
            checked: "stats" === t.mode
        }, null, 8, ql), n[9] || (n[9] = sr("label", {
            for: "mode-stats",
            class: "inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-indigo-700 peer-checked:text-indigo-800 peer-checked:bg-indigo-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        }, [sr("div", {
            class: "block"
        }, [sr("div", {
            class: "w-full text-lg font-semibold"
        }, "Statistics Only"), sr("div", {
            class: "w-full"
        }, "Just gather & view statistics")])], -1))]), sr("li", null, [sr("input", {
            type: "radio",
            id: "mode-disabled",
            name: "css_mode",
            value: "disabled",
            class: "!hidden peer",
            checked: "disabled" === t.mode
        }, null, 8, Wl), n[10] || (n[10] = sr("label", {
            for: "mode-disabled",
            class: "inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-cyan-700 dark:peer-checked:text-blue-600 peer-checked:border-red-700 peer-checked:text-red-800 peer-checked:bg-red-100 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        }, [sr("div", {
            class: "block"
        }, [sr("div", {
            class: "w-full text-lg font-semibold"
        }, "Fully Disabled"), sr("div", {
            class: "w-full"
        }, "View existing stats only")])], -1))])]), sr("button", Kl, [sr("span", $l, [t.button_mode.spinner ? (Gi(), er("svg", Yl, n[11] || (n[11] = [sr("path", {
            d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        }, null, -1), sr("path", {
            d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        }, null, -1)]))) : ur("", !0), ar(Wr, {
            "enter-active-class": "transition-opacity duration-700 ease-out",
            "enter-from-class": "opacity-0",
            "enter-to-class": "opacity-100",
            "leave-active-class": "transition-opacity duration-0",
            "leave-from-class": "opacity-100",
            "leave-to-class": "opacity-0",
            mode: "out-in"
        }, {
            default: Gt((() => [t.button_mode.success ? (Gi(), er("svg", Jl, n[12] || (n[12] = [sr("g", null, [sr("polygon", {
                class: "st0",
                points: "434.8,49 174.2,309.7 76.8,212.3 0,289.2 174.1,463.3 196.6,440.9 196.6,440.9 511.7,125.8 434.8,49",
                fill: "#41AD49"
            })], -1)]))) : ur("", !0), t.button_mode.failure ? (Gi(), er("svg", Gl, n[13] || (n[13] = [sr("g", null, [sr("polygon", {
                class: "st0",
                points: "382.2,396.4 560.8,217.8 484,141 305.4,319.6 126.8,141 50,217.8 228.6,396.4 50,575 126.8,651.8    305.4,473.2 484,651.8 560.8,575 382.2,396.4  ",
                fill: "#E44061"
            })], -1)]))) : ur("", !0)])),
            _: 1
        }), t.button_mode.text ? (Gi(), er("span", Zl, "Saving...")) : (Gi(), er("span", Xl, "Update CSS Mode"))])]), n[14] || (n[14] = sr("input", {
            type: "hidden",
            name: "config_key",
            value: "speed_css"
        }, null, -1))], 544)])) : (Gi(), er("div", Ql, [ar(To)]))])]), sr("div", ec, [sr("div", tc, [t.dashboardData.cache_data ? (Gi(), er("div", nc, [sr("form", {
            onSubmit: n[2] || (n[2] = Lo(((...e) => t.submitForm && t.submitForm(...e)), ["prevent"])),
            class: "max-w-xl mx-auto",
            "data-ref": "selectorForm",
            ref: "selectorForm"
        }, [sr("div", ic, [(Gi(), er("svg", {
            class: V([e.iconclass, "mr-2"]),
            viewBox: "0 0 24 24",
            fill: "none"
        }, n[15] || (n[15] = [sr("path", {
            d: "M9.41436 6.99991L4.41436 11.9999L9.41436 16.9999L8.00015 18.4141L1.58594 11.9999L8.00015 5.58569L9.41436 6.99991Z"
        }, null, -1), sr("path", {
            d: "M16.0002 5.58569L22.4144 11.9999L16.0002 18.4141L14.5859 16.9999L19.5859 11.9999L14.5859 6.99991L16.0002 5.58569Z"
        }, null, -1)]), 2)), n[16] || (n[16] = sr("h5", {
            class: "text-lg font-bold leading-none text-gray-900 dark:text-white"
        }, "Force Include Selectors", -1))]), Zt(sr("textarea", {
            id: "include_patterns",
            name: "include_patterns",
            class: "h-32 bg-white block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
            "onUpdate:modelValue": n[1] || (n[1] = e => t.include_patterns = e),
            style: {
                "box-shadow": "inherit!important"
            }
        }, null, 512), [
            [Co, t.include_patterns]
        ]), sr("p", rc, K(t.include_patterns_helper), 1), sr("button", oc, [sr("span", sc, [t.button_selectors.spinner ? (Gi(), er("svg", ac, n[17] || (n[17] = [sr("path", {
            d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        }, null, -1), sr("path", {
            d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        }, null, -1)]))) : ur("", !0), ar(Wr, {
            "enter-active-class": "transition-opacity duration-700 ease-out",
            "enter-from-class": "opacity-0",
            "enter-to-class": "opacity-100",
            "leave-active-class": "transition-opacity duration-0",
            "leave-from-class": "opacity-100",
            "leave-to-class": "opacity-0",
            mode: "out-in"
        }, {
            default: Gt((() => [t.button_selectors.success ? (Gi(), er("svg", lc, n[18] || (n[18] = [sr("g", null, [sr("polygon", {
                class: "st0",
                points: "434.8,49 174.2,309.7 76.8,212.3 0,289.2 174.1,463.3 196.6,440.9 196.6,440.9 511.7,125.8 434.8,49",
                fill: "#41AD49"
            })], -1)]))) : ur("", !0), t.button_selectors.failure ? (Gi(), er("svg", cc, n[19] || (n[19] = [sr("g", null, [sr("polygon", {
                class: "st0",
                points: "382.2,396.4 560.8,217.8 484,141 305.4,319.6 126.8,141 50,217.8 228.6,396.4 50,575 126.8,651.8    305.4,473.2 484,651.8 560.8,575 382.2,396.4  ",
                fill: "#E44061"
            })], -1)]))) : ur("", !0)])),
            _: 1
        }), t.button_selectors.text ? (Gi(), er("span", dc, "Saving...")) : (Gi(), er("span", uc, "Update Selectors"))])]), n[20] || (n[20] = sr("input", {
            type: "hidden",
            name: "config_key",
            value: "speed_css"
        }, null, -1))], 544)])) : (Gi(), er("div", hc, [ar(To)]))])])])) : (Gi(), er("div", pc, [ar(To, {
            mr: "4",
            width: "max-w-xl"
        }), ar(To, {
            width: "max-w-xs"
        })]))]))
    }),
    mc = {
        class: "flex flex-wrap"
    },
    vc = {
        class: "w-full p-2 mr-4"
    },
    yc = {
        class: "flex items-left mb-4"
    },
    bc = ["innerHTML"],
    wc = {
        class: "w-full p-4 ml-2 mr-4 mb-4 bg-white border border-gray-200 rounded-lg shadow"
    },
    _c = {
        class: "flow-root"
    },
    xc = {
        id: "myTabContent"
    },
    kc = {
        class: "",
        id: "tab1",
        role: "tabpanel",
        "aria-labelledby": "tab1-tab"
    },
    Ec = {
        key: 0,
        class: "ml-3"
    },
    Cc = {
        class: "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    },
    Sc = ["onClick"],
    Oc = {
        class: ""
    },
    Lc = {
        class: ""
    },
    Ac = {
        key: 1,
        class: "flex flex-wrap mt-4"
    },
    Dc = {
        class: "hidden ml-3",
        id: "tab2",
        role: "tabpanel",
        "aria-labelledby": "tab2-tab"
    },
    Tc = {
        key: 0,
        class: "ml-3"
    },
    Ic = {
        class: "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    },
    Mc = ["onClick"],
    jc = {
        class: "hidden ml-3",
        id: "tab3",
        role: "tabpanel",
        "aria-labelledby": "tab3-tab"
    },
    Pc = {
        key: 0,
        class: "ml-3"
    },
    Rc = {
        class: "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    },
    Fc = ["onClick"],
    Bc = {
        key: 0,
        class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full p-4",
        id: "my-modal"
    },
    Hc = {
        class: "relative top-20 mx-auto w-full max-w-2xl max-h-full"
    },
    Nc = {
        class: "relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5"
    },
    zc = {
        class: "flex justify-between items-center pb-1 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600"
    },
    Vc = {
        class: "text-lg font-semibold text-gray-900 dark:text-white"
    },
    Uc = {
        class: "space-y-6"
    },
    qc = {
        class: "w-full"
    },
    Wc = {
        class: "w-1/2 bg-gray-200"
    },
    Kc = {
        key: 0
    },
    $c = ["title"],
    Yc = {
        class: "w-1/2 bg-gray-100"
    },
    Jc = {
        key: 0
    },
    Gc = ["title"],
    Zc = {
        data: () => ({
            stats_data: null,
            by_path: null,
            by_plugin: null,
            by_post_type: null,
            sortKey: "sortkey",
            sortOrder: "asc",
            showModal: !1,
            selectedPlugin: "",
            selectedUrls: [],
            emptyUrls: {},
            foundUrls: {}
        }),
        mounted() {
            initFlowbite(), this.fetchData()
        },
        computed: {
            allUniqueKeys() {
                const e = Object.keys(this.emptyUrls),
                    t = Object.keys(this.foundUrls);
                return Array.from(new Set([...e, ...t]))
            },
            sortedStatsData() {
                return this.by_plugin ? this.sortData(this.by_plugin, this.sortKey, this.sortOrder) : []
            },
            sortedByPathData() {
                return this.by_path ? this.sortData(this.by_path, this.sortKey, this.sortOrder) : []
            },
            sortedByPostType() {
                return this.by_post_type ? this.sortData(this.by_post_type, this.sortKey, this.sortOrder) : []
            }
        },
        methods: {
            printPlugins(e) {
                if (void 0 !== e && void 0 !== e.plugins) return e.plugins.join("\n")
            },
            sortData: (e, t, n) => Object.values(e).sort(((e, i) => {
                let r, o;
                return "sortkey" === t ? (r = e[t], o = i[t]) : "empty_css_count" === t ? (r = e.empty_css_count, o = i.empty_css_count) : "found_css_count" === t && (r = e.found_css_count, o = i.found_css_count), r < o ? "asc" === n ? -1 : 1 : r > o ? "asc" === n ? 1 : -1 : 0
            })),
            sortTable(e) {
                this.sortKey === e ? this.sortOrder = "asc" === this.sortOrder ? "desc" : "asc" : (this.sortKey = e, this.sortOrder = "asc")
            },
            fetchData() {
                ja.get("/wp-json/speedifypress/get_css_data").then((e => {
                    this.stats_data = e.data.stats_data, this.by_path = this.stats_data.plugin_stats.by_path, this.by_plugin = this.stats_data.plugin_stats.by_plugin, this.by_post_type = this.stats_data.plugin_stats.by_post_type
                })).catch((e => {
                    console.error(e)
                }))
            },
            openModal(e, t) {
                this.selectedPlugin = e, this.emptyUrls = Array.isArray(t.empty_urls) ? {} : t.empty_urls || {}, this.foundUrls = Array.isArray(t.found_urls) ? {} : t.found_urls || {}, this.showModal = !0
            },
            closeModal() {
                this.showModal = !1
            }
        }
    },
    Xc = Object.assign(Zc, {
        __name: "Stats",
        props: {
            icon: {
                type: String,
                required: !1
            }
        },
        setup: e => (t, n) => (Gi(), er("div", null, [sr("div", mc, [sr("div", vc, [sr("div", yc, [sr("span", {
            innerHTML: e.icon,
            class: "mr-2"
        }, null, 8, bc), n[10] || (n[10] = sr("h5", {
            class: "text-xl font-bold leading-none text-raisin dark:text-white"
        }, "CSS Stats", -1))]), n[11] || (n[11] = sr("hr", {
            class: "h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
        }, null, -1))]), sr("div", wc, [n[12] || (n[12] = sr("div", {
            class: "text-sm font-medium text-center text-gray-500"
        }, [sr("ul", {
            class: "flex flex-wrap -mb-px",
            id: "myTab",
            "data-tabs-toggle": "#myTabContent",
            role: "tablist"
        }, [sr("li", {
            class: "mr-2",
            role: "presentation"
        }, [sr("button", {
            class: "inline-block p-4 border-b-2 rounded-t-lg",
            id: "tab1-tab",
            "data-tabs-target": "#tab1",
            type: "button",
            role: "tab",
            "aria-controls": "tab1",
            "aria-selected": "true"
        }, "By Plugin Folder")]), sr("li", {
            class: "mr-2",
            role: "presentation"
        }, [sr("button", {
            class: "inline-block p-4 border-b-2 rounded-t-lg",
            id: "tab2-tab",
            "data-tabs-target": "#tab2",
            type: "button",
            role: "tab",
            "aria-controls": "tab2",
            "aria-selected": "false"
        }, "By Path")]), sr("li", {
            class: "mr-2",
            role: "presentation"
        }, [sr("button", {
            class: "inline-block p-4 border-b-2 rounded-t-lg",
            id: "tab3-tab",
            "data-tabs-target": "#tab3",
            type: "button",
            role: "tab",
            "aria-controls": "tab2",
            "aria-selected": "false"
        }, "By Post Types")])])], -1)), sr("div", _c, [sr("div", xc, [sr("div", kc, [t.stats_data ? (Gi(), er("div", Ec, [sr("p", null, [sr("table", Cc, [sr("thead", null, [sr("tr", null, [sr("td", {
            onClick: n[0] || (n[0] = e => t.sortTable("sortkey")),
            class: "font-bold cursor-pointer w-3/5"
        }), sr("td", {
            onClick: n[1] || (n[1] = e => t.sortTable("empty_css_count")),
            class: "font-bold cursor-pointer"
        }, "Unused"), sr("td", {
            onClick: n[2] || (n[2] = e => t.sortTable("found_css_count")),
            class: "font-bold cursor-pointer"
        }, "Used")])]), sr("tbody", null, [(Gi(!0), er(qi, null, Bn(t.sortedStatsData, ((e, n, i) => (Gi(), er("tr", {
            onClick: n => t.openModal(e.sortkey, e),
            key: n,
            class: V({
                "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer": i % 2 == 0,
                "hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer": i % 2 != 0
            })
        }, [sr("td", null, K(e.sortkey), 1), sr("td", Oc, K(e.empty_css_count), 1), sr("td", Lc, K(e.found_css_count), 1)], 10, Sc)))), 128))])])])])) : (Gi(), er("div", Ac, [ar(To, {
            mr: "4",
            width: "full"
        })]))]), sr("div", Dc, [t.by_path ? (Gi(), er("div", Tc, [sr("p", null, [sr("table", Ic, [sr("thead", null, [sr("tr", null, [sr("td", {
            onClick: n[3] || (n[3] = e => t.sortTable("sortkey")),
            class: "font-bold cursor-pointer w-3/5"
        }), sr("td", {
            onClick: n[4] || (n[4] = e => t.sortTable("empty_css_count")),
            class: "font-bold cursor-pointer"
        }, "Unused"), sr("td", {
            onClick: n[5] || (n[5] = e => t.sortTable("found_css_count")),
            class: "font-bold cursor-pointer"
        }, "Used")])]), sr("tbody", null, [(Gi(!0), er(qi, null, Bn(t.sortedByPathData, ((e, n, i) => (Gi(), er("tr", {
            onClick: n => t.openModal(e.sortkey, e),
            key: n,
            class: V({
                "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer": i % 2 == 0,
                "hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer": i % 2 != 0
            })
        }, [sr("td", null, K(e.sortkey), 1), sr("td", null, K(Object.keys(e.empty_urls).length), 1), sr("td", null, K(Object.keys(e.found_urls).length), 1)], 10, Mc)))), 128))])])])])) : ur("", !0)]), sr("div", jc, [t.by_post_type ? (Gi(), er("div", Pc, [sr("p", null, [sr("table", Rc, [sr("thead", null, [sr("tr", null, [sr("td", {
            onClick: n[6] || (n[6] = e => t.sortTable("sortkey")),
            class: "font-bold cursor-pointer w-3/5"
        }), sr("td", {
            onClick: n[7] || (n[7] = e => t.sortTable("empty_css_count")),
            class: "font-bold cursor-pointer"
        }, "Unused"), sr("td", {
            onClick: n[8] || (n[8] = e => t.sortTable("found_css_count")),
            class: "font-bold cursor-pointer"
        }, "Used")])]), sr("tbody", null, [(Gi(!0), er(qi, null, Bn(t.sortedByPostType, ((e, n, i) => (Gi(), er("tr", {
            onClick: n => t.openModal(e.sortkey, e),
            key: n,
            class: V({
                "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer": i % 2 == 0,
                "hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer": i % 2 != 0
            })
        }, [sr("td", null, K(e.sortkey), 1), sr("td", null, K(Object.keys(e.empty_urls).length), 1), sr("td", null, K(Object.keys(e.found_urls).length), 1)], 10, Fc)))), 128))])])])])) : ur("", !0)])])])])]), t.showModal ? (Gi(), er("div", Bc, [sr("div", Hc, [sr("div", Nc, [sr("div", zc, [sr("h3", Vc, " URL paths for " + K(t.selectedPlugin), 1), sr("button", {
            onClick: n[9] || (n[9] = (...e) => t.closeModal && t.closeModal(...e)),
            type: "button",
            class: "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white",
            "data-modal-toggle": "defaultModal"
        }, n[13] || (n[13] = [sr("svg", {
            "aria-hidden": "true",
            class: "w-5 h-5",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            xmlns: "http://www.w3.org/2000/svg"
        }, [sr("path", {
            "fill-rule": "evenodd",
            d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
            "clip-rule": "evenodd"
        })], -1), sr("span", {
            class: "sr-only"
        }, "Close modal", -1)]))]), sr("div", Uc, [sr("table", qc, [n[16] || (n[16] = sr("thead", null, [sr("tr", null, [sr("th", {
            class: "font-bold w-1/2 bg-gray-200"
        }, "Unused"), sr("th", {
            class: "font-bold w-1/2 bg-gray-100"
        }, "Used")])], -1)), sr("tbody", null, [(Gi(!0), er(qi, null, Bn(t.allUniqueKeys, (e => (Gi(), er("tr", {
            key: e
        }, [sr("td", Wc, [t.emptyUrls[e] ? (Gi(), er("span", Kc, [cr(K(e) + " (", 1), sr("span", {
            class: "border-b border-b-[1px] border-dotted border-gray-700",
            title: t.printPlugins(t.emptyUrls[e])
        }, K(t.emptyUrls[e].count), 9, $c), n[14] || (n[14] = cr(")"))])) : ur("", !0)]), sr("td", Yc, [t.foundUrls[e] ? (Gi(), er("span", Jc, [cr(K(e) + " (", 1), sr("span", {
            class: "border-b border-b-[1px] border-dotted border-gray-700",
            title: t.printPlugins(t.foundUrls[e])
        }, K(t.foundUrls[e].count), 9, Gc), n[15] || (n[15] = cr(")"))])) : ur("", !0)])])))), 128))])])])])])])) : ur("", !0)]))
    }),
    Qc = {
        class: "flex flex-wrap items-start"
    },
    ed = {
        class: "w-full p-2 mr-4"
    },
    td = {
        class: "flex items-left mb-4"
    },
    nd = ["innerHTML"],
    id = {
        class: "w-full max-w-lg p-4 pt-0 mr-4 p-4 ml-2 bg-white border border-gray-200 rounded-lg shadow mb-4"
    },
    rd = {
        class: "text-gray-500 dark:text-gray-400 text-sm font-normal"
    },
    od = {
        class: "list-disc pl-7 space-y-2 text-gray-700 mt-2"
    },
    sd = {
        class: "w-full max-w-sm p-4 pt-0 mr-4 p-4 ml-2 bg-white border border-gray-200 rounded-lg shadow mb-4"
    },
    ad = {
        class: "text-gray-500 dark:text-gray-400 text-sm font-normal"
    },
    ld = {
        class: "list-disc pl-7 space-y-2 text-gray-700 mt-2"
    },
    cd = {
        class: "w-full max-w-sm p-4 pt-0 mr-4 p-4 ml-2 bg-white border border-gray-200 rounded-lg shadow mb-4"
    },
    dd = {
        class: "mb-1 mt-3 text-lg text-gray-500 md:text-xl dark:text-gray-400"
    },
    ud = {
        key: 0,
        class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full p-4",
        id: "my-modal"
    },
    hd = {
        class: "relative top-20 mx-auto w-full max-w-2xl max-h-full"
    },
    pd = {
        class: "relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5"
    },
    fd = {
        class: "flex justify-between items-center pb-1 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600"
    },
    gd = {
        data: () => ({
            showModal: !1
        }),
        mounted() {
            initFlowbite()
        },
        methods: {
            openModal() {
                this.showModal = !0
            },
            closeModal() {
                this.showModal = !1
            }
        }
    },
    md = Object.assign(gd, {
        __name: "Howtouse",
        props: {
            icon: {
                type: String,
                required: !1
            },
            iconclass: {
                type: String,
                required: !1
            }
        },
        emits: ["changeColumn"],
        setup(e, {
            emit: t
        }) {
            const n = t;

            function i(e) {
                n("changeColumn", e)
            }
            return (t, n) => (Gi(), er("div", null, [sr("div", Qc, [sr("div", ed, [sr("div", td, [sr("span", {
                innerHTML: e.icon,
                class: "mr-2"
            }, null, 8, nd), n[3] || (n[3] = sr("h5", {
                class: "text-xl font-bold leading-none text-raisin dark:text-white"
            }, "How to use", -1))]), n[4] || (n[4] = sr("hr", {
                class: "h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700"
            }, null, -1))]), sr("div", id, [n[14] || (n[14] = sr("p", {
                class: "mb-1 mt-3 text-lg text-gray-500 md:text-xl dark:text-gray-400"
            }, "Getting Started", -1)), sr("p", rd, [n[11] || (n[11] = cr(" When you first install the Plugin it will start in ")), n[12] || (n[12] = sr("span", {
                class: "bg-yellow-100 text-yellow-800 me-1 px-2.5 py-0.5 rounded dark:bg-yellow-700 dark:text-yellow-300"
            }, "Preview Mode", -1)), n[13] || (n[13] = cr(". This allows you to test the plugin as an admin and ensure that Unused CSS is being removed as expected. You should: ")), sr("ul", od, [n[6] || (n[6] = sr("li", null, [sr("strong", {
                class: "font-semibold text-gray-900 dark:text-white"
            }, "Visit some pages"), cr(" on your site.")], -1)), n[7] || (n[7] = sr("li", null, [cr("On each page you visit you should "), sr("strong", {
                class: "font-semibold text-gray-900 dark:text-white"
            }, "scroll and then wait"), cr(" a few seconds")], -1)), sr("li", null, [n[5] || (n[5] = cr("In a separate browser tab, keep open ")), sr("a", {
                onClick: n[0] || (n[0] = Lo((e => i("Dashboard")), ["prevent"])),
                href: "#"
            }, "The Dashboard")]), n[8] || (n[8] = sr("li", null, [cr("Keep an eye on the "), sr("strong", {
                class: "font-semibold text-gray-900 dark:text-white"
            }, "Cache Status."), cr(" You should see the number of files & pages increasing")], -1)), n[9] || (n[9] = sr("li", null, [sr("strong", {
                class: "font-semibold text-gray-900 dark:text-white"
            }, "Revisit the pages"), cr(" they should now load with reduced CSS (check the page source to confirm)")], -1)), n[10] || (n[10] = sr("li", null, "If not, try clearning your page cache (for most caches, it should be automatic)", -1))])])]), sr("div", sd, [n[22] || (n[22] = sr("p", {
                class: "mb-1 mt-3 text-lg text-gray-500 md:text-xl dark:text-gray-400"
            }, "Display Problems?", -1)), sr("p", ad, [n[21] || (n[21] = cr(" When you visit pages, you may find that the CSS is not displaying correctly for some elements. This is usually because the CSS is added by JavaScript or some other external process and therefore isn't captured. How to fix: ")), sr("ul", ld, [n[19] || (n[19] = dr('<li>These instructions are for Chrome <svg class="w-3 h-3 inline mt-[-3px]" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M7,12c0-2.7614136,2.2385864-5,5-5c0.7705078,0,1.4915771,0.1887207,2.1434326,0.5h8.9761353   C21.338562,3.1040039,17.03479,0,12,0C8.1478271,0,4.7286987,1.8223267,2.53302,4.6439209l4.5093994,7.7771606   C7.0304565,12.2799683,7,12.1442261,7,12z" fill="#F44336"></path><path d="M12,17c-2.6171875,0-4.7403564-2.0178833-4.9575806-4.5789185L2.53302,4.6439209   C0.9511719,6.6766968,0,9.2247314,0,12c0,6.0725098,4.5148926,11.0784302,10.3684082,11.8762817l4.4510498-7.75   C14.0164185,16.6760864,13.0466919,17,12,17z" fill="#00B060"></path><path d="M14.1434326,7.5C15.8276367,8.3043823,17,10.0090942,17,12   c0,1.7147217-0.8649902,3.2255249-2.180542,4.1262817l-4.4510498,7.75C10.9033203,23.9492188,11.4450684,24,12,24   c6.6274414,0,12-5.3726196,12-12c0-1.5926514-0.3170776-3.109436-0.8804321-4.5H14.1434326z" fill="#FFC107"></path><circle cx="12" cy="12" fill="#2196F3" id="XMLID_1302_" r="4"></circle><linearGradient gradientUnits="userSpaceOnUse" id="SVGID_1_" x1="16.3874664" x2="20.8755341" y1="5.2559662" y2="9.7440338"><stop offset="0" style="stop-color:#000000;stop-opacity:0.1;"></stop><stop offset="1" style="stop-color:#000000;stop-opacity:0;"></stop></linearGradient><path d="M16.4558716,9.7610474L23.1195679,7.5h-8.9761353   C15.1433716,7.9775391,15.9550171,8.7772827,16.4558716,9.7610474z" fill="url(#SVGID_1_)"></path><linearGradient gradientUnits="userSpaceOnUse" id="SVGID_2_" x1="1.8841199" x2="8.0149345" y1="5.2791538" y2="11.4099684"><stop offset="0" style="stop-color:#000000;stop-opacity:0.1;"></stop><stop offset="1" style="stop-color:#000000;stop-opacity:0;"></stop></linearGradient><path d="M7.8330746,9.2605782L2.5431018,4.6201715l4.4880676,7.7735615   C6.9447608,11.288991,7.2315364,10.1862135,7.8330746,9.2605782z" fill="url(#SVGID_2_)"></path><linearGradient gradientUnits="userSpaceOnUse" id="SVGID_3_" x1="10.6388721" x2="13.4027376" y1="18.0505562" y2="20.8144207"><stop offset="0" style="stop-color:#000000;stop-opacity:0.1;"></stop><stop offset="1" style="stop-color:#000000;stop-opacity:0;"></stop></linearGradient><path d="M11.7110538,16.9783745l-1.373723,6.901453l4.4880676-7.7735596   C13.9118671,16.7334709,12.813446,17.0365047,11.7110538,16.9783745z" fill="url(#SVGID_3_)"></path><linearGradient gradientUnits="userSpaceOnUse" id="XMLID_45_" x1="1.1217111" x2="22.8782883" y1="6.9273705" y2="17.0726299"><stop offset="0" style="stop-color:#FFFFFF;stop-opacity:0.2;"></stop><stop offset="1" style="stop-color:#FFFFFF;stop-opacity:0;"></stop></linearGradient><circle cx="12" cy="12" fill="url(#XMLID_45_)" id="XMLID_1304_" r="12"></circle></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></li><li>First, make sure that <span class="bg-yellow-100 text-yellow-800 me-1 px-2.5 py-0.5 rounded dark:bg-yellow-700 dark:text-yellow-300">Preview Mode</span> is enabled in this plugin</li><li>Open a tab with the incorrect CSS displaying. In a new <svg class="no-gradient w-3 h-3 inline mt-[-1px]" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="grid_system"></g><g id="_icons"><g><path d="M4,12h3h10h3c0.6,0,1-0.4,1-1s-0.4-1-1-1h-2.2l-1.5-5.8C16,2.9,14.9,2,13.6,2c-0.2,0-0.4,0.1-0.5,0.2l-0.3,0.2    c-0.4,0.3-0.9,0.3-1.3,0L11,2.2C10.8,2.1,10.6,2,10.4,2C9.1,2,8,2.9,7.7,4.2L6.2,10H4c-0.6,0-1,0.4-1,1S3.4,12,4,12z M9.6,4.6    C9.7,4.3,9.9,4.1,10.2,4l0,0c1.1,0.7,2.4,0.7,3.5,0l0,0c0.3,0.1,0.5,0.3,0.6,0.6L15,7H9L9.6,4.6z M8.5,9h6.9l0.3,1H8.3L8.5,9z"></path><path d="M17,13c-1.9,0-3.4,1.3-3.9,3h-2.3c-0.4-1.7-2-3-3.9-3c-2.2,0-4,1.8-4,4s1.8,4,4,4c1.9,0,3.4-1.3,3.9-3h2.3    c0.4,1.7,2,3,3.9,3c2.2,0,4-1.8,4-4S19.2,13,17,13z M7,19c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S8.1,19,7,19z M17,19    c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S18.1,19,17,19z"></path></g></g></svg> incognito tab, open the same page.</li><li>On each page, <strong class="font-semibold text-gray-900 dark:text-white">right click the element</strong> which isn&#39;t displaying correctly and select &quot;Inspect&quot;. </li><li>Look for the <strong class="font-semibold text-gray-900 dark:text-white">CSS class</strong> that causes the correct CSS to be loaded</li>', 5)), sr("li", null, [n[15] || (n[15] = cr("Add that CSS class to the list of ")), n[16] || (n[16] = sr("strong", {
                class: "font-semibold text-gray-900 dark:text-white"
            }, "Force Include Seletors", -1)), n[17] || (n[17] = cr(" on the ")), sr("a", {
                onClick: n[1] || (n[1] = Lo((e => i("Settings")), ["prevent"])),
                href: "#"
            }, "Settings Page"), n[18] || (n[18] = cr("."))]), n[20] || (n[20] = sr("li", null, "Clear the cache and repeat", -1))])])]), n[26] || (n[26] = dr('<div class="w-full max-w-lg p-4 pt-0 mr-4 p-4 ml-2 bg-white border border-gray-200 rounded-lg shadow xxl:mt-[-85px] mb-4"><p class="mb-1 mt-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">Using the Stats</p><p class="text-gray-500 dark:text-gray-400 text-sm font-normal"> The stats section allows you to explore how different plugins inject CSS across your site. <ul class="list-disc pl-7 space-y-2 text-gray-700 mt-2"><li>View by <strong class="font-semibold text-gray-900 dark:text-white">plugin folder, path or post type</strong>. </li><li>Click <strong class="font-semibold text-gray-900 dark:text-white">column headers</strong> to sort</li><li><strong class="font-semibold text-gray-900 dark:text-white">Click a row</strong> for detailed usage information</li></ul></p></div>', 1)), sr("div", cd, [sr("p", dd, [(Gi(), er("svg", {
                class: V([e.iconclass, "inline w-4 h-4 mt-[-3px]"]),
                viewBox: "0 0 128 128",
                "xml:space": "preserve",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink"
            }, n[23] || (n[23] = [sr("g", null, [sr("path", {
                d: "M64,1.2C29.3,1.2,1.2,29.3,1.2,64s28.2,62.8,62.8,62.8s62.8-28.2,62.8-62.8S98.7,1.2,64,1.2z M64,8.8   c13.6,0,26,4.9,35.6,13.1L84.4,37c-5.7-4.3-12.8-6.9-20.4-6.9S49.2,32.7,43.6,37L28.4,21.9C38,13.8,50.4,8.8,64,8.8z M90.2,64   c0,14.4-11.7,26.2-26.2,26.2S37.8,78.4,37.8,64S49.6,37.8,64,37.8S90.2,49.6,90.2,64z M8.8,64c0-14.1,5.3-27,14.1-36.7L38,42.4   c-4.9,5.9-7.8,13.4-7.8,21.6c0,7.7,2.6,14.8,6.9,20.4L21.9,99.6C13.8,90,8.8,77.6,8.8,64z M64,119.2c-14.1,0-27-5.3-36.7-14.1   L42.4,90c5.9,4.9,13.4,7.8,21.6,7.8s15.8-2.9,21.6-7.8l15.1,15.1C91,113.8,78.1,119.2,64,119.2z M106.1,99.6L91,84.4   c4.3-5.7,6.9-12.8,6.9-20.4c0-8.2-2.9-15.8-7.8-21.6l15.1-15.1c8.7,9.8,14.1,22.6,14.1,36.7C119.2,77.6,114.2,90,106.1,99.6z"
            })], -1)]), 2)), n[24] || (n[24] = cr(" High traffic site? Need Expert help? "))]), n[25] || (n[25] = dr('<p class="text-gray-500 dark:text-gray-400 text-sm font-normal"> Optimising high traffic <svg class="inline w-4 h-4 mt-[-3px]" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path clip-rule="evenodd" d="M198.627,398.169l-83.444-250.333   c8.616-0.453,17.232-1.359,25.396-2.266c8.616-1.359,9.522-7.71,9.069-10.881c-0.453-2.726-3.172-8.616-10.429-7.71   c-22.216,1.813-42.175,2.719-60.767,2.719c-2.266,0-4.992,0-7.257,0c40.363-58.955,107.934-97.95,185.035-97.95   c55.775,0,106.567,20.404,146.016,54.416c-12.248,2.265-24.935,10.882-28.575,23.13c-10.873,35.372,10.437,58.502,20.42,73.914   c10.874,17.232,14.968,35.832,16.779,55.33c2.266,27.208-9.077,61.673-16.326,87.983l-23.591,70.289l-82.991-248.974   c8.624-0.453,17.232-1.359,25.403-2.266c9.062-1.359,9.515-7.71,9.062-10.881c0-2.726-2.719-8.163-10.421-7.71   c-22.231,2.266-41.729,2.719-60.321,2.719s-38.543-0.453-60.768-2.719c-7.257-0.453-9.975,4.984-10.428,7.71   c0,3.171,0.453,9.522,9.069,10.881c7.71,0.906,15.874,1.813,23.583,2.266l36.277,98.864L198.627,398.169z M480.254,256.23   c0,80.257-42.637,151-106.583,190.464l52.167-148.749c10.421-28.122,22.216-56.689,29.012-86.163   c3.625-16.326,5.453-32.652,5-49.432C472.989,190.917,480.254,222.664,480.254,256.23L480.254,256.23z M256.23,480.254   c-22.231,0-43.089-3.172-63.04-9.077l65.759-197.261l71.195,193.636C306.554,475.707,282.071,480.254,256.23,480.254   L256.23,480.254z M152.375,454.85C80.718,417.214,31.747,342.394,31.747,256.23c0-30.395,5.89-58.962,16.771-85.264L152.375,454.85   z M256.23,0C114.73,0,0,114.73,0,256.23C0,397.263,114.73,512,256.23,512C397.263,512,512,397.263,512,256.23   C512,114.73,397.263,0,256.23,0L256.23,0z" fill="#0CA3D1" fill-rule="evenodd"></path></g></svg> WordPress sites and <br><svg class="inline w-5 h-5 mt-[-3px]" viewBox="0 0 256 153" width="256px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M23.7586644,0 L232.137438,0 C245.324643,0 256,10.6753566 256,23.8625617 L256,103.404434 C256,116.591639 245.324643,127.266996 232.137438,127.266996 L157.409942,127.266996 L167.666657,152.385482 L122.558043,127.266996 L23.8633248,127.266996 C10.6761196,127.266996 0.000763038458,116.591639 0.000763038458,103.404434 L0.000763038458,23.8625617 C-0.10389732,10.7800169 10.5714592,0 23.7586644,0 L23.7586644,0 Z" fill="#9B5C8F"></path><path d="M14.5781994,21.7495935 C16.0351099,19.7723577 18.2204758,18.7317073 21.1342969,18.5235772 C26.441614,18.1073171 29.4595002,20.604878 30.1879555,26.0162602 C33.4139717,47.7658537 36.9521831,66.1853659 40.6985246,81.2747967 L63.4887685,37.8796748 C65.5700693,33.9252033 68.1716953,31.8439024 71.2936465,31.6357724 C75.8725083,31.3235772 78.6822644,34.2373984 79.8269798,40.3772358 C82.4286059,54.2178862 85.7586872,65.9772358 89.7131587,75.9674797 C92.4188498,49.5349593 96.9977116,30.4910569 103.449744,18.7317073 C105.01072,15.8178862 107.300151,14.3609756 110.318037,14.1528455 C112.711533,13.9447154 114.896899,14.6731707 116.874134,16.2341463 C118.85137,17.795122 119.89202,19.7723577 120.100151,22.1658537 C120.204216,24.0390244 119.89202,25.6 119.0595,27.1609756 C115.000964,34.6536585 111.670882,47.2455285 108.965191,64.7284553 C106.363565,81.6910569 105.42698,94.9073171 106.05137,104.377236 C106.2595,106.978862 105.84324,109.268293 104.80259,111.245528 C103.553809,113.534959 101.680638,114.78374 99.2871424,114.99187 C96.5814514,115.2 93.7716953,113.95122 91.0660042,111.141463 C81.3879555,101.255285 73.6871424,86.4780488 68.0676303,66.8097561 C61.3034026,80.1300813 56.3082807,90.1203252 53.0822644,96.7804878 C46.942427,108.539837 41.739175,114.57561 37.3684433,114.887805 C34.5586872,115.095935 32.1651912,112.702439 30.0838904,107.707317 C24.7765733,94.0747967 19.0529961,67.7463415 12.9131587,28.7219512 C12.4968985,26.0162602 13.1212888,23.6227642 14.5781994,21.7495935 Z M238.213972,38.0878049 C234.46763,31.5317073 228.952183,27.5772358 221.563565,26.0162602 C219.586329,25.6 217.713159,25.3918699 215.944053,25.3918699 C205.953809,25.3918699 197.836736,30.595122 191.488768,41.001626 C186.077386,49.8471545 183.371695,59.6292683 183.371695,70.3479675 C183.371695,78.3609756 185.036736,85.2292683 188.366817,90.9528455 C192.113159,97.5089431 197.628606,101.463415 205.017224,103.02439 C206.99446,103.44065 208.86763,103.64878 210.636736,103.64878 C220.731045,103.64878 228.848118,98.4455285 235.09202,88.0390244 C240.503403,79.0894309 243.209094,69.3073171 243.209094,58.5886179 C243.313159,50.4715447 241.544053,43.7073171 238.213972,38.0878049 Z M225.101777,66.9138211 C223.644866,73.7821138 221.04324,78.8813008 217.192834,82.3154472 C214.174947,85.0211382 211.365191,86.1658537 208.763565,85.6455285 C206.266004,85.1252033 204.184703,82.9398374 202.623728,78.8813008 C201.374947,75.6552846 200.750557,72.4292683 200.750557,69.4113821 C200.750557,66.8097561 200.958687,64.2081301 201.479012,61.8146341 C202.415598,57.5479675 204.184703,53.3853659 206.99446,49.4308943 C210.428606,44.3317073 214.070882,42.2504065 217.817224,42.9788618 C220.314785,43.499187 222.396086,45.6845528 223.957061,49.7430894 C225.205842,52.9691057 225.830232,56.195122 225.830232,59.2130081 C225.830232,61.9186992 225.622102,64.5203252 225.101777,66.9138211 Z M173.069256,38.0878049 C169.322915,31.5317073 163.703403,27.5772358 156.41885,26.0162602 C154.441614,25.6 152.568443,25.3918699 150.799338,25.3918699 C140.809094,25.3918699 132.69202,30.595122 126.344053,41.001626 C120.932671,49.8471545 118.22698,59.6292683 118.22698,70.3479675 C118.22698,78.3609756 119.89202,85.2292683 123.222102,90.9528455 C126.968443,97.5089431 132.48389,101.463415 139.872508,103.02439 C141.849744,103.44065 143.722915,103.64878 145.49202,103.64878 C155.586329,103.64878 163.703403,98.4455285 169.947305,88.0390244 C175.358687,79.0894309 178.064378,69.3073171 178.064378,58.5886179 C178.064378,50.4715447 176.399338,43.7073171 173.069256,38.0878049 Z M159.852996,66.9138211 C158.396086,73.7821138 155.79446,78.8813008 151.944053,82.3154472 C148.926167,85.0211382 146.116411,86.1658537 143.514785,85.6455285 C141.017224,85.1252033 138.935923,82.9398374 137.374947,78.8813008 C136.126167,75.6552846 135.501777,72.4292683 135.501777,69.4113821 C135.501777,66.8097561 135.709907,64.2081301 136.230232,61.8146341 C137.166817,57.5479675 138.935923,53.3853659 141.745679,49.4308943 C145.179825,44.3317073 148.822102,42.2504065 152.568443,42.9788618 C155.066004,43.499187 157.147305,45.6845528 158.708281,49.7430894 C159.957061,52.9691057 160.581451,56.195122 160.581451,59.2130081 C160.685516,61.9186992 160.373321,64.5203252 159.852996,66.9138211 L159.852996,66.9138211 L159.852996,66.9138211 Z" fill="#FFFFFF"></path></g></svg> WooCommerce stores is not easy. If your business needs an expert to guide you then <a href="">get in touch</a> and let&#39;s talk. </p>', 1))])]), t.showModal ? (Gi(), er("div", ud, [sr("div", hd, [sr("div", pd, [sr("div", fd, [n[28] || (n[28] = sr("h3", {
                class: "text-lg font-semibold text-gray-900 dark:text-white"
            }, " How to check Unused CSS is loading ", -1)), sr("button", {
                onClick: n[2] || (n[2] = (...e) => t.closeModal && t.closeModal(...e)),
                type: "button",
                class: "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white",
                "data-modal-toggle": "defaultModal"
            }, n[27] || (n[27] = [sr("svg", {
                "aria-hidden": "true",
                class: "w-5 h-5",
                fill: "currentColor",
                viewBox: "0 0 20 20",
                xmlns: "http://www.w3.org/2000/svg"
            }, [sr("path", {
                "fill-rule": "evenodd",
                d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                "clip-rule": "evenodd"
            })], -1), sr("span", {
                class: "sr-only"
            }, "Close modal", -1)]))]), n[29] || (n[29] = sr("div", {
                class: "space-y-6"
            }, null, -1))])])])) : ur("", !0)]))
        }
    });
var vd = function() {
        function e(e, t) {
            void 0 === t && (t = []), this._eventType = e, this._eventFunctions = t
        }
        return e.prototype.init = function() {
            var e = this;
            this._eventFunctions.forEach((function(t) {
                "undefined" != typeof window && window.addEventListener(e._eventType, t)
            }))
        }, e
    }(),
    yd = new(function() {
        function e() {
            this._instances = {
                Accordion: {},
                Carousel: {},
                Collapse: {},
                Dial: {},
                Dismiss: {},
                Drawer: {},
                Dropdown: {},
                Modal: {},
                Popover: {},
                Tabs: {},
                Tooltip: {},
                InputCounter: {},
                CopyClipboard: {},
                Datepicker: {}
            }
        }
        return e.prototype.addInstance = function(e, t, n, i) {
            if (void 0 === i && (i = !1), !this._instances[e]) return console.warn("Flowbite: Component ".concat(e, " does not exist.")), !1;
            !this._instances[e][n] || i ? (i && this._instances[e][n] && this._instances[e][n].destroyAndRemoveInstance(), this._instances[e][n || this._generateRandomId()] = t) : console.warn("Flowbite: Instance with ID ".concat(n, " already exists."))
        }, e.prototype.getAllInstances = function() {
            return this._instances
        }, e.prototype.getInstances = function(e) {
            return this._instances[e] ? this._instances[e] : (console.warn("Flowbite: Component ".concat(e, " does not exist.")), !1)
        }, e.prototype.getInstance = function(e, t) {
            if (this._componentAndInstanceCheck(e, t)) {
                if (this._instances[e][t]) return this._instances[e][t];
                console.warn("Flowbite: Instance with ID ".concat(t, " does not exist."))
            }
        }, e.prototype.destroyAndRemoveInstance = function(e, t) {
            this._componentAndInstanceCheck(e, t) && (this.destroyInstanceObject(e, t), this.removeInstance(e, t))
        }, e.prototype.removeInstance = function(e, t) {
            this._componentAndInstanceCheck(e, t) && delete this._instances[e][t]
        }, e.prototype.destroyInstanceObject = function(e, t) {
            this._componentAndInstanceCheck(e, t) && this._instances[e][t].destroy()
        }, e.prototype.instanceExists = function(e, t) {
            return !!this._instances[e] && !!this._instances[e][t]
        }, e.prototype._generateRandomId = function() {
            return Math.random().toString(36).substr(2, 9)
        }, e.prototype._componentAndInstanceCheck = function(e, t) {
            return this._instances[e] ? !!this._instances[e][t] || (console.warn("Flowbite: Instance with ID ".concat(t, " does not exist.")), !1) : (console.warn("Flowbite: Component ".concat(e, " does not exist.")), !1)
        }, e
    }());
"undefined" != typeof window && (window.FlowbiteInstances = yd);
var bd = function() {
        return bd = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, bd.apply(this, arguments)
    },
    wd = {
        alwaysOpen: !1,
        activeClasses: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
        inactiveClasses: "text-gray-500 dark:text-gray-400",
        onOpen: function() {},
        onClose: function() {},
        onToggle: function() {}
    },
    _d = {
        id: null,
        override: !0
    },
    xd = function() {
        function e(e, t, n, i) {
            void 0 === e && (e = null), void 0 === t && (t = []), void 0 === n && (n = wd), void 0 === i && (i = _d), this._instanceId = i.id ? i.id : e.id, this._accordionEl = e, this._items = t, this._options = bd(bd({}, wd), n), this._initialized = !1, this.init(), yd.addInstance("Accordion", this, this._instanceId, i.override)
        }
        return e.prototype.init = function() {
            var e = this;
            this._items.length && !this._initialized && (this._items.forEach((function(t) {
                t.active && e.open(t.id);
                var n = function() {
                    e.toggle(t.id)
                };
                t.triggerEl.addEventListener("click", n), t.clickHandler = n
            })), this._initialized = !0)
        }, e.prototype.destroy = function() {
            this._items.length && this._initialized && (this._items.forEach((function(e) {
                e.triggerEl.removeEventListener("click", e.clickHandler), delete e.clickHandler
            })), this._initialized = !1)
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Accordion", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.getItem = function(e) {
            return this._items.filter((function(t) {
                return t.id === e
            }))[0]
        }, e.prototype.open = function(e) {
            var t, n, i = this,
                r = this.getItem(e);
            this._options.alwaysOpen || this._items.map((function(e) {
                var t, n;
                e !== r && ((t = e.triggerEl.classList).remove.apply(t, i._options.activeClasses.split(" ")), (n = e.triggerEl.classList).add.apply(n, i._options.inactiveClasses.split(" ")), e.targetEl.classList.add("hidden"), e.triggerEl.setAttribute("aria-expanded", "false"), e.active = !1, e.iconEl && e.iconEl.classList.add("rotate-180"))
            })), (t = r.triggerEl.classList).add.apply(t, this._options.activeClasses.split(" ")), (n = r.triggerEl.classList).remove.apply(n, this._options.inactiveClasses.split(" ")), r.triggerEl.setAttribute("aria-expanded", "true"), r.targetEl.classList.remove("hidden"), r.active = !0, r.iconEl && r.iconEl.classList.remove("rotate-180"), this._options.onOpen(this, r)
        }, e.prototype.toggle = function(e) {
            var t = this.getItem(e);
            t.active ? this.close(e) : this.open(e), this._options.onToggle(this, t)
        }, e.prototype.close = function(e) {
            var t, n, i = this.getItem(e);
            (t = i.triggerEl.classList).remove.apply(t, this._options.activeClasses.split(" ")), (n = i.triggerEl.classList).add.apply(n, this._options.inactiveClasses.split(" ")), i.targetEl.classList.add("hidden"), i.triggerEl.setAttribute("aria-expanded", "false"), i.active = !1, i.iconEl && i.iconEl.classList.add("rotate-180"), this._options.onClose(this, i)
        }, e.prototype.updateOnOpen = function(e) {
            this._options.onOpen = e
        }, e.prototype.updateOnClose = function(e) {
            this._options.onClose = e
        }, e.prototype.updateOnToggle = function(e) {
            this._options.onToggle = e
        }, e
    }();

function kd() {
    document.querySelectorAll("[data-accordion]").forEach((function(e) {
        var t = e.getAttribute("data-accordion"),
            n = e.getAttribute("data-active-classes"),
            i = e.getAttribute("data-inactive-classes"),
            r = [];
        e.querySelectorAll("[data-accordion-target]").forEach((function(t) {
            if (t.closest("[data-accordion]") === e) {
                var n = {
                    id: t.getAttribute("data-accordion-target"),
                    triggerEl: t,
                    targetEl: document.querySelector(t.getAttribute("data-accordion-target")),
                    iconEl: t.querySelector("[data-accordion-icon]"),
                    active: "true" === t.getAttribute("aria-expanded")
                };
                r.push(n)
            }
        })), new xd(e, r, {
            alwaysOpen: "open" === t,
            activeClasses: n || wd.activeClasses,
            inactiveClasses: i || wd.inactiveClasses
        })
    }))
}
"undefined" != typeof window && (window.Accordion = xd, window.initAccordions = kd);
var Ed = function() {
        return Ed = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, Ed.apply(this, arguments)
    },
    Cd = {
        onCollapse: function() {},
        onExpand: function() {},
        onToggle: function() {}
    },
    Sd = {
        id: null,
        override: !0
    },
    Od = function() {
        function e(e, t, n, i) {
            void 0 === e && (e = null), void 0 === t && (t = null), void 0 === n && (n = Cd), void 0 === i && (i = Sd), this._instanceId = i.id ? i.id : e.id, this._targetEl = e, this._triggerEl = t, this._options = Ed(Ed({}, Cd), n), this._visible = !1, this._initialized = !1, this.init(), yd.addInstance("Collapse", this, this._instanceId, i.override)
        }
        return e.prototype.init = function() {
            var e = this;
            this._triggerEl && this._targetEl && !this._initialized && (this._triggerEl.hasAttribute("aria-expanded") ? this._visible = "true" === this._triggerEl.getAttribute("aria-expanded") : this._visible = !this._targetEl.classList.contains("hidden"), this._clickHandler = function() {
                e.toggle()
            }, this._triggerEl.addEventListener("click", this._clickHandler), this._initialized = !0)
        }, e.prototype.destroy = function() {
            this._triggerEl && this._initialized && (this._triggerEl.removeEventListener("click", this._clickHandler), this._initialized = !1)
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Collapse", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.collapse = function() {
            this._targetEl.classList.add("hidden"), this._triggerEl && this._triggerEl.setAttribute("aria-expanded", "false"), this._visible = !1, this._options.onCollapse(this)
        }, e.prototype.expand = function() {
            this._targetEl.classList.remove("hidden"), this._triggerEl && this._triggerEl.setAttribute("aria-expanded", "true"), this._visible = !0, this._options.onExpand(this)
        }, e.prototype.toggle = function() {
            this._visible ? this.collapse() : this.expand(), this._options.onToggle(this)
        }, e.prototype.updateOnCollapse = function(e) {
            this._options.onCollapse = e
        }, e.prototype.updateOnExpand = function(e) {
            this._options.onExpand = e
        }, e.prototype.updateOnToggle = function(e) {
            this._options.onToggle = e
        }, e
    }();

function Ld() {
    document.querySelectorAll("[data-collapse-toggle]").forEach((function(e) {
        var t = e.getAttribute("data-collapse-toggle"),
            n = document.getElementById(t);
        n ? yd.instanceExists("Collapse", n.getAttribute("id")) ? new Od(n, e, {}, {
            id: n.getAttribute("id") + "_" + yd._generateRandomId()
        }) : new Od(n, e) : console.error('The target element with id "'.concat(t, '" does not exist. Please check the data-collapse-toggle attribute.'))
    }))
}
"undefined" != typeof window && (window.Collapse = Od, window.initCollapses = Ld);
var Ad = function() {
        return Ad = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, Ad.apply(this, arguments)
    },
    Dd = {
        defaultPosition: 0,
        indicators: {
            items: [],
            activeClasses: "bg-white dark:bg-gray-800",
            inactiveClasses: "bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
        },
        interval: 3e3,
        onNext: function() {},
        onPrev: function() {},
        onChange: function() {}
    },
    Td = {
        id: null,
        override: !0
    },
    Id = function() {
        function e(e, t, n, i) {
            void 0 === e && (e = null), void 0 === t && (t = []), void 0 === n && (n = Dd), void 0 === i && (i = Td), this._instanceId = i.id ? i.id : e.id, this._carouselEl = e, this._items = t, this._options = Ad(Ad(Ad({}, Dd), n), {
                indicators: Ad(Ad({}, Dd.indicators), n.indicators)
            }), this._activeItem = this.getItem(this._options.defaultPosition), this._indicators = this._options.indicators.items, this._intervalDuration = this._options.interval, this._intervalInstance = null, this._initialized = !1, this.init(), yd.addInstance("Carousel", this, this._instanceId, i.override)
        }
        return e.prototype.init = function() {
            var e = this;
            this._items.length && !this._initialized && (this._items.map((function(e) {
                e.el.classList.add("absolute", "inset-0", "transition-transform", "transform")
            })), this.getActiveItem() ? this.slideTo(this.getActiveItem().position) : this.slideTo(0), this._indicators.map((function(t, n) {
                t.el.addEventListener("click", (function() {
                    e.slideTo(n)
                }))
            })), this._initialized = !0)
        }, e.prototype.destroy = function() {
            this._initialized && (this._initialized = !1)
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Carousel", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.getItem = function(e) {
            return this._items[e]
        }, e.prototype.slideTo = function(e) {
            var t = this._items[e],
                n = {
                    left: 0 === t.position ? this._items[this._items.length - 1] : this._items[t.position - 1],
                    middle: t,
                    right: t.position === this._items.length - 1 ? this._items[0] : this._items[t.position + 1]
                };
            this._rotate(n), this._setActiveItem(t), this._intervalInstance && (this.pause(), this.cycle()), this._options.onChange(this)
        }, e.prototype.next = function() {
            var e = this.getActiveItem(),
                t = null;
            t = e.position === this._items.length - 1 ? this._items[0] : this._items[e.position + 1], this.slideTo(t.position), this._options.onNext(this)
        }, e.prototype.prev = function() {
            var e = this.getActiveItem(),
                t = null;
            t = 0 === e.position ? this._items[this._items.length - 1] : this._items[e.position - 1], this.slideTo(t.position), this._options.onPrev(this)
        }, e.prototype._rotate = function(e) {
            if (this._items.map((function(e) {
                    e.el.classList.add("hidden")
                })), 1 === this._items.length) return e.middle.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-10"), void e.middle.el.classList.add("translate-x-0", "z-20");
            e.left.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20"), e.left.el.classList.add("-translate-x-full", "z-10"), e.middle.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-10"), e.middle.el.classList.add("translate-x-0", "z-30"), e.right.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-30"), e.right.el.classList.add("translate-x-full", "z-20")
        }, e.prototype.cycle = function() {
            var e = this;
            "undefined" != typeof window && (this._intervalInstance = window.setInterval((function() {
                e.next()
            }), this._intervalDuration))
        }, e.prototype.pause = function() {
            clearInterval(this._intervalInstance)
        }, e.prototype.getActiveItem = function() {
            return this._activeItem
        }, e.prototype._setActiveItem = function(e) {
            var t, n, i = this;
            this._activeItem = e;
            var r = e.position;
            this._indicators.length && (this._indicators.map((function(e) {
                var t, n;
                e.el.setAttribute("aria-current", "false"), (t = e.el.classList).remove.apply(t, i._options.indicators.activeClasses.split(" ")), (n = e.el.classList).add.apply(n, i._options.indicators.inactiveClasses.split(" "))
            })), (t = this._indicators[r].el.classList).add.apply(t, this._options.indicators.activeClasses.split(" ")), (n = this._indicators[r].el.classList).remove.apply(n, this._options.indicators.inactiveClasses.split(" ")), this._indicators[r].el.setAttribute("aria-current", "true"))
        }, e.prototype.updateOnNext = function(e) {
            this._options.onNext = e
        }, e.prototype.updateOnPrev = function(e) {
            this._options.onPrev = e
        }, e.prototype.updateOnChange = function(e) {
            this._options.onChange = e
        }, e
    }();

function Md() {
    document.querySelectorAll("[data-carousel]").forEach((function(e) {
        var t = e.getAttribute("data-carousel-interval"),
            n = "slide" === e.getAttribute("data-carousel"),
            i = [],
            r = 0;
        e.querySelectorAll("[data-carousel-item]").length && Array.from(e.querySelectorAll("[data-carousel-item]")).map((function(e, t) {
            i.push({
                position: t,
                el: e
            }), "active" === e.getAttribute("data-carousel-item") && (r = t)
        }));
        var o = [];
        e.querySelectorAll("[data-carousel-slide-to]").length && Array.from(e.querySelectorAll("[data-carousel-slide-to]")).map((function(e) {
            o.push({
                position: parseInt(e.getAttribute("data-carousel-slide-to")),
                el: e
            })
        }));
        var s = new Id(e, i, {
            defaultPosition: r,
            indicators: {
                items: o
            },
            interval: t || Dd.interval
        });
        n && s.cycle();
        var a = e.querySelector("[data-carousel-next]"),
            l = e.querySelector("[data-carousel-prev]");
        a && a.addEventListener("click", (function() {
            s.next()
        })), l && l.addEventListener("click", (function() {
            s.prev()
        }))
    }))
}
"undefined" != typeof window && (window.Carousel = Id, window.initCarousels = Md);
var jd = function() {
        return jd = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, jd.apply(this, arguments)
    },
    Pd = {
        transition: "transition-opacity",
        duration: 300,
        timing: "ease-out",
        onHide: function() {}
    },
    Rd = {
        id: null,
        override: !0
    },
    Fd = function() {
        function e(e, t, n, i) {
            void 0 === e && (e = null), void 0 === t && (t = null), void 0 === n && (n = Pd), void 0 === i && (i = Rd), this._instanceId = i.id ? i.id : e.id, this._targetEl = e, this._triggerEl = t, this._options = jd(jd({}, Pd), n), this._initialized = !1, this.init(), yd.addInstance("Dismiss", this, this._instanceId, i.override)
        }
        return e.prototype.init = function() {
            var e = this;
            this._triggerEl && this._targetEl && !this._initialized && (this._clickHandler = function() {
                e.hide()
            }, this._triggerEl.addEventListener("click", this._clickHandler), this._initialized = !0)
        }, e.prototype.destroy = function() {
            this._triggerEl && this._initialized && (this._triggerEl.removeEventListener("click", this._clickHandler), this._initialized = !1)
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Dismiss", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.hide = function() {
            var e = this;
            this._targetEl.classList.add(this._options.transition, "duration-".concat(this._options.duration), this._options.timing, "opacity-0"), setTimeout((function() {
                e._targetEl.classList.add("hidden")
            }), this._options.duration), this._options.onHide(this, this._targetEl)
        }, e.prototype.updateOnHide = function(e) {
            this._options.onHide = e
        }, e
    }();

function Bd() {
    document.querySelectorAll("[data-dismiss-target]").forEach((function(e) {
        var t = e.getAttribute("data-dismiss-target"),
            n = document.querySelector(t);
        n ? new Fd(n, e) : console.error('The dismiss element with id "'.concat(t, '" does not exist. Please check the data-dismiss-target attribute.'))
    }))
}
"undefined" != typeof window && (window.Dismiss = Fd, window.initDismisses = Bd);
var Hd = "top",
    Nd = "bottom",
    zd = "right",
    Vd = "left",
    Ud = "auto",
    qd = [Hd, Nd, zd, Vd],
    Wd = "start",
    Kd = "end",
    $d = "viewport",
    Yd = "popper",
    Jd = qd.reduce((function(e, t) {
        return e.concat([t + "-" + Wd, t + "-" + Kd])
    }), []),
    Gd = [].concat(qd, [Ud]).reduce((function(e, t) {
        return e.concat([t, t + "-" + Wd, t + "-" + Kd])
    }), []),
    Zd = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];

function Xd(e) {
    return e ? (e.nodeName || "").toLowerCase() : null
}

function Qd(e) {
    if (null == e) return window;
    if ("[object Window]" !== e.toString()) {
        var t = e.ownerDocument;
        return t && t.defaultView || window
    }
    return e
}

function eu(e) {
    return e instanceof Qd(e).Element || e instanceof Element
}

function tu(e) {
    return e instanceof Qd(e).HTMLElement || e instanceof HTMLElement
}

function nu(e) {
    return "undefined" != typeof ShadowRoot && (e instanceof Qd(e).ShadowRoot || e instanceof ShadowRoot)
}
const iu = {
    name: "applyStyles",
    enabled: !0,
    phase: "write",
    fn: function(e) {
        var t = e.state;
        Object.keys(t.elements).forEach((function(e) {
            var n = t.styles[e] || {},
                i = t.attributes[e] || {},
                r = t.elements[e];
            tu(r) && Xd(r) && (Object.assign(r.style, n), Object.keys(i).forEach((function(e) {
                var t = i[e];
                !1 === t ? r.removeAttribute(e) : r.setAttribute(e, !0 === t ? "" : t)
            })))
        }))
    },
    effect: function(e) {
        var t = e.state,
            n = {
                popper: {
                    position: t.options.strategy,
                    left: "0",
                    top: "0",
                    margin: "0"
                },
                arrow: {
                    position: "absolute"
                },
                reference: {}
            };
        return Object.assign(t.elements.popper.style, n.popper), t.styles = n, t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow),
            function() {
                Object.keys(t.elements).forEach((function(e) {
                    var i = t.elements[e],
                        r = t.attributes[e] || {},
                        o = Object.keys(t.styles.hasOwnProperty(e) ? t.styles[e] : n[e]).reduce((function(e, t) {
                            return e[t] = "", e
                        }), {});
                    tu(i) && Xd(i) && (Object.assign(i.style, o), Object.keys(r).forEach((function(e) {
                        i.removeAttribute(e)
                    })))
                }))
            }
    },
    requires: ["computeStyles"]
};

function ru(e) {
    return e.split("-")[0]
}
var ou = Math.max,
    su = Math.min,
    au = Math.round;

function lu() {
    var e = navigator.userAgentData;
    return null != e && e.brands && Array.isArray(e.brands) ? e.brands.map((function(e) {
        return e.brand + "/" + e.version
    })).join(" ") : navigator.userAgent
}

function cu() {
    return !/^((?!chrome|android).)*safari/i.test(lu())
}

function du(e, t, n) {
    void 0 === t && (t = !1), void 0 === n && (n = !1);
    var i = e.getBoundingClientRect(),
        r = 1,
        o = 1;
    t && tu(e) && (r = e.offsetWidth > 0 && au(i.width) / e.offsetWidth || 1, o = e.offsetHeight > 0 && au(i.height) / e.offsetHeight || 1);
    var s = (eu(e) ? Qd(e) : window).visualViewport,
        a = !cu() && n,
        l = (i.left + (a && s ? s.offsetLeft : 0)) / r,
        c = (i.top + (a && s ? s.offsetTop : 0)) / o,
        d = i.width / r,
        u = i.height / o;
    return {
        width: d,
        height: u,
        top: c,
        right: l + d,
        bottom: c + u,
        left: l,
        x: l,
        y: c
    }
}

function uu(e) {
    var t = du(e),
        n = e.offsetWidth,
        i = e.offsetHeight;
    return Math.abs(t.width - n) <= 1 && (n = t.width), Math.abs(t.height - i) <= 1 && (i = t.height), {
        x: e.offsetLeft,
        y: e.offsetTop,
        width: n,
        height: i
    }
}

function hu(e, t) {
    var n = t.getRootNode && t.getRootNode();
    if (e.contains(t)) return !0;
    if (n && nu(n)) {
        var i = t;
        do {
            if (i && e.isSameNode(i)) return !0;
            i = i.parentNode || i.host
        } while (i)
    }
    return !1
}

function pu(e) {
    return Qd(e).getComputedStyle(e)
}

function fu(e) {
    return ["table", "td", "th"].indexOf(Xd(e)) >= 0
}

function gu(e) {
    return ((eu(e) ? e.ownerDocument : e.document) || window.document).documentElement
}

function mu(e) {
    return "html" === Xd(e) ? e : e.assignedSlot || e.parentNode || (nu(e) ? e.host : null) || gu(e)
}

function vu(e) {
    return tu(e) && "fixed" !== pu(e).position ? e.offsetParent : null
}

function yu(e) {
    for (var t = Qd(e), n = vu(e); n && fu(n) && "static" === pu(n).position;) n = vu(n);
    return n && ("html" === Xd(n) || "body" === Xd(n) && "static" === pu(n).position) ? t : n || function(e) {
        var t = /firefox/i.test(lu());
        if (/Trident/i.test(lu()) && tu(e) && "fixed" === pu(e).position) return null;
        var n = mu(e);
        for (nu(n) && (n = n.host); tu(n) && ["html", "body"].indexOf(Xd(n)) < 0;) {
            var i = pu(n);
            if ("none" !== i.transform || "none" !== i.perspective || "paint" === i.contain || -1 !== ["transform", "perspective"].indexOf(i.willChange) || t && "filter" === i.willChange || t && i.filter && "none" !== i.filter) return n;
            n = n.parentNode
        }
        return null
    }(e) || t
}

function bu(e) {
    return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y"
}

function wu(e, t, n) {
    return ou(e, su(t, n))
}

function _u(e) {
    return Object.assign({}, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }, e)
}

function xu(e, t) {
    return t.reduce((function(t, n) {
        return t[n] = e, t
    }), {})
}

function ku(e) {
    return e.split("-")[1]
}
var Eu = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
};

function Cu(e) {
    var t, n = e.popper,
        i = e.popperRect,
        r = e.placement,
        o = e.variation,
        s = e.offsets,
        a = e.position,
        l = e.gpuAcceleration,
        c = e.adaptive,
        d = e.roundOffsets,
        u = e.isFixed,
        h = s.x,
        p = void 0 === h ? 0 : h,
        f = s.y,
        g = void 0 === f ? 0 : f,
        m = "function" == typeof d ? d({
            x: p,
            y: g
        }) : {
            x: p,
            y: g
        };
    p = m.x, g = m.y;
    var v = s.hasOwnProperty("x"),
        y = s.hasOwnProperty("y"),
        b = Vd,
        w = Hd,
        _ = window;
    if (c) {
        var x = yu(n),
            k = "clientHeight",
            E = "clientWidth";
        if (x === Qd(n) && "static" !== pu(x = gu(n)).position && "absolute" === a && (k = "scrollHeight", E = "scrollWidth"), r === Hd || (r === Vd || r === zd) && o === Kd) w = Nd, g -= (u && x === _ && _.visualViewport ? _.visualViewport.height : x[k]) - i.height, g *= l ? 1 : -1;
        if (r === Vd || (r === Hd || r === Nd) && o === Kd) b = zd, p -= (u && x === _ && _.visualViewport ? _.visualViewport.width : x[E]) - i.width, p *= l ? 1 : -1
    }
    var C, S = Object.assign({
            position: a
        }, c && Eu),
        O = !0 === d ? function(e, t) {
            var n = e.x,
                i = e.y,
                r = t.devicePixelRatio || 1;
            return {
                x: au(n * r) / r || 0,
                y: au(i * r) / r || 0
            }
        }({
            x: p,
            y: g
        }, Qd(n)) : {
            x: p,
            y: g
        };
    return p = O.x, g = O.y, l ? Object.assign({}, S, ((C = {})[w] = y ? "0" : "", C[b] = v ? "0" : "", C.transform = (_.devicePixelRatio || 1) <= 1 ? "translate(" + p + "px, " + g + "px)" : "translate3d(" + p + "px, " + g + "px, 0)", C)) : Object.assign({}, S, ((t = {})[w] = y ? g + "px" : "", t[b] = v ? p + "px" : "", t.transform = "", t))
}
var Su = {
    passive: !0
};
var Ou = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
};

function Lu(e) {
    return e.replace(/left|right|bottom|top/g, (function(e) {
        return Ou[e]
    }))
}
var Au = {
    start: "end",
    end: "start"
};

function Du(e) {
    return e.replace(/start|end/g, (function(e) {
        return Au[e]
    }))
}

function Tu(e) {
    var t = Qd(e);
    return {
        scrollLeft: t.pageXOffset,
        scrollTop: t.pageYOffset
    }
}

function Iu(e) {
    return du(gu(e)).left + Tu(e).scrollLeft
}

function Mu(e) {
    var t = pu(e),
        n = t.overflow,
        i = t.overflowX,
        r = t.overflowY;
    return /auto|scroll|overlay|hidden/.test(n + r + i)
}

function ju(e) {
    return ["html", "body", "#document"].indexOf(Xd(e)) >= 0 ? e.ownerDocument.body : tu(e) && Mu(e) ? e : ju(mu(e))
}

function Pu(e, t) {
    var n;
    void 0 === t && (t = []);
    var i = ju(e),
        r = i === (null == (n = e.ownerDocument) ? void 0 : n.body),
        o = Qd(i),
        s = r ? [o].concat(o.visualViewport || [], Mu(i) ? i : []) : i,
        a = t.concat(s);
    return r ? a : a.concat(Pu(mu(s)))
}

function Ru(e) {
    return Object.assign({}, e, {
        left: e.x,
        top: e.y,
        right: e.x + e.width,
        bottom: e.y + e.height
    })
}

function Fu(e, t, n) {
    return t === $d ? Ru(function(e, t) {
        var n = Qd(e),
            i = gu(e),
            r = n.visualViewport,
            o = i.clientWidth,
            s = i.clientHeight,
            a = 0,
            l = 0;
        if (r) {
            o = r.width, s = r.height;
            var c = cu();
            (c || !c && "fixed" === t) && (a = r.offsetLeft, l = r.offsetTop)
        }
        return {
            width: o,
            height: s,
            x: a + Iu(e),
            y: l
        }
    }(e, n)) : eu(t) ? function(e, t) {
        var n = du(e, !1, "fixed" === t);
        return n.top = n.top + e.clientTop, n.left = n.left + e.clientLeft, n.bottom = n.top + e.clientHeight, n.right = n.left + e.clientWidth, n.width = e.clientWidth, n.height = e.clientHeight, n.x = n.left, n.y = n.top, n
    }(t, n) : Ru(function(e) {
        var t, n = gu(e),
            i = Tu(e),
            r = null == (t = e.ownerDocument) ? void 0 : t.body,
            o = ou(n.scrollWidth, n.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0),
            s = ou(n.scrollHeight, n.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0),
            a = -i.scrollLeft + Iu(e),
            l = -i.scrollTop;
        return "rtl" === pu(r || n).direction && (a += ou(n.clientWidth, r ? r.clientWidth : 0) - o), {
            width: o,
            height: s,
            x: a,
            y: l
        }
    }(gu(e)))
}

function Bu(e, t, n, i) {
    var r = "clippingParents" === t ? function(e) {
            var t = Pu(mu(e)),
                n = ["absolute", "fixed"].indexOf(pu(e).position) >= 0 && tu(e) ? yu(e) : e;
            return eu(n) ? t.filter((function(e) {
                return eu(e) && hu(e, n) && "body" !== Xd(e)
            })) : []
        }(e) : [].concat(t),
        o = [].concat(r, [n]),
        s = o[0],
        a = o.reduce((function(t, n) {
            var r = Fu(e, n, i);
            return t.top = ou(r.top, t.top), t.right = su(r.right, t.right), t.bottom = su(r.bottom, t.bottom), t.left = ou(r.left, t.left), t
        }), Fu(e, s, i));
    return a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a
}

function Hu(e) {
    var t, n = e.reference,
        i = e.element,
        r = e.placement,
        o = r ? ru(r) : null,
        s = r ? ku(r) : null,
        a = n.x + n.width / 2 - i.width / 2,
        l = n.y + n.height / 2 - i.height / 2;
    switch (o) {
        case Hd:
            t = {
                x: a,
                y: n.y - i.height
            };
            break;
        case Nd:
            t = {
                x: a,
                y: n.y + n.height
            };
            break;
        case zd:
            t = {
                x: n.x + n.width,
                y: l
            };
            break;
        case Vd:
            t = {
                x: n.x - i.width,
                y: l
            };
            break;
        default:
            t = {
                x: n.x,
                y: n.y
            }
    }
    var c = o ? bu(o) : null;
    if (null != c) {
        var d = "y" === c ? "height" : "width";
        switch (s) {
            case Wd:
                t[c] = t[c] - (n[d] / 2 - i[d] / 2);
                break;
            case Kd:
                t[c] = t[c] + (n[d] / 2 - i[d] / 2)
        }
    }
    return t
}

function Nu(e, t) {
    void 0 === t && (t = {});
    var n = t,
        i = n.placement,
        r = void 0 === i ? e.placement : i,
        o = n.strategy,
        s = void 0 === o ? e.strategy : o,
        a = n.boundary,
        l = void 0 === a ? "clippingParents" : a,
        c = n.rootBoundary,
        d = void 0 === c ? $d : c,
        u = n.elementContext,
        h = void 0 === u ? Yd : u,
        p = n.altBoundary,
        f = void 0 !== p && p,
        g = n.padding,
        m = void 0 === g ? 0 : g,
        v = _u("number" != typeof m ? m : xu(m, qd)),
        y = h === Yd ? "reference" : Yd,
        b = e.rects.popper,
        w = e.elements[f ? y : h],
        _ = Bu(eu(w) ? w : w.contextElement || gu(e.elements.popper), l, d, s),
        x = du(e.elements.reference),
        k = Hu({
            reference: x,
            element: b,
            strategy: "absolute",
            placement: r
        }),
        E = Ru(Object.assign({}, b, k)),
        C = h === Yd ? E : x,
        S = {
            top: _.top - C.top + v.top,
            bottom: C.bottom - _.bottom + v.bottom,
            left: _.left - C.left + v.left,
            right: C.right - _.right + v.right
        },
        O = e.modifiersData.offset;
    if (h === Yd && O) {
        var L = O[r];
        Object.keys(S).forEach((function(e) {
            var t = [zd, Nd].indexOf(e) >= 0 ? 1 : -1,
                n = [Hd, Nd].indexOf(e) >= 0 ? "y" : "x";
            S[e] += L[n] * t
        }))
    }
    return S
}

function zu(e, t, n) {
    return void 0 === n && (n = {
        x: 0,
        y: 0
    }), {
        top: e.top - t.height - n.y,
        right: e.right - t.width + n.x,
        bottom: e.bottom - t.height + n.y,
        left: e.left - t.width - n.x
    }
}

function Vu(e) {
    return [Hd, zd, Nd, Vd].some((function(t) {
        return e[t] >= 0
    }))
}

function Uu(e, t, n) {
    void 0 === n && (n = !1);
    var i, r, o = tu(t),
        s = tu(t) && function(e) {
            var t = e.getBoundingClientRect(),
                n = au(t.width) / e.offsetWidth || 1,
                i = au(t.height) / e.offsetHeight || 1;
            return 1 !== n || 1 !== i
        }(t),
        a = gu(t),
        l = du(e, s, n),
        c = {
            scrollLeft: 0,
            scrollTop: 0
        },
        d = {
            x: 0,
            y: 0
        };
    return (o || !o && !n) && (("body" !== Xd(t) || Mu(a)) && (c = (i = t) !== Qd(i) && tu(i) ? {
        scrollLeft: (r = i).scrollLeft,
        scrollTop: r.scrollTop
    } : Tu(i)), tu(t) ? ((d = du(t, !0)).x += t.clientLeft, d.y += t.clientTop) : a && (d.x = Iu(a))), {
        x: l.left + c.scrollLeft - d.x,
        y: l.top + c.scrollTop - d.y,
        width: l.width,
        height: l.height
    }
}

function qu(e) {
    var t = new Map,
        n = new Set,
        i = [];

    function r(e) {
        n.add(e.name), [].concat(e.requires || [], e.requiresIfExists || []).forEach((function(e) {
            if (!n.has(e)) {
                var i = t.get(e);
                i && r(i)
            }
        })), i.push(e)
    }
    return e.forEach((function(e) {
        t.set(e.name, e)
    })), e.forEach((function(e) {
        n.has(e.name) || r(e)
    })), i
}
var Wu = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
};

function Ku() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return !t.some((function(e) {
        return !(e && "function" == typeof e.getBoundingClientRect)
    }))
}

function $u(e) {
    void 0 === e && (e = {});
    var t = e,
        n = t.defaultModifiers,
        i = void 0 === n ? [] : n,
        r = t.defaultOptions,
        o = void 0 === r ? Wu : r;
    return function(e, t, n) {
        void 0 === n && (n = o);
        var r, s, a = {
                placement: "bottom",
                orderedModifiers: [],
                options: Object.assign({}, Wu, o),
                modifiersData: {},
                elements: {
                    reference: e,
                    popper: t
                },
                attributes: {},
                styles: {}
            },
            l = [],
            c = !1,
            d = {
                state: a,
                setOptions: function(n) {
                    var r = "function" == typeof n ? n(a.options) : n;
                    u(), a.options = Object.assign({}, o, a.options, r), a.scrollParents = {
                        reference: eu(e) ? Pu(e) : e.contextElement ? Pu(e.contextElement) : [],
                        popper: Pu(t)
                    };
                    var s, c, h = function(e) {
                        var t = qu(e);
                        return Zd.reduce((function(e, n) {
                            return e.concat(t.filter((function(e) {
                                return e.phase === n
                            })))
                        }), [])
                    }((s = [].concat(i, a.options.modifiers), c = s.reduce((function(e, t) {
                        var n = e[t.name];
                        return e[t.name] = n ? Object.assign({}, n, t, {
                            options: Object.assign({}, n.options, t.options),
                            data: Object.assign({}, n.data, t.data)
                        }) : t, e
                    }), {}), Object.keys(c).map((function(e) {
                        return c[e]
                    }))));
                    return a.orderedModifiers = h.filter((function(e) {
                        return e.enabled
                    })), a.orderedModifiers.forEach((function(e) {
                        var t = e.name,
                            n = e.options,
                            i = void 0 === n ? {} : n,
                            r = e.effect;
                        if ("function" == typeof r) {
                            var o = r({
                                    state: a,
                                    name: t,
                                    instance: d,
                                    options: i
                                }),
                                s = function() {};
                            l.push(o || s)
                        }
                    })), d.update()
                },
                forceUpdate: function() {
                    if (!c) {
                        var e = a.elements,
                            t = e.reference,
                            n = e.popper;
                        if (Ku(t, n)) {
                            a.rects = {
                                reference: Uu(t, yu(n), "fixed" === a.options.strategy),
                                popper: uu(n)
                            }, a.reset = !1, a.placement = a.options.placement, a.orderedModifiers.forEach((function(e) {
                                return a.modifiersData[e.name] = Object.assign({}, e.data)
                            }));
                            for (var i = 0; i < a.orderedModifiers.length; i++)
                                if (!0 !== a.reset) {
                                    var r = a.orderedModifiers[i],
                                        o = r.fn,
                                        s = r.options,
                                        l = void 0 === s ? {} : s,
                                        u = r.name;
                                    "function" == typeof o && (a = o({
                                        state: a,
                                        options: l,
                                        name: u,
                                        instance: d
                                    }) || a)
                                } else a.reset = !1, i = -1
                        }
                    }
                },
                update: (r = function() {
                    return new Promise((function(e) {
                        d.forceUpdate(), e(a)
                    }))
                }, function() {
                    return s || (s = new Promise((function(e) {
                        Promise.resolve().then((function() {
                            s = void 0, e(r())
                        }))
                    }))), s
                }),
                destroy: function() {
                    u(), c = !0
                }
            };
        if (!Ku(e, t)) return d;

        function u() {
            l.forEach((function(e) {
                return e()
            })), l = []
        }
        return d.setOptions(n).then((function(e) {
            !c && n.onFirstUpdate && n.onFirstUpdate(e)
        })), d
    }
}
var Yu = $u({
        defaultModifiers: [{
            name: "eventListeners",
            enabled: !0,
            phase: "write",
            fn: function() {},
            effect: function(e) {
                var t = e.state,
                    n = e.instance,
                    i = e.options,
                    r = i.scroll,
                    o = void 0 === r || r,
                    s = i.resize,
                    a = void 0 === s || s,
                    l = Qd(t.elements.popper),
                    c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
                return o && c.forEach((function(e) {
                        e.addEventListener("scroll", n.update, Su)
                    })), a && l.addEventListener("resize", n.update, Su),
                    function() {
                        o && c.forEach((function(e) {
                            e.removeEventListener("scroll", n.update, Su)
                        })), a && l.removeEventListener("resize", n.update, Su)
                    }
            },
            data: {}
        }, {
            name: "popperOffsets",
            enabled: !0,
            phase: "read",
            fn: function(e) {
                var t = e.state,
                    n = e.name;
                t.modifiersData[n] = Hu({
                    reference: t.rects.reference,
                    element: t.rects.popper,
                    strategy: "absolute",
                    placement: t.placement
                })
            },
            data: {}
        }, {
            name: "computeStyles",
            enabled: !0,
            phase: "beforeWrite",
            fn: function(e) {
                var t = e.state,
                    n = e.options,
                    i = n.gpuAcceleration,
                    r = void 0 === i || i,
                    o = n.adaptive,
                    s = void 0 === o || o,
                    a = n.roundOffsets,
                    l = void 0 === a || a,
                    c = {
                        placement: ru(t.placement),
                        variation: ku(t.placement),
                        popper: t.elements.popper,
                        popperRect: t.rects.popper,
                        gpuAcceleration: r,
                        isFixed: "fixed" === t.options.strategy
                    };
                null != t.modifiersData.popperOffsets && (t.styles.popper = Object.assign({}, t.styles.popper, Cu(Object.assign({}, c, {
                    offsets: t.modifiersData.popperOffsets,
                    position: t.options.strategy,
                    adaptive: s,
                    roundOffsets: l
                })))), null != t.modifiersData.arrow && (t.styles.arrow = Object.assign({}, t.styles.arrow, Cu(Object.assign({}, c, {
                    offsets: t.modifiersData.arrow,
                    position: "absolute",
                    adaptive: !1,
                    roundOffsets: l
                })))), t.attributes.popper = Object.assign({}, t.attributes.popper, {
                    "data-popper-placement": t.placement
                })
            },
            data: {}
        }, iu, {
            name: "offset",
            enabled: !0,
            phase: "main",
            requires: ["popperOffsets"],
            fn: function(e) {
                var t = e.state,
                    n = e.options,
                    i = e.name,
                    r = n.offset,
                    o = void 0 === r ? [0, 0] : r,
                    s = Gd.reduce((function(e, n) {
                        return e[n] = function(e, t, n) {
                            var i = ru(e),
                                r = [Vd, Hd].indexOf(i) >= 0 ? -1 : 1,
                                o = "function" == typeof n ? n(Object.assign({}, t, {
                                    placement: e
                                })) : n,
                                s = o[0],
                                a = o[1];
                            return s = s || 0, a = (a || 0) * r, [Vd, zd].indexOf(i) >= 0 ? {
                                x: a,
                                y: s
                            } : {
                                x: s,
                                y: a
                            }
                        }(n, t.rects, o), e
                    }), {}),
                    a = s[t.placement],
                    l = a.x,
                    c = a.y;
                null != t.modifiersData.popperOffsets && (t.modifiersData.popperOffsets.x += l, t.modifiersData.popperOffsets.y += c), t.modifiersData[i] = s
            }
        }, {
            name: "flip",
            enabled: !0,
            phase: "main",
            fn: function(e) {
                var t = e.state,
                    n = e.options,
                    i = e.name;
                if (!t.modifiersData[i]._skip) {
                    for (var r = n.mainAxis, o = void 0 === r || r, s = n.altAxis, a = void 0 === s || s, l = n.fallbackPlacements, c = n.padding, d = n.boundary, u = n.rootBoundary, h = n.altBoundary, p = n.flipVariations, f = void 0 === p || p, g = n.allowedAutoPlacements, m = t.options.placement, v = ru(m), y = l || (v === m || !f ? [Lu(m)] : function(e) {
                            if (ru(e) === Ud) return [];
                            var t = Lu(e);
                            return [Du(e), t, Du(t)]
                        }(m)), b = [m].concat(y).reduce((function(e, n) {
                            return e.concat(ru(n) === Ud ? function(e, t) {
                                void 0 === t && (t = {});
                                var n = t,
                                    i = n.placement,
                                    r = n.boundary,
                                    o = n.rootBoundary,
                                    s = n.padding,
                                    a = n.flipVariations,
                                    l = n.allowedAutoPlacements,
                                    c = void 0 === l ? Gd : l,
                                    d = ku(i),
                                    u = d ? a ? Jd : Jd.filter((function(e) {
                                        return ku(e) === d
                                    })) : qd,
                                    h = u.filter((function(e) {
                                        return c.indexOf(e) >= 0
                                    }));
                                0 === h.length && (h = u);
                                var p = h.reduce((function(t, n) {
                                    return t[n] = Nu(e, {
                                        placement: n,
                                        boundary: r,
                                        rootBoundary: o,
                                        padding: s
                                    })[ru(n)], t
                                }), {});
                                return Object.keys(p).sort((function(e, t) {
                                    return p[e] - p[t]
                                }))
                            }(t, {
                                placement: n,
                                boundary: d,
                                rootBoundary: u,
                                padding: c,
                                flipVariations: f,
                                allowedAutoPlacements: g
                            }) : n)
                        }), []), w = t.rects.reference, _ = t.rects.popper, x = new Map, k = !0, E = b[0], C = 0; C < b.length; C++) {
                        var S = b[C],
                            O = ru(S),
                            L = ku(S) === Wd,
                            A = [Hd, Nd].indexOf(O) >= 0,
                            D = A ? "width" : "height",
                            T = Nu(t, {
                                placement: S,
                                boundary: d,
                                rootBoundary: u,
                                altBoundary: h,
                                padding: c
                            }),
                            I = A ? L ? zd : Vd : L ? Nd : Hd;
                        w[D] > _[D] && (I = Lu(I));
                        var M = Lu(I),
                            j = [];
                        if (o && j.push(T[O] <= 0), a && j.push(T[I] <= 0, T[M] <= 0), j.every((function(e) {
                                return e
                            }))) {
                            E = S, k = !1;
                            break
                        }
                        x.set(S, j)
                    }
                    if (k)
                        for (var P = function(e) {
                                var t = b.find((function(t) {
                                    var n = x.get(t);
                                    if (n) return n.slice(0, e).every((function(e) {
                                        return e
                                    }))
                                }));
                                if (t) return E = t, "break"
                            }, R = f ? 3 : 1; R > 0; R--) {
                            if ("break" === P(R)) break
                        }
                    t.placement !== E && (t.modifiersData[i]._skip = !0, t.placement = E, t.reset = !0)
                }
            },
            requiresIfExists: ["offset"],
            data: {
                _skip: !1
            }
        }, {
            name: "preventOverflow",
            enabled: !0,
            phase: "main",
            fn: function(e) {
                var t = e.state,
                    n = e.options,
                    i = e.name,
                    r = n.mainAxis,
                    o = void 0 === r || r,
                    s = n.altAxis,
                    a = void 0 !== s && s,
                    l = n.boundary,
                    c = n.rootBoundary,
                    d = n.altBoundary,
                    u = n.padding,
                    h = n.tether,
                    p = void 0 === h || h,
                    f = n.tetherOffset,
                    g = void 0 === f ? 0 : f,
                    m = Nu(t, {
                        boundary: l,
                        rootBoundary: c,
                        padding: u,
                        altBoundary: d
                    }),
                    v = ru(t.placement),
                    y = ku(t.placement),
                    b = !y,
                    w = bu(v),
                    _ = "x" === w ? "y" : "x",
                    x = t.modifiersData.popperOffsets,
                    k = t.rects.reference,
                    E = t.rects.popper,
                    C = "function" == typeof g ? g(Object.assign({}, t.rects, {
                        placement: t.placement
                    })) : g,
                    S = "number" == typeof C ? {
                        mainAxis: C,
                        altAxis: C
                    } : Object.assign({
                        mainAxis: 0,
                        altAxis: 0
                    }, C),
                    O = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null,
                    L = {
                        x: 0,
                        y: 0
                    };
                if (x) {
                    if (o) {
                        var A, D = "y" === w ? Hd : Vd,
                            T = "y" === w ? Nd : zd,
                            I = "y" === w ? "height" : "width",
                            M = x[w],
                            j = M + m[D],
                            P = M - m[T],
                            R = p ? -E[I] / 2 : 0,
                            F = y === Wd ? k[I] : E[I],
                            B = y === Wd ? -E[I] : -k[I],
                            H = t.elements.arrow,
                            N = p && H ? uu(H) : {
                                width: 0,
                                height: 0
                            },
                            z = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0
                            },
                            V = z[D],
                            U = z[T],
                            q = wu(0, k[I], N[I]),
                            W = b ? k[I] / 2 - R - q - V - S.mainAxis : F - q - V - S.mainAxis,
                            K = b ? -k[I] / 2 + R + q + U + S.mainAxis : B + q + U + S.mainAxis,
                            $ = t.elements.arrow && yu(t.elements.arrow),
                            Y = $ ? "y" === w ? $.clientTop || 0 : $.clientLeft || 0 : 0,
                            J = null != (A = null == O ? void 0 : O[w]) ? A : 0,
                            G = M + K - J,
                            Z = wu(p ? su(j, M + W - J - Y) : j, M, p ? ou(P, G) : P);
                        x[w] = Z, L[w] = Z - M
                    }
                    if (a) {
                        var X, Q = "x" === w ? Hd : Vd,
                            ee = "x" === w ? Nd : zd,
                            te = x[_],
                            ne = "y" === _ ? "height" : "width",
                            ie = te + m[Q],
                            re = te - m[ee],
                            oe = -1 !== [Hd, Vd].indexOf(v),
                            se = null != (X = null == O ? void 0 : O[_]) ? X : 0,
                            ae = oe ? ie : te - k[ne] - E[ne] - se + S.altAxis,
                            le = oe ? te + k[ne] + E[ne] - se - S.altAxis : re,
                            ce = p && oe ? (ue = wu(ae, te, de = le)) > de ? de : ue : wu(p ? ae : ie, te, p ? le : re);
                        x[_] = ce, L[_] = ce - te
                    }
                    var de, ue;
                    t.modifiersData[i] = L
                }
            },
            requiresIfExists: ["offset"]
        }, {
            name: "arrow",
            enabled: !0,
            phase: "main",
            fn: function(e) {
                var t, n = e.state,
                    i = e.name,
                    r = e.options,
                    o = n.elements.arrow,
                    s = n.modifiersData.popperOffsets,
                    a = ru(n.placement),
                    l = bu(a),
                    c = [Vd, zd].indexOf(a) >= 0 ? "height" : "width";
                if (o && s) {
                    var d = function(e, t) {
                            return _u("number" != typeof(e = "function" == typeof e ? e(Object.assign({}, t.rects, {
                                placement: t.placement
                            })) : e) ? e : xu(e, qd))
                        }(r.padding, n),
                        u = uu(o),
                        h = "y" === l ? Hd : Vd,
                        p = "y" === l ? Nd : zd,
                        f = n.rects.reference[c] + n.rects.reference[l] - s[l] - n.rects.popper[c],
                        g = s[l] - n.rects.reference[l],
                        m = yu(o),
                        v = m ? "y" === l ? m.clientHeight || 0 : m.clientWidth || 0 : 0,
                        y = f / 2 - g / 2,
                        b = d[h],
                        w = v - u[c] - d[p],
                        _ = v / 2 - u[c] / 2 + y,
                        x = wu(b, _, w),
                        k = l;
                    n.modifiersData[i] = ((t = {})[k] = x, t.centerOffset = x - _, t)
                }
            },
            effect: function(e) {
                var t = e.state,
                    n = e.options.element,
                    i = void 0 === n ? "[data-popper-arrow]" : n;
                null != i && ("string" != typeof i || (i = t.elements.popper.querySelector(i))) && hu(t.elements.popper, i) && (t.elements.arrow = i)
            },
            requires: ["popperOffsets"],
            requiresIfExists: ["preventOverflow"]
        }, {
            name: "hide",
            enabled: !0,
            phase: "main",
            requiresIfExists: ["preventOverflow"],
            fn: function(e) {
                var t = e.state,
                    n = e.name,
                    i = t.rects.reference,
                    r = t.rects.popper,
                    o = t.modifiersData.preventOverflow,
                    s = Nu(t, {
                        elementContext: "reference"
                    }),
                    a = Nu(t, {
                        altBoundary: !0
                    }),
                    l = zu(s, i),
                    c = zu(a, r, o),
                    d = Vu(l),
                    u = Vu(c);
                t.modifiersData[n] = {
                    referenceClippingOffsets: l,
                    popperEscapeOffsets: c,
                    isReferenceHidden: d,
                    hasPopperEscaped: u
                }, t.attributes.popper = Object.assign({}, t.attributes.popper, {
                    "data-popper-reference-hidden": d,
                    "data-popper-escaped": u
                })
            }
        }]
    }),
    Ju = function() {
        return Ju = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, Ju.apply(this, arguments)
    },
    Gu = function(e, t, n) {
        if (n || 2 === arguments.length)
            for (var i, r = 0, o = t.length; r < o; r++) !i && r in t || (i || (i = Array.prototype.slice.call(t, 0, r)), i[r] = t[r]);
        return e.concat(i || Array.prototype.slice.call(t))
    },
    Zu = {
        placement: "bottom",
        triggerType: "click",
        offsetSkidding: 0,
        offsetDistance: 10,
        delay: 300,
        ignoreClickOutsideClass: !1,
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    },
    Xu = {
        id: null,
        override: !0
    },
    Qu = function() {
        function e(e, t, n, i) {
            void 0 === e && (e = null), void 0 === t && (t = null), void 0 === n && (n = Zu), void 0 === i && (i = Xu), this._instanceId = i.id ? i.id : e.id, this._targetEl = e, this._triggerEl = t, this._options = Ju(Ju({}, Zu), n), this._popperInstance = null, this._visible = !1, this._initialized = !1, this.init(), yd.addInstance("Dropdown", this, this._instanceId, i.override)
        }
        return e.prototype.init = function() {
            this._triggerEl && this._targetEl && !this._initialized && (this._popperInstance = this._createPopperInstance(), this._setupEventListeners(), this._initialized = !0)
        }, e.prototype.destroy = function() {
            var e = this,
                t = this._getTriggerEvents();
            "click" === this._options.triggerType && t.showEvents.forEach((function(t) {
                e._triggerEl.removeEventListener(t, e._clickHandler)
            })), "hover" === this._options.triggerType && (t.showEvents.forEach((function(t) {
                e._triggerEl.removeEventListener(t, e._hoverShowTriggerElHandler), e._targetEl.removeEventListener(t, e._hoverShowTargetElHandler)
            })), t.hideEvents.forEach((function(t) {
                e._triggerEl.removeEventListener(t, e._hoverHideHandler), e._targetEl.removeEventListener(t, e._hoverHideHandler)
            }))), this._popperInstance.destroy(), this._initialized = !1
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Dropdown", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype._setupEventListeners = function() {
            var e = this,
                t = this._getTriggerEvents();
            this._clickHandler = function() {
                e.toggle()
            }, "click" === this._options.triggerType && t.showEvents.forEach((function(t) {
                e._triggerEl.addEventListener(t, e._clickHandler)
            })), this._hoverShowTriggerElHandler = function(t) {
                "click" === t.type ? e.toggle() : setTimeout((function() {
                    e.show()
                }), e._options.delay)
            }, this._hoverShowTargetElHandler = function() {
                e.show()
            }, this._hoverHideHandler = function() {
                setTimeout((function() {
                    e._targetEl.matches(":hover") || e.hide()
                }), e._options.delay)
            }, "hover" === this._options.triggerType && (t.showEvents.forEach((function(t) {
                e._triggerEl.addEventListener(t, e._hoverShowTriggerElHandler), e._targetEl.addEventListener(t, e._hoverShowTargetElHandler)
            })), t.hideEvents.forEach((function(t) {
                e._triggerEl.addEventListener(t, e._hoverHideHandler), e._targetEl.addEventListener(t, e._hoverHideHandler)
            })))
        }, e.prototype._createPopperInstance = function() {
            return Yu(this._triggerEl, this._targetEl, {
                placement: this._options.placement,
                modifiers: [{
                    name: "offset",
                    options: {
                        offset: [this._options.offsetSkidding, this._options.offsetDistance]
                    }
                }]
            })
        }, e.prototype._setupClickOutsideListener = function() {
            var e = this;
            this._clickOutsideEventListener = function(t) {
                e._handleClickOutside(t, e._targetEl)
            }, document.body.addEventListener("click", this._clickOutsideEventListener, !0)
        }, e.prototype._removeClickOutsideListener = function() {
            document.body.removeEventListener("click", this._clickOutsideEventListener, !0)
        }, e.prototype._handleClickOutside = function(e, t) {
            var n = e.target,
                i = this._options.ignoreClickOutsideClass,
                r = !1;
            i && document.querySelectorAll(".".concat(i)).forEach((function(e) {
                e.contains(n) && (r = !0)
            }));
            n === t || t.contains(n) || this._triggerEl.contains(n) || r || !this.isVisible() || this.hide()
        }, e.prototype._getTriggerEvents = function() {
            switch (this._options.triggerType) {
                case "hover":
                    return {
                        showEvents: ["mouseenter", "click"], hideEvents: ["mouseleave"]
                    };
                case "click":
                default:
                    return {
                        showEvents: ["click"], hideEvents: []
                    };
                case "none":
                    return {
                        showEvents: [], hideEvents: []
                    }
            }
        }, e.prototype.toggle = function() {
            this.isVisible() ? this.hide() : this.show(), this._options.onToggle(this)
        }, e.prototype.isVisible = function() {
            return this._visible
        }, e.prototype.show = function() {
            this._targetEl.classList.remove("hidden"), this._targetEl.classList.add("block"), this._popperInstance.setOptions((function(e) {
                return Ju(Ju({}, e), {
                    modifiers: Gu(Gu([], e.modifiers, !0), [{
                        name: "eventListeners",
                        enabled: !0
                    }], !1)
                })
            })), this._setupClickOutsideListener(), this._popperInstance.update(), this._visible = !0, this._options.onShow(this)
        }, e.prototype.hide = function() {
            this._targetEl.classList.remove("block"), this._targetEl.classList.add("hidden"), this._popperInstance.setOptions((function(e) {
                return Ju(Ju({}, e), {
                    modifiers: Gu(Gu([], e.modifiers, !0), [{
                        name: "eventListeners",
                        enabled: !1
                    }], !1)
                })
            })), this._visible = !1, this._removeClickOutsideListener(), this._options.onHide(this)
        }, e.prototype.updateOnShow = function(e) {
            this._options.onShow = e
        }, e.prototype.updateOnHide = function(e) {
            this._options.onHide = e
        }, e.prototype.updateOnToggle = function(e) {
            this._options.onToggle = e
        }, e
    }();

function eh() {
    document.querySelectorAll("[data-dropdown-toggle]").forEach((function(e) {
        var t = e.getAttribute("data-dropdown-toggle"),
            n = document.getElementById(t);
        if (n) {
            var i = e.getAttribute("data-dropdown-placement"),
                r = e.getAttribute("data-dropdown-offset-skidding"),
                o = e.getAttribute("data-dropdown-offset-distance"),
                s = e.getAttribute("data-dropdown-trigger"),
                a = e.getAttribute("data-dropdown-delay"),
                l = e.getAttribute("data-dropdown-ignore-click-outside-class");
            new Qu(n, e, {
                placement: i || Zu.placement,
                triggerType: s || Zu.triggerType,
                offsetSkidding: r ? parseInt(r) : Zu.offsetSkidding,
                offsetDistance: o ? parseInt(o) : Zu.offsetDistance,
                delay: a ? parseInt(a) : Zu.delay,
                ignoreClickOutsideClass: l || Zu.ignoreClickOutsideClass
            })
        } else console.error('The dropdown element with id "'.concat(t, '" does not exist. Please check the data-dropdown-toggle attribute.'))
    }))
}
"undefined" != typeof window && (window.Dropdown = Qu, window.initDropdowns = eh);
var th = function() {
        return th = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, th.apply(this, arguments)
    },
    nh = {
        placement: "center",
        backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
        backdrop: "dynamic",
        closable: !0,
        onHide: function() {},
        onShow: function() {},
        onToggle: function() {}
    },
    ih = {
        id: null,
        override: !0
    },
    rh = function() {
        function e(e, t, n) {
            void 0 === e && (e = null), void 0 === t && (t = nh), void 0 === n && (n = ih), this._eventListenerInstances = [], this._instanceId = n.id ? n.id : e.id, this._targetEl = e, this._options = th(th({}, nh), t), this._isHidden = !0, this._backdropEl = null, this._initialized = !1, this.init(), yd.addInstance("Modal", this, this._instanceId, n.override)
        }
        return e.prototype.init = function() {
            var e = this;
            this._targetEl && !this._initialized && (this._getPlacementClasses().map((function(t) {
                e._targetEl.classList.add(t)
            })), this._initialized = !0)
        }, e.prototype.destroy = function() {
            this._initialized && (this.removeAllEventListenerInstances(), this._destroyBackdropEl(), this._initialized = !1)
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Modal", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype._createBackdrop = function() {
            var e;
            if (this._isHidden) {
                var t = document.createElement("div");
                (e = t.classList).add.apply(e, this._options.backdropClasses.split(" ")), document.querySelector("body").append(t), this._backdropEl = t
            }
        }, e.prototype._destroyBackdropEl = function() {
            !this._isHidden && this._backdropEl && (this._backdropEl.remove(), this._backdropEl = null)
        }, e.prototype._setupModalCloseEventListeners = function() {
            var e = this;
            "dynamic" === this._options.backdrop && (this._clickOutsideEventListener = function(t) {
                e._handleOutsideClick(t.target)
            }, this._targetEl.addEventListener("click", this._clickOutsideEventListener, !0)), this._keydownEventListener = function(t) {
                "Escape" === t.key && e.hide()
            }, document.body.addEventListener("keydown", this._keydownEventListener, !0)
        }, e.prototype._removeModalCloseEventListeners = function() {
            "dynamic" === this._options.backdrop && this._targetEl.removeEventListener("click", this._clickOutsideEventListener, !0), document.body.removeEventListener("keydown", this._keydownEventListener, !0)
        }, e.prototype._handleOutsideClick = function(e) {
            (e === this._targetEl || e === this._backdropEl && this.isVisible()) && this.hide()
        }, e.prototype._getPlacementClasses = function() {
            switch (this._options.placement) {
                case "top-left":
                    return ["justify-start", "items-start"];
                case "top-center":
                    return ["justify-center", "items-start"];
                case "top-right":
                    return ["justify-end", "items-start"];
                case "center-left":
                    return ["justify-start", "items-center"];
                case "center":
                default:
                    return ["justify-center", "items-center"];
                case "center-right":
                    return ["justify-end", "items-center"];
                case "bottom-left":
                    return ["justify-start", "items-end"];
                case "bottom-center":
                    return ["justify-center", "items-end"];
                case "bottom-right":
                    return ["justify-end", "items-end"]
            }
        }, e.prototype.toggle = function() {
            this._isHidden ? this.show() : this.hide(), this._options.onToggle(this)
        }, e.prototype.show = function() {
            this.isHidden && (this._targetEl.classList.add("flex"), this._targetEl.classList.remove("hidden"), this._targetEl.setAttribute("aria-modal", "true"), this._targetEl.setAttribute("role", "dialog"), this._targetEl.removeAttribute("aria-hidden"), this._createBackdrop(), this._isHidden = !1, this._options.closable && this._setupModalCloseEventListeners(), document.body.classList.add("overflow-hidden"), this._options.onShow(this))
        }, e.prototype.hide = function() {
            this.isVisible && (this._targetEl.classList.add("hidden"), this._targetEl.classList.remove("flex"), this._targetEl.setAttribute("aria-hidden", "true"), this._targetEl.removeAttribute("aria-modal"), this._targetEl.removeAttribute("role"), this._destroyBackdropEl(), this._isHidden = !0, document.body.classList.remove("overflow-hidden"), this._options.closable && this._removeModalCloseEventListeners(), this._options.onHide(this))
        }, e.prototype.isVisible = function() {
            return !this._isHidden
        }, e.prototype.isHidden = function() {
            return this._isHidden
        }, e.prototype.addEventListenerInstance = function(e, t, n) {
            this._eventListenerInstances.push({
                element: e,
                type: t,
                handler: n
            })
        }, e.prototype.removeAllEventListenerInstances = function() {
            this._eventListenerInstances.map((function(e) {
                e.element.removeEventListener(e.type, e.handler)
            })), this._eventListenerInstances = []
        }, e.prototype.getAllEventListenerInstances = function() {
            return this._eventListenerInstances
        }, e.prototype.updateOnShow = function(e) {
            this._options.onShow = e
        }, e.prototype.updateOnHide = function(e) {
            this._options.onHide = e
        }, e.prototype.updateOnToggle = function(e) {
            this._options.onToggle = e
        }, e
    }();

function oh() {
    document.querySelectorAll("[data-modal-target]").forEach((function(e) {
        var t = e.getAttribute("data-modal-target"),
            n = document.getElementById(t);
        if (n) {
            var i = n.getAttribute("data-modal-placement"),
                r = n.getAttribute("data-modal-backdrop");
            new rh(n, {
                placement: i || nh.placement,
                backdrop: r || nh.backdrop
            })
        } else console.error("Modal with id ".concat(t, " does not exist. Are you sure that the data-modal-target attribute points to the correct modal id?."))
    })), document.querySelectorAll("[data-modal-toggle]").forEach((function(e) {
        var t = e.getAttribute("data-modal-toggle");
        if (document.getElementById(t)) {
            var n = yd.getInstance("Modal", t);
            if (n) {
                var i = function() {
                    n.toggle()
                };
                e.addEventListener("click", i), n.addEventListenerInstance(e, "click", i)
            } else console.error("Modal with id ".concat(t, " has not been initialized. Please initialize it using the data-modal-target attribute."))
        } else console.error("Modal with id ".concat(t, " does not exist. Are you sure that the data-modal-toggle attribute points to the correct modal id?"))
    })), document.querySelectorAll("[data-modal-show]").forEach((function(e) {
        var t = e.getAttribute("data-modal-show");
        if (document.getElementById(t)) {
            var n = yd.getInstance("Modal", t);
            if (n) {
                var i = function() {
                    n.show()
                };
                e.addEventListener("click", i), n.addEventListenerInstance(e, "click", i)
            } else console.error("Modal with id ".concat(t, " has not been initialized. Please initialize it using the data-modal-target attribute."))
        } else console.error("Modal with id ".concat(t, " does not exist. Are you sure that the data-modal-show attribute points to the correct modal id?"))
    })), document.querySelectorAll("[data-modal-hide]").forEach((function(e) {
        var t = e.getAttribute("data-modal-hide");
        if (document.getElementById(t)) {
            var n = yd.getInstance("Modal", t);
            if (n) {
                var i = function() {
                    n.hide()
                };
                e.addEventListener("click", i), n.addEventListenerInstance(e, "click", i)
            } else console.error("Modal with id ".concat(t, " has not been initialized. Please initialize it using the data-modal-target attribute."))
        } else console.error("Modal with id ".concat(t, " does not exist. Are you sure that the data-modal-hide attribute points to the correct modal id?"))
    }))
}
"undefined" != typeof window && (window.Modal = rh, window.initModals = oh);
var sh = function() {
        return sh = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, sh.apply(this, arguments)
    },
    ah = {
        placement: "left",
        bodyScrolling: !1,
        backdrop: !0,
        edge: !1,
        edgeOffset: "bottom-[60px]",
        backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30",
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    },
    lh = {
        id: null,
        override: !0
    },
    ch = function() {
        function e(e, t, n) {
            void 0 === e && (e = null), void 0 === t && (t = ah), void 0 === n && (n = lh), this._eventListenerInstances = [], this._instanceId = n.id ? n.id : e.id, this._targetEl = e, this._options = sh(sh({}, ah), t), this._visible = !1, this._initialized = !1, this.init(), yd.addInstance("Drawer", this, this._instanceId, n.override)
        }
        return e.prototype.init = function() {
            var e = this;
            this._targetEl && !this._initialized && (this._targetEl.setAttribute("aria-hidden", "true"), this._targetEl.classList.add("transition-transform"), this._getPlacementClasses(this._options.placement).base.map((function(t) {
                e._targetEl.classList.add(t)
            })), this._handleEscapeKey = function(t) {
                "Escape" === t.key && e.isVisible() && e.hide()
            }, document.addEventListener("keydown", this._handleEscapeKey), this._initialized = !0)
        }, e.prototype.destroy = function() {
            this._initialized && (this.removeAllEventListenerInstances(), this._destroyBackdropEl(), document.removeEventListener("keydown", this._handleEscapeKey), this._initialized = !1)
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Drawer", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.hide = function() {
            var e = this;
            this._options.edge ? (this._getPlacementClasses(this._options.placement + "-edge").active.map((function(t) {
                e._targetEl.classList.remove(t)
            })), this._getPlacementClasses(this._options.placement + "-edge").inactive.map((function(t) {
                e._targetEl.classList.add(t)
            }))) : (this._getPlacementClasses(this._options.placement).active.map((function(t) {
                e._targetEl.classList.remove(t)
            })), this._getPlacementClasses(this._options.placement).inactive.map((function(t) {
                e._targetEl.classList.add(t)
            }))), this._targetEl.setAttribute("aria-hidden", "true"), this._targetEl.removeAttribute("aria-modal"), this._targetEl.removeAttribute("role"), this._options.bodyScrolling || document.body.classList.remove("overflow-hidden"), this._options.backdrop && this._destroyBackdropEl(), this._visible = !1, this._options.onHide(this)
        }, e.prototype.show = function() {
            var e = this;
            this._options.edge ? (this._getPlacementClasses(this._options.placement + "-edge").active.map((function(t) {
                e._targetEl.classList.add(t)
            })), this._getPlacementClasses(this._options.placement + "-edge").inactive.map((function(t) {
                e._targetEl.classList.remove(t)
            }))) : (this._getPlacementClasses(this._options.placement).active.map((function(t) {
                e._targetEl.classList.add(t)
            })), this._getPlacementClasses(this._options.placement).inactive.map((function(t) {
                e._targetEl.classList.remove(t)
            }))), this._targetEl.setAttribute("aria-modal", "true"), this._targetEl.setAttribute("role", "dialog"), this._targetEl.removeAttribute("aria-hidden"), this._options.bodyScrolling || document.body.classList.add("overflow-hidden"), this._options.backdrop && this._createBackdrop(), this._visible = !0, this._options.onShow(this)
        }, e.prototype.toggle = function() {
            this.isVisible() ? this.hide() : this.show()
        }, e.prototype._createBackdrop = function() {
            var e, t = this;
            if (!this._visible) {
                var n = document.createElement("div");
                n.setAttribute("drawer-backdrop", ""), (e = n.classList).add.apply(e, this._options.backdropClasses.split(" ")), document.querySelector("body").append(n), n.addEventListener("click", (function() {
                    t.hide()
                }))
            }
        }, e.prototype._destroyBackdropEl = function() {
            this._visible && null !== document.querySelector("[drawer-backdrop]") && document.querySelector("[drawer-backdrop]").remove()
        }, e.prototype._getPlacementClasses = function(e) {
            switch (e) {
                case "top":
                    return {
                        base: ["top-0", "left-0", "right-0"], active: ["transform-none"], inactive: ["-translate-y-full"]
                    };
                case "right":
                    return {
                        base: ["right-0", "top-0"], active: ["transform-none"], inactive: ["translate-x-full"]
                    };
                case "bottom":
                    return {
                        base: ["bottom-0", "left-0", "right-0"], active: ["transform-none"], inactive: ["translate-y-full"]
                    };
                case "left":
                default:
                    return {
                        base: ["left-0", "top-0"], active: ["transform-none"], inactive: ["-translate-x-full"]
                    };
                case "bottom-edge":
                    return {
                        base: ["left-0", "top-0"], active: ["transform-none"], inactive: ["translate-y-full", this._options.edgeOffset]
                    }
            }
        }, e.prototype.isHidden = function() {
            return !this._visible
        }, e.prototype.isVisible = function() {
            return this._visible
        }, e.prototype.addEventListenerInstance = function(e, t, n) {
            this._eventListenerInstances.push({
                element: e,
                type: t,
                handler: n
            })
        }, e.prototype.removeAllEventListenerInstances = function() {
            this._eventListenerInstances.map((function(e) {
                e.element.removeEventListener(e.type, e.handler)
            })), this._eventListenerInstances = []
        }, e.prototype.getAllEventListenerInstances = function() {
            return this._eventListenerInstances
        }, e.prototype.updateOnShow = function(e) {
            this._options.onShow = e
        }, e.prototype.updateOnHide = function(e) {
            this._options.onHide = e
        }, e.prototype.updateOnToggle = function(e) {
            this._options.onToggle = e
        }, e
    }();

function dh() {
    document.querySelectorAll("[data-drawer-target]").forEach((function(e) {
        var t = e.getAttribute("data-drawer-target"),
            n = document.getElementById(t);
        if (n) {
            var i = e.getAttribute("data-drawer-placement"),
                r = e.getAttribute("data-drawer-body-scrolling"),
                o = e.getAttribute("data-drawer-backdrop"),
                s = e.getAttribute("data-drawer-edge"),
                a = e.getAttribute("data-drawer-edge-offset");
            new ch(n, {
                placement: i || ah.placement,
                bodyScrolling: r ? "true" === r : ah.bodyScrolling,
                backdrop: o ? "true" === o : ah.backdrop,
                edge: s ? "true" === s : ah.edge,
                edgeOffset: a || ah.edgeOffset
            })
        } else console.error("Drawer with id ".concat(t, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"))
    })), document.querySelectorAll("[data-drawer-toggle]").forEach((function(e) {
        var t = e.getAttribute("data-drawer-toggle");
        if (document.getElementById(t)) {
            var n = yd.getInstance("Drawer", t);
            if (n) {
                var i = function() {
                    n.toggle()
                };
                e.addEventListener("click", i), n.addEventListenerInstance(e, "click", i)
            } else console.error("Drawer with id ".concat(t, " has not been initialized. Please initialize it using the data-drawer-target attribute."))
        } else console.error("Drawer with id ".concat(t, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"))
    })), document.querySelectorAll("[data-drawer-dismiss], [data-drawer-hide]").forEach((function(e) {
        var t = e.getAttribute("data-drawer-dismiss") ? e.getAttribute("data-drawer-dismiss") : e.getAttribute("data-drawer-hide");
        if (document.getElementById(t)) {
            var n = yd.getInstance("Drawer", t);
            if (n) {
                var i = function() {
                    n.hide()
                };
                e.addEventListener("click", i), n.addEventListenerInstance(e, "click", i)
            } else console.error("Drawer with id ".concat(t, " has not been initialized. Please initialize it using the data-drawer-target attribute."))
        } else console.error("Drawer with id ".concat(t, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id"))
    })), document.querySelectorAll("[data-drawer-show]").forEach((function(e) {
        var t = e.getAttribute("data-drawer-show");
        if (document.getElementById(t)) {
            var n = yd.getInstance("Drawer", t);
            if (n) {
                var i = function() {
                    n.show()
                };
                e.addEventListener("click", i), n.addEventListenerInstance(e, "click", i)
            } else console.error("Drawer with id ".concat(t, " has not been initialized. Please initialize it using the data-drawer-target attribute."))
        } else console.error("Drawer with id ".concat(t, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"))
    }))
}
"undefined" != typeof window && (window.Drawer = ch, window.initDrawers = dh);
var uh = function() {
        return uh = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, uh.apply(this, arguments)
    },
    hh = {
        defaultTabId: null,
        activeClasses: "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500",
        inactiveClasses: "dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
        onShow: function() {}
    },
    ph = {
        id: null,
        override: !0
    },
    fh = function() {
        function e(e, t, n, i) {
            void 0 === e && (e = null), void 0 === t && (t = []), void 0 === n && (n = hh), void 0 === i && (i = ph), this._instanceId = i.id ? i.id : e.id, this._tabsEl = e, this._items = t, this._activeTab = n ? this.getTab(n.defaultTabId) : null, this._options = uh(uh({}, hh), n), this._initialized = !1, this.init(), yd.addInstance("Tabs", this, this._instanceId, i.override)
        }
        return e.prototype.init = function() {
            var e = this;
            this._items.length && !this._initialized && (this._activeTab || this.setActiveTab(this._items[0]), this.show(this._activeTab.id, !0), this._items.map((function(t) {
                t.triggerEl.addEventListener("click", (function(n) {
                    n.preventDefault(), e.show(t.id)
                }))
            })))
        }, e.prototype.destroy = function() {
            this._initialized && (this._initialized = !1)
        }, e.prototype.removeInstance = function() {
            this.destroy(), yd.removeInstance("Tabs", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.getActiveTab = function() {
            return this._activeTab
        }, e.prototype.setActiveTab = function(e) {
            this._activeTab = e
        }, e.prototype.getTab = function(e) {
            return this._items.filter((function(t) {
                return t.id === e
            }))[0]
        }, e.prototype.show = function(e, t) {
            var n, i, r = this;
            void 0 === t && (t = !1);
            var o = this.getTab(e);
            (o !== this._activeTab || t) && (this._items.map((function(e) {
                var t, n;
                e !== o && ((t = e.triggerEl.classList).remove.apply(t, r._options.activeClasses.split(" ")), (n = e.triggerEl.classList).add.apply(n, r._options.inactiveClasses.split(" ")), e.targetEl.classList.add("hidden"), e.triggerEl.setAttribute("aria-selected", "false"))
            })), (n = o.triggerEl.classList).add.apply(n, this._options.activeClasses.split(" ")), (i = o.triggerEl.classList).remove.apply(i, this._options.inactiveClasses.split(" ")), o.triggerEl.setAttribute("aria-selected", "true"), o.targetEl.classList.remove("hidden"), this.setActiveTab(o), this._options.onShow(this, o))
        }, e.prototype.updateOnShow = function(e) {
            this._options.onShow = e
        }, e
    }();

function gh() {
    document.querySelectorAll("[data-tabs-toggle]").forEach((function(e) {
        var t = [],
            n = e.getAttribute("data-tabs-active-classes"),
            i = e.getAttribute("data-tabs-inactive-classes"),
            r = null;
        e.querySelectorAll('[role="tab"]').forEach((function(e) {
            var n = "true" === e.getAttribute("aria-selected"),
                i = {
                    id: e.getAttribute("data-tabs-target"),
                    triggerEl: e,
                    targetEl: document.querySelector(e.getAttribute("data-tabs-target"))
                };
            t.push(i), n && (r = i.id)
        })), new fh(e, t, {
            defaultTabId: r,
            activeClasses: n || hh.activeClasses,
            inactiveClasses: i || hh.inactiveClasses
        })
    }))
}
"undefined" != typeof window && (window.Tabs = fh, window.initTabs = gh);
var mh = function() {
        return mh = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, mh.apply(this, arguments)
    },
    vh = function(e, t, n) {
        if (n || 2 === arguments.length)
            for (var i, r = 0, o = t.length; r < o; r++) !i && r in t || (i || (i = Array.prototype.slice.call(t, 0, r)), i[r] = t[r]);
        return e.concat(i || Array.prototype.slice.call(t))
    },
    yh = {
        placement: "top",
        triggerType: "hover",
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    },
    bh = {
        id: null,
        override: !0
    },
    wh = function() {
        function e(e, t, n, i) {
            void 0 === e && (e = null), void 0 === t && (t = null), void 0 === n && (n = yh), void 0 === i && (i = bh), this._instanceId = i.id ? i.id : e.id, this._targetEl = e, this._triggerEl = t, this._options = mh(mh({}, yh), n), this._popperInstance = null, this._visible = !1, this._initialized = !1, this.init(), yd.addInstance("Tooltip", this, this._instanceId, i.override)
        }
        return e.prototype.init = function() {
            this._triggerEl && this._targetEl && !this._initialized && (this._setupEventListeners(), this._popperInstance = this._createPopperInstance(), this._initialized = !0)
        }, e.prototype.destroy = function() {
            var e = this;
            if (this._initialized) {
                var t = this._getTriggerEvents();
                t.showEvents.forEach((function(t) {
                    e._triggerEl.removeEventListener(t, e._showHandler)
                })), t.hideEvents.forEach((function(t) {
                    e._triggerEl.removeEventListener(t, e._hideHandler)
                })), this._removeKeydownListener(), this._removeClickOutsideListener(), this._popperInstance && this._popperInstance.destroy(), this._initialized = !1
            }
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Tooltip", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype._setupEventListeners = function() {
            var e = this,
                t = this._getTriggerEvents();
            this._showHandler = function() {
                e.show()
            }, this._hideHandler = function() {
                e.hide()
            }, t.showEvents.forEach((function(t) {
                e._triggerEl.addEventListener(t, e._showHandler)
            })), t.hideEvents.forEach((function(t) {
                e._triggerEl.addEventListener(t, e._hideHandler)
            }))
        }, e.prototype._createPopperInstance = function() {
            return Yu(this._triggerEl, this._targetEl, {
                placement: this._options.placement,
                modifiers: [{
                    name: "offset",
                    options: {
                        offset: [0, 8]
                    }
                }]
            })
        }, e.prototype._getTriggerEvents = function() {
            switch (this._options.triggerType) {
                case "hover":
                default:
                    return {
                        showEvents: ["mouseenter", "focus"], hideEvents: ["mouseleave", "blur"]
                    };
                case "click":
                    return {
                        showEvents: ["click", "focus"], hideEvents: ["focusout", "blur"]
                    };
                case "none":
                    return {
                        showEvents: [], hideEvents: []
                    }
            }
        }, e.prototype._setupKeydownListener = function() {
            var e = this;
            this._keydownEventListener = function(t) {
                "Escape" === t.key && e.hide()
            }, document.body.addEventListener("keydown", this._keydownEventListener, !0)
        }, e.prototype._removeKeydownListener = function() {
            document.body.removeEventListener("keydown", this._keydownEventListener, !0)
        }, e.prototype._setupClickOutsideListener = function() {
            var e = this;
            this._clickOutsideEventListener = function(t) {
                e._handleClickOutside(t, e._targetEl)
            }, document.body.addEventListener("click", this._clickOutsideEventListener, !0)
        }, e.prototype._removeClickOutsideListener = function() {
            document.body.removeEventListener("click", this._clickOutsideEventListener, !0)
        }, e.prototype._handleClickOutside = function(e, t) {
            var n = e.target;
            n === t || t.contains(n) || this._triggerEl.contains(n) || !this.isVisible() || this.hide()
        }, e.prototype.isVisible = function() {
            return this._visible
        }, e.prototype.toggle = function() {
            this.isVisible() ? this.hide() : this.show()
        }, e.prototype.show = function() {
            this._targetEl.classList.remove("opacity-0", "invisible"), this._targetEl.classList.add("opacity-100", "visible"), this._popperInstance.setOptions((function(e) {
                return mh(mh({}, e), {
                    modifiers: vh(vh([], e.modifiers, !0), [{
                        name: "eventListeners",
                        enabled: !0
                    }], !1)
                })
            })), this._setupClickOutsideListener(), this._setupKeydownListener(), this._popperInstance.update(), this._visible = !0, this._options.onShow(this)
        }, e.prototype.hide = function() {
            this._targetEl.classList.remove("opacity-100", "visible"), this._targetEl.classList.add("opacity-0", "invisible"), this._popperInstance.setOptions((function(e) {
                return mh(mh({}, e), {
                    modifiers: vh(vh([], e.modifiers, !0), [{
                        name: "eventListeners",
                        enabled: !1
                    }], !1)
                })
            })), this._removeClickOutsideListener(), this._removeKeydownListener(), this._visible = !1, this._options.onHide(this)
        }, e.prototype.updateOnShow = function(e) {
            this._options.onShow = e
        }, e.prototype.updateOnHide = function(e) {
            this._options.onHide = e
        }, e.prototype.updateOnToggle = function(e) {
            this._options.onToggle = e
        }, e
    }();

function _h() {
    document.querySelectorAll("[data-tooltip-target]").forEach((function(e) {
        var t = e.getAttribute("data-tooltip-target"),
            n = document.getElementById(t);
        if (n) {
            var i = e.getAttribute("data-tooltip-trigger"),
                r = e.getAttribute("data-tooltip-placement");
            new wh(n, e, {
                placement: r || yh.placement,
                triggerType: i || yh.triggerType
            })
        } else console.error('The tooltip element with id "'.concat(t, '" does not exist. Please check the data-tooltip-target attribute.'))
    }))
}
"undefined" != typeof window && (window.Tooltip = wh, window.initTooltips = _h);
var xh = function() {
        return xh = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, xh.apply(this, arguments)
    },
    kh = function(e, t, n) {
        if (n || 2 === arguments.length)
            for (var i, r = 0, o = t.length; r < o; r++) !i && r in t || (i || (i = Array.prototype.slice.call(t, 0, r)), i[r] = t[r]);
        return e.concat(i || Array.prototype.slice.call(t))
    },
    Eh = {
        placement: "top",
        offset: 10,
        triggerType: "hover",
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    },
    Ch = {
        id: null,
        override: !0
    },
    Sh = function() {
        function e(e, t, n, i) {
            void 0 === e && (e = null), void 0 === t && (t = null), void 0 === n && (n = Eh), void 0 === i && (i = Ch), this._instanceId = i.id ? i.id : e.id, this._targetEl = e, this._triggerEl = t, this._options = xh(xh({}, Eh), n), this._popperInstance = null, this._visible = !1, this._initialized = !1, this.init(), yd.addInstance("Popover", this, i.id ? i.id : this._targetEl.id, i.override)
        }
        return e.prototype.init = function() {
            this._triggerEl && this._targetEl && !this._initialized && (this._setupEventListeners(), this._popperInstance = this._createPopperInstance(), this._initialized = !0)
        }, e.prototype.destroy = function() {
            var e = this;
            if (this._initialized) {
                var t = this._getTriggerEvents();
                t.showEvents.forEach((function(t) {
                    e._triggerEl.removeEventListener(t, e._showHandler), e._targetEl.removeEventListener(t, e._showHandler)
                })), t.hideEvents.forEach((function(t) {
                    e._triggerEl.removeEventListener(t, e._hideHandler), e._targetEl.removeEventListener(t, e._hideHandler)
                })), this._removeKeydownListener(), this._removeClickOutsideListener(), this._popperInstance && this._popperInstance.destroy(), this._initialized = !1
            }
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Popover", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype._setupEventListeners = function() {
            var e = this,
                t = this._getTriggerEvents();
            this._showHandler = function() {
                e.show()
            }, this._hideHandler = function() {
                setTimeout((function() {
                    e._targetEl.matches(":hover") || e.hide()
                }), 100)
            }, t.showEvents.forEach((function(t) {
                e._triggerEl.addEventListener(t, e._showHandler), e._targetEl.addEventListener(t, e._showHandler)
            })), t.hideEvents.forEach((function(t) {
                e._triggerEl.addEventListener(t, e._hideHandler), e._targetEl.addEventListener(t, e._hideHandler)
            }))
        }, e.prototype._createPopperInstance = function() {
            return Yu(this._triggerEl, this._targetEl, {
                placement: this._options.placement,
                modifiers: [{
                    name: "offset",
                    options: {
                        offset: [0, this._options.offset]
                    }
                }]
            })
        }, e.prototype._getTriggerEvents = function() {
            switch (this._options.triggerType) {
                case "hover":
                default:
                    return {
                        showEvents: ["mouseenter", "focus"], hideEvents: ["mouseleave", "blur"]
                    };
                case "click":
                    return {
                        showEvents: ["click", "focus"], hideEvents: ["focusout", "blur"]
                    };
                case "none":
                    return {
                        showEvents: [], hideEvents: []
                    }
            }
        }, e.prototype._setupKeydownListener = function() {
            var e = this;
            this._keydownEventListener = function(t) {
                "Escape" === t.key && e.hide()
            }, document.body.addEventListener("keydown", this._keydownEventListener, !0)
        }, e.prototype._removeKeydownListener = function() {
            document.body.removeEventListener("keydown", this._keydownEventListener, !0)
        }, e.prototype._setupClickOutsideListener = function() {
            var e = this;
            this._clickOutsideEventListener = function(t) {
                e._handleClickOutside(t, e._targetEl)
            }, document.body.addEventListener("click", this._clickOutsideEventListener, !0)
        }, e.prototype._removeClickOutsideListener = function() {
            document.body.removeEventListener("click", this._clickOutsideEventListener, !0)
        }, e.prototype._handleClickOutside = function(e, t) {
            var n = e.target;
            n === t || t.contains(n) || this._triggerEl.contains(n) || !this.isVisible() || this.hide()
        }, e.prototype.isVisible = function() {
            return this._visible
        }, e.prototype.toggle = function() {
            this.isVisible() ? this.hide() : this.show(), this._options.onToggle(this)
        }, e.prototype.show = function() {
            this._targetEl.classList.remove("opacity-0", "invisible"), this._targetEl.classList.add("opacity-100", "visible"), this._popperInstance.setOptions((function(e) {
                return xh(xh({}, e), {
                    modifiers: kh(kh([], e.modifiers, !0), [{
                        name: "eventListeners",
                        enabled: !0
                    }], !1)
                })
            })), this._setupClickOutsideListener(), this._setupKeydownListener(), this._popperInstance.update(), this._visible = !0, this._options.onShow(this)
        }, e.prototype.hide = function() {
            this._targetEl.classList.remove("opacity-100", "visible"), this._targetEl.classList.add("opacity-0", "invisible"), this._popperInstance.setOptions((function(e) {
                return xh(xh({}, e), {
                    modifiers: kh(kh([], e.modifiers, !0), [{
                        name: "eventListeners",
                        enabled: !1
                    }], !1)
                })
            })), this._removeClickOutsideListener(), this._removeKeydownListener(), this._visible = !1, this._options.onHide(this)
        }, e.prototype.updateOnShow = function(e) {
            this._options.onShow = e
        }, e.prototype.updateOnHide = function(e) {
            this._options.onHide = e
        }, e.prototype.updateOnToggle = function(e) {
            this._options.onToggle = e
        }, e
    }();

function Oh() {
    document.querySelectorAll("[data-popover-target]").forEach((function(e) {
        var t = e.getAttribute("data-popover-target"),
            n = document.getElementById(t);
        if (n) {
            var i = e.getAttribute("data-popover-trigger"),
                r = e.getAttribute("data-popover-placement"),
                o = e.getAttribute("data-popover-offset");
            new Sh(n, e, {
                placement: r || Eh.placement,
                offset: o ? parseInt(o) : Eh.offset,
                triggerType: i || Eh.triggerType
            })
        } else console.error('The popover element with id "'.concat(t, '" does not exist. Please check the data-popover-target attribute.'))
    }))
}
"undefined" != typeof window && (window.Popover = Sh, window.initPopovers = Oh);
var Lh = function() {
        return Lh = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, Lh.apply(this, arguments)
    },
    Ah = {
        triggerType: "hover",
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    },
    Dh = {
        id: null,
        override: !0
    },
    Th = function() {
        function e(e, t, n, i, r) {
            void 0 === e && (e = null), void 0 === t && (t = null), void 0 === n && (n = null), void 0 === i && (i = Ah), void 0 === r && (r = Dh), this._instanceId = r.id ? r.id : n.id, this._parentEl = e, this._triggerEl = t, this._targetEl = n, this._options = Lh(Lh({}, Ah), i), this._visible = !1, this._initialized = !1, this.init(), yd.addInstance("Dial", this, this._instanceId, r.override)
        }
        return e.prototype.init = function() {
            var e = this;
            if (this._triggerEl && this._targetEl && !this._initialized) {
                var t = this._getTriggerEventTypes(this._options.triggerType);
                this._showEventHandler = function() {
                    e.show()
                }, t.showEvents.forEach((function(t) {
                    e._triggerEl.addEventListener(t, e._showEventHandler), e._targetEl.addEventListener(t, e._showEventHandler)
                })), this._hideEventHandler = function() {
                    e._parentEl.matches(":hover") || e.hide()
                }, t.hideEvents.forEach((function(t) {
                    e._parentEl.addEventListener(t, e._hideEventHandler)
                })), this._initialized = !0
            }
        }, e.prototype.destroy = function() {
            var e = this;
            if (this._initialized) {
                var t = this._getTriggerEventTypes(this._options.triggerType);
                t.showEvents.forEach((function(t) {
                    e._triggerEl.removeEventListener(t, e._showEventHandler), e._targetEl.removeEventListener(t, e._showEventHandler)
                })), t.hideEvents.forEach((function(t) {
                    e._parentEl.removeEventListener(t, e._hideEventHandler)
                })), this._initialized = !1
            }
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("Dial", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.hide = function() {
            this._targetEl.classList.add("hidden"), this._triggerEl && this._triggerEl.setAttribute("aria-expanded", "false"), this._visible = !1, this._options.onHide(this)
        }, e.prototype.show = function() {
            this._targetEl.classList.remove("hidden"), this._triggerEl && this._triggerEl.setAttribute("aria-expanded", "true"), this._visible = !0, this._options.onShow(this)
        }, e.prototype.toggle = function() {
            this._visible ? this.hide() : this.show()
        }, e.prototype.isHidden = function() {
            return !this._visible
        }, e.prototype.isVisible = function() {
            return this._visible
        }, e.prototype._getTriggerEventTypes = function(e) {
            switch (e) {
                case "hover":
                default:
                    return {
                        showEvents: ["mouseenter", "focus"], hideEvents: ["mouseleave", "blur"]
                    };
                case "click":
                    return {
                        showEvents: ["click", "focus"], hideEvents: ["focusout", "blur"]
                    };
                case "none":
                    return {
                        showEvents: [], hideEvents: []
                    }
            }
        }, e.prototype.updateOnShow = function(e) {
            this._options.onShow = e
        }, e.prototype.updateOnHide = function(e) {
            this._options.onHide = e
        }, e.prototype.updateOnToggle = function(e) {
            this._options.onToggle = e
        }, e
    }();

function Ih() {
    document.querySelectorAll("[data-dial-init]").forEach((function(e) {
        var t = e.querySelector("[data-dial-toggle]");
        if (t) {
            var n = t.getAttribute("data-dial-toggle"),
                i = document.getElementById(n);
            if (i) {
                var r = t.getAttribute("data-dial-trigger");
                new Th(e, t, i, {
                    triggerType: r || Ah.triggerType
                })
            } else console.error("Dial with id ".concat(n, " does not exist. Are you sure that the data-dial-toggle attribute points to the correct modal id?"))
        } else console.error("Dial with id ".concat(e.id, " does not have a trigger element. Are you sure that the data-dial-toggle attribute exists?"))
    }))
}
"undefined" != typeof window && (window.Dial = Th, window.initDials = Ih);
var Mh = function() {
        return Mh = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, Mh.apply(this, arguments)
    },
    jh = {
        minValue: null,
        maxValue: null,
        onIncrement: function() {},
        onDecrement: function() {}
    },
    Ph = {
        id: null,
        override: !0
    },
    Rh = function() {
        function e(e, t, n, i, r) {
            void 0 === e && (e = null), void 0 === t && (t = null), void 0 === n && (n = null), void 0 === i && (i = jh), void 0 === r && (r = Ph), this._instanceId = r.id ? r.id : e.id, this._targetEl = e, this._incrementEl = t, this._decrementEl = n, this._options = Mh(Mh({}, jh), i), this._initialized = !1, this.init(), yd.addInstance("InputCounter", this, this._instanceId, r.override)
        }
        return e.prototype.init = function() {
            var e = this;
            this._targetEl && !this._initialized && (this._inputHandler = function(t) {
                var n = t.target;
                /^\d*$/.test(n.value) || (n.value = n.value.replace(/[^\d]/g, "")), null !== e._options.maxValue && parseInt(n.value) > e._options.maxValue && (n.value = e._options.maxValue.toString()), null !== e._options.minValue && parseInt(n.value) < e._options.minValue && (n.value = e._options.minValue.toString())
            }, this._incrementClickHandler = function() {
                e.increment()
            }, this._decrementClickHandler = function() {
                e.decrement()
            }, this._targetEl.addEventListener("input", this._inputHandler), this._incrementEl && this._incrementEl.addEventListener("click", this._incrementClickHandler), this._decrementEl && this._decrementEl.addEventListener("click", this._decrementClickHandler), this._initialized = !0)
        }, e.prototype.destroy = function() {
            this._targetEl && this._initialized && (this._targetEl.removeEventListener("input", this._inputHandler), this._incrementEl && this._incrementEl.removeEventListener("click", this._incrementClickHandler), this._decrementEl && this._decrementEl.removeEventListener("click", this._decrementClickHandler), this._initialized = !1)
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("InputCounter", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.getCurrentValue = function() {
            return parseInt(this._targetEl.value) || 0
        }, e.prototype.increment = function() {
            null !== this._options.maxValue && this.getCurrentValue() >= this._options.maxValue || (this._targetEl.value = (this.getCurrentValue() + 1).toString(), this._options.onIncrement(this))
        }, e.prototype.decrement = function() {
            null !== this._options.minValue && this.getCurrentValue() <= this._options.minValue || (this._targetEl.value = (this.getCurrentValue() - 1).toString(), this._options.onDecrement(this))
        }, e.prototype.updateOnIncrement = function(e) {
            this._options.onIncrement = e
        }, e.prototype.updateOnDecrement = function(e) {
            this._options.onDecrement = e
        }, e
    }();

function Fh() {
    document.querySelectorAll("[data-input-counter]").forEach((function(e) {
        var t = e.id,
            n = document.querySelector('[data-input-counter-increment="' + t + '"]'),
            i = document.querySelector('[data-input-counter-decrement="' + t + '"]'),
            r = e.getAttribute("data-input-counter-min"),
            o = e.getAttribute("data-input-counter-max");
        e ? yd.instanceExists("InputCounter", e.getAttribute("id")) || new Rh(e, n || null, i || null, {
            minValue: r ? parseInt(r) : null,
            maxValue: o ? parseInt(o) : null
        }) : console.error('The target element with id "'.concat(t, '" does not exist. Please check the data-input-counter attribute.'))
    }))
}
"undefined" != typeof window && (window.InputCounter = Rh, window.initInputCounters = Fh);
var Bh = function() {
        return Bh = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, Bh.apply(this, arguments)
    },
    Hh = {
        htmlEntities: !1,
        contentType: "input",
        onCopy: function() {}
    },
    Nh = {
        id: null,
        override: !0
    },
    zh = function() {
        function e(e, t, n, i) {
            void 0 === e && (e = null), void 0 === t && (t = null), void 0 === n && (n = Hh), void 0 === i && (i = Nh), this._instanceId = i.id ? i.id : t.id, this._triggerEl = e, this._targetEl = t, this._options = Bh(Bh({}, Hh), n), this._initialized = !1, this.init(), yd.addInstance("CopyClipboard", this, this._instanceId, i.override)
        }
        return e.prototype.init = function() {
            var e = this;
            this._targetEl && this._triggerEl && !this._initialized && (this._triggerElClickHandler = function() {
                e.copy()
            }, this._triggerEl && this._triggerEl.addEventListener("click", this._triggerElClickHandler), this._initialized = !0)
        }, e.prototype.destroy = function() {
            this._triggerEl && this._targetEl && this._initialized && (this._triggerEl && this._triggerEl.removeEventListener("click", this._triggerElClickHandler), this._initialized = !1)
        }, e.prototype.removeInstance = function() {
            yd.removeInstance("CopyClipboard", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.getTargetValue = function() {
            return "input" === this._options.contentType ? this._targetEl.value : "innerHTML" === this._options.contentType ? this._targetEl.innerHTML : "textContent" === this._options.contentType ? this._targetEl.textContent.replace(/\s+/g, " ").trim() : void 0
        }, e.prototype.copy = function() {
            var e = this.getTargetValue();
            this._options.htmlEntities && (e = this.decodeHTML(e));
            var t = document.createElement("textarea");
            return t.value = e, document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t), this._options.onCopy(this), e
        }, e.prototype.decodeHTML = function(e) {
            var t = document.createElement("textarea");
            return t.innerHTML = e, t.textContent
        }, e.prototype.updateOnCopyCallback = function(e) {
            this._options.onCopy = e
        }, e
    }();

function Vh() {
    document.querySelectorAll("[data-copy-to-clipboard-target]").forEach((function(e) {
        var t = e.getAttribute("data-copy-to-clipboard-target"),
            n = document.getElementById(t),
            i = e.getAttribute("data-copy-to-clipboard-content-type"),
            r = e.getAttribute("data-copy-to-clipboard-html-entities");
        n ? yd.instanceExists("CopyClipboard", n.getAttribute("id")) || new zh(e, n, {
            htmlEntities: !(!r || "true" !== r) || Hh.htmlEntities,
            contentType: i || Hh.contentType
        }) : console.error('The target element with id "'.concat(t, '" does not exist. Please check the data-copy-to-clipboard-target attribute.'))
    }))
}

function Uh(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
    return i
}

function qh(e, t, n) {
    return t = Jh(t),
        function(e, t) {
            if (t && ("object" == typeof t || "function" == typeof t)) return t;
            if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
            return function(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }(e)
        }(e, Zh() ? Reflect.construct(t, n || [], Jh(e).constructor) : t.apply(e, n))
}

function Wh(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}

function Kh(e, t) {
    for (var n = 0; n < t.length; n++) {
        var i = t[n];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, tp(i.key), i)
    }
}

function $h(e, t, n) {
    return t && Kh(e.prototype, t), n && Kh(e, n), Object.defineProperty(e, "prototype", {
        writable: !1
    }), e
}

function Yh() {
    return Yh = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(e, t, n) {
        var i = function(e, t) {
            for (; !{}.hasOwnProperty.call(e, t) && null !== (e = Jh(e)););
            return e
        }(e, t);
        if (i) {
            var r = Object.getOwnPropertyDescriptor(i, t);
            return r.get ? r.get.call(arguments.length < 3 ? e : n) : r.value
        }
    }, Yh.apply(null, arguments)
}

function Jh(e) {
    return (Jh = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e) {
        return e.__proto__ || Object.getPrototypeOf(e)
    })(e)
}

function Gh(e, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
    e.prototype = Object.create(t && t.prototype, {
        constructor: {
            value: e,
            writable: !0,
            configurable: !0
        }
    }), Object.defineProperty(e, "prototype", {
        writable: !1
    }), t && Xh(e, t)
}

function Zh() {
    try {
        var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {})))
    } catch (t) {}
    return (Zh = function() {
        return !!e
    })()
}

function Xh(e, t) {
    return (Xh = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e, t) {
        return e.__proto__ = t, e
    })(e, t)
}

function Qh(e, t) {
    return function(e) {
        if (Array.isArray(e)) return e
    }(e) || function(e, t) {
        var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
        if (null != n) {
            var i, r, o, s, a = [],
                l = !0,
                c = !1;
            try {
                if (o = (n = n.call(e)).next, 0 === t) {
                    if (Object(n) !== n) return;
                    l = !1
                } else
                    for (; !(l = (i = o.call(n)).done) && (a.push(i.value), a.length !== t); l = !0);
            } catch (d) {
                c = !0, r = d
            } finally {
                try {
                    if (!l && null != n.return && (s = n.return(), Object(s) !== s)) return
                } finally {
                    if (c) throw r
                }
            }
            return a
        }
    }(e, t) || ip(e, t) || function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }()
}

function ep(e) {
    return function(e) {
        if (Array.isArray(e)) return Uh(e)
    }(e) || function(e) {
        if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
    }(e) || ip(e) || function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }()
}

function tp(e) {
    var t = function(e, t) {
        if ("object" != typeof e || !e) return e;
        var n = e[Symbol.toPrimitive];
        if (void 0 !== n) {
            var i = n.call(e, t);
            if ("object" != typeof i) return i;
            throw new TypeError("@@toPrimitive must return a primitive value.")
        }
        return String(e)
    }(e, "string");
    return "symbol" == typeof t ? t : t + ""
}

function np(e) {
    return (np = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    })(e)
}

function ip(e, t) {
    if (e) {
        if ("string" == typeof e) return Uh(e, t);
        var n = {}.toString.call(e).slice(8, -1);
        return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Uh(e, t) : void 0
    }
}

function rp(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
}

function op(e) {
    return e[e.length - 1]
}

function sp(e) {
    for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
    return n.forEach((function(t) {
        e.includes(t) || e.push(t)
    })), e
}

function ap(e, t) {
    return e ? e.split(t) : []
}

function lp(e, t, n) {
    return (void 0 === t || e >= t) && (void 0 === n || e <= n)
}

function cp(e, t, n) {
    return e < t ? t : e > n ? n : e
}

function dp(e, t) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
        r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "",
        o = Object.keys(n).reduce((function(e, t) {
            var r = n[t];
            return "function" == typeof r && (r = r(i)), "".concat(e, " ").concat(t, '="').concat(r, '"')
        }), e);
    r += "<".concat(o, "></").concat(e, ">");
    var s = i + 1;
    return s < t ? dp(e, t, n, s, r) : r
}

function up(e) {
    return e.replace(/>\s+/g, ">").replace(/\s+</, "<")
}

function hp(e) {
    return new Date(e).setHours(0, 0, 0, 0)
}

function pp() {
    return (new Date).setHours(0, 0, 0, 0)
}

function fp() {
    switch (arguments.length) {
        case 0:
            return pp();
        case 1:
            return hp(arguments.length <= 0 ? void 0 : arguments[0])
    }
    var e = new Date(0);
    return e.setFullYear.apply(e, arguments), e.setHours(0, 0, 0, 0)
}

function gp(e, t) {
    var n = new Date(e);
    return n.setDate(n.getDate() + t)
}

function mp(e, t) {
    var n = new Date(e),
        i = n.getMonth() + t,
        r = i % 12;
    r < 0 && (r += 12);
    var o = n.setMonth(i);
    return n.getMonth() !== r ? n.setDate(0) : o
}

function vp(e, t) {
    var n = new Date(e),
        i = n.getMonth(),
        r = n.setFullYear(n.getFullYear() + t);
    return 1 === i && 2 === n.getMonth() ? n.setDate(0) : r
}

function yp(e, t) {
    return (e - t + 7) % 7
}

function bp(e, t) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
        i = new Date(e).getDay();
    return gp(e, yp(t, n) - yp(i, n))
}

function wp(e, t) {
    var n = new Date(e).getFullYear();
    return Math.floor(n / t) * t
}
"undefined" != typeof window && (window.CopyClipboard = zh, window.initClipboards = Vh);
var _p = /dd?|DD?|mm?|MM?|yy?(?:yy)?/,
    xp = /[\s!-/:-@[-`{-~年月日]+/,
    kp = {},
    Ep = {
        y: function(e, t) {
            return new Date(e).setFullYear(parseInt(t, 10))
        },
        m: function(e, t, n) {
            var i = new Date(e),
                r = parseInt(t, 10) - 1;
            if (isNaN(r)) {
                if (!t) return NaN;
                var o = t.toLowerCase(),
                    s = function(e) {
                        return e.toLowerCase().startsWith(o)
                    };
                if ((r = n.monthsShort.findIndex(s)) < 0 && (r = n.months.findIndex(s)), r < 0) return NaN
            }
            return i.setMonth(r), i.getMonth() !== Sp(r) ? i.setDate(0) : i.getTime()
        },
        d: function(e, t) {
            return new Date(e).setDate(parseInt(t, 10))
        }
    },
    Cp = {
        d: function(e) {
            return e.getDate()
        },
        dd: function(e) {
            return Op(e.getDate(), 2)
        },
        D: function(e, t) {
            return t.daysShort[e.getDay()]
        },
        DD: function(e, t) {
            return t.days[e.getDay()]
        },
        m: function(e) {
            return e.getMonth() + 1
        },
        mm: function(e) {
            return Op(e.getMonth() + 1, 2)
        },
        M: function(e, t) {
            return t.monthsShort[e.getMonth()]
        },
        MM: function(e, t) {
            return t.months[e.getMonth()]
        },
        y: function(e) {
            return e.getFullYear()
        },
        yy: function(e) {
            return Op(e.getFullYear(), 2).slice(-2)
        },
        yyyy: function(e) {
            return Op(e.getFullYear(), 4)
        }
    };

function Sp(e) {
    return e > -1 ? e % 12 : Sp(e + 12)
}

function Op(e, t) {
    return e.toString().padStart(t, "0")
}

function Lp(e) {
    if ("string" != typeof e) throw new Error("Invalid date format.");
    if (e in kp) return kp[e];
    var t = e.split(_p),
        n = e.match(new RegExp(_p, "g"));
    if (0 === t.length || !n) throw new Error("Invalid date format.");
    var i = n.map((function(e) {
            return Cp[e]
        })),
        r = Object.keys(Ep).reduce((function(e, t) {
            return n.find((function(e) {
                return "D" !== e[0] && e[0].toLowerCase() === t
            })) && e.push(t), e
        }), []);
    return kp[e] = {
        parser: function(e, t) {
            var i = e.split(xp).reduce((function(e, t, i) {
                if (t.length > 0 && n[i]) {
                    var r = n[i][0];
                    "M" === r ? e.m = t : "D" !== r && (e[r] = t)
                }
                return e
            }), {});
            return r.reduce((function(e, n) {
                var r = Ep[n](e, i[n], t);
                return isNaN(r) ? e : r
            }), pp())
        },
        formatter: function(e, n) {
            return i.reduce((function(i, r, o) {
                return i + "".concat(t[o]).concat(r(e, n))
            }), "") + op(t)
        }
    }
}

function Ap(e, t, n) {
    if (e instanceof Date || "number" == typeof e) {
        var i = hp(e);
        return isNaN(i) ? void 0 : i
    }
    if (e) {
        if ("today" === e) return pp();
        if (t && t.toValue) {
            var r = t.toValue(e, t, n);
            return isNaN(r) ? void 0 : hp(r)
        }
        return Lp(t).parser(e, n)
    }
}

function Dp(e, t, n) {
    if (isNaN(e) || !e && 0 !== e) return "";
    var i = "number" == typeof e ? new Date(e) : e;
    return t.toDisplay ? t.toDisplay(i, t, n) : Lp(t).formatter(i, n)
}
var Tp = new WeakMap,
    Ip = EventTarget.prototype,
    Mp = Ip.addEventListener,
    jp = Ip.removeEventListener;

function Pp(e, t) {
    var n = Tp.get(e);
    n || (n = [], Tp.set(e, n)), t.forEach((function(e) {
        Mp.call.apply(Mp, ep(e)), n.push(e)
    }))
}

function Rp(e) {
    var t = Tp.get(e);
    t && (t.forEach((function(e) {
        jp.call.apply(jp, ep(e))
    })), Tp.delete(e))
}
if (!Event.prototype.composedPath) {
    var Fp = function e(t) {
        var n, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
        return i.push(t), t.parentNode ? n = t.parentNode : t.host ? n = t.host : t.defaultView && (n = t.defaultView), n ? e(n, i) : i
    };
    Event.prototype.composedPath = function() {
        return Fp(this.target)
    }
}

function Bp(e, t, n) {
    var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
        r = e[i];
    return t(r) ? r : r !== n && r.parentElement ? Bp(e, t, n, i + 1) : void 0
}

function Hp(e, t) {
    var n = "function" == typeof t ? t : function(e) {
        return e.matches(t)
    };
    return Bp(e.composedPath(), n, e.currentTarget)
}
var Np = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear",
            titleFormat: "MM y"
        }
    },
    zp = {
        autohide: !1,
        beforeShowDay: null,
        beforeShowDecade: null,
        beforeShowMonth: null,
        beforeShowYear: null,
        calendarWeeks: !1,
        clearBtn: !1,
        dateDelimiter: ",",
        datesDisabled: [],
        daysOfWeekDisabled: [],
        daysOfWeekHighlighted: [],
        defaultViewDate: void 0,
        disableTouchKeyboard: !1,
        format: "mm/dd/yyyy",
        language: "en",
        maxDate: null,
        maxNumberOfDates: 1,
        maxView: 3,
        minDate: null,
        nextArrow: '<svg class="w-4 h-4 rtl:rotate-180 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>',
        orientation: "auto",
        pickLevel: 0,
        prevArrow: '<svg class="w-4 h-4 rtl:rotate-180 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/></svg>',
        showDaysOfWeek: !0,
        showOnClick: !0,
        showOnFocus: !0,
        startView: 0,
        title: "",
        todayBtn: !1,
        todayBtnMode: 0,
        todayHighlight: !1,
        updateOnBlur: !0,
        weekStart: 0
    },
    Vp = document.createRange();

function Up(e) {
    return Vp.createContextualFragment(e)
}

function qp(e) {
    "none" !== e.style.display && (e.style.display && (e.dataset.styleDisplay = e.style.display), e.style.display = "none")
}

function Wp(e) {
    "none" === e.style.display && (e.dataset.styleDisplay ? (e.style.display = e.dataset.styleDisplay, delete e.dataset.styleDisplay) : e.style.display = "")
}

function Kp(e) {
    e.firstChild && (e.removeChild(e.firstChild), Kp(e))
}
var $p = zp.language,
    Yp = zp.format,
    Jp = zp.weekStart;

function Gp(e, t) {
    return e.length < 6 && t >= 0 && t < 7 ? sp(e, t) : e
}

function Zp(e) {
    return (e + 6) % 7
}

function Xp(e, t, n, i) {
    var r = Ap(e, t, n);
    return void 0 !== r ? r : i
}

function Qp(e, t) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3,
        i = parseInt(e, 10);
    return i >= 0 && i <= n ? i : t
}

function ef(e, t) {
    var n, i = Object.assign({}, e),
        r = {},
        o = t.constructor.locales,
        s = t.config || {},
        a = s.format,
        l = s.language,
        c = s.locale,
        d = s.maxDate,
        u = s.maxView,
        h = s.minDate,
        p = s.pickLevel,
        f = s.startView,
        g = s.weekStart;
    if (i.language && (i.language !== l && (o[i.language] ? n = i.language : void 0 === o[n = i.language.split("-")[0]] && (n = !1)), delete i.language, n)) {
        l = r.language = n;
        var m = c || o[$p];
        c = Object.assign({
            format: Yp,
            weekStart: Jp
        }, o[$p]), l !== $p && Object.assign(c, o[l]), r.locale = c, a === m.format && (a = r.format = c.format), g === m.weekStart && (g = r.weekStart = c.weekStart, r.weekEnd = Zp(c.weekStart))
    }
    if (i.format) {
        var v = "function" == typeof i.format.toDisplay,
            y = "function" == typeof i.format.toValue,
            b = _p.test(i.format);
        (v && y || b) && (a = r.format = i.format), delete i.format
    }
    var w = h,
        _ = d;
    if (void 0 !== i.minDate && (w = null === i.minDate ? fp(0, 0, 1) : Xp(i.minDate, a, c, w), delete i.minDate), void 0 !== i.maxDate && (_ = null === i.maxDate ? void 0 : Xp(i.maxDate, a, c, _), delete i.maxDate), _ < w ? (h = r.minDate = _, d = r.maxDate = w) : (h !== w && (h = r.minDate = w), d !== _ && (d = r.maxDate = _)), i.datesDisabled && (r.datesDisabled = i.datesDisabled.reduce((function(e, t) {
            var n = Ap(t, a, c);
            return void 0 !== n ? sp(e, n) : e
        }), []), delete i.datesDisabled), void 0 !== i.defaultViewDate) {
        var x = Ap(i.defaultViewDate, a, c);
        void 0 !== x && (r.defaultViewDate = x), delete i.defaultViewDate
    }
    if (void 0 !== i.weekStart) {
        var k = Number(i.weekStart) % 7;
        isNaN(k) || (g = r.weekStart = k, r.weekEnd = Zp(k)), delete i.weekStart
    }
    if (i.daysOfWeekDisabled && (r.daysOfWeekDisabled = i.daysOfWeekDisabled.reduce(Gp, []), delete i.daysOfWeekDisabled), i.daysOfWeekHighlighted && (r.daysOfWeekHighlighted = i.daysOfWeekHighlighted.reduce(Gp, []), delete i.daysOfWeekHighlighted), void 0 !== i.maxNumberOfDates) {
        var E = parseInt(i.maxNumberOfDates, 10);
        E >= 0 && (r.maxNumberOfDates = E, r.multidate = 1 !== E), delete i.maxNumberOfDates
    }
    i.dateDelimiter && (r.dateDelimiter = String(i.dateDelimiter), delete i.dateDelimiter);
    var C = p;
    void 0 !== i.pickLevel && (C = Qp(i.pickLevel, 2), delete i.pickLevel), C !== p && (p = r.pickLevel = C);
    var S = u;
    void 0 !== i.maxView && (S = Qp(i.maxView, u), delete i.maxView), (S = p > S ? p : S) !== u && (u = r.maxView = S);
    var O = f;
    if (void 0 !== i.startView && (O = Qp(i.startView, O), delete i.startView), O < p ? O = p : O > u && (O = u), O !== f && (r.startView = O), i.prevArrow) {
        var L = Up(i.prevArrow);
        L.childNodes.length > 0 && (r.prevArrow = L.childNodes), delete i.prevArrow
    }
    if (i.nextArrow) {
        var A = Up(i.nextArrow);
        A.childNodes.length > 0 && (r.nextArrow = A.childNodes), delete i.nextArrow
    }
    if (void 0 !== i.disableTouchKeyboard && (r.disableTouchKeyboard = "ontouchstart" in document && !!i.disableTouchKeyboard, delete i.disableTouchKeyboard), i.orientation) {
        var D = i.orientation.toLowerCase().split(/\s+/g);
        r.orientation = {
            x: D.find((function(e) {
                return "left" === e || "right" === e
            })) || "auto",
            y: D.find((function(e) {
                return "top" === e || "bottom" === e
            })) || "auto"
        }, delete i.orientation
    }
    if (void 0 !== i.todayBtnMode) {
        switch (i.todayBtnMode) {
            case 0:
            case 1:
                r.todayBtnMode = i.todayBtnMode
        }
        delete i.todayBtnMode
    }
    return Object.keys(i).forEach((function(e) {
        void 0 !== i[e] && rp(zp, e) && (r[e] = i[e])
    })), r
}
var tf = up('<div class="datepicker hidden">\n  <div class="datepicker-picker inline-block rounded-lg bg-white dark:bg-gray-700 shadow-lg p-4">\n    <div class="datepicker-header">\n      <div class="datepicker-title bg-white dark:bg-gray-700 dark:text-white px-2 py-3 text-center font-semibold"></div>\n      <div class="datepicker-controls flex justify-between mb-2">\n        <button type="button" class="bg-white dark:bg-gray-700 rounded-lg text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 prev-btn"></button>\n        <button type="button" class="text-sm rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-semibold py-2.5 px-5 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 view-switch"></button>\n        <button type="button" class="bg-white dark:bg-gray-700 rounded-lg text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 next-btn"></button>\n      </div>\n    </div>\n    <div class="datepicker-main p-1"></div>\n    <div class="datepicker-footer">\n      <div class="datepicker-controls flex space-x-2 rtl:space-x-reverse mt-2">\n        <button type="button" class="%buttonClass% today-btn text-white bg-blue-700 !bg-primary-700 dark:bg-blue-600 dark:!bg-primary-600 hover:bg-blue-800 hover:!bg-primary-800 dark:hover:bg-blue-700 dark:hover:!bg-primary-700 focus:ring-4 focus:ring-blue-300 focus:!ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"></button>\n        <button type="button" class="%buttonClass% clear-btn text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 focus:!ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"></button>\n      </div>\n    </div>\n  </div>\n</div>'),
    nf = up('<div class="days">\n  <div class="days-of-week grid grid-cols-7 mb-1">'.concat(dp("span", 7, {
        class: "dow block flex-1 leading-9 border-0 rounded-lg cursor-default text-center text-gray-900 font-semibold text-sm"
    }), '</div>\n  <div class="datepicker-grid w-64 grid grid-cols-7">').concat(dp("span", 42, {
        class: "block flex-1 leading-9 border-0 rounded-lg cursor-default text-center text-gray-900 font-semibold text-sm h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400"
    }), "</div>\n</div>")),
    rf = up('<div class="calendar-weeks">\n  <div class="days-of-week flex"><span class="dow h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400"></span></div>\n  <div class="weeks">'.concat(dp("span", 6, {
        class: "week block flex-1 leading-9 border-0 rounded-lg cursor-default text-center text-gray-900 font-semibold text-sm"
    }), "</div>\n</div>")),
    of = function() {
        return $h((function e(t, n) {
            Wh(this, e), Object.assign(this, n, {
                picker: t,
                element: Up('<div class="datepicker-view flex"></div>').firstChild,
                selected: []
            }), this.init(this.picker.datepicker.config)
        }), [{
            key: "init",
            value: function(e) {
                void 0 !== e.pickLevel && (this.isMinView = this.id === e.pickLevel), this.setOptions(e), this.updateFocus(), this.updateSelection()
            }
        }, {
            key: "performBeforeHook",
            value: function(e, t, n) {
                var i = this.beforeShow(new Date(n));
                switch (np(i)) {
                    case "boolean":
                        i = {
                            enabled: i
                        };
                        break;
                    case "string":
                        i = {
                            classes: i
                        }
                }
                if (i) {
                    if (!1 === i.enabled && (e.classList.add("disabled"), sp(this.disabled, t)), i.classes) {
                        var r, o = i.classes.split(/\s+/);
                        (r = e.classList).add.apply(r, ep(o)), o.includes("disabled") && sp(this.disabled, t)
                    }
                    i.content && function(e, t) {
                        Kp(e), t instanceof DocumentFragment ? e.appendChild(t) : "string" == typeof t ? e.appendChild(Up(t)) : "function" == typeof t.forEach && t.forEach((function(t) {
                            e.appendChild(t)
                        }))
                    }(e, i.content)
                }
            }
        }])
    }(),
    sf = function() {
        function e(t) {
            return Wh(this, e), qh(this, e, [t, {
                id: 0,
                name: "days",
                cellClass: "day"
            }])
        }
        return Gh(e, of), $h(e, [{
            key: "init",
            value: function(t) {
                if (!(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]) {
                    var n = Up(nf).firstChild;
                    this.dow = n.firstChild, this.grid = n.lastChild, this.element.appendChild(n)
                }
                Yh(Jh(e.prototype), "init", this).call(this, t)
            }
        }, {
            key: "setOptions",
            value: function(e) {
                var t, n = this;
                if (rp(e, "minDate") && (this.minDate = e.minDate), rp(e, "maxDate") && (this.maxDate = e.maxDate), e.datesDisabled && (this.datesDisabled = e.datesDisabled), e.daysOfWeekDisabled && (this.daysOfWeekDisabled = e.daysOfWeekDisabled, t = !0), e.daysOfWeekHighlighted && (this.daysOfWeekHighlighted = e.daysOfWeekHighlighted), void 0 !== e.todayHighlight && (this.todayHighlight = e.todayHighlight), void 0 !== e.weekStart && (this.weekStart = e.weekStart, this.weekEnd = e.weekEnd, t = !0), e.locale) {
                    var i = this.locale = e.locale;
                    this.dayNames = i.daysMin, this.switchLabelFormat = i.titleFormat, t = !0
                }
                if (void 0 !== e.beforeShowDay && (this.beforeShow = "function" == typeof e.beforeShowDay ? e.beforeShowDay : void 0), void 0 !== e.calendarWeeks)
                    if (e.calendarWeeks && !this.calendarWeeks) {
                        var r = Up(rf).firstChild;
                        this.calendarWeeks = {
                            element: r,
                            dow: r.firstChild,
                            weeks: r.lastChild
                        }, this.element.insertBefore(r, this.element.firstChild)
                    } else this.calendarWeeks && !e.calendarWeeks && (this.element.removeChild(this.calendarWeeks.element), this.calendarWeeks = null);
                void 0 !== e.showDaysOfWeek && (e.showDaysOfWeek ? (Wp(this.dow), this.calendarWeeks && Wp(this.calendarWeeks.dow)) : (qp(this.dow), this.calendarWeeks && qp(this.calendarWeeks.dow))), t && Array.from(this.dow.children).forEach((function(e, t) {
                    var i = (n.weekStart + t) % 7;
                    e.textContent = n.dayNames[i], e.className = n.daysOfWeekDisabled.includes(i) ? "dow disabled text-center h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed" : "dow text-center h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400"
                }))
            }
        }, {
            key: "updateFocus",
            value: function() {
                var e = new Date(this.picker.viewDate),
                    t = e.getFullYear(),
                    n = e.getMonth(),
                    i = fp(t, n, 1),
                    r = bp(i, this.weekStart, this.weekStart);
                this.first = i, this.last = fp(t, n + 1, 0), this.start = r, this.focused = this.picker.viewDate
            }
        }, {
            key: "updateSelection",
            value: function() {
                var e = this.picker.datepicker,
                    t = e.dates,
                    n = e.rangepicker;
                this.selected = t, n && (this.range = n.dates)
            }
        }, {
            key: "render",
            value: function() {
                var e = this;
                this.today = this.todayHighlight ? pp() : void 0, this.disabled = ep(this.datesDisabled);
                var t = Dp(this.focused, this.switchLabelFormat, this.locale);
                if (this.picker.setViewSwitchLabel(t), this.picker.setPrevBtnDisabled(this.first <= this.minDate), this.picker.setNextBtnDisabled(this.last >= this.maxDate), this.calendarWeeks) {
                    var n = bp(this.first, 1, 1);
                    Array.from(this.calendarWeeks.weeks.children).forEach((function(e, t) {
                        e.textContent = function(e) {
                            var t = bp(e, 4, 1),
                                n = bp(new Date(t).setMonth(0, 4), 4, 1);
                            return Math.round((t - n) / 6048e5) + 1
                        }(gp(n, 7 * t))
                    }))
                }
                Array.from(this.grid.children).forEach((function(t, n) {
                    var i = t.classList,
                        r = gp(e.start, n),
                        o = new Date(r),
                        s = o.getDay();
                    if (t.className = "datepicker-cell hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm ".concat(e.cellClass), t.dataset.date = r, t.textContent = o.getDate(), r < e.first ? i.add("prev", "text-gray-500", "dark:text-white") : r > e.last && i.add("next", "text-gray-500", "dark:text-white"), e.today === r && i.add("today", "bg-gray-100", "dark:bg-gray-600"), (r < e.minDate || r > e.maxDate || e.disabled.includes(r)) && (i.add("disabled", "cursor-not-allowed", "text-gray-400", "dark:text-gray-500"), i.remove("hover:bg-gray-100", "dark:hover:bg-gray-600", "text-gray-900", "dark:text-white", "cursor-pointer")), e.daysOfWeekDisabled.includes(s) && (i.add("disabled", "cursor-not-allowed", "text-gray-400", "dark:text-gray-500"), i.remove("hover:bg-gray-100", "dark:hover:bg-gray-600", "text-gray-900", "dark:text-white", "cursor-pointer"), sp(e.disabled, r)), e.daysOfWeekHighlighted.includes(s) && i.add("highlighted"), e.range) {
                        var a = Qh(e.range, 2),
                            l = a[0],
                            c = a[1];
                        r > l && r < c && (i.add("range", "bg-gray-200", "dark:bg-gray-600"), i.remove("rounded-lg", "rounded-l-lg", "rounded-r-lg")), r === l && (i.add("range-start", "bg-gray-100", "dark:bg-gray-600", "rounded-l-lg"), i.remove("rounded-lg", "rounded-r-lg")), r === c && (i.add("range-end", "bg-gray-100", "dark:bg-gray-600", "rounded-r-lg"), i.remove("rounded-lg", "rounded-l-lg"))
                    }
                    e.selected.includes(r) && (i.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white"), i.remove("text-gray-900", "text-gray-500", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600", "dark:bg-gray-600", "bg-gray-100", "bg-gray-200")), r === e.focused && i.add("focused"), e.beforeShow && e.performBeforeHook(t, r, r)
                }))
            }
        }, {
            key: "refresh",
            value: function() {
                var e = this,
                    t = Qh(this.range || [], 2),
                    n = t[0],
                    i = t[1];
                this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((function(e) {
                    e.classList.remove("range", "range-start", "range-end", "selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white", "focused"), e.classList.add("text-gray-900", "rounded-lg", "dark:text-white")
                })), Array.from(this.grid.children).forEach((function(t) {
                    var r = Number(t.dataset.date),
                        o = t.classList;
                    o.remove("bg-gray-200", "dark:bg-gray-600", "rounded-l-lg", "rounded-r-lg"), r > n && r < i && (o.add("range", "bg-gray-200", "dark:bg-gray-600"), o.remove("rounded-lg")), r === n && (o.add("range-start", "bg-gray-200", "dark:bg-gray-600", "rounded-l-lg"), o.remove("rounded-lg")), r === i && (o.add("range-end", "bg-gray-200", "dark:bg-gray-600", "rounded-r-lg"), o.remove("rounded-lg")), e.selected.includes(r) && (o.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white"), o.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600", "bg-gray-100", "bg-gray-200", "dark:bg-gray-600")), r === e.focused && o.add("focused")
                }))
            }
        }, {
            key: "refreshFocus",
            value: function() {
                var e = Math.round((this.focused - this.start) / 864e5);
                this.grid.querySelectorAll(".focused").forEach((function(e) {
                    e.classList.remove("focused")
                })), this.grid.children[e].classList.add("focused")
            }
        }])
    }();

function af(e, t) {
    if (e && e[0] && e[1]) {
        var n = Qh(e, 2),
            i = Qh(n[0], 2),
            r = i[0],
            o = i[1],
            s = Qh(n[1], 2),
            a = s[0],
            l = s[1];
        if (!(r > t || a < t)) return [r === t ? o : -1, a === t ? l : 12]
    }
}
var lf = function() {
    function e(t) {
        return Wh(this, e), qh(this, e, [t, {
            id: 1,
            name: "months",
            cellClass: "month"
        }])
    }
    return Gh(e, of), $h(e, [{
        key: "init",
        value: function(t) {
            (!(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]) && (this.grid = this.element, this.element.classList.add("months", "datepicker-grid", "w-64", "grid", "grid-cols-4"), this.grid.appendChild(Up(dp("span", 12, {
                "data-month": function(e) {
                    return e
                }
            })))), Yh(Jh(e.prototype), "init", this).call(this, t)
        }
    }, {
        key: "setOptions",
        value: function(e) {
            if (e.locale && (this.monthNames = e.locale.monthsShort), rp(e, "minDate"))
                if (void 0 === e.minDate) this.minYear = this.minMonth = this.minDate = void 0;
                else {
                    var t = new Date(e.minDate);
                    this.minYear = t.getFullYear(), this.minMonth = t.getMonth(), this.minDate = t.setDate(1)
                } if (rp(e, "maxDate"))
                if (void 0 === e.maxDate) this.maxYear = this.maxMonth = this.maxDate = void 0;
                else {
                    var n = new Date(e.maxDate);
                    this.maxYear = n.getFullYear(), this.maxMonth = n.getMonth(), this.maxDate = fp(this.maxYear, this.maxMonth + 1, 0)
                } void 0 !== e.beforeShowMonth && (this.beforeShow = "function" == typeof e.beforeShowMonth ? e.beforeShowMonth : void 0)
        }
    }, {
        key: "updateFocus",
        value: function() {
            var e = new Date(this.picker.viewDate);
            this.year = e.getFullYear(), this.focused = e.getMonth()
        }
    }, {
        key: "updateSelection",
        value: function() {
            var e = this.picker.datepicker,
                t = e.dates,
                n = e.rangepicker;
            this.selected = t.reduce((function(e, t) {
                var n = new Date(t),
                    i = n.getFullYear(),
                    r = n.getMonth();
                return void 0 === e[i] ? e[i] = [r] : sp(e[i], r), e
            }), {}), n && n.dates && (this.range = n.dates.map((function(e) {
                var t = new Date(e);
                return isNaN(t) ? void 0 : [t.getFullYear(), t.getMonth()]
            })))
        }
    }, {
        key: "render",
        value: function() {
            var e = this;
            this.disabled = [], this.picker.setViewSwitchLabel(this.year), this.picker.setPrevBtnDisabled(this.year <= this.minYear), this.picker.setNextBtnDisabled(this.year >= this.maxYear);
            var t = this.selected[this.year] || [],
                n = this.year < this.minYear || this.year > this.maxYear,
                i = this.year === this.minYear,
                r = this.year === this.maxYear,
                o = af(this.range, this.year);
            Array.from(this.grid.children).forEach((function(s, a) {
                var l = s.classList,
                    c = fp(e.year, a, 1);
                if (s.className = "datepicker-cell hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm ".concat(e.cellClass), e.isMinView && (s.dataset.date = c), s.textContent = e.monthNames[a], (n || i && a < e.minMonth || r && a > e.maxMonth) && l.add("disabled"), o) {
                    var d = Qh(o, 2),
                        u = d[0],
                        h = d[1];
                    a > u && a < h && l.add("range"), a === u && l.add("range-start"), a === h && l.add("range-end")
                }
                t.includes(a) && (l.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white"), l.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600")), a === e.focused && l.add("focused"), e.beforeShow && e.performBeforeHook(s, a, c)
            }))
        }
    }, {
        key: "refresh",
        value: function() {
            var e = this,
                t = this.selected[this.year] || [],
                n = Qh(af(this.range, this.year) || [], 2),
                i = n[0],
                r = n[1];
            this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((function(e) {
                e.classList.remove("range", "range-start", "range-end", "selected", "bg-blue-700", "!bg-primary-700", "dark:bg-blue-600", "dark:!bg-primary-700", "dark:text-white", "text-white", "focused"), e.classList.add("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600")
            })), Array.from(this.grid.children).forEach((function(n, o) {
                var s = n.classList;
                o > i && o < r && s.add("range"), o === i && s.add("range-start"), o === r && s.add("range-end"), t.includes(o) && (s.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white"), s.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600")), o === e.focused && s.add("focused")
            }))
        }
    }, {
        key: "refreshFocus",
        value: function() {
            this.grid.querySelectorAll(".focused").forEach((function(e) {
                e.classList.remove("focused")
            })), this.grid.children[this.focused].classList.add("focused")
        }
    }])
}();
var cf = function() {
    function e(t, n) {
        return Wh(this, e), qh(this, e, [t, n])
    }
    return Gh(e, of), $h(e, [{
        key: "init",
        value: function(t) {
            (!(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]) && (this.navStep = 10 * this.step, this.beforeShowOption = "beforeShow".concat(ep(this.cellClass).reduce((function(e, t, n) {
                return e + (n ? t : t.toUpperCase())
            }), "")), this.grid = this.element, this.element.classList.add(this.name, "datepicker-grid", "w-64", "grid", "grid-cols-4"), this.grid.appendChild(Up(dp("span", 12)))), Yh(Jh(e.prototype), "init", this).call(this, t)
        }
    }, {
        key: "setOptions",
        value: function(e) {
            if (rp(e, "minDate") && (void 0 === e.minDate ? this.minYear = this.minDate = void 0 : (this.minYear = wp(e.minDate, this.step), this.minDate = fp(this.minYear, 0, 1))), rp(e, "maxDate") && (void 0 === e.maxDate ? this.maxYear = this.maxDate = void 0 : (this.maxYear = wp(e.maxDate, this.step), this.maxDate = fp(this.maxYear, 11, 31))), void 0 !== e[this.beforeShowOption]) {
                var t = e[this.beforeShowOption];
                this.beforeShow = "function" == typeof t ? t : void 0
            }
        }
    }, {
        key: "updateFocus",
        value: function() {
            var e = new Date(this.picker.viewDate),
                t = wp(e, this.navStep),
                n = t + 9 * this.step;
            this.first = t, this.last = n, this.start = t - this.step, this.focused = wp(e, this.step)
        }
    }, {
        key: "updateSelection",
        value: function() {
            var e = this,
                t = this.picker.datepicker,
                n = t.dates,
                i = t.rangepicker;
            this.selected = n.reduce((function(t, n) {
                return sp(t, wp(n, e.step))
            }), []), i && i.dates && (this.range = i.dates.map((function(t) {
                if (void 0 !== t) return wp(t, e.step)
            })))
        }
    }, {
        key: "render",
        value: function() {
            var e = this;
            this.disabled = [], this.picker.setViewSwitchLabel("".concat(this.first, "-").concat(this.last)), this.picker.setPrevBtnDisabled(this.first <= this.minYear), this.picker.setNextBtnDisabled(this.last >= this.maxYear), Array.from(this.grid.children).forEach((function(t, n) {
                var i = t.classList,
                    r = e.start + n * e.step,
                    o = fp(r, 0, 1);
                if (t.className = "datepicker-cell hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm ".concat(e.cellClass), e.isMinView && (t.dataset.date = o), t.textContent = t.dataset.year = r, 0 === n ? i.add("prev") : 11 === n && i.add("next"), (r < e.minYear || r > e.maxYear) && i.add("disabled"), e.range) {
                    var s = Qh(e.range, 2),
                        a = s[0],
                        l = s[1];
                    r > a && r < l && i.add("range"), r === a && i.add("range-start"), r === l && i.add("range-end")
                }
                e.selected.includes(r) && (i.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white"), i.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600")), r === e.focused && i.add("focused"), e.beforeShow && e.performBeforeHook(t, r, o)
            }))
        }
    }, {
        key: "refresh",
        value: function() {
            var e = this,
                t = Qh(this.range || [], 2),
                n = t[0],
                i = t[1];
            this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((function(e) {
                e.classList.remove("range", "range-start", "range-end", "selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark!bg-primary-600", "dark:text-white", "focused")
            })), Array.from(this.grid.children).forEach((function(t) {
                var r = Number(t.textContent),
                    o = t.classList;
                r > n && r < i && o.add("range"), r === n && o.add("range-start"), r === i && o.add("range-end"), e.selected.includes(r) && (o.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white"), o.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600")), r === e.focused && o.add("focused")
            }))
        }
    }, {
        key: "refreshFocus",
        value: function() {
            var e = Math.round((this.focused - this.start) / this.step);
            this.grid.querySelectorAll(".focused").forEach((function(e) {
                e.classList.remove("focused")
            })), this.grid.children[e].classList.add("focused")
        }
    }])
}();

function df(e, t) {
    var n = {
        date: e.getDate(),
        viewDate: new Date(e.picker.viewDate),
        viewId: e.picker.currentView.id,
        datepicker: e
    };
    e.element.dispatchEvent(new CustomEvent(t, {
        detail: n
    }))
}

function uf(e, t) {
    var n, i = e.config,
        r = i.minDate,
        o = i.maxDate,
        s = e.picker,
        a = s.currentView,
        l = s.viewDate;
    switch (a.id) {
        case 0:
            n = mp(l, t);
            break;
        case 1:
            n = vp(l, t);
            break;
        default:
            n = vp(l, t * a.navStep)
    }
    n = cp(n, r, o), e.picker.changeFocus(n).render()
}

function hf(e) {
    var t = e.picker.currentView.id;
    t !== e.config.maxView && e.picker.changeView(t + 1).render()
}

function pf(e) {
    e.config.updateOnBlur ? e.update({
        autohide: !0
    }) : (e.refresh("input"), e.hide())
}

function ff(e, t) {
    var n = e.picker,
        i = new Date(n.viewDate),
        r = n.currentView.id,
        o = 1 === r ? mp(i, t - i.getMonth()) : vp(i, t - i.getFullYear());
    n.changeFocus(o).changeView(r - 1).render()
}

function gf(e) {
    var t = e.picker,
        n = pp();
    if (1 === e.config.todayBtnMode) {
        if (e.config.autohide) return void e.setDate(n);
        e.setDate(n, {
            render: !1
        }), t.update()
    }
    t.viewDate !== n && t.changeFocus(n), t.changeView(0).render()
}

function mf(e) {
    e.setDate({
        clear: !0
    })
}

function vf(e) {
    hf(e)
}

function yf(e) {
    uf(e, -1)
}

function bf(e) {
    uf(e, 1)
}

function wf(e, t) {
    var n = Hp(t, ".datepicker-cell");
    if (n && !n.classList.contains("disabled")) {
        var i = e.picker.currentView,
            r = i.id;
        i.isMinView ? e.setDate(Number(n.dataset.date)) : ff(e, Number(1 === r ? n.dataset.month : n.dataset.year))
    }
}

function _f(e) {
    e.inline || e.config.disableTouchKeyboard || e.inputField.focus()
}

function xf(e, t) {
    if (void 0 !== t.title && (t.title ? (e.controls.title.textContent = t.title, Wp(e.controls.title)) : (e.controls.title.textContent = "", qp(e.controls.title))), t.prevArrow) {
        var n = e.controls.prevBtn;
        Kp(n), t.prevArrow.forEach((function(e) {
            n.appendChild(e.cloneNode(!0))
        }))
    }
    if (t.nextArrow) {
        var i = e.controls.nextBtn;
        Kp(i), t.nextArrow.forEach((function(e) {
            i.appendChild(e.cloneNode(!0))
        }))
    }
    if (t.locale && (e.controls.todayBtn.textContent = t.locale.today, e.controls.clearBtn.textContent = t.locale.clear), void 0 !== t.todayBtn && (t.todayBtn ? Wp(e.controls.todayBtn) : qp(e.controls.todayBtn)), rp(t, "minDate") || rp(t, "maxDate")) {
        var r = e.datepicker.config,
            o = r.minDate,
            s = r.maxDate;
        e.controls.todayBtn.disabled = !lp(pp(), o, s)
    }
    void 0 !== t.clearBtn && (t.clearBtn ? Wp(e.controls.clearBtn) : qp(e.controls.clearBtn))
}

function kf(e) {
    var t = e.dates,
        n = e.config;
    return cp(t.length > 0 ? op(t) : n.defaultViewDate, n.minDate, n.maxDate)
}

function Ef(e, t) {
    var n = new Date(e.viewDate),
        i = new Date(t),
        r = e.currentView,
        o = r.id,
        s = r.year,
        a = r.first,
        l = r.last,
        c = i.getFullYear();
    switch (e.viewDate = t, c !== n.getFullYear() && df(e.datepicker, "changeYear"), i.getMonth() !== n.getMonth() && df(e.datepicker, "changeMonth"), o) {
        case 0:
            return t < a || t > l;
        case 1:
            return c !== s;
        default:
            return c < a || c > l
    }
}

function Cf(e) {
    return window.getComputedStyle(e).direction
}
var Sf = function() {
    return $h((function e(t) {
        Wh(this, e), this.datepicker = t;
        var n = tf.replace(/%buttonClass%/g, t.config.buttonClass),
            i = this.element = Up(n).firstChild,
            r = Qh(i.firstChild.children, 3),
            o = r[0],
            s = r[1],
            a = r[2],
            l = o.firstElementChild,
            c = Qh(o.lastElementChild.children, 3),
            d = c[0],
            u = c[1],
            h = c[2],
            p = Qh(a.firstChild.children, 2),
            f = {
                title: l,
                prevBtn: d,
                viewSwitch: u,
                nextBtn: h,
                todayBtn: p[0],
                clearBtn: p[1]
            };
        this.main = s, this.controls = f;
        var g = t.inline ? "inline" : "dropdown";
        i.classList.add("datepicker-".concat(g)), "dropdown" === g && i.classList.add("dropdown", "absolute", "top-0", "left-0", "z-50", "pt-2"), xf(this, t.config), this.viewDate = kf(t), Pp(t, [
            [i, "click", _f.bind(null, t), {
                capture: !0
            }],
            [s, "click", wf.bind(null, t)],
            [f.viewSwitch, "click", vf.bind(null, t)],
            [f.prevBtn, "click", yf.bind(null, t)],
            [f.nextBtn, "click", bf.bind(null, t)],
            [f.todayBtn, "click", gf.bind(null, t)],
            [f.clearBtn, "click", mf.bind(null, t)]
        ]), this.views = [new sf(this), new lf(this), new cf(this, {
            id: 2,
            name: "years",
            cellClass: "year",
            step: 1
        }), new cf(this, {
            id: 3,
            name: "decades",
            cellClass: "decade",
            step: 10
        })], this.currentView = this.views[t.config.startView], this.currentView.render(), this.main.appendChild(this.currentView.element), t.config.container.appendChild(this.element)
    }), [{
        key: "setOptions",
        value: function(e) {
            xf(this, e), this.views.forEach((function(t) {
                t.init(e, !1)
            })), this.currentView.render()
        }
    }, {
        key: "detach",
        value: function() {
            this.datepicker.config.container.removeChild(this.element)
        }
    }, {
        key: "show",
        value: function() {
            if (!this.active) {
                this.element.classList.add("active", "block"), this.element.classList.remove("hidden"), this.active = !0;
                var e = this.datepicker;
                if (!e.inline) {
                    var t = Cf(e.inputField);
                    t !== Cf(e.config.container) ? this.element.dir = t : this.element.dir && this.element.removeAttribute("dir"), this.place(), e.config.disableTouchKeyboard && e.inputField.blur()
                }
                df(e, "show")
            }
        }
    }, {
        key: "hide",
        value: function() {
            this.active && (this.datepicker.exitEditMode(), this.element.classList.remove("active", "block"), this.element.classList.add("active", "block", "hidden"), this.active = !1, df(this.datepicker, "hide"))
        }
    }, {
        key: "place",
        value: function() {
            var e, t, n, i = this.element,
                r = i.classList,
                o = i.style,
                s = this.datepicker,
                a = s.config,
                l = s.inputField,
                c = a.container,
                d = this.element.getBoundingClientRect(),
                u = d.width,
                h = d.height,
                p = c.getBoundingClientRect(),
                f = p.left,
                g = p.top,
                m = p.width,
                v = l.getBoundingClientRect(),
                y = v.left,
                b = v.top,
                w = v.width,
                _ = v.height,
                x = a.orientation,
                k = x.x,
                E = x.y;
            c === document.body ? (e = window.scrollY, t = y + window.scrollX, n = b + e) : (t = y - f, n = b - g + (e = c.scrollTop)), "auto" === k && (t < 0 ? (k = "left", t = 10) : k = t + u > m || "rtl" === Cf(l) ? "right" : "left"), "right" === k && (t -= u - w), "auto" === E && (E = n - h < e ? "bottom" : "top"), "top" === E ? n -= h : n += _, r.remove("datepicker-orient-top", "datepicker-orient-bottom", "datepicker-orient-right", "datepicker-orient-left"), r.add("datepicker-orient-".concat(E), "datepicker-orient-".concat(k)), o.top = n ? "".concat(n, "px") : n, o.left = t ? "".concat(t, "px") : t
        }
    }, {
        key: "setViewSwitchLabel",
        value: function(e) {
            this.controls.viewSwitch.textContent = e
        }
    }, {
        key: "setPrevBtnDisabled",
        value: function(e) {
            this.controls.prevBtn.disabled = e
        }
    }, {
        key: "setNextBtnDisabled",
        value: function(e) {
            this.controls.nextBtn.disabled = e
        }
    }, {
        key: "changeView",
        value: function(e) {
            var t = this.currentView,
                n = this.views[e];
            return n.id !== t.id && (this.currentView = n, this._renderMethod = "render", df(this.datepicker, "changeView"), this.main.replaceChild(n.element, t.element)), this
        }
    }, {
        key: "changeFocus",
        value: function(e) {
            return this._renderMethod = Ef(this, e) ? "render" : "refreshFocus", this.views.forEach((function(e) {
                e.updateFocus()
            })), this
        }
    }, {
        key: "update",
        value: function() {
            var e = kf(this.datepicker);
            return this._renderMethod = Ef(this, e) ? "render" : "refresh", this.views.forEach((function(e) {
                e.updateFocus(), e.updateSelection()
            })), this
        }
    }, {
        key: "render",
        value: function() {
            var e = (!(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]) && this._renderMethod || "render";
            delete this._renderMethod, this.currentView[e]()
        }
    }])
}();

function Of(e, t, n, i, r, o) {
    if (lp(e, r, o)) return i(e) ? Of(t(e, n), t, n, i, r, o) : e
}

function Lf(e, t, n, i) {
    var r, o, s = e.picker,
        a = s.currentView,
        l = a.step || 1,
        c = s.viewDate;
    switch (a.id) {
        case 0:
            c = i ? gp(c, 7 * n) : t.ctrlKey || t.metaKey ? vp(c, n) : gp(c, n), r = gp, o = function(e) {
                return a.disabled.includes(e)
            };
            break;
        case 1:
            c = mp(c, i ? 4 * n : n), r = mp, o = function(e) {
                var t = new Date(e),
                    n = a.year,
                    i = a.disabled;
                return t.getFullYear() === n && i.includes(t.getMonth())
            };
            break;
        default:
            c = vp(c, n * (i ? 4 : 1) * l), r = vp, o = function(e) {
                return a.disabled.includes(wp(e, l))
            }
    }
    void 0 !== (c = Of(c, r, n < 0 ? -l : l, o, a.minDate, a.maxDate)) && s.changeFocus(c).render()
}

function Af(e, t) {
    if ("Tab" !== t.key) {
        var n = e.picker,
            i = n.currentView,
            r = i.id,
            o = i.isMinView;
        if (n.active)
            if (e.editMode) switch (t.key) {
                case "Escape":
                    n.hide();
                    break;
                case "Enter":
                    e.exitEditMode({
                        update: !0,
                        autohide: e.config.autohide
                    });
                    break;
                default:
                    return
            } else switch (t.key) {
                case "Escape":
                    n.hide();
                    break;
                case "ArrowLeft":
                    if (t.ctrlKey || t.metaKey) uf(e, -1);
                    else {
                        if (t.shiftKey) return void e.enterEditMode();
                        Lf(e, t, -1, !1)
                    }
                    break;
                case "ArrowRight":
                    if (t.ctrlKey || t.metaKey) uf(e, 1);
                    else {
                        if (t.shiftKey) return void e.enterEditMode();
                        Lf(e, t, 1, !1)
                    }
                    break;
                case "ArrowUp":
                    if (t.ctrlKey || t.metaKey) hf(e);
                    else {
                        if (t.shiftKey) return void e.enterEditMode();
                        Lf(e, t, -1, !0)
                    }
                    break;
                case "ArrowDown":
                    if (t.shiftKey && !t.ctrlKey && !t.metaKey) return void e.enterEditMode();
                    Lf(e, t, 1, !0);
                    break;
                case "Enter":
                    o ? e.setDate(n.viewDate) : n.changeView(r - 1).render();
                    break;
                case "Backspace":
                case "Delete":
                    return void e.enterEditMode();
                default:
                    return void(1 !== t.key.length || t.ctrlKey || t.metaKey || e.enterEditMode())
            } else switch (t.key) {
                case "ArrowDown":
                case "Escape":
                    n.show();
                    break;
                case "Enter":
                    e.update();
                    break;
                default:
                    return
            }
        t.preventDefault(), t.stopPropagation()
    } else pf(e)
}

function Df(e) {
    e.config.showOnFocus && !e._showing && e.show()
}

function Tf(e, t) {
    var n = t.target;
    (e.picker.active || e.config.showOnClick) && (n._active = n === document.activeElement, n._clicking = setTimeout((function() {
        delete n._active, delete n._clicking
    }), 2e3))
}

function If(e, t) {
    var n = t.target;
    n._clicking && (clearTimeout(n._clicking), delete n._clicking, n._active && e.enterEditMode(), delete n._active, e.config.showOnClick && e.show())
}

function Mf(e, t) {
    t.clipboardData.types.includes("text/plain") && e.enterEditMode()
}

function jf(e, t) {
    var n = e.element;
    if (n === document.activeElement) {
        var i = e.picker.element;
        Hp(t, (function(e) {
            return e === n || e === i
        })) || pf(e)
    }
}

function Pf(e, t) {
    return e.map((function(e) {
        return Dp(e, t.format, t.locale)
    })).join(t.dateDelimiter)
}

function Rf(e, t) {
    var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        i = e.config,
        r = e.dates,
        o = e.rangepicker;
    if (0 === t.length) return n ? [] : void 0;
    var s = o && e === o.datepickers[1],
        a = t.reduce((function(e, t) {
            var n = Ap(t, i.format, i.locale);
            if (void 0 === n) return e;
            if (i.pickLevel > 0) {
                var r = new Date(n);
                n = 1 === i.pickLevel ? s ? r.setMonth(r.getMonth() + 1, 0) : r.setDate(1) : s ? r.setFullYear(r.getFullYear() + 1, 0, 0) : r.setMonth(0, 1)
            }
            return !lp(n, i.minDate, i.maxDate) || e.includes(n) || i.datesDisabled.includes(n) || i.daysOfWeekDisabled.includes(new Date(n).getDay()) || e.push(n), e
        }), []);
    return 0 !== a.length ? (i.multidate && !n && (a = a.reduce((function(e, t) {
        return r.includes(t) || e.push(t), e
    }), r.filter((function(e) {
        return !a.includes(e)
    })))), i.maxNumberOfDates && a.length > i.maxNumberOfDates ? a.slice(-1 * i.maxNumberOfDates) : a) : void 0
}

function Ff(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3,
        n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
        i = e.config,
        r = e.picker,
        o = e.inputField;
    if (2 & t) {
        var s = r.active ? i.pickLevel : i.startView;
        r.update().changeView(s).render(n)
    }
    1 & t && o && (o.value = Pf(e.dates, i))
}

function Bf(e, t, n) {
    var i = n.clear,
        r = n.render,
        o = n.autohide;
    void 0 === r && (r = !0), r ? void 0 === o && (o = e.config.autohide) : o = !1;
    var s = Rf(e, t, i);
    s && (s.toString() !== e.dates.toString() ? (e.dates = s, Ff(e, r ? 3 : 1), df(e, "changeDate")) : Ff(e, 1), o && e.hide())
}
var Hf = function() {
    return $h((function e(t) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
        Wh(this, e), t.datepicker = this, this.element = t;
        var r = this.config = Object.assign({
            buttonClass: n.buttonClass && String(n.buttonClass) || "button",
            container: document.body,
            defaultViewDate: pp(),
            maxDate: void 0,
            minDate: void 0
        }, ef(zp, this));
        this._options = n, Object.assign(r, ef(n, this));
        var o, s, a = this.inline = "INPUT" !== t.tagName;
        if (a) r.container = t, s = ap(t.dataset.date, r.dateDelimiter), delete t.dataset.date;
        else {
            var l = n.container ? document.querySelector(n.container) : null;
            l && (r.container = l), (o = this.inputField = t).classList.add("datepicker-input"), s = ap(o.value, r.dateDelimiter)
        }
        if (i) {
            var c = i.inputs.indexOf(o),
                d = i.datepickers;
            if (c < 0 || c > 1 || !Array.isArray(d)) throw Error("Invalid rangepicker object.");
            d[c] = this, Object.defineProperty(this, "rangepicker", {
                get: function() {
                    return i
                }
            })
        }
        this.dates = [];
        var u = Rf(this, s);
        u && u.length > 0 && (this.dates = u), o && (o.value = Pf(this.dates, r));
        var h = this.picker = new Sf(this);
        if (a) this.show();
        else {
            var p = jf.bind(null, this);
            Pp(this, [
                [o, "keydown", Af.bind(null, this)],
                [o, "focus", Df.bind(null, this)],
                [o, "mousedown", Tf.bind(null, this)],
                [o, "click", If.bind(null, this)],
                [o, "paste", Mf.bind(null, this)],
                [document, "mousedown", p],
                [document, "touchstart", p],
                [window, "resize", h.place.bind(h)]
            ])
        }
    }), [{
        key: "active",
        get: function() {
            return !(!this.picker || !this.picker.active)
        }
    }, {
        key: "pickerElement",
        get: function() {
            return this.picker ? this.picker.element : void 0
        }
    }, {
        key: "setOptions",
        value: function(e) {
            var t = this.picker,
                n = ef(e, this);
            Object.assign(this._options, e), Object.assign(this.config, n), t.setOptions(n), Ff(this, 3)
        }
    }, {
        key: "show",
        value: function() {
            if (this.inputField) {
                if (this.inputField.disabled) return;
                this.inputField !== document.activeElement && (this._showing = !0, this.inputField.focus(), delete this._showing)
            }
            this.picker.show()
        }
    }, {
        key: "hide",
        value: function() {
            this.inline || (this.picker.hide(), this.picker.update().changeView(this.config.startView).render())
        }
    }, {
        key: "destroy",
        value: function() {
            return this.hide(), Rp(this), this.picker.detach(), this.inline || this.inputField.classList.remove("datepicker-input"), delete this.element.datepicker, this
        }
    }, {
        key: "getDate",
        value: function() {
            var e = this,
                t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0,
                n = t ? function(n) {
                    return Dp(n, t, e.config.locale)
                } : function(e) {
                    return new Date(e)
                };
            return this.config.multidate ? this.dates.map(n) : this.dates.length > 0 ? n(this.dates[0]) : void 0
        }
    }, {
        key: "setDate",
        value: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            var i = [].concat(t),
                r = {},
                o = op(t);
            "object" !== np(o) || Array.isArray(o) || o instanceof Date || !o || Object.assign(r, i.pop()), Bf(this, Array.isArray(i[0]) ? i[0] : i, r)
        }
    }, {
        key: "update",
        value: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;
            if (!this.inline) {
                var t = {
                    clear: !0,
                    autohide: !(!e || !e.autohide)
                };
                Bf(this, ap(this.inputField.value, this.config.dateDelimiter), t)
            }
        }
    }, {
        key: "refresh",
        value: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0,
                t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            e && "string" != typeof e && (t = e, e = void 0), Ff(this, "picker" === e ? 2 : "input" === e ? 1 : 3, !t)
        }
    }, {
        key: "enterEditMode",
        value: function() {
            this.inline || !this.picker.active || this.editMode || (this.editMode = !0, this.inputField.classList.add("in-edit", "border-blue-700", "!border-primary-700"))
        }
    }, {
        key: "exitEditMode",
        value: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;
            if (!this.inline && this.editMode) {
                var t = Object.assign({
                    update: !1
                }, e);
                delete this.editMode, this.inputField.classList.remove("in-edit", "border-blue-700", "!border-primary-700"), t.update && this.update(t)
            }
        }
    }], [{
        key: "formatDate",
        value: function(e, t, n) {
            return Dp(e, t, n && Np[n] || Np.en)
        }
    }, {
        key: "parseDate",
        value: function(e, t, n) {
            return Ap(e, t, n && Np[n] || Np.en)
        }
    }, {
        key: "locales",
        get: function() {
            return Np
        }
    }])
}();

function Nf(e) {
    var t = Object.assign({}, e);
    return delete t.inputs, delete t.allowOneSidedRange, delete t.maxNumberOfDates, t
}

function zf(e, t, n, i) {
    Pp(e, [
        [n, "changeDate", t]
    ]), new Hf(n, i, e)
}

function Vf(e, t) {
    if (!e._updating) {
        e._updating = !0;
        var n = t.target;
        if (void 0 !== n.datepicker) {
            var i = e.datepickers,
                r = {
                    render: !1
                },
                o = e.inputs.indexOf(n),
                s = 0 === o ? 1 : 0,
                a = i[o].dates[0],
                l = i[s].dates[0];
            void 0 !== a && void 0 !== l ? 0 === o && a > l ? (i[0].setDate(l, r), i[1].setDate(a, r)) : 1 === o && a < l && (i[0].setDate(a, r), i[1].setDate(l, r)) : e.allowOneSidedRange || void 0 === a && void 0 === l || (r.clear = !0, i[s].setDate(i[o].dates, r)), i[0].picker.update().render(), i[1].picker.update().render(), delete e._updating
        }
    }
}
var Uf = function() {
        return $h((function e(t) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            Wh(this, e);
            var i = Array.isArray(n.inputs) ? n.inputs : Array.from(t.querySelectorAll("input"));
            if (!(i.length < 2)) {
                t.rangepicker = this, this.element = t, this.inputs = i.slice(0, 2), this.allowOneSidedRange = !!n.allowOneSidedRange;
                var r = Vf.bind(null, this),
                    o = Nf(n),
                    s = [];
                Object.defineProperty(this, "datepickers", {
                    get: function() {
                        return s
                    }
                }), zf(this, r, this.inputs[0], o), zf(this, r, this.inputs[1], o), Object.freeze(s), s[0].dates.length > 0 ? Vf(this, {
                    target: this.inputs[0]
                }) : s[1].dates.length > 0 && Vf(this, {
                    target: this.inputs[1]
                })
            }
        }), [{
            key: "dates",
            get: function() {
                return 2 === this.datepickers.length ? [this.datepickers[0].dates[0], this.datepickers[1].dates[0]] : void 0
            }
        }, {
            key: "setOptions",
            value: function(e) {
                this.allowOneSidedRange = !!e.allowOneSidedRange;
                var t = Nf(e);
                this.datepickers[0].setOptions(t), this.datepickers[1].setOptions(t)
            }
        }, {
            key: "destroy",
            value: function() {
                this.datepickers[0].destroy(), this.datepickers[1].destroy(), Rp(this), delete this.element.rangepicker
            }
        }, {
            key: "getDates",
            value: function() {
                var e = this,
                    t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0,
                    n = t ? function(n) {
                        return Dp(n, t, e.datepickers[0].config.locale)
                    } : function(e) {
                        return new Date(e)
                    };
                return this.dates.map((function(e) {
                    return void 0 === e ? e : n(e)
                }))
            }
        }, {
            key: "setDates",
            value: function(e, t) {
                var n = Qh(this.datepickers, 2),
                    i = n[0],
                    r = n[1],
                    o = this.dates;
                this._updating = !0, i.setDate(e), r.setDate(t), delete this._updating, r.dates[0] !== o[1] ? Vf(this, {
                    target: this.inputs[1]
                }) : i.dates[0] !== o[0] && Vf(this, {
                    target: this.inputs[0]
                })
            }
        }])
    }(),
    qf = function() {
        return qf = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
                for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e
        }, qf.apply(this, arguments)
    },
    Wf = {
        defaultDatepickerId: null,
        autohide: !1,
        format: "mm/dd/yyyy",
        maxDate: null,
        minDate: null,
        orientation: "bottom",
        buttons: !1,
        autoSelectToday: 0,
        title: null,
        language: "en",
        rangePicker: !1,
        onShow: function() {},
        onHide: function() {}
    },
    Kf = {
        id: null,
        override: !0
    },
    $f = function() {
        function e(e, t, n) {
            void 0 === e && (e = null), void 0 === t && (t = Wf), void 0 === n && (n = Kf), this._instanceId = n.id ? n.id : e.id, this._datepickerEl = e, this._datepickerInstance = null, this._options = qf(qf({}, Wf), t), this._initialized = !1, this.init(), yd.addInstance("Datepicker", this, this._instanceId, n.override)
        }
        return e.prototype.init = function() {
            this._datepickerEl && !this._initialized && (this._options.rangePicker ? this._datepickerInstance = new Uf(this._datepickerEl, this._getDatepickerOptions(this._options)) : this._datepickerInstance = new Hf(this._datepickerEl, this._getDatepickerOptions(this._options)), this._initialized = !0)
        }, e.prototype.destroy = function() {
            this._initialized && (this._initialized = !1, this._datepickerInstance.destroy())
        }, e.prototype.removeInstance = function() {
            this.destroy(), yd.removeInstance("Datepicker", this._instanceId)
        }, e.prototype.destroyAndRemoveInstance = function() {
            this.destroy(), this.removeInstance()
        }, e.prototype.getDatepickerInstance = function() {
            return this._datepickerInstance
        }, e.prototype.getDate = function() {
            return this._options.rangePicker && this._datepickerInstance instanceof Uf ? this._datepickerInstance.getDates() : !this._options.rangePicker && this._datepickerInstance instanceof Hf ? this._datepickerInstance.getDate() : void 0
        }, e.prototype.setDate = function(e) {
            return this._options.rangePicker && this._datepickerInstance instanceof Uf ? this._datepickerInstance.setDates(e) : !this._options.rangePicker && this._datepickerInstance instanceof Hf ? this._datepickerInstance.setDate(e) : void 0
        }, e.prototype.show = function() {
            this._datepickerInstance.show(), this._options.onShow(this)
        }, e.prototype.hide = function() {
            this._datepickerInstance.hide(), this._options.onHide(this)
        }, e.prototype._getDatepickerOptions = function(e) {
            var t = {};
            return e.buttons && (t.todayBtn = !0, t.clearBtn = !0, e.autoSelectToday && (t.todayBtnMode = 1)), e.autohide && (t.autohide = !0), e.format && (t.format = e.format), e.maxDate && (t.maxDate = e.maxDate), e.minDate && (t.minDate = e.minDate), e.orientation && (t.orientation = e.orientation), e.title && (t.title = e.title), e.language && (t.language = e.language), t
        }, e.prototype.updateOnShow = function(e) {
            this._options.onShow = e
        }, e.prototype.updateOnHide = function(e) {
            this._options.onHide = e
        }, e
    }();

function Yf() {
    document.querySelectorAll("[datepicker], [inline-datepicker], [date-rangepicker]").forEach((function(e) {
        if (e) {
            var t = e.hasAttribute("datepicker-buttons"),
                n = e.hasAttribute("datepicker-autoselect-today"),
                i = e.hasAttribute("datepicker-autohide"),
                r = e.getAttribute("datepicker-format"),
                o = e.getAttribute("datepicker-max-date"),
                s = e.getAttribute("datepicker-min-date"),
                a = e.getAttribute("datepicker-orientation"),
                l = e.getAttribute("datepicker-title"),
                c = e.getAttribute("datepicker-language"),
                d = e.hasAttribute("date-rangepicker");
            new $f(e, {
                buttons: t || Wf.buttons,
                autoSelectToday: n || Wf.autoSelectToday,
                autohide: i || Wf.autohide,
                format: r || Wf.format,
                maxDate: o || Wf.maxDate,
                minDate: s || Wf.minDate,
                orientation: a || Wf.orientation,
                title: l || Wf.title,
                language: c || Wf.language,
                rangePicker: d || Wf.rangePicker
            })
        } else console.error("The datepicker element does not exist. Please check the datepicker attribute.")
    }))
}

function Jf() {
    kd(), Ld(), Md(), Bd(), eh(), oh(), dh(), gh(), _h(), Oh(), Ih(), Fh(), Vh(), Yf()
}
"undefined" != typeof window && (window.Datepicker = $f, window.initDatepickers = Yf), "undefined" != typeof window && (window.initFlowbite = Jf), new vd("load", [kd, Ld, Md, Bd, eh, oh, dh, gh, _h, Oh, Ih, Fh, Vh, Yf]).init();
const Gf = {
        class: "tailwind"
    },
    Zf = {
        class: "flex flex-col md:flex-row md:gap-4 mt-4"
    },
    Xf = {
        class: ""
    },
    Qf = {
        id: "default-sidebar",
        class: "md:w-64 rounded-lg shadow",
        "aria-label": "Sidebar"
    },
    eg = {
        class: "h-full px-3 pt-4 pb-2 overflow-y-auto bg-gray-50 dark:bg-gray-800"
    },
    tg = {
        class: "h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800"
    },
    ng = {
        class: "space-y-2 font-medium"
    },
    ig = ["onClick"],
    rg = ["innerHTML"],
    og = {
        class: "ml-3"
    },
    sg = {
        class: "w-full shadow bg-white content-column"
    },
    ag = {
        data: () => ({
            version: window.upress_namespace.version
        })
    };
((...e) => {
    const t = (Do || (Do = ki(Ao))).createApp(...e),
        {
            mount: n
        } = t;
    return t.mount = e => {
        const i = function(e) {
            if (g(e)) {
                return document.querySelector(e)
            }
            return e
        }(e);
        if (!i) return;
        const r = t._component;
        f(r) || r.render || r.template || (r.template = i.innerHTML), 1 === i.nodeType && (i.textContent = "");
        const o = n(i, !1, function(e) {
            if (e instanceof SVGElement) return "svg";
            if ("function" == typeof MathMLElement && e instanceof MathMLElement) return "mathml"
        }(i));
        return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), o
    }, t
})(Object.assign(ag, {
    __name: "App",
    setup(e) {
        const t = "flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white",
            n = [{
                name: "Dashboard",
                component: Il,
                icon: '<svg class="' + t + '" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"/></svg>'
            }, {
                name: "Settings",
                component: gc,
                icon: '<svg class="' + t + '" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48H0z" fill="none"/><path d="M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97L29 4.84c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97L9.9 10.1c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31C9.06 22.69 9 23.34 9 24s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zM24 31c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>'
            }, {
                name: "Stats",
                component: Xc,
                icon: '<svg class="' + t + '" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><title/><path d="M104,496H72a24,24,0,0,1-24-24V328a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,104,496Z"/><path d="M328,496H296a24,24,0,0,1-24-24V232a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,328,496Z"/><path d="M440,496H408a24,24,0,0,1-24-24V120a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,440,496Z"/><path d="M216,496H184a24,24,0,0,1-24-24V40a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,216,496Z"/></svg>'
            }, {
                name: "How to use",
                component: md,
                icon: '<svg class="' + t + '" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></g></svg>'
            }],
            i = wt(n),
            r = wt(n[0].name),
            o = Ir((() => {
                const e = i.value.find((e => e.name === r.value));
                return window.upress_namespace.activeItem = e, e ? e.component : null
            })),
            s = Ir((() => {
                const e = i.value.find((e => e.name === r.value));
                return e ? e.icon : null
            }));

        function a(e) {
            r.value = e
        }
        return Sn((() => {
            Jf()
        })), (e, n) => (Gi(), er("div", Gf, [sr("div", Zf, [sr("div", Xf, [sr("aside", Qf, [sr("div", eg, [sr("p", null, [n[0] || (n[0] = dr('<svg class="flex-shrink-0 w-5 h-5 inline-block mt-[-3px] hover-gradient-upress fill-raisin" viewBox="-31.872 -3.842 64.203 26.304" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="gradient_upress" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1;"></stop><stop offset="100%" style="stop-color:#3f83f8;stop-opacity:1;"></stop></linearGradient></defs><g fill="url(#gradient_upress)" stroke-miterlimit="10" stroke-width="2"><path d="m-29.704 9.172c0-2.688 0.839-4.932 2.515-6.739 1.678-1.805 3.52-3.011 5.533-3.612 0.462-0.161 0.926-0.277 1.389-0.348 0.46-0.071 0.912-0.104 1.352-0.104l24.561-0.034v2.704h-23.834c-2.797 0.277-4.925 1.251-6.382 2.914-1.457 1.664-2.199 3.469-2.222 5.412v0.102c0 0.441 0.06 0.972 0.176 1.598s0.321 1.259 0.625 1.908c0.507 1.158 1.368 2.22 2.582 3.179 1.218 0.96 2.957 1.433 5.223 1.433h2.462v2.639h-3.918c-3.215-0.093-5.696-1.18-7.441-3.265-1.748-2.082-2.62-4.668-2.62-7.75v-0.037z"></path><path d="m-6.46 17.551c0.97 0.023 1.75-0.159 2.339-0.553 0.59-0.396 0.943-1.018 1.058-1.875 0-0.74-0.243-1.422-0.728-2.045-0.486-0.626-1.214-1.184-2.186-1.67-0.186-0.091-0.378-0.181-0.573-0.271-0.198-0.096-0.397-0.193-0.607-0.283-0.022-0.022-0.054-0.039-0.088-0.05-0.033-0.012-0.065-0.028-0.087-0.051-1.711-0.835-3.277-1.728-4.7-2.688-1.42-0.958-2.132-2.269-2.132-3.937 0.023-0.07 0.035-0.127 0.035-0.175 0-0.045 5e-3 -0.079 0.016-0.104 0.012-0.023 0.018-0.046 0.018-0.069 0-1.605 0.458-2.816 1.373-3.63 0.911-0.816 1.911-1.349 2.997-1.606 0.165-0.047 0.331-0.082 0.505-0.104 0.173-0.026 0.339-0.048 0.503-0.071l7.63-0.034v2.704h-7.145c-0.811 0.023-1.457 0.275-1.941 0.746-0.486 0.474-0.788 1.002-0.904 1.578 0 0.093-6e-3 0.181-0.017 0.262-0.012 0.08-0.017 0.155-0.017 0.224 0 0.325 0.082 0.642 0.242 0.954 0.161 0.313 0.381 0.564 0.658 0.745 0.949 0.672 1.84 1.219 2.672 1.632 0.833 0.417 1.607 0.795 2.324 1.145 0.209 0.112 0.409 0.226 0.607 0.328 0.194 0.102 0.386 0.213 0.573 0.327 0.161 0.096 0.328 0.193 0.503 0.301 0.172 0.102 0.341 0.209 0.501 0.327 0.718 0.536 1.381 1.203 1.997 2.016 0.612 0.807 0.917 1.812 0.917 3.015 0 0.305-0.017 0.632-0.05 1.004-0.035 0.373-0.111 0.745-0.226 1.113-0.253 0.896-0.781 1.714-1.577 2.444-0.799 0.726-2.053 0.811-3.764 0.811h-0.104-0.104-0.034c-0.048 0-0.093-0.011-0.141-0.022-0.045-0.012-0.079-0.012-0.103-0.012l-8.118-0.038v-2.388h7.878z"></path><path d="m9.634 17.551c0.971 0.023 1.751-0.159 2.337-0.553 0.594-0.396 0.948-1.018 1.062-1.875 0-0.74-0.243-1.422-0.729-2.045-0.484-0.626-1.213-1.184-2.185-1.67-0.184-0.091-0.377-0.181-0.571-0.271-0.199-0.096-0.398-0.193-0.607-0.283-0.023-0.022-0.055-0.039-0.087-0.05-0.035-0.012-0.066-0.028-0.088-0.051-1.711-0.835-3.277-1.728-4.701-2.688-1.419-0.959-2.131-2.269-2.131-3.937 0.022-0.07 0.034-0.128 0.034-0.175 0-0.045 6e-3 -0.079 0.017-0.104 0.012-0.023 0.017-0.046 0.017-0.069 0-1.605 0.458-2.816 1.371-3.63 0.912-0.816 1.911-1.349 2.999-1.606 0.162-0.048 0.33-0.083 0.505-0.104 0.172-0.026 0.337-0.048 0.5-0.071l7.631-0.034v2.704h-7.144c-0.81 0.023-1.457 0.275-1.942 0.746-0.484 0.474-0.786 1.002-0.903 1.578 0 0.093-6e-3 0.181-0.016 0.262-0.012 0.08-0.018 0.155-0.018 0.224 0 0.325 0.083 0.642 0.243 0.954 0.16 0.313 0.381 0.564 0.658 0.745 0.949 0.672 1.84 1.219 2.674 1.632 0.832 0.417 1.606 0.795 2.322 1.145 0.209 0.112 0.412 0.226 0.605 0.328 0.197 0.102 0.389 0.213 0.576 0.327 0.158 0.096 0.327 0.193 0.502 0.301 0.174 0.102 0.343 0.209 0.502 0.327 0.717 0.536 1.377 1.203 2 2.016 0.607 0.807 0.914 1.812 0.914 3.015 0 0.305-0.018 0.632-0.052 1.004-0.033 0.373-0.107 0.745-0.225 1.113-0.255 0.897-0.785 1.715-1.576 2.445-0.803 0.726-2.054 0.811-3.766 0.811h-0.107-0.102-0.035c-0.044 0-0.088-0.011-0.14-0.022-0.044-0.012-0.078-0.012-0.102-0.012l-8.119-0.038v-2.388h7.877z"></path><path d="m30.159 9.208c0 3.083-0.87 5.669-2.62 7.749-1.743 2.084-4.225 3.17-7.441 3.264h-33.84v-2.639h32.384c2.264 0 4.004-0.473 5.222-1.432 1.214-0.957 2.078-2.02 2.586-3.174 0.299-0.651 0.507-1.286 0.622-1.912 0.119-0.626 0.174-1.156 0.174-1.598v-0.102c-0.023-1.943-0.762-3.748-2.218-5.412-1.458-1.663-3.592-2.637-6.386-2.914h-11.012v-2.704l11.313 0.034c0.441 0 1.319 0.033 1.777 0.104 0.462 0.071 0.926 0.187 1.389 0.348 2.013 0.601 3.861 1.807 5.538 3.612 1.676 1.807 2.513 4.051 2.513 6.739v0.037z"></path></g></svg><span class="text-[#1B1725] inline-block ml-1">Speedify CSS</span> ', 3)), sr("small", null, "v" + K(e.version), 1)])]), sr("div", tg, [sr("ul", ng, [(Gi(!0), er(qi, null, Bn(i.value, ((e, t) => (Gi(), er("li", {
            key: t
        }, [sr("a", {
            href: "#",
            class: V(["flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group", r.value === e.name ? "bg-gray-100" : ""]),
            onClick: Lo((t => r.value = e.name), ["prevent"])
        }, [sr("span", {
            innerHTML: e.icon
        }, null, 8, rg), sr("span", og, K(e.name), 1)], 10, ig)])))), 128))])])])]), sr("div", sg, [ar(Wr, {
            "enter-active-class": "transition-all duration-200 ease-out",
            "enter-from-class": "opacity-0 transform translate-x-2",
            "enter-to-class": "opacity-100 transform translate-x-0",
            "leave-active-class": "transition-all duration-200 ease-in",
            "leave-from-class": "opacity-100 transform translate-x-0",
            "leave-to-class": "opacity-0 transform translate-x-2",
            mode: "out-in"
        }, {
            default: Gt((() => [(Gi(), tr(Rn(o.value), {
                currentColumn: r.value,
                class: "h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 text-left",
                iconclass: t,
                icon: s.value,
                onChangeColumn: a
            }, null, 40, ["currentColumn", "icon"]))])),
            _: 1
        })])])]))
    }
})).mount("#app");