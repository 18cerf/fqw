"use strict";
(self.webpackChunkfront = self.webpackChunkfront || []).push([[179], {
    179: (Mc, Pp, Uo) => {
        function J(n) {
            return "function" == typeof n
        }

        function Sc(n) {
            const e = n(r => {
                Error.call(r), r.stack = (new Error).stack
            });
            return e.prototype = Object.create(Error.prototype), e.prototype.constructor = e, e
        }

        const Tc = Sc(n => function (e) {
            n(this), this.message = e ? `${e.length} errors occurred during unsubscription:\n${e.map((r, i) => `${i + 1}) ${r.toString()}`).join("\n  ")}` : "", this.name = "UnsubscriptionError", this.errors = e
        });

        function $o(n, t) {
            if (n) {
                const e = n.indexOf(t);
                0 <= e && n.splice(e, 1)
            }
        }

        class Ne {
            constructor(t) {
                this.initialTeardown = t, this.closed = !1, this._parentage = null, this._finalizers = null
            }

            unsubscribe() {
                let t;
                if (!this.closed) {
                    this.closed = !0;
                    const {_parentage: e} = this;
                    if (e) if (this._parentage = null, Array.isArray(e)) for (const s of e) s.remove(this); else e.remove(this);
                    const {initialTeardown: r} = this;
                    if (J(r)) try {
                        r()
                    } catch (s) {
                        t = s instanceof Tc ? s.errors : [s]
                    }
                    const {_finalizers: i} = this;
                    if (i) {
                        this._finalizers = null;
                        for (const s of i) try {
                            Op(s)
                        } catch (o) {
                            t = t ?? [], o instanceof Tc ? t = [...t, ...o.errors] : t.push(o)
                        }
                    }
                    if (t) throw new Tc(t)
                }
            }

            add(t) {
                var e;
                if (t && t !== this) if (this.closed) Op(t); else {
                    if (t instanceof Ne) {
                        if (t.closed || t._hasParent(this)) return;
                        t._addParent(this)
                    }
                    (this._finalizers = null !== (e = this._finalizers) && void 0 !== e ? e : []).push(t)
                }
            }

            _hasParent(t) {
                const {_parentage: e} = this;
                return e === t || Array.isArray(e) && e.includes(t)
            }

            _addParent(t) {
                const {_parentage: e} = this;
                this._parentage = Array.isArray(e) ? (e.push(t), e) : e ? [e, t] : t
            }

            _removeParent(t) {
                const {_parentage: e} = this;
                e === t ? this._parentage = null : Array.isArray(e) && $o(e, t)
            }

            remove(t) {
                const {_finalizers: e} = this;
                e && $o(e, t), t instanceof Ne && t._removeParent(this)
            }
        }

        Ne.EMPTY = (() => {
            const n = new Ne;
            return n.closed = !0, n
        })();
        const Fp = Ne.EMPTY;

        function Np(n) {
            return n instanceof Ne || n && "closed" in n && J(n.remove) && J(n.add) && J(n.unsubscribe)
        }

        function Op(n) {
            J(n) ? n() : n.unsubscribe()
        }

        const Ar = {
            onUnhandledError: null,
            onStoppedNotification: null,
            Promise: void 0,
            useDeprecatedSynchronousErrorHandling: !1,
            useDeprecatedNextContext: !1
        }, zo = {
            setTimeout(n, t, ...e) {
                const {delegate: r} = zo;
                return r?.setTimeout ? r.setTimeout(n, t, ...e) : setTimeout(n, t, ...e)
            }, clearTimeout(n) {
                const {delegate: t} = zo;
                return (t?.clearTimeout || clearTimeout)(n)
            }, delegate: void 0
        };

        function Lp(n) {
            zo.setTimeout(() => {
                const {onUnhandledError: t} = Ar;
                if (!t) throw n;
                t(n)
            })
        }

        function Ic() {
        }

        const JE = Ac("C", void 0, void 0);

        function Ac(n, t, e) {
            return {kind: n, value: t, error: e}
        }

        let Rr = null;

        function Wo(n) {
            if (Ar.useDeprecatedSynchronousErrorHandling) {
                const t = !Rr;
                if (t && (Rr = {errorThrown: !1, error: null}), n(), t) {
                    const {errorThrown: e, error: r} = Rr;
                    if (Rr = null, e) throw r
                }
            } else n()
        }

        class Rc extends Ne {
            constructor(t) {
                super(), this.isStopped = !1, t ? (this.destination = t, Np(t) && t.add(this)) : this.destination = o0
            }

            static create(t, e, r) {
                return new ys(t, e, r)
            }

            next(t) {
                this.isStopped ? kc(function e0(n) {
                    return Ac("N", n, void 0)
                }(t), this) : this._next(t)
            }

            error(t) {
                this.isStopped ? kc(function XE(n) {
                    return Ac("E", void 0, n)
                }(t), this) : (this.isStopped = !0, this._error(t))
            }

            complete() {
                this.isStopped ? kc(JE, this) : (this.isStopped = !0, this._complete())
            }

            unsubscribe() {
                this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null)
            }

            _next(t) {
                this.destination.next(t)
            }

            _error(t) {
                try {
                    this.destination.error(t)
                } finally {
                    this.unsubscribe()
                }
            }

            _complete() {
                try {
                    this.destination.complete()
                } finally {
                    this.unsubscribe()
                }
            }
        }

        const n0 = Function.prototype.bind;

        function xc(n, t) {
            return n0.call(n, t)
        }

        class r0 {
            constructor(t) {
                this.partialObserver = t
            }

            next(t) {
                const {partialObserver: e} = this;
                if (e.next) try {
                    e.next(t)
                } catch (r) {
                    Go(r)
                }
            }

            error(t) {
                const {partialObserver: e} = this;
                if (e.error) try {
                    e.error(t)
                } catch (r) {
                    Go(r)
                } else Go(t)
            }

            complete() {
                const {partialObserver: t} = this;
                if (t.complete) try {
                    t.complete()
                } catch (e) {
                    Go(e)
                }
            }
        }

        class ys extends Rc {
            constructor(t, e, r) {
                let i;
                if (super(), J(t) || !t) i = {next: t ?? void 0, error: e ?? void 0, complete: r ?? void 0}; else {
                    let s;
                    this && Ar.useDeprecatedNextContext ? (s = Object.create(t), s.unsubscribe = () => this.unsubscribe(), i = {
                        next: t.next && xc(t.next, s),
                        error: t.error && xc(t.error, s),
                        complete: t.complete && xc(t.complete, s)
                    }) : i = t
                }
                this.destination = new r0(i)
            }
        }

        function Go(n) {
            Ar.useDeprecatedSynchronousErrorHandling ? function t0(n) {
                Ar.useDeprecatedSynchronousErrorHandling && Rr && (Rr.errorThrown = !0, Rr.error = n)
            }(n) : Lp(n)
        }

        function kc(n, t) {
            const {onStoppedNotification: e} = Ar;
            e && zo.setTimeout(() => e(n, t))
        }

        const o0 = {
            closed: !0, next: Ic, error: function s0(n) {
                throw n
            }, complete: Ic
        }, Pc = "function" == typeof Symbol && Symbol.observable || "@@observable";

        function rr(n) {
            return n
        }

        function Bp(n) {
            return 0 === n.length ? rr : 1 === n.length ? n[0] : function (e) {
                return n.reduce((r, i) => i(r), e)
            }
        }

        let fe = (() => {
            class n {
                constructor(e) {
                    e && (this._subscribe = e)
                }

                lift(e) {
                    const r = new n;
                    return r.source = this, r.operator = e, r
                }

                subscribe(e, r, i) {
                    const s = function c0(n) {
                        return n && n instanceof Rc || function l0(n) {
                            return n && J(n.next) && J(n.error) && J(n.complete)
                        }(n) && Np(n)
                    }(e) ? e : new ys(e, r, i);
                    return Wo(() => {
                        const {operator: o, source: a} = this;
                        s.add(o ? o.call(s, a) : a ? this._subscribe(s) : this._trySubscribe(s))
                    }), s
                }

                _trySubscribe(e) {
                    try {
                        return this._subscribe(e)
                    } catch (r) {
                        e.error(r)
                    }
                }

                forEach(e, r) {
                    return new (r = Vp(r))((i, s) => {
                        const o = new ys({
                            next: a => {
                                try {
                                    e(a)
                                } catch (l) {
                                    s(l), o.unsubscribe()
                                }
                            }, error: s, complete: i
                        });
                        this.subscribe(o)
                    })
                }

                _subscribe(e) {
                    var r;
                    return null === (r = this.source) || void 0 === r ? void 0 : r.subscribe(e)
                }

                [Pc]() {
                    return this
                }

                pipe(...e) {
                    return Bp(e)(this)
                }

                toPromise(e) {
                    return new (e = Vp(e))((r, i) => {
                        let s;
                        this.subscribe(o => s = o, o => i(o), () => r(s))
                    })
                }
            }

            return n.create = t => new n(t), n
        })();

        function Vp(n) {
            var t;
            return null !== (t = n ?? Ar.Promise) && void 0 !== t ? t : Promise
        }

        const u0 = Sc(n => function () {
            n(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"
        });
        let ve = (() => {
            class n extends fe {
                constructor() {
                    super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null
                }

                lift(e) {
                    const r = new jp(this, this);
                    return r.operator = e, r
                }

                _throwIfClosed() {
                    if (this.closed) throw new u0
                }

                next(e) {
                    Wo(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.currentObservers || (this.currentObservers = Array.from(this.observers));
                            for (const r of this.currentObservers) r.next(e)
                        }
                    })
                }

                error(e) {
                    Wo(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.hasError = this.isStopped = !0, this.thrownError = e;
                            const {observers: r} = this;
                            for (; r.length;) r.shift().error(e)
                        }
                    })
                }

                complete() {
                    Wo(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.isStopped = !0;
                            const {observers: e} = this;
                            for (; e.length;) e.shift().complete()
                        }
                    })
                }

                unsubscribe() {
                    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null
                }

                get observed() {
                    var e;
                    return (null === (e = this.observers) || void 0 === e ? void 0 : e.length) > 0
                }

                _trySubscribe(e) {
                    return this._throwIfClosed(), super._trySubscribe(e)
                }

                _subscribe(e) {
                    return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e)
                }

                _innerSubscribe(e) {
                    const {hasError: r, isStopped: i, observers: s} = this;
                    return r || i ? Fp : (this.currentObservers = null, s.push(e), new Ne(() => {
                        this.currentObservers = null, $o(s, e)
                    }))
                }

                _checkFinalizedStatuses(e) {
                    const {hasError: r, thrownError: i, isStopped: s} = this;
                    r ? e.error(i) : s && e.complete()
                }

                asObservable() {
                    const e = new fe;
                    return e.source = this, e
                }
            }

            return n.create = (t, e) => new jp(t, e), n
        })();

        class jp extends ve {
            constructor(t, e) {
                super(), this.destination = t, this.source = e
            }

            next(t) {
                var e, r;
                null === (r = null === (e = this.destination) || void 0 === e ? void 0 : e.next) || void 0 === r || r.call(e, t)
            }

            error(t) {
                var e, r;
                null === (r = null === (e = this.destination) || void 0 === e ? void 0 : e.error) || void 0 === r || r.call(e, t)
            }

            complete() {
                var t, e;
                null === (e = null === (t = this.destination) || void 0 === t ? void 0 : t.complete) || void 0 === e || e.call(t)
            }

            _subscribe(t) {
                var e, r;
                return null !== (r = null === (e = this.source) || void 0 === e ? void 0 : e.subscribe(t)) && void 0 !== r ? r : Fp
            }
        }

        function Hp(n) {
            return J(n?.lift)
        }

        function Ee(n) {
            return t => {
                if (Hp(t)) return t.lift(function (e) {
                    try {
                        return n(e, this)
                    } catch (r) {
                        this.error(r)
                    }
                });
                throw new TypeError("Unable to lift unknown Observable type")
            }
        }

        function be(n, t, e, r, i) {
            return new d0(n, t, e, r, i)
        }

        class d0 extends Rc {
            constructor(t, e, r, i, s, o) {
                super(t), this.onFinalize = s, this.shouldUnsubscribe = o, this._next = e ? function (a) {
                    try {
                        e(a)
                    } catch (l) {
                        t.error(l)
                    }
                } : super._next, this._error = i ? function (a) {
                    try {
                        i(a)
                    } catch (l) {
                        t.error(l)
                    } finally {
                        this.unsubscribe()
                    }
                } : super._error, this._complete = r ? function () {
                    try {
                        r()
                    } catch (a) {
                        t.error(a)
                    } finally {
                        this.unsubscribe()
                    }
                } : super._complete
            }

            unsubscribe() {
                var t;
                if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
                    const {closed: e} = this;
                    super.unsubscribe(), !e && (null === (t = this.onFinalize) || void 0 === t || t.call(this))
                }
            }
        }

        function W(n, t) {
            return Ee((e, r) => {
                let i = 0;
                e.subscribe(be(r, s => {
                    r.next(n.call(t, s, i++))
                }))
            })
        }

        function xr(n) {
            return this instanceof xr ? (this.v = n, this) : new xr(n)
        }

        function p0(n, t, e) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var i, r = e.apply(n, t || []), s = [];
            return i = {}, o("next"), o("throw"), o("return"), i[Symbol.asyncIterator] = function () {
                return this
            }, i;

            function o(h) {
                r[h] && (i[h] = function (f) {
                    return new Promise(function (p, g) {
                        s.push([h, f, p, g]) > 1 || a(h, f)
                    })
                })
            }

            function a(h, f) {
                try {
                    !function l(h) {
                        h.value instanceof xr ? Promise.resolve(h.value.v).then(c, u) : d(s[0][2], h)
                    }(r[h](f))
                } catch (p) {
                    d(s[0][3], p)
                }
            }

            function c(h) {
                a("next", h)
            }

            function u(h) {
                a("throw", h)
            }

            function d(h, f) {
                h(f), s.shift(), s.length && a(s[0][0], s[0][1])
            }
        }

        function g0(n) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var e, t = n[Symbol.asyncIterator];
            return t ? t.call(n) : (n = function zp(n) {
                var t = "function" == typeof Symbol && Symbol.iterator, e = t && n[t], r = 0;
                if (e) return e.call(n);
                if (n && "number" == typeof n.length) return {
                    next: function () {
                        return n && r >= n.length && (n = void 0), {value: n && n[r++], done: !n}
                    }
                };
                throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
            }(n), e = {}, r("next"), r("throw"), r("return"), e[Symbol.asyncIterator] = function () {
                return this
            }, e);

            function r(s) {
                e[s] = n[s] && function (o) {
                    return new Promise(function (a, l) {
                        !function i(s, o, a, l) {
                            Promise.resolve(l).then(function (c) {
                                s({value: c, done: a})
                            }, o)
                        }(a, l, (o = n[s](o)).done, o.value)
                    })
                }
            }
        }

        const Nc = n => n && "number" == typeof n.length && "function" != typeof n;

        function Wp(n) {
            return J(n?.then)
        }

        function Gp(n) {
            return J(n[Pc])
        }

        function qp(n) {
            return Symbol.asyncIterator && J(n?.[Symbol.asyncIterator])
        }

        function Kp(n) {
            return new TypeError(`You provided ${null !== n && "object" == typeof n ? "an invalid object" : `'${n}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
        }

        const Qp = function _0() {
            return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator"
        }();

        function Zp(n) {
            return J(n?.[Qp])
        }

        function Yp(n) {
            return p0(this, arguments, function* () {
                const e = n.getReader();
                try {
                    for (; ;) {
                        const {value: r, done: i} = yield xr(e.read());
                        if (i) return yield xr(void 0);
                        yield yield xr(r)
                    }
                } finally {
                    e.releaseLock()
                }
            })
        }

        function Jp(n) {
            return J(n?.getReader)
        }

        function Dt(n) {
            if (n instanceof fe) return n;
            if (null != n) {
                if (Gp(n)) return function y0(n) {
                    return new fe(t => {
                        const e = n[Pc]();
                        if (J(e.subscribe)) return e.subscribe(t);
                        throw new TypeError("Provided object does not correctly implement Symbol.observable")
                    })
                }(n);
                if (Nc(n)) return function v0(n) {
                    return new fe(t => {
                        for (let e = 0; e < n.length && !t.closed; e++) t.next(n[e]);
                        t.complete()
                    })
                }(n);
                if (Wp(n)) return function b0(n) {
                    return new fe(t => {
                        n.then(e => {
                            t.closed || (t.next(e), t.complete())
                        }, e => t.error(e)).then(null, Lp)
                    })
                }(n);
                if (qp(n)) return Xp(n);
                if (Zp(n)) return function D0(n) {
                    return new fe(t => {
                        for (const e of n) if (t.next(e), t.closed) return;
                        t.complete()
                    })
                }(n);
                if (Jp(n)) return function w0(n) {
                    return Xp(Yp(n))
                }(n)
            }
            throw Kp(n)
        }

        function Xp(n) {
            return new fe(t => {
                (function C0(n, t) {
                    var e, r, i, s;
                    return function h0(n, t, e, r) {
                        return new (e || (e = Promise))(function (s, o) {
                            function a(u) {
                                try {
                                    c(r.next(u))
                                } catch (d) {
                                    o(d)
                                }
                            }

                            function l(u) {
                                try {
                                    c(r.throw(u))
                                } catch (d) {
                                    o(d)
                                }
                            }

                            function c(u) {
                                u.done ? s(u.value) : function i(s) {
                                    return s instanceof e ? s : new e(function (o) {
                                        o(s)
                                    })
                                }(u.value).then(a, l)
                            }

                            c((r = r.apply(n, t || [])).next())
                        })
                    }(this, void 0, void 0, function* () {
                        try {
                            for (e = g0(n); !(r = yield e.next()).done;) if (t.next(r.value), t.closed) return
                        } catch (o) {
                            i = {error: o}
                        } finally {
                            try {
                                r && !r.done && (s = e.return) && (yield s.call(e))
                            } finally {
                                if (i) throw i.error
                            }
                        }
                        t.complete()
                    })
                })(n, t).catch(e => t.error(e))
            })
        }

        function Nn(n, t, e, r = 0, i = !1) {
            const s = t.schedule(function () {
                e(), i ? n.add(this.schedule(null, r)) : this.unsubscribe()
            }, r);
            if (n.add(s), !i) return s
        }

        function Ze(n, t, e = 1 / 0) {
            return J(t) ? Ze((r, i) => W((s, o) => t(r, s, i, o))(Dt(n(r, i))), e) : ("number" == typeof t && (e = t), Ee((r, i) => function E0(n, t, e, r, i, s, o, a) {
                const l = [];
                let c = 0, u = 0, d = !1;
                const h = () => {
                    d && !l.length && !c && t.complete()
                }, f = g => c < r ? p(g) : l.push(g), p = g => {
                    s && t.next(g), c++;
                    let _ = !1;
                    Dt(e(g, u++)).subscribe(be(t, y => {
                        i?.(y), s ? f(y) : t.next(y)
                    }, () => {
                        _ = !0
                    }, void 0, () => {
                        if (_) try {
                            for (c--; l.length && c < r;) {
                                const y = l.shift();
                                o ? Nn(t, o, () => p(y)) : p(y)
                            }
                            h()
                        } catch (y) {
                            t.error(y)
                        }
                    }))
                };
                return n.subscribe(be(t, f, () => {
                    d = !0, h()
                })), () => {
                    a?.()
                }
            }(r, i, n, e)))
        }

        function ri(n = 1 / 0) {
            return Ze(rr, n)
        }

        const wt = new fe(n => n.complete());

        function eg(n) {
            return n && J(n.schedule)
        }

        function Oc(n) {
            return n[n.length - 1]
        }

        function vs(n) {
            return eg(Oc(n)) ? n.pop() : void 0
        }

        function tg(n, t = 0) {
            return Ee((e, r) => {
                e.subscribe(be(r, i => Nn(r, n, () => r.next(i), t), () => Nn(r, n, () => r.complete(), t), i => Nn(r, n, () => r.error(i), t)))
            })
        }

        function ng(n, t = 0) {
            return Ee((e, r) => {
                r.add(n.schedule(() => e.subscribe(r), t))
            })
        }

        function rg(n, t) {
            if (!n) throw new Error("Iterable cannot be null");
            return new fe(e => {
                Nn(e, t, () => {
                    const r = n[Symbol.asyncIterator]();
                    Nn(e, t, () => {
                        r.next().then(i => {
                            i.done ? e.complete() : e.next(i.value)
                        })
                    }, 0, !0)
                })
            })
        }

        function Oe(n, t) {
            return t ? function P0(n, t) {
                if (null != n) {
                    if (Gp(n)) return function I0(n, t) {
                        return Dt(n).pipe(ng(t), tg(t))
                    }(n, t);
                    if (Nc(n)) return function R0(n, t) {
                        return new fe(e => {
                            let r = 0;
                            return t.schedule(function () {
                                r === n.length ? e.complete() : (e.next(n[r++]), e.closed || this.schedule())
                            })
                        })
                    }(n, t);
                    if (Wp(n)) return function A0(n, t) {
                        return Dt(n).pipe(ng(t), tg(t))
                    }(n, t);
                    if (qp(n)) return rg(n, t);
                    if (Zp(n)) return function x0(n, t) {
                        return new fe(e => {
                            let r;
                            return Nn(e, t, () => {
                                r = n[Qp](), Nn(e, t, () => {
                                    let i, s;
                                    try {
                                        ({value: i, done: s} = r.next())
                                    } catch (o) {
                                        return void e.error(o)
                                    }
                                    s ? e.complete() : e.next(i)
                                }, 0, !0)
                            }), () => J(r?.return) && r.return()
                        })
                    }(n, t);
                    if (Jp(n)) return function k0(n, t) {
                        return rg(Yp(n), t)
                    }(n, t)
                }
                throw Kp(n)
            }(n, t) : Dt(n)
        }

        function qo(...n) {
            const t = vs(n), e = function T0(n, t) {
                return "number" == typeof Oc(n) ? n.pop() : t
            }(n, 1 / 0), r = n;
            return r.length ? 1 === r.length ? Dt(r[0]) : ri(e)(Oe(r, t)) : wt
        }

        function Lc(n, t, ...e) {
            if (!0 === t) return void n();
            if (!1 === t) return;
            const r = new ys({
                next: () => {
                    r.unsubscribe(), n()
                }
            });
            return t(...e).subscribe(r)
        }

        function pe(n) {
            for (let t in n) if (n[t] === pe) return t;
            throw Error("Could not find renamed property on target object.")
        }

        function Bc(n, t) {
            for (const e in t) t.hasOwnProperty(e) && !n.hasOwnProperty(e) && (n[e] = t[e])
        }

        function ge(n) {
            if ("string" == typeof n) return n;
            if (Array.isArray(n)) return "[" + n.map(ge).join(", ") + "]";
            if (null == n) return "" + n;
            if (n.overriddenName) return `${n.overriddenName}`;
            if (n.name) return `${n.name}`;
            const t = n.toString();
            if (null == t) return "" + t;
            const e = t.indexOf("\n");
            return -1 === e ? t : t.substring(0, e)
        }

        function Vc(n, t) {
            return null == n || "" === n ? null === t ? "" : t : null == t || "" === t ? n : n + " " + t
        }

        const N0 = pe({__forward_ref__: pe});

        function Ko(n) {
            return n.__forward_ref__ = Ko, n.toString = function () {
                return ge(this())
            }, n
        }

        function L(n) {
            return jc(n) ? n() : n
        }

        function jc(n) {
            return "function" == typeof n && n.hasOwnProperty(N0) && n.__forward_ref__ === Ko
        }

        class D extends Error {
            constructor(t, e) {
                super(function Qo(n, t) {
                    return `NG0${Math.abs(n)}${t ? ": " + t.trim() : ""}`
                }(t, e)), this.code = t
            }
        }

        function j(n) {
            return "string" == typeof n ? n : null == n ? "" : String(n)
        }

        function Zo(n, t) {
            throw new D(-201, !1)
        }

        function At(n, t) {
            null == n && function ce(n, t, e, r) {
                throw new Error(`ASSERTION ERROR: ${n}` + (null == r ? "" : ` [Expected=> ${e} ${r} ${t} <=Actual]`))
            }(t, n, null, "!=")
        }

        function A(n) {
            return {token: n.token, providedIn: n.providedIn || null, factory: n.factory, value: void 0}
        }

        function Me(n) {
            return {providers: n.providers || [], imports: n.imports || []}
        }

        function Hc(n) {
            return ig(n, Yo) || ig(n, og)
        }

        function ig(n, t) {
            return n.hasOwnProperty(t) ? n[t] : null
        }

        function sg(n) {
            return n && (n.hasOwnProperty(Uc) || n.hasOwnProperty($0)) ? n[Uc] : null
        }

        const Yo = pe({\u0275prov: pe}), Uc = pe({\u0275inj: pe}), og = pe({ngInjectableDef: pe}),
            $0 = pe({ngInjectorDef: pe});
        var F = (() => ((F = F || {})[F.Default = 0] = "Default", F[F.Host = 1] = "Host", F[F.Self = 2] = "Self", F[F.SkipSelf = 4] = "SkipSelf", F[F.Optional = 8] = "Optional", F))();
        let $c;

        function zt(n) {
            const t = $c;
            return $c = n, t
        }

        function ag(n, t, e) {
            const r = Hc(n);
            return r && "root" == r.providedIn ? void 0 === r.value ? r.value = r.factory() : r.value : e & F.Optional ? null : void 0 !== t ? t : void Zo(ge(n))
        }

        function ir(n) {
            return {toString: n}.toString()
        }

        var on = (() => ((on = on || {})[on.OnPush = 0] = "OnPush", on[on.Default = 1] = "Default", on))(),
            an = (() => {
                return (n = an || (an = {}))[n.Emulated = 0] = "Emulated", n[n.None = 2] = "None", n[n.ShadowDom = 3] = "ShadowDom", an;
                var n
            })();
        const de = (() => typeof globalThis < "u" && globalThis || typeof global < "u" && global || typeof window < "u" && window || typeof self < "u" && typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && self)(),
            ii = {}, le = [], Jo = pe({\u0275cmp: pe}), zc = pe({\u0275dir: pe}), Wc = pe({\u0275pipe: pe}),
            lg = pe({\u0275mod: pe}), Ln = pe({\u0275fac: pe}), bs = pe({__NG_ELEMENT_ID__: pe});
        let W0 = 0;

        function Ye(n) {
            return ir(() => {
                const e = !0 === n.standalone, r = {}, i = {
                    type: n.type,
                    providersResolver: null,
                    decls: n.decls,
                    vars: n.vars,
                    factory: null,
                    template: n.template || null,
                    consts: n.consts || null,
                    ngContentSelectors: n.ngContentSelectors,
                    hostBindings: n.hostBindings || null,
                    hostVars: n.hostVars || 0,
                    hostAttrs: n.hostAttrs || null,
                    contentQueries: n.contentQueries || null,
                    declaredInputs: r,
                    inputs: null,
                    outputs: null,
                    exportAs: n.exportAs || null,
                    onPush: n.changeDetection === on.OnPush,
                    directiveDefs: null,
                    pipeDefs: null,
                    standalone: e,
                    dependencies: e && n.dependencies || null,
                    getStandaloneInjector: null,
                    selectors: n.selectors || le,
                    viewQuery: n.viewQuery || null,
                    features: n.features || null,
                    data: n.data || {},
                    encapsulation: n.encapsulation || an.Emulated,
                    id: "c" + W0++,
                    styles: n.styles || le,
                    _: null,
                    setInput: null,
                    schemas: n.schemas || null,
                    tView: null
                }, s = n.dependencies, o = n.features;
                return i.inputs = dg(n.inputs, r), i.outputs = dg(n.outputs), o && o.forEach(a => a(i)), i.directiveDefs = s ? () => ("function" == typeof s ? s() : s).map(cg).filter(ug) : null, i.pipeDefs = s ? () => ("function" == typeof s ? s() : s).map(ft).filter(ug) : null, i
            })
        }

        function cg(n) {
            return ue(n) || ht(n)
        }

        function ug(n) {
            return null !== n
        }

        function Ae(n) {
            return ir(() => ({
                type: n.type,
                bootstrap: n.bootstrap || le,
                declarations: n.declarations || le,
                imports: n.imports || le,
                exports: n.exports || le,
                transitiveCompileScopes: null,
                schemas: n.schemas || null,
                id: n.id || null
            }))
        }

        function dg(n, t) {
            if (null == n) return ii;
            const e = {};
            for (const r in n) if (n.hasOwnProperty(r)) {
                let i = n[r], s = i;
                Array.isArray(i) && (s = i[1], i = i[0]), e[i] = r, t && (t[i] = s)
            }
            return e
        }

        const x = Ye;

        function ue(n) {
            return n[Jo] || null
        }

        function ht(n) {
            return n[zc] || null
        }

        function ft(n) {
            return n[Wc] || null
        }

        function Rt(n, t) {
            const e = n[lg] || null;
            if (!e && !0 === t) throw new Error(`Type ${ge(n)} does not have '\u0275mod' property.`);
            return e
        }

        const z = 11;

        function Et(n) {
            return Array.isArray(n) && "object" == typeof n[1]
        }

        function cn(n) {
            return Array.isArray(n) && !0 === n[1]
        }

        function Kc(n) {
            return 0 != (8 & n.flags)
        }

        function na(n) {
            return 2 == (2 & n.flags)
        }

        function ra(n) {
            return 1 == (1 & n.flags)
        }

        function un(n) {
            return null !== n.template
        }

        function Y0(n) {
            return 0 != (256 & n[2])
        }

        function Or(n, t) {
            return n.hasOwnProperty(Ln) ? n[Ln] : null
        }

        class eM {
            constructor(t, e, r) {
                this.previousValue = t, this.currentValue = e, this.firstChange = r
            }

            isFirstChange() {
                return this.firstChange
            }
        }

        function Gt() {
            return pg
        }

        function pg(n) {
            return n.type.prototype.ngOnChanges && (n.setInput = nM), tM
        }

        function tM() {
            const n = mg(this), t = n?.current;
            if (t) {
                const e = n.previous;
                if (e === ii) n.previous = t; else for (let r in t) e[r] = t[r];
                n.current = null, this.ngOnChanges(t)
            }
        }

        function nM(n, t, e, r) {
            const i = mg(n) || function rM(n, t) {
                    return n[gg] = t
                }(n, {previous: ii, current: null}), s = i.current || (i.current = {}), o = i.previous,
                a = this.declaredInputs[e], l = o[a];
            s[a] = new eM(l && l.currentValue, t, o === ii), n[r] = t
        }

        Gt.ngInherit = !0;
        const gg = "__ngSimpleChanges__";

        function mg(n) {
            return n[gg] || null
        }

        function Le(n) {
            for (; Array.isArray(n);) n = n[0];
            return n
        }

        function ia(n, t) {
            return Le(t[n])
        }

        function Kt(n, t) {
            return Le(t[n.index])
        }

        function Xc(n, t) {
            return n.data[t]
        }

        function kt(n, t) {
            const e = t[n];
            return Et(e) ? e : e[0]
        }

        function _g(n) {
            return 4 == (4 & n[2])
        }

        function sa(n) {
            return 64 == (64 & n[2])
        }

        function sr(n, t) {
            return null == t ? null : n[t]
        }

        function yg(n) {
            n[18] = 0
        }

        function eu(n, t) {
            n[5] += t;
            let e = n, r = n[3];
            for (; null !== r && (1 === t && 1 === e[5] || -1 === t && 0 === e[5]);) r[5] += t, e = r, r = r[3]
        }

        const V = {lFrame: Tg(null), bindingsEnabled: !0};

        function bg() {
            return V.bindingsEnabled
        }

        function b() {
            return V.lFrame.lView
        }

        function X() {
            return V.lFrame.tView
        }

        function or(n) {
            return V.lFrame.contextLView = n, n[8]
        }

        function ar(n) {
            return V.lFrame.contextLView = null, n
        }

        function Ue() {
            let n = Dg();
            for (; null !== n && 64 === n.type;) n = n.parent;
            return n
        }

        function Dg() {
            return V.lFrame.currentTNode
        }

        function Dn(n, t) {
            const e = V.lFrame;
            e.currentTNode = n, e.isParent = t
        }

        function tu() {
            return V.lFrame.isParent
        }

        function nu() {
            V.lFrame.isParent = !1
        }

        function pt() {
            const n = V.lFrame;
            let t = n.bindingRootIndex;
            return -1 === t && (t = n.bindingRootIndex = n.tView.bindingStartIndex), t
        }

        function ui() {
            return V.lFrame.bindingIndex++
        }

        function _M(n, t) {
            const e = V.lFrame;
            e.bindingIndex = e.bindingRootIndex = n, ru(t)
        }

        function ru(n) {
            V.lFrame.currentDirectiveIndex = n
        }

        function Eg() {
            return V.lFrame.currentQueryIndex
        }

        function su(n) {
            V.lFrame.currentQueryIndex = n
        }

        function vM(n) {
            const t = n[1];
            return 2 === t.type ? t.declTNode : 1 === t.type ? n[6] : null
        }

        function Mg(n, t, e) {
            if (e & F.SkipSelf) {
                let i = t, s = n;
                for (; !(i = i.parent, null !== i || e & F.Host || (i = vM(s), null === i || (s = s[15], 10 & i.type)));) ;
                if (null === i) return !1;
                t = i, n = s
            }
            const r = V.lFrame = Sg();
            return r.currentTNode = t, r.lView = n, !0
        }

        function ou(n) {
            const t = Sg(), e = n[1];
            V.lFrame = t, t.currentTNode = e.firstChild, t.lView = n, t.tView = e, t.contextLView = n, t.bindingIndex = e.bindingStartIndex, t.inI18n = !1
        }

        function Sg() {
            const n = V.lFrame, t = null === n ? null : n.child;
            return null === t ? Tg(n) : t
        }

        function Tg(n) {
            const t = {
                currentTNode: null,
                isParent: !0,
                lView: null,
                tView: null,
                selectedIndex: -1,
                contextLView: null,
                elementDepthCount: 0,
                currentNamespace: null,
                currentDirectiveIndex: -1,
                bindingRootIndex: -1,
                bindingIndex: -1,
                currentQueryIndex: 0,
                parent: n,
                child: null,
                inI18n: !1
            };
            return null !== n && (n.child = t), t
        }

        function Ig() {
            const n = V.lFrame;
            return V.lFrame = n.parent, n.currentTNode = null, n.lView = null, n
        }

        const Ag = Ig;

        function au() {
            const n = Ig();
            n.isParent = !0, n.tView = null, n.selectedIndex = -1, n.contextLView = null, n.elementDepthCount = 0, n.currentDirectiveIndex = -1, n.currentNamespace = null, n.bindingRootIndex = -1, n.bindingIndex = -1, n.currentQueryIndex = 0
        }

        function gt() {
            return V.lFrame.selectedIndex
        }

        function lr(n) {
            V.lFrame.selectedIndex = n
        }

        function xe() {
            const n = V.lFrame;
            return Xc(n.tView, n.selectedIndex)
        }

        function aa(n, t) {
            for (let e = t.directiveStart, r = t.directiveEnd; e < r; e++) {
                const s = n.data[e].type.prototype, {
                    ngAfterContentInit: o,
                    ngAfterContentChecked: a,
                    ngAfterViewInit: l,
                    ngAfterViewChecked: c,
                    ngOnDestroy: u
                } = s;
                o && (n.contentHooks || (n.contentHooks = [])).push(-e, o), a && ((n.contentHooks || (n.contentHooks = [])).push(e, a), (n.contentCheckHooks || (n.contentCheckHooks = [])).push(e, a)), l && (n.viewHooks || (n.viewHooks = [])).push(-e, l), c && ((n.viewHooks || (n.viewHooks = [])).push(e, c), (n.viewCheckHooks || (n.viewCheckHooks = [])).push(e, c)), null != u && (n.destroyHooks || (n.destroyHooks = [])).push(e, u)
            }
        }

        function la(n, t, e) {
            Rg(n, t, 3, e)
        }

        function ca(n, t, e, r) {
            (3 & n[2]) === e && Rg(n, t, e, r)
        }

        function lu(n, t) {
            let e = n[2];
            (3 & e) === t && (e &= 2047, e += 1, n[2] = e)
        }

        function Rg(n, t, e, r) {
            const s = r ?? -1, o = t.length - 1;
            let a = 0;
            for (let l = void 0 !== r ? 65535 & n[18] : 0; l < o; l++) if ("number" == typeof t[l + 1]) {
                if (a = t[l], null != r && a >= r) break
            } else t[l] < 0 && (n[18] += 65536), (a < s || -1 == s) && (IM(n, e, t, l), n[18] = (4294901760 & n[18]) + l + 2), l++
        }

        function IM(n, t, e, r) {
            const i = e[r] < 0, s = e[r + 1], a = n[i ? -e[r] : e[r]];
            if (i) {
                if (n[2] >> 11 < n[18] >> 16 && (3 & n[2]) === t) {
                    n[2] += 2048;
                    try {
                        s.call(a)
                    } finally {
                    }
                }
            } else try {
                s.call(a)
            } finally {
            }
        }

        class Ms {
            constructor(t, e, r) {
                this.factory = t, this.resolving = !1, this.canSeeViewProviders = e, this.injectImpl = r
            }
        }

        function ua(n, t, e) {
            let r = 0;
            for (; r < e.length;) {
                const i = e[r];
                if ("number" == typeof i) {
                    if (0 !== i) break;
                    r++;
                    const s = e[r++], o = e[r++], a = e[r++];
                    n.setAttribute(t, o, a, s)
                } else {
                    const s = i, o = e[++r];
                    kg(s) ? n.setProperty(t, s, o) : n.setAttribute(t, s, o), r++
                }
            }
            return r
        }

        function xg(n) {
            return 3 === n || 4 === n || 6 === n
        }

        function kg(n) {
            return 64 === n.charCodeAt(0)
        }

        function da(n, t) {
            if (null !== t && 0 !== t.length) if (null === n || 0 === n.length) n = t.slice(); else {
                let e = -1;
                for (let r = 0; r < t.length; r++) {
                    const i = t[r];
                    "number" == typeof i ? e = i : 0 === e || Pg(n, e, i, null, -1 === e || 2 === e ? t[++r] : null)
                }
            }
            return n
        }

        function Pg(n, t, e, r, i) {
            let s = 0, o = n.length;
            if (-1 === t) o = -1; else for (; s < n.length;) {
                const a = n[s++];
                if ("number" == typeof a) {
                    if (a === t) {
                        o = -1;
                        break
                    }
                    if (a > t) {
                        o = s - 1;
                        break
                    }
                }
            }
            for (; s < n.length;) {
                const a = n[s];
                if ("number" == typeof a) break;
                if (a === e) {
                    if (null === r) return void (null !== i && (n[s + 1] = i));
                    if (r === n[s + 1]) return void (n[s + 2] = i)
                }
                s++, null !== r && s++, null !== i && s++
            }
            -1 !== o && (n.splice(o, 0, t), s = o + 1), n.splice(s++, 0, e), null !== r && n.splice(s++, 0, r), null !== i && n.splice(s++, 0, i)
        }

        function Fg(n) {
            return -1 !== n
        }

        function di(n) {
            return 32767 & n
        }

        function hi(n, t) {
            let e = function PM(n) {
                return n >> 16
            }(n), r = t;
            for (; e > 0;) r = r[15], e--;
            return r
        }

        let uu = !0;

        function ha(n) {
            const t = uu;
            return uu = n, t
        }

        let FM = 0;
        const wn = {};

        function Ts(n, t) {
            const e = hu(n, t);
            if (-1 !== e) return e;
            const r = t[1];
            r.firstCreatePass && (n.injectorIndex = t.length, du(r.data, n), du(t, null), du(r.blueprint, null));
            const i = fa(n, t), s = n.injectorIndex;
            if (Fg(i)) {
                const o = di(i), a = hi(i, t), l = a[1].data;
                for (let c = 0; c < 8; c++) t[s + c] = a[o + c] | l[o + c]
            }
            return t[s + 8] = i, s
        }

        function du(n, t) {
            n.push(0, 0, 0, 0, 0, 0, 0, 0, t)
        }

        function hu(n, t) {
            return -1 === n.injectorIndex || n.parent && n.parent.injectorIndex === n.injectorIndex || null === t[n.injectorIndex + 8] ? -1 : n.injectorIndex
        }

        function fa(n, t) {
            if (n.parent && -1 !== n.parent.injectorIndex) return n.parent.injectorIndex;
            let e = 0, r = null, i = t;
            for (; null !== i;) {
                if (r = $g(i), null === r) return -1;
                if (e++, i = i[15], -1 !== r.injectorIndex) return r.injectorIndex | e << 16
            }
            return -1
        }

        function pa(n, t, e) {
            !function NM(n, t, e) {
                let r;
                "string" == typeof e ? r = e.charCodeAt(0) || 0 : e.hasOwnProperty(bs) && (r = e[bs]), null == r && (r = e[bs] = FM++);
                const i = 255 & r;
                t.data[n + (i >> 5)] |= 1 << i
            }(n, t, e)
        }

        function Lg(n, t, e) {
            if (e & F.Optional) return n;
            Zo()
        }

        function Bg(n, t, e, r) {
            if (e & F.Optional && void 0 === r && (r = null), 0 == (e & (F.Self | F.Host))) {
                const i = n[9], s = zt(void 0);
                try {
                    return i ? i.get(t, r, e & F.Optional) : ag(t, r, e & F.Optional)
                } finally {
                    zt(s)
                }
            }
            return Lg(r, 0, e)
        }

        function Vg(n, t, e, r = F.Default, i) {
            if (null !== n) {
                if (1024 & t[2]) {
                    const o = function jM(n, t, e, r, i) {
                        let s = n, o = t;
                        for (; null !== s && null !== o && 1024 & o[2] && !(256 & o[2]);) {
                            const a = jg(s, o, e, r | F.Self, wn);
                            if (a !== wn) return a;
                            let l = s.parent;
                            if (!l) {
                                const c = o[21];
                                if (c) {
                                    const u = c.get(e, wn, r);
                                    if (u !== wn) return u
                                }
                                l = $g(o), o = o[15]
                            }
                            s = l
                        }
                        return i
                    }(n, t, e, r, wn);
                    if (o !== wn) return o
                }
                const s = jg(n, t, e, r, wn);
                if (s !== wn) return s
            }
            return Bg(t, e, r, i)
        }

        function jg(n, t, e, r, i) {
            const s = function BM(n) {
                if ("string" == typeof n) return n.charCodeAt(0) || 0;
                const t = n.hasOwnProperty(bs) ? n[bs] : void 0;
                return "number" == typeof t ? t >= 0 ? 255 & t : VM : t
            }(e);
            if ("function" == typeof s) {
                if (!Mg(t, n, r)) return r & F.Host ? Lg(i, 0, r) : Bg(t, e, r, i);
                try {
                    const o = s(r);
                    if (null != o || r & F.Optional) return o;
                    Zo()
                } finally {
                    Ag()
                }
            } else if ("number" == typeof s) {
                let o = null, a = hu(n, t), l = -1, c = r & F.Host ? t[16][6] : null;
                for ((-1 === a || r & F.SkipSelf) && (l = -1 === a ? fa(n, t) : t[a + 8], -1 !== l && Ug(r, !1) ? (o = t[1], a = di(l), t = hi(l, t)) : a = -1); -1 !== a;) {
                    const u = t[1];
                    if (Hg(s, a, u.data)) {
                        const d = LM(a, t, e, o, r, c);
                        if (d !== wn) return d
                    }
                    l = t[a + 8], -1 !== l && Ug(r, t[1].data[a + 8] === c) && Hg(s, a, t) ? (o = u, a = di(l), t = hi(l, t)) : a = -1
                }
            }
            return i
        }

        function LM(n, t, e, r, i, s) {
            const o = t[1], a = o.data[n + 8],
                u = ga(a, o, e, null == r ? na(a) && uu : r != o && 0 != (3 & a.type), i & F.Host && s === a);
            return null !== u ? Is(t, o, u, a) : wn
        }

        function ga(n, t, e, r, i) {
            const s = n.providerIndexes, o = t.data, a = 1048575 & s, l = n.directiveStart, u = s >> 20,
                h = i ? a + u : n.directiveEnd;
            for (let f = r ? a : a + u; f < h; f++) {
                const p = o[f];
                if (f < l && e === p || f >= l && p.type === e) return f
            }
            if (i) {
                const f = o[l];
                if (f && un(f) && f.type === e) return l
            }
            return null
        }

        function Is(n, t, e, r) {
            let i = n[e];
            const s = t.data;
            if (function AM(n) {
                return n instanceof Ms
            }(i)) {
                const o = i;
                o.resolving && function O0(n, t) {
                    const e = t ? `. Dependency path: ${t.join(" > ")} > ${n}` : "";
                    throw new D(-200, `Circular dependency in DI detected for ${n}${e}`)
                }(function ae(n) {
                    return "function" == typeof n ? n.name || n.toString() : "object" == typeof n && null != n && "function" == typeof n.type ? n.type.name || n.type.toString() : j(n)
                }(s[e]));
                const a = ha(o.canSeeViewProviders);
                o.resolving = !0;
                const l = o.injectImpl ? zt(o.injectImpl) : null;
                Mg(n, r, F.Default);
                try {
                    i = n[e] = o.factory(void 0, s, n, r), t.firstCreatePass && e >= r.directiveStart && function TM(n, t, e) {
                        const {ngOnChanges: r, ngOnInit: i, ngDoCheck: s} = t.type.prototype;
                        if (r) {
                            const o = pg(t);
                            (e.preOrderHooks || (e.preOrderHooks = [])).push(n, o), (e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(n, o)
                        }
                        i && (e.preOrderHooks || (e.preOrderHooks = [])).push(0 - n, i), s && ((e.preOrderHooks || (e.preOrderHooks = [])).push(n, s), (e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(n, s))
                    }(e, s[e], t)
                } finally {
                    null !== l && zt(l), ha(a), o.resolving = !1, Ag()
                }
            }
            return i
        }

        function Hg(n, t, e) {
            return !!(e[t + (n >> 5)] & 1 << n)
        }

        function Ug(n, t) {
            return !(n & F.Self || n & F.Host && t)
        }

        class fi {
            constructor(t, e) {
                this._tNode = t, this._lView = e
            }

            get(t, e, r) {
                return Vg(this._tNode, this._lView, t, r, e)
            }
        }

        function VM() {
            return new fi(Ue(), b())
        }

        function nt(n) {
            return ir(() => {
                const t = n.prototype.constructor, e = t[Ln] || fu(t), r = Object.prototype;
                let i = Object.getPrototypeOf(n.prototype).constructor;
                for (; i && i !== r;) {
                    const s = i[Ln] || fu(i);
                    if (s && s !== e) return s;
                    i = Object.getPrototypeOf(i)
                }
                return s => new s
            })
        }

        function fu(n) {
            return jc(n) ? () => {
                const t = fu(L(n));
                return t && t()
            } : Or(n)
        }

        function $g(n) {
            const t = n[1], e = t.type;
            return 2 === e ? t.declTNode : 1 === e ? n[6] : null
        }

        function pi(n) {
            return function OM(n, t) {
                if ("class" === t) return n.classes;
                if ("style" === t) return n.styles;
                const e = n.attrs;
                if (e) {
                    const r = e.length;
                    let i = 0;
                    for (; i < r;) {
                        const s = e[i];
                        if (xg(s)) break;
                        if (0 === s) i += 2; else if ("number" == typeof s) for (i++; i < r && "string" == typeof e[i];) i++; else {
                            if (s === t) return e[i + 1];
                            i += 2
                        }
                    }
                }
                return null
            }(Ue(), n)
        }

        const mi = "__parameters__";

        function yi(n, t, e) {
            return ir(() => {
                const r = function pu(n) {
                    return function (...e) {
                        if (n) {
                            const r = n(...e);
                            for (const i in r) this[i] = r[i]
                        }
                    }
                }(t);

                function i(...s) {
                    if (this instanceof i) return r.apply(this, s), this;
                    const o = new i(...s);
                    return a.annotation = o, a;

                    function a(l, c, u) {
                        const d = l.hasOwnProperty(mi) ? l[mi] : Object.defineProperty(l, mi, {value: []})[mi];
                        for (; d.length <= u;) d.push(null);
                        return (d[u] = d[u] || []).push(o), l
                    }
                }

                return e && (i.prototype = Object.create(e.prototype)), i.prototype.ngMetadataName = n, i.annotationCls = i, i
            })
        }

        class S {
            constructor(t, e) {
                this._desc = t, this.ngMetadataName = "InjectionToken", this.\u0275prov = void 0, "number" == typeof e ? this.__NG_ELEMENT_ID__ = e : void 0 !== e && (this.\u0275prov = A({
                    token: this,
                    providedIn: e.providedIn || "root",
                    factory: e.factory
                }))
            }

            get multi() {
                return this
            }

            toString() {
                return `InjectionToken ${this._desc}`
            }
        }

        function Pt(n, t) {
            void 0 === t && (t = n);
            for (let e = 0; e < n.length; e++) {
                let r = n[e];
                Array.isArray(r) ? (t === n && (t = n.slice(0, e)), Pt(r, t)) : t !== n && t.push(r)
            }
            return t
        }

        function jn(n, t) {
            n.forEach(e => Array.isArray(e) ? jn(e, t) : t(e))
        }

        function Wg(n, t, e) {
            t >= n.length ? n.push(e) : n.splice(t, 0, e)
        }

        function ma(n, t) {
            return t >= n.length - 1 ? n.pop() : n.splice(t, 1)[0]
        }

        function xs(n, t) {
            const e = [];
            for (let r = 0; r < n; r++) e.push(t);
            return e
        }

        function Ft(n, t, e) {
            let r = vi(n, t);
            return r >= 0 ? n[1 | r] = e : (r = ~r, function zM(n, t, e, r) {
                let i = n.length;
                if (i == t) n.push(e, r); else if (1 === i) n.push(r, n[0]), n[0] = e; else {
                    for (i--, n.push(n[i - 1], n[i]); i > t;) n[i] = n[i - 2], i--;
                    n[t] = e, n[t + 1] = r
                }
            }(n, r, t, e)), r
        }

        function mu(n, t) {
            const e = vi(n, t);
            if (e >= 0) return n[1 | e]
        }

        function vi(n, t) {
            return function Kg(n, t, e) {
                let r = 0, i = n.length >> e;
                for (; i !== r;) {
                    const s = r + (i - r >> 1), o = n[s << e];
                    if (t === o) return s << e;
                    o > t ? i = s : r = s + 1
                }
                return ~(i << e)
            }(n, t, 1)
        }

        const ks = {}, yu = "__NG_DI_FLAG__", ya = "ngTempTokenPath", JM = /\n/gm, Qg = "__source";
        let Ps;

        function bi(n) {
            const t = Ps;
            return Ps = n, t
        }

        function eS(n, t = F.Default) {
            if (void 0 === Ps) throw new D(-203, !1);
            return null === Ps ? ag(n, void 0, t) : Ps.get(n, t & F.Optional ? null : void 0, t)
        }

        function w(n, t = F.Default) {
            return (function z0() {
                return $c
            }() || eS)(L(n), t)
        }

        function Ce(n, t = F.Default) {
            return "number" != typeof t && (t = 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4)), w(n, t)
        }

        function vu(n) {
            const t = [];
            for (let e = 0; e < n.length; e++) {
                const r = L(n[e]);
                if (Array.isArray(r)) {
                    if (0 === r.length) throw new D(900, !1);
                    let i, s = F.Default;
                    for (let o = 0; o < r.length; o++) {
                        const a = r[o], l = tS(a);
                        "number" == typeof l ? -1 === l ? i = a.token : s |= l : i = a
                    }
                    t.push(w(i, s))
                } else t.push(w(r))
            }
            return t
        }

        function Fs(n, t) {
            return n[yu] = t, n.prototype[yu] = t, n
        }

        function tS(n) {
            return n[yu]
        }

        const Ns = Fs(yi("Optional"), 8), Os = Fs(yi("SkipSelf"), 4);
        let Du;
        const Au = new S("ENVIRONMENT_INITIALIZER"), _m = new S("INJECTOR", -1), ym = new S("INJECTOR_DEF_TYPES");

        class vm {
            get(t, e = ks) {
                if (e === ks) {
                    const r = new Error(`NullInjectorError: No provider for ${ge(t)}!`);
                    throw r.name = "NullInjectorError", r
                }
                return e
            }
        }

        function jS(...n) {
            return {\u0275providers: bm(0, n)}
        }

        function bm(n, ...t) {
            const e = [], r = new Set;
            let i;
            return jn(t, s => {
                const o = s;
                Ru(o, e, [], r) && (i || (i = []), i.push(o))
            }), void 0 !== i && Dm(i, e), e
        }

        function Dm(n, t) {
            for (let e = 0; e < n.length; e++) {
                const {providers: i} = n[e];
                jn(i, s => {
                    t.push(s)
                })
            }
        }

        function Ru(n, t, e, r) {
            if (!(n = L(n))) return !1;
            let i = null, s = sg(n);
            const o = !s && ue(n);
            if (s || o) {
                if (o && !o.standalone) return !1;
                i = n
            } else {
                const l = n.ngModule;
                if (s = sg(l), !s) return !1;
                i = l
            }
            const a = r.has(i);
            if (o) {
                if (a) return !1;
                if (r.add(i), o.dependencies) {
                    const l = "function" == typeof o.dependencies ? o.dependencies() : o.dependencies;
                    for (const c of l) Ru(c, t, e, r)
                }
            } else {
                if (!s) return !1;
                {
                    if (null != s.imports && !a) {
                        let c;
                        r.add(i);
                        try {
                            jn(s.imports, u => {
                                Ru(u, t, e, r) && (c || (c = []), c.push(u))
                            })
                        } finally {
                        }
                        void 0 !== c && Dm(c, t)
                    }
                    if (!a) {
                        const c = Or(i) || (() => new i);
                        t.push({provide: i, useFactory: c, deps: le}, {
                            provide: ym,
                            useValue: i,
                            multi: !0
                        }, {provide: Au, useValue: () => w(i), multi: !0})
                    }
                    const l = s.providers;
                    null == l || a || jn(l, u => {
                        t.push(u)
                    })
                }
            }
            return i !== n && void 0 !== n.providers
        }

        const HS = pe({provide: String, useValue: pe});

        function xu(n) {
            return null !== n && "object" == typeof n && HS in n
        }

        function Lr(n) {
            return "function" == typeof n
        }

        const ku = new S("Set Injector scope."), Ma = {}, $S = {};
        let Pu;

        function Sa() {
            return void 0 === Pu && (Pu = new vm), Pu
        }

        class dr {
        }

        class Em extends dr {
            constructor(t, e, r, i) {
                super(), this.parent = e, this.source = r, this.scopes = i, this.records = new Map, this._ngOnDestroyHooks = new Set, this._onDestroyHooks = [], this._destroyed = !1, Nu(t, o => this.processProvider(o)), this.records.set(_m, Ci(void 0, this)), i.has("environment") && this.records.set(dr, Ci(void 0, this));
                const s = this.records.get(ku);
                null != s && "string" == typeof s.value && this.scopes.add(s.value), this.injectorDefTypes = new Set(this.get(ym.multi, le, F.Self))
            }

            get destroyed() {
                return this._destroyed
            }

            destroy() {
                this.assertNotDestroyed(), this._destroyed = !0;
                try {
                    for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
                    for (const t of this._onDestroyHooks) t()
                } finally {
                    this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), this._onDestroyHooks.length = 0
                }
            }

            onDestroy(t) {
                this._onDestroyHooks.push(t)
            }

            runInContext(t) {
                this.assertNotDestroyed();
                const e = bi(this), r = zt(void 0);
                try {
                    return t()
                } finally {
                    bi(e), zt(r)
                }
            }

            get(t, e = ks, r = F.Default) {
                this.assertNotDestroyed();
                const i = bi(this), s = zt(void 0);
                try {
                    if (!(r & F.SkipSelf)) {
                        let a = this.records.get(t);
                        if (void 0 === a) {
                            const l = function KS(n) {
                                return "function" == typeof n || "object" == typeof n && n instanceof S
                            }(t) && Hc(t);
                            a = l && this.injectableDefInScope(l) ? Ci(Fu(t), Ma) : null, this.records.set(t, a)
                        }
                        if (null != a) return this.hydrate(t, a)
                    }
                    return (r & F.Self ? Sa() : this.parent).get(t, e = r & F.Optional && e === ks ? null : e)
                } catch (o) {
                    if ("NullInjectorError" === o.name) {
                        if ((o[ya] = o[ya] || []).unshift(ge(t)), i) throw o;
                        return function nS(n, t, e, r) {
                            const i = n[ya];
                            throw t[Qg] && i.unshift(t[Qg]), n.message = function rS(n, t, e, r = null) {
                                n = n && "\n" === n.charAt(0) && "\u0275" == n.charAt(1) ? n.slice(2) : n;
                                let i = ge(t);
                                if (Array.isArray(t)) i = t.map(ge).join(" -> "); else if ("object" == typeof t) {
                                    let s = [];
                                    for (let o in t) if (t.hasOwnProperty(o)) {
                                        let a = t[o];
                                        s.push(o + ":" + ("string" == typeof a ? JSON.stringify(a) : ge(a)))
                                    }
                                    i = `{${s.join(", ")}}`
                                }
                                return `${e}${r ? "(" + r + ")" : ""}[${i}]: ${n.replace(JM, "\n  ")}`
                            }("\n" + n.message, i, e, r), n.ngTokenPath = i, n[ya] = null, n
                        }(o, t, "R3InjectorError", this.source)
                    }
                    throw o
                } finally {
                    zt(s), bi(i)
                }
            }

            resolveInjectorInitializers() {
                const t = bi(this), e = zt(void 0);
                try {
                    const r = this.get(Au.multi, le, F.Self);
                    for (const i of r) i()
                } finally {
                    bi(t), zt(e)
                }
            }

            toString() {
                const t = [], e = this.records;
                for (const r of e.keys()) t.push(ge(r));
                return `R3Injector[${t.join(", ")}]`
            }

            assertNotDestroyed() {
                if (this._destroyed) throw new D(205, !1)
            }

            processProvider(t) {
                let e = Lr(t = L(t)) ? t : L(t && t.provide);
                const r = function WS(n) {
                    return xu(n) ? Ci(void 0, n.useValue) : Ci(Mm(n), Ma)
                }(t);
                if (Lr(t) || !0 !== t.multi) this.records.get(e); else {
                    let i = this.records.get(e);
                    i || (i = Ci(void 0, Ma, !0), i.factory = () => vu(i.multi), this.records.set(e, i)), e = t, i.multi.push(t)
                }
                this.records.set(e, r)
            }

            hydrate(t, e) {
                return e.value === Ma && (e.value = $S, e.value = e.factory()), "object" == typeof e.value && e.value && function qS(n) {
                    return null !== n && "object" == typeof n && "function" == typeof n.ngOnDestroy
                }(e.value) && this._ngOnDestroyHooks.add(e.value), e.value
            }

            injectableDefInScope(t) {
                if (!t.providedIn) return !1;
                const e = L(t.providedIn);
                return "string" == typeof e ? "any" === e || this.scopes.has(e) : this.injectorDefTypes.has(e)
            }
        }

        function Fu(n) {
            const t = Hc(n), e = null !== t ? t.factory : Or(n);
            if (null !== e) return e;
            if (n instanceof S) throw new D(204, !1);
            if (n instanceof Function) return function zS(n) {
                const t = n.length;
                if (t > 0) throw xs(t, "?"), new D(204, !1);
                const e = function H0(n) {
                    const t = n && (n[Yo] || n[og]);
                    if (t) {
                        const e = function U0(n) {
                            if (n.hasOwnProperty("name")) return n.name;
                            const t = ("" + n).match(/^function\s*([^\s(]+)/);
                            return null === t ? "" : t[1]
                        }(n);
                        return console.warn(`DEPRECATED: DI is instantiating a token "${e}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${e}" class.`), t
                    }
                    return null
                }(n);
                return null !== e ? () => e.factory(n) : () => new n
            }(n);
            throw new D(204, !1)
        }

        function Mm(n, t, e) {
            let r;
            if (Lr(n)) {
                const i = L(n);
                return Or(i) || Fu(i)
            }
            if (xu(n)) r = () => L(n.useValue); else if (function Cm(n) {
                return !(!n || !n.useFactory)
            }(n)) r = () => n.useFactory(...vu(n.deps || [])); else if (function wm(n) {
                return !(!n || !n.useExisting)
            }(n)) r = () => w(L(n.useExisting)); else {
                const i = L(n && (n.useClass || n.provide));
                if (!function GS(n) {
                    return !!n.deps
                }(n)) return Or(i) || Fu(i);
                r = () => new i(...vu(n.deps))
            }
            return r
        }

        function Ci(n, t, e = !1) {
            return {factory: n, value: t, multi: e ? [] : void 0}
        }

        function QS(n) {
            return !!n.\u0275providers
        }

        function Nu(n, t) {
            for (const e of n) Array.isArray(e) ? Nu(e, t) : QS(e) ? Nu(e.\u0275providers, t) : t(e)
        }

        class Sm {
        }

        class JS {
            resolveComponentFactory(t) {
                throw function YS(n) {
                    const t = Error(`No component factory found for ${ge(n)}. Did you add it to @NgModule.entryComponents?`);
                    return t.ngComponent = n, t
                }(t)
            }
        }

        let Br = (() => {
            class n {
            }

            return n.NULL = new JS, n
        })();

        function XS() {
            return Ei(Ue(), b())
        }

        function Ei(n, t) {
            return new re(Kt(n, t))
        }

        let re = (() => {
            class n {
                constructor(e) {
                    this.nativeElement = e
                }
            }

            return n.__NG_ELEMENT_ID__ = XS, n
        })();

        function eT(n) {
            return n instanceof re ? n.nativeElement : n
        }

        class Us {
        }

        let Ta = (() => {
            class n {
            }

            return n.__NG_ELEMENT_ID__ = () => function tT() {
                const n = b(), e = kt(Ue().index, n);
                return (Et(e) ? e : n)[z]
            }(), n
        })(), nT = (() => {
            class n {
            }

            return n.\u0275prov = A({token: n, providedIn: "root", factory: () => null}), n
        })();

        class Mi {
            constructor(t) {
                this.full = t, this.major = t.split(".")[0], this.minor = t.split(".")[1], this.patch = t.split(".").slice(2).join(".")
            }
        }

        const rT = new Mi("14.1.3"), Ou = {};

        function Hu(n) {
            return n.ngOriginalError
        }

        class Si {
            constructor() {
                this._console = console
            }

            handleError(t) {
                const e = this._findOriginalError(t);
                this._console.error("ERROR", t), e && this._console.error("ORIGINAL ERROR", e)
            }

            _findOriginalError(t) {
                let e = t && Hu(t);
                for (; e && Hu(e);) e = Hu(e);
                return e || null
            }
        }

        const Uu = new Map;
        let gT = 0;
        const zu = "__ngContext__";

        function ct(n, t) {
            Et(t) ? (n[zu] = t[20], function _T(n) {
                Uu.set(n[20], n)
            }(t)) : n[zu] = t
        }

        function $s(n) {
            const t = n[zu];
            return "number" == typeof t ? function Pm(n) {
                return Uu.get(n) || null
            }(t) : t || null
        }

        function Wu(n) {
            const t = $s(n);
            return t ? Et(t) ? t : t.lView : null
        }

        const ST = (() => (typeof requestAnimationFrame < "u" && requestAnimationFrame || setTimeout).bind(de))();

        function Hn(n) {
            return n instanceof Function ? n() : n
        }

        var Mt = (() => ((Mt = Mt || {})[Mt.Important = 1] = "Important", Mt[Mt.DashCase = 2] = "DashCase", Mt))();

        function qu(n, t) {
            return undefined(n, t)
        }

        function zs(n) {
            const t = n[3];
            return cn(t) ? t[3] : t
        }

        function Ku(n) {
            return Hm(n[13])
        }

        function Qu(n) {
            return Hm(n[4])
        }

        function Hm(n) {
            for (; null !== n && !cn(n);) n = n[4];
            return n
        }

        function Ii(n, t, e, r, i) {
            if (null != r) {
                let s, o = !1;
                cn(r) ? s = r : Et(r) && (o = !0, r = r[0]);
                const a = Le(r);
                0 === n && null !== e ? null == i ? qm(t, e, a) : Vr(t, e, a, i || null, !0) : 1 === n && null !== e ? Vr(t, e, a, i || null, !0) : 2 === n ? function e_(n, t, e) {
                    const r = Ia(n, t);
                    r && function zT(n, t, e, r) {
                        n.removeChild(t, e, r)
                    }(n, r, t, e)
                }(t, a, o) : 3 === n && t.destroyNode(a), null != s && function qT(n, t, e, r, i) {
                    const s = e[7];
                    s !== Le(e) && Ii(t, n, r, s, i);
                    for (let a = 10; a < e.length; a++) {
                        const l = e[a];
                        Ws(l[1], l, n, t, r, s)
                    }
                }(t, n, s, e, i)
            }
        }

        function Yu(n, t, e) {
            return n.createElement(t, e)
        }

        function $m(n, t) {
            const e = n[9], r = e.indexOf(t), i = t[3];
            512 & t[2] && (t[2] &= -513, eu(i, -1)), e.splice(r, 1)
        }

        function Ju(n, t) {
            if (n.length <= 10) return;
            const e = 10 + t, r = n[e];
            if (r) {
                const i = r[17];
                null !== i && i !== n && $m(i, r), t > 0 && (n[e - 1][4] = r[4]);
                const s = ma(n, 10 + t);
                !function OT(n, t) {
                    Ws(n, t, t[z], 2, null, null), t[0] = null, t[6] = null
                }(r[1], r);
                const o = s[19];
                null !== o && o.detachView(s[1]), r[3] = null, r[4] = null, r[2] &= -65
            }
            return r
        }

        function zm(n, t) {
            if (!(128 & t[2])) {
                const e = t[z];
                e.destroyNode && Ws(n, t, e, 3, null, null), function VT(n) {
                    let t = n[13];
                    if (!t) return Xu(n[1], n);
                    for (; t;) {
                        let e = null;
                        if (Et(t)) e = t[13]; else {
                            const r = t[10];
                            r && (e = r)
                        }
                        if (!e) {
                            for (; t && !t[4] && t !== n;) Et(t) && Xu(t[1], t), t = t[3];
                            null === t && (t = n), Et(t) && Xu(t[1], t), e = t && t[4]
                        }
                        t = e
                    }
                }(t)
            }
        }

        function Xu(n, t) {
            if (!(128 & t[2])) {
                t[2] &= -65, t[2] |= 128, function $T(n, t) {
                    let e;
                    if (null != n && null != (e = n.destroyHooks)) for (let r = 0; r < e.length; r += 2) {
                        const i = t[e[r]];
                        if (!(i instanceof Ms)) {
                            const s = e[r + 1];
                            if (Array.isArray(s)) for (let o = 0; o < s.length; o += 2) {
                                const a = i[s[o]], l = s[o + 1];
                                try {
                                    l.call(a)
                                } finally {
                                }
                            } else try {
                                s.call(i)
                            } finally {
                            }
                        }
                    }
                }(n, t), function UT(n, t) {
                    const e = n.cleanup, r = t[7];
                    let i = -1;
                    if (null !== e) for (let s = 0; s < e.length - 1; s += 2) if ("string" == typeof e[s]) {
                        const o = e[s + 1], a = "function" == typeof o ? o(t) : Le(t[o]), l = r[i = e[s + 2]],
                            c = e[s + 3];
                        "boolean" == typeof c ? a.removeEventListener(e[s], l, c) : c >= 0 ? r[i = c]() : r[i = -c].unsubscribe(), s += 2
                    } else {
                        const o = r[i = e[s + 1]];
                        e[s].call(o)
                    }
                    if (null !== r) {
                        for (let s = i + 1; s < r.length; s++) (0, r[s])();
                        t[7] = null
                    }
                }(n, t), 1 === t[1].type && t[z].destroy();
                const e = t[17];
                if (null !== e && cn(t[3])) {
                    e !== t[3] && $m(e, t);
                    const r = t[19];
                    null !== r && r.detachView(n)
                }
                !function yT(n) {
                    Uu.delete(n[20])
                }(t)
            }
        }

        function Wm(n, t, e) {
            return function Gm(n, t, e) {
                let r = t;
                for (; null !== r && 40 & r.type;) r = (t = r).parent;
                if (null === r) return e[0];
                if (2 & r.flags) {
                    const i = n.data[r.directiveStart].encapsulation;
                    if (i === an.None || i === an.Emulated) return null
                }
                return Kt(r, e)
            }(n, t.parent, e)
        }

        function Vr(n, t, e, r, i) {
            n.insertBefore(t, e, r, i)
        }

        function qm(n, t, e) {
            n.appendChild(t, e)
        }

        function Km(n, t, e, r, i) {
            null !== r ? Vr(n, t, e, r, i) : qm(n, t, e)
        }

        function Ia(n, t) {
            return n.parentNode(t)
        }

        function Qm(n, t, e) {
            return Ym(n, t, e)
        }

        let Ym = function Zm(n, t, e) {
            return 40 & n.type ? Kt(n, e) : null
        };

        function Aa(n, t, e, r) {
            const i = Wm(n, r, t), s = t[z], a = Qm(r.parent || t[6], r, t);
            if (null != i) if (Array.isArray(e)) for (let l = 0; l < e.length; l++) Km(s, i, e[l], a, !1); else Km(s, i, e, a, !1)
        }

        function Ra(n, t) {
            if (null !== t) {
                const e = t.type;
                if (3 & e) return Kt(t, n);
                if (4 & e) return td(-1, n[t.index]);
                if (8 & e) {
                    const r = t.child;
                    if (null !== r) return Ra(n, r);
                    {
                        const i = n[t.index];
                        return cn(i) ? td(-1, i) : Le(i)
                    }
                }
                if (32 & e) return qu(t, n)() || Le(n[t.index]);
                {
                    const r = Xm(n, t);
                    return null !== r ? Array.isArray(r) ? r[0] : Ra(zs(n[16]), r) : Ra(n, t.next)
                }
            }
            return null
        }

        function Xm(n, t) {
            return null !== t ? n[16][6].projection[t.projection] : null
        }

        function td(n, t) {
            const e = 10 + n + 1;
            if (e < t.length) {
                const r = t[e], i = r[1].firstChild;
                if (null !== i) return Ra(r, i)
            }
            return t[7]
        }

        function nd(n, t, e, r, i, s, o) {
            for (; null != e;) {
                const a = r[e.index], l = e.type;
                if (o && 0 === t && (a && ct(Le(a), r), e.flags |= 4), 64 != (64 & e.flags)) if (8 & l) nd(n, t, e.child, r, i, s, !1), Ii(t, n, i, a, s); else if (32 & l) {
                    const c = qu(e, r);
                    let u;
                    for (; u = c();) Ii(t, n, i, u, s);
                    Ii(t, n, i, a, s)
                } else 16 & l ? t_(n, t, r, e, i, s) : Ii(t, n, i, a, s);
                e = o ? e.projectionNext : e.next
            }
        }

        function Ws(n, t, e, r, i, s) {
            nd(e, r, n.firstChild, t, i, s, !1)
        }

        function t_(n, t, e, r, i, s) {
            const o = e[16], l = o[6].projection[r.projection];
            if (Array.isArray(l)) for (let c = 0; c < l.length; c++) Ii(t, n, i, l[c], s); else nd(n, t, l, o[3], i, s, !0)
        }

        function n_(n, t, e) {
            n.setAttribute(t, "style", e)
        }

        function rd(n, t, e) {
            "" === e ? n.removeAttribute(t, "class") : n.setAttribute(t, "class", e)
        }

        function r_(n, t, e) {
            let r = n.length;
            for (; ;) {
                const i = n.indexOf(t, e);
                if (-1 === i) return i;
                if (0 === i || n.charCodeAt(i - 1) <= 32) {
                    const s = t.length;
                    if (i + s === r || n.charCodeAt(i + s) <= 32) return i
                }
                e = i + 1
            }
        }

        const i_ = "ng-template";

        function QT(n, t, e) {
            let r = 0;
            for (; r < n.length;) {
                let i = n[r++];
                if (e && "class" === i) {
                    if (i = n[r], -1 !== r_(i.toLowerCase(), t, 0)) return !0
                } else if (1 === i) {
                    for (; r < n.length && "string" == typeof (i = n[r++]);) if (i.toLowerCase() === t) return !0;
                    return !1
                }
            }
            return !1
        }

        function s_(n) {
            return 4 === n.type && n.value !== i_
        }

        function ZT(n, t, e) {
            return t === (4 !== n.type || e ? n.value : i_)
        }

        function YT(n, t, e) {
            let r = 4;
            const i = n.attrs || [], s = function eI(n) {
                for (let t = 0; t < n.length; t++) if (xg(n[t])) return t;
                return n.length
            }(i);
            let o = !1;
            for (let a = 0; a < t.length; a++) {
                const l = t[a];
                if ("number" != typeof l) {
                    if (!o) if (4 & r) {
                        if (r = 2 | 1 & r, "" !== l && !ZT(n, l, e) || "" === l && 1 === t.length) {
                            if (dn(r)) return !1;
                            o = !0
                        }
                    } else {
                        const c = 8 & r ? l : t[++a];
                        if (8 & r && null !== n.attrs) {
                            if (!QT(n.attrs, c, e)) {
                                if (dn(r)) return !1;
                                o = !0
                            }
                            continue
                        }
                        const d = JT(8 & r ? "class" : l, i, s_(n), e);
                        if (-1 === d) {
                            if (dn(r)) return !1;
                            o = !0;
                            continue
                        }
                        if ("" !== c) {
                            let h;
                            h = d > s ? "" : i[d + 1].toLowerCase();
                            const f = 8 & r ? h : null;
                            if (f && -1 !== r_(f, c, 0) || 2 & r && c !== h) {
                                if (dn(r)) return !1;
                                o = !0
                            }
                        }
                    }
                } else {
                    if (!o && !dn(r) && !dn(l)) return !1;
                    if (o && dn(l)) continue;
                    o = !1, r = l | 1 & r
                }
            }
            return dn(r) || o
        }

        function dn(n) {
            return 0 == (1 & n)
        }

        function JT(n, t, e, r) {
            if (null === t) return -1;
            let i = 0;
            if (r || !e) {
                let s = !1;
                for (; i < t.length;) {
                    const o = t[i];
                    if (o === n) return i;
                    if (3 === o || 6 === o) s = !0; else {
                        if (1 === o || 2 === o) {
                            let a = t[++i];
                            for (; "string" == typeof a;) a = t[++i];
                            continue
                        }
                        if (4 === o) break;
                        if (0 === o) {
                            i += 4;
                            continue
                        }
                    }
                    i += s ? 1 : 2
                }
                return -1
            }
            return function tI(n, t) {
                let e = n.indexOf(4);
                if (e > -1) for (e++; e < n.length;) {
                    const r = n[e];
                    if ("number" == typeof r) return -1;
                    if (r === t) return e;
                    e++
                }
                return -1
            }(t, n)
        }

        function o_(n, t, e = !1) {
            for (let r = 0; r < t.length; r++) if (YT(n, t[r], e)) return !0;
            return !1
        }

        function nI(n, t) {
            e:for (let e = 0; e < t.length; e++) {
                const r = t[e];
                if (n.length === r.length) {
                    for (let i = 0; i < n.length; i++) if (n[i] !== r[i]) continue e;
                    return !0
                }
            }
            return !1
        }

        function a_(n, t) {
            return n ? ":not(" + t.trim() + ")" : t
        }

        function rI(n) {
            let t = n[0], e = 1, r = 2, i = "", s = !1;
            for (; e < n.length;) {
                let o = n[e];
                if ("string" == typeof o) if (2 & r) {
                    const a = n[++e];
                    i += "[" + o + (a.length > 0 ? '="' + a + '"' : "") + "]"
                } else 8 & r ? i += "." + o : 4 & r && (i += " " + o); else "" !== i && !dn(o) && (t += a_(s, i), i = ""), r = o, s = s || !dn(r);
                e++
            }
            return "" !== i && (t += a_(s, i)), t
        }

        const H = {};

        function he(n) {
            l_(X(), b(), gt() + n, !1)
        }

        function l_(n, t, e, r) {
            if (!r) if (3 == (3 & t[2])) {
                const s = n.preOrderCheckHooks;
                null !== s && la(t, s, e)
            } else {
                const s = n.preOrderHooks;
                null !== s && ca(t, s, 0, e)
            }
            lr(e)
        }

        function h_(n, t = null, e = null, r) {
            const i = f_(n, t, e, r);
            return i.resolveInjectorInitializers(), i
        }

        function f_(n, t = null, e = null, r, i = new Set) {
            const s = [e || le, jS(n)];
            return r = r || ("object" == typeof n ? void 0 : ge(n)), new Em(s, t || Sa(), r || null, i)
        }

        let Qt = (() => {
            class n {
                static create(e, r) {
                    if (Array.isArray(e)) return h_({name: ""}, r, e, "");
                    {
                        const i = e.name ?? "";
                        return h_({name: i}, e.parent, e.providers, i)
                    }
                }
            }

            return n.THROW_IF_NOT_FOUND = ks, n.NULL = new vm, n.\u0275prov = A({
                token: n,
                providedIn: "any",
                factory: () => w(_m)
            }), n.__NG_ELEMENT_ID__ = -1, n
        })();

        function m(n, t = F.Default) {
            const e = b();
            return null === e ? w(n, t) : Vg(Ue(), e, L(n), t)
        }

        function ld() {
            throw new Error("invalid")
        }

        function ka(n, t) {
            return n << 17 | t << 2
        }

        function hn(n) {
            return n >> 17 & 32767
        }

        function cd(n) {
            return 2 | n
        }

        function Un(n) {
            return (131068 & n) >> 2
        }

        function ud(n, t) {
            return -131069 & n | t << 2
        }

        function dd(n) {
            return 1 | n
        }

        function R_(n, t) {
            const e = n.contentQueries;
            if (null !== e) for (let r = 0; r < e.length; r += 2) {
                const i = e[r], s = e[r + 1];
                if (-1 !== s) {
                    const o = n.data[s];
                    su(i), o.contentQueries(2, t[s], s)
                }
            }
        }

        function Na(n, t, e, r, i, s, o, a, l, c, u) {
            const d = t.blueprint.slice();
            return d[0] = i, d[2] = 76 | r, (null !== u || n && 1024 & n[2]) && (d[2] |= 1024), yg(d), d[3] = d[15] = n, d[8] = e, d[10] = o || n && n[10], d[z] = a || n && n[z], d[12] = l || n && n[12] || null, d[9] = c || n && n[9] || null, d[6] = s, d[20] = function mT() {
                return gT++
            }(), d[21] = u, d[16] = 2 == t.type ? n[16] : d, d
        }

        function Ri(n, t, e, r, i) {
            let s = n.data[t];
            if (null === s) s = function bd(n, t, e, r, i) {
                const s = Dg(), o = tu(), l = n.data[t] = function jI(n, t, e, r, i, s) {
                    return {
                        type: e,
                        index: r,
                        insertBeforeIndex: null,
                        injectorIndex: t ? t.injectorIndex : -1,
                        directiveStart: -1,
                        directiveEnd: -1,
                        directiveStylingLast: -1,
                        propertyBindings: null,
                        flags: 0,
                        providerIndexes: 0,
                        value: i,
                        attrs: s,
                        mergedAttrs: null,
                        localNames: null,
                        initialInputs: void 0,
                        inputs: null,
                        outputs: null,
                        tViews: null,
                        next: null,
                        projectionNext: null,
                        child: null,
                        parent: t,
                        projection: null,
                        styles: null,
                        stylesWithoutHost: null,
                        residualStyles: void 0,
                        classes: null,
                        classesWithoutHost: null,
                        residualClasses: void 0,
                        classBindings: 0,
                        styleBindings: 0
                    }
                }(0, o ? s : s && s.parent, e, t, r, i);
                return null === n.firstChild && (n.firstChild = l), null !== s && (o ? null == s.child && null !== l.parent && (s.child = l) : null === s.next && (s.next = l)), l
            }(n, t, e, r, i), function mM() {
                return V.lFrame.inI18n
            }() && (s.flags |= 64); else if (64 & s.type) {
                s.type = e, s.value = r, s.attrs = i;
                const o = function Es() {
                    const n = V.lFrame, t = n.currentTNode;
                    return n.isParent ? t : t.parent
                }();
                s.injectorIndex = null === o ? -1 : o.injectorIndex
            }
            return Dn(s, !0), s
        }

        function xi(n, t, e, r) {
            if (0 === e) return -1;
            const i = t.length;
            for (let s = 0; s < e; s++) t.push(r), n.blueprint.push(r), n.data.push(null);
            return i
        }

        function Oa(n, t, e) {
            ou(t);
            try {
                const r = n.viewQuery;
                null !== r && Ad(1, r, e);
                const i = n.template;
                null !== i && x_(n, t, i, 1, e), n.firstCreatePass && (n.firstCreatePass = !1), n.staticContentQueries && R_(n, t), n.staticViewQueries && Ad(2, n.viewQuery, e);
                const s = n.components;
                null !== s && function OI(n, t) {
                    for (let e = 0; e < t.length; e++) nA(n, t[e])
                }(t, s)
            } catch (r) {
                throw n.firstCreatePass && (n.incompleteFirstPass = !0, n.firstCreatePass = !1), r
            } finally {
                t[2] &= -5, au()
            }
        }

        function Gs(n, t, e, r) {
            const i = t[2];
            if (128 != (128 & i)) {
                ou(t);
                try {
                    yg(t), function wg(n) {
                        return V.lFrame.bindingIndex = n
                    }(n.bindingStartIndex), null !== e && x_(n, t, e, 2, r);
                    const o = 3 == (3 & i);
                    if (o) {
                        const c = n.preOrderCheckHooks;
                        null !== c && la(t, c, null)
                    } else {
                        const c = n.preOrderHooks;
                        null !== c && ca(t, c, 0, null), lu(t, 0)
                    }
                    if (function eA(n) {
                        for (let t = Ku(n); null !== t; t = Qu(t)) {
                            if (!t[2]) continue;
                            const e = t[9];
                            for (let r = 0; r < e.length; r++) {
                                const i = e[r], s = i[3];
                                0 == (512 & i[2]) && eu(s, 1), i[2] |= 512
                            }
                        }
                    }(t), function XI(n) {
                        for (let t = Ku(n); null !== t; t = Qu(t)) for (let e = 10; e < t.length; e++) {
                            const r = t[e], i = r[1];
                            sa(r) && Gs(i, r, i.template, r[8])
                        }
                    }(t), null !== n.contentQueries && R_(n, t), o) {
                        const c = n.contentCheckHooks;
                        null !== c && la(t, c)
                    } else {
                        const c = n.contentHooks;
                        null !== c && ca(t, c, 1), lu(t, 1)
                    }
                    !function FI(n, t) {
                        const e = n.hostBindingOpCodes;
                        if (null !== e) try {
                            for (let r = 0; r < e.length; r++) {
                                const i = e[r];
                                if (i < 0) lr(~i); else {
                                    const s = i, o = e[++r], a = e[++r];
                                    _M(o, s), a(2, t[s])
                                }
                            }
                        } finally {
                            lr(-1)
                        }
                    }(n, t);
                    const a = n.components;
                    null !== a && function NI(n, t) {
                        for (let e = 0; e < t.length; e++) tA(n, t[e])
                    }(t, a);
                    const l = n.viewQuery;
                    if (null !== l && Ad(2, l, r), o) {
                        const c = n.viewCheckHooks;
                        null !== c && la(t, c)
                    } else {
                        const c = n.viewHooks;
                        null !== c && ca(t, c, 2), lu(t, 2)
                    }
                    !0 === n.firstUpdatePass && (n.firstUpdatePass = !1), t[2] &= -41, 512 & t[2] && (t[2] &= -513, eu(t[3], -1))
                } finally {
                    au()
                }
            }
        }

        function LI(n, t, e, r) {
            const i = t[10], o = _g(t);
            try {
                !o && i.begin && i.begin(), o && Oa(n, t, r), Gs(n, t, e, r)
            } finally {
                !o && i.end && i.end()
            }
        }

        function x_(n, t, e, r, i) {
            const s = gt(), o = 2 & r;
            try {
                lr(-1), o && t.length > 22 && l_(n, t, 22, !1), e(r, i)
            } finally {
                lr(s)
            }
        }

        function k_(n, t, e) {
            if (Kc(t)) {
                const i = t.directiveEnd;
                for (let s = t.directiveStart; s < i; s++) {
                    const o = n.data[s];
                    o.contentQueries && o.contentQueries(1, e[s], s)
                }
            }
        }

        function Dd(n, t, e) {
            !bg() || (function WI(n, t, e, r) {
                const i = e.directiveStart, s = e.directiveEnd;
                n.firstCreatePass || Ts(e, t), ct(r, t);
                const o = e.initialInputs;
                for (let a = i; a < s; a++) {
                    const l = n.data[a], c = un(l);
                    c && ZI(t, e, l);
                    const u = Is(t, n, a, e);
                    ct(u, t), null !== o && YI(0, a - i, u, l, 0, o), c && (kt(e.index, t)[8] = u)
                }
            }(n, t, e, Kt(e, t)), 128 == (128 & e.flags) && function GI(n, t, e) {
                const r = e.directiveStart, i = e.directiveEnd, s = e.index, o = function yM() {
                    return V.lFrame.currentDirectiveIndex
                }();
                try {
                    lr(s);
                    for (let a = r; a < i; a++) {
                        const l = n.data[a], c = t[a];
                        ru(a), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && V_(l, c)
                    }
                } finally {
                    lr(-1), ru(o)
                }
            }(n, t, e))
        }

        function wd(n, t, e = Kt) {
            const r = t.localNames;
            if (null !== r) {
                let i = t.index + 1;
                for (let s = 0; s < r.length; s += 2) {
                    const o = r[s + 1], a = -1 === o ? e(t, n) : n[o];
                    n[i++] = a
                }
            }
        }

        function P_(n) {
            const t = n.tView;
            return null === t || t.incompleteFirstPass ? n.tView = Cd(1, null, n.template, n.decls, n.vars, n.directiveDefs, n.pipeDefs, n.viewQuery, n.schemas, n.consts) : t
        }

        function Cd(n, t, e, r, i, s, o, a, l, c) {
            const u = 22 + r, d = u + i, h = function BI(n, t) {
                const e = [];
                for (let r = 0; r < t; r++) e.push(r < n ? null : H);
                return e
            }(u, d), f = "function" == typeof c ? c() : c;
            return h[1] = {
                type: n,
                blueprint: h,
                template: e,
                queries: null,
                viewQuery: a,
                declTNode: t,
                data: h.slice().fill(null, u),
                bindingStartIndex: u,
                expandoStartIndex: d,
                hostBindingOpCodes: null,
                firstCreatePass: !0,
                firstUpdatePass: !0,
                staticViewQueries: !1,
                staticContentQueries: !1,
                preOrderHooks: null,
                preOrderCheckHooks: null,
                contentHooks: null,
                contentCheckHooks: null,
                viewHooks: null,
                viewCheckHooks: null,
                destroyHooks: null,
                cleanup: null,
                contentQueries: null,
                components: null,
                directiveRegistry: "function" == typeof s ? s() : s,
                pipeRegistry: "function" == typeof o ? o() : o,
                firstChild: null,
                schemas: l,
                consts: f,
                incompleteFirstPass: !1
            }
        }

        function F_(n, t, e, r) {
            const i = G_(t);
            null === e ? i.push(r) : (i.push(e), n.firstCreatePass && q_(n).push(r, i.length - 1))
        }

        function N_(n, t, e) {
            for (let r in n) if (n.hasOwnProperty(r)) {
                const i = n[r];
                (e = null === e ? {} : e).hasOwnProperty(r) ? e[r].push(t, i) : e[r] = [t, i]
            }
            return e
        }

        function O_(n, t) {
            const r = t.directiveEnd, i = n.data, s = t.attrs, o = [];
            let a = null, l = null;
            for (let c = t.directiveStart; c < r; c++) {
                const u = i[c], d = u.inputs, h = null === s || s_(t) ? null : JI(d, s);
                o.push(h), a = N_(d, c, a), l = N_(u.outputs, c, l)
            }
            null !== a && (a.hasOwnProperty("class") && (t.flags |= 16), a.hasOwnProperty("style") && (t.flags |= 32)), t.initialInputs = o, t.inputs = a, t.outputs = l
        }

        function L_(n, t) {
            const e = kt(t, n);
            16 & e[2] || (e[2] |= 32)
        }

        function Ed(n, t, e, r) {
            let i = !1;
            if (bg()) {
                const s = function qI(n, t, e) {
                    const r = n.directiveRegistry;
                    let i = null;
                    if (r) for (let s = 0; s < r.length; s++) {
                        const o = r[s];
                        o_(e, o.selectors, !1) && (i || (i = []), pa(Ts(e, t), n, o.type), un(o) ? (j_(n, e), i.unshift(o)) : i.push(o))
                    }
                    return i
                }(n, t, e), o = null === r ? null : {"": -1};
                if (null !== s) {
                    i = !0, H_(e, n.data.length, s.length);
                    for (let u = 0; u < s.length; u++) {
                        const d = s[u];
                        d.providersResolver && d.providersResolver(d)
                    }
                    let a = !1, l = !1, c = xi(n, t, s.length, null);
                    for (let u = 0; u < s.length; u++) {
                        const d = s[u];
                        e.mergedAttrs = da(e.mergedAttrs, d.hostAttrs), U_(n, e, t, c, d), QI(c, d, o), null !== d.contentQueries && (e.flags |= 8), (null !== d.hostBindings || null !== d.hostAttrs || 0 !== d.hostVars) && (e.flags |= 128);
                        const h = d.type.prototype;
                        !a && (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) && ((n.preOrderHooks || (n.preOrderHooks = [])).push(e.index), a = !0), !l && (h.ngOnChanges || h.ngDoCheck) && ((n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e.index), l = !0), c++
                    }
                    O_(n, e)
                }
                o && function KI(n, t, e) {
                    if (t) {
                        const r = n.localNames = [];
                        for (let i = 0; i < t.length; i += 2) {
                            const s = e[t[i + 1]];
                            if (null == s) throw new D(-301, !1);
                            r.push(t[i], s)
                        }
                    }
                }(e, r, o)
            }
            return e.mergedAttrs = da(e.mergedAttrs, e.attrs), i
        }

        function B_(n, t, e, r, i, s) {
            const o = s.hostBindings;
            if (o) {
                let a = n.hostBindingOpCodes;
                null === a && (a = n.hostBindingOpCodes = []);
                const l = ~t.index;
                (function zI(n) {
                    let t = n.length;
                    for (; t > 0;) {
                        const e = n[--t];
                        if ("number" == typeof e && e < 0) return e
                    }
                    return 0
                })(a) != l && a.push(l), a.push(r, i, o)
            }
        }

        function V_(n, t) {
            null !== n.hostBindings && n.hostBindings(1, t)
        }

        function j_(n, t) {
            t.flags |= 2, (n.components || (n.components = [])).push(t.index)
        }

        function QI(n, t, e) {
            if (e) {
                if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) e[t.exportAs[r]] = n;
                un(t) && (e[""] = n)
            }
        }

        function H_(n, t, e) {
            n.flags |= 1, n.directiveStart = t, n.directiveEnd = t + e, n.providerIndexes = t
        }

        function U_(n, t, e, r, i) {
            n.data[r] = i;
            const s = i.factory || (i.factory = Or(i.type)), o = new Ms(s, un(i), m);
            n.blueprint[r] = o, e[r] = o, B_(n, t, 0, r, xi(n, e, i.hostVars, H), i)
        }

        function ZI(n, t, e) {
            const r = Kt(t, n), i = P_(e), s = n[10],
                o = La(n, Na(n, i, null, e.onPush ? 32 : 16, r, t, s, s.createRenderer(r, e), null, null, null));
            n[t.index] = o
        }

        function En(n, t, e, r, i, s) {
            const o = Kt(n, t);
            !function Md(n, t, e, r, i, s, o) {
                if (null == s) n.removeAttribute(t, i, e); else {
                    const a = null == o ? j(s) : o(s, r || "", i);
                    n.setAttribute(t, i, a, e)
                }
            }(t[z], o, s, n.value, e, r, i)
        }

        function YI(n, t, e, r, i, s) {
            const o = s[t];
            if (null !== o) {
                const a = r.setInput;
                for (let l = 0; l < o.length;) {
                    const c = o[l++], u = o[l++], d = o[l++];
                    null !== a ? r.setInput(e, d, c, u) : e[u] = d
                }
            }
        }

        function JI(n, t) {
            let e = null, r = 0;
            for (; r < t.length;) {
                const i = t[r];
                if (0 !== i) if (5 !== i) {
                    if ("number" == typeof i) break;
                    n.hasOwnProperty(i) && (null === e && (e = []), e.push(i, n[i], t[r + 1])), r += 2
                } else r += 2; else r += 4
            }
            return e
        }

        function $_(n, t, e, r) {
            return new Array(n, !0, !1, t, null, 0, r, e, null, null)
        }

        function tA(n, t) {
            const e = kt(t, n);
            if (sa(e)) {
                const r = e[1];
                48 & e[2] ? Gs(r, e, r.template, e[8]) : e[5] > 0 && Sd(e)
            }
        }

        function Sd(n) {
            for (let r = Ku(n); null !== r; r = Qu(r)) for (let i = 10; i < r.length; i++) {
                const s = r[i];
                if (sa(s)) if (512 & s[2]) {
                    const o = s[1];
                    Gs(o, s, o.template, s[8])
                } else s[5] > 0 && Sd(s)
            }
            const e = n[1].components;
            if (null !== e) for (let r = 0; r < e.length; r++) {
                const i = kt(e[r], n);
                sa(i) && i[5] > 0 && Sd(i)
            }
        }

        function nA(n, t) {
            const e = kt(t, n), r = e[1];
            (function rA(n, t) {
                for (let e = t.length; e < n.blueprint.length; e++) t.push(n.blueprint[e])
            })(r, e), Oa(r, e, e[8])
        }

        function La(n, t) {
            return n[13] ? n[14][4] = t : n[13] = t, n[14] = t, t
        }

        function Td(n) {
            for (; n;) {
                n[2] |= 32;
                const t = zs(n);
                if (Y0(n) && !t) return n;
                n = t
            }
            return null
        }

        function W_(n) {
            !function z_(n) {
                for (let t = 0; t < n.components.length; t++) {
                    const e = n.components[t], r = Wu(e);
                    if (null !== r) {
                        const i = r[1];
                        LI(i, r, i.template, e)
                    }
                }
            }(n[8])
        }

        function Ad(n, t, e) {
            su(0), t(n, e)
        }

        const sA = (() => Promise.resolve(null))();

        function G_(n) {
            return n[7] || (n[7] = [])
        }

        function q_(n) {
            return n.cleanup || (n.cleanup = [])
        }

        function Q_(n, t) {
            const e = n[9], r = e ? e.get(Si, null) : null;
            r && r.handleError(t)
        }

        function Rd(n, t, e, r, i) {
            for (let s = 0; s < e.length;) {
                const o = e[s++], a = e[s++], l = t[o], c = n.data[o];
                null !== c.setInput ? c.setInput(l, i, r, a) : l[a] = i
            }
        }

        function Ba(n, t, e) {
            let r = e ? n.styles : null, i = e ? n.classes : null, s = 0;
            if (null !== t) for (let o = 0; o < t.length; o++) {
                const a = t[o];
                "number" == typeof a ? s = a : 1 == s ? i = Vc(i, a) : 2 == s && (r = Vc(r, a + ": " + t[++o] + ";"))
            }
            e ? n.styles = r : n.stylesWithoutHost = r, e ? n.classes = i : n.classesWithoutHost = i
        }

        function Va(n, t, e, r, i = !1) {
            for (; null !== e;) {
                const s = t[e.index];
                if (null !== s && r.push(Le(s)), cn(s)) for (let a = 10; a < s.length; a++) {
                    const l = s[a], c = l[1].firstChild;
                    null !== c && Va(l[1], l, c, r)
                }
                const o = e.type;
                if (8 & o) Va(n, t, e.child, r); else if (32 & o) {
                    const a = qu(e, t);
                    let l;
                    for (; l = a();) r.push(l)
                } else if (16 & o) {
                    const a = Xm(t, e);
                    if (Array.isArray(a)) r.push(...a); else {
                        const l = zs(t[16]);
                        Va(l[1], l, a, r, !0)
                    }
                }
                e = i ? e.projectionNext : e.next
            }
            return r
        }

        class qs {
            constructor(t, e) {
                this._lView = t, this._cdRefInjectingView = e, this._appRef = null, this._attachedToViewContainer = !1
            }

            get rootNodes() {
                const t = this._lView, e = t[1];
                return Va(e, t, e.firstChild, [])
            }

            get context() {
                return this._lView[8]
            }

            set context(t) {
                this._lView[8] = t
            }

            get destroyed() {
                return 128 == (128 & this._lView[2])
            }

            destroy() {
                if (this._appRef) this._appRef.detachView(this); else if (this._attachedToViewContainer) {
                    const t = this._lView[3];
                    if (cn(t)) {
                        const e = t[8], r = e ? e.indexOf(this) : -1;
                        r > -1 && (Ju(t, r), ma(e, r))
                    }
                    this._attachedToViewContainer = !1
                }
                zm(this._lView[1], this._lView)
            }

            onDestroy(t) {
                F_(this._lView[1], this._lView, null, t)
            }

            markForCheck() {
                Td(this._cdRefInjectingView || this._lView)
            }

            detach() {
                this._lView[2] &= -65
            }

            reattach() {
                this._lView[2] |= 64
            }

            detectChanges() {
                !function Id(n, t, e) {
                    const r = t[10];
                    r.begin && r.begin();
                    try {
                        Gs(n, t, n.template, e)
                    } catch (i) {
                        throw Q_(t, i), i
                    } finally {
                        r.end && r.end()
                    }
                }(this._lView[1], this._lView, this.context)
            }

            checkNoChanges() {
            }

            attachToViewContainerRef() {
                if (this._appRef) throw new D(902, !1);
                this._attachedToViewContainer = !0
            }

            detachFromAppRef() {
                this._appRef = null, function BT(n, t) {
                    Ws(n, t, t[z], 2, null, null)
                }(this._lView[1], this._lView)
            }

            attachToAppRef(t) {
                if (this._attachedToViewContainer) throw new D(902, !1);
                this._appRef = t
            }
        }

        class oA extends qs {
            constructor(t) {
                super(t), this._view = t
            }

            detectChanges() {
                W_(this._view)
            }

            checkNoChanges() {
            }

            get context() {
                return null
            }
        }

        class xd extends Br {
            constructor(t) {
                super(), this.ngModule = t
            }

            resolveComponentFactory(t) {
                const e = ue(t);
                return new Ks(e, this.ngModule)
            }
        }

        function Z_(n) {
            const t = [];
            for (let e in n) n.hasOwnProperty(e) && t.push({propName: n[e], templateName: e});
            return t
        }

        class lA {
            constructor(t, e) {
                this.injector = t, this.parentInjector = e
            }

            get(t, e, r) {
                const i = this.injector.get(t, Ou, r);
                return i !== Ou || e === Ou ? i : this.parentInjector.get(t, e, r)
            }
        }

        class Ks extends Sm {
            constructor(t, e) {
                super(), this.componentDef = t, this.ngModule = e, this.componentType = t.type, this.selector = function iI(n) {
                    return n.map(rI).join(",")
                }(t.selectors), this.ngContentSelectors = t.ngContentSelectors ? t.ngContentSelectors : [], this.isBoundToModule = !!e
            }

            get inputs() {
                return Z_(this.componentDef.inputs)
            }

            get outputs() {
                return Z_(this.componentDef.outputs)
            }

            create(t, e, r, i) {
                let s = (i = i || this.ngModule) instanceof dr ? i : i?.injector;
                s && null !== this.componentDef.getStandaloneInjector && (s = this.componentDef.getStandaloneInjector(s) || s);
                const o = s ? new lA(t, s) : t, a = o.get(Us, null);
                if (null === a) throw new D(407, !1);
                const l = o.get(nT, null), c = a.createRenderer(null, this.componentDef),
                    u = this.componentDef.selectors[0][0] || "div", d = r ? function VI(n, t, e) {
                        return n.selectRootElement(t, e === an.ShadowDom)
                    }(c, r, this.componentDef.encapsulation) : Yu(a.createRenderer(null, this.componentDef), u, function aA(n) {
                        const t = n.toLowerCase();
                        return "svg" === t ? "svg" : "math" === t ? "math" : null
                    }(u)), h = this.componentDef.onPush ? 288 : 272, f = function fA(n, t) {
                        return {components: [], scheduler: n || ST, clean: sA, playerHandler: t || null, flags: 0}
                    }(), p = Cd(0, null, null, 1, 0, null, null, null, null, null),
                    g = Na(null, p, f, h, null, null, a, c, l, o, null);
                let _, y;
                ou(g);
                try {
                    const C = function dA(n, t, e, r, i, s) {
                        const o = e[1];
                        e[22] = n;
                        const l = Ri(o, 22, 2, "#host", null), c = l.mergedAttrs = t.hostAttrs;
                        null !== c && (Ba(l, c, !0), null !== n && (ua(i, n, c), null !== l.classes && rd(i, n, l.classes), null !== l.styles && n_(i, n, l.styles)));
                        const u = r.createRenderer(n, t),
                            d = Na(e, P_(t), null, t.onPush ? 32 : 16, e[22], l, r, u, s || null, null, null);
                        return o.firstCreatePass && (pa(Ts(l, e), o, t.type), j_(o, l), H_(l, e.length, 1)), La(e, d), e[22] = d
                    }(d, this.componentDef, g, a, c);
                    if (d) if (r) ua(c, d, ["ng-version", rT.full]); else {
                        const {attrs: v, classes: E} = function sI(n) {
                            const t = [], e = [];
                            let r = 1, i = 2;
                            for (; r < n.length;) {
                                let s = n[r];
                                if ("string" == typeof s) 2 === i ? "" !== s && t.push(s, n[++r]) : 8 === i && e.push(s); else {
                                    if (!dn(i)) break;
                                    i = s
                                }
                                r++
                            }
                            return {attrs: t, classes: e}
                        }(this.componentDef.selectors[0]);
                        v && ua(c, d, v), E && E.length > 0 && rd(c, d, E.join(" "))
                    }
                    if (y = Xc(p, 22), void 0 !== e) {
                        const v = y.projection = [];
                        for (let E = 0; E < this.ngContentSelectors.length; E++) {
                            const B = e[E];
                            v.push(null != B ? Array.from(B) : null)
                        }
                    }
                    _ = function hA(n, t, e, r, i) {
                        const s = e[1], o = function $I(n, t, e) {
                            const r = Ue();
                            n.firstCreatePass && (e.providersResolver && e.providersResolver(e), U_(n, r, t, xi(n, t, 1, null), e), O_(n, r));
                            const i = Is(t, n, r.directiveStart, r);
                            ct(i, t);
                            const s = Kt(r, t);
                            return s && ct(s, t), i
                        }(s, e, t);
                        if (r.components.push(o), n[8] = o, null !== i) for (const l of i) l(o, t);
                        if (t.contentQueries) {
                            const l = Ue();
                            t.contentQueries(1, o, l.directiveStart)
                        }
                        const a = Ue();
                        return !s.firstCreatePass || null === t.hostBindings && null === t.hostAttrs || (lr(a.index), B_(e[1], a, 0, a.directiveStart, a.directiveEnd, t), V_(t, o)), o
                    }(C, this.componentDef, g, f, [pA]), Oa(p, g, null)
                } finally {
                    au()
                }
                return new uA(this.componentType, _, Ei(y, g), g, y)
            }
        }

        class uA extends class ZS {
        } {
            constructor(t, e, r, i, s) {
                super(), this.location = r, this._rootLView = i, this._tNode = s, this.instance = e, this.hostView = this.changeDetectorRef = new oA(i), this.componentType = t
            }

            setInput(t, e) {
                const r = this._tNode.inputs;
                let i;
                if (null !== r && (i = r[t])) {
                    const s = this._rootLView;
                    Rd(s[1], s, i, t, e), L_(s, this._tNode.index)
                }
            }

            get injector() {
                return new fi(this._tNode, this._rootLView)
            }

            destroy() {
                this.hostView.destroy()
            }

            onDestroy(t) {
                this.hostView.onDestroy(t)
            }
        }

        function pA() {
            const n = Ue();
            aa(b()[1], n)
        }

        function ee(n) {
            let t = function Y_(n) {
                return Object.getPrototypeOf(n.prototype).constructor
            }(n.type), e = !0;
            const r = [n];
            for (; t;) {
                let i;
                if (un(n)) i = t.\u0275cmp || t.\u0275dir; else {
                    if (t.\u0275cmp) throw new D(903, !1);
                    i = t.\u0275dir
                }
                if (i) {
                    if (e) {
                        r.push(i);
                        const o = n;
                        o.inputs = kd(n.inputs), o.declaredInputs = kd(n.declaredInputs), o.outputs = kd(n.outputs);
                        const a = i.hostBindings;
                        a && yA(n, a);
                        const l = i.viewQuery, c = i.contentQueries;
                        if (l && mA(n, l), c && _A(n, c), Bc(n.inputs, i.inputs), Bc(n.declaredInputs, i.declaredInputs), Bc(n.outputs, i.outputs), un(i) && i.data.animation) {
                            const u = n.data;
                            u.animation = (u.animation || []).concat(i.data.animation)
                        }
                    }
                    const s = i.features;
                    if (s) for (let o = 0; o < s.length; o++) {
                        const a = s[o];
                        a && a.ngInherit && a(n), a === ee && (e = !1)
                    }
                }
                t = Object.getPrototypeOf(t)
            }
            !function gA(n) {
                let t = 0, e = null;
                for (let r = n.length - 1; r >= 0; r--) {
                    const i = n[r];
                    i.hostVars = t += i.hostVars, i.hostAttrs = da(i.hostAttrs, e = da(e, i.hostAttrs))
                }
            }(r)
        }

        function kd(n) {
            return n === ii ? {} : n === le ? [] : n
        }

        function mA(n, t) {
            const e = n.viewQuery;
            n.viewQuery = e ? (r, i) => {
                t(r, i), e(r, i)
            } : t
        }

        function _A(n, t) {
            const e = n.contentQueries;
            n.contentQueries = e ? (r, i, s) => {
                t(r, i, s), e(r, i, s)
            } : t
        }

        function yA(n, t) {
            const e = n.hostBindings;
            n.hostBindings = e ? (r, i) => {
                t(r, i), e(r, i)
            } : t
        }

        let ja = null;

        function jr() {
            if (!ja) {
                const n = de.Symbol;
                if (n && n.iterator) ja = n.iterator; else {
                    const t = Object.getOwnPropertyNames(Map.prototype);
                    for (let e = 0; e < t.length; ++e) {
                        const r = t[e];
                        "entries" !== r && "size" !== r && Map.prototype[r] === Map.prototype.entries && (ja = r)
                    }
                }
            }
            return ja
        }

        function Qs(n) {
            return !!Pd(n) && (Array.isArray(n) || !(n instanceof Map) && jr() in n)
        }

        function Pd(n) {
            return null !== n && ("function" == typeof n || "object" == typeof n)
        }

        function Mn(n, t, e) {
            return n[t] = e
        }

        function ut(n, t, e) {
            return !Object.is(n[t], e) && (n[t] = e, !0)
        }

        function ki(n, t, e, r) {
            const i = b();
            return ut(i, ui(), t) && (X(), En(xe(), i, n, t, e, r)), ki
        }

        function De(n, t, e, r, i, s, o, a) {
            const l = b(), c = X(), u = n + 22, d = c.firstCreatePass ? function TA(n, t, e, r, i, s, o, a, l) {
                const c = t.consts, u = Ri(t, n, 4, o || null, sr(c, a));
                Ed(t, e, u, sr(c, l)), aa(t, u);
                const d = u.tViews = Cd(2, u, r, i, s, t.directiveRegistry, t.pipeRegistry, null, t.schemas, c);
                return null !== t.queries && (t.queries.template(t, u), d.queries = t.queries.embeddedTView(u)), u
            }(u, c, l, t, e, r, i, s, o) : c.data[u];
            Dn(d, !1);
            const h = l[z].createComment("");
            Aa(c, l, h, d), ct(h, l), La(l, l[u] = $_(h, l, h, d)), ra(d) && Dd(c, l, d), null != o && wd(l, d, a)
        }

        function Fd(n) {
            return function ci(n, t) {
                return n[t]
            }(function gM() {
                return V.lFrame.contextLView
            }(), 22 + n)
        }

        function ke(n, t, e) {
            const r = b();
            return ut(r, ui(), t) && function Nt(n, t, e, r, i, s, o, a) {
                const l = Kt(t, e);
                let u, c = t.inputs;
                !a && null != c && (u = c[r]) ? (Rd(n, e, u, r, i), na(t) && L_(e, t.index)) : 3 & t.type && (r = function HI(n) {
                    return "class" === n ? "className" : "for" === n ? "htmlFor" : "formaction" === n ? "formAction" : "innerHtml" === n ? "innerHTML" : "readonly" === n ? "readOnly" : "tabindex" === n ? "tabIndex" : n
                }(r), i = null != o ? o(i, t.value || "", r) : i, s.setProperty(l, r, i))
            }(X(), xe(), r, n, t, r[z], e, !1), ke
        }

        function Nd(n, t, e, r, i) {
            const o = i ? "class" : "style";
            Rd(n, e, t.inputs[o], o, r)
        }

        function Q(n, t, e, r) {
            const i = b(), s = X(), o = 22 + n, a = i[z], l = i[o] = Yu(a, t, function SM() {
                return V.lFrame.currentNamespace
            }()), c = s.firstCreatePass ? function AA(n, t, e, r, i, s, o) {
                const a = t.consts, c = Ri(t, n, 2, i, sr(a, s));
                return Ed(t, e, c, sr(a, o)), null !== c.attrs && Ba(c, c.attrs, !1), null !== c.mergedAttrs && Ba(c, c.mergedAttrs, !0), null !== t.queries && t.queries.elementStart(t, c), c
            }(o, s, i, 0, t, e, r) : s.data[o];
            Dn(c, !0);
            const u = c.mergedAttrs;
            null !== u && ua(a, l, u);
            const d = c.classes;
            null !== d && rd(a, l, d);
            const h = c.styles;
            return null !== h && n_(a, l, h), 64 != (64 & c.flags) && Aa(s, i, l, c), 0 === function uM() {
                return V.lFrame.elementDepthCount
            }() && ct(l, i), function dM() {
                V.lFrame.elementDepthCount++
            }(), ra(c) && (Dd(s, i, c), k_(s, c, i)), null !== r && wd(i, c), Q
        }

        function te() {
            let n = Ue();
            tu() ? nu() : (n = n.parent, Dn(n, !1));
            const t = n;
            !function hM() {
                V.lFrame.elementDepthCount--
            }();
            const e = X();
            return e.firstCreatePass && (aa(e, n), Kc(n) && e.queries.elementEnd(n)), null != t.classesWithoutHost && function xM(n) {
                return 0 != (16 & n.flags)
            }(t) && Nd(e, t, b(), t.classesWithoutHost, !0), null != t.stylesWithoutHost && function kM(n) {
                return 0 != (32 & n.flags)
            }(t) && Nd(e, t, b(), t.stylesWithoutHost, !1), te
        }

        function pr(n, t, e, r) {
            return Q(n, t, e, r), te(), pr
        }

        function gr(n, t, e) {
            const r = b(), i = X(), s = n + 22, o = i.firstCreatePass ? function RA(n, t, e, r, i) {
                const s = t.consts, o = sr(s, r), a = Ri(t, n, 8, "ng-container", o);
                return null !== o && Ba(a, o, !0), Ed(t, e, a, sr(s, i)), null !== t.queries && t.queries.elementStart(t, a), a
            }(s, i, r, t, e) : i.data[s];
            Dn(o, !0);
            const a = r[s] = r[z].createComment("");
            return Aa(i, r, a, o), ct(a, r), ra(o) && (Dd(i, r, o), k_(i, o, r)), null != e && wd(r, o), gr
        }

        function mr() {
            let n = Ue();
            const t = X();
            return tu() ? nu() : (n = n.parent, Dn(n, !1)), t.firstCreatePass && (aa(t, n), Kc(n) && t.queries.elementEnd(n)), mr
        }

        function Sn(n, t, e) {
            return gr(n, t, e), mr(), Sn
        }

        function Ui() {
            return b()
        }

        function Ua(n) {
            return !!n && "function" == typeof n.then
        }

        const ly = function ay(n) {
            return !!n && "function" == typeof n.subscribe
        };

        function Xe(n, t, e, r) {
            const i = b(), s = X(), o = Ue();
            return function uy(n, t, e, r, i, s, o, a) {
                const l = ra(r), u = n.firstCreatePass && q_(n), d = t[8], h = G_(t);
                let f = !0;
                if (3 & r.type || a) {
                    const _ = Kt(r, t), y = a ? a(_) : _, C = h.length, v = a ? B => a(Le(B[r.index])) : r.index;
                    let E = null;
                    if (!a && l && (E = function xA(n, t, e, r) {
                        const i = n.cleanup;
                        if (null != i) for (let s = 0; s < i.length - 1; s += 2) {
                            const o = i[s];
                            if (o === e && i[s + 1] === r) {
                                const a = t[7], l = i[s + 2];
                                return a.length > l ? a[l] : null
                            }
                            "string" == typeof o && (s += 2)
                        }
                        return null
                    }(n, t, i, r.index)), null !== E) (E.__ngLastListenerFn__ || E).__ngNextListenerFn__ = s, E.__ngLastListenerFn__ = s, f = !1; else {
                        s = hy(r, t, d, s, !1);
                        const B = e.listen(y, i, s);
                        h.push(s, B), u && u.push(i, v, C, C + 1)
                    }
                } else s = hy(r, t, d, s, !1);
                const p = r.outputs;
                let g;
                if (f && null !== p && (g = p[i])) {
                    const _ = g.length;
                    if (_) for (let y = 0; y < _; y += 2) {
                        const Y = t[g[y]][g[y + 1]].subscribe(s), Te = h.length;
                        h.push(s, Y), u && u.push(i, r.index, Te, -(Te + 1))
                    }
                }
            }(s, i, i[z], o, n, t, 0, r), Xe
        }

        function dy(n, t, e, r) {
            try {
                return !1 !== e(r)
            } catch (i) {
                return Q_(n, i), !1
            }
        }

        function hy(n, t, e, r, i) {
            return function s(o) {
                if (o === Function) return r;
                Td(2 & n.flags ? kt(n.index, t) : t);
                let l = dy(t, 0, r, o), c = s.__ngNextListenerFn__;
                for (; c;) l = dy(t, 0, c, o) && l, c = c.__ngNextListenerFn__;
                return i && !1 === l && (o.preventDefault(), o.returnValue = !1), l
            }
        }

        function ze(n = 1) {
            return function bM(n) {
                return (V.lFrame.contextLView = function DM(n, t) {
                    for (; n > 0;) t = t[15], n--;
                    return t
                }(n, V.lFrame.contextLView))[8]
            }(n)
        }

        function kA(n, t) {
            let e = null;
            const r = function XT(n) {
                const t = n.attrs;
                if (null != t) {
                    const e = t.indexOf(5);
                    if (0 == (1 & e)) return t[e + 1]
                }
                return null
            }(n);
            for (let i = 0; i < t.length; i++) {
                const s = t[i];
                if ("*" !== s) {
                    if (null === r ? o_(n, s, !0) : nI(r, s)) return i
                } else e = i
            }
            return e
        }

        function Ys(n) {
            const t = b()[16][6];
            if (!t.projection) {
                const r = t.projection = xs(n ? n.length : 1, null), i = r.slice();
                let s = t.child;
                for (; null !== s;) {
                    const o = n ? kA(s, n) : 0;
                    null !== o && (i[o] ? i[o].projectionNext = s : r[o] = s, i[o] = s), s = s.next
                }
            }
        }

        function Ur(n, t = 0, e) {
            const r = b(), i = X(), s = Ri(i, 22 + n, 16, null, e || null);
            null === s.projection && (s.projection = t), nu(), 64 != (64 & s.flags) && function GT(n, t, e) {
                t_(t[z], 0, t, e, Wm(n, e, t), Qm(e.parent || t[6], e, t))
            }(i, r, s)
        }

        function wy(n, t, e, r, i) {
            const s = n[e + 1], o = null === t;
            let a = r ? hn(s) : Un(s), l = !1;
            for (; 0 !== a && (!1 === l || o);) {
                const u = n[a + 1];
                NA(n[a], t) && (l = !0, n[a + 1] = r ? dd(u) : cd(u)), a = r ? hn(u) : Un(u)
            }
            l && (n[e + 1] = r ? cd(s) : dd(s))
        }

        function NA(n, t) {
            return null === n || null == t || (Array.isArray(n) ? n[1] : n) === t || !(!Array.isArray(n) || "string" != typeof t) && vi(n, t) >= 0
        }

        function rt(n, t) {
            return function fn(n, t, e, r) {
                const i = b(), s = X(), o = function Vn(n) {
                    const t = V.lFrame, e = t.bindingIndex;
                    return t.bindingIndex = t.bindingIndex + n, e
                }(2);
                s.firstUpdatePass && function Ry(n, t, e, r) {
                    const i = n.data;
                    if (null === i[e + 1]) {
                        const s = i[gt()], o = function Ay(n, t) {
                            return t >= n.expandoStartIndex
                        }(n, e);
                        (function Fy(n, t) {
                            return 0 != (n.flags & (t ? 16 : 32))
                        })(s, r) && null === t && !o && (t = !1), t = function zA(n, t, e, r) {
                            const i = function iu(n) {
                                const t = V.lFrame.currentDirectiveIndex;
                                return -1 === t ? null : n[t]
                            }(n);
                            let s = r ? t.residualClasses : t.residualStyles;
                            if (null === i) 0 === (r ? t.classBindings : t.styleBindings) && (e = Js(e = Ld(null, n, t, e, r), t.attrs, r), s = null); else {
                                const o = t.directiveStylingLast;
                                if (-1 === o || n[o] !== i) if (e = Ld(i, n, t, e, r), null === s) {
                                    let l = function WA(n, t, e) {
                                        const r = e ? t.classBindings : t.styleBindings;
                                        if (0 !== Un(r)) return n[hn(r)]
                                    }(n, t, r);
                                    void 0 !== l && Array.isArray(l) && (l = Ld(null, n, t, l[1], r), l = Js(l, t.attrs, r), function GA(n, t, e, r) {
                                        n[hn(e ? t.classBindings : t.styleBindings)] = r
                                    }(n, t, r, l))
                                } else s = function qA(n, t, e) {
                                    let r;
                                    const i = t.directiveEnd;
                                    for (let s = 1 + t.directiveStylingLast; s < i; s++) r = Js(r, n[s].hostAttrs, e);
                                    return Js(r, t.attrs, e)
                                }(n, t, r)
                            }
                            return void 0 !== s && (r ? t.residualClasses = s : t.residualStyles = s), e
                        }(i, s, t, r), function PA(n, t, e, r, i, s) {
                            let o = s ? t.classBindings : t.styleBindings, a = hn(o), l = Un(o);
                            n[r] = e;
                            let u, c = !1;
                            if (Array.isArray(e)) {
                                const d = e;
                                u = d[1], (null === u || vi(d, u) > 0) && (c = !0)
                            } else u = e;
                            if (i) if (0 !== l) {
                                const h = hn(n[a + 1]);
                                n[r + 1] = ka(h, a), 0 !== h && (n[h + 1] = ud(n[h + 1], r)), n[a + 1] = function EI(n, t) {
                                    return 131071 & n | t << 17
                                }(n[a + 1], r)
                            } else n[r + 1] = ka(a, 0), 0 !== a && (n[a + 1] = ud(n[a + 1], r)), a = r; else n[r + 1] = ka(l, 0), 0 === a ? a = r : n[l + 1] = ud(n[l + 1], r), l = r;
                            c && (n[r + 1] = cd(n[r + 1])), wy(n, u, r, !0), wy(n, u, r, !1), function FA(n, t, e, r, i) {
                                const s = i ? n.residualClasses : n.residualStyles;
                                null != s && "string" == typeof t && vi(s, t) >= 0 && (e[r + 1] = dd(e[r + 1]))
                            }(t, u, n, r, s), o = ka(a, l), s ? t.classBindings = o : t.styleBindings = o
                        }(i, s, t, e, o, r)
                    }
                }(s, n, o, r), t !== H && ut(i, o, t) && function ky(n, t, e, r, i, s, o, a) {
                    if (!(3 & t.type)) return;
                    const l = n.data, c = l[a + 1];
                    $a(function w_(n) {
                        return 1 == (1 & n)
                    }(c) ? Py(l, t, e, i, Un(c), o) : void 0) || ($a(s) || function D_(n) {
                        return 2 == (2 & n)
                    }(c) && (s = Py(l, null, e, i, a, o)), function KT(n, t, e, r, i) {
                        if (t) i ? n.addClass(e, r) : n.removeClass(e, r); else {
                            let s = -1 === r.indexOf("-") ? void 0 : Mt.DashCase;
                            null == i ? n.removeStyle(e, r, s) : ("string" == typeof i && i.endsWith("!important") && (i = i.slice(0, -10), s |= Mt.Important), n.setStyle(e, r, i, s))
                        }
                    }(r, o, ia(gt(), e), i, s))
                }(s, s.data[gt()], i, i[z], n, i[o + 1] = function ZA(n, t) {
                    return null == n || ("string" == typeof t ? n += t : "object" == typeof n && (n = ge(function ur(n) {
                        return n instanceof class lm {
                            constructor(t) {
                                this.changingThisBreaksApplicationSecurity = t
                            }

                            toString() {
                                return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`
                            }
                        } ? n.changingThisBreaksApplicationSecurity : n
                    }(n)))), n
                }(t, e), r, o)
            }(n, t, null, !0), rt
        }

        function Ld(n, t, e, r, i) {
            let s = null;
            const o = e.directiveEnd;
            let a = e.directiveStylingLast;
            for (-1 === a ? a = e.directiveStart : a++; a < o && (s = t[a], r = Js(r, s.hostAttrs, i), s !== n);) a++;
            return null !== n && (e.directiveStylingLast = a), r
        }

        function Js(n, t, e) {
            const r = e ? 1 : 2;
            let i = -1;
            if (null !== t) for (let s = 0; s < t.length; s++) {
                const o = t[s];
                "number" == typeof o ? i = o : i === r && (Array.isArray(n) || (n = void 0 === n ? [] : ["", n]), Ft(n, o, !!e || t[++s]))
            }
            return void 0 === n ? null : n
        }

        function Py(n, t, e, r, i, s) {
            const o = null === t;
            let a;
            for (; i > 0;) {
                const l = n[i], c = Array.isArray(l), u = c ? l[1] : l, d = null === u;
                let h = e[i + 1];
                h === H && (h = d ? le : void 0);
                let f = d ? mu(h, r) : u === r ? h : void 0;
                if (c && !$a(f) && (f = mu(l, r)), $a(f) && (a = f, o)) return a;
                const p = n[i + 1];
                i = o ? hn(p) : Un(p)
            }
            if (null !== t) {
                let l = s ? t.residualClasses : t.residualStyles;
                null != l && (a = mu(l, r))
            }
            return a
        }

        function $a(n) {
            return void 0 !== n
        }

        function it(n, t = "") {
            const e = b(), r = X(), i = n + 22, s = r.firstCreatePass ? Ri(r, i, 1, t, null) : r.data[i],
                o = e[i] = function Zu(n, t) {
                    return n.createText(t)
                }(e[z], t);
            Aa(r, e, o, s), Dn(s, !1)
        }

        function Bd(n) {
            return St("", n, ""), Bd
        }

        function St(n, t, e) {
            const r = b(), i = function Fi(n, t, e, r) {
                return ut(n, ui(), e) ? t + j(e) + r : H
            }(r, n, t, e);
            return i !== H && function $n(n, t, e) {
                const r = ia(t, n);
                !function Um(n, t, e) {
                    n.setValue(t, e)
                }(n[z], r, e)
            }(r, gt(), i), St
        }

        const Gi = "en-US";
        let nv = Gi;

        function Hd(n, t, e, r, i) {
            if (n = L(n), Array.isArray(n)) for (let s = 0; s < n.length; s++) Hd(n[s], t, e, r, i); else {
                const s = X(), o = b();
                let a = Lr(n) ? n : L(n.provide), l = Mm(n);
                const c = Ue(), u = 1048575 & c.providerIndexes, d = c.directiveStart, h = c.providerIndexes >> 20;
                if (Lr(n) || !n.multi) {
                    const f = new Ms(l, i, m), p = $d(a, t, i ? u : u + h, d);
                    -1 === p ? (pa(Ts(c, o), s, a), Ud(s, n, t.length), t.push(a), c.directiveStart++, c.directiveEnd++, i && (c.providerIndexes += 1048576), e.push(f), o.push(f)) : (e[p] = f, o[p] = f)
                } else {
                    const f = $d(a, t, u + h, d), p = $d(a, t, u, u + h), g = f >= 0 && e[f], _ = p >= 0 && e[p];
                    if (i && !_ || !i && !g) {
                        pa(Ts(c, o), s, a);
                        const y = function px(n, t, e, r, i) {
                            const s = new Ms(n, e, m);
                            return s.multi = [], s.index = t, s.componentProviders = 0, Tv(s, i, r && !e), s
                        }(i ? fx : hx, e.length, i, r, l);
                        !i && _ && (e[p].providerFactory = y), Ud(s, n, t.length, 0), t.push(a), c.directiveStart++, c.directiveEnd++, i && (c.providerIndexes += 1048576), e.push(y), o.push(y)
                    } else Ud(s, n, f > -1 ? f : p, Tv(e[i ? p : f], l, !i && r));
                    !i && r && _ && e[p].componentProviders++
                }
            }
        }

        function Ud(n, t, e, r) {
            const i = Lr(t), s = function US(n) {
                return !!n.useClass
            }(t);
            if (i || s) {
                const l = (s ? L(t.useClass) : t).prototype.ngOnDestroy;
                if (l) {
                    const c = n.destroyHooks || (n.destroyHooks = []);
                    if (!i && t.multi) {
                        const u = c.indexOf(e);
                        -1 === u ? c.push(e, [r, l]) : c[u + 1].push(r, l)
                    } else c.push(e, l)
                }
            }
        }

        function Tv(n, t, e) {
            return e && n.componentProviders++, n.multi.push(t) - 1
        }

        function $d(n, t, e, r) {
            for (let i = e; i < r; i++) if (t[i] === n) return i;
            return -1
        }

        function hx(n, t, e, r) {
            return zd(this.multi, [])
        }

        function fx(n, t, e, r) {
            const i = this.multi;
            let s;
            if (this.providerFactory) {
                const o = this.providerFactory.componentProviders, a = Is(e, e[1], this.providerFactory.index, r);
                s = a.slice(0, o), zd(i, s);
                for (let l = o; l < a.length; l++) s.push(a[l])
            } else s = [], zd(i, s);
            return s
        }

        function zd(n, t) {
            for (let e = 0; e < n.length; e++) t.push((0, n[e])());
            return t
        }

        function Ge(n, t = []) {
            return e => {
                e.providersResolver = (r, i) => function dx(n, t, e) {
                    const r = X();
                    if (r.firstCreatePass) {
                        const i = un(n);
                        Hd(e, r.data, r.blueprint, i, !0), Hd(t, r.data, r.blueprint, i, !1)
                    }
                }(r, i ? i(n) : n, t)
            }
        }

        class zr {
        }

        class Iv {
        }

        class Av extends zr {
            constructor(t, e) {
                super(), this._parent = e, this._bootstrapComponents = [], this.destroyCbs = [], this.componentFactoryResolver = new xd(this);
                const r = Rt(t);
                this._bootstrapComponents = Hn(r.bootstrap), this._r3Injector = f_(t, e, [{
                    provide: zr,
                    useValue: this
                }, {
                    provide: Br,
                    useValue: this.componentFactoryResolver
                }], ge(t), new Set(["environment"])), this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(t)
            }

            get injector() {
                return this._r3Injector
            }

            destroy() {
                const t = this._r3Injector;
                !t.destroyed && t.destroy(), this.destroyCbs.forEach(e => e()), this.destroyCbs = null
            }

            onDestroy(t) {
                this.destroyCbs.push(t)
            }
        }

        class Wd extends Iv {
            constructor(t) {
                super(), this.moduleType = t
            }

            create(t) {
                return new Av(this.moduleType, t)
            }
        }

        class mx extends zr {
            constructor(t, e, r) {
                super(), this.componentFactoryResolver = new xd(this), this.instance = null;
                const i = new Em([...t, {provide: zr, useValue: this}, {
                    provide: Br,
                    useValue: this.componentFactoryResolver
                }], e || Sa(), r, new Set(["environment"]));
                this.injector = i, i.resolveInjectorInitializers()
            }

            destroy() {
                this.injector.destroy()
            }

            onDestroy(t) {
                this.injector.onDestroy(t)
            }
        }

        function Ka(n, t, e = null) {
            return new mx(n, t, e).injector
        }

        function Ov(n, t, e, r) {
            return function Bv(n, t, e, r, i, s) {
                const o = t + e;
                return ut(n, o, i) ? Mn(n, o + 1, s ? r.call(s, i) : r(i)) : ro(n, o + 1)
            }(b(), pt(), n, t, e, r)
        }

        function Lv(n, t, e, r, i) {
            return function Vv(n, t, e, r, i, s, o) {
                const a = t + e;
                return function Hr(n, t, e, r) {
                    const i = ut(n, t, e);
                    return ut(n, t + 1, r) || i
                }(n, a, i, s) ? Mn(n, a + 2, o ? r.call(o, i, s) : r(i, s)) : ro(n, a + 2)
            }(b(), pt(), n, t, e, r, i)
        }

        function ro(n, t) {
            const e = n[t];
            return e === H ? void 0 : e
        }

        function qd(n) {
            return t => {
                setTimeout(n, void 0, t)
            }
        }

        const ie = class Ux extends ve {
            constructor(t = !1) {
                super(), this.__isAsync = t
            }

            emit(t) {
                super.next(t)
            }

            subscribe(t, e, r) {
                let i = t, s = e || (() => null), o = r;
                if (t && "object" == typeof t) {
                    const l = t;
                    i = l.next?.bind(l), s = l.error?.bind(l), o = l.complete?.bind(l)
                }
                this.__isAsync && (s = qd(s), i && (i = qd(i)), o && (o = qd(o)));
                const a = super.subscribe({next: i, error: s, complete: o});
                return t instanceof Ne && t.add(a), a
            }
        };

        function $x() {
            return this._results[jr()]()
        }

        class Ki {
            constructor(t = !1) {
                this._emitDistinctChangesOnly = t, this.dirty = !0, this._results = [], this._changesDetected = !1, this._changes = null, this.length = 0, this.first = void 0, this.last = void 0;
                const e = jr(), r = Ki.prototype;
                r[e] || (r[e] = $x)
            }

            get changes() {
                return this._changes || (this._changes = new ie)
            }

            get(t) {
                return this._results[t]
            }

            map(t) {
                return this._results.map(t)
            }

            filter(t) {
                return this._results.filter(t)
            }

            find(t) {
                return this._results.find(t)
            }

            reduce(t, e) {
                return this._results.reduce(t, e)
            }

            forEach(t) {
                this._results.forEach(t)
            }

            some(t) {
                return this._results.some(t)
            }

            toArray() {
                return this._results.slice()
            }

            toString() {
                return this._results.toString()
            }

            reset(t, e) {
                const r = this;
                r.dirty = !1;
                const i = Pt(t);
                (this._changesDetected = !function UM(n, t, e) {
                    if (n.length !== t.length) return !1;
                    for (let r = 0; r < n.length; r++) {
                        let i = n[r], s = t[r];
                        if (e && (i = e(i), s = e(s)), s !== i) return !1
                    }
                    return !0
                }(r._results, i, e)) && (r._results = i, r.length = i.length, r.last = i[this.length - 1], r.first = i[0])
            }

            notifyOnChanges() {
                this._changes && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.emit(this)
            }

            setDirty() {
                this.dirty = !0
            }

            destroy() {
                this.changes.complete(), this.changes.unsubscribe()
            }
        }

        let qe = (() => {
            class n {
            }

            return n.__NG_ELEMENT_ID__ = Gx, n
        })();
        const zx = qe, Wx = class extends zx {
            constructor(t, e, r) {
                super(), this._declarationLView = t, this._declarationTContainer = e, this.elementRef = r
            }

            createEmbeddedView(t, e) {
                const r = this._declarationTContainer.tViews,
                    i = Na(this._declarationLView, r, t, 16, null, r.declTNode, null, null, null, null, e || null);
                i[17] = this._declarationLView[this._declarationTContainer.index];
                const o = this._declarationLView[19];
                return null !== o && (i[19] = o.createEmbeddedView(r)), Oa(r, i, t), new qs(i)
            }
        };

        function Gx() {
            return Qa(Ue(), b())
        }

        function Qa(n, t) {
            return 4 & n.type ? new Wx(t, n, Ei(n, t)) : null
        }

        let Ke = (() => {
            class n {
            }

            return n.__NG_ELEMENT_ID__ = qx, n
        })();

        function qx() {
            return Wv(Ue(), b())
        }

        const Kx = Ke, $v = class extends Kx {
            constructor(t, e, r) {
                super(), this._lContainer = t, this._hostTNode = e, this._hostLView = r
            }

            get element() {
                return Ei(this._hostTNode, this._hostLView)
            }

            get injector() {
                return new fi(this._hostTNode, this._hostLView)
            }

            get parentInjector() {
                const t = fa(this._hostTNode, this._hostLView);
                if (Fg(t)) {
                    const e = hi(t, this._hostLView), r = di(t);
                    return new fi(e[1].data[r + 8], e)
                }
                return new fi(null, this._hostLView)
            }

            clear() {
                for (; this.length > 0;) this.remove(this.length - 1)
            }

            get(t) {
                const e = zv(this._lContainer);
                return null !== e && e[t] || null
            }

            get length() {
                return this._lContainer.length - 10
            }

            createEmbeddedView(t, e, r) {
                let i, s;
                "number" == typeof r ? i = r : null != r && (i = r.index, s = r.injector);
                const o = t.createEmbeddedView(e || {}, s);
                return this.insert(o, i), o
            }

            createComponent(t, e, r, i, s) {
                const o = t && !function Rs(n) {
                    return "function" == typeof n
                }(t);
                let a;
                if (o) a = e; else {
                    const d = e || {};
                    a = d.index, r = d.injector, i = d.projectableNodes, s = d.environmentInjector || d.ngModuleRef
                }
                const l = o ? t : new Ks(ue(t)), c = r || this.parentInjector;
                if (!s && null == l.ngModule) {
                    const h = (o ? c : this.parentInjector).get(dr, null);
                    h && (s = h)
                }
                const u = l.create(c, i, void 0, s);
                return this.insert(u.hostView, a), u
            }

            insert(t, e) {
                const r = t._lView, i = r[1];
                if (function cM(n) {
                    return cn(n[3])
                }(r)) {
                    const u = this.indexOf(t);
                    if (-1 !== u) this.detach(u); else {
                        const d = r[3], h = new $v(d, d[6], d[3]);
                        h.detach(h.indexOf(t))
                    }
                }
                const s = this._adjustIndex(e), o = this._lContainer;
                !function jT(n, t, e, r) {
                    const i = 10 + r, s = e.length;
                    r > 0 && (e[i - 1][4] = t), r < s - 10 ? (t[4] = e[i], Wg(e, 10 + r, t)) : (e.push(t), t[4] = null), t[3] = e;
                    const o = t[17];
                    null !== o && e !== o && function HT(n, t) {
                        const e = n[9];
                        t[16] !== t[3][3][16] && (n[2] = !0), null === e ? n[9] = [t] : e.push(t)
                    }(o, t);
                    const a = t[19];
                    null !== a && a.insertView(n), t[2] |= 64
                }(i, r, o, s);
                const a = td(s, o), l = r[z], c = Ia(l, o[7]);
                return null !== c && function LT(n, t, e, r, i, s) {
                    r[0] = i, r[6] = t, Ws(n, r, e, 1, i, s)
                }(i, o[6], l, r, c, a), t.attachToViewContainerRef(), Wg(Kd(o), s, t), t
            }

            move(t, e) {
                return this.insert(t, e)
            }

            indexOf(t) {
                const e = zv(this._lContainer);
                return null !== e ? e.indexOf(t) : -1
            }

            remove(t) {
                const e = this._adjustIndex(t, -1), r = Ju(this._lContainer, e);
                r && (ma(Kd(this._lContainer), e), zm(r[1], r))
            }

            detach(t) {
                const e = this._adjustIndex(t, -1), r = Ju(this._lContainer, e);
                return r && null != ma(Kd(this._lContainer), e) ? new qs(r) : null
            }

            _adjustIndex(t, e = 0) {
                return t ?? this.length + e
            }
        };

        function zv(n) {
            return n[8]
        }

        function Kd(n) {
            return n[8] || (n[8] = [])
        }

        function Wv(n, t) {
            let e;
            const r = t[n.index];
            if (cn(r)) e = r; else {
                let i;
                if (8 & n.type) i = Le(r); else {
                    const s = t[z];
                    i = s.createComment("");
                    const o = Kt(n, t);
                    Vr(s, Ia(s, o), i, function WT(n, t) {
                        return n.nextSibling(t)
                    }(s, o), !1)
                }
                t[n.index] = e = $_(r, t, i, n), La(t, e)
            }
            return new $v(e, n, t)
        }

        class Qd {
            constructor(t) {
                this.queryList = t, this.matches = null
            }

            clone() {
                return new Qd(this.queryList)
            }

            setDirty() {
                this.queryList.setDirty()
            }
        }

        class Zd {
            constructor(t = []) {
                this.queries = t
            }

            createEmbeddedView(t) {
                const e = t.queries;
                if (null !== e) {
                    const r = null !== t.contentQueries ? t.contentQueries[0] : e.length, i = [];
                    for (let s = 0; s < r; s++) {
                        const o = e.getByIndex(s);
                        i.push(this.queries[o.indexInDeclarationView].clone())
                    }
                    return new Zd(i)
                }
                return null
            }

            insertView(t) {
                this.dirtyQueriesWithMatches(t)
            }

            detachView(t) {
                this.dirtyQueriesWithMatches(t)
            }

            dirtyQueriesWithMatches(t) {
                for (let e = 0; e < this.queries.length; e++) null !== Zv(t, e).matches && this.queries[e].setDirty()
            }
        }

        class Gv {
            constructor(t, e, r = null) {
                this.predicate = t, this.flags = e, this.read = r
            }
        }

        class Yd {
            constructor(t = []) {
                this.queries = t
            }

            elementStart(t, e) {
                for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(t, e)
            }

            elementEnd(t) {
                for (let e = 0; e < this.queries.length; e++) this.queries[e].elementEnd(t)
            }

            embeddedTView(t) {
                let e = null;
                for (let r = 0; r < this.length; r++) {
                    const i = null !== e ? e.length : 0, s = this.getByIndex(r).embeddedTView(t, i);
                    s && (s.indexInDeclarationView = r, null !== e ? e.push(s) : e = [s])
                }
                return null !== e ? new Yd(e) : null
            }

            template(t, e) {
                for (let r = 0; r < this.queries.length; r++) this.queries[r].template(t, e)
            }

            getByIndex(t) {
                return this.queries[t]
            }

            get length() {
                return this.queries.length
            }

            track(t) {
                this.queries.push(t)
            }
        }

        class Jd {
            constructor(t, e = -1) {
                this.metadata = t, this.matches = null, this.indexInDeclarationView = -1, this.crossesNgTemplate = !1, this._appliesToNextNode = !0, this._declarationNodeIndex = e
            }

            elementStart(t, e) {
                this.isApplyingToNode(e) && this.matchTNode(t, e)
            }

            elementEnd(t) {
                this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1)
            }

            template(t, e) {
                this.elementStart(t, e)
            }

            embeddedTView(t, e) {
                return this.isApplyingToNode(t) ? (this.crossesNgTemplate = !0, this.addMatch(-t.index, e), new Jd(this.metadata)) : null
            }

            isApplyingToNode(t) {
                if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
                    const e = this._declarationNodeIndex;
                    let r = t.parent;
                    for (; null !== r && 8 & r.type && r.index !== e;) r = r.parent;
                    return e === (null !== r ? r.index : -1)
                }
                return this._appliesToNextNode
            }

            matchTNode(t, e) {
                const r = this.metadata.predicate;
                if (Array.isArray(r)) for (let i = 0; i < r.length; i++) {
                    const s = r[i];
                    this.matchTNodeWithReadOption(t, e, Yx(e, s)), this.matchTNodeWithReadOption(t, e, ga(e, t, s, !1, !1))
                } else r === qe ? 4 & e.type && this.matchTNodeWithReadOption(t, e, -1) : this.matchTNodeWithReadOption(t, e, ga(e, t, r, !1, !1))
            }

            matchTNodeWithReadOption(t, e, r) {
                if (null !== r) {
                    const i = this.metadata.read;
                    if (null !== i) if (i === re || i === Ke || i === qe && 4 & e.type) this.addMatch(e.index, -2); else {
                        const s = ga(e, t, i, !1, !1);
                        null !== s && this.addMatch(e.index, s)
                    } else this.addMatch(e.index, r)
                }
            }

            addMatch(t, e) {
                null === this.matches ? this.matches = [t, e] : this.matches.push(t, e)
            }
        }

        function Yx(n, t) {
            const e = n.localNames;
            if (null !== e) for (let r = 0; r < e.length; r += 2) if (e[r] === t) return e[r + 1];
            return null
        }

        function Xx(n, t, e, r) {
            return -1 === e ? function Jx(n, t) {
                return 11 & n.type ? Ei(n, t) : 4 & n.type ? Qa(n, t) : null
            }(t, n) : -2 === e ? function ek(n, t, e) {
                return e === re ? Ei(t, n) : e === qe ? Qa(t, n) : e === Ke ? Wv(t, n) : void 0
            }(n, t, r) : Is(n, n[1], e, t)
        }

        function qv(n, t, e, r) {
            const i = t[19].queries[r];
            if (null === i.matches) {
                const s = n.data, o = e.matches, a = [];
                for (let l = 0; l < o.length; l += 2) {
                    const c = o[l];
                    a.push(c < 0 ? null : Xx(t, s[c], o[l + 1], e.metadata.read))
                }
                i.matches = a
            }
            return i.matches
        }

        function Xd(n, t, e, r) {
            const i = n.queries.getByIndex(e), s = i.matches;
            if (null !== s) {
                const o = qv(n, t, i, e);
                for (let a = 0; a < s.length; a += 2) {
                    const l = s[a];
                    if (l > 0) r.push(o[a / 2]); else {
                        const c = s[a + 1], u = t[-l];
                        for (let d = 10; d < u.length; d++) {
                            const h = u[d];
                            h[17] === h[3] && Xd(h[1], h, c, r)
                        }
                        if (null !== u[9]) {
                            const d = u[9];
                            for (let h = 0; h < d.length; h++) {
                                const f = d[h];
                                Xd(f[1], f, c, r)
                            }
                        }
                    }
                }
            }
            return r
        }

        function se(n) {
            const t = b(), e = X(), r = Eg();
            su(r + 1);
            const i = Zv(e, r);
            if (n.dirty && _g(t) === (2 == (2 & i.metadata.flags))) {
                if (null === i.matches) n.reset([]); else {
                    const s = i.crossesNgTemplate ? Xd(e, t, r, []) : qv(e, t, i, r);
                    n.reset(s, eT), n.notifyOnChanges()
                }
                return !0
            }
            return !1
        }

        function et(n, t, e) {
            const r = X();
            r.firstCreatePass && (Qv(r, new Gv(n, t, e), -1), 2 == (2 & t) && (r.staticViewQueries = !0)), Kv(r, b(), t)
        }

        function yt(n, t, e, r) {
            const i = X();
            if (i.firstCreatePass) {
                const s = Ue();
                Qv(i, new Gv(t, e, r), s.index), function nk(n, t) {
                    const e = n.contentQueries || (n.contentQueries = []);
                    t !== (e.length ? e[e.length - 1] : -1) && e.push(n.queries.length - 1, t)
                }(i, n), 2 == (2 & e) && (i.staticContentQueries = !0)
            }
            Kv(i, b(), e)
        }

        function oe() {
            return function tk(n, t) {
                return n[19].queries[t].queryList
            }(b(), Eg())
        }

        function Kv(n, t, e) {
            const r = new Ki(4 == (4 & e));
            F_(n, t, r, r.destroy), null === t[19] && (t[19] = new Zd), t[19].queries.push(new Qd(r))
        }

        function Qv(n, t, e) {
            null === n.queries && (n.queries = new Yd), n.queries.track(new Jd(t, e))
        }

        function Zv(n, t) {
            return n.queries.getByIndex(t)
        }

        function Yv(n, t) {
            return Qa(n, t)
        }

        function Ya(...n) {
        }

        const Ja = new S("Application Initializer");
        let Xa = (() => {
            class n {
                constructor(e) {
                    this.appInits = e, this.resolve = Ya, this.reject = Ya, this.initialized = !1, this.done = !1, this.donePromise = new Promise((r, i) => {
                        this.resolve = r, this.reject = i
                    })
                }

                runInitializers() {
                    if (this.initialized) return;
                    const e = [], r = () => {
                        this.done = !0, this.resolve()
                    };
                    if (this.appInits) for (let i = 0; i < this.appInits.length; i++) {
                        const s = this.appInits[i]();
                        if (Ua(s)) e.push(s); else if (ly(s)) {
                            const o = new Promise((a, l) => {
                                s.subscribe({complete: a, error: l})
                            });
                            e.push(o)
                        }
                    }
                    Promise.all(e).then(() => {
                        r()
                    }).catch(i => {
                        this.reject(i)
                    }), 0 === e.length && r(), this.initialized = !0
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Ja, 8))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();
        const oo = new S("AppId", {
            providedIn: "root", factory: function mb() {
                return `${ih()}${ih()}${ih()}`
            }
        });

        function ih() {
            return String.fromCharCode(97 + Math.floor(25 * Math.random()))
        }

        const _b = new S("Platform Initializer"),
            el = new S("Platform ID", {providedIn: "platform", factory: () => "unknown"}),
            yb = new S("appBootstrapListener"), zn = new S("AnimationModuleType");
        let wk = (() => {
            class n {
                log(e) {
                    console.log(e)
                }

                warn(e) {
                    console.warn(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "platform"}), n
        })();
        const An = new S("LocaleId", {
            providedIn: "root",
            factory: () => Ce(An, F.Optional | F.SkipSelf) || function Ck() {
                return typeof $localize < "u" && $localize.locale || Gi
            }()
        });

        class Mk {
            constructor(t, e) {
                this.ngModuleFactory = t, this.componentFactories = e
            }
        }

        let sh = (() => {
            class n {
                compileModuleSync(e) {
                    return new Wd(e)
                }

                compileModuleAsync(e) {
                    return Promise.resolve(this.compileModuleSync(e))
                }

                compileModuleAndAllComponentsSync(e) {
                    const r = this.compileModuleSync(e), s = Hn(Rt(e).declarations).reduce((o, a) => {
                        const l = ue(a);
                        return l && o.push(new Ks(l)), o
                    }, []);
                    return new Mk(r, s)
                }

                compileModuleAndAllComponentsAsync(e) {
                    return Promise.resolve(this.compileModuleAndAllComponentsSync(e))
                }

                clearCache() {
                }

                clearCacheFor(e) {
                }

                getModuleId(e) {
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();
        const Ik = (() => Promise.resolve(0))();

        function oh(n) {
            typeof Zone > "u" ? Ik.then(() => {
                n && n.apply(null, null)
            }) : Zone.current.scheduleMicroTask("scheduleMicrotask", n)
        }

        class Z {
            constructor({
                            enableLongStackTrace: t = !1,
                            shouldCoalesceEventChangeDetection: e = !1,
                            shouldCoalesceRunChangeDetection: r = !1
                        }) {
                if (this.hasPendingMacrotasks = !1, this.hasPendingMicrotasks = !1, this.isStable = !0, this.onUnstable = new ie(!1), this.onMicrotaskEmpty = new ie(!1), this.onStable = new ie(!1), this.onError = new ie(!1), typeof Zone > "u") throw new D(908, !1);
                Zone.assertZonePatched();
                const i = this;
                if (i._nesting = 0, i._outer = i._inner = Zone.current, Zone.AsyncStackTaggingZoneSpec) {
                    const s = Zone.AsyncStackTaggingZoneSpec;
                    i._inner = i._inner.fork(new s("Angular"))
                }
                Zone.TaskTrackingZoneSpec && (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec)), t && Zone.longStackTraceZoneSpec && (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)), i.shouldCoalesceEventChangeDetection = !r && e, i.shouldCoalesceRunChangeDetection = r, i.lastRequestAnimationFrameId = -1, i.nativeRequestAnimationFrame = function Ak() {
                    let n = de.requestAnimationFrame, t = de.cancelAnimationFrame;
                    if (typeof Zone < "u" && n && t) {
                        const e = n[Zone.__symbol__("OriginalDelegate")];
                        e && (n = e);
                        const r = t[Zone.__symbol__("OriginalDelegate")];
                        r && (t = r)
                    }
                    return {nativeRequestAnimationFrame: n, nativeCancelAnimationFrame: t}
                }().nativeRequestAnimationFrame, function kk(n) {
                    const t = () => {
                        !function xk(n) {
                            n.isCheckStableRunning || -1 !== n.lastRequestAnimationFrameId || (n.lastRequestAnimationFrameId = n.nativeRequestAnimationFrame.call(de, () => {
                                n.fakeTopEventTask || (n.fakeTopEventTask = Zone.root.scheduleEventTask("fakeTopEventTask", () => {
                                    n.lastRequestAnimationFrameId = -1, lh(n), n.isCheckStableRunning = !0, ah(n), n.isCheckStableRunning = !1
                                }, void 0, () => {
                                }, () => {
                                })), n.fakeTopEventTask.invoke()
                            }), lh(n))
                        }(n)
                    };
                    n._inner = n._inner.fork({
                        name: "angular",
                        properties: {isAngularZone: !0},
                        onInvokeTask: (e, r, i, s, o, a) => {
                            try {
                                return Db(n), e.invokeTask(i, s, o, a)
                            } finally {
                                (n.shouldCoalesceEventChangeDetection && "eventTask" === s.type || n.shouldCoalesceRunChangeDetection) && t(), wb(n)
                            }
                        },
                        onInvoke: (e, r, i, s, o, a, l) => {
                            try {
                                return Db(n), e.invoke(i, s, o, a, l)
                            } finally {
                                n.shouldCoalesceRunChangeDetection && t(), wb(n)
                            }
                        },
                        onHasTask: (e, r, i, s) => {
                            e.hasTask(i, s), r === i && ("microTask" == s.change ? (n._hasPendingMicrotasks = s.microTask, lh(n), ah(n)) : "macroTask" == s.change && (n.hasPendingMacrotasks = s.macroTask))
                        },
                        onHandleError: (e, r, i, s) => (e.handleError(i, s), n.runOutsideAngular(() => n.onError.emit(s)), !1)
                    })
                }(i)
            }

            static isInAngularZone() {
                return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone")
            }

            static assertInAngularZone() {
                if (!Z.isInAngularZone()) throw new D(909, !1)
            }

            static assertNotInAngularZone() {
                if (Z.isInAngularZone()) throw new D(909, !1)
            }

            run(t, e, r) {
                return this._inner.run(t, e, r)
            }

            runTask(t, e, r, i) {
                const s = this._inner, o = s.scheduleEventTask("NgZoneEvent: " + i, t, Rk, Ya, Ya);
                try {
                    return s.runTask(o, e, r)
                } finally {
                    s.cancelTask(o)
                }
            }

            runGuarded(t, e, r) {
                return this._inner.runGuarded(t, e, r)
            }

            runOutsideAngular(t) {
                return this._outer.run(t)
            }
        }

        const Rk = {};

        function ah(n) {
            if (0 == n._nesting && !n.hasPendingMicrotasks && !n.isStable) try {
                n._nesting++, n.onMicrotaskEmpty.emit(null)
            } finally {
                if (n._nesting--, !n.hasPendingMicrotasks) try {
                    n.runOutsideAngular(() => n.onStable.emit(null))
                } finally {
                    n.isStable = !0
                }
            }
        }

        function lh(n) {
            n.hasPendingMicrotasks = !!(n._hasPendingMicrotasks || (n.shouldCoalesceEventChangeDetection || n.shouldCoalesceRunChangeDetection) && -1 !== n.lastRequestAnimationFrameId)
        }

        function Db(n) {
            n._nesting++, n.isStable && (n.isStable = !1, n.onUnstable.emit(null))
        }

        function wb(n) {
            n._nesting--, ah(n)
        }

        class Pk {
            constructor() {
                this.hasPendingMicrotasks = !1, this.hasPendingMacrotasks = !1, this.isStable = !0, this.onUnstable = new ie, this.onMicrotaskEmpty = new ie, this.onStable = new ie, this.onError = new ie
            }

            run(t, e, r) {
                return t.apply(e, r)
            }

            runGuarded(t, e, r) {
                return t.apply(e, r)
            }

            runOutsideAngular(t) {
                return t()
            }

            runTask(t, e, r, i) {
                return t.apply(e, r)
            }
        }

        const Cb = new S(""), tl = new S("");
        let dh, ch = (() => {
            class n {
                constructor(e, r, i) {
                    this._ngZone = e, this.registry = r, this._pendingCount = 0, this._isZoneStable = !0, this._didWork = !1, this._callbacks = [], this.taskTrackingZone = null, dh || (function Fk(n) {
                        dh = n
                    }(i), i.addToWindow(r)), this._watchAngularEvents(), e.run(() => {
                        this.taskTrackingZone = typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone")
                    })
                }

                _watchAngularEvents() {
                    this._ngZone.onUnstable.subscribe({
                        next: () => {
                            this._didWork = !0, this._isZoneStable = !1
                        }
                    }), this._ngZone.runOutsideAngular(() => {
                        this._ngZone.onStable.subscribe({
                            next: () => {
                                Z.assertNotInAngularZone(), oh(() => {
                                    this._isZoneStable = !0, this._runCallbacksIfReady()
                                })
                            }
                        })
                    })
                }

                increasePendingRequestCount() {
                    return this._pendingCount += 1, this._didWork = !0, this._pendingCount
                }

                decreasePendingRequestCount() {
                    if (this._pendingCount -= 1, this._pendingCount < 0) throw new Error("pending async requests below zero");
                    return this._runCallbacksIfReady(), this._pendingCount
                }

                isStable() {
                    return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks
                }

                _runCallbacksIfReady() {
                    if (this.isStable()) oh(() => {
                        for (; 0 !== this._callbacks.length;) {
                            let e = this._callbacks.pop();
                            clearTimeout(e.timeoutId), e.doneCb(this._didWork)
                        }
                        this._didWork = !1
                    }); else {
                        let e = this.getPendingTasks();
                        this._callbacks = this._callbacks.filter(r => !r.updateCb || !r.updateCb(e) || (clearTimeout(r.timeoutId), !1)), this._didWork = !0
                    }
                }

                getPendingTasks() {
                    return this.taskTrackingZone ? this.taskTrackingZone.macroTasks.map(e => ({
                        source: e.source,
                        creationLocation: e.creationLocation,
                        data: e.data
                    })) : []
                }

                addCallback(e, r, i) {
                    let s = -1;
                    r && r > 0 && (s = setTimeout(() => {
                        this._callbacks = this._callbacks.filter(o => o.timeoutId !== s), e(this._didWork, this.getPendingTasks())
                    }, r)), this._callbacks.push({doneCb: e, timeoutId: s, updateCb: i})
                }

                whenStable(e, r, i) {
                    if (i && !this.taskTrackingZone) throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?');
                    this.addCallback(e, r, i), this._runCallbacksIfReady()
                }

                getPendingRequestCount() {
                    return this._pendingCount
                }

                registerApplication(e) {
                    this.registry.registerApplication(e, this)
                }

                unregisterApplication(e) {
                    this.registry.unregisterApplication(e)
                }

                findProviders(e, r, i) {
                    return []
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Z), w(uh), w(tl))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })(), uh = (() => {
            class n {
                constructor() {
                    this._applications = new Map
                }

                registerApplication(e, r) {
                    this._applications.set(e, r)
                }

                unregisterApplication(e) {
                    this._applications.delete(e)
                }

                unregisterAllApplications() {
                    this._applications.clear()
                }

                getTestability(e) {
                    return this._applications.get(e) || null
                }

                getAllTestabilities() {
                    return Array.from(this._applications.values())
                }

                getAllRootElements() {
                    return Array.from(this._applications.keys())
                }

                findTestabilityInTree(e, r = !0) {
                    return dh?.findTestabilityInTree(this, e, r) ?? null
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "platform"}), n
        })(), _r = null;
        const Eb = new S("AllowMultipleToken"), hh = new S("PlatformDestroyListeners");

        class Mb {
            constructor(t, e) {
                this.name = t, this.token = e
            }
        }

        function Tb(n, t, e = []) {
            const r = `Platform: ${t}`, i = new S(r);
            return (s = []) => {
                let o = fh();
                if (!o || o.injector.get(Eb, !1)) {
                    const a = [...e, ...s, {provide: i, useValue: !0}];
                    n ? n(a) : function Lk(n) {
                        if (_r && !_r.get(Eb, !1)) throw new D(400, !1);
                        _r = n;
                        const t = n.get(Ab);
                        (function Sb(n) {
                            const t = n.get(_b, null);
                            t && t.forEach(e => e())
                        })(n)
                    }(function Ib(n = [], t) {
                        return Qt.create({
                            name: t,
                            providers: [{provide: ku, useValue: "platform"}, {
                                provide: hh,
                                useValue: new Set([() => _r = null])
                            }, ...n]
                        })
                    }(a, r))
                }
                return function Vk(n) {
                    const t = fh();
                    if (!t) throw new D(401, !1);
                    return t
                }()
            }
        }

        function fh() {
            return _r?.get(Ab) ?? null
        }

        let Ab = (() => {
            class n {
                constructor(e) {
                    this._injector = e, this._modules = [], this._destroyListeners = [], this._destroyed = !1
                }

                bootstrapModuleFactory(e, r) {
                    const i = function jk(n, t) {
                        let e;
                        return e = "noop" === n ? new Pk : ("zone.js" === n ? void 0 : n) || new Z(t), e
                    }(r?.ngZone, function Rb(n) {
                        return {
                            enableLongStackTrace: !1,
                            shouldCoalesceEventChangeDetection: !(!n || !n.ngZoneEventCoalescing) || !1,
                            shouldCoalesceRunChangeDetection: !(!n || !n.ngZoneRunCoalescing) || !1
                        }
                    }(r)), s = [{provide: Z, useValue: i}];
                    return i.run(() => {
                        const o = Qt.create({providers: s, parent: this.injector, name: e.moduleType.name}),
                            a = e.create(o), l = a.injector.get(Si, null);
                        if (!l) throw new D(402, !1);
                        return i.runOutsideAngular(() => {
                            const c = i.onError.subscribe({
                                next: u => {
                                    l.handleError(u)
                                }
                            });
                            a.onDestroy(() => {
                                nl(this._modules, a), c.unsubscribe()
                            })
                        }), function xb(n, t, e) {
                            try {
                                const r = e();
                                return Ua(r) ? r.catch(i => {
                                    throw t.runOutsideAngular(() => n.handleError(i)), i
                                }) : r
                            } catch (r) {
                                throw t.runOutsideAngular(() => n.handleError(r)), r
                            }
                        }(l, i, () => {
                            const c = a.injector.get(Xa);
                            return c.runInitializers(), c.donePromise.then(() => (function rv(n) {
                                At(n, "Expected localeId to be defined"), "string" == typeof n && (nv = n.toLowerCase().replace(/_/g, "-"))
                            }(a.injector.get(An, Gi) || Gi), this._moduleDoBootstrap(a), a))
                        })
                    })
                }

                bootstrapModule(e, r = []) {
                    const i = kb({}, r);
                    return function Nk(n, t, e) {
                        const r = new Wd(e);
                        return Promise.resolve(r)
                    }(0, 0, e).then(s => this.bootstrapModuleFactory(s, i))
                }

                _moduleDoBootstrap(e) {
                    const r = e.injector.get(ao);
                    if (e._bootstrapComponents.length > 0) e._bootstrapComponents.forEach(i => r.bootstrap(i)); else {
                        if (!e.instance.ngDoBootstrap) throw new D(403, !1);
                        e.instance.ngDoBootstrap(r)
                    }
                    this._modules.push(e)
                }

                onDestroy(e) {
                    this._destroyListeners.push(e)
                }

                get injector() {
                    return this._injector
                }

                destroy() {
                    if (this._destroyed) throw new D(404, !1);
                    this._modules.slice().forEach(r => r.destroy()), this._destroyListeners.forEach(r => r());
                    const e = this._injector.get(hh, null);
                    e && (e.forEach(r => r()), e.clear()), this._destroyed = !0
                }

                get destroyed() {
                    return this._destroyed
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Qt))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "platform"}), n
        })();

        function kb(n, t) {
            return Array.isArray(t) ? t.reduce(kb, n) : {...n, ...t}
        }

        let ao = (() => {
            class n {
                constructor(e, r, i) {
                    this._zone = e, this._injector = r, this._exceptionHandler = i, this._bootstrapListeners = [], this._views = [], this._runningTick = !1, this._stable = !0, this._destroyed = !1, this._destroyListeners = [], this.componentTypes = [], this.components = [], this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
                        next: () => {
                            this._zone.run(() => {
                                this.tick()
                            })
                        }
                    });
                    const s = new fe(a => {
                        this._stable = this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks, this._zone.runOutsideAngular(() => {
                            a.next(this._stable), a.complete()
                        })
                    }), o = new fe(a => {
                        let l;
                        this._zone.runOutsideAngular(() => {
                            l = this._zone.onStable.subscribe(() => {
                                Z.assertNotInAngularZone(), oh(() => {
                                    !this._stable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks && (this._stable = !0, a.next(!0))
                                })
                            })
                        });
                        const c = this._zone.onUnstable.subscribe(() => {
                            Z.assertInAngularZone(), this._stable && (this._stable = !1, this._zone.runOutsideAngular(() => {
                                a.next(!1)
                            }))
                        });
                        return () => {
                            l.unsubscribe(), c.unsubscribe()
                        }
                    });
                    this.isStable = qo(s, o.pipe(function F0(n = {}) {
                        const {
                            connector: t = (() => new ve),
                            resetOnError: e = !0,
                            resetOnComplete: r = !0,
                            resetOnRefCountZero: i = !0
                        } = n;
                        return s => {
                            let o, a, l, c = 0, u = !1, d = !1;
                            const h = () => {
                                a?.unsubscribe(), a = void 0
                            }, f = () => {
                                h(), o = l = void 0, u = d = !1
                            }, p = () => {
                                const g = o;
                                f(), g?.unsubscribe()
                            };
                            return Ee((g, _) => {
                                c++, !d && !u && h();
                                const y = l = l ?? t();
                                _.add(() => {
                                    c--, 0 === c && !d && !u && (a = Lc(p, i))
                                }), y.subscribe(_), !o && c > 0 && (o = new ys({
                                    next: C => y.next(C), error: C => {
                                        d = !0, h(), a = Lc(f, e, C), y.error(C)
                                    }, complete: () => {
                                        u = !0, h(), a = Lc(f, r), y.complete()
                                    }
                                }), Dt(g).subscribe(o))
                            })(s)
                        }
                    }()))
                }

                get destroyed() {
                    return this._destroyed
                }

                get injector() {
                    return this._injector
                }

                bootstrap(e, r) {
                    const i = e instanceof Sm;
                    if (!this._injector.get(Xa).done) throw!i && function Zi(n) {
                        const t = ue(n) || ht(n) || ft(n);
                        return null !== t && t.standalone
                    }(e), new D(405, false);
                    let o;
                    o = i ? e : this._injector.get(Br).resolveComponentFactory(e), this.componentTypes.push(o.componentType);
                    const a = function Ok(n) {
                            return n.isBoundToModule
                        }(o) ? void 0 : this._injector.get(zr), c = o.create(Qt.NULL, [], r || o.selector, a),
                        u = c.location.nativeElement, d = c.injector.get(Cb, null);
                    return d?.registerApplication(u), c.onDestroy(() => {
                        this.detachView(c.hostView), nl(this.components, c), d?.unregisterApplication(u)
                    }), this._loadComponent(c), c
                }

                tick() {
                    if (this._runningTick) throw new D(101, !1);
                    try {
                        this._runningTick = !0;
                        for (let e of this._views) e.detectChanges()
                    } catch (e) {
                        this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(e))
                    } finally {
                        this._runningTick = !1
                    }
                }

                attachView(e) {
                    const r = e;
                    this._views.push(r), r.attachToAppRef(this)
                }

                detachView(e) {
                    const r = e;
                    nl(this._views, r), r.detachFromAppRef()
                }

                _loadComponent(e) {
                    this.attachView(e.hostView), this.tick(), this.components.push(e), this._injector.get(yb, []).concat(this._bootstrapListeners).forEach(i => i(e))
                }

                ngOnDestroy() {
                    if (!this._destroyed) try {
                        this._destroyListeners.forEach(e => e()), this._views.slice().forEach(e => e.destroy()), this._onMicrotaskEmptySubscription.unsubscribe()
                    } finally {
                        this._destroyed = !0, this._views = [], this._bootstrapListeners = [], this._destroyListeners = []
                    }
                }

                onDestroy(e) {
                    return this._destroyListeners.push(e), () => nl(this._destroyListeners, e)
                }

                destroy() {
                    if (this._destroyed) throw new D(406, !1);
                    const e = this._injector;
                    e.destroy && !e.destroyed && e.destroy()
                }

                get viewCount() {
                    return this._views.length
                }

                warnIfDestroyed() {
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Z), w(dr), w(Si))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();

        function nl(n, t) {
            const e = n.indexOf(t);
            e > -1 && n.splice(e, 1)
        }

        let Fb = !0, mn = (() => {
            class n {
            }

            return n.__NG_ELEMENT_ID__ = $k, n
        })();

        function $k(n) {
            return function zk(n, t, e) {
                if (na(n) && !e) {
                    const r = kt(n.index, t);
                    return new qs(r, r)
                }
                return 47 & n.type ? new qs(t[16], t) : null
            }(Ue(), b(), 16 == (16 & n))
        }

        class Vb {
            constructor() {
            }

            supports(t) {
                return Qs(t)
            }

            create(t) {
                return new Zk(t)
            }
        }

        const Qk = (n, t) => t;

        class Zk {
            constructor(t) {
                this.length = 0, this._linkedRecords = null, this._unlinkedRecords = null, this._previousItHead = null, this._itHead = null, this._itTail = null, this._additionsHead = null, this._additionsTail = null, this._movesHead = null, this._movesTail = null, this._removalsHead = null, this._removalsTail = null, this._identityChangesHead = null, this._identityChangesTail = null, this._trackByFn = t || Qk
            }

            forEachItem(t) {
                let e;
                for (e = this._itHead; null !== e; e = e._next) t(e)
            }

            forEachOperation(t) {
                let e = this._itHead, r = this._removalsHead, i = 0, s = null;
                for (; e || r;) {
                    const o = !r || e && e.currentIndex < Hb(r, i, s) ? e : r, a = Hb(o, i, s), l = o.currentIndex;
                    if (o === r) i--, r = r._nextRemoved; else if (e = e._next, null == o.previousIndex) i++; else {
                        s || (s = []);
                        const c = a - i, u = l - i;
                        if (c != u) {
                            for (let h = 0; h < c; h++) {
                                const f = h < s.length ? s[h] : s[h] = 0, p = f + h;
                                u <= p && p < c && (s[h] = f + 1)
                            }
                            s[o.previousIndex] = u - c
                        }
                    }
                    a !== l && t(o, a, l)
                }
            }

            forEachPreviousItem(t) {
                let e;
                for (e = this._previousItHead; null !== e; e = e._nextPrevious) t(e)
            }

            forEachAddedItem(t) {
                let e;
                for (e = this._additionsHead; null !== e; e = e._nextAdded) t(e)
            }

            forEachMovedItem(t) {
                let e;
                for (e = this._movesHead; null !== e; e = e._nextMoved) t(e)
            }

            forEachRemovedItem(t) {
                let e;
                for (e = this._removalsHead; null !== e; e = e._nextRemoved) t(e)
            }

            forEachIdentityChange(t) {
                let e;
                for (e = this._identityChangesHead; null !== e; e = e._nextIdentityChange) t(e)
            }

            diff(t) {
                if (null == t && (t = []), !Qs(t)) throw new D(900, !1);
                return this.check(t) ? this : null
            }

            onDestroy() {
            }

            check(t) {
                this._reset();
                let i, s, o, e = this._itHead, r = !1;
                if (Array.isArray(t)) {
                    this.length = t.length;
                    for (let a = 0; a < this.length; a++) s = t[a], o = this._trackByFn(a, s), null !== e && Object.is(e.trackById, o) ? (r && (e = this._verifyReinsertion(e, s, o, a)), Object.is(e.item, s) || this._addIdentityChange(e, s)) : (e = this._mismatch(e, s, o, a), r = !0), e = e._next
                } else i = 0, function CA(n, t) {
                    if (Array.isArray(n)) for (let e = 0; e < n.length; e++) t(n[e]); else {
                        const e = n[jr()]();
                        let r;
                        for (; !(r = e.next()).done;) t(r.value)
                    }
                }(t, a => {
                    o = this._trackByFn(i, a), null !== e && Object.is(e.trackById, o) ? (r && (e = this._verifyReinsertion(e, a, o, i)), Object.is(e.item, a) || this._addIdentityChange(e, a)) : (e = this._mismatch(e, a, o, i), r = !0), e = e._next, i++
                }), this.length = i;
                return this._truncate(e), this.collection = t, this.isDirty
            }

            get isDirty() {
                return null !== this._additionsHead || null !== this._movesHead || null !== this._removalsHead || null !== this._identityChangesHead
            }

            _reset() {
                if (this.isDirty) {
                    let t;
                    for (t = this._previousItHead = this._itHead; null !== t; t = t._next) t._nextPrevious = t._next;
                    for (t = this._additionsHead; null !== t; t = t._nextAdded) t.previousIndex = t.currentIndex;
                    for (this._additionsHead = this._additionsTail = null, t = this._movesHead; null !== t; t = t._nextMoved) t.previousIndex = t.currentIndex;
                    this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null
                }
            }

            _mismatch(t, e, r, i) {
                let s;
                return null === t ? s = this._itTail : (s = t._prev, this._remove(t)), null !== (t = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null)) ? (Object.is(t.item, e) || this._addIdentityChange(t, e), this._reinsertAfter(t, s, i)) : null !== (t = null === this._linkedRecords ? null : this._linkedRecords.get(r, i)) ? (Object.is(t.item, e) || this._addIdentityChange(t, e), this._moveAfter(t, s, i)) : t = this._addAfter(new Yk(e, r), s, i), t
            }

            _verifyReinsertion(t, e, r, i) {
                let s = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null);
                return null !== s ? t = this._reinsertAfter(s, t._prev, i) : t.currentIndex != i && (t.currentIndex = i, this._addToMoves(t, i)), t
            }

            _truncate(t) {
                for (; null !== t;) {
                    const e = t._next;
                    this._addToRemovals(this._unlink(t)), t = e
                }
                null !== this._unlinkedRecords && this._unlinkedRecords.clear(), null !== this._additionsTail && (this._additionsTail._nextAdded = null), null !== this._movesTail && (this._movesTail._nextMoved = null), null !== this._itTail && (this._itTail._next = null), null !== this._removalsTail && (this._removalsTail._nextRemoved = null), null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null)
            }

            _reinsertAfter(t, e, r) {
                null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
                const i = t._prevRemoved, s = t._nextRemoved;
                return null === i ? this._removalsHead = s : i._nextRemoved = s, null === s ? this._removalsTail = i : s._prevRemoved = i, this._insertAfter(t, e, r), this._addToMoves(t, r), t
            }

            _moveAfter(t, e, r) {
                return this._unlink(t), this._insertAfter(t, e, r), this._addToMoves(t, r), t
            }

            _addAfter(t, e, r) {
                return this._insertAfter(t, e, r), this._additionsTail = null === this._additionsTail ? this._additionsHead = t : this._additionsTail._nextAdded = t, t
            }

            _insertAfter(t, e, r) {
                const i = null === e ? this._itHead : e._next;
                return t._next = i, t._prev = e, null === i ? this._itTail = t : i._prev = t, null === e ? this._itHead = t : e._next = t, null === this._linkedRecords && (this._linkedRecords = new jb), this._linkedRecords.put(t), t.currentIndex = r, t
            }

            _remove(t) {
                return this._addToRemovals(this._unlink(t))
            }

            _unlink(t) {
                null !== this._linkedRecords && this._linkedRecords.remove(t);
                const e = t._prev, r = t._next;
                return null === e ? this._itHead = r : e._next = r, null === r ? this._itTail = e : r._prev = e, t
            }

            _addToMoves(t, e) {
                return t.previousIndex === e || (this._movesTail = null === this._movesTail ? this._movesHead = t : this._movesTail._nextMoved = t), t
            }

            _addToRemovals(t) {
                return null === this._unlinkedRecords && (this._unlinkedRecords = new jb), this._unlinkedRecords.put(t), t.currentIndex = null, t._nextRemoved = null, null === this._removalsTail ? (this._removalsTail = this._removalsHead = t, t._prevRemoved = null) : (t._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = t), t
            }

            _addIdentityChange(t, e) {
                return t.item = e, this._identityChangesTail = null === this._identityChangesTail ? this._identityChangesHead = t : this._identityChangesTail._nextIdentityChange = t, t
            }
        }

        class Yk {
            constructor(t, e) {
                this.item = t, this.trackById = e, this.currentIndex = null, this.previousIndex = null, this._nextPrevious = null, this._prev = null, this._next = null, this._prevDup = null, this._nextDup = null, this._prevRemoved = null, this._nextRemoved = null, this._nextAdded = null, this._nextMoved = null, this._nextIdentityChange = null
            }
        }

        class Jk {
            constructor() {
                this._head = null, this._tail = null
            }

            add(t) {
                null === this._head ? (this._head = this._tail = t, t._nextDup = null, t._prevDup = null) : (this._tail._nextDup = t, t._prevDup = this._tail, t._nextDup = null, this._tail = t)
            }

            get(t, e) {
                let r;
                for (r = this._head; null !== r; r = r._nextDup) if ((null === e || e <= r.currentIndex) && Object.is(r.trackById, t)) return r;
                return null
            }

            remove(t) {
                const e = t._prevDup, r = t._nextDup;
                return null === e ? this._head = r : e._nextDup = r, null === r ? this._tail = e : r._prevDup = e, null === this._head
            }
        }

        class jb {
            constructor() {
                this.map = new Map
            }

            put(t) {
                const e = t.trackById;
                let r = this.map.get(e);
                r || (r = new Jk, this.map.set(e, r)), r.add(t)
            }

            get(t, e) {
                const i = this.map.get(t);
                return i ? i.get(t, e) : null
            }

            remove(t) {
                const e = t.trackById;
                return this.map.get(e).remove(t) && this.map.delete(e), t
            }

            get isEmpty() {
                return 0 === this.map.size
            }

            clear() {
                this.map.clear()
            }
        }

        function Hb(n, t, e) {
            const r = n.previousIndex;
            if (null === r) return r;
            let i = 0;
            return e && r < e.length && (i = e[r]), r + t + i
        }

        class Ub {
            constructor() {
            }

            supports(t) {
                return t instanceof Map || Pd(t)
            }

            create() {
                return new Xk
            }
        }

        class Xk {
            constructor() {
                this._records = new Map, this._mapHead = null, this._appendAfter = null, this._previousMapHead = null, this._changesHead = null, this._changesTail = null, this._additionsHead = null, this._additionsTail = null, this._removalsHead = null, this._removalsTail = null
            }

            get isDirty() {
                return null !== this._additionsHead || null !== this._changesHead || null !== this._removalsHead
            }

            forEachItem(t) {
                let e;
                for (e = this._mapHead; null !== e; e = e._next) t(e)
            }

            forEachPreviousItem(t) {
                let e;
                for (e = this._previousMapHead; null !== e; e = e._nextPrevious) t(e)
            }

            forEachChangedItem(t) {
                let e;
                for (e = this._changesHead; null !== e; e = e._nextChanged) t(e)
            }

            forEachAddedItem(t) {
                let e;
                for (e = this._additionsHead; null !== e; e = e._nextAdded) t(e)
            }

            forEachRemovedItem(t) {
                let e;
                for (e = this._removalsHead; null !== e; e = e._nextRemoved) t(e)
            }

            diff(t) {
                if (t) {
                    if (!(t instanceof Map || Pd(t))) throw new D(900, !1)
                } else t = new Map;
                return this.check(t) ? this : null
            }

            onDestroy() {
            }

            check(t) {
                this._reset();
                let e = this._mapHead;
                if (this._appendAfter = null, this._forEach(t, (r, i) => {
                    if (e && e.key === i) this._maybeAddToChanges(e, r), this._appendAfter = e, e = e._next; else {
                        const s = this._getOrCreateRecordForKey(i, r);
                        e = this._insertBeforeOrAppend(e, s)
                    }
                }), e) {
                    e._prev && (e._prev._next = null), this._removalsHead = e;
                    for (let r = e; null !== r; r = r._nextRemoved) r === this._mapHead && (this._mapHead = null), this._records.delete(r.key), r._nextRemoved = r._next, r.previousValue = r.currentValue, r.currentValue = null, r._prev = null, r._next = null
                }
                return this._changesTail && (this._changesTail._nextChanged = null), this._additionsTail && (this._additionsTail._nextAdded = null), this.isDirty
            }

            _insertBeforeOrAppend(t, e) {
                if (t) {
                    const r = t._prev;
                    return e._next = t, e._prev = r, t._prev = e, r && (r._next = e), t === this._mapHead && (this._mapHead = e), this._appendAfter = t, t
                }
                return this._appendAfter ? (this._appendAfter._next = e, e._prev = this._appendAfter) : this._mapHead = e, this._appendAfter = e, null
            }

            _getOrCreateRecordForKey(t, e) {
                if (this._records.has(t)) {
                    const i = this._records.get(t);
                    this._maybeAddToChanges(i, e);
                    const s = i._prev, o = i._next;
                    return s && (s._next = o), o && (o._prev = s), i._next = null, i._prev = null, i
                }
                const r = new eP(t);
                return this._records.set(t, r), r.currentValue = e, this._addToAdditions(r), r
            }

            _reset() {
                if (this.isDirty) {
                    let t;
                    for (this._previousMapHead = this._mapHead, t = this._previousMapHead; null !== t; t = t._next) t._nextPrevious = t._next;
                    for (t = this._changesHead; null !== t; t = t._nextChanged) t.previousValue = t.currentValue;
                    for (t = this._additionsHead; null != t; t = t._nextAdded) t.previousValue = t.currentValue;
                    this._changesHead = this._changesTail = null, this._additionsHead = this._additionsTail = null, this._removalsHead = null
                }
            }

            _maybeAddToChanges(t, e) {
                Object.is(e, t.currentValue) || (t.previousValue = t.currentValue, t.currentValue = e, this._addToChanges(t))
            }

            _addToAdditions(t) {
                null === this._additionsHead ? this._additionsHead = this._additionsTail = t : (this._additionsTail._nextAdded = t, this._additionsTail = t)
            }

            _addToChanges(t) {
                null === this._changesHead ? this._changesHead = this._changesTail = t : (this._changesTail._nextChanged = t, this._changesTail = t)
            }

            _forEach(t, e) {
                t instanceof Map ? t.forEach(e) : Object.keys(t).forEach(r => e(t[r], r))
            }
        }

        class eP {
            constructor(t) {
                this.key = t, this.previousValue = null, this.currentValue = null, this._nextPrevious = null, this._next = null, this._prev = null, this._nextAdded = null, this._nextRemoved = null, this._nextChanged = null
            }
        }

        function $b() {
            return new Gn([new Vb])
        }

        let Gn = (() => {
            class n {
                constructor(e) {
                    this.factories = e
                }

                static create(e, r) {
                    if (null != r) {
                        const i = r.factories.slice();
                        e = e.concat(i)
                    }
                    return new n(e)
                }

                static extend(e) {
                    return {provide: n, useFactory: r => n.create(e, r || $b()), deps: [[n, new Os, new Ns]]}
                }

                find(e) {
                    const r = this.factories.find(i => i.supports(e));
                    if (null != r) return r;
                    throw new D(901, !1)
                }
            }

            return n.\u0275prov = A({token: n, providedIn: "root", factory: $b}), n
        })();

        function zb() {
            return new lo([new Ub])
        }

        let lo = (() => {
            class n {
                constructor(e) {
                    this.factories = e
                }

                static create(e, r) {
                    if (r) {
                        const i = r.factories.slice();
                        e = e.concat(i)
                    }
                    return new n(e)
                }

                static extend(e) {
                    return {provide: n, useFactory: r => n.create(e, r || zb()), deps: [[n, new Os, new Ns]]}
                }

                find(e) {
                    const r = this.factories.find(i => i.supports(e));
                    if (r) return r;
                    throw new D(901, !1)
                }
            }

            return n.\u0275prov = A({token: n, providedIn: "root", factory: zb}), n
        })();
        const rP = Tb(null, "core", []);
        let iP = (() => {
            class n {
                constructor(e) {
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(ao))
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({}), n
        })(), sl = null;

        function yr() {
            return sl
        }

        const _e = new S("DocumentToken");
        let yh = (() => {
            class n {
                historyGo(e) {
                    throw new Error("Not implemented")
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({
                token: n, factory: function () {
                    return function lP() {
                        return w(Wb)
                    }()
                }, providedIn: "platform"
            }), n
        })();
        const cP = new S("Location Initialized");
        let Wb = (() => {
            class n extends yh {
                constructor(e) {
                    super(), this._doc = e, this._init()
                }

                _init() {
                    this.location = window.location, this._history = window.history
                }

                getBaseHrefFromDOM() {
                    return yr().getBaseHref(this._doc)
                }

                onPopState(e) {
                    const r = yr().getGlobalEventTarget(this._doc, "window");
                    return r.addEventListener("popstate", e, !1), () => r.removeEventListener("popstate", e)
                }

                onHashChange(e) {
                    const r = yr().getGlobalEventTarget(this._doc, "window");
                    return r.addEventListener("hashchange", e, !1), () => r.removeEventListener("hashchange", e)
                }

                get href() {
                    return this.location.href
                }

                get protocol() {
                    return this.location.protocol
                }

                get hostname() {
                    return this.location.hostname
                }

                get port() {
                    return this.location.port
                }

                get pathname() {
                    return this.location.pathname
                }

                get search() {
                    return this.location.search
                }

                get hash() {
                    return this.location.hash
                }

                set pathname(e) {
                    this.location.pathname = e
                }

                pushState(e, r, i) {
                    Gb() ? this._history.pushState(e, r, i) : this.location.hash = i
                }

                replaceState(e, r, i) {
                    Gb() ? this._history.replaceState(e, r, i) : this.location.hash = i
                }

                forward() {
                    this._history.forward()
                }

                back() {
                    this._history.back()
                }

                historyGo(e = 0) {
                    this._history.go(e)
                }

                getState() {
                    return this._history.state
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(_e))
            }, n.\u0275prov = A({
                token: n, factory: function () {
                    return function uP() {
                        return new Wb(w(_e))
                    }()
                }, providedIn: "platform"
            }), n
        })();

        function Gb() {
            return !!window.history.pushState
        }

        function vh(n, t) {
            if (0 == n.length) return t;
            if (0 == t.length) return n;
            let e = 0;
            return n.endsWith("/") && e++, t.startsWith("/") && e++, 2 == e ? n + t.substring(1) : 1 == e ? n + t : n + "/" + t
        }

        function qb(n) {
            const t = n.match(/#|\?|$/), e = t && t.index || n.length;
            return n.slice(0, e - ("/" === n[e - 1] ? 1 : 0)) + n.slice(e)
        }

        function qn(n) {
            return n && "?" !== n[0] ? "?" + n : n
        }

        let Gr = (() => {
            class n {
                historyGo(e) {
                    throw new Error("Not implemented")
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({
                token: n, factory: function () {
                    return Ce(Qb)
                }, providedIn: "root"
            }), n
        })();
        const Kb = new S("appBaseHref");
        let Qb = (() => {
            class n extends Gr {
                constructor(e, r) {
                    super(), this._platformLocation = e, this._removeListenerFns = [], this._baseHref = r ?? this._platformLocation.getBaseHrefFromDOM() ?? Ce(_e).location?.origin ?? ""
                }

                ngOnDestroy() {
                    for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
                }

                onPopState(e) {
                    this._removeListenerFns.push(this._platformLocation.onPopState(e), this._platformLocation.onHashChange(e))
                }

                getBaseHref() {
                    return this._baseHref
                }

                prepareExternalUrl(e) {
                    return vh(this._baseHref, e)
                }

                path(e = !1) {
                    const r = this._platformLocation.pathname + qn(this._platformLocation.search),
                        i = this._platformLocation.hash;
                    return i && e ? `${r}${i}` : r
                }

                pushState(e, r, i, s) {
                    const o = this.prepareExternalUrl(i + qn(s));
                    this._platformLocation.pushState(e, r, o)
                }

                replaceState(e, r, i, s) {
                    const o = this.prepareExternalUrl(i + qn(s));
                    this._platformLocation.replaceState(e, r, o)
                }

                forward() {
                    this._platformLocation.forward()
                }

                back() {
                    this._platformLocation.back()
                }

                getState() {
                    return this._platformLocation.getState()
                }

                historyGo(e = 0) {
                    this._platformLocation.historyGo?.(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(yh), w(Kb, 8))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })(), dP = (() => {
            class n extends Gr {
                constructor(e, r) {
                    super(), this._platformLocation = e, this._baseHref = "", this._removeListenerFns = [], null != r && (this._baseHref = r)
                }

                ngOnDestroy() {
                    for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
                }

                onPopState(e) {
                    this._removeListenerFns.push(this._platformLocation.onPopState(e), this._platformLocation.onHashChange(e))
                }

                getBaseHref() {
                    return this._baseHref
                }

                path(e = !1) {
                    let r = this._platformLocation.hash;
                    return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r
                }

                prepareExternalUrl(e) {
                    const r = vh(this._baseHref, e);
                    return r.length > 0 ? "#" + r : r
                }

                pushState(e, r, i, s) {
                    let o = this.prepareExternalUrl(i + qn(s));
                    0 == o.length && (o = this._platformLocation.pathname), this._platformLocation.pushState(e, r, o)
                }

                replaceState(e, r, i, s) {
                    let o = this.prepareExternalUrl(i + qn(s));
                    0 == o.length && (o = this._platformLocation.pathname), this._platformLocation.replaceState(e, r, o)
                }

                forward() {
                    this._platformLocation.forward()
                }

                back() {
                    this._platformLocation.back()
                }

                getState() {
                    return this._platformLocation.getState()
                }

                historyGo(e = 0) {
                    this._platformLocation.historyGo?.(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(yh), w(Kb, 8))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })(), bh = (() => {
            class n {
                constructor(e) {
                    this._subject = new ie, this._urlChangeListeners = [], this._urlChangeSubscription = null, this._locationStrategy = e;
                    const r = this._locationStrategy.getBaseHref();
                    this._baseHref = qb(Zb(r)), this._locationStrategy.onPopState(i => {
                        this._subject.emit({url: this.path(!0), pop: !0, state: i.state, type: i.type})
                    })
                }

                ngOnDestroy() {
                    this._urlChangeSubscription?.unsubscribe(), this._urlChangeListeners = []
                }

                path(e = !1) {
                    return this.normalize(this._locationStrategy.path(e))
                }

                getState() {
                    return this._locationStrategy.getState()
                }

                isCurrentPathEqualTo(e, r = "") {
                    return this.path() == this.normalize(e + qn(r))
                }

                normalize(e) {
                    return n.stripTrailingSlash(function fP(n, t) {
                        return n && t.startsWith(n) ? t.substring(n.length) : t
                    }(this._baseHref, Zb(e)))
                }

                prepareExternalUrl(e) {
                    return e && "/" !== e[0] && (e = "/" + e), this._locationStrategy.prepareExternalUrl(e)
                }

                go(e, r = "", i = null) {
                    this._locationStrategy.pushState(i, "", e, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(e + qn(r)), i)
                }

                replaceState(e, r = "", i = null) {
                    this._locationStrategy.replaceState(i, "", e, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(e + qn(r)), i)
                }

                forward() {
                    this._locationStrategy.forward()
                }

                back() {
                    this._locationStrategy.back()
                }

                historyGo(e = 0) {
                    this._locationStrategy.historyGo?.(e)
                }

                onUrlChange(e) {
                    return this._urlChangeListeners.push(e), this._urlChangeSubscription || (this._urlChangeSubscription = this.subscribe(r => {
                        this._notifyUrlChangeListeners(r.url, r.state)
                    })), () => {
                        const r = this._urlChangeListeners.indexOf(e);
                        this._urlChangeListeners.splice(r, 1), 0 === this._urlChangeListeners.length && (this._urlChangeSubscription?.unsubscribe(), this._urlChangeSubscription = null)
                    }
                }

                _notifyUrlChangeListeners(e = "", r) {
                    this._urlChangeListeners.forEach(i => i(e, r))
                }

                subscribe(e, r, i) {
                    return this._subject.subscribe({next: e, error: r, complete: i})
                }
            }

            return n.normalizeQueryParams = qn, n.joinWithSlash = vh, n.stripTrailingSlash = qb, n.\u0275fac = function (e) {
                return new (e || n)(w(Gr))
            }, n.\u0275prov = A({
                token: n, factory: function () {
                    return function hP() {
                        return new bh(w(Gr))
                    }()
                }, providedIn: "root"
            }), n
        })();

        function Zb(n) {
            return n.replace(/\/index.html$/, "")
        }

        function sD(n, t) {
            t = encodeURIComponent(t);
            for (const e of n.split(";")) {
                const r = e.indexOf("="), [i, s] = -1 == r ? [e, ""] : [e.slice(0, r), e.slice(r + 1)];
                if (i.trim() === t) return decodeURIComponent(s)
            }
            return null
        }

        let oD = (() => {
            class n {
                constructor(e, r, i, s) {
                    this._iterableDiffers = e, this._keyValueDiffers = r, this._ngEl = i, this._renderer = s, this._iterableDiffer = null, this._keyValueDiffer = null, this._initialClasses = [], this._rawClass = null
                }

                set klass(e) {
                    this._removeClasses(this._initialClasses), this._initialClasses = "string" == typeof e ? e.split(/\s+/) : [], this._applyClasses(this._initialClasses), this._applyClasses(this._rawClass)
                }

                set ngClass(e) {
                    this._removeClasses(this._rawClass), this._applyClasses(this._initialClasses), this._iterableDiffer = null, this._keyValueDiffer = null, this._rawClass = "string" == typeof e ? e.split(/\s+/) : e, this._rawClass && (Qs(this._rawClass) ? this._iterableDiffer = this._iterableDiffers.find(this._rawClass).create() : this._keyValueDiffer = this._keyValueDiffers.find(this._rawClass).create())
                }

                ngDoCheck() {
                    if (this._iterableDiffer) {
                        const e = this._iterableDiffer.diff(this._rawClass);
                        e && this._applyIterableChanges(e)
                    } else if (this._keyValueDiffer) {
                        const e = this._keyValueDiffer.diff(this._rawClass);
                        e && this._applyKeyValueChanges(e)
                    }
                }

                _applyKeyValueChanges(e) {
                    e.forEachAddedItem(r => this._toggleClass(r.key, r.currentValue)), e.forEachChangedItem(r => this._toggleClass(r.key, r.currentValue)), e.forEachRemovedItem(r => {
                        r.previousValue && this._toggleClass(r.key, !1)
                    })
                }

                _applyIterableChanges(e) {
                    e.forEachAddedItem(r => {
                        if ("string" != typeof r.item) throw new Error(`NgClass can only toggle CSS classes expressed as strings, got ${ge(r.item)}`);
                        this._toggleClass(r.item, !0)
                    }), e.forEachRemovedItem(r => this._toggleClass(r.item, !1))
                }

                _applyClasses(e) {
                    e && (Array.isArray(e) || e instanceof Set ? e.forEach(r => this._toggleClass(r, !0)) : Object.keys(e).forEach(r => this._toggleClass(r, !!e[r])))
                }

                _removeClasses(e) {
                    e && (Array.isArray(e) || e instanceof Set ? e.forEach(r => this._toggleClass(r, !1)) : Object.keys(e).forEach(r => this._toggleClass(r, !1)))
                }

                _toggleClass(e, r) {
                    (e = e.trim()) && e.split(/\s+/g).forEach(i => {
                        r ? this._renderer.addClass(this._ngEl.nativeElement, i) : this._renderer.removeClass(this._ngEl.nativeElement, i)
                    })
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Gn), m(lo), m(re), m(Ta))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "ngClass", ""]],
                inputs: {klass: ["class", "klass"], ngClass: "ngClass"},
                standalone: !0
            }), n
        })();

        class YP {
            constructor(t, e, r, i) {
                this.$implicit = t, this.ngForOf = e, this.index = r, this.count = i
            }

            get first() {
                return 0 === this.index
            }

            get last() {
                return this.index === this.count - 1
            }

            get even() {
                return this.index % 2 == 0
            }

            get odd() {
                return !this.even
            }
        }

        let Rh = (() => {
            class n {
                constructor(e, r, i) {
                    this._viewContainer = e, this._template = r, this._differs = i, this._ngForOf = null, this._ngForOfDirty = !0, this._differ = null
                }

                set ngForOf(e) {
                    this._ngForOf = e, this._ngForOfDirty = !0
                }

                set ngForTrackBy(e) {
                    this._trackByFn = e
                }

                get ngForTrackBy() {
                    return this._trackByFn
                }

                set ngForTemplate(e) {
                    e && (this._template = e)
                }

                ngDoCheck() {
                    if (this._ngForOfDirty) {
                        this._ngForOfDirty = !1;
                        const e = this._ngForOf;
                        !this._differ && e && (this._differ = this._differs.find(e).create(this.ngForTrackBy))
                    }
                    if (this._differ) {
                        const e = this._differ.diff(this._ngForOf);
                        e && this._applyChanges(e)
                    }
                }

                _applyChanges(e) {
                    const r = this._viewContainer;
                    e.forEachOperation((i, s, o) => {
                        if (null == i.previousIndex) r.createEmbeddedView(this._template, new YP(i.item, this._ngForOf, -1, -1), null === o ? void 0 : o); else if (null == o) r.remove(null === s ? void 0 : s); else if (null !== s) {
                            const a = r.get(s);
                            r.move(a, o), cD(a, i)
                        }
                    });
                    for (let i = 0, s = r.length; i < s; i++) {
                        const a = r.get(i).context;
                        a.index = i, a.count = s, a.ngForOf = this._ngForOf
                    }
                    e.forEachIdentityChange(i => {
                        cD(r.get(i.currentIndex), i)
                    })
                }

                static ngTemplateContextGuard(e, r) {
                    return !0
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Ke), m(qe), m(Gn))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "ngFor", "", "ngForOf", ""]],
                inputs: {ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate"},
                standalone: !0
            }), n
        })();

        function cD(n, t) {
            n.context.$implicit = t.item
        }

        let xh = (() => {
            class n {
                constructor(e, r) {
                    this._viewContainer = e, this._context = new XP, this._thenTemplateRef = null, this._elseTemplateRef = null, this._thenViewRef = null, this._elseViewRef = null, this._thenTemplateRef = r
                }

                set ngIf(e) {
                    this._context.$implicit = this._context.ngIf = e, this._updateView()
                }

                set ngIfThen(e) {
                    uD("ngIfThen", e), this._thenTemplateRef = e, this._thenViewRef = null, this._updateView()
                }

                set ngIfElse(e) {
                    uD("ngIfElse", e), this._elseTemplateRef = e, this._elseViewRef = null, this._updateView()
                }

                _updateView() {
                    this._context.$implicit ? this._thenViewRef || (this._viewContainer.clear(), this._elseViewRef = null, this._thenTemplateRef && (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context))) : this._elseViewRef || (this._viewContainer.clear(), this._thenViewRef = null, this._elseTemplateRef && (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)))
                }

                static ngTemplateContextGuard(e, r) {
                    return !0
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Ke), m(qe))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "ngIf", ""]],
                inputs: {ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse"},
                standalone: !0
            }), n
        })();

        class XP {
            constructor() {
                this.$implicit = null, this.ngIf = null
            }
        }

        function uD(n, t) {
            if (t && !t.createEmbeddedView) throw new Error(`${n} must be a TemplateRef, but received '${ge(t)}'.`)
        }

        let fD = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({}), n
        })();
        const pD = "browser";
        let RF = (() => {
            class n {
            }

            return n.\u0275prov = A({token: n, providedIn: "root", factory: () => new xF(w(_e), window)}), n
        })();

        class xF {
            constructor(t, e) {
                this.document = t, this.window = e, this.offset = () => [0, 0]
            }

            setOffset(t) {
                this.offset = Array.isArray(t) ? () => t : t
            }

            getScrollPosition() {
                return this.supportsScrolling() ? [this.window.pageXOffset, this.window.pageYOffset] : [0, 0]
            }

            scrollToPosition(t) {
                this.supportsScrolling() && this.window.scrollTo(t[0], t[1])
            }

            scrollToAnchor(t) {
                if (!this.supportsScrolling()) return;
                const e = function kF(n, t) {
                    const e = n.getElementById(t) || n.getElementsByName(t)[0];
                    if (e) return e;
                    if ("function" == typeof n.createTreeWalker && n.body && (n.body.createShadowRoot || n.body.attachShadow)) {
                        const r = n.createTreeWalker(n.body, NodeFilter.SHOW_ELEMENT);
                        let i = r.currentNode;
                        for (; i;) {
                            const s = i.shadowRoot;
                            if (s) {
                                const o = s.getElementById(t) || s.querySelector(`[name="${t}"]`);
                                if (o) return o
                            }
                            i = r.nextNode()
                        }
                    }
                    return null
                }(this.document, t);
                e && (this.scrollToElement(e), e.focus())
            }

            setHistoryScrollRestoration(t) {
                if (this.supportScrollRestoration()) {
                    const e = this.window.history;
                    e && e.scrollRestoration && (e.scrollRestoration = t)
                }
            }

            scrollToElement(t) {
                const e = t.getBoundingClientRect(), r = e.left + this.window.pageXOffset,
                    i = e.top + this.window.pageYOffset, s = this.offset();
                this.window.scrollTo(r - s[0], i - s[1])
            }

            supportScrollRestoration() {
                try {
                    if (!this.supportsScrolling()) return !1;
                    const t = gD(this.window.history) || gD(Object.getPrototypeOf(this.window.history));
                    return !(!t || !t.writable && !t.set)
                } catch {
                    return !1
                }
            }

            supportsScrolling() {
                try {
                    return !!this.window && !!this.window.scrollTo && "pageXOffset" in this.window
                } catch {
                    return !1
                }
            }
        }

        function gD(n) {
            return Object.getOwnPropertyDescriptor(n, "scrollRestoration")
        }

        class mD {
        }

        class Oh extends class PF extends class aP {
        } {
            constructor() {
                super(...arguments), this.supportsDOMEvents = !0
            }
        } {
            static makeCurrent() {
                !function oP(n) {
                    sl || (sl = n)
                }(new Oh)
            }

            onAndCancel(t, e, r) {
                return t.addEventListener(e, r, !1), () => {
                    t.removeEventListener(e, r, !1)
                }
            }

            dispatchEvent(t, e) {
                t.dispatchEvent(e)
            }

            remove(t) {
                t.parentNode && t.parentNode.removeChild(t)
            }

            createElement(t, e) {
                return (e = e || this.getDefaultDocument()).createElement(t)
            }

            createHtmlDocument() {
                return document.implementation.createHTMLDocument("fakeTitle")
            }

            getDefaultDocument() {
                return document
            }

            isElementNode(t) {
                return t.nodeType === Node.ELEMENT_NODE
            }

            isShadowRoot(t) {
                return t instanceof DocumentFragment
            }

            getGlobalEventTarget(t, e) {
                return "window" === e ? window : "document" === e ? t : "body" === e ? t.body : null
            }

            getBaseHref(t) {
                const e = function FF() {
                    return ho = ho || document.querySelector("base"), ho ? ho.getAttribute("href") : null
                }();
                return null == e ? null : function NF(n) {
                    gl = gl || document.createElement("a"), gl.setAttribute("href", n);
                    const t = gl.pathname;
                    return "/" === t.charAt(0) ? t : `/${t}`
                }(e)
            }

            resetBaseElement() {
                ho = null
            }

            getUserAgent() {
                return window.navigator.userAgent
            }

            getCookie(t) {
                return sD(document.cookie, t)
            }
        }

        let gl, ho = null;
        const _D = new S("TRANSITION_ID"), LF = [{
            provide: Ja, useFactory: function OF(n, t, e) {
                return () => {
                    e.get(Xa).donePromise.then(() => {
                        const r = yr(), i = t.querySelectorAll(`style[ng-transition="${n}"]`);
                        for (let s = 0; s < i.length; s++) r.remove(i[s])
                    })
                }
            }, deps: [_D, _e, Qt], multi: !0
        }];
        let VF = (() => {
            class n {
                build() {
                    return new XMLHttpRequest
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();
        const ml = new S("EventManagerPlugins");
        let _l = (() => {
            class n {
                constructor(e, r) {
                    this._zone = r, this._eventNameToPlugin = new Map, e.forEach(i => i.manager = this), this._plugins = e.slice().reverse()
                }

                addEventListener(e, r, i) {
                    return this._findPluginFor(r).addEventListener(e, r, i)
                }

                addGlobalEventListener(e, r, i) {
                    return this._findPluginFor(r).addGlobalEventListener(e, r, i)
                }

                getZone() {
                    return this._zone
                }

                _findPluginFor(e) {
                    const r = this._eventNameToPlugin.get(e);
                    if (r) return r;
                    const i = this._plugins;
                    for (let s = 0; s < i.length; s++) {
                        const o = i[s];
                        if (o.supports(e)) return this._eventNameToPlugin.set(e, o), o
                    }
                    throw new Error(`No event manager plugin found for event ${e}`)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(ml), w(Z))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();

        class yD {
            constructor(t) {
                this._doc = t
            }

            addGlobalEventListener(t, e, r) {
                const i = yr().getGlobalEventTarget(this._doc, t);
                if (!i) throw new Error(`Unsupported event target ${i} for event ${e}`);
                return this.addEventListener(i, e, r)
            }
        }

        let vD = (() => {
            class n {
                constructor() {
                    this._stylesSet = new Set
                }

                addStyles(e) {
                    const r = new Set;
                    e.forEach(i => {
                        this._stylesSet.has(i) || (this._stylesSet.add(i), r.add(i))
                    }), this.onStylesAdded(r)
                }

                onStylesAdded(e) {
                }

                getAllStyles() {
                    return Array.from(this._stylesSet)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })(), fo = (() => {
            class n extends vD {
                constructor(e) {
                    super(), this._doc = e, this._hostNodes = new Map, this._hostNodes.set(e.head, [])
                }

                _addStylesToHost(e, r, i) {
                    e.forEach(s => {
                        const o = this._doc.createElement("style");
                        o.textContent = s, i.push(r.appendChild(o))
                    })
                }

                addHost(e) {
                    const r = [];
                    this._addStylesToHost(this._stylesSet, e, r), this._hostNodes.set(e, r)
                }

                removeHost(e) {
                    const r = this._hostNodes.get(e);
                    r && r.forEach(bD), this._hostNodes.delete(e)
                }

                onStylesAdded(e) {
                    this._hostNodes.forEach((r, i) => {
                        this._addStylesToHost(e, i, r)
                    })
                }

                ngOnDestroy() {
                    this._hostNodes.forEach(e => e.forEach(bD))
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(_e))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();

        function bD(n) {
            yr().remove(n)
        }

        const Lh = {
            svg: "http://www.w3.org/2000/svg",
            xhtml: "http://www.w3.org/1999/xhtml",
            xlink: "http://www.w3.org/1999/xlink",
            xml: "http://www.w3.org/XML/1998/namespace",
            xmlns: "http://www.w3.org/2000/xmlns/",
            math: "http://www.w3.org/1998/MathML/"
        }, Bh = /%COMP%/g;

        function yl(n, t, e) {
            for (let r = 0; r < t.length; r++) {
                let i = t[r];
                Array.isArray(i) ? yl(n, i, e) : (i = i.replace(Bh, n), e.push(i))
            }
            return e
        }

        function CD(n) {
            return t => {
                if ("__ngUnwrap__" === t) return n;
                !1 === n(t) && (t.preventDefault(), t.returnValue = !1)
            }
        }

        let vl = (() => {
            class n {
                constructor(e, r, i) {
                    this.eventManager = e, this.sharedStylesHost = r, this.appId = i, this.rendererByCompId = new Map, this.defaultRenderer = new Vh(e)
                }

                createRenderer(e, r) {
                    if (!e || !r) return this.defaultRenderer;
                    switch (r.encapsulation) {
                        case an.Emulated: {
                            let i = this.rendererByCompId.get(r.id);
                            return i || (i = new WF(this.eventManager, this.sharedStylesHost, r, this.appId), this.rendererByCompId.set(r.id, i)), i.applyToHost(e), i
                        }
                        case 1:
                        case an.ShadowDom:
                            return new GF(this.eventManager, this.sharedStylesHost, e, r);
                        default:
                            if (!this.rendererByCompId.has(r.id)) {
                                const i = yl(r.id, r.styles, []);
                                this.sharedStylesHost.addStyles(i), this.rendererByCompId.set(r.id, this.defaultRenderer)
                            }
                            return this.defaultRenderer
                    }
                }

                begin() {
                }

                end() {
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(_l), w(fo), w(oo))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();

        class Vh {
            constructor(t) {
                this.eventManager = t, this.data = Object.create(null), this.destroyNode = null
            }

            destroy() {
            }

            createElement(t, e) {
                return e ? document.createElementNS(Lh[e] || e, t) : document.createElement(t)
            }

            createComment(t) {
                return document.createComment(t)
            }

            createText(t) {
                return document.createTextNode(t)
            }

            appendChild(t, e) {
                (MD(t) ? t.content : t).appendChild(e)
            }

            insertBefore(t, e, r) {
                t && (MD(t) ? t.content : t).insertBefore(e, r)
            }

            removeChild(t, e) {
                t && t.removeChild(e)
            }

            selectRootElement(t, e) {
                let r = "string" == typeof t ? document.querySelector(t) : t;
                if (!r) throw new Error(`The selector "${t}" did not match any elements`);
                return e || (r.textContent = ""), r
            }

            parentNode(t) {
                return t.parentNode
            }

            nextSibling(t) {
                return t.nextSibling
            }

            setAttribute(t, e, r, i) {
                if (i) {
                    e = i + ":" + e;
                    const s = Lh[i];
                    s ? t.setAttributeNS(s, e, r) : t.setAttribute(e, r)
                } else t.setAttribute(e, r)
            }

            removeAttribute(t, e, r) {
                if (r) {
                    const i = Lh[r];
                    i ? t.removeAttributeNS(i, e) : t.removeAttribute(`${r}:${e}`)
                } else t.removeAttribute(e)
            }

            addClass(t, e) {
                t.classList.add(e)
            }

            removeClass(t, e) {
                t.classList.remove(e)
            }

            setStyle(t, e, r, i) {
                i & (Mt.DashCase | Mt.Important) ? t.style.setProperty(e, r, i & Mt.Important ? "important" : "") : t.style[e] = r
            }

            removeStyle(t, e, r) {
                r & Mt.DashCase ? t.style.removeProperty(e) : t.style[e] = ""
            }

            setProperty(t, e, r) {
                t[e] = r
            }

            setValue(t, e) {
                t.nodeValue = e
            }

            listen(t, e, r) {
                return "string" == typeof t ? this.eventManager.addGlobalEventListener(t, e, CD(r)) : this.eventManager.addEventListener(t, e, CD(r))
            }
        }

        function MD(n) {
            return "TEMPLATE" === n.tagName && void 0 !== n.content
        }

        class WF extends Vh {
            constructor(t, e, r, i) {
                super(t), this.component = r;
                const s = yl(i + "-" + r.id, r.styles, []);
                e.addStyles(s), this.contentAttr = function UF(n) {
                    return "_ngcontent-%COMP%".replace(Bh, n)
                }(i + "-" + r.id), this.hostAttr = function $F(n) {
                    return "_nghost-%COMP%".replace(Bh, n)
                }(i + "-" + r.id)
            }

            applyToHost(t) {
                super.setAttribute(t, this.hostAttr, "")
            }

            createElement(t, e) {
                const r = super.createElement(t, e);
                return super.setAttribute(r, this.contentAttr, ""), r
            }
        }

        class GF extends Vh {
            constructor(t, e, r, i) {
                super(t), this.sharedStylesHost = e, this.hostEl = r, this.shadowRoot = r.attachShadow({mode: "open"}), this.sharedStylesHost.addHost(this.shadowRoot);
                const s = yl(i.id, i.styles, []);
                for (let o = 0; o < s.length; o++) {
                    const a = document.createElement("style");
                    a.textContent = s[o], this.shadowRoot.appendChild(a)
                }
            }

            nodeOrShadowRoot(t) {
                return t === this.hostEl ? this.shadowRoot : t
            }

            destroy() {
                this.sharedStylesHost.removeHost(this.shadowRoot)
            }

            appendChild(t, e) {
                return super.appendChild(this.nodeOrShadowRoot(t), e)
            }

            insertBefore(t, e, r) {
                return super.insertBefore(this.nodeOrShadowRoot(t), e, r)
            }

            removeChild(t, e) {
                return super.removeChild(this.nodeOrShadowRoot(t), e)
            }

            parentNode(t) {
                return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
            }
        }

        let qF = (() => {
            class n extends yD {
                constructor(e) {
                    super(e)
                }

                supports(e) {
                    return !0
                }

                addEventListener(e, r, i) {
                    return e.addEventListener(r, i, !1), () => this.removeEventListener(e, r, i)
                }

                removeEventListener(e, r, i) {
                    return e.removeEventListener(r, i)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(_e))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();
        const SD = ["alt", "control", "meta", "shift"], QF = {
            "\b": "Backspace",
            "\t": "Tab",
            "\x7f": "Delete",
            "\x1b": "Escape",
            Del: "Delete",
            Esc: "Escape",
            Left: "ArrowLeft",
            Right: "ArrowRight",
            Up: "ArrowUp",
            Down: "ArrowDown",
            Menu: "ContextMenu",
            Scroll: "ScrollLock",
            Win: "OS"
        }, TD = {
            A: "1",
            B: "2",
            C: "3",
            D: "4",
            E: "5",
            F: "6",
            G: "7",
            H: "8",
            I: "9",
            J: "*",
            K: "+",
            M: "-",
            N: ".",
            O: "/",
            "`": "0",
            "\x90": "NumLock"
        }, ZF = {alt: n => n.altKey, control: n => n.ctrlKey, meta: n => n.metaKey, shift: n => n.shiftKey};
        let YF = (() => {
            class n extends yD {
                constructor(e) {
                    super(e)
                }

                supports(e) {
                    return null != n.parseEventName(e)
                }

                addEventListener(e, r, i) {
                    const s = n.parseEventName(r), o = n.eventCallback(s.fullKey, i, this.manager.getZone());
                    return this.manager.getZone().runOutsideAngular(() => yr().onAndCancel(e, s.domEventName, o))
                }

                static parseEventName(e) {
                    const r = e.toLowerCase().split("."), i = r.shift();
                    if (0 === r.length || "keydown" !== i && "keyup" !== i) return null;
                    const s = n._normalizeKey(r.pop());
                    let o = "";
                    if (SD.forEach(l => {
                        const c = r.indexOf(l);
                        c > -1 && (r.splice(c, 1), o += l + ".")
                    }), o += s, 0 != r.length || 0 === s.length) return null;
                    const a = {};
                    return a.domEventName = i, a.fullKey = o, a
                }

                static getEventFullKey(e) {
                    let r = "", i = function JF(n) {
                        let t = n.key;
                        if (null == t) {
                            if (t = n.keyIdentifier, null == t) return "Unidentified";
                            t.startsWith("U+") && (t = String.fromCharCode(parseInt(t.substring(2), 16)), 3 === n.location && TD.hasOwnProperty(t) && (t = TD[t]))
                        }
                        return QF[t] || t
                    }(e);
                    return i = i.toLowerCase(), " " === i ? i = "space" : "." === i && (i = "dot"), SD.forEach(s => {
                        s != i && (0, ZF[s])(e) && (r += s + ".")
                    }), r += i, r
                }

                static eventCallback(e, r, i) {
                    return s => {
                        n.getEventFullKey(s) === e && i.runGuarded(() => r(s))
                    }
                }

                static _normalizeKey(e) {
                    return "esc" === e ? "escape" : e
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(_e))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();
        const nN = Tb(rP, "browser", [{provide: el, useValue: pD}, {
                provide: _b, useValue: function XF() {
                    Oh.makeCurrent()
                }, multi: !0
            }, {
                provide: _e, useFactory: function tN() {
                    return function fS(n) {
                        Du = n
                    }(document), document
                }, deps: []
            }]), AD = new S(""), RD = [{
                provide: tl, useClass: class BF {
                    addToWindow(t) {
                        de.getAngularTestability = (r, i = !0) => {
                            const s = t.findTestabilityInTree(r, i);
                            if (null == s) throw new Error("Could not find testability for element.");
                            return s
                        }, de.getAllAngularTestabilities = () => t.getAllTestabilities(), de.getAllAngularRootElements = () => t.getAllRootElements(), de.frameworkStabilizers || (de.frameworkStabilizers = []), de.frameworkStabilizers.push(r => {
                            const i = de.getAllAngularTestabilities();
                            let s = i.length, o = !1;
                            const a = function (l) {
                                o = o || l, s--, 0 == s && r(o)
                            };
                            i.forEach(function (l) {
                                l.whenStable(a)
                            })
                        })
                    }

                    findTestabilityInTree(t, e, r) {
                        return null == e ? null : t.getTestability(e) ?? (r ? yr().isShadowRoot(e) ? this.findTestabilityInTree(t, e.host, !0) : this.findTestabilityInTree(t, e.parentElement, !0) : null)
                    }
                }, deps: []
            }, {provide: Cb, useClass: ch, deps: [Z, uh, tl]}, {provide: ch, useClass: ch, deps: [Z, uh, tl]}],
            xD = [{provide: ku, useValue: "root"}, {
                provide: Si, useFactory: function eN() {
                    return new Si
                }, deps: []
            }, {provide: ml, useClass: qF, multi: !0, deps: [_e, Z, el]}, {
                provide: ml,
                useClass: YF,
                multi: !0,
                deps: [_e]
            }, {provide: vl, useClass: vl, deps: [_l, fo, oo]}, {provide: Us, useExisting: vl}, {
                provide: vD,
                useExisting: fo
            }, {provide: fo, useClass: fo, deps: [_e]}, {provide: _l, useClass: _l, deps: [ml, Z]}, {
                provide: mD,
                useClass: VF,
                deps: []
            }, []];
        let kD = (() => {
            class n {
                constructor(e) {
                }

                static withServerTransition(e) {
                    return {
                        ngModule: n,
                        providers: [{provide: oo, useValue: e.appId}, {provide: _D, useExisting: oo}, LF]
                    }
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(AD, 12))
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({providers: [...xD, ...RD], imports: [fD, iP]}), n
        })(), PD = (() => {
            class n {
                constructor(e) {
                    this._doc = e
                }

                getTitle() {
                    return this._doc.title
                }

                setTitle(e) {
                    this._doc.title = e || ""
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(_e))
            }, n.\u0275prov = A({
                token: n, factory: function (e) {
                    let r = null;
                    return r = e ? new e : function iN() {
                        return new PD(w(_e))
                    }(), r
                }, providedIn: "root"
            }), n
        })();

        function R(...n) {
            return Oe(n, vs(n))
        }

        typeof window < "u" && window;

        class Ot extends ve {
            constructor(t) {
                super(), this._value = t
            }

            get value() {
                return this.getValue()
            }

            _subscribe(t) {
                const e = super._subscribe(t);
                return !e.closed && t.next(this._value), e
            }

            getValue() {
                const {hasError: t, thrownError: e, _value: r} = this;
                if (t) throw e;
                return this._throwIfClosed(), r
            }

            next(t) {
                super.next(this._value = t)
            }
        }

        const bl = Sc(n => function () {
            n(this), this.name = "EmptyError", this.message = "no elements in sequence"
        }), {isArray: hN} = Array, {getPrototypeOf: fN, prototype: pN, keys: gN} = Object;
        const {isArray: yN} = Array;

        function OD(n) {
            return W(t => function vN(n, t) {
                return yN(t) ? n(...t) : n(t)
            }(n, t))
        }

        function Uh(...n) {
            const t = vs(n), e = function S0(n) {
                return J(Oc(n)) ? n.pop() : void 0
            }(n), {args: r, keys: i} = function mN(n) {
                if (1 === n.length) {
                    const t = n[0];
                    if (hN(t)) return {args: t, keys: null};
                    if (function _N(n) {
                        return n && "object" == typeof n && fN(n) === pN
                    }(t)) {
                        const e = gN(t);
                        return {args: e.map(r => t[r]), keys: e}
                    }
                }
                return {args: n, keys: null}
            }(n);
            if (0 === r.length) return Oe([], t);
            const s = new fe(function DN(n, t, e = rr) {
                return r => {
                    LD(t, () => {
                        const {length: i} = n, s = new Array(i);
                        let o = i, a = i;
                        for (let l = 0; l < i; l++) LD(t, () => {
                            const c = Oe(n[l], t);
                            let u = !1;
                            c.subscribe(be(r, d => {
                                s[l] = d, u || (u = !0, a--), a || r.next(e(s.slice()))
                            }, () => {
                                --o || r.complete()
                            }))
                        }, r)
                    }, r)
                }
            }(r, t, i ? o => function bN(n, t) {
                return n.reduce((e, r, i) => (e[r] = t[i], e), {})
            }(i, o) : rr));
            return e ? s.pipe(OD(e)) : s
        }

        function LD(n, t, e) {
            n ? Nn(e, n, t) : t()
        }

        function Dl(...n) {
            return function wN() {
                return ri(1)
            }()(Oe(n, vs(n)))
        }

        function BD(n) {
            return new fe(t => {
                Dt(n()).subscribe(t)
            })
        }

        function po(n, t) {
            const e = J(n) ? n : () => n, r = i => i.error(e());
            return new fe(t ? i => t.schedule(r, 0, i) : r)
        }

        function $h() {
            return Ee((n, t) => {
                let e = null;
                n._refCount++;
                const r = be(t, void 0, void 0, void 0, () => {
                    if (!n || n._refCount <= 0 || 0 < --n._refCount) return void (e = null);
                    const i = n._connection, s = e;
                    e = null, i && (!s || i === s) && i.unsubscribe(), t.unsubscribe()
                });
                n.subscribe(r), r.closed || (e = n.connect())
            })
        }

        class VD extends fe {
            constructor(t, e) {
                super(), this.source = t, this.subjectFactory = e, this._subject = null, this._refCount = 0, this._connection = null, Hp(t) && (this.lift = t.lift)
            }

            _subscribe(t) {
                return this.getSubject().subscribe(t)
            }

            getSubject() {
                const t = this._subject;
                return (!t || t.isStopped) && (this._subject = this.subjectFactory()), this._subject
            }

            _teardown() {
                this._refCount = 0;
                const {_connection: t} = this;
                this._subject = this._connection = null, t?.unsubscribe()
            }

            connect() {
                let t = this._connection;
                if (!t) {
                    t = this._connection = new Ne;
                    const e = this.getSubject();
                    t.add(this.source.subscribe(be(e, void 0, () => {
                        this._teardown(), e.complete()
                    }, r => {
                        this._teardown(), e.error(r)
                    }, () => this._teardown()))), t.closed && (this._connection = null, t = Ne.EMPTY)
                }
                return t
            }

            refCount() {
                return $h()(this)
            }
        }

        function Xt(n, t) {
            return Ee((e, r) => {
                let i = null, s = 0, o = !1;
                const a = () => o && !i && r.complete();
                e.subscribe(be(r, l => {
                    i?.unsubscribe();
                    let c = 0;
                    const u = s++;
                    Dt(n(l, u)).subscribe(i = be(r, d => r.next(t ? t(l, d, u, c++) : d), () => {
                        i = null, a()
                    }))
                }, () => {
                    o = !0, a()
                }))
            })
        }

        function Rn(n) {
            return n <= 0 ? () => wt : Ee((t, e) => {
                let r = 0;
                t.subscribe(be(e, i => {
                    ++r <= n && (e.next(i), n <= r && e.complete())
                }))
            })
        }

        function go(...n) {
            const t = vs(n);
            return Ee((e, r) => {
                (t ? Dl(n, e, t) : Dl(n, e)).subscribe(r)
            })
        }

        function vn(n, t) {
            return Ee((e, r) => {
                let i = 0;
                e.subscribe(be(r, s => n.call(t, s, i++) && r.next(s)))
            })
        }

        function wl(n) {
            return Ee((t, e) => {
                let r = !1;
                t.subscribe(be(e, i => {
                    r = !0, e.next(i)
                }, () => {
                    r || e.next(n), e.complete()
                }))
            })
        }

        function jD(n = CN) {
            return Ee((t, e) => {
                let r = !1;
                t.subscribe(be(e, i => {
                    r = !0, e.next(i)
                }, () => r ? e.complete() : e.error(n())))
            })
        }

        function CN() {
            return new bl
        }

        function br(n, t) {
            const e = arguments.length >= 2;
            return r => r.pipe(n ? vn((i, s) => n(i, s, r)) : rr, Rn(1), e ? wl(t) : jD(() => new bl))
        }

        function Dr(n, t) {
            return J(t) ? Ze(n, t, 1) : Ze(n, 1)
        }

        function st(n, t, e) {
            const r = J(n) || t || e ? {next: n, error: t, complete: e} : n;
            return r ? Ee((i, s) => {
                var o;
                null === (o = r.subscribe) || void 0 === o || o.call(r);
                let a = !0;
                i.subscribe(be(s, l => {
                    var c;
                    null === (c = r.next) || void 0 === c || c.call(r, l), s.next(l)
                }, () => {
                    var l;
                    a = !1, null === (l = r.complete) || void 0 === l || l.call(r), s.complete()
                }, l => {
                    var c;
                    a = !1, null === (c = r.error) || void 0 === c || c.call(r, l), s.error(l)
                }, () => {
                    var l, c;
                    a && (null === (l = r.unsubscribe) || void 0 === l || l.call(r)), null === (c = r.finalize) || void 0 === c || c.call(r)
                }))
            }) : rr
        }

        function wr(n) {
            return Ee((t, e) => {
                let s, r = null, i = !1;
                r = t.subscribe(be(e, void 0, void 0, o => {
                    s = Dt(n(o, wr(n)(t))), r ? (r.unsubscribe(), r = null, s.subscribe(e)) : i = !0
                })), i && (r.unsubscribe(), r = null, s.subscribe(e))
            })
        }

        function EN(n, t, e, r, i) {
            return (s, o) => {
                let a = e, l = t, c = 0;
                s.subscribe(be(o, u => {
                    const d = c++;
                    l = a ? n(l, u, d) : (a = !0, u), r && o.next(l)
                }, i && (() => {
                    a && o.next(l), o.complete()
                })))
            }
        }

        function HD(n, t) {
            return Ee(EN(n, t, arguments.length >= 2, !0))
        }

        function zh(n) {
            return n <= 0 ? () => wt : Ee((t, e) => {
                let r = [];
                t.subscribe(be(e, i => {
                    r.push(i), n < r.length && r.shift()
                }, () => {
                    for (const i of r) e.next(i);
                    e.complete()
                }, void 0, () => {
                    r = null
                }))
            })
        }

        function UD(n, t) {
            const e = arguments.length >= 2;
            return r => r.pipe(n ? vn((i, s) => n(i, s, r)) : rr, zh(1), e ? wl(t) : jD(() => new bl))
        }

        function Wh(n) {
            return Ee((t, e) => {
                try {
                    t.subscribe(e)
                } finally {
                    e.add(n)
                }
            })
        }

        const G = "primary";

        class TN {
            constructor(t) {
                this.params = t || {}
            }

            has(t) {
                return Object.prototype.hasOwnProperty.call(this.params, t)
            }

            get(t) {
                if (this.has(t)) {
                    const e = this.params[t];
                    return Array.isArray(e) ? e[0] : e
                }
                return null
            }

            getAll(t) {
                if (this.has(t)) {
                    const e = this.params[t];
                    return Array.isArray(e) ? e : [e]
                }
                return []
            }

            get keys() {
                return Object.keys(this.params)
            }
        }

        function Xi(n) {
            return new TN(n)
        }

        function IN(n, t, e) {
            const r = e.path.split("/");
            if (r.length > n.length || "full" === e.pathMatch && (t.hasChildren() || r.length < n.length)) return null;
            const i = {};
            for (let s = 0; s < r.length; s++) {
                const o = r[s], a = n[s];
                if (o.startsWith(":")) i[o.substring(1)] = a; else if (o !== a.path) return null
            }
            return {consumed: n.slice(0, r.length), posParams: i}
        }

        function xn(n, t) {
            const e = n ? Object.keys(n) : void 0, r = t ? Object.keys(t) : void 0;
            if (!e || !r || e.length != r.length) return !1;
            let i;
            for (let s = 0; s < e.length; s++) if (i = e[s], !$D(n[i], t[i])) return !1;
            return !0
        }

        function $D(n, t) {
            if (Array.isArray(n) && Array.isArray(t)) {
                if (n.length !== t.length) return !1;
                const e = [...n].sort(), r = [...t].sort();
                return e.every((i, s) => r[s] === i)
            }
            return n === t
        }

        function zD(n) {
            return Array.prototype.concat.apply([], n)
        }

        function WD(n) {
            return n.length > 0 ? n[n.length - 1] : null
        }

        function ot(n, t) {
            for (const e in n) n.hasOwnProperty(e) && t(n[e], e)
        }

        function Qn(n) {
            return ly(n) ? n : Ua(n) ? Oe(Promise.resolve(n)) : R(n)
        }

        const xN = {
            exact: function KD(n, t, e) {
                if (!Kr(n.segments, t.segments) || !Cl(n.segments, t.segments, e) || n.numberOfChildren !== t.numberOfChildren) return !1;
                for (const r in t.children) if (!n.children[r] || !KD(n.children[r], t.children[r], e)) return !1;
                return !0
            }, subset: QD
        }, GD = {
            exact: function kN(n, t) {
                return xn(n, t)
            }, subset: function PN(n, t) {
                return Object.keys(t).length <= Object.keys(n).length && Object.keys(t).every(e => $D(n[e], t[e]))
            }, ignored: () => !0
        };

        function qD(n, t, e) {
            return xN[e.paths](n.root, t.root, e.matrixParams) && GD[e.queryParams](n.queryParams, t.queryParams) && !("exact" === e.fragment && n.fragment !== t.fragment)
        }

        function QD(n, t, e) {
            return ZD(n, t, t.segments, e)
        }

        function ZD(n, t, e, r) {
            if (n.segments.length > e.length) {
                const i = n.segments.slice(0, e.length);
                return !(!Kr(i, e) || t.hasChildren() || !Cl(i, e, r))
            }
            if (n.segments.length === e.length) {
                if (!Kr(n.segments, e) || !Cl(n.segments, e, r)) return !1;
                for (const i in t.children) if (!n.children[i] || !QD(n.children[i], t.children[i], r)) return !1;
                return !0
            }
            {
                const i = e.slice(0, n.segments.length), s = e.slice(n.segments.length);
                return !!(Kr(n.segments, i) && Cl(n.segments, i, r) && n.children[G]) && ZD(n.children[G], t, s, r)
            }
        }

        function Cl(n, t, e) {
            return t.every((r, i) => GD[e](n[i].parameters, r.parameters))
        }

        class qr {
            constructor(t, e, r) {
                this.root = t, this.queryParams = e, this.fragment = r
            }

            get queryParamMap() {
                return this._queryParamMap || (this._queryParamMap = Xi(this.queryParams)), this._queryParamMap
            }

            toString() {
                return ON.serialize(this)
            }
        }

        class q {
            constructor(t, e) {
                this.segments = t, this.children = e, this.parent = null, ot(e, (r, i) => r.parent = this)
            }

            hasChildren() {
                return this.numberOfChildren > 0
            }

            get numberOfChildren() {
                return Object.keys(this.children).length
            }

            toString() {
                return El(this)
            }
        }

        class mo {
            constructor(t, e) {
                this.path = t, this.parameters = e
            }

            get parameterMap() {
                return this._parameterMap || (this._parameterMap = Xi(this.parameters)), this._parameterMap
            }

            toString() {
                return ew(this)
            }
        }

        function Kr(n, t) {
            return n.length === t.length && n.every((e, r) => e.path === t[r].path)
        }

        let YD = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({
                token: n, factory: function () {
                    return new qh
                }, providedIn: "root"
            }), n
        })();

        class qh {
            parse(t) {
                const e = new WN(t);
                return new qr(e.parseRootSegment(), e.parseQueryParams(), e.parseFragment())
            }

            serialize(t) {
                const e = `/${_o(t.root, !0)}`, r = function VN(n) {
                    const t = Object.keys(n).map(e => {
                        const r = n[e];
                        return Array.isArray(r) ? r.map(i => `${Ml(e)}=${Ml(i)}`).join("&") : `${Ml(e)}=${Ml(r)}`
                    }).filter(e => !!e);
                    return t.length ? `?${t.join("&")}` : ""
                }(t.queryParams);
                return `${e}${r}${"string" == typeof t.fragment ? `#${function LN(n) {
                    return encodeURI(n)
                }(t.fragment)}` : ""}`
            }
        }

        const ON = new qh;

        function El(n) {
            return n.segments.map(t => ew(t)).join("/")
        }

        function _o(n, t) {
            if (!n.hasChildren()) return El(n);
            if (t) {
                const e = n.children[G] ? _o(n.children[G], !1) : "", r = [];
                return ot(n.children, (i, s) => {
                    s !== G && r.push(`${s}:${_o(i, !1)}`)
                }), r.length > 0 ? `${e}(${r.join("//")})` : e
            }
            {
                const e = function NN(n, t) {
                    let e = [];
                    return ot(n.children, (r, i) => {
                        i === G && (e = e.concat(t(r, i)))
                    }), ot(n.children, (r, i) => {
                        i !== G && (e = e.concat(t(r, i)))
                    }), e
                }(n, (r, i) => i === G ? [_o(n.children[G], !1)] : [`${i}:${_o(r, !1)}`]);
                return 1 === Object.keys(n.children).length && null != n.children[G] ? `${El(n)}/${e[0]}` : `${El(n)}/(${e.join("//")})`
            }
        }

        function JD(n) {
            return encodeURIComponent(n).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
        }

        function Ml(n) {
            return JD(n).replace(/%3B/gi, ";")
        }

        function Kh(n) {
            return JD(n).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
        }

        function Sl(n) {
            return decodeURIComponent(n)
        }

        function XD(n) {
            return Sl(n.replace(/\+/g, "%20"))
        }

        function ew(n) {
            return `${Kh(n.path)}${function BN(n) {
                return Object.keys(n).map(t => `;${Kh(t)}=${Kh(n[t])}`).join("")
            }(n.parameters)}`
        }

        const jN = /^[^\/()?;=#]+/;

        function Tl(n) {
            const t = n.match(jN);
            return t ? t[0] : ""
        }

        const HN = /^[^=?&#]+/, $N = /^[^&#]+/;

        class WN {
            constructor(t) {
                this.url = t, this.remaining = t
            }

            parseRootSegment() {
                return this.consumeOptional("/"), "" === this.remaining || this.peekStartsWith("?") || this.peekStartsWith("#") ? new q([], {}) : new q([], this.parseChildren())
            }

            parseQueryParams() {
                const t = {};
                if (this.consumeOptional("?")) do {
                    this.parseQueryParam(t)
                } while (this.consumeOptional("&"));
                return t
            }

            parseFragment() {
                return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
            }

            parseChildren() {
                if ("" === this.remaining) return {};
                this.consumeOptional("/");
                const t = [];
                for (this.peekStartsWith("(") || t.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");) this.capture("/"), t.push(this.parseSegment());
                let e = {};
                this.peekStartsWith("/(") && (this.capture("/"), e = this.parseParens(!0));
                let r = {};
                return this.peekStartsWith("(") && (r = this.parseParens(!1)), (t.length > 0 || Object.keys(e).length > 0) && (r[G] = new q(t, e)), r
            }

            parseSegment() {
                const t = Tl(this.remaining);
                if ("" === t && this.peekStartsWith(";")) throw new D(4009, !1);
                return this.capture(t), new mo(Sl(t), this.parseMatrixParams())
            }

            parseMatrixParams() {
                const t = {};
                for (; this.consumeOptional(";");) this.parseParam(t);
                return t
            }

            parseParam(t) {
                const e = Tl(this.remaining);
                if (!e) return;
                this.capture(e);
                let r = "";
                if (this.consumeOptional("=")) {
                    const i = Tl(this.remaining);
                    i && (r = i, this.capture(r))
                }
                t[Sl(e)] = Sl(r)
            }

            parseQueryParam(t) {
                const e = function UN(n) {
                    const t = n.match(HN);
                    return t ? t[0] : ""
                }(this.remaining);
                if (!e) return;
                this.capture(e);
                let r = "";
                if (this.consumeOptional("=")) {
                    const o = function zN(n) {
                        const t = n.match($N);
                        return t ? t[0] : ""
                    }(this.remaining);
                    o && (r = o, this.capture(r))
                }
                const i = XD(e), s = XD(r);
                if (t.hasOwnProperty(i)) {
                    let o = t[i];
                    Array.isArray(o) || (o = [o], t[i] = o), o.push(s)
                } else t[i] = s
            }

            parseParens(t) {
                const e = {};
                for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0;) {
                    const r = Tl(this.remaining), i = this.remaining[r.length];
                    if ("/" !== i && ")" !== i && ";" !== i) throw new D(4010, !1);
                    let s;
                    r.indexOf(":") > -1 ? (s = r.slice(0, r.indexOf(":")), this.capture(s), this.capture(":")) : t && (s = G);
                    const o = this.parseChildren();
                    e[s] = 1 === Object.keys(o).length ? o[G] : new q([], o), this.consumeOptional("//")
                }
                return e
            }

            peekStartsWith(t) {
                return this.remaining.startsWith(t)
            }

            consumeOptional(t) {
                return !!this.peekStartsWith(t) && (this.remaining = this.remaining.substring(t.length), !0)
            }

            capture(t) {
                if (!this.consumeOptional(t)) throw new D(4011, !1)
            }
        }

        function Qh(n) {
            return n.segments.length > 0 ? new q([], {[G]: n}) : n
        }

        function Il(n) {
            const t = {};
            for (const r of Object.keys(n.children)) {
                const s = Il(n.children[r]);
                (s.segments.length > 0 || s.hasChildren()) && (t[r] = s)
            }
            return function GN(n) {
                if (1 === n.numberOfChildren && n.children[G]) {
                    const t = n.children[G];
                    return new q(n.segments.concat(t.segments), t.children)
                }
                return n
            }(new q(n.segments, t))
        }

        function Qr(n) {
            return n instanceof qr
        }

        function QN(n, t, e, r, i) {
            if (0 === e.length) return es(t.root, t.root, t.root, r, i);
            const s = function rw(n) {
                if ("string" == typeof n[0] && 1 === n.length && "/" === n[0]) return new nw(!0, 0, n);
                let t = 0, e = !1;
                const r = n.reduce((i, s, o) => {
                    if ("object" == typeof s && null != s) {
                        if (s.outlets) {
                            const a = {};
                            return ot(s.outlets, (l, c) => {
                                a[c] = "string" == typeof l ? l.split("/") : l
                            }), [...i, {outlets: a}]
                        }
                        if (s.segmentPath) return [...i, s.segmentPath]
                    }
                    return "string" != typeof s ? [...i, s] : 0 === o ? (s.split("/").forEach((a, l) => {
                        0 == l && "." === a || (0 == l && "" === a ? e = !0 : ".." === a ? t++ : "" != a && i.push(a))
                    }), i) : [...i, s]
                }, []);
                return new nw(e, t, r)
            }(e);
            return s.toRoot() ? es(t.root, t.root, new q([], {}), r, i) : function o(l) {
                const c = function YN(n, t, e, r) {
                        if (n.isAbsolute) return new ts(t.root, !0, 0);
                        if (-1 === r) return new ts(e, e === t.root, 0);
                        return function iw(n, t, e) {
                            let r = n, i = t, s = e;
                            for (; s > i;) {
                                if (s -= i, r = r.parent, !r) throw new D(4005, !1);
                                i = r.segments.length
                            }
                            return new ts(r, !1, i - s)
                        }(e, r + (yo(n.commands[0]) ? 0 : 1), n.numberOfDoubleDots)
                    }(s, t, n.snapshot?._urlSegment, l),
                    u = c.processChildren ? bo(c.segmentGroup, c.index, s.commands) : Yh(c.segmentGroup, c.index, s.commands);
                return es(t.root, c.segmentGroup, u, r, i)
            }(n.snapshot?._lastPathIndex)
        }

        function yo(n) {
            return "object" == typeof n && null != n && !n.outlets && !n.segmentPath
        }

        function vo(n) {
            return "object" == typeof n && null != n && n.outlets
        }

        function es(n, t, e, r, i) {
            let o, s = {};
            r && ot(r, (l, c) => {
                s[c] = Array.isArray(l) ? l.map(u => `${u}`) : `${l}`
            }), o = n === t ? e : tw(n, t, e);
            const a = Qh(Il(o));
            return new qr(a, s, i)
        }

        function tw(n, t, e) {
            const r = {};
            return ot(n.children, (i, s) => {
                r[s] = i === t ? e : tw(i, t, e)
            }), new q(n.segments, r)
        }

        class nw {
            constructor(t, e, r) {
                if (this.isAbsolute = t, this.numberOfDoubleDots = e, this.commands = r, t && r.length > 0 && yo(r[0])) throw new D(4003, !1);
                const i = r.find(vo);
                if (i && i !== WD(r)) throw new D(4004, !1)
            }

            toRoot() {
                return this.isAbsolute && 1 === this.commands.length && "/" == this.commands[0]
            }
        }

        class ts {
            constructor(t, e, r) {
                this.segmentGroup = t, this.processChildren = e, this.index = r
            }
        }

        function Yh(n, t, e) {
            if (n || (n = new q([], {})), 0 === n.segments.length && n.hasChildren()) return bo(n, t, e);
            const r = function XN(n, t, e) {
                let r = 0, i = t;
                const s = {match: !1, pathIndex: 0, commandIndex: 0};
                for (; i < n.segments.length;) {
                    if (r >= e.length) return s;
                    const o = n.segments[i], a = e[r];
                    if (vo(a)) break;
                    const l = `${a}`, c = r < e.length - 1 ? e[r + 1] : null;
                    if (i > 0 && void 0 === l) break;
                    if (l && c && "object" == typeof c && void 0 === c.outlets) {
                        if (!ow(l, c, o)) return s;
                        r += 2
                    } else {
                        if (!ow(l, {}, o)) return s;
                        r++
                    }
                    i++
                }
                return {match: !0, pathIndex: i, commandIndex: r}
            }(n, t, e), i = e.slice(r.commandIndex);
            if (r.match && r.pathIndex < n.segments.length) {
                const s = new q(n.segments.slice(0, r.pathIndex), {});
                return s.children[G] = new q(n.segments.slice(r.pathIndex), n.children), bo(s, 0, i)
            }
            return r.match && 0 === i.length ? new q(n.segments, {}) : r.match && !n.hasChildren() ? Jh(n, t, e) : r.match ? bo(n, 0, i) : Jh(n, t, e)
        }

        function bo(n, t, e) {
            if (0 === e.length) return new q(n.segments, {});
            {
                const r = function JN(n) {
                    return vo(n[0]) ? n[0].outlets : {[G]: n}
                }(e), i = {};
                return ot(r, (s, o) => {
                    "string" == typeof s && (s = [s]), null !== s && (i[o] = Yh(n.children[o], t, s))
                }), ot(n.children, (s, o) => {
                    void 0 === r[o] && (i[o] = s)
                }), new q(n.segments, i)
            }
        }

        function Jh(n, t, e) {
            const r = n.segments.slice(0, t);
            let i = 0;
            for (; i < e.length;) {
                const s = e[i];
                if (vo(s)) {
                    const l = eO(s.outlets);
                    return new q(r, l)
                }
                if (0 === i && yo(e[0])) {
                    r.push(new mo(n.segments[t].path, sw(e[0]))), i++;
                    continue
                }
                const o = vo(s) ? s.outlets[G] : `${s}`, a = i < e.length - 1 ? e[i + 1] : null;
                o && a && yo(a) ? (r.push(new mo(o, sw(a))), i += 2) : (r.push(new mo(o, {})), i++)
            }
            return new q(r, {})
        }

        function eO(n) {
            const t = {};
            return ot(n, (e, r) => {
                "string" == typeof e && (e = [e]), null !== e && (t[r] = Jh(new q([], {}), 0, e))
            }), t
        }

        function sw(n) {
            const t = {};
            return ot(n, (e, r) => t[r] = `${e}`), t
        }

        function ow(n, t, e) {
            return n == e.path && xn(t, e.parameters)
        }

        class Zn {
            constructor(t, e) {
                this.id = t, this.url = e
            }
        }

        class Xh extends Zn {
            constructor(t, e, r = "imperative", i = null) {
                super(t, e), this.type = 0, this.navigationTrigger = r, this.restoredState = i
            }

            toString() {
                return `NavigationStart(id: ${this.id}, url: '${this.url}')`
            }
        }

        class Zr extends Zn {
            constructor(t, e, r) {
                super(t, e), this.urlAfterRedirects = r, this.type = 1
            }

            toString() {
                return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
            }
        }

        class Al extends Zn {
            constructor(t, e, r, i) {
                super(t, e), this.reason = r, this.code = i, this.type = 2
            }

            toString() {
                return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
            }
        }

        class aw extends Zn {
            constructor(t, e, r, i) {
                super(t, e), this.error = r, this.target = i, this.type = 3
            }

            toString() {
                return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
            }
        }

        class tO extends Zn {
            constructor(t, e, r, i) {
                super(t, e), this.urlAfterRedirects = r, this.state = i, this.type = 4
            }

            toString() {
                return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }

        class nO extends Zn {
            constructor(t, e, r, i) {
                super(t, e), this.urlAfterRedirects = r, this.state = i, this.type = 7
            }

            toString() {
                return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }

        class rO extends Zn {
            constructor(t, e, r, i, s) {
                super(t, e), this.urlAfterRedirects = r, this.state = i, this.shouldActivate = s, this.type = 8
            }

            toString() {
                return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
            }
        }

        class iO extends Zn {
            constructor(t, e, r, i) {
                super(t, e), this.urlAfterRedirects = r, this.state = i, this.type = 5
            }

            toString() {
                return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }

        class sO extends Zn {
            constructor(t, e, r, i) {
                super(t, e), this.urlAfterRedirects = r, this.state = i, this.type = 6
            }

            toString() {
                return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }

        class oO {
            constructor(t) {
                this.route = t, this.type = 9
            }

            toString() {
                return `RouteConfigLoadStart(path: ${this.route.path})`
            }
        }

        class aO {
            constructor(t) {
                this.route = t, this.type = 10
            }

            toString() {
                return `RouteConfigLoadEnd(path: ${this.route.path})`
            }
        }

        class lO {
            constructor(t) {
                this.snapshot = t, this.type = 11
            }

            toString() {
                return `ChildActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }

        class cO {
            constructor(t) {
                this.snapshot = t, this.type = 12
            }

            toString() {
                return `ChildActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }

        class uO {
            constructor(t) {
                this.snapshot = t, this.type = 13
            }

            toString() {
                return `ActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }

        class dO {
            constructor(t) {
                this.snapshot = t, this.type = 14
            }

            toString() {
                return `ActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }

        class lw {
            constructor(t, e, r) {
                this.routerEvent = t, this.position = e, this.anchor = r, this.type = 15
            }

            toString() {
                return `Scroll(anchor: '${this.anchor}', position: '${this.position ? `${this.position[0]}, ${this.position[1]}` : null}')`
            }
        }

        class cw {
            constructor(t) {
                this._root = t
            }

            get root() {
                return this._root.value
            }

            parent(t) {
                const e = this.pathFromRoot(t);
                return e.length > 1 ? e[e.length - 2] : null
            }

            children(t) {
                const e = ef(t, this._root);
                return e ? e.children.map(r => r.value) : []
            }

            firstChild(t) {
                const e = ef(t, this._root);
                return e && e.children.length > 0 ? e.children[0].value : null
            }

            siblings(t) {
                const e = tf(t, this._root);
                return e.length < 2 ? [] : e[e.length - 2].children.map(i => i.value).filter(i => i !== t)
            }

            pathFromRoot(t) {
                return tf(t, this._root).map(e => e.value)
            }
        }

        function ef(n, t) {
            if (n === t.value) return t;
            for (const e of t.children) {
                const r = ef(n, e);
                if (r) return r
            }
            return null
        }

        function tf(n, t) {
            if (n === t.value) return [t];
            for (const e of t.children) {
                const r = tf(n, e);
                if (r.length) return r.unshift(t), r
            }
            return []
        }

        class Yn {
            constructor(t, e) {
                this.value = t, this.children = e
            }

            toString() {
                return `TreeNode(${this.value})`
            }
        }

        function ns(n) {
            const t = {};
            return n && n.children.forEach(e => t[e.value.outlet] = e), t
        }

        class uw extends cw {
            constructor(t, e) {
                super(t), this.snapshot = e, nf(this, t)
            }

            toString() {
                return this.snapshot.toString()
            }
        }

        function dw(n, t) {
            const e = function fO(n, t) {
                    const o = new Rl([], {}, {}, "", {}, G, t, null, n.root, -1, {});
                    return new fw("", new Yn(o, []))
                }(n, t), r = new Ot([new mo("", {})]), i = new Ot({}), s = new Ot({}), o = new Ot({}), a = new Ot(""),
                l = new rs(r, i, o, a, s, G, t, e.root);
            return l.snapshot = e.root, new uw(new Yn(l, []), e)
        }

        class rs {
            constructor(t, e, r, i, s, o, a, l) {
                this.url = t, this.params = e, this.queryParams = r, this.fragment = i, this.data = s, this.outlet = o, this.component = a, this._futureSnapshot = l
            }

            get routeConfig() {
                return this._futureSnapshot.routeConfig
            }

            get root() {
                return this._routerState.root
            }

            get parent() {
                return this._routerState.parent(this)
            }

            get firstChild() {
                return this._routerState.firstChild(this)
            }

            get children() {
                return this._routerState.children(this)
            }

            get pathFromRoot() {
                return this._routerState.pathFromRoot(this)
            }

            get paramMap() {
                return this._paramMap || (this._paramMap = this.params.pipe(W(t => Xi(t)))), this._paramMap
            }

            get queryParamMap() {
                return this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(W(t => Xi(t)))), this._queryParamMap
            }

            toString() {
                return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
            }
        }

        function hw(n, t = "emptyOnly") {
            const e = n.pathFromRoot;
            let r = 0;
            if ("always" !== t) for (r = e.length - 1; r >= 1;) {
                const i = e[r], s = e[r - 1];
                if (i.routeConfig && "" === i.routeConfig.path) r--; else {
                    if (s.component) break;
                    r--
                }
            }
            return function pO(n) {
                return n.reduce((t, e) => ({
                    params: {...t.params, ...e.params},
                    data: {...t.data, ...e.data},
                    resolve: {...e.data, ...t.resolve, ...e.routeConfig?.data, ...e._resolvedData}
                }), {params: {}, data: {}, resolve: {}})
            }(e.slice(r))
        }

        class Rl {
            constructor(t, e, r, i, s, o, a, l, c, u, d, h) {
                this.url = t, this.params = e, this.queryParams = r, this.fragment = i, this.data = s, this.outlet = o, this.component = a, this.routeConfig = l, this._urlSegment = c, this._lastPathIndex = u, this._correctedLastPathIndex = h ?? u, this._resolve = d
            }

            get root() {
                return this._routerState.root
            }

            get parent() {
                return this._routerState.parent(this)
            }

            get firstChild() {
                return this._routerState.firstChild(this)
            }

            get children() {
                return this._routerState.children(this)
            }

            get pathFromRoot() {
                return this._routerState.pathFromRoot(this)
            }

            get paramMap() {
                return this._paramMap || (this._paramMap = Xi(this.params)), this._paramMap
            }

            get queryParamMap() {
                return this._queryParamMap || (this._queryParamMap = Xi(this.queryParams)), this._queryParamMap
            }

            toString() {
                return `Route(url:'${this.url.map(r => r.toString()).join("/")}', path:'${this.routeConfig ? this.routeConfig.path : ""}')`
            }
        }

        class fw extends cw {
            constructor(t, e) {
                super(e), this.url = t, nf(this, e)
            }

            toString() {
                return pw(this._root)
            }
        }

        function nf(n, t) {
            t.value._routerState = n, t.children.forEach(e => nf(n, e))
        }

        function pw(n) {
            const t = n.children.length > 0 ? ` { ${n.children.map(pw).join(", ")} } ` : "";
            return `${n.value}${t}`
        }

        function rf(n) {
            if (n.snapshot) {
                const t = n.snapshot, e = n._futureSnapshot;
                n.snapshot = e, xn(t.queryParams, e.queryParams) || n.queryParams.next(e.queryParams), t.fragment !== e.fragment && n.fragment.next(e.fragment), xn(t.params, e.params) || n.params.next(e.params), function AN(n, t) {
                    if (n.length !== t.length) return !1;
                    for (let e = 0; e < n.length; ++e) if (!xn(n[e], t[e])) return !1;
                    return !0
                }(t.url, e.url) || n.url.next(e.url), xn(t.data, e.data) || n.data.next(e.data)
            } else n.snapshot = n._futureSnapshot, n.data.next(n._futureSnapshot.data)
        }

        function sf(n, t) {
            const e = xn(n.params, t.params) && function FN(n, t) {
                return Kr(n, t) && n.every((e, r) => xn(e.parameters, t[r].parameters))
            }(n.url, t.url);
            return e && !(!n.parent != !t.parent) && (!n.parent || sf(n.parent, t.parent))
        }

        function Do(n, t, e) {
            if (e && n.shouldReuseRoute(t.value, e.value.snapshot)) {
                const r = e.value;
                r._futureSnapshot = t.value;
                const i = function mO(n, t, e) {
                    return t.children.map(r => {
                        for (const i of e.children) if (n.shouldReuseRoute(r.value, i.value.snapshot)) return Do(n, r, i);
                        return Do(n, r)
                    })
                }(n, t, e);
                return new Yn(r, i)
            }
            {
                if (n.shouldAttach(t.value)) {
                    const s = n.retrieve(t.value);
                    if (null !== s) {
                        const o = s.route;
                        return o.value._futureSnapshot = t.value, o.children = t.children.map(a => Do(n, a)), o
                    }
                }
                const r = function _O(n) {
                    return new rs(new Ot(n.url), new Ot(n.params), new Ot(n.queryParams), new Ot(n.fragment), new Ot(n.data), n.outlet, n.component, n)
                }(t.value), i = t.children.map(s => Do(n, s));
                return new Yn(r, i)
            }
        }

        const af = "ngNavigationCancelingError";

        function gw(n, t) {
            const {redirectTo: e, navigationBehaviorOptions: r} = Qr(t) ? {
                redirectTo: t,
                navigationBehaviorOptions: void 0
            } : t, i = mw(!1, 0, t);
            return i.url = e, i.navigationBehaviorOptions = r, i
        }

        function mw(n, t, e) {
            const r = new Error("NavigationCancelingError: " + (n || ""));
            return r[af] = !0, r.cancellationCode = t, e && (r.url = e), r
        }

        function _w(n) {
            return yw(n) && Qr(n.url)
        }

        function yw(n) {
            return n && n[af]
        }

        class yO {
            constructor() {
                this.outlet = null, this.route = null, this.resolver = null, this.injector = null, this.children = new wo, this.attachRef = null
            }
        }

        let wo = (() => {
            class n {
                constructor() {
                    this.contexts = new Map
                }

                onChildOutletCreated(e, r) {
                    const i = this.getOrCreateContext(e);
                    i.outlet = r, this.contexts.set(e, i)
                }

                onChildOutletDestroyed(e) {
                    const r = this.getContext(e);
                    r && (r.outlet = null, r.attachRef = null)
                }

                onOutletDeactivated() {
                    const e = this.contexts;
                    return this.contexts = new Map, e
                }

                onOutletReAttached(e) {
                    this.contexts = e
                }

                getOrCreateContext(e) {
                    let r = this.getContext(e);
                    return r || (r = new yO, this.contexts.set(e, r)), r
                }

                getContext(e) {
                    return this.contexts.get(e) || null
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();
        const xl = !1;
        let vw = (() => {
            class n {
                constructor(e, r, i, s, o) {
                    this.parentContexts = e, this.location = r, this.changeDetector = s, this.environmentInjector = o, this.activated = null, this._activatedRoute = null, this.activateEvents = new ie, this.deactivateEvents = new ie, this.attachEvents = new ie, this.detachEvents = new ie, this.name = i || G, e.onChildOutletCreated(this.name, this)
                }

                ngOnDestroy() {
                    this.parentContexts.getContext(this.name)?.outlet === this && this.parentContexts.onChildOutletDestroyed(this.name)
                }

                ngOnInit() {
                    if (!this.activated) {
                        const e = this.parentContexts.getContext(this.name);
                        e && e.route && (e.attachRef ? this.attach(e.attachRef, e.route) : this.activateWith(e.route, e.injector))
                    }
                }

                get isActivated() {
                    return !!this.activated
                }

                get component() {
                    if (!this.activated) throw new D(4012, xl);
                    return this.activated.instance
                }

                get activatedRoute() {
                    if (!this.activated) throw new D(4012, xl);
                    return this._activatedRoute
                }

                get activatedRouteData() {
                    return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
                }

                detach() {
                    if (!this.activated) throw new D(4012, xl);
                    this.location.detach();
                    const e = this.activated;
                    return this.activated = null, this._activatedRoute = null, this.detachEvents.emit(e.instance), e
                }

                attach(e, r) {
                    this.activated = e, this._activatedRoute = r, this.location.insert(e.hostView), this.attachEvents.emit(e.instance)
                }

                deactivate() {
                    if (this.activated) {
                        const e = this.component;
                        this.activated.destroy(), this.activated = null, this._activatedRoute = null, this.deactivateEvents.emit(e)
                    }
                }

                activateWith(e, r) {
                    if (this.isActivated) throw new D(4013, xl);
                    this._activatedRoute = e;
                    const i = this.location, o = e._futureSnapshot.component,
                        a = this.parentContexts.getOrCreateContext(this.name).children, l = new vO(e, a, i.injector);
                    if (r && function bO(n) {
                        return !!n.resolveComponentFactory
                    }(r)) {
                        const c = r.resolveComponentFactory(o);
                        this.activated = i.createComponent(c, i.length, l)
                    } else this.activated = i.createComponent(o, {
                        index: i.length,
                        injector: l,
                        environmentInjector: r ?? this.environmentInjector
                    });
                    this.changeDetector.markForCheck(), this.activateEvents.emit(this.activated.instance)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(wo), m(Ke), pi("name"), m(mn), m(dr))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["router-outlet"]],
                outputs: {
                    activateEvents: "activate",
                    deactivateEvents: "deactivate",
                    attachEvents: "attach",
                    detachEvents: "detach"
                },
                exportAs: ["outlet"]
            }), n
        })();

        class vO {
            constructor(t, e, r) {
                this.route = t, this.childContexts = e, this.parent = r
            }

            get(t, e) {
                return t === rs ? this.route : t === wo ? this.childContexts : this.parent.get(t, e)
            }
        }

        let bw = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275cmp = Ye({
                type: n, selectors: [["ng-component"]], decls: 1, vars: 0, template: function (e, r) {
                    1 & e && pr(0, "router-outlet")
                }, dependencies: [vw], encapsulation: 2
            }), n
        })();

        function Dw(n, t) {
            return n.providers && !n._injector && (n._injector = Ka(n.providers, t, `Route: ${n.path}`)), n._injector ?? t
        }

        function cf(n) {
            const t = n.children && n.children.map(cf), e = t ? {...n, children: t} : {...n};
            return !e.component && !e.loadComponent && (t || e.loadChildren) && e.outlet && e.outlet !== G && (e.component = bw), e
        }

        function en(n) {
            return n.outlet || G
        }

        function ww(n, t) {
            const e = n.filter(r => en(r) === t);
            return e.push(...n.filter(r => en(r) !== t)), e
        }

        function Cw(n) {
            if (!n) return null;
            if (n.routeConfig?._injector) return n.routeConfig._injector;
            for (let t = n.parent; t; t = t.parent) {
                const e = t.routeConfig;
                if (e?._loadedInjector) return e._loadedInjector;
                if (e?._injector) return e._injector
            }
            return null
        }

        class MO {
            constructor(t, e, r, i) {
                this.routeReuseStrategy = t, this.futureState = e, this.currState = r, this.forwardEvent = i
            }

            activate(t) {
                const e = this.futureState._root, r = this.currState ? this.currState._root : null;
                this.deactivateChildRoutes(e, r, t), rf(this.futureState.root), this.activateChildRoutes(e, r, t)
            }

            deactivateChildRoutes(t, e, r) {
                const i = ns(e);
                t.children.forEach(s => {
                    const o = s.value.outlet;
                    this.deactivateRoutes(s, i[o], r), delete i[o]
                }), ot(i, (s, o) => {
                    this.deactivateRouteAndItsChildren(s, r)
                })
            }

            deactivateRoutes(t, e, r) {
                const i = t.value, s = e ? e.value : null;
                if (i === s) if (i.component) {
                    const o = r.getContext(i.outlet);
                    o && this.deactivateChildRoutes(t, e, o.children)
                } else this.deactivateChildRoutes(t, e, r); else s && this.deactivateRouteAndItsChildren(e, r)
            }

            deactivateRouteAndItsChildren(t, e) {
                t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot) ? this.detachAndStoreRouteSubtree(t, e) : this.deactivateRouteAndOutlet(t, e)
            }

            detachAndStoreRouteSubtree(t, e) {
                const r = e.getContext(t.value.outlet), i = r && t.value.component ? r.children : e, s = ns(t);
                for (const o of Object.keys(s)) this.deactivateRouteAndItsChildren(s[o], i);
                if (r && r.outlet) {
                    const o = r.outlet.detach(), a = r.children.onOutletDeactivated();
                    this.routeReuseStrategy.store(t.value.snapshot, {componentRef: o, route: t, contexts: a})
                }
            }

            deactivateRouteAndOutlet(t, e) {
                const r = e.getContext(t.value.outlet), i = r && t.value.component ? r.children : e, s = ns(t);
                for (const o of Object.keys(s)) this.deactivateRouteAndItsChildren(s[o], i);
                r && r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated(), r.attachRef = null, r.resolver = null, r.route = null)
            }

            activateChildRoutes(t, e, r) {
                const i = ns(e);
                t.children.forEach(s => {
                    this.activateRoutes(s, i[s.value.outlet], r), this.forwardEvent(new dO(s.value.snapshot))
                }), t.children.length && this.forwardEvent(new cO(t.value.snapshot))
            }

            activateRoutes(t, e, r) {
                const i = t.value, s = e ? e.value : null;
                if (rf(i), i === s) if (i.component) {
                    const o = r.getOrCreateContext(i.outlet);
                    this.activateChildRoutes(t, e, o.children)
                } else this.activateChildRoutes(t, e, r); else if (i.component) {
                    const o = r.getOrCreateContext(i.outlet);
                    if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
                        const a = this.routeReuseStrategy.retrieve(i.snapshot);
                        this.routeReuseStrategy.store(i.snapshot, null), o.children.onOutletReAttached(a.contexts), o.attachRef = a.componentRef, o.route = a.route.value, o.outlet && o.outlet.attach(a.componentRef, a.route.value), rf(a.route.value), this.activateChildRoutes(t, null, o.children)
                    } else {
                        const a = Cw(i.snapshot), l = a?.get(Br) ?? null;
                        o.attachRef = null, o.route = i, o.resolver = l, o.injector = a, o.outlet && o.outlet.activateWith(i, o.injector), this.activateChildRoutes(t, null, o.children)
                    }
                } else this.activateChildRoutes(t, null, r)
            }
        }

        class Ew {
            constructor(t) {
                this.path = t, this.route = this.path[this.path.length - 1]
            }
        }

        class kl {
            constructor(t, e) {
                this.component = t, this.route = e
            }
        }

        function SO(n, t, e) {
            const r = n._root;
            return Co(r, t ? t._root : null, e, [r.value])
        }

        function Pl(n, t, e) {
            return (Cw(t) ?? e).get(n)
        }

        function Co(n, t, e, r, i = {canDeactivateChecks: [], canActivateChecks: []}) {
            const s = ns(t);
            return n.children.forEach(o => {
                (function IO(n, t, e, r, i = {canDeactivateChecks: [], canActivateChecks: []}) {
                    const s = n.value, o = t ? t.value : null, a = e ? e.getContext(n.value.outlet) : null;
                    if (o && s.routeConfig === o.routeConfig) {
                        const l = function AO(n, t, e) {
                            if ("function" == typeof e) return e(n, t);
                            switch (e) {
                                case"pathParamsChange":
                                    return !Kr(n.url, t.url);
                                case"pathParamsOrQueryParamsChange":
                                    return !Kr(n.url, t.url) || !xn(n.queryParams, t.queryParams);
                                case"always":
                                    return !0;
                                case"paramsOrQueryParamsChange":
                                    return !sf(n, t) || !xn(n.queryParams, t.queryParams);
                                default:
                                    return !sf(n, t)
                            }
                        }(o, s, s.routeConfig.runGuardsAndResolvers);
                        l ? i.canActivateChecks.push(new Ew(r)) : (s.data = o.data, s._resolvedData = o._resolvedData), Co(n, t, s.component ? a ? a.children : null : e, r, i), l && a && a.outlet && a.outlet.isActivated && i.canDeactivateChecks.push(new kl(a.outlet.component, o))
                    } else o && Eo(t, a, i), i.canActivateChecks.push(new Ew(r)), Co(n, null, s.component ? a ? a.children : null : e, r, i)
                })(o, s[o.value.outlet], e, r.concat([o.value]), i), delete s[o.value.outlet]
            }), ot(s, (o, a) => Eo(o, e.getContext(a), i)), i
        }

        function Eo(n, t, e) {
            const r = ns(n), i = n.value;
            ot(r, (s, o) => {
                Eo(s, i.component ? t ? t.children.getContext(o) : null : t, e)
            }), e.canDeactivateChecks.push(new kl(i.component && t && t.outlet && t.outlet.isActivated ? t.outlet.component : null, i))
        }

        function Mo(n) {
            return "function" == typeof n
        }

        function uf(n) {
            return n instanceof bl || "EmptyError" === n?.name
        }

        const Fl = Symbol("INITIAL_VALUE");

        function is() {
            return Xt(n => Uh(n.map(t => t.pipe(Rn(1), go(Fl)))).pipe(W(t => {
                for (const e of t) if (!0 !== e) {
                    if (e === Fl) return Fl;
                    if (!1 === e || e instanceof qr) return e
                }
                return !0
            }), vn(t => t !== Fl), Rn(1)))
        }

        function Mw(n) {
            return function a0(...n) {
                return Bp(n)
            }(st(t => {
                if (Qr(t)) throw gw(0, t)
            }), W(t => !0 === t))
        }

        const df = {
            matched: !1,
            consumedSegments: [],
            remainingSegments: [],
            parameters: {},
            positionalParamSegments: {}
        };

        function Sw(n, t, e, r, i) {
            const s = hf(n, t, e);
            return s.matched ? function GO(n, t, e, r) {
                const i = t.canMatch;
                return i && 0 !== i.length ? R(i.map(o => {
                    const a = n.get(o), l = function NO(n) {
                        return n && Mo(n.canMatch)
                    }(a) ? a.canMatch(t, e) : a(t, e);
                    return Qn(l)
                })).pipe(is(), Mw()) : R(!0)
            }(r = Dw(t, r), t, e).pipe(W(o => !0 === o ? s : {...df})) : R(s)
        }

        function hf(n, t, e) {
            if ("" === t.path) return "full" === t.pathMatch && (n.hasChildren() || e.length > 0) ? {...df} : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: e,
                parameters: {},
                positionalParamSegments: {}
            };
            const i = (t.matcher || IN)(e, n, t);
            if (!i) return {...df};
            const s = {};
            ot(i.posParams, (a, l) => {
                s[l] = a.path
            });
            const o = i.consumed.length > 0 ? {...s, ...i.consumed[i.consumed.length - 1].parameters} : s;
            return {
                matched: !0,
                consumedSegments: i.consumed,
                remainingSegments: e.slice(i.consumed.length),
                parameters: o,
                positionalParamSegments: i.posParams ?? {}
            }
        }

        function Nl(n, t, e, r, i = "corrected") {
            if (e.length > 0 && function QO(n, t, e) {
                return e.some(r => Ol(n, t, r) && en(r) !== G)
            }(n, e, r)) {
                const o = new q(t, function KO(n, t, e, r) {
                    const i = {};
                    i[G] = r, r._sourceSegment = n, r._segmentIndexShift = t.length;
                    for (const s of e) if ("" === s.path && en(s) !== G) {
                        const o = new q([], {});
                        o._sourceSegment = n, o._segmentIndexShift = t.length, i[en(s)] = o
                    }
                    return i
                }(n, t, r, new q(e, n.children)));
                return o._sourceSegment = n, o._segmentIndexShift = t.length, {segmentGroup: o, slicedSegments: []}
            }
            if (0 === e.length && function ZO(n, t, e) {
                return e.some(r => Ol(n, t, r))
            }(n, e, r)) {
                const o = new q(n.segments, function qO(n, t, e, r, i, s) {
                    const o = {};
                    for (const a of r) if (Ol(n, e, a) && !i[en(a)]) {
                        const l = new q([], {});
                        l._sourceSegment = n, l._segmentIndexShift = "legacy" === s ? n.segments.length : t.length, o[en(a)] = l
                    }
                    return {...i, ...o}
                }(n, t, e, r, n.children, i));
                return o._sourceSegment = n, o._segmentIndexShift = t.length, {segmentGroup: o, slicedSegments: e}
            }
            const s = new q(n.segments, n.children);
            return s._sourceSegment = n, s._segmentIndexShift = t.length, {segmentGroup: s, slicedSegments: e}
        }

        function Ol(n, t, e) {
            return (!(n.hasChildren() || t.length > 0) || "full" !== e.pathMatch) && "" === e.path
        }

        function Tw(n, t, e, r) {
            return !!(en(n) === r || r !== G && Ol(t, e, n)) && ("**" === n.path || hf(t, n, e).matched)
        }

        function Iw(n, t, e) {
            return 0 === t.length && !n.children[e]
        }

        const Ll = !1;

        class Bl {
            constructor(t) {
                this.segmentGroup = t || null
            }
        }

        class Aw {
            constructor(t) {
                this.urlTree = t
            }
        }

        function So(n) {
            return po(new Bl(n))
        }

        function Rw(n) {
            return po(new Aw(n))
        }

        class e1 {
            constructor(t, e, r, i, s) {
                this.injector = t, this.configLoader = e, this.urlSerializer = r, this.urlTree = i, this.config = s, this.allowRedirects = !0
            }

            apply() {
                const t = Nl(this.urlTree.root, [], [], this.config).segmentGroup, e = new q(t.segments, t.children);
                return this.expandSegmentGroup(this.injector, this.config, e, G).pipe(W(s => this.createUrlTree(Il(s), this.urlTree.queryParams, this.urlTree.fragment))).pipe(wr(s => {
                    if (s instanceof Aw) return this.allowRedirects = !1, this.match(s.urlTree);
                    throw s instanceof Bl ? this.noMatchError(s) : s
                }))
            }

            match(t) {
                return this.expandSegmentGroup(this.injector, this.config, t.root, G).pipe(W(i => this.createUrlTree(Il(i), t.queryParams, t.fragment))).pipe(wr(i => {
                    throw i instanceof Bl ? this.noMatchError(i) : i
                }))
            }

            noMatchError(t) {
                return new D(4002, Ll)
            }

            createUrlTree(t, e, r) {
                const i = Qh(t);
                return new qr(i, e, r)
            }

            expandSegmentGroup(t, e, r, i) {
                return 0 === r.segments.length && r.hasChildren() ? this.expandChildren(t, e, r).pipe(W(s => new q([], s))) : this.expandSegment(t, r, e, r.segments, i, !0)
            }

            expandChildren(t, e, r) {
                const i = [];
                for (const s of Object.keys(r.children)) "primary" === s ? i.unshift(s) : i.push(s);
                return Oe(i).pipe(Dr(s => {
                    const o = r.children[s], a = ww(e, s);
                    return this.expandSegmentGroup(t, a, o, s).pipe(W(l => ({segment: l, outlet: s})))
                }), HD((s, o) => (s[o.outlet] = o.segment, s), {}), UD())
            }

            expandSegment(t, e, r, i, s, o) {
                return Oe(r).pipe(Dr(a => this.expandSegmentAgainstRoute(t, e, r, a, i, s, o).pipe(wr(c => {
                    if (c instanceof Bl) return R(null);
                    throw c
                }))), br(a => !!a), wr((a, l) => {
                    if (uf(a)) return Iw(e, i, s) ? R(new q([], {})) : So(e);
                    throw a
                }))
            }

            expandSegmentAgainstRoute(t, e, r, i, s, o, a) {
                return Tw(i, e, s, o) ? void 0 === i.redirectTo ? this.matchSegmentAgainstRoute(t, e, i, s, o) : a && this.allowRedirects ? this.expandSegmentAgainstRouteUsingRedirect(t, e, r, i, s, o) : So(e) : So(e)
            }

            expandSegmentAgainstRouteUsingRedirect(t, e, r, i, s, o) {
                return "**" === i.path ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, i, o) : this.expandRegularSegmentAgainstRouteUsingRedirect(t, e, r, i, s, o)
            }

            expandWildCardWithParamsAgainstRouteUsingRedirect(t, e, r, i) {
                const s = this.applyRedirectCommands([], r.redirectTo, {});
                return r.redirectTo.startsWith("/") ? Rw(s) : this.lineralizeSegments(r, s).pipe(Ze(o => {
                    const a = new q(o, {});
                    return this.expandSegment(t, a, e, o, i, !1)
                }))
            }

            expandRegularSegmentAgainstRouteUsingRedirect(t, e, r, i, s, o) {
                const {matched: a, consumedSegments: l, remainingSegments: c, positionalParamSegments: u} = hf(e, i, s);
                if (!a) return So(e);
                const d = this.applyRedirectCommands(l, i.redirectTo, u);
                return i.redirectTo.startsWith("/") ? Rw(d) : this.lineralizeSegments(i, d).pipe(Ze(h => this.expandSegment(t, e, r, h.concat(c), o, !1)))
            }

            matchSegmentAgainstRoute(t, e, r, i, s) {
                return "**" === r.path ? (t = Dw(r, t), r.loadChildren ? (r._loadedRoutes ? R({
                    routes: r._loadedRoutes,
                    injector: r._loadedInjector
                }) : this.configLoader.loadChildren(t, r)).pipe(W(a => (r._loadedRoutes = a.routes, r._loadedInjector = a.injector, new q(i, {})))) : R(new q(i, {}))) : Sw(e, r, i, t).pipe(Xt(({
                                                                                                                                                                                                     matched: o,
                                                                                                                                                                                                     consumedSegments: a,
                                                                                                                                                                                                     remainingSegments: l
                                                                                                                                                                                                 }) => o ? this.getChildConfig(t = r._injector ?? t, r, i).pipe(Ze(u => {
                    const d = u.injector ?? t, h = u.routes, {segmentGroup: f, slicedSegments: p} = Nl(e, a, l, h),
                        g = new q(f.segments, f.children);
                    if (0 === p.length && g.hasChildren()) return this.expandChildren(d, h, g).pipe(W(v => new q(a, v)));
                    if (0 === h.length && 0 === p.length) return R(new q(a, {}));
                    const _ = en(r) === s;
                    return this.expandSegment(d, g, h, p, _ ? G : s, !0).pipe(W(C => new q(a.concat(C.segments), C.children)))
                })) : So(e)))
            }

            getChildConfig(t, e, r) {
                return e.children ? R({
                    routes: e.children,
                    injector: t
                }) : e.loadChildren ? void 0 !== e._loadedRoutes ? R({
                    routes: e._loadedRoutes,
                    injector: e._loadedInjector
                }) : function WO(n, t, e, r) {
                    const i = t.canLoad;
                    return void 0 === i || 0 === i.length ? R(!0) : R(i.map(o => {
                        const a = n.get(o), l = function xO(n) {
                            return n && Mo(n.canLoad)
                        }(a) ? a.canLoad(t, e) : a(t, e);
                        return Qn(l)
                    })).pipe(is(), Mw())
                }(t, e, r).pipe(Ze(i => i ? this.configLoader.loadChildren(t, e).pipe(st(s => {
                    e._loadedRoutes = s.routes, e._loadedInjector = s.injector
                })) : function JO(n) {
                    return po(mw(Ll, 3))
                }())) : R({routes: [], injector: t})
            }

            lineralizeSegments(t, e) {
                let r = [], i = e.root;
                for (; ;) {
                    if (r = r.concat(i.segments), 0 === i.numberOfChildren) return R(r);
                    if (i.numberOfChildren > 1 || !i.children[G]) return po(new D(4e3, Ll));
                    i = i.children[G]
                }
            }

            applyRedirectCommands(t, e, r) {
                return this.applyRedirectCreateUrlTree(e, this.urlSerializer.parse(e), t, r)
            }

            applyRedirectCreateUrlTree(t, e, r, i) {
                const s = this.createSegmentGroup(t, e.root, r, i);
                return new qr(s, this.createQueryParams(e.queryParams, this.urlTree.queryParams), e.fragment)
            }

            createQueryParams(t, e) {
                const r = {};
                return ot(t, (i, s) => {
                    if ("string" == typeof i && i.startsWith(":")) {
                        const a = i.substring(1);
                        r[s] = e[a]
                    } else r[s] = i
                }), r
            }

            createSegmentGroup(t, e, r, i) {
                const s = this.createSegments(t, e.segments, r, i);
                let o = {};
                return ot(e.children, (a, l) => {
                    o[l] = this.createSegmentGroup(t, a, r, i)
                }), new q(s, o)
            }

            createSegments(t, e, r, i) {
                return e.map(s => s.path.startsWith(":") ? this.findPosParam(t, s, i) : this.findOrReturn(s, r))
            }

            findPosParam(t, e, r) {
                const i = r[e.path.substring(1)];
                if (!i) throw new D(4001, Ll);
                return i
            }

            findOrReturn(t, e) {
                let r = 0;
                for (const i of e) {
                    if (i.path === t.path) return e.splice(r), i;
                    r++
                }
                return t
            }
        }

        class n1 {
        }

        class o1 {
            constructor(t, e, r, i, s, o, a, l) {
                this.injector = t, this.rootComponentType = e, this.config = r, this.urlTree = i, this.url = s, this.paramsInheritanceStrategy = o, this.relativeLinkResolution = a, this.urlSerializer = l
            }

            recognize() {
                const t = Nl(this.urlTree.root, [], [], this.config.filter(e => void 0 === e.redirectTo), this.relativeLinkResolution).segmentGroup;
                return this.processSegmentGroup(this.injector, this.config, t, G).pipe(W(e => {
                    if (null === e) return null;
                    const r = new Rl([], Object.freeze({}), Object.freeze({...this.urlTree.queryParams}), this.urlTree.fragment, {}, G, this.rootComponentType, null, this.urlTree.root, -1, {}),
                        i = new Yn(r, e), s = new fw(this.url, i);
                    return this.inheritParamsAndData(s._root), s
                }))
            }

            inheritParamsAndData(t) {
                const e = t.value, r = hw(e, this.paramsInheritanceStrategy);
                e.params = Object.freeze(r.params), e.data = Object.freeze(r.data), t.children.forEach(i => this.inheritParamsAndData(i))
            }

            processSegmentGroup(t, e, r, i) {
                return 0 === r.segments.length && r.hasChildren() ? this.processChildren(t, e, r) : this.processSegment(t, e, r, r.segments, i)
            }

            processChildren(t, e, r) {
                return Oe(Object.keys(r.children)).pipe(Dr(i => {
                    const s = r.children[i], o = ww(e, i);
                    return this.processSegmentGroup(t, o, s, i)
                }), HD((i, s) => i && s ? (i.push(...s), i) : null), function MN(n, t = !1) {
                    return Ee((e, r) => {
                        let i = 0;
                        e.subscribe(be(r, s => {
                            const o = n(s, i++);
                            (o || t) && r.next(s), !o && r.complete()
                        }))
                    })
                }(i => null !== i), wl(null), UD(), W(i => {
                    if (null === i) return null;
                    const s = xw(i);
                    return function a1(n) {
                        n.sort((t, e) => t.value.outlet === G ? -1 : e.value.outlet === G ? 1 : t.value.outlet.localeCompare(e.value.outlet))
                    }(s), s
                }))
            }

            processSegment(t, e, r, i, s) {
                return Oe(e).pipe(Dr(o => this.processSegmentAgainstRoute(o._injector ?? t, o, r, i, s)), br(o => !!o), wr(o => {
                    if (uf(o)) return Iw(r, i, s) ? R([]) : R(null);
                    throw o
                }))
            }

            processSegmentAgainstRoute(t, e, r, i, s) {
                if (e.redirectTo || !Tw(e, r, i, s)) return R(null);
                let o;
                if ("**" === e.path) {
                    const a = i.length > 0 ? WD(i).parameters : {}, l = Pw(r) + i.length;
                    o = R({
                        snapshot: new Rl(i, a, Object.freeze({...this.urlTree.queryParams}), this.urlTree.fragment, Nw(e), en(e), e.component ?? e._loadedComponent ?? null, e, kw(r), l, Ow(e), l),
                        consumedSegments: [],
                        remainingSegments: []
                    })
                } else o = Sw(r, e, i, t).pipe(W(({
                                                      matched: a,
                                                      consumedSegments: l,
                                                      remainingSegments: c,
                                                      parameters: u
                                                  }) => {
                    if (!a) return null;
                    const d = Pw(r) + l.length;
                    return {
                        snapshot: new Rl(l, u, Object.freeze({...this.urlTree.queryParams}), this.urlTree.fragment, Nw(e), en(e), e.component ?? e._loadedComponent ?? null, e, kw(r), d, Ow(e), d),
                        consumedSegments: l,
                        remainingSegments: c
                    }
                }));
                return o.pipe(Xt(a => {
                    if (null === a) return R(null);
                    const {snapshot: l, consumedSegments: c, remainingSegments: u} = a;
                    t = e._injector ?? t;
                    const d = e._loadedInjector ?? t, h = function l1(n) {
                        return n.children ? n.children : n.loadChildren ? n._loadedRoutes : []
                    }(e), {
                        segmentGroup: f,
                        slicedSegments: p
                    } = Nl(r, c, u, h.filter(_ => void 0 === _.redirectTo), this.relativeLinkResolution);
                    if (0 === p.length && f.hasChildren()) return this.processChildren(d, h, f).pipe(W(_ => null === _ ? null : [new Yn(l, _)]));
                    if (0 === h.length && 0 === p.length) return R([new Yn(l, [])]);
                    const g = en(e) === s;
                    return this.processSegment(d, h, f, p, g ? G : s).pipe(W(_ => null === _ ? null : [new Yn(l, _)]))
                }))
            }
        }

        function c1(n) {
            const t = n.value.routeConfig;
            return t && "" === t.path && void 0 === t.redirectTo
        }

        function xw(n) {
            const t = [], e = new Set;
            for (const r of n) {
                if (!c1(r)) {
                    t.push(r);
                    continue
                }
                const i = t.find(s => r.value.routeConfig === s.value.routeConfig);
                void 0 !== i ? (i.children.push(...r.children), e.add(i)) : t.push(r)
            }
            for (const r of e) {
                const i = xw(r.children);
                t.push(new Yn(r.value, i))
            }
            return t.filter(r => !e.has(r))
        }

        function kw(n) {
            let t = n;
            for (; t._sourceSegment;) t = t._sourceSegment;
            return t
        }

        function Pw(n) {
            let t = n, e = t._segmentIndexShift ?? 0;
            for (; t._sourceSegment;) t = t._sourceSegment, e += t._segmentIndexShift ?? 0;
            return e - 1
        }

        function Nw(n) {
            return n.data || {}
        }

        function Ow(n) {
            return n.resolve || {}
        }

        const ff = Symbol("RouteTitle");

        function Lw(n) {
            return "string" == typeof n.title || null === n.title
        }

        function pf(n) {
            return Xt(t => {
                const e = n(t);
                return e ? Oe(e).pipe(W(() => t)) : R(t)
            })
        }

        let Bw = (() => {
            class n {
                buildTitle(e) {
                    let r, i = e.root;
                    for (; void 0 !== i;) r = this.getResolvedTitleForRoute(i) ?? r, i = i.children.find(s => s.outlet === G);
                    return r
                }

                getResolvedTitleForRoute(e) {
                    return e.data[ff]
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({
                token: n, factory: function () {
                    return Ce(Vw)
                }, providedIn: "root"
            }), n
        })(), Vw = (() => {
            class n extends Bw {
                constructor(e) {
                    super(), this.title = e
                }

                updateTitle(e) {
                    const r = this.buildTitle(e);
                    void 0 !== r && this.title.setTitle(r)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(PD))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();

        class _1 {
        }

        class v1 extends class y1 {
            shouldDetach(t) {
                return !1
            }

            store(t, e) {
            }

            shouldAttach(t) {
                return !1
            }

            retrieve(t) {
                return null
            }

            shouldReuseRoute(t, e) {
                return t.routeConfig === e.routeConfig
            }
        } {
        }

        const gf = new S("", {providedIn: "root", factory: () => ({})}), mf = new S("ROUTES");
        let _f = (() => {
            class n {
                constructor(e, r) {
                    this.injector = e, this.compiler = r, this.componentLoaders = new WeakMap, this.childrenLoaders = new WeakMap
                }

                loadComponent(e) {
                    if (this.componentLoaders.get(e)) return this.componentLoaders.get(e);
                    if (e._loadedComponent) return R(e._loadedComponent);
                    this.onLoadStartListener && this.onLoadStartListener(e);
                    const r = Qn(e.loadComponent()).pipe(st(s => {
                        this.onLoadEndListener && this.onLoadEndListener(e), e._loadedComponent = s
                    }), Wh(() => {
                        this.componentLoaders.delete(e)
                    })), i = new VD(r, () => new ve).pipe($h());
                    return this.componentLoaders.set(e, i), i
                }

                loadChildren(e, r) {
                    if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
                    if (r._loadedRoutes) return R({routes: r._loadedRoutes, injector: r._loadedInjector});
                    this.onLoadStartListener && this.onLoadStartListener(r);
                    const s = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(W(a => {
                        this.onLoadEndListener && this.onLoadEndListener(r);
                        let l, c, u = !1;
                        Array.isArray(a) ? c = a : (l = a.create(e).injector, c = zD(l.get(mf, [], F.Self | F.Optional)));
                        return {routes: c.map(cf), injector: l}
                    }), Wh(() => {
                        this.childrenLoaders.delete(r)
                    })), o = new VD(s, () => new ve).pipe($h());
                    return this.childrenLoaders.set(r, o), o
                }

                loadModuleFactoryOrRoutes(e) {
                    return Qn(e()).pipe(Ze(r => r instanceof Iv || Array.isArray(r) ? R(r) : Oe(this.compiler.compileModuleAsync(r))))
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Qt), w(sh))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();

        class D1 {
        }

        class w1 {
            shouldProcessUrl(t) {
                return !0
            }

            extract(t) {
                return t
            }

            merge(t, e) {
                return t
            }
        }

        function C1(n) {
            throw n
        }

        function E1(n, t, e) {
            return t.parse("/")
        }

        const M1 = {paths: "exact", fragment: "ignored", matrixParams: "ignored", queryParams: "exact"},
            S1 = {paths: "subset", fragment: "ignored", matrixParams: "ignored", queryParams: "subset"};

        function Hw() {
            const n = Ce(YD), t = Ce(wo), e = Ce(bh), r = Ce(Qt), i = Ce(sh), s = Ce(mf, {optional: !0}) ?? [],
                o = Ce(gf, {optional: !0}) ?? {}, a = Ce(Vw), l = Ce(Bw, {optional: !0}), c = Ce(D1, {optional: !0}),
                u = Ce(_1, {optional: !0}), d = new bt(null, n, t, e, r, i, zD(s));
            return c && (d.urlHandlingStrategy = c), u && (d.routeReuseStrategy = u), d.titleStrategy = l ?? a, function T1(n, t) {
                n.errorHandler && (t.errorHandler = n.errorHandler), n.malformedUriErrorHandler && (t.malformedUriErrorHandler = n.malformedUriErrorHandler), n.onSameUrlNavigation && (t.onSameUrlNavigation = n.onSameUrlNavigation), n.paramsInheritanceStrategy && (t.paramsInheritanceStrategy = n.paramsInheritanceStrategy), n.relativeLinkResolution && (t.relativeLinkResolution = n.relativeLinkResolution), n.urlUpdateStrategy && (t.urlUpdateStrategy = n.urlUpdateStrategy), n.canceledNavigationResolution && (t.canceledNavigationResolution = n.canceledNavigationResolution)
            }(o, d), d
        }

        let bt = (() => {
            class n {
                constructor(e, r, i, s, o, a, l) {
                    this.rootComponentType = e, this.urlSerializer = r, this.rootContexts = i, this.location = s, this.config = l, this.lastSuccessfulNavigation = null, this.currentNavigation = null, this.disposed = !1, this.navigationId = 0, this.currentPageId = 0, this.isNgZoneEnabled = !1, this.events = new ve, this.errorHandler = C1, this.malformedUriErrorHandler = E1, this.navigated = !1, this.lastSuccessfulId = -1, this.afterPreactivation = () => R(void 0), this.urlHandlingStrategy = new w1, this.routeReuseStrategy = new v1, this.onSameUrlNavigation = "ignore", this.paramsInheritanceStrategy = "emptyOnly", this.urlUpdateStrategy = "deferred", this.relativeLinkResolution = "corrected", this.canceledNavigationResolution = "replace", this.configLoader = o.get(_f), this.configLoader.onLoadEndListener = h => this.triggerEvent(new aO(h)), this.configLoader.onLoadStartListener = h => this.triggerEvent(new oO(h)), this.ngModule = o.get(zr), this.console = o.get(wk);
                    const d = o.get(Z);
                    this.isNgZoneEnabled = d instanceof Z && Z.isInAngularZone(), this.resetConfig(l), this.currentUrlTree = function RN() {
                        return new qr(new q([], {}), {}, null)
                    }(), this.rawUrlTree = this.currentUrlTree, this.browserUrlTree = this.currentUrlTree, this.routerState = dw(this.currentUrlTree, this.rootComponentType), this.transitions = new Ot({
                        id: 0,
                        targetPageId: 0,
                        currentUrlTree: this.currentUrlTree,
                        currentRawUrl: this.currentUrlTree,
                        extractedUrl: this.urlHandlingStrategy.extract(this.currentUrlTree),
                        urlAfterRedirects: this.urlHandlingStrategy.extract(this.currentUrlTree),
                        rawUrl: this.currentUrlTree,
                        extras: {},
                        resolve: null,
                        reject: null,
                        promise: Promise.resolve(!0),
                        source: "imperative",
                        restoredState: null,
                        currentSnapshot: this.routerState.snapshot,
                        targetSnapshot: null,
                        currentRouterState: this.routerState,
                        targetRouterState: null,
                        guards: {canActivateChecks: [], canDeactivateChecks: []},
                        guardsResult: null
                    }), this.navigations = this.setupNavigations(this.transitions), this.processNavigations()
                }

                get browserPageId() {
                    return this.location.getState()?.\u0275routerPageId
                }

                setupNavigations(e) {
                    const r = this.events;
                    return e.pipe(vn(i => 0 !== i.id), W(i => ({
                        ...i,
                        extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl)
                    })), Xt(i => {
                        let s = !1, o = !1;
                        return R(i).pipe(st(a => {
                            this.currentNavigation = {
                                id: a.id,
                                initialUrl: a.rawUrl,
                                extractedUrl: a.extractedUrl,
                                trigger: a.source,
                                extras: a.extras,
                                previousNavigation: this.lastSuccessfulNavigation ? {
                                    ...this.lastSuccessfulNavigation,
                                    previousNavigation: null
                                } : null
                            }
                        }), Xt(a => {
                            const l = this.browserUrlTree.toString(),
                                c = !this.navigated || a.extractedUrl.toString() !== l || l !== this.currentUrlTree.toString();
                            if (("reload" === this.onSameUrlNavigation || c) && this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)) return Uw(a.source) && (this.browserUrlTree = a.extractedUrl), R(a).pipe(Xt(d => {
                                const h = this.transitions.getValue();
                                return r.next(new Xh(d.id, this.serializeUrl(d.extractedUrl), d.source, d.restoredState)), h !== this.transitions.getValue() ? wt : Promise.resolve(d)
                            }), function t1(n, t, e, r) {
                                return Xt(i => function XO(n, t, e, r, i) {
                                    return new e1(n, t, e, r, i).apply()
                                }(n, t, e, i.extractedUrl, r).pipe(W(s => ({...i, urlAfterRedirects: s}))))
                            }(this.ngModule.injector, this.configLoader, this.urlSerializer, this.config), st(d => {
                                this.currentNavigation = {
                                    ...this.currentNavigation,
                                    finalUrl: d.urlAfterRedirects
                                }, i.urlAfterRedirects = d.urlAfterRedirects
                            }), function d1(n, t, e, r, i, s) {
                                return Ze(o => function s1(n, t, e, r, i, s, o = "emptyOnly", a = "legacy") {
                                    return new o1(n, t, e, r, i, o, a, s).recognize().pipe(Xt(l => null === l ? function r1(n) {
                                        return new fe(t => t.error(n))
                                    }(new n1) : R(l)))
                                }(n, t, e, o.urlAfterRedirects, r.serialize(o.urlAfterRedirects), r, i, s).pipe(W(a => ({
                                    ...o,
                                    targetSnapshot: a
                                }))))
                            }(this.ngModule.injector, this.rootComponentType, this.config, this.urlSerializer, this.paramsInheritanceStrategy, this.relativeLinkResolution), st(d => {
                                if (i.targetSnapshot = d.targetSnapshot, "eager" === this.urlUpdateStrategy) {
                                    if (!d.extras.skipLocationChange) {
                                        const f = this.urlHandlingStrategy.merge(d.urlAfterRedirects, d.rawUrl);
                                        this.setBrowserUrl(f, d)
                                    }
                                    this.browserUrlTree = d.urlAfterRedirects
                                }
                                const h = new tO(d.id, this.serializeUrl(d.extractedUrl), this.serializeUrl(d.urlAfterRedirects), d.targetSnapshot);
                                r.next(h)
                            }));
                            if (c && this.rawUrlTree && this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
                                const {id: h, extractedUrl: f, source: p, restoredState: g, extras: _} = a,
                                    y = new Xh(h, this.serializeUrl(f), p, g);
                                r.next(y);
                                const C = dw(f, this.rootComponentType).snapshot;
                                return R(i = {
                                    ...a,
                                    targetSnapshot: C,
                                    urlAfterRedirects: f,
                                    extras: {..._, skipLocationChange: !1, replaceUrl: !1}
                                })
                            }
                            return this.rawUrlTree = a.rawUrl, a.resolve(null), wt
                        }), st(a => {
                            const l = new nO(a.id, this.serializeUrl(a.extractedUrl), this.serializeUrl(a.urlAfterRedirects), a.targetSnapshot);
                            this.triggerEvent(l)
                        }), W(a => i = {
                            ...a,
                            guards: SO(a.targetSnapshot, a.currentSnapshot, this.rootContexts)
                        }), function LO(n, t) {
                            return Ze(e => {
                                const {
                                    targetSnapshot: r,
                                    currentSnapshot: i,
                                    guards: {canActivateChecks: s, canDeactivateChecks: o}
                                } = e;
                                return 0 === o.length && 0 === s.length ? R({
                                    ...e,
                                    guardsResult: !0
                                }) : function BO(n, t, e, r) {
                                    return Oe(n).pipe(Ze(i => function zO(n, t, e, r, i) {
                                        const s = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
                                        return s && 0 !== s.length ? R(s.map(a => {
                                            const l = Pl(a, t, i);
                                            return Qn(function FO(n) {
                                                return n && Mo(n.canDeactivate)
                                            }(l) ? l.canDeactivate(n, t, e, r) : l(n, t, e, r)).pipe(br())
                                        })).pipe(is()) : R(!0)
                                    }(i.component, i.route, e, t, r)), br(i => !0 !== i, !0))
                                }(o, r, i, n).pipe(Ze(a => a && function RO(n) {
                                    return "boolean" == typeof n
                                }(a) ? function VO(n, t, e, r) {
                                    return Oe(t).pipe(Dr(i => Dl(function HO(n, t) {
                                        return null !== n && t && t(new lO(n)), R(!0)
                                    }(i.route.parent, r), function jO(n, t) {
                                        return null !== n && t && t(new uO(n)), R(!0)
                                    }(i.route, r), function $O(n, t, e) {
                                        const r = t[t.length - 1],
                                            s = t.slice(0, t.length - 1).reverse().map(o => function TO(n) {
                                                const t = n.routeConfig ? n.routeConfig.canActivateChild : null;
                                                return t && 0 !== t.length ? {node: n, guards: t} : null
                                            }(o)).filter(o => null !== o).map(o => BD(() => R(o.guards.map(l => {
                                                const c = Pl(l, o.node, e);
                                                return Qn(function PO(n) {
                                                    return n && Mo(n.canActivateChild)
                                                }(c) ? c.canActivateChild(r, n) : c(r, n)).pipe(br())
                                            })).pipe(is())));
                                        return R(s).pipe(is())
                                    }(n, i.path, e), function UO(n, t, e) {
                                        const r = t.routeConfig ? t.routeConfig.canActivate : null;
                                        if (!r || 0 === r.length) return R(!0);
                                        const i = r.map(s => BD(() => {
                                            const o = Pl(s, t, e);
                                            return Qn(function kO(n) {
                                                return n && Mo(n.canActivate)
                                            }(o) ? o.canActivate(t, n) : o(t, n)).pipe(br())
                                        }));
                                        return R(i).pipe(is())
                                    }(n, i.route, e))), br(i => !0 !== i, !0))
                                }(r, s, n, t) : R(a)), W(a => ({...e, guardsResult: a})))
                            })
                        }(this.ngModule.injector, a => this.triggerEvent(a)), st(a => {
                            if (i.guardsResult = a.guardsResult, Qr(a.guardsResult)) throw gw(0, a.guardsResult);
                            const l = new rO(a.id, this.serializeUrl(a.extractedUrl), this.serializeUrl(a.urlAfterRedirects), a.targetSnapshot, !!a.guardsResult);
                            this.triggerEvent(l)
                        }), vn(a => !!a.guardsResult || (this.restoreHistory(a), this.cancelNavigationTransition(a, "", 3), !1)), pf(a => {
                            if (a.guards.canActivateChecks.length) return R(a).pipe(st(l => {
                                const c = new iO(l.id, this.serializeUrl(l.extractedUrl), this.serializeUrl(l.urlAfterRedirects), l.targetSnapshot);
                                this.triggerEvent(c)
                            }), Xt(l => {
                                let c = !1;
                                return R(l).pipe(function h1(n, t) {
                                    return Ze(e => {
                                        const {targetSnapshot: r, guards: {canActivateChecks: i}} = e;
                                        if (!i.length) return R(e);
                                        let s = 0;
                                        return Oe(i).pipe(Dr(o => function f1(n, t, e, r) {
                                            const i = n.routeConfig, s = n._resolve;
                                            return void 0 !== i?.title && !Lw(i) && (s[ff] = i.title), function p1(n, t, e, r) {
                                                const i = function g1(n) {
                                                    return [...Object.keys(n), ...Object.getOwnPropertySymbols(n)]
                                                }(n);
                                                if (0 === i.length) return R({});
                                                const s = {};
                                                return Oe(i).pipe(Ze(o => function m1(n, t, e, r) {
                                                    const i = Pl(n, t, r);
                                                    return Qn(i.resolve ? i.resolve(t, e) : i(t, e))
                                                }(n[o], t, e, r).pipe(br(), st(a => {
                                                    s[o] = a
                                                }))), zh(1), function SN(n) {
                                                    return W(() => n)
                                                }(s), wr(o => uf(o) ? wt : po(o)))
                                            }(s, n, t, r).pipe(W(o => (n._resolvedData = o, n.data = hw(n, e).resolve, i && Lw(i) && (n.data[ff] = i.title), null)))
                                        }(o.route, r, n, t)), st(() => s++), zh(1), Ze(o => s === i.length ? R(e) : wt))
                                    })
                                }(this.paramsInheritanceStrategy, this.ngModule.injector), st({
                                    next: () => c = !0,
                                    complete: () => {
                                        c || (this.restoreHistory(l), this.cancelNavigationTransition(l, "", 2))
                                    }
                                }))
                            }), st(l => {
                                const c = new sO(l.id, this.serializeUrl(l.extractedUrl), this.serializeUrl(l.urlAfterRedirects), l.targetSnapshot);
                                this.triggerEvent(c)
                            }))
                        }), pf(a => {
                            const l = c => {
                                const u = [];
                                c.routeConfig?.loadComponent && !c.routeConfig._loadedComponent && u.push(this.configLoader.loadComponent(c.routeConfig).pipe(st(d => {
                                    c.component = d
                                }), W(() => {
                                })));
                                for (const d of c.children) u.push(...l(d));
                                return u
                            };
                            return Uh(l(a.targetSnapshot.root)).pipe(wl(), Rn(1))
                        }), pf(() => this.afterPreactivation()), W(a => {
                            const l = function gO(n, t, e) {
                                const r = Do(n, t._root, e ? e._root : void 0);
                                return new uw(r, t)
                            }(this.routeReuseStrategy, a.targetSnapshot, a.currentRouterState);
                            return i = {...a, targetRouterState: l}
                        }), st(a => {
                            this.currentUrlTree = a.urlAfterRedirects, this.rawUrlTree = this.urlHandlingStrategy.merge(a.urlAfterRedirects, a.rawUrl), this.routerState = a.targetRouterState, "deferred" === this.urlUpdateStrategy && (a.extras.skipLocationChange || this.setBrowserUrl(this.rawUrlTree, a), this.browserUrlTree = a.urlAfterRedirects)
                        }), ((n, t, e) => W(r => (new MO(t, r.targetRouterState, r.currentRouterState, e).activate(n), r)))(this.rootContexts, this.routeReuseStrategy, a => this.triggerEvent(a)), st({
                            next() {
                                s = !0
                            }, complete() {
                                s = !0
                            }
                        }), Wh(() => {
                            s || o || this.cancelNavigationTransition(i, "", 1), this.currentNavigation?.id === i.id && (this.currentNavigation = null)
                        }), wr(a => {
                            if (o = !0, yw(a)) {
                                _w(a) || (this.navigated = !0, this.restoreHistory(i, !0));
                                const l = new Al(i.id, this.serializeUrl(i.extractedUrl), a.message, a.cancellationCode);
                                if (r.next(l), _w(a)) {
                                    const c = this.urlHandlingStrategy.merge(a.url, this.rawUrlTree), u = {
                                        skipLocationChange: i.extras.skipLocationChange,
                                        replaceUrl: "eager" === this.urlUpdateStrategy || Uw(i.source)
                                    };
                                    this.scheduleNavigation(c, "imperative", null, u, {
                                        resolve: i.resolve,
                                        reject: i.reject,
                                        promise: i.promise
                                    })
                                } else i.resolve(!1)
                            } else {
                                this.restoreHistory(i, !0);
                                const l = new aw(i.id, this.serializeUrl(i.extractedUrl), a, i.targetSnapshot ?? void 0);
                                r.next(l);
                                try {
                                    i.resolve(this.errorHandler(a))
                                } catch (c) {
                                    i.reject(c)
                                }
                            }
                            return wt
                        }))
                    }))
                }

                resetRootComponentType(e) {
                    this.rootComponentType = e, this.routerState.root.component = this.rootComponentType
                }

                setTransition(e) {
                    this.transitions.next({...this.transitions.value, ...e})
                }

                initialNavigation() {
                    this.setUpLocationChangeListener(), 0 === this.navigationId && this.navigateByUrl(this.location.path(!0), {replaceUrl: !0})
                }

                setUpLocationChangeListener() {
                    this.locationSubscription || (this.locationSubscription = this.location.subscribe(e => {
                        const r = "popstate" === e.type ? "popstate" : "hashchange";
                        "popstate" === r && setTimeout(() => {
                            const i = {replaceUrl: !0}, s = e.state?.navigationId ? e.state : null;
                            if (s) {
                                const a = {...s};
                                delete a.navigationId, delete a.\u0275routerPageId, 0 !== Object.keys(a).length && (i.state = a)
                            }
                            const o = this.parseUrl(e.url);
                            this.scheduleNavigation(o, r, s, i)
                        }, 0)
                    }))
                }

                get url() {
                    return this.serializeUrl(this.currentUrlTree)
                }

                getCurrentNavigation() {
                    return this.currentNavigation
                }

                triggerEvent(e) {
                    this.events.next(e)
                }

                resetConfig(e) {
                    this.config = e.map(cf), this.navigated = !1, this.lastSuccessfulId = -1
                }

                ngOnDestroy() {
                    this.dispose()
                }

                dispose() {
                    this.transitions.complete(), this.locationSubscription && (this.locationSubscription.unsubscribe(), this.locationSubscription = void 0), this.disposed = !0
                }

                createUrlTree(e, r = {}) {
                    const {relativeTo: i, queryParams: s, fragment: o, queryParamsHandling: a, preserveFragment: l} = r,
                        c = i || this.routerState.root, u = l ? this.currentUrlTree.fragment : o;
                    let d = null;
                    switch (a) {
                        case"merge":
                            d = {...this.currentUrlTree.queryParams, ...s};
                            break;
                        case"preserve":
                            d = this.currentUrlTree.queryParams;
                            break;
                        default:
                            d = s || null
                    }
                    return null !== d && (d = this.removeEmptyProps(d)), QN(c, this.currentUrlTree, e, d, u ?? null)
                }

                navigateByUrl(e, r = {skipLocationChange: !1}) {
                    const i = Qr(e) ? e : this.parseUrl(e), s = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
                    return this.scheduleNavigation(s, "imperative", null, r)
                }

                navigate(e, r = {skipLocationChange: !1}) {
                    return function I1(n) {
                        for (let t = 0; t < n.length; t++) {
                            if (null == n[t]) throw new D(4008, false)
                        }
                    }(e), this.navigateByUrl(this.createUrlTree(e, r), r)
                }

                serializeUrl(e) {
                    return this.urlSerializer.serialize(e)
                }

                parseUrl(e) {
                    let r;
                    try {
                        r = this.urlSerializer.parse(e)
                    } catch (i) {
                        r = this.malformedUriErrorHandler(i, this.urlSerializer, e)
                    }
                    return r
                }

                isActive(e, r) {
                    let i;
                    if (i = !0 === r ? {...M1} : !1 === r ? {...S1} : r, Qr(e)) return qD(this.currentUrlTree, e, i);
                    const s = this.parseUrl(e);
                    return qD(this.currentUrlTree, s, i)
                }

                removeEmptyProps(e) {
                    return Object.keys(e).reduce((r, i) => {
                        const s = e[i];
                        return null != s && (r[i] = s), r
                    }, {})
                }

                processNavigations() {
                    this.navigations.subscribe(e => {
                        this.navigated = !0, this.lastSuccessfulId = e.id, this.currentPageId = e.targetPageId, this.events.next(new Zr(e.id, this.serializeUrl(e.extractedUrl), this.serializeUrl(this.currentUrlTree))), this.lastSuccessfulNavigation = this.currentNavigation, this.titleStrategy?.updateTitle(this.routerState.snapshot), e.resolve(!0)
                    }, e => {
                        this.console.warn(`Unhandled Navigation Error: ${e}`)
                    })
                }

                scheduleNavigation(e, r, i, s, o) {
                    if (this.disposed) return Promise.resolve(!1);
                    let a, l, c;
                    o ? (a = o.resolve, l = o.reject, c = o.promise) : c = new Promise((h, f) => {
                        a = h, l = f
                    });
                    const u = ++this.navigationId;
                    let d;
                    return "computed" === this.canceledNavigationResolution ? (0 === this.currentPageId && (i = this.location.getState()), d = i && i.\u0275routerPageId ? i.\u0275routerPageId : s.replaceUrl || s.skipLocationChange ? this.browserPageId ?? 0 : (this.browserPageId ?? 0) + 1) : d = 0, this.setTransition({
                        id: u,
                        targetPageId: d,
                        source: r,
                        restoredState: i,
                        currentUrlTree: this.currentUrlTree,
                        currentRawUrl: this.rawUrlTree,
                        rawUrl: e,
                        extras: s,
                        resolve: a,
                        reject: l,
                        promise: c,
                        currentSnapshot: this.routerState.snapshot,
                        currentRouterState: this.routerState
                    }), c.catch(h => Promise.reject(h))
                }

                setBrowserUrl(e, r) {
                    const i = this.urlSerializer.serialize(e),
                        s = {...r.extras.state, ...this.generateNgRouterState(r.id, r.targetPageId)};
                    this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl ? this.location.replaceState(i, "", s) : this.location.go(i, "", s)
                }

                restoreHistory(e, r = !1) {
                    if ("computed" === this.canceledNavigationResolution) {
                        const i = this.currentPageId - e.targetPageId;
                        "popstate" !== e.source && "eager" !== this.urlUpdateStrategy && this.currentUrlTree !== this.currentNavigation?.finalUrl || 0 === i ? this.currentUrlTree === this.currentNavigation?.finalUrl && 0 === i && (this.resetState(e), this.browserUrlTree = e.currentUrlTree, this.resetUrlToCurrentUrlTree()) : this.location.historyGo(i)
                    } else "replace" === this.canceledNavigationResolution && (r && this.resetState(e), this.resetUrlToCurrentUrlTree())
                }

                resetState(e) {
                    this.routerState = e.currentRouterState, this.currentUrlTree = e.currentUrlTree, this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, e.rawUrl)
                }

                resetUrlToCurrentUrlTree() {
                    this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId))
                }

                cancelNavigationTransition(e, r, i) {
                    const s = new Al(e.id, this.serializeUrl(e.extractedUrl), r, i);
                    this.triggerEvent(s), e.resolve(!1)
                }

                generateNgRouterState(e, r) {
                    return "computed" === this.canceledNavigationResolution ? {
                        navigationId: e,
                        \u0275routerPageId: r
                    } : {navigationId: e}
                }
            }

            return n.\u0275fac = function (e) {
                ld()
            }, n.\u0275prov = A({
                token: n, factory: function () {
                    return Hw()
                }, providedIn: "root"
            }), n
        })();

        function Uw(n) {
            return "imperative" !== n
        }

        class $w {
        }

        let zw = (() => {
            class n {
                constructor(e, r, i, s, o) {
                    this.router = e, this.injector = i, this.preloadingStrategy = s, this.loader = o
                }

                setUpPreloading() {
                    this.subscription = this.router.events.pipe(vn(e => e instanceof Zr), Dr(() => this.preload())).subscribe(() => {
                    })
                }

                preload() {
                    return this.processRoutes(this.injector, this.router.config)
                }

                ngOnDestroy() {
                    this.subscription && this.subscription.unsubscribe()
                }

                processRoutes(e, r) {
                    const i = [];
                    for (const s of r) {
                        s.providers && !s._injector && (s._injector = Ka(s.providers, e, `Route: ${s.path}`));
                        const o = s._injector ?? e, a = s._loadedInjector ?? o;
                        s.loadChildren && !s._loadedRoutes && void 0 === s.canLoad || s.loadComponent && !s._loadedComponent ? i.push(this.preloadConfig(o, s)) : (s.children || s._loadedRoutes) && i.push(this.processRoutes(a, s.children ?? s._loadedRoutes))
                    }
                    return Oe(i).pipe(ri())
                }

                preloadConfig(e, r) {
                    return this.preloadingStrategy.preload(r, () => {
                        let i;
                        i = r.loadChildren && void 0 === r.canLoad ? this.loader.loadChildren(e, r) : R(null);
                        const s = i.pipe(Ze(o => null === o ? R(void 0) : (r._loadedRoutes = o.routes, r._loadedInjector = o.injector, this.processRoutes(o.injector ?? e, o.routes))));
                        return r.loadComponent && !r._loadedComponent ? Oe([s, this.loader.loadComponent(r)]).pipe(ri()) : s
                    })
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(bt), w(sh), w(dr), w($w), w(_f))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();
        const Ww = new S("");
        let x1 = (() => {
            class n {
                constructor(e, r, i = {}) {
                    this.router = e, this.viewportScroller = r, this.options = i, this.lastId = 0, this.lastSource = "imperative", this.restoredId = 0, this.store = {}, i.scrollPositionRestoration = i.scrollPositionRestoration || "disabled", i.anchorScrolling = i.anchorScrolling || "disabled"
                }

                init() {
                    "disabled" !== this.options.scrollPositionRestoration && this.viewportScroller.setHistoryScrollRestoration("manual"), this.routerEventsSubscription = this.createScrollEvents(), this.scrollEventsSubscription = this.consumeScrollEvents()
                }

                createScrollEvents() {
                    return this.router.events.subscribe(e => {
                        e instanceof Xh ? (this.store[this.lastId] = this.viewportScroller.getScrollPosition(), this.lastSource = e.navigationTrigger, this.restoredId = e.restoredState ? e.restoredState.navigationId : 0) : e instanceof Zr && (this.lastId = e.id, this.scheduleScrollEvent(e, this.router.parseUrl(e.urlAfterRedirects).fragment))
                    })
                }

                consumeScrollEvents() {
                    return this.router.events.subscribe(e => {
                        e instanceof lw && (e.position ? "top" === this.options.scrollPositionRestoration ? this.viewportScroller.scrollToPosition([0, 0]) : "enabled" === this.options.scrollPositionRestoration && this.viewportScroller.scrollToPosition(e.position) : e.anchor && "enabled" === this.options.anchorScrolling ? this.viewportScroller.scrollToAnchor(e.anchor) : "disabled" !== this.options.scrollPositionRestoration && this.viewportScroller.scrollToPosition([0, 0]))
                    })
                }

                scheduleScrollEvent(e, r) {
                    this.router.triggerEvent(new lw(e, "popstate" === this.lastSource ? this.store[this.restoredId] : null, r))
                }

                ngOnDestroy() {
                    this.routerEventsSubscription && this.routerEventsSubscription.unsubscribe(), this.scrollEventsSubscription && this.scrollEventsSubscription.unsubscribe()
                }
            }

            return n.\u0275fac = function (e) {
                ld()
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();
        const Gw = new S("ROUTER_FORROOT_GUARD"), qw = new S(""),
            k1 = [bh, {provide: YD, useClass: qh}, {provide: bt, useFactory: Hw}, wo, {
                provide: rs,
                useFactory: function P1(n) {
                    return n.routerState.root
                },
                deps: [bt]
            }, _f];

        function F1() {
            return new Mb("Router", bt)
        }

        let Kw = (() => {
            class n {
                constructor(e) {
                }

                static forRoot(e, r) {
                    return {
                        ngModule: n,
                        providers: [k1, [], Qw(e), {
                            provide: Gw,
                            useFactory: B1,
                            deps: [[bt, new Ns, new Os]]
                        }, {provide: gf, useValue: r || {}}, r?.useHash ? {provide: Gr, useClass: dP} : {
                            provide: Gr,
                            useClass: Qb
                        }, {
                            provide: Ww, useFactory: () => {
                                const n = Ce(bt), t = Ce(RF), e = Ce(gf);
                                return e.scrollOffset && t.setOffset(e.scrollOffset), new x1(n, t, e)
                            }
                        }, r?.preloadingStrategy ? W1(r.preloadingStrategy) : [], {
                            provide: Mb,
                            multi: !0,
                            useFactory: F1
                        }, r?.initialNavigation ? j1(r) : [], [{provide: Zw, useFactory: V1}, {
                            provide: yb,
                            multi: !0,
                            useExisting: Zw
                        }]]
                    }
                }

                static forChild(e) {
                    return {ngModule: n, providers: [Qw(e)]}
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Gw, 8))
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({}), n
        })();

        function B1(n) {
            return "guarded"
        }

        function Qw(n) {
            return [{provide: mf, multi: !0, useValue: n}]
        }

        function V1() {
            const n = Ce(Qt);
            return t => {
                const e = n.get(ao);
                if (t !== e.components[0]) return;
                const r = n.get(bt), i = n.get(Yw);
                1 === n.get(bf) && r.initialNavigation(), n.get(qw, null, F.Optional)?.setUpPreloading(), n.get(Ww, null, F.Optional)?.init(), r.resetRootComponentType(e.componentTypes[0]), i.next(), i.complete()
            }
        }

        const Zw = new S("");

        function j1(n) {
            return ["disabled" === n.initialNavigation ? [{
                provide: Ja, multi: !0, useFactory: () => {
                    const n = Ce(bt);
                    return () => {
                        n.setUpLocationChangeListener()
                    }
                }
            }, {provide: bf, useValue: 2}] : [], "enabledBlocking" === n.initialNavigation ? [{
                provide: bf,
                useValue: 0
            }, {
                provide: Ja, multi: !0, deps: [Qt], useFactory: n => {
                    const t = n.get(cP, Promise.resolve(null));
                    let e = !1;
                    return () => t.then(() => new Promise(i => {
                        const s = n.get(bt), o = n.get(Yw);
                        (function r(i) {
                            n.get(bt).events.pipe(vn(o => o instanceof Zr || o instanceof Al || o instanceof aw), W(o => o instanceof Zr || o instanceof Al && (0 === o.code || 1 === o.code) && null), vn(o => null !== o), Rn(1)).subscribe(() => {
                                i()
                            })
                        })(() => {
                            i(!0), e = !0
                        }), s.afterPreactivation = () => (i(!0), e || o.closed ? R(void 0) : o), s.initialNavigation()
                    }))
                }
            }] : []]
        }

        const Yw = new S("", {factory: () => new ve}), bf = new S("", {providedIn: "root", factory: () => 1});

        function W1(n) {
            return [zw, {provide: qw, useExisting: zw}, {provide: $w, useExisting: n}]
        }

        const G1 = [];
        let q1 = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({imports: [Kw.forRoot(G1), Kw]}), n
        })();

        class Jw {
        }

        class Xw {
        }

        class Jn {
            constructor(t) {
                this.normalizedNames = new Map, this.lazyUpdate = null, t ? this.lazyInit = "string" == typeof t ? () => {
                    this.headers = new Map, t.split("\n").forEach(e => {
                        const r = e.indexOf(":");
                        if (r > 0) {
                            const i = e.slice(0, r), s = i.toLowerCase(), o = e.slice(r + 1).trim();
                            this.maybeSetNormalizedName(i, s), this.headers.has(s) ? this.headers.get(s).push(o) : this.headers.set(s, [o])
                        }
                    })
                } : () => {
                    this.headers = new Map, Object.keys(t).forEach(e => {
                        let r = t[e];
                        const i = e.toLowerCase();
                        "string" == typeof r && (r = [r]), r.length > 0 && (this.headers.set(i, r), this.maybeSetNormalizedName(e, i))
                    })
                } : this.headers = new Map
            }

            has(t) {
                return this.init(), this.headers.has(t.toLowerCase())
            }

            get(t) {
                this.init();
                const e = this.headers.get(t.toLowerCase());
                return e && e.length > 0 ? e[0] : null
            }

            keys() {
                return this.init(), Array.from(this.normalizedNames.values())
            }

            getAll(t) {
                return this.init(), this.headers.get(t.toLowerCase()) || null
            }

            append(t, e) {
                return this.clone({name: t, value: e, op: "a"})
            }

            set(t, e) {
                return this.clone({name: t, value: e, op: "s"})
            }

            delete(t, e) {
                return this.clone({name: t, value: e, op: "d"})
            }

            maybeSetNormalizedName(t, e) {
                this.normalizedNames.has(e) || this.normalizedNames.set(e, t)
            }

            init() {
                this.lazyInit && (this.lazyInit instanceof Jn ? this.copyFrom(this.lazyInit) : this.lazyInit(), this.lazyInit = null, this.lazyUpdate && (this.lazyUpdate.forEach(t => this.applyUpdate(t)), this.lazyUpdate = null))
            }

            copyFrom(t) {
                t.init(), Array.from(t.headers.keys()).forEach(e => {
                    this.headers.set(e, t.headers.get(e)), this.normalizedNames.set(e, t.normalizedNames.get(e))
                })
            }

            clone(t) {
                const e = new Jn;
                return e.lazyInit = this.lazyInit && this.lazyInit instanceof Jn ? this.lazyInit : this, e.lazyUpdate = (this.lazyUpdate || []).concat([t]), e
            }

            applyUpdate(t) {
                const e = t.name.toLowerCase();
                switch (t.op) {
                    case"a":
                    case"s":
                        let r = t.value;
                        if ("string" == typeof r && (r = [r]), 0 === r.length) return;
                        this.maybeSetNormalizedName(t.name, e);
                        const i = ("a" === t.op ? this.headers.get(e) : void 0) || [];
                        i.push(...r), this.headers.set(e, i);
                        break;
                    case"d":
                        const s = t.value;
                        if (s) {
                            let o = this.headers.get(e);
                            if (!o) return;
                            o = o.filter(a => -1 === s.indexOf(a)), 0 === o.length ? (this.headers.delete(e), this.normalizedNames.delete(e)) : this.headers.set(e, o)
                        } else this.headers.delete(e), this.normalizedNames.delete(e)
                }
            }

            forEach(t) {
                this.init(), Array.from(this.normalizedNames.keys()).forEach(e => t(this.normalizedNames.get(e), this.headers.get(e)))
            }
        }

        class Q1 {
            encodeKey(t) {
                return eC(t)
            }

            encodeValue(t) {
                return eC(t)
            }

            decodeKey(t) {
                return decodeURIComponent(t)
            }

            decodeValue(t) {
                return decodeURIComponent(t)
            }
        }

        const Y1 = /%(\d[a-f0-9])/gi,
            J1 = {40: "@", "3A": ":", 24: "$", "2C": ",", "3B": ";", "3D": "=", "3F": "?", "2F": "/"};

        function eC(n) {
            return encodeURIComponent(n).replace(Y1, (t, e) => J1[e] ?? t)
        }

        function Hl(n) {
            return `${n}`
        }

        class Er {
            constructor(t = {}) {
                if (this.updates = null, this.cloneFrom = null, this.encoder = t.encoder || new Q1, t.fromString) {
                    if (t.fromObject) throw new Error("Cannot specify both fromString and fromObject.");
                    this.map = function Z1(n, t) {
                        const e = new Map;
                        return n.length > 0 && n.replace(/^\?/, "").split("&").forEach(i => {
                            const s = i.indexOf("="), [o, a] = -1 == s ? [t.decodeKey(i), ""] : [t.decodeKey(i.slice(0, s)), t.decodeValue(i.slice(s + 1))],
                                l = e.get(o) || [];
                            l.push(a), e.set(o, l)
                        }), e
                    }(t.fromString, this.encoder)
                } else t.fromObject ? (this.map = new Map, Object.keys(t.fromObject).forEach(e => {
                    const r = t.fromObject[e], i = Array.isArray(r) ? r.map(Hl) : [Hl(r)];
                    this.map.set(e, i)
                })) : this.map = null
            }

            has(t) {
                return this.init(), this.map.has(t)
            }

            get(t) {
                this.init();
                const e = this.map.get(t);
                return e ? e[0] : null
            }

            getAll(t) {
                return this.init(), this.map.get(t) || null
            }

            keys() {
                return this.init(), Array.from(this.map.keys())
            }

            append(t, e) {
                return this.clone({param: t, value: e, op: "a"})
            }

            appendAll(t) {
                const e = [];
                return Object.keys(t).forEach(r => {
                    const i = t[r];
                    Array.isArray(i) ? i.forEach(s => {
                        e.push({param: r, value: s, op: "a"})
                    }) : e.push({param: r, value: i, op: "a"})
                }), this.clone(e)
            }

            set(t, e) {
                return this.clone({param: t, value: e, op: "s"})
            }

            delete(t, e) {
                return this.clone({param: t, value: e, op: "d"})
            }

            toString() {
                return this.init(), this.keys().map(t => {
                    const e = this.encoder.encodeKey(t);
                    return this.map.get(t).map(r => e + "=" + this.encoder.encodeValue(r)).join("&")
                }).filter(t => "" !== t).join("&")
            }

            clone(t) {
                const e = new Er({encoder: this.encoder});
                return e.cloneFrom = this.cloneFrom || this, e.updates = (this.updates || []).concat(t), e
            }

            init() {
                null === this.map && (this.map = new Map), null !== this.cloneFrom && (this.cloneFrom.init(), this.cloneFrom.keys().forEach(t => this.map.set(t, this.cloneFrom.map.get(t))), this.updates.forEach(t => {
                    switch (t.op) {
                        case"a":
                        case"s":
                            const e = ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                            e.push(Hl(t.value)), this.map.set(t.param, e);
                            break;
                        case"d":
                            if (void 0 === t.value) {
                                this.map.delete(t.param);
                                break
                            }
                        {
                            let r = this.map.get(t.param) || [];
                            const i = r.indexOf(Hl(t.value));
                            -1 !== i && r.splice(i, 1), r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param)
                        }
                    }
                }), this.cloneFrom = this.updates = null)
            }
        }

        class X1 {
            constructor() {
                this.map = new Map
            }

            set(t, e) {
                return this.map.set(t, e), this
            }

            get(t) {
                return this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
            }

            delete(t) {
                return this.map.delete(t), this
            }

            has(t) {
                return this.map.has(t)
            }

            keys() {
                return this.map.keys()
            }
        }

        function tC(n) {
            return typeof ArrayBuffer < "u" && n instanceof ArrayBuffer
        }

        function nC(n) {
            return typeof Blob < "u" && n instanceof Blob
        }

        function rC(n) {
            return typeof FormData < "u" && n instanceof FormData
        }

        class To {
            constructor(t, e, r, i) {
                let s;
                if (this.url = e, this.body = null, this.reportProgress = !1, this.withCredentials = !1, this.responseType = "json", this.method = t.toUpperCase(), function eL(n) {
                    switch (n) {
                        case"DELETE":
                        case"GET":
                        case"HEAD":
                        case"OPTIONS":
                        case"JSONP":
                            return !1;
                        default:
                            return !0
                    }
                }(this.method) || i ? (this.body = void 0 !== r ? r : null, s = i) : s = r, s && (this.reportProgress = !!s.reportProgress, this.withCredentials = !!s.withCredentials, s.responseType && (this.responseType = s.responseType), s.headers && (this.headers = s.headers), s.context && (this.context = s.context), s.params && (this.params = s.params)), this.headers || (this.headers = new Jn), this.context || (this.context = new X1), this.params) {
                    const o = this.params.toString();
                    if (0 === o.length) this.urlWithParams = e; else {
                        const a = e.indexOf("?");
                        this.urlWithParams = e + (-1 === a ? "?" : a < e.length - 1 ? "&" : "") + o
                    }
                } else this.params = new Er, this.urlWithParams = e
            }

            serializeBody() {
                return null === this.body ? null : tC(this.body) || nC(this.body) || rC(this.body) || function tL(n) {
                    return typeof URLSearchParams < "u" && n instanceof URLSearchParams
                }(this.body) || "string" == typeof this.body ? this.body : this.body instanceof Er ? this.body.toString() : "object" == typeof this.body || "boolean" == typeof this.body || Array.isArray(this.body) ? JSON.stringify(this.body) : this.body.toString()
            }

            detectContentTypeHeader() {
                return null === this.body || rC(this.body) ? null : nC(this.body) ? this.body.type || null : tC(this.body) ? null : "string" == typeof this.body ? "text/plain" : this.body instanceof Er ? "application/x-www-form-urlencoded;charset=UTF-8" : "object" == typeof this.body || "number" == typeof this.body || "boolean" == typeof this.body ? "application/json" : null
            }

            clone(t = {}) {
                const e = t.method || this.method, r = t.url || this.url, i = t.responseType || this.responseType,
                    s = void 0 !== t.body ? t.body : this.body,
                    o = void 0 !== t.withCredentials ? t.withCredentials : this.withCredentials,
                    a = void 0 !== t.reportProgress ? t.reportProgress : this.reportProgress;
                let l = t.headers || this.headers, c = t.params || this.params;
                const u = t.context ?? this.context;
                return void 0 !== t.setHeaders && (l = Object.keys(t.setHeaders).reduce((d, h) => d.set(h, t.setHeaders[h]), l)), t.setParams && (c = Object.keys(t.setParams).reduce((d, h) => d.set(h, t.setParams[h]), c)), new To(e, r, s, {
                    params: c,
                    headers: l,
                    context: u,
                    reportProgress: a,
                    responseType: i,
                    withCredentials: o
                })
            }
        }

        var He = (() => ((He = He || {})[He.Sent = 0] = "Sent", He[He.UploadProgress = 1] = "UploadProgress", He[He.ResponseHeader = 2] = "ResponseHeader", He[He.DownloadProgress = 3] = "DownloadProgress", He[He.Response = 4] = "Response", He[He.User = 5] = "User", He))();

        class Df {
            constructor(t, e = 200, r = "OK") {
                this.headers = t.headers || new Jn, this.status = void 0 !== t.status ? t.status : e, this.statusText = t.statusText || r, this.url = t.url || null, this.ok = this.status >= 200 && this.status < 300
            }
        }

        class wf extends Df {
            constructor(t = {}) {
                super(t), this.type = He.ResponseHeader
            }

            clone(t = {}) {
                return new wf({
                    headers: t.headers || this.headers,
                    status: void 0 !== t.status ? t.status : this.status,
                    statusText: t.statusText || this.statusText,
                    url: t.url || this.url || void 0
                })
            }
        }

        class Ul extends Df {
            constructor(t = {}) {
                super(t), this.type = He.Response, this.body = void 0 !== t.body ? t.body : null
            }

            clone(t = {}) {
                return new Ul({
                    body: void 0 !== t.body ? t.body : this.body,
                    headers: t.headers || this.headers,
                    status: void 0 !== t.status ? t.status : this.status,
                    statusText: t.statusText || this.statusText,
                    url: t.url || this.url || void 0
                })
            }
        }

        class iC extends Df {
            constructor(t) {
                super(t, 0, "Unknown Error"), this.name = "HttpErrorResponse", this.ok = !1, this.message = this.status >= 200 && this.status < 300 ? `Http failure during parsing for ${t.url || "(unknown url)"}` : `Http failure response for ${t.url || "(unknown url)"}: ${t.status} ${t.statusText}`, this.error = t.error || null
            }
        }

        function Cf(n, t) {
            return {
                body: t,
                headers: n.headers,
                context: n.context,
                observe: n.observe,
                params: n.params,
                reportProgress: n.reportProgress,
                responseType: n.responseType,
                withCredentials: n.withCredentials
            }
        }

        let sC = (() => {
            class n {
                constructor(e) {
                    this.handler = e
                }

                request(e, r, i = {}) {
                    let s;
                    if (e instanceof To) s = e; else {
                        let l, c;
                        l = i.headers instanceof Jn ? i.headers : new Jn(i.headers), i.params && (c = i.params instanceof Er ? i.params : new Er({fromObject: i.params})), s = new To(e, r, void 0 !== i.body ? i.body : null, {
                            headers: l,
                            context: i.context,
                            params: c,
                            reportProgress: i.reportProgress,
                            responseType: i.responseType || "json",
                            withCredentials: i.withCredentials
                        })
                    }
                    const o = R(s).pipe(Dr(l => this.handler.handle(l)));
                    if (e instanceof To || "events" === i.observe) return o;
                    const a = o.pipe(vn(l => l instanceof Ul));
                    switch (i.observe || "body") {
                        case"body":
                            switch (s.responseType) {
                                case"arraybuffer":
                                    return a.pipe(W(l => {
                                        if (null !== l.body && !(l.body instanceof ArrayBuffer)) throw new Error("Response is not an ArrayBuffer.");
                                        return l.body
                                    }));
                                case"blob":
                                    return a.pipe(W(l => {
                                        if (null !== l.body && !(l.body instanceof Blob)) throw new Error("Response is not a Blob.");
                                        return l.body
                                    }));
                                case"text":
                                    return a.pipe(W(l => {
                                        if (null !== l.body && "string" != typeof l.body) throw new Error("Response is not a string.");
                                        return l.body
                                    }));
                                default:
                                    return a.pipe(W(l => l.body))
                            }
                        case"response":
                            return a;
                        default:
                            throw new Error(`Unreachable: unhandled observe type ${i.observe}}`)
                    }
                }

                delete(e, r = {}) {
                    return this.request("DELETE", e, r)
                }

                get(e, r = {}) {
                    return this.request("GET", e, r)
                }

                head(e, r = {}) {
                    return this.request("HEAD", e, r)
                }

                jsonp(e, r) {
                    return this.request("JSONP", e, {
                        params: (new Er).append(r, "JSONP_CALLBACK"),
                        observe: "body",
                        responseType: "json"
                    })
                }

                options(e, r = {}) {
                    return this.request("OPTIONS", e, r)
                }

                patch(e, r, i = {}) {
                    return this.request("PATCH", e, Cf(i, r))
                }

                post(e, r, i = {}) {
                    return this.request("POST", e, Cf(i, r))
                }

                put(e, r, i = {}) {
                    return this.request("PUT", e, Cf(i, r))
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Jw))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();

        class oC {
            constructor(t, e) {
                this.next = t, this.interceptor = e
            }

            handle(t) {
                return this.interceptor.intercept(t, this.next)
            }
        }

        const aC = new S("HTTP_INTERCEPTORS");
        let nL = (() => {
            class n {
                intercept(e, r) {
                    return r.handle(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();
        const rL = /^\)\]\}',?\n/;
        let lC = (() => {
            class n {
                constructor(e) {
                    this.xhrFactory = e
                }

                handle(e) {
                    if ("JSONP" === e.method) throw new Error("Attempted to construct Jsonp request without HttpClientJsonpModule installed.");
                    return new fe(r => {
                        const i = this.xhrFactory.build();
                        if (i.open(e.method, e.urlWithParams), e.withCredentials && (i.withCredentials = !0), e.headers.forEach((f, p) => i.setRequestHeader(f, p.join(","))), e.headers.has("Accept") || i.setRequestHeader("Accept", "application/json, text/plain, */*"), !e.headers.has("Content-Type")) {
                            const f = e.detectContentTypeHeader();
                            null !== f && i.setRequestHeader("Content-Type", f)
                        }
                        if (e.responseType) {
                            const f = e.responseType.toLowerCase();
                            i.responseType = "json" !== f ? f : "text"
                        }
                        const s = e.serializeBody();
                        let o = null;
                        const a = () => {
                            if (null !== o) return o;
                            const f = i.statusText || "OK", p = new Jn(i.getAllResponseHeaders()), g = function iL(n) {
                                return "responseURL" in n && n.responseURL ? n.responseURL : /^X-Request-URL:/m.test(n.getAllResponseHeaders()) ? n.getResponseHeader("X-Request-URL") : null
                            }(i) || e.url;
                            return o = new wf({headers: p, status: i.status, statusText: f, url: g}), o
                        }, l = () => {
                            let {headers: f, status: p, statusText: g, url: _} = a(), y = null;
                            204 !== p && (y = typeof i.response > "u" ? i.responseText : i.response), 0 === p && (p = y ? 200 : 0);
                            let C = p >= 200 && p < 300;
                            if ("json" === e.responseType && "string" == typeof y) {
                                const v = y;
                                y = y.replace(rL, "");
                                try {
                                    y = "" !== y ? JSON.parse(y) : null
                                } catch (E) {
                                    y = v, C && (C = !1, y = {error: E, text: y})
                                }
                            }
                            C ? (r.next(new Ul({
                                body: y,
                                headers: f,
                                status: p,
                                statusText: g,
                                url: _ || void 0
                            })), r.complete()) : r.error(new iC({
                                error: y,
                                headers: f,
                                status: p,
                                statusText: g,
                                url: _ || void 0
                            }))
                        }, c = f => {
                            const {url: p} = a(), g = new iC({
                                error: f,
                                status: i.status || 0,
                                statusText: i.statusText || "Unknown Error",
                                url: p || void 0
                            });
                            r.error(g)
                        };
                        let u = !1;
                        const d = f => {
                            u || (r.next(a()), u = !0);
                            let p = {type: He.DownloadProgress, loaded: f.loaded};
                            f.lengthComputable && (p.total = f.total), "text" === e.responseType && !!i.responseText && (p.partialText = i.responseText), r.next(p)
                        }, h = f => {
                            let p = {type: He.UploadProgress, loaded: f.loaded};
                            f.lengthComputable && (p.total = f.total), r.next(p)
                        };
                        return i.addEventListener("load", l), i.addEventListener("error", c), i.addEventListener("timeout", c), i.addEventListener("abort", c), e.reportProgress && (i.addEventListener("progress", d), null !== s && i.upload && i.upload.addEventListener("progress", h)), i.send(s), r.next({type: He.Sent}), () => {
                            i.removeEventListener("error", c), i.removeEventListener("abort", c), i.removeEventListener("load", l), i.removeEventListener("timeout", c), e.reportProgress && (i.removeEventListener("progress", d), null !== s && i.upload && i.upload.removeEventListener("progress", h)), i.readyState !== i.DONE && i.abort()
                        }
                    })
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(mD))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();
        const Ef = new S("XSRF_COOKIE_NAME"), Mf = new S("XSRF_HEADER_NAME");

        class cC {
        }

        let sL = (() => {
            class n {
                constructor(e, r, i) {
                    this.doc = e, this.platform = r, this.cookieName = i, this.lastCookieString = "", this.lastToken = null, this.parseCount = 0
                }

                getToken() {
                    if ("server" === this.platform) return null;
                    const e = this.doc.cookie || "";
                    return e !== this.lastCookieString && (this.parseCount++, this.lastToken = sD(e, this.cookieName), this.lastCookieString = e), this.lastToken
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(_e), w(el), w(Ef))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })(), Sf = (() => {
            class n {
                constructor(e, r) {
                    this.tokenService = e, this.headerName = r
                }

                intercept(e, r) {
                    const i = e.url.toLowerCase();
                    if ("GET" === e.method || "HEAD" === e.method || i.startsWith("http://") || i.startsWith("https://")) return r.handle(e);
                    const s = this.tokenService.getToken();
                    return null !== s && !e.headers.has(this.headerName) && (e = e.clone({headers: e.headers.set(this.headerName, s)})), r.handle(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(cC), w(Mf))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })(), oL = (() => {
            class n {
                constructor(e, r) {
                    this.backend = e, this.injector = r, this.chain = null
                }

                handle(e) {
                    if (null === this.chain) {
                        const r = this.injector.get(aC, []);
                        this.chain = r.reduceRight((i, s) => new oC(i, s), this.backend)
                    }
                    return this.chain.handle(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Xw), w(Qt))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })(), aL = (() => {
            class n {
                static disable() {
                    return {ngModule: n, providers: [{provide: Sf, useClass: nL}]}
                }

                static withOptions(e = {}) {
                    return {
                        ngModule: n,
                        providers: [e.cookieName ? {
                            provide: Ef,
                            useValue: e.cookieName
                        } : [], e.headerName ? {provide: Mf, useValue: e.headerName} : []]
                    }
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({
                providers: [Sf, {
                    provide: aC,
                    useExisting: Sf,
                    multi: !0
                }, {provide: cC, useClass: sL}, {provide: Ef, useValue: "XSRF-TOKEN"}, {
                    provide: Mf,
                    useValue: "X-XSRF-TOKEN"
                }]
            }), n
        })(), lL = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({
                providers: [sC, {
                    provide: Jw,
                    useClass: oL
                }, lC, {provide: Xw, useExisting: lC}],
                imports: [aL.withOptions({cookieName: "XSRF-TOKEN", headerName: "X-XSRF-TOKEN"})]
            }), n
        })();
        const uC = "http://localhost:8080/";
        let cL = (() => {
            class n {
                constructor(e) {
                    this.http = e
                }

                getScopes() {
                    return this.http.get(`${uC}scopes`)
                }

                getFaultCurrentInfo() {
                    return this.http.get(`${uC}info`)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(sC))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();

        function dC(n, t, e, r, i, s, o) {
            try {
                var a = n[s](o), l = a.value
            } catch (c) {
                return void e(c)
            }
            a.done ? t(l) : Promise.resolve(l).then(r, i)
        }

        function Tf(n) {
            return function () {
                var t = this, e = arguments;
                return new Promise(function (r, i) {
                    var s = n.apply(t, e);

                    function o(l) {
                        dC(s, r, i, o, a, "next", l)
                    }

                    function a(l) {
                        dC(s, r, i, o, a, "throw", l)
                    }

                    o(void 0)
                })
            }
        }

        class uL extends Ne {
            constructor(t, e) {
                super()
            }

            schedule(t, e = 0) {
                return this
            }
        }

        const $l = {
            setInterval(n, t, ...e) {
                const {delegate: r} = $l;
                return r?.setInterval ? r.setInterval(n, t, ...e) : setInterval(n, t, ...e)
            }, clearInterval(n) {
                const {delegate: t} = $l;
                return (t?.clearInterval || clearInterval)(n)
            }, delegate: void 0
        };

        class If extends uL {
            constructor(t, e) {
                super(t, e), this.scheduler = t, this.work = e, this.pending = !1
            }

            schedule(t, e = 0) {
                if (this.closed) return this;
                this.state = t;
                const r = this.id, i = this.scheduler;
                return null != r && (this.id = this.recycleAsyncId(i, r, e)), this.pending = !0, this.delay = e, this.id = this.id || this.requestAsyncId(i, this.id, e), this
            }

            requestAsyncId(t, e, r = 0) {
                return $l.setInterval(t.flush.bind(t, this), r)
            }

            recycleAsyncId(t, e, r = 0) {
                if (null != r && this.delay === r && !1 === this.pending) return e;
                $l.clearInterval(e)
            }

            execute(t, e) {
                if (this.closed) return new Error("executing a cancelled action");
                this.pending = !1;
                const r = this._execute(t, e);
                if (r) return r;
                !1 === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
            }

            _execute(t, e) {
                let i, r = !1;
                try {
                    this.work(t)
                } catch (s) {
                    r = !0, i = s || new Error("Scheduled action threw falsy error")
                }
                if (r) return this.unsubscribe(), i
            }

            unsubscribe() {
                if (!this.closed) {
                    const {id: t, scheduler: e} = this, {actions: r} = e;
                    this.work = this.state = this.scheduler = null, this.pending = !1, $o(r, this), null != t && (this.id = this.recycleAsyncId(e, t, null)), this.delay = null, super.unsubscribe()
                }
            }
        }

        const hC = {now: () => (hC.delegate || Date).now(), delegate: void 0};

        class Io {
            constructor(t, e = Io.now) {
                this.schedulerActionCtor = t, this.now = e
            }

            schedule(t, e = 0, r) {
                return new this.schedulerActionCtor(this, t).schedule(r, e)
            }
        }

        Io.now = hC.now;

        class Af extends Io {
            constructor(t, e = Io.now) {
                super(t, e), this.actions = [], this._active = !1, this._scheduled = void 0
            }

            flush(t) {
                const {actions: e} = this;
                if (this._active) return void e.push(t);
                let r;
                this._active = !0;
                do {
                    if (r = t.execute(t.state, t.delay)) break
                } while (t = e.shift());
                if (this._active = !1, r) {
                    for (; t = e.shift();) t.unsubscribe();
                    throw r
                }
            }
        }

        const Ao = new Af(If), dL = Ao, fC = {leading: !0, trailing: !1};

        function Rf(n = 0, t, e = dL) {
            let r = -1;
            return null != t && (eg(t) ? e = t : r = t), new fe(i => {
                let s = function fL(n) {
                    return n instanceof Date && !isNaN(n)
                }(n) ? +n - e.now() : n;
                s < 0 && (s = 0);
                let o = 0;
                return e.schedule(function () {
                    i.closed || (i.next(o++), 0 <= r ? this.schedule(void 0, r) : i.complete())
                }, s)
            })
        }

        class xf {
            constructor(t) {
                this.changes = t
            }

            static of(t) {
                return new xf(t)
            }

            notEmpty(t) {
                if (this.changes[t]) {
                    const e = this.changes[t].currentValue;
                    if (null != e) return R(e)
                }
                return wt
            }

            has(t) {
                return this.changes[t] ? R(this.changes[t].currentValue) : wt
            }

            notFirst(t) {
                return this.changes[t] && !this.changes[t].isFirstChange() ? R(this.changes[t].currentValue) : wt
            }

            notFirstAndEmpty(t) {
                if (this.changes[t] && !this.changes[t].isFirstChange()) {
                    const e = this.changes[t].currentValue;
                    if (null != e) return R(e)
                }
                return wt
            }
        }

        const pC = new S("NGX_ECHARTS_CONFIG");
        let kf, gL = (() => {
            class n {
                constructor(e, r, i) {
                    this.el = r, this.ngZone = i, this.autoResize = !0, this.loadingType = "default", this.chartInit = new ie, this.optionsError = new ie, this.chartClick = this.createLazyEvent("click"), this.chartDblClick = this.createLazyEvent("dblclick"), this.chartMouseDown = this.createLazyEvent("mousedown"), this.chartMouseMove = this.createLazyEvent("mousemove"), this.chartMouseUp = this.createLazyEvent("mouseup"), this.chartMouseOver = this.createLazyEvent("mouseover"), this.chartMouseOut = this.createLazyEvent("mouseout"), this.chartGlobalOut = this.createLazyEvent("globalout"), this.chartContextMenu = this.createLazyEvent("contextmenu"), this.chartLegendSelectChanged = this.createLazyEvent("legendselectchanged"), this.chartLegendSelected = this.createLazyEvent("legendselected"), this.chartLegendUnselected = this.createLazyEvent("legendunselected"), this.chartLegendScroll = this.createLazyEvent("legendscroll"), this.chartDataZoom = this.createLazyEvent("datazoom"), this.chartDataRangeSelected = this.createLazyEvent("datarangeselected"), this.chartTimelineChanged = this.createLazyEvent("timelinechanged"), this.chartTimelinePlayChanged = this.createLazyEvent("timelineplaychanged"), this.chartRestore = this.createLazyEvent("restore"), this.chartDataViewChanged = this.createLazyEvent("dataviewchanged"), this.chartMagicTypeChanged = this.createLazyEvent("magictypechanged"), this.chartPieSelectChanged = this.createLazyEvent("pieselectchanged"), this.chartPieSelected = this.createLazyEvent("pieselected"), this.chartPieUnselected = this.createLazyEvent("pieunselected"), this.chartMapSelectChanged = this.createLazyEvent("mapselectchanged"), this.chartMapSelected = this.createLazyEvent("mapselected"), this.chartMapUnselected = this.createLazyEvent("mapunselected"), this.chartAxisAreaSelected = this.createLazyEvent("axisareaselected"), this.chartFocusNodeAdjacency = this.createLazyEvent("focusnodeadjacency"), this.chartUnfocusNodeAdjacency = this.createLazyEvent("unfocusnodeadjacency"), this.chartBrush = this.createLazyEvent("brush"), this.chartBrushEnd = this.createLazyEvent("brushend"), this.chartBrushSelected = this.createLazyEvent("brushselected"), this.chartRendered = this.createLazyEvent("rendered"), this.chartFinished = this.createLazyEvent("finished"), this.animationFrameID = null, this.resize$ = new ve, this.echarts = e.echarts
                }

                ngOnChanges(e) {
                    const r = xf.of(e);
                    r.notFirstAndEmpty("options").subscribe(i => this.onOptionsChange(i)), r.notFirstAndEmpty("merge").subscribe(i => this.setOption(i)), r.has("loading").subscribe(i => this.toggleLoading(!!i)), r.notFirst("theme").subscribe(() => this.refreshChart())
                }

                ngOnInit() {
                    if (!window.ResizeObserver) throw new Error("please install a polyfill for ResizeObserver");
                    this.resizeSub = this.resize$.pipe(function pL(n, t = Ao, e = fC) {
                        const r = Rf(n, t);
                        return function hL(n, t = fC) {
                            return Ee((e, r) => {
                                const {leading: i, trailing: s} = t;
                                let o = !1, a = null, l = null, c = !1;
                                const u = () => {
                                    l?.unsubscribe(), l = null, s && (f(), c && r.complete())
                                }, d = () => {
                                    l = null, c && r.complete()
                                }, h = p => l = Dt(n(p)).subscribe(be(r, u, d)), f = () => {
                                    if (o) {
                                        o = !1;
                                        const p = a;
                                        a = null, r.next(p), !c && h(p)
                                    }
                                };
                                e.subscribe(be(r, p => {
                                    o = !0, a = p, (!l || l.closed) && (i ? f() : h(p))
                                }, () => {
                                    c = !0, (!(s && o && l) || l.closed) && r.complete()
                                }))
                            })
                        }(() => r, e)
                    }(100, Ao, {
                        leading: !1,
                        trailing: !0
                    })).subscribe(() => this.resize()), this.autoResize && (this.resizeOb = this.ngZone.runOutsideAngular(() => new window.ResizeObserver(() => {
                        this.animationFrameID = window.requestAnimationFrame(() => this.resize$.next())
                    })), this.resizeOb.observe(this.el.nativeElement))
                }

                ngOnDestroy() {
                    window.clearTimeout(this.initChartTimer), this.resizeSub && this.resizeSub.unsubscribe(), this.animationFrameID && window.cancelAnimationFrame(this.animationFrameID), this.resizeOb && this.resizeOb.unobserve(this.el.nativeElement), this.dispose()
                }

                ngAfterViewInit() {
                    this.initChartTimer = window.setTimeout(() => this.initChart())
                }

                dispose() {
                    this.chart && (this.chart.isDisposed() || this.chart.dispose(), this.chart = null)
                }

                resize() {
                    this.chart && this.chart.resize()
                }

                toggleLoading(e) {
                    this.chart && (e ? this.chart.showLoading(this.loadingType, this.loadingOpts) : this.chart.hideLoading())
                }

                setOption(e, r) {
                    if (this.chart) try {
                        this.chart.setOption(e, r)
                    } catch (i) {
                        console.error(i), this.optionsError.emit(i)
                    }
                }

                refreshChart() {
                    var e = this;
                    return Tf(function* () {
                        e.dispose(), yield e.initChart()
                    })()
                }

                createChart() {
                    const e = this.el.nativeElement;
                    if (window && window.getComputedStyle) {
                        const r = window.getComputedStyle(e, null).getPropertyValue("height");
                        (!r || "0px" === r) && (!e.style.height || "0px" === e.style.height) && (e.style.height = "400px")
                    }
                    return this.ngZone.runOutsideAngular(() => ("function" == typeof this.echarts ? this.echarts : () => Promise.resolve(this.echarts))().then(({init: i}) => i(e, this.theme, this.initOpts)))
                }

                initChart() {
                    var e = this;
                    return Tf(function* () {
                        yield e.onOptionsChange(e.options), e.merge && e.chart && e.setOption(e.merge)
                    })()
                }

                onOptionsChange(e) {
                    var r = this;
                    return Tf(function* () {
                        !e || (r.chart || (r.chart = yield r.createChart(), r.chartInit.emit(r.chart)), r.setOption(r.options, !0))
                    })()
                }

                createLazyEvent(e) {
                    return this.chartInit.pipe(Xt(r => new fe(i => (r.on(e, s => this.ngZone.run(() => i.next(s))), () => {
                        this.chart && (this.chart.isDisposed() || r.off(e))
                    }))))
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(pC), m(re), m(Z))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["echarts"], ["", "echarts", ""]],
                inputs: {
                    options: "options",
                    theme: "theme",
                    loading: "loading",
                    initOpts: "initOpts",
                    merge: "merge",
                    autoResize: "autoResize",
                    loadingType: "loadingType",
                    loadingOpts: "loadingOpts"
                },
                outputs: {
                    chartInit: "chartInit",
                    optionsError: "optionsError",
                    chartClick: "chartClick",
                    chartDblClick: "chartDblClick",
                    chartMouseDown: "chartMouseDown",
                    chartMouseMove: "chartMouseMove",
                    chartMouseUp: "chartMouseUp",
                    chartMouseOver: "chartMouseOver",
                    chartMouseOut: "chartMouseOut",
                    chartGlobalOut: "chartGlobalOut",
                    chartContextMenu: "chartContextMenu",
                    chartLegendSelectChanged: "chartLegendSelectChanged",
                    chartLegendSelected: "chartLegendSelected",
                    chartLegendUnselected: "chartLegendUnselected",
                    chartLegendScroll: "chartLegendScroll",
                    chartDataZoom: "chartDataZoom",
                    chartDataRangeSelected: "chartDataRangeSelected",
                    chartTimelineChanged: "chartTimelineChanged",
                    chartTimelinePlayChanged: "chartTimelinePlayChanged",
                    chartRestore: "chartRestore",
                    chartDataViewChanged: "chartDataViewChanged",
                    chartMagicTypeChanged: "chartMagicTypeChanged",
                    chartPieSelectChanged: "chartPieSelectChanged",
                    chartPieSelected: "chartPieSelected",
                    chartPieUnselected: "chartPieUnselected",
                    chartMapSelectChanged: "chartMapSelectChanged",
                    chartMapSelected: "chartMapSelected",
                    chartMapUnselected: "chartMapUnselected",
                    chartAxisAreaSelected: "chartAxisAreaSelected",
                    chartFocusNodeAdjacency: "chartFocusNodeAdjacency",
                    chartUnfocusNodeAdjacency: "chartUnfocusNodeAdjacency",
                    chartBrush: "chartBrush",
                    chartBrushEnd: "chartBrushEnd",
                    chartBrushSelected: "chartBrushSelected",
                    chartRendered: "chartRendered",
                    chartFinished: "chartFinished"
                },
                exportAs: ["echarts"],
                features: [Gt]
            }), n
        })(), mL = (() => {
            class n {
                static forRoot(e) {
                    return {ngModule: n, providers: [{provide: pC, useValue: e}]}
                }

                static forChild() {
                    return {ngModule: n}
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({}), n
        })();
        try {
            kf = typeof Intl < "u" && Intl.v8BreakIterator
        } catch {
            kf = !1
        }
        let Ro, Pf, kn = (() => {
            class n {
                constructor(e) {
                    this._platformId = e, this.isBrowser = this._platformId ? function AF(n) {
                        return n === pD
                    }(this._platformId) : "object" == typeof document && !!document, this.EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent), this.TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent), this.BLINK = this.isBrowser && !(!window.chrome && !kf) && typeof CSS < "u" && !this.EDGE && !this.TRIDENT, this.WEBKIT = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT, this.IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window), this.FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent), this.ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT, this.SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(el))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();

        function zl(n) {
            return function _L() {
                if (null == Ro && typeof window < "u") try {
                    window.addEventListener("test", null, Object.defineProperty({}, "passive", {get: () => Ro = !0}))
                } finally {
                    Ro = Ro || !1
                }
                return Ro
            }() ? n : !!n.capture
        }

        function xo(n) {
            return n.composedPath ? n.composedPath()[0] : n.target
        }

        function mC(n, ...t) {
            return t.length ? t.some(e => n[e]) : n.altKey || n.shiftKey || n.ctrlKey || n.metaKey
        }

        function Ff(n, t = Ao) {
            return Ee((e, r) => {
                let i = null, s = null, o = null;
                const a = () => {
                    if (i) {
                        i.unsubscribe(), i = null;
                        const c = s;
                        s = null, r.next(c)
                    }
                };

                function l() {
                    const c = o + n, u = t.now();
                    if (u < c) return i = this.schedule(void 0, c - u), void r.add(i);
                    a()
                }

                e.subscribe(be(r, c => {
                    s = c, o = t.now(), i || (i = t.schedule(l, n), r.add(i))
                }, () => {
                    a(), r.complete()
                }, void 0, () => {
                    s = i = null
                }))
            })
        }

        function Nf(n) {
            return vn((t, e) => n <= e)
        }

        function _C(n, t = rr) {
            return n = n ?? VL, Ee((e, r) => {
                let i, s = !0;
                e.subscribe(be(r, o => {
                    const a = t(o);
                    (s || !n(i, a)) && (s = !1, i = a, r.next(o))
                }))
            })
        }

        function VL(n, t) {
            return n === t
        }

        function Lt(n) {
            return Ee((t, e) => {
                Dt(n).subscribe(be(e, () => e.complete(), Ic)), !e.closed && t.subscribe(e)
            })
        }

        function tn(n) {
            return null != n && "false" != `${n}`
        }

        function Gl(n, t = 0) {
            return function jL(n) {
                return !isNaN(parseFloat(n)) && !isNaN(Number(n))
            }(n) ? Number(n) : t
        }

        function yC(n) {
            return Array.isArray(n) ? n : [n]
        }

        function os(n) {
            return n instanceof re ? n.nativeElement : n
        }

        let vC = (() => {
            class n {
                create(e) {
                    return typeof MutationObserver > "u" ? null : new MutationObserver(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })(), HL = (() => {
            class n {
                constructor(e) {
                    this._mutationObserverFactory = e, this._observedElements = new Map
                }

                ngOnDestroy() {
                    this._observedElements.forEach((e, r) => this._cleanupObserver(r))
                }

                observe(e) {
                    const r = os(e);
                    return new fe(i => {
                        const o = this._observeElement(r).subscribe(i);
                        return () => {
                            o.unsubscribe(), this._unobserveElement(r)
                        }
                    })
                }

                _observeElement(e) {
                    if (this._observedElements.has(e)) this._observedElements.get(e).count++; else {
                        const r = new ve, i = this._mutationObserverFactory.create(s => r.next(s));
                        i && i.observe(e, {
                            characterData: !0,
                            childList: !0,
                            subtree: !0
                        }), this._observedElements.set(e, {observer: i, stream: r, count: 1})
                    }
                    return this._observedElements.get(e).stream
                }

                _unobserveElement(e) {
                    this._observedElements.has(e) && (this._observedElements.get(e).count--, this._observedElements.get(e).count || this._cleanupObserver(e))
                }

                _cleanupObserver(e) {
                    if (this._observedElements.has(e)) {
                        const {observer: r, stream: i} = this._observedElements.get(e);
                        r && r.disconnect(), i.complete(), this._observedElements.delete(e)
                    }
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(vC))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })(), UL = (() => {
            class n {
                constructor(e, r, i) {
                    this._contentObserver = e, this._elementRef = r, this._ngZone = i, this.event = new ie, this._disabled = !1, this._currentSubscription = null
                }

                get disabled() {
                    return this._disabled
                }

                set disabled(e) {
                    this._disabled = tn(e), this._disabled ? this._unsubscribe() : this._subscribe()
                }

                get debounce() {
                    return this._debounce
                }

                set debounce(e) {
                    this._debounce = Gl(e), this._subscribe()
                }

                ngAfterContentInit() {
                    !this._currentSubscription && !this.disabled && this._subscribe()
                }

                ngOnDestroy() {
                    this._unsubscribe()
                }

                _subscribe() {
                    this._unsubscribe();
                    const e = this._contentObserver.observe(this._elementRef);
                    this._ngZone.runOutsideAngular(() => {
                        this._currentSubscription = (this.debounce ? e.pipe(Ff(this.debounce)) : e).subscribe(this.event)
                    })
                }

                _unsubscribe() {
                    this._currentSubscription?.unsubscribe()
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(HL), m(re), m(Z))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "cdkObserveContent", ""]],
                inputs: {disabled: ["cdkObserveContentDisabled", "disabled"], debounce: "debounce"},
                outputs: {event: "cdkObserveContent"},
                exportAs: ["cdkObserveContent"]
            }), n
        })(), bC = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({providers: [vC]}), n
        })();
        const DC = new Set;
        let as, $L = (() => {
            class n {
                constructor(e) {
                    this._platform = e, this._matchMedia = this._platform.isBrowser && window.matchMedia ? window.matchMedia.bind(window) : WL
                }

                matchMedia(e) {
                    return (this._platform.WEBKIT || this._platform.BLINK) && function zL(n) {
                        if (!DC.has(n)) try {
                            as || (as = document.createElement("style"), as.setAttribute("type", "text/css"), document.head.appendChild(as)), as.sheet && (as.sheet.insertRule(`@media ${n} {body{ }}`, 0), DC.add(n))
                        } catch (t) {
                            console.error(t)
                        }
                    }(e), this._matchMedia(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(kn))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();

        function WL(n) {
            return {
                matches: "all" === n || "" === n, media: n, addListener: () => {
                }, removeListener: () => {
                }
            }
        }

        let GL = (() => {
            class n {
                constructor(e, r) {
                    this._mediaMatcher = e, this._zone = r, this._queries = new Map, this._destroySubject = new ve
                }

                ngOnDestroy() {
                    this._destroySubject.next(), this._destroySubject.complete()
                }

                isMatched(e) {
                    return wC(yC(e)).some(i => this._registerQuery(i).mql.matches)
                }

                observe(e) {
                    let s = Uh(wC(yC(e)).map(o => this._registerQuery(o).observable));
                    return s = Dl(s.pipe(Rn(1)), s.pipe(Nf(1), Ff(0))), s.pipe(W(o => {
                        const a = {matches: !1, breakpoints: {}};
                        return o.forEach(({matches: l, query: c}) => {
                            a.matches = a.matches || l, a.breakpoints[c] = l
                        }), a
                    }))
                }

                _registerQuery(e) {
                    if (this._queries.has(e)) return this._queries.get(e);
                    const r = this._mediaMatcher.matchMedia(e), s = {
                        observable: new fe(o => {
                            const a = l => this._zone.run(() => o.next(l));
                            return r.addListener(a), () => {
                                r.removeListener(a)
                            }
                        }).pipe(go(r), W(({matches: o}) => ({query: e, matches: o})), Lt(this._destroySubject)), mql: r
                    };
                    return this._queries.set(e, s), s
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w($L), w(Z))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();

        function wC(n) {
            return n.map(t => t.split(",")).reduce((t, e) => t.concat(e)).map(t => t.trim())
        }

        class ZL extends class QL {
            constructor(t) {
                this._items = t, this._activeItemIndex = -1, this._activeItem = null, this._wrap = !1, this._letterKeyStream = new ve, this._typeaheadSubscription = Ne.EMPTY, this._vertical = !0, this._allowedModifierKeys = [], this._homeAndEnd = !1, this._skipPredicateFn = e => e.disabled, this._pressedLetters = [], this.tabOut = new ve, this.change = new ve, t instanceof Ki && t.changes.subscribe(e => {
                    if (this._activeItem) {
                        const i = e.toArray().indexOf(this._activeItem);
                        i > -1 && i !== this._activeItemIndex && (this._activeItemIndex = i)
                    }
                })
            }

            skipPredicate(t) {
                return this._skipPredicateFn = t, this
            }

            withWrap(t = !0) {
                return this._wrap = t, this
            }

            withVerticalOrientation(t = !0) {
                return this._vertical = t, this
            }

            withHorizontalOrientation(t) {
                return this._horizontal = t, this
            }

            withAllowedModifierKeys(t) {
                return this._allowedModifierKeys = t, this
            }

            withTypeAhead(t = 200) {
                return this._typeaheadSubscription.unsubscribe(), this._typeaheadSubscription = this._letterKeyStream.pipe(st(e => this._pressedLetters.push(e)), Ff(t), vn(() => this._pressedLetters.length > 0), W(() => this._pressedLetters.join(""))).subscribe(e => {
                    const r = this._getItemsArray();
                    for (let i = 1; i < r.length + 1; i++) {
                        const s = (this._activeItemIndex + i) % r.length, o = r[s];
                        if (!this._skipPredicateFn(o) && 0 === o.getLabel().toUpperCase().trim().indexOf(e)) {
                            this.setActiveItem(s);
                            break
                        }
                    }
                    this._pressedLetters = []
                }), this
            }

            withHomeAndEnd(t = !0) {
                return this._homeAndEnd = t, this
            }

            setActiveItem(t) {
                const e = this._activeItem;
                this.updateActiveItem(t), this._activeItem !== e && this.change.next(this._activeItemIndex)
            }

            onKeydown(t) {
                const e = t.keyCode,
                    i = ["altKey", "ctrlKey", "metaKey", "shiftKey"].every(s => !t[s] || this._allowedModifierKeys.indexOf(s) > -1);
                switch (e) {
                    case 9:
                        return void this.tabOut.next();
                    case 40:
                        if (this._vertical && i) {
                            this.setNextItemActive();
                            break
                        }
                        return;
                    case 38:
                        if (this._vertical && i) {
                            this.setPreviousItemActive();
                            break
                        }
                        return;
                    case 39:
                        if (this._horizontal && i) {
                            "rtl" === this._horizontal ? this.setPreviousItemActive() : this.setNextItemActive();
                            break
                        }
                        return;
                    case 37:
                        if (this._horizontal && i) {
                            "rtl" === this._horizontal ? this.setNextItemActive() : this.setPreviousItemActive();
                            break
                        }
                        return;
                    case 36:
                        if (this._homeAndEnd && i) {
                            this.setFirstItemActive();
                            break
                        }
                        return;
                    case 35:
                        if (this._homeAndEnd && i) {
                            this.setLastItemActive();
                            break
                        }
                        return;
                    default:
                        return void ((i || mC(t, "shiftKey")) && (t.key && 1 === t.key.length ? this._letterKeyStream.next(t.key.toLocaleUpperCase()) : (e >= 65 && e <= 90 || e >= 48 && e <= 57) && this._letterKeyStream.next(String.fromCharCode(e))))
                }
                this._pressedLetters = [], t.preventDefault()
            }

            get activeItemIndex() {
                return this._activeItemIndex
            }

            get activeItem() {
                return this._activeItem
            }

            isTyping() {
                return this._pressedLetters.length > 0
            }

            setFirstItemActive() {
                this._setActiveItemByIndex(0, 1)
            }

            setLastItemActive() {
                this._setActiveItemByIndex(this._items.length - 1, -1)
            }

            setNextItemActive() {
                this._activeItemIndex < 0 ? this.setFirstItemActive() : this._setActiveItemByDelta(1)
            }

            setPreviousItemActive() {
                this._activeItemIndex < 0 && this._wrap ? this.setLastItemActive() : this._setActiveItemByDelta(-1)
            }

            updateActiveItem(t) {
                const e = this._getItemsArray(), r = "number" == typeof t ? t : e.indexOf(t);
                this._activeItem = e[r] ?? null, this._activeItemIndex = r
            }

            _setActiveItemByDelta(t) {
                this._wrap ? this._setActiveInWrapMode(t) : this._setActiveInDefaultMode(t)
            }

            _setActiveInWrapMode(t) {
                const e = this._getItemsArray();
                for (let r = 1; r <= e.length; r++) {
                    const i = (this._activeItemIndex + t * r + e.length) % e.length;
                    if (!this._skipPredicateFn(e[i])) return void this.setActiveItem(i)
                }
            }

            _setActiveInDefaultMode(t) {
                this._setActiveItemByIndex(this._activeItemIndex + t, t)
            }

            _setActiveItemByIndex(t, e) {
                const r = this._getItemsArray();
                if (r[t]) {
                    for (; this._skipPredicateFn(r[t]);) if (!r[t += e]) return;
                    this.setActiveItem(t)
                }
            }

            _getItemsArray() {
                return this._items instanceof Ki ? this._items.toArray() : this._items
            }
        } {
            constructor() {
                super(...arguments), this._origin = "program"
            }

            setFocusOrigin(t) {
                return this._origin = t, this
            }

            setActiveItem(t) {
                super.setActiveItem(t), this.activeItem && this.activeItem.focus(this._origin)
            }
        }

        function SC(n) {
            return 0 === n.buttons || 0 === n.offsetX && 0 === n.offsetY
        }

        function TC(n) {
            const t = n.touches && n.touches[0] || n.changedTouches && n.changedTouches[0];
            return !(!t || -1 !== t.identifier || null != t.radiusX && 1 !== t.radiusX || null != t.radiusY && 1 !== t.radiusY)
        }

        const nB = new S("cdk-input-modality-detector-options"), rB = {ignoreKeys: [18, 17, 224, 91, 16]},
            ls = zl({passive: !0, capture: !0});
        let iB = (() => {
            class n {
                constructor(e, r, i, s) {
                    this._platform = e, this._mostRecentTarget = null, this._modality = new Ot(null), this._lastTouchMs = 0, this._onKeydown = o => {
                        this._options?.ignoreKeys?.some(a => a === o.keyCode) || (this._modality.next("keyboard"), this._mostRecentTarget = xo(o))
                    }, this._onMousedown = o => {
                        Date.now() - this._lastTouchMs < 650 || (this._modality.next(SC(o) ? "keyboard" : "mouse"), this._mostRecentTarget = xo(o))
                    }, this._onTouchstart = o => {
                        TC(o) ? this._modality.next("keyboard") : (this._lastTouchMs = Date.now(), this._modality.next("touch"), this._mostRecentTarget = xo(o))
                    }, this._options = {...rB, ...s}, this.modalityDetected = this._modality.pipe(Nf(1)), this.modalityChanged = this.modalityDetected.pipe(_C()), e.isBrowser && r.runOutsideAngular(() => {
                        i.addEventListener("keydown", this._onKeydown, ls), i.addEventListener("mousedown", this._onMousedown, ls), i.addEventListener("touchstart", this._onTouchstart, ls)
                    })
                }

                get mostRecentModality() {
                    return this._modality.value
                }

                ngOnDestroy() {
                    this._modality.complete(), this._platform.isBrowser && (document.removeEventListener("keydown", this._onKeydown, ls), document.removeEventListener("mousedown", this._onMousedown, ls), document.removeEventListener("touchstart", this._onTouchstart, ls))
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(kn), w(Z), w(_e), w(nB, 8))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })();
        const oB = new S("cdk-focus-monitor-default-options"), ql = zl({passive: !0, capture: !0});
        let aB = (() => {
            class n {
                constructor(e, r, i, s, o) {
                    this._ngZone = e, this._platform = r, this._inputModalityDetector = i, this._origin = null, this._windowFocused = !1, this._originFromTouchInteraction = !1, this._elementInfo = new Map, this._monitoredElementCount = 0, this._rootNodeFocusListenerCount = new Map, this._windowFocusListener = () => {
                        this._windowFocused = !0, this._windowFocusTimeoutId = window.setTimeout(() => this._windowFocused = !1)
                    }, this._stopInputModalityDetector = new ve, this._rootNodeFocusAndBlurListener = a => {
                        for (let c = xo(a); c; c = c.parentElement) "focus" === a.type ? this._onFocus(a, c) : this._onBlur(a, c)
                    }, this._document = s, this._detectionMode = o?.detectionMode || 0
                }

                monitor(e, r = !1) {
                    const i = os(e);
                    if (!this._platform.isBrowser || 1 !== i.nodeType) return R(null);
                    const s = function vL(n) {
                        if (function yL() {
                            if (null == Pf) {
                                const n = typeof document < "u" ? document.head : null;
                                Pf = !(!n || !n.createShadowRoot && !n.attachShadow)
                            }
                            return Pf
                        }()) {
                            const t = n.getRootNode ? n.getRootNode() : null;
                            if (typeof ShadowRoot < "u" && ShadowRoot && t instanceof ShadowRoot) return t
                        }
                        return null
                    }(i) || this._getDocument(), o = this._elementInfo.get(i);
                    if (o) return r && (o.checkChildren = !0), o.subject;
                    const a = {checkChildren: r, subject: new ve, rootNode: s};
                    return this._elementInfo.set(i, a), this._registerGlobalListeners(a), a.subject
                }

                stopMonitoring(e) {
                    const r = os(e), i = this._elementInfo.get(r);
                    i && (i.subject.complete(), this._setClasses(r), this._elementInfo.delete(r), this._removeGlobalListeners(i))
                }

                focusVia(e, r, i) {
                    const s = os(e);
                    s === this._getDocument().activeElement ? this._getClosestElementsInfo(s).forEach(([a, l]) => this._originChanged(a, r, l)) : (this._setOrigin(r), "function" == typeof s.focus && s.focus(i))
                }

                ngOnDestroy() {
                    this._elementInfo.forEach((e, r) => this.stopMonitoring(r))
                }

                _getDocument() {
                    return this._document || document
                }

                _getWindow() {
                    return this._getDocument().defaultView || window
                }

                _getFocusOrigin(e) {
                    return this._origin ? this._originFromTouchInteraction ? this._shouldBeAttributedToTouch(e) ? "touch" : "program" : this._origin : this._windowFocused && this._lastFocusOrigin ? this._lastFocusOrigin : e && this._isLastInteractionFromInputLabel(e) ? "mouse" : "program"
                }

                _shouldBeAttributedToTouch(e) {
                    return 1 === this._detectionMode || !!e?.contains(this._inputModalityDetector._mostRecentTarget)
                }

                _setClasses(e, r) {
                    e.classList.toggle("cdk-focused", !!r), e.classList.toggle("cdk-touch-focused", "touch" === r), e.classList.toggle("cdk-keyboard-focused", "keyboard" === r), e.classList.toggle("cdk-mouse-focused", "mouse" === r), e.classList.toggle("cdk-program-focused", "program" === r)
                }

                _setOrigin(e, r = !1) {
                    this._ngZone.runOutsideAngular(() => {
                        this._origin = e, this._originFromTouchInteraction = "touch" === e && r, 0 === this._detectionMode && (clearTimeout(this._originTimeoutId), this._originTimeoutId = setTimeout(() => this._origin = null, this._originFromTouchInteraction ? 650 : 1))
                    })
                }

                _onFocus(e, r) {
                    const i = this._elementInfo.get(r), s = xo(e);
                    !i || !i.checkChildren && r !== s || this._originChanged(r, this._getFocusOrigin(s), i)
                }

                _onBlur(e, r) {
                    const i = this._elementInfo.get(r);
                    !i || i.checkChildren && e.relatedTarget instanceof Node && r.contains(e.relatedTarget) || (this._setClasses(r), this._emitOrigin(i, null))
                }

                _emitOrigin(e, r) {
                    e.subject.observers.length && this._ngZone.run(() => e.subject.next(r))
                }

                _registerGlobalListeners(e) {
                    if (!this._platform.isBrowser) return;
                    const r = e.rootNode, i = this._rootNodeFocusListenerCount.get(r) || 0;
                    i || this._ngZone.runOutsideAngular(() => {
                        r.addEventListener("focus", this._rootNodeFocusAndBlurListener, ql), r.addEventListener("blur", this._rootNodeFocusAndBlurListener, ql)
                    }), this._rootNodeFocusListenerCount.set(r, i + 1), 1 == ++this._monitoredElementCount && (this._ngZone.runOutsideAngular(() => {
                        this._getWindow().addEventListener("focus", this._windowFocusListener)
                    }), this._inputModalityDetector.modalityDetected.pipe(Lt(this._stopInputModalityDetector)).subscribe(s => {
                        this._setOrigin(s, !0)
                    }))
                }

                _removeGlobalListeners(e) {
                    const r = e.rootNode;
                    if (this._rootNodeFocusListenerCount.has(r)) {
                        const i = this._rootNodeFocusListenerCount.get(r);
                        i > 1 ? this._rootNodeFocusListenerCount.set(r, i - 1) : (r.removeEventListener("focus", this._rootNodeFocusAndBlurListener, ql), r.removeEventListener("blur", this._rootNodeFocusAndBlurListener, ql), this._rootNodeFocusListenerCount.delete(r))
                    }
                    --this._monitoredElementCount || (this._getWindow().removeEventListener("focus", this._windowFocusListener), this._stopInputModalityDetector.next(), clearTimeout(this._windowFocusTimeoutId), clearTimeout(this._originTimeoutId))
                }

                _originChanged(e, r, i) {
                    this._setClasses(e, r), this._emitOrigin(i, r), this._lastFocusOrigin = r
                }

                _getClosestElementsInfo(e) {
                    const r = [];
                    return this._elementInfo.forEach((i, s) => {
                        (s === e || i.checkChildren && s.contains(e)) && r.push([s, i])
                    }), r
                }

                _isLastInteractionFromInputLabel(e) {
                    const {_mostRecentTarget: r, mostRecentModality: i} = this._inputModalityDetector;
                    if ("mouse" !== i || !r || r === e || "INPUT" !== e.nodeName && "TEXTAREA" !== e.nodeName || e.disabled) return !1;
                    const s = e.labels;
                    if (s) for (let o = 0; o < s.length; o++) if (s[o].contains(r)) return !0;
                    return !1
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Z), w(kn), w(iB), w(_e, 8), w(oB, 8))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })(), lB = (() => {
            class n {
                constructor(e, r) {
                    this._elementRef = e, this._focusMonitor = r, this.cdkFocusChange = new ie
                }

                ngAfterViewInit() {
                    const e = this._elementRef.nativeElement;
                    this._monitorSubscription = this._focusMonitor.monitor(e, 1 === e.nodeType && e.hasAttribute("cdkMonitorSubtreeFocus")).subscribe(r => this.cdkFocusChange.emit(r))
                }

                ngOnDestroy() {
                    this._focusMonitor.stopMonitoring(this._elementRef), this._monitorSubscription && this._monitorSubscription.unsubscribe()
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(aB))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "cdkMonitorElementFocus", ""], ["", "cdkMonitorSubtreeFocus", ""]],
                outputs: {cdkFocusChange: "cdkFocusChange"}
            }), n
        })();
        const AC = "cdk-high-contrast-black-on-white", RC = "cdk-high-contrast-white-on-black",
            Of = "cdk-high-contrast-active";
        let xC = (() => {
            class n {
                constructor(e, r) {
                    this._platform = e, this._document = r, this._breakpointSubscription = Ce(GL).observe("(forced-colors: active)").subscribe(() => {
                        this._hasCheckedHighContrastMode && (this._hasCheckedHighContrastMode = !1, this._applyBodyHighContrastModeCssClasses())
                    })
                }

                getHighContrastMode() {
                    if (!this._platform.isBrowser) return 0;
                    const e = this._document.createElement("div");
                    e.style.backgroundColor = "rgb(1,2,3)", e.style.position = "absolute", this._document.body.appendChild(e);
                    const r = this._document.defaultView || window,
                        i = r && r.getComputedStyle ? r.getComputedStyle(e) : null,
                        s = (i && i.backgroundColor || "").replace(/ /g, "");
                    switch (e.remove(), s) {
                        case"rgb(0,0,0)":
                            return 2;
                        case"rgb(255,255,255)":
                            return 1
                    }
                    return 0
                }

                ngOnDestroy() {
                    this._breakpointSubscription.unsubscribe()
                }

                _applyBodyHighContrastModeCssClasses() {
                    if (!this._hasCheckedHighContrastMode && this._platform.isBrowser && this._document.body) {
                        const e = this._document.body.classList;
                        e.remove(Of, AC, RC), this._hasCheckedHighContrastMode = !0;
                        const r = this.getHighContrastMode();
                        1 === r ? e.add(Of, AC) : 2 === r && e.add(Of, RC)
                    }
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(kn), w(_e))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })(), cB = (() => {
            class n {
                constructor(e) {
                    e._applyBodyHighContrastModeCssClasses()
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(xC))
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({imports: [bC]}), n
        })();

        class Lf {
            attach(t) {
                return this._attachedHost = t, t.attach(this)
            }

            detach() {
                let t = this._attachedHost;
                null != t && (this._attachedHost = null, t.detach())
            }

            get isAttached() {
                return null != this._attachedHost
            }

            setAttachedHost(t) {
                this._attachedHost = t
            }
        }

        class uB extends Lf {
            constructor(t, e, r, i) {
                super(), this.component = t, this.viewContainerRef = e, this.injector = r, this.componentFactoryResolver = i
            }
        }

        class kC extends Lf {
            constructor(t, e, r, i) {
                super(), this.templateRef = t, this.viewContainerRef = e, this.context = r, this.injector = i
            }

            get origin() {
                return this.templateRef.elementRef
            }

            attach(t, e = this.context) {
                return this.context = e, super.attach(t)
            }

            detach() {
                return this.context = void 0, super.detach()
            }
        }

        class dB extends Lf {
            constructor(t) {
                super(), this.element = t instanceof re ? t.nativeElement : t
            }
        }

        let Bf = (() => {
            class n extends class hB {
                constructor() {
                    this._isDisposed = !1, this.attachDomPortal = null
                }

                hasAttached() {
                    return !!this._attachedPortal
                }

                attach(t) {
                    return t instanceof uB ? (this._attachedPortal = t, this.attachComponentPortal(t)) : t instanceof kC ? (this._attachedPortal = t, this.attachTemplatePortal(t)) : this.attachDomPortal && t instanceof dB ? (this._attachedPortal = t, this.attachDomPortal(t)) : void 0
                }

                detach() {
                    this._attachedPortal && (this._attachedPortal.setAttachedHost(null), this._attachedPortal = null), this._invokeDisposeFn()
                }

                dispose() {
                    this.hasAttached() && this.detach(), this._invokeDisposeFn(), this._isDisposed = !0
                }

                setDisposeFn(t) {
                    this._disposeFn = t
                }

                _invokeDisposeFn() {
                    this._disposeFn && (this._disposeFn(), this._disposeFn = null)
                }
            } {
                constructor(e, r, i) {
                    super(), this._componentFactoryResolver = e, this._viewContainerRef = r, this._isInitialized = !1, this.attached = new ie, this.attachDomPortal = s => {
                        const o = s.element, a = this._document.createComment("dom-portal");
                        s.setAttachedHost(this), o.parentNode.insertBefore(a, o), this._getRootNode().appendChild(o), this._attachedPortal = s, super.setDisposeFn(() => {
                            a.parentNode && a.parentNode.replaceChild(o, a)
                        })
                    }, this._document = i
                }

                get portal() {
                    return this._attachedPortal
                }

                set portal(e) {
                    this.hasAttached() && !e && !this._isInitialized || (this.hasAttached() && super.detach(), e && super.attach(e), this._attachedPortal = e || null)
                }

                get attachedRef() {
                    return this._attachedRef
                }

                ngOnInit() {
                    this._isInitialized = !0
                }

                ngOnDestroy() {
                    super.dispose(), this._attachedPortal = null, this._attachedRef = null
                }

                attachComponentPortal(e) {
                    e.setAttachedHost(this);
                    const r = null != e.viewContainerRef ? e.viewContainerRef : this._viewContainerRef,
                        s = (e.componentFactoryResolver || this._componentFactoryResolver).resolveComponentFactory(e.component),
                        o = r.createComponent(s, r.length, e.injector || r.injector);
                    return r !== this._viewContainerRef && this._getRootNode().appendChild(o.hostView.rootNodes[0]), super.setDisposeFn(() => o.destroy()), this._attachedPortal = e, this._attachedRef = o, this.attached.emit(o), o
                }

                attachTemplatePortal(e) {
                    e.setAttachedHost(this);
                    const r = this._viewContainerRef.createEmbeddedView(e.templateRef, e.context, {injector: e.injector});
                    return super.setDisposeFn(() => this._viewContainerRef.clear()), this._attachedPortal = e, this._attachedRef = r, this.attached.emit(r), r
                }

                _getRootNode() {
                    const e = this._viewContainerRef.element.nativeElement;
                    return e.nodeType === e.ELEMENT_NODE ? e : e.parentNode
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Br), m(Ke), m(_e))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "cdkPortalOutlet", ""]],
                inputs: {portal: ["cdkPortalOutlet", "portal"]},
                outputs: {attached: "attached"},
                exportAs: ["cdkPortalOutlet"],
                features: [ee]
            }), n
        })(), fB = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({}), n
        })();
        const pB = new S("cdk-dir-doc", {
                providedIn: "root", factory: function gB() {
                    return Ce(_e)
                }
            }),
            mB = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
        let cs = (() => {
            class n {
                constructor(e) {
                    if (this.value = "ltr", this.change = new ie, e) {
                        const i = e.documentElement ? e.documentElement.dir : null;
                        this.value = function _B(n) {
                            const t = n?.toLowerCase() || "";
                            return "auto" === t && typeof navigator < "u" && navigator?.language ? mB.test(navigator.language) ? "rtl" : "ltr" : "rtl" === t ? "rtl" : "ltr"
                        }((e.body ? e.body.dir : null) || i || "ltr")
                    }
                }

                ngOnDestroy() {
                    this.change.complete()
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(pB, 8))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })(), Kl = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({}), n
        })();
        const vB = new S("mat-sanity-checks", {
            providedIn: "root", factory: function yB() {
                return !0
            }
        });
        let us = (() => {
            class n {
                constructor(e, r, i) {
                    this._sanityChecks = r, this._document = i, this._hasDoneGlobalChecks = !1, e._applyBodyHighContrastModeCssClasses(), this._hasDoneGlobalChecks || (this._hasDoneGlobalChecks = !0)
                }

                _checkIsEnabled(e) {
                    return !function bL() {
                        return typeof __karma__ < "u" && !!__karma__ || typeof jasmine < "u" && !!jasmine || typeof jest < "u" && !!jest || typeof Mocha < "u" && !!Mocha
                    }() && ("boolean" == typeof this._sanityChecks ? this._sanityChecks : !!this._sanityChecks[e])
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(xC), w(vB, 8), w(_e))
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({imports: [Kl, Kl]}), n
        })();

        function NC(n) {
            return class extends n {
                constructor(...t) {
                    super(...t), this._disabled = !1
                }

                get disabled() {
                    return this._disabled
                }

                set disabled(t) {
                    this._disabled = tn(t)
                }
            }
        }

        function bB(n, t) {
            return class extends n {
                constructor(...e) {
                    super(...e), this.defaultColor = t, this.color = t
                }

                get color() {
                    return this._color
                }

                set color(e) {
                    const r = e || this.defaultColor;
                    r !== this._color && (this._color && this._elementRef.nativeElement.classList.remove(`mat-${this._color}`), r && this._elementRef.nativeElement.classList.add(`mat-${r}`), this._color = r)
                }
            }
        }

        function DB(n) {
            return class extends n {
                constructor(...t) {
                    super(...t), this._disableRipple = !1
                }

                get disableRipple() {
                    return this._disableRipple
                }

                set disableRipple(t) {
                    this._disableRipple = tn(t)
                }
            }
        }

        class CB {
            constructor(t, e, r, i = !1) {
                this._renderer = t, this.element = e, this.config = r, this._animationForciblyDisabledThroughCss = i, this.state = 3
            }

            fadeOut() {
                this._renderer.fadeOutRipple(this)
            }
        }

        const OC = {enterDuration: 225, exitDuration: 150}, Vf = zl({passive: !0}), LC = ["mousedown", "touchstart"],
            BC = ["mouseup", "mouseleave", "touchend", "touchcancel"];

        class MB {
            constructor(t, e, r, i) {
                this._target = t, this._ngZone = e, this._isPointerDown = !1, this._activeRipples = new Map, this._pointerUpEventsRegistered = !1, i.isBrowser && (this._containerElement = os(r))
            }

            fadeInRipple(t, e, r = {}) {
                const i = this._containerRect = this._containerRect || this._containerElement.getBoundingClientRect(),
                    s = {...OC, ...r.animation};
                r.centered && (t = i.left + i.width / 2, e = i.top + i.height / 2);
                const o = r.radius || function SB(n, t, e) {
                    const r = Math.max(Math.abs(n - e.left), Math.abs(n - e.right)),
                        i = Math.max(Math.abs(t - e.top), Math.abs(t - e.bottom));
                    return Math.sqrt(r * r + i * i)
                }(t, e, i), a = t - i.left, l = e - i.top, c = s.enterDuration, u = document.createElement("div");
                u.classList.add("mat-ripple-element"), u.style.left = a - o + "px", u.style.top = l - o + "px", u.style.height = 2 * o + "px", u.style.width = 2 * o + "px", null != r.color && (u.style.backgroundColor = r.color), u.style.transitionDuration = `${c}ms`, this._containerElement.appendChild(u);
                const d = window.getComputedStyle(u), f = d.transitionDuration,
                    p = "none" === d.transitionProperty || "0s" === f || "0s, 0s" === f, g = new CB(this, u, r, p);
                u.style.transform = "scale3d(1, 1, 1)", g.state = 0, r.persistent || (this._mostRecentTransientRipple = g);
                let _ = null;
                return !p && (c || s.exitDuration) && this._ngZone.runOutsideAngular(() => {
                    const y = () => this._finishRippleTransition(g), C = () => this._destroyRipple(g);
                    u.addEventListener("transitionend", y), u.addEventListener("transitioncancel", C), _ = {
                        onTransitionEnd: y,
                        onTransitionCancel: C
                    }
                }), this._activeRipples.set(g, _), (p || !c) && this._finishRippleTransition(g), g
            }

            fadeOutRipple(t) {
                if (2 === t.state || 3 === t.state) return;
                const e = t.element, r = {...OC, ...t.config.animation};
                e.style.transitionDuration = `${r.exitDuration}ms`, e.style.opacity = "0", t.state = 2, (t._animationForciblyDisabledThroughCss || !r.exitDuration) && this._finishRippleTransition(t)
            }

            fadeOutAll() {
                this._getActiveRipples().forEach(t => t.fadeOut())
            }

            fadeOutAllNonPersistent() {
                this._getActiveRipples().forEach(t => {
                    t.config.persistent || t.fadeOut()
                })
            }

            setupTriggerEvents(t) {
                const e = os(t);
                !e || e === this._triggerElement || (this._removeTriggerEvents(), this._triggerElement = e, this._registerEvents(LC))
            }

            handleEvent(t) {
                "mousedown" === t.type ? this._onMousedown(t) : "touchstart" === t.type ? this._onTouchStart(t) : this._onPointerUp(), this._pointerUpEventsRegistered || (this._registerEvents(BC), this._pointerUpEventsRegistered = !0)
            }

            _finishRippleTransition(t) {
                0 === t.state ? this._startFadeOutTransition(t) : 2 === t.state && this._destroyRipple(t)
            }

            _startFadeOutTransition(t) {
                const e = t === this._mostRecentTransientRipple, {persistent: r} = t.config;
                t.state = 1, !r && (!e || !this._isPointerDown) && t.fadeOut()
            }

            _destroyRipple(t) {
                const e = this._activeRipples.get(t) ?? null;
                this._activeRipples.delete(t), this._activeRipples.size || (this._containerRect = null), t === this._mostRecentTransientRipple && (this._mostRecentTransientRipple = null), t.state = 3, null !== e && (t.element.removeEventListener("transitionend", e.onTransitionEnd), t.element.removeEventListener("transitioncancel", e.onTransitionCancel)), t.element.remove()
            }

            _onMousedown(t) {
                const e = SC(t), r = this._lastTouchStartEvent && Date.now() < this._lastTouchStartEvent + 800;
                !this._target.rippleDisabled && !e && !r && (this._isPointerDown = !0, this.fadeInRipple(t.clientX, t.clientY, this._target.rippleConfig))
            }

            _onTouchStart(t) {
                if (!this._target.rippleDisabled && !TC(t)) {
                    this._lastTouchStartEvent = Date.now(), this._isPointerDown = !0;
                    const e = t.changedTouches;
                    for (let r = 0; r < e.length; r++) this.fadeInRipple(e[r].clientX, e[r].clientY, this._target.rippleConfig)
                }
            }

            _onPointerUp() {
                !this._isPointerDown || (this._isPointerDown = !1, this._getActiveRipples().forEach(t => {
                    !t.config.persistent && (1 === t.state || t.config.terminateOnPointerUp && 0 === t.state) && t.fadeOut()
                }))
            }

            _registerEvents(t) {
                this._ngZone.runOutsideAngular(() => {
                    t.forEach(e => {
                        this._triggerElement.addEventListener(e, this, Vf)
                    })
                })
            }

            _getActiveRipples() {
                return Array.from(this._activeRipples.keys())
            }

            _removeTriggerEvents() {
                this._triggerElement && (LC.forEach(t => {
                    this._triggerElement.removeEventListener(t, this, Vf)
                }), this._pointerUpEventsRegistered && BC.forEach(t => {
                    this._triggerElement.removeEventListener(t, this, Vf)
                }))
            }
        }

        const TB = new S("mat-ripple-global-options");
        let VC = (() => {
            class n {
                constructor(e, r, i, s, o) {
                    this._elementRef = e, this._animationMode = o, this.radius = 0, this._disabled = !1, this._isInitialized = !1, this._globalOptions = s || {}, this._rippleRenderer = new MB(this, r, e, i)
                }

                get disabled() {
                    return this._disabled
                }

                set disabled(e) {
                    e && this.fadeOutAllNonPersistent(), this._disabled = e, this._setupTriggerEventsIfEnabled()
                }

                get trigger() {
                    return this._trigger || this._elementRef.nativeElement
                }

                set trigger(e) {
                    this._trigger = e, this._setupTriggerEventsIfEnabled()
                }

                ngOnInit() {
                    this._isInitialized = !0, this._setupTriggerEventsIfEnabled()
                }

                ngOnDestroy() {
                    this._rippleRenderer._removeTriggerEvents()
                }

                fadeOutAll() {
                    this._rippleRenderer.fadeOutAll()
                }

                fadeOutAllNonPersistent() {
                    this._rippleRenderer.fadeOutAllNonPersistent()
                }

                get rippleConfig() {
                    return {
                        centered: this.centered,
                        radius: this.radius,
                        color: this.color,
                        animation: {
                            ...this._globalOptions.animation, ..."NoopAnimations" === this._animationMode ? {
                                enterDuration: 0,
                                exitDuration: 0
                            } : {}, ...this.animation
                        },
                        terminateOnPointerUp: this._globalOptions.terminateOnPointerUp
                    }
                }

                get rippleDisabled() {
                    return this.disabled || !!this._globalOptions.disabled
                }

                _setupTriggerEventsIfEnabled() {
                    !this.disabled && this._isInitialized && this._rippleRenderer.setupTriggerEvents(this.trigger)
                }

                launch(e, r = 0, i) {
                    return "number" == typeof e ? this._rippleRenderer.fadeInRipple(e, r, {...this.rippleConfig, ...i}) : this._rippleRenderer.fadeInRipple(0, 0, {...this.rippleConfig, ...e})
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(Z), m(kn), m(TB, 8), m(zn, 8))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "mat-ripple", ""], ["", "matRipple", ""]],
                hostAttrs: [1, "mat-ripple"],
                hostVars: 2,
                hostBindings: function (e, r) {
                    2 & e && rt("mat-ripple-unbounded", r.unbounded)
                },
                inputs: {
                    color: ["matRippleColor", "color"],
                    unbounded: ["matRippleUnbounded", "unbounded"],
                    centered: ["matRippleCentered", "centered"],
                    radius: ["matRippleRadius", "radius"],
                    animation: ["matRippleAnimation", "animation"],
                    disabled: ["matRippleDisabled", "disabled"],
                    trigger: ["matRippleTrigger", "trigger"]
                },
                exportAs: ["matRipple"]
            }), n
        })(), IB = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({imports: [us, us]}), n
        })();
        const AB = ["addListener", "removeListener"], RB = ["addEventListener", "removeEventListener"],
            xB = ["on", "off"];

        function Po(n, t, e, r) {
            if (J(e) && (r = e, e = void 0), r) return Po(n, t, e).pipe(OD(r));
            const [i, s] = function FB(n) {
                return J(n.addEventListener) && J(n.removeEventListener)
            }(n) ? RB.map(o => a => n[o](t, a, e)) : function kB(n) {
                return J(n.addListener) && J(n.removeListener)
            }(n) ? AB.map(jC(n, t)) : function PB(n) {
                return J(n.on) && J(n.off)
            }(n) ? xB.map(jC(n, t)) : [];
            if (!i && Nc(n)) return Ze(o => Po(o, t, e))(Dt(n));
            if (!i) throw new TypeError("Invalid event target");
            return new fe(o => {
                const a = (...l) => o.next(1 < l.length ? l : l[0]);
                return i(a), () => s(a)
            })
        }

        function jC(n, t) {
            return e => r => n[e](t, r)
        }

        class HC {
        }

        const Xn = "*";

        function OB(n, t) {
            return {type: 7, name: n, definitions: t, options: {}}
        }

        function jf(n, t = null) {
            return {type: 4, styles: t, timings: n}
        }

        function UC(n, t = null) {
            return {type: 2, steps: n, options: t}
        }

        function Jr(n) {
            return {type: 6, styles: n, offset: null}
        }

        function Hf(n, t, e) {
            return {type: 0, name: n, styles: t, options: e}
        }

        function Uf(n, t, e = null) {
            return {type: 1, expr: n, animation: t, options: e}
        }

        function $C(n) {
            Promise.resolve(null).then(n)
        }

        class Fo {
            constructor(t = 0, e = 0) {
                this._onDoneFns = [], this._onStartFns = [], this._onDestroyFns = [], this._originalOnDoneFns = [], this._originalOnStartFns = [], this._started = !1, this._destroyed = !1, this._finished = !1, this._position = 0, this.parentPlayer = null, this.totalTime = t + e
            }

            _onFinish() {
                this._finished || (this._finished = !0, this._onDoneFns.forEach(t => t()), this._onDoneFns = [])
            }

            onStart(t) {
                this._originalOnStartFns.push(t), this._onStartFns.push(t)
            }

            onDone(t) {
                this._originalOnDoneFns.push(t), this._onDoneFns.push(t)
            }

            onDestroy(t) {
                this._onDestroyFns.push(t)
            }

            hasStarted() {
                return this._started
            }

            init() {
            }

            play() {
                this.hasStarted() || (this._onStart(), this.triggerMicrotask()), this._started = !0
            }

            triggerMicrotask() {
                $C(() => this._onFinish())
            }

            _onStart() {
                this._onStartFns.forEach(t => t()), this._onStartFns = []
            }

            pause() {
            }

            restart() {
            }

            finish() {
                this._onFinish()
            }

            destroy() {
                this._destroyed || (this._destroyed = !0, this.hasStarted() || this._onStart(), this.finish(), this._onDestroyFns.forEach(t => t()), this._onDestroyFns = [])
            }

            reset() {
                this._started = !1, this._finished = !1, this._onStartFns = this._originalOnStartFns, this._onDoneFns = this._originalOnDoneFns
            }

            setPosition(t) {
                this._position = this.totalTime ? t * this.totalTime : 1
            }

            getPosition() {
                return this.totalTime ? this._position / this.totalTime : 1
            }

            triggerCallback(t) {
                const e = "start" == t ? this._onStartFns : this._onDoneFns;
                e.forEach(r => r()), e.length = 0
            }
        }

        class zC {
            constructor(t) {
                this._onDoneFns = [], this._onStartFns = [], this._finished = !1, this._started = !1, this._destroyed = !1, this._onDestroyFns = [], this.parentPlayer = null, this.totalTime = 0, this.players = t;
                let e = 0, r = 0, i = 0;
                const s = this.players.length;
                0 == s ? $C(() => this._onFinish()) : this.players.forEach(o => {
                    o.onDone(() => {
                        ++e == s && this._onFinish()
                    }), o.onDestroy(() => {
                        ++r == s && this._onDestroy()
                    }), o.onStart(() => {
                        ++i == s && this._onStart()
                    })
                }), this.totalTime = this.players.reduce((o, a) => Math.max(o, a.totalTime), 0)
            }

            _onFinish() {
                this._finished || (this._finished = !0, this._onDoneFns.forEach(t => t()), this._onDoneFns = [])
            }

            init() {
                this.players.forEach(t => t.init())
            }

            onStart(t) {
                this._onStartFns.push(t)
            }

            _onStart() {
                this.hasStarted() || (this._started = !0, this._onStartFns.forEach(t => t()), this._onStartFns = [])
            }

            onDone(t) {
                this._onDoneFns.push(t)
            }

            onDestroy(t) {
                this._onDestroyFns.push(t)
            }

            hasStarted() {
                return this._started
            }

            play() {
                this.parentPlayer || this.init(), this._onStart(), this.players.forEach(t => t.play())
            }

            pause() {
                this.players.forEach(t => t.pause())
            }

            restart() {
                this.players.forEach(t => t.restart())
            }

            finish() {
                this._onFinish(), this.players.forEach(t => t.finish())
            }

            destroy() {
                this._onDestroy()
            }

            _onDestroy() {
                this._destroyed || (this._destroyed = !0, this._onFinish(), this.players.forEach(t => t.destroy()), this._onDestroyFns.forEach(t => t()), this._onDestroyFns = [])
            }

            reset() {
                this.players.forEach(t => t.reset()), this._destroyed = !1, this._finished = !1, this._started = !1
            }

            setPosition(t) {
                const e = t * this.totalTime;
                this.players.forEach(r => {
                    const i = r.totalTime ? Math.min(1, e / r.totalTime) : 1;
                    r.setPosition(i)
                })
            }

            getPosition() {
                const t = this.players.reduce((e, r) => null === e || r.totalTime > e.totalTime ? r : e, null);
                return null != t ? t.getPosition() : 0
            }

            beforeDestroy() {
                this.players.forEach(t => {
                    t.beforeDestroy && t.beforeDestroy()
                })
            }

            triggerCallback(t) {
                const e = "start" == t ? this._onStartFns : this._onDoneFns;
                e.forEach(r => r()), e.length = 0
            }
        }

        const No = {
            schedule(n) {
                let t = requestAnimationFrame, e = cancelAnimationFrame;
                const {delegate: r} = No;
                r && (t = r.requestAnimationFrame, e = r.cancelAnimationFrame);
                const i = t(s => {
                    e = void 0, n(s)
                });
                return new Ne(() => e?.(i))
            }, requestAnimationFrame(...n) {
                const {delegate: t} = No;
                return (t?.requestAnimationFrame || requestAnimationFrame)(...n)
            }, cancelAnimationFrame(...n) {
                const {delegate: t} = No;
                return (t?.cancelAnimationFrame || cancelAnimationFrame)(...n)
            }, delegate: void 0
        };
        new class BB extends Af {
            flush(t) {
                this._active = !0;
                const e = this._scheduled;
                this._scheduled = void 0;
                const {actions: r} = this;
                let i;
                t = t || r.shift();
                do {
                    if (i = t.execute(t.state, t.delay)) break
                } while ((t = r[0]) && t.id === e && r.shift());
                if (this._active = !1, i) {
                    for (; (t = r[0]) && t.id === e && r.shift();) t.unsubscribe();
                    throw i
                }
            }
        }(class LB extends If {
            constructor(t, e) {
                super(t, e), this.scheduler = t, this.work = e
            }

            requestAsyncId(t, e, r = 0) {
                return null !== r && r > 0 ? super.requestAsyncId(t, e, r) : (t.actions.push(this), t._scheduled || (t._scheduled = No.requestAnimationFrame(() => t.flush(void 0))))
            }

            recycleAsyncId(t, e, r = 0) {
                if (null != r && r > 0 || null == r && this.delay > 0) return super.recycleAsyncId(t, e, r);
                t.actions.some(i => i.id === e) || (No.cancelAnimationFrame(e), t._scheduled = void 0)
            }
        });
        let zf, jB = 1;
        const Ql = {};

        function WC(n) {
            return n in Ql && (delete Ql[n], !0)
        }

        const HB = {
            setImmediate(n) {
                const t = jB++;
                return Ql[t] = !0, zf || (zf = Promise.resolve()), zf.then(() => WC(t) && n()), t
            }, clearImmediate(n) {
                WC(n)
            }
        }, {setImmediate: UB, clearImmediate: $B} = HB, Zl = {
            setImmediate(...n) {
                const {delegate: t} = Zl;
                return (t?.setImmediate || UB)(...n)
            }, clearImmediate(n) {
                const {delegate: t} = Zl;
                return (t?.clearImmediate || $B)(n)
            }, delegate: void 0
        };
        new class WB extends Af {
            flush(t) {
                this._active = !0;
                const e = this._scheduled;
                this._scheduled = void 0;
                const {actions: r} = this;
                let i;
                t = t || r.shift();
                do {
                    if (i = t.execute(t.state, t.delay)) break
                } while ((t = r[0]) && t.id === e && r.shift());
                if (this._active = !1, i) {
                    for (; (t = r[0]) && t.id === e && r.shift();) t.unsubscribe();
                    throw i
                }
            }
        }(class zB extends If {
            constructor(t, e) {
                super(t, e), this.scheduler = t, this.work = e
            }

            requestAsyncId(t, e, r = 0) {
                return null !== r && r > 0 ? super.requestAsyncId(t, e, r) : (t.actions.push(this), t._scheduled || (t._scheduled = Zl.setImmediate(t.flush.bind(t, void 0))))
            }

            recycleAsyncId(t, e, r = 0) {
                if (null != r && r > 0 || null == r && this.delay > 0) return super.recycleAsyncId(t, e, r);
                t.actions.some(i => i.id === e) || (Zl.clearImmediate(e), t._scheduled = void 0)
            }
        });
        let Yl = (() => {
            class n {
                constructor(e, r, i) {
                    this._platform = e, this._change = new ve, this._changeListener = s => {
                        this._change.next(s)
                    }, this._document = i, r.runOutsideAngular(() => {
                        if (e.isBrowser) {
                            const s = this._getWindow();
                            s.addEventListener("resize", this._changeListener), s.addEventListener("orientationchange", this._changeListener)
                        }
                        this.change().subscribe(() => this._viewportSize = null)
                    })
                }

                ngOnDestroy() {
                    if (this._platform.isBrowser) {
                        const e = this._getWindow();
                        e.removeEventListener("resize", this._changeListener), e.removeEventListener("orientationchange", this._changeListener)
                    }
                    this._change.complete()
                }

                getViewportSize() {
                    this._viewportSize || this._updateViewportSize();
                    const e = {width: this._viewportSize.width, height: this._viewportSize.height};
                    return this._platform.isBrowser || (this._viewportSize = null), e
                }

                getViewportRect() {
                    const e = this.getViewportScrollPosition(), {width: r, height: i} = this.getViewportSize();
                    return {top: e.top, left: e.left, bottom: e.top + i, right: e.left + r, height: i, width: r}
                }

                getViewportScrollPosition() {
                    if (!this._platform.isBrowser) return {top: 0, left: 0};
                    const e = this._document, r = this._getWindow(), i = e.documentElement,
                        s = i.getBoundingClientRect();
                    return {
                        top: -s.top || e.body.scrollTop || r.scrollY || i.scrollTop || 0,
                        left: -s.left || e.body.scrollLeft || r.scrollX || i.scrollLeft || 0
                    }
                }

                change(e = 20) {
                    return e > 0 ? this._change.pipe(function KB(n, t = Ao) {
                        return function qB(n) {
                            return Ee((t, e) => {
                                let r = !1, i = null, s = null, o = !1;
                                const a = () => {
                                    if (s?.unsubscribe(), s = null, r) {
                                        r = !1;
                                        const c = i;
                                        i = null, e.next(c)
                                    }
                                    o && e.complete()
                                }, l = () => {
                                    s = null, o && e.complete()
                                };
                                t.subscribe(be(e, c => {
                                    r = !0, i = c, s || Dt(n(c)).subscribe(s = be(e, a, l))
                                }, () => {
                                    o = !0, (!r || !s || s.closed) && e.complete()
                                }))
                            })
                        }(() => Rf(n, t))
                    }(e)) : this._change
                }

                _getWindow() {
                    return this._document.defaultView || window
                }

                _updateViewportSize() {
                    const e = this._getWindow();
                    this._viewportSize = this._platform.isBrowser ? {
                        width: e.innerWidth,
                        height: e.innerHeight
                    } : {width: 0, height: 0}
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(kn), w(Z), w(_e, 8))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac, providedIn: "root"}), n
        })(), GC = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({}), n
        })(), ZB = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({imports: [Kl, GC, Kl, GC]}), n
        })();

        function YB(n, t) {
            1 & n && Ur(0)
        }

        const qC = ["*"];

        function JB(n, t) {
        }

        const XB = function (n) {
                return {animationDuration: n}
            }, eV = function (n, t) {
                return {value: n, params: t}
            }, tV = ["tabListContainer"], nV = ["tabList"], rV = ["tabListInner"], iV = ["nextPaginator"],
            sV = ["previousPaginator"], oV = ["tabBodyWrapper"], aV = ["tabHeader"];

        function lV(n, t) {
        }

        function cV(n, t) {
            1 & n && De(0, lV, 0, 0, "ng-template", 10), 2 & n && ke("cdkPortalOutlet", ze().$implicit.templateLabel)
        }

        function uV(n, t) {
            1 & n && it(0), 2 & n && Bd(ze().$implicit.textLabel)
        }

        function dV(n, t) {
            if (1 & n) {
                const e = Ui();
                Q(0, "div", 6), Xe("click", function () {
                    const i = or(e), s = i.$implicit, o = i.index, a = ze(), l = Fd(1);
                    return ar(a._handleClick(s, l, o))
                })("cdkFocusChange", function (i) {
                    const o = or(e).index;
                    return ar(ze()._tabFocusChanged(i, o))
                }), Q(1, "div", 7), De(2, cV, 1, 1, "ng-template", 8), De(3, uV, 1, 1, "ng-template", null, 9, Yv), te()()
            }
            if (2 & n) {
                const e = t.$implicit, r = t.index, i = Fd(4), s = ze();
                rt("mat-tab-label-active", s.selectedIndex === r), ke("id", s._getTabLabelId(r))("ngClass", e.labelClass)("disabled", e.disabled)("matRippleDisabled", e.disabled || s.disableRipple), ki("tabIndex", s._getTabIndex(e, r))("aria-posinset", r + 1)("aria-setsize", s._tabs.length)("aria-controls", s._getTabContentId(r))("aria-selected", s.selectedIndex === r)("aria-label", e.ariaLabel || null)("aria-labelledby", !e.ariaLabel && e.ariaLabelledby ? e.ariaLabelledby : null), he(2), ke("ngIf", e.templateLabel)("ngIfElse", i)
            }
        }

        function hV(n, t) {
            if (1 & n) {
                const e = Ui();
                Q(0, "mat-tab-body", 11), Xe("_onCentered", function () {
                    return or(e), ar(ze()._removeTabBodyWrapperHeight())
                })("_onCentering", function (i) {
                    return or(e), ar(ze()._setTabBodyWrapperHeight(i))
                }), te()
            }
            if (2 & n) {
                const e = t.$implicit, r = t.index, i = ze();
                rt("mat-tab-body-active", i.selectedIndex === r), ke("id", i._getTabContentId(r))("ngClass", e.bodyClass)("content", e.content)("position", e.position)("origin", e.origin)("animationDuration", i.animationDuration)("preserveContent", i.preserveContent), ki("tabindex", null != i.contentTabIndex && i.selectedIndex === r ? i.contentTabIndex : null)("aria-labelledby", i._getTabLabelId(r))
            }
        }

        const fV = new S("MatInkBarPositioner", {
            providedIn: "root", factory: function pV() {
                return t => ({left: t ? (t.offsetLeft || 0) + "px" : "0", width: t ? (t.offsetWidth || 0) + "px" : "0"})
            }
        });
        let KC = (() => {
            class n {
                constructor(e, r, i, s) {
                    this._elementRef = e, this._ngZone = r, this._inkBarPositioner = i, this._animationMode = s
                }

                alignToElement(e) {
                    this.show(), this._ngZone.run(() => {
                        this._ngZone.onStable.pipe(Rn(1)).subscribe(() => {
                            const r = this._inkBarPositioner(e), i = this._elementRef.nativeElement;
                            i.style.left = r.left, i.style.width = r.width
                        })
                    })
                }

                show() {
                    this._elementRef.nativeElement.style.visibility = "visible"
                }

                hide() {
                    this._elementRef.nativeElement.style.visibility = "hidden"
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(Z), m(fV), m(zn, 8))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["mat-ink-bar"]],
                hostAttrs: [1, "mat-ink-bar"],
                hostVars: 2,
                hostBindings: function (e, r) {
                    2 & e && rt("_mat-animation-noopable", "NoopAnimations" === r._animationMode)
                }
            }), n
        })();
        const gV = new S("MatTabContent"), mV = new S("MatTabLabel"), _V = new S("MAT_TAB"), yV = NC(class {
        }), QC = new S("MAT_TAB_GROUP");
        let ZC = (() => {
            class n extends yV {
                constructor(e, r) {
                    super(), this._viewContainerRef = e, this._closestTabGroup = r, this.textLabel = "", this._contentPortal = null, this._stateChanges = new ve, this.position = null, this.origin = null, this.isActive = !1
                }

                get templateLabel() {
                    return this._templateLabel
                }

                set templateLabel(e) {
                    this._setTemplateLabelInput(e)
                }

                get content() {
                    return this._contentPortal
                }

                ngOnChanges(e) {
                    (e.hasOwnProperty("textLabel") || e.hasOwnProperty("disabled")) && this._stateChanges.next()
                }

                ngOnDestroy() {
                    this._stateChanges.complete()
                }

                ngOnInit() {
                    this._contentPortal = new kC(this._explicitContent || this._implicitContent, this._viewContainerRef)
                }

                _setTemplateLabelInput(e) {
                    e && e._closestTab === this && (this._templateLabel = e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Ke), m(QC, 8))
            }, n.\u0275cmp = Ye({
                type: n,
                selectors: [["mat-tab"]],
                contentQueries: function (e, r, i) {
                    if (1 & e && (yt(i, mV, 5), yt(i, gV, 7, qe)), 2 & e) {
                        let s;
                        se(s = oe()) && (r.templateLabel = s.first), se(s = oe()) && (r._explicitContent = s.first)
                    }
                },
                viewQuery: function (e, r) {
                    if (1 & e && et(qe, 7), 2 & e) {
                        let i;
                        se(i = oe()) && (r._implicitContent = i.first)
                    }
                },
                inputs: {
                    disabled: "disabled",
                    textLabel: ["label", "textLabel"],
                    ariaLabel: ["aria-label", "ariaLabel"],
                    ariaLabelledby: ["aria-labelledby", "ariaLabelledby"],
                    labelClass: "labelClass",
                    bodyClass: "bodyClass"
                },
                exportAs: ["matTab"],
                features: [Ge([{provide: _V, useExisting: n}]), ee, Gt],
                ngContentSelectors: qC,
                decls: 1,
                vars: 0,
                template: function (e, r) {
                    1 & e && (Ys(), De(0, YB, 1, 0, "ng-template"))
                },
                encapsulation: 2
            }), n
        })();
        const vV = {
            translateTab: OB("translateTab", [Hf("center, void, left-origin-center, right-origin-center", Jr({transform: "none"})), Hf("left", Jr({
                transform: "translate3d(-100%, 0, 0)",
                minHeight: "1px",
                visibility: "hidden"
            })), Hf("right", Jr({
                transform: "translate3d(100%, 0, 0)",
                minHeight: "1px",
                visibility: "hidden"
            })), Uf("* => left, * => right, left => center, right => center", jf("{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)")), Uf("void => left-origin-center", [Jr({
                transform: "translate3d(-100%, 0, 0)",
                visibility: "hidden"
            }), jf("{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)")]), Uf("void => right-origin-center", [Jr({
                transform: "translate3d(100%, 0, 0)",
                visibility: "hidden"
            }), jf("{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)")])])
        };
        let bV = (() => {
            class n extends Bf {
                constructor(e, r, i, s) {
                    super(e, r, s), this._host = i, this._centeringSub = Ne.EMPTY, this._leavingSub = Ne.EMPTY
                }

                ngOnInit() {
                    super.ngOnInit(), this._centeringSub = this._host._beforeCentering.pipe(go(this._host._isCenterPosition(this._host._position))).subscribe(e => {
                        e && !this.hasAttached() && this.attach(this._host._content)
                    }), this._leavingSub = this._host._afterLeavingCenter.subscribe(() => {
                        this._host.preserveContent || this.detach()
                    })
                }

                ngOnDestroy() {
                    super.ngOnDestroy(), this._centeringSub.unsubscribe(), this._leavingSub.unsubscribe()
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Br), m(Ke), m(Ko(() => YC)), m(_e))
            }, n.\u0275dir = x({type: n, selectors: [["", "matTabBodyHost", ""]], features: [ee]}), n
        })(), DV = (() => {
            class n {
                constructor(e, r, i) {
                    this._elementRef = e, this._dir = r, this._dirChangeSubscription = Ne.EMPTY, this._translateTabComplete = new ve, this._onCentering = new ie, this._beforeCentering = new ie, this._afterLeavingCenter = new ie, this._onCentered = new ie(!0), this.animationDuration = "500ms", this.preserveContent = !1, r && (this._dirChangeSubscription = r.change.subscribe(s => {
                        this._computePositionAnimationState(s), i.markForCheck()
                    })), this._translateTabComplete.pipe(_C((s, o) => s.fromState === o.fromState && s.toState === o.toState)).subscribe(s => {
                        this._isCenterPosition(s.toState) && this._isCenterPosition(this._position) && this._onCentered.emit(), this._isCenterPosition(s.fromState) && !this._isCenterPosition(this._position) && this._afterLeavingCenter.emit()
                    })
                }

                set position(e) {
                    this._positionIndex = e, this._computePositionAnimationState()
                }

                ngOnInit() {
                    "center" == this._position && null != this.origin && (this._position = this._computePositionFromOrigin(this.origin))
                }

                ngOnDestroy() {
                    this._dirChangeSubscription.unsubscribe(), this._translateTabComplete.complete()
                }

                _onTranslateTabStarted(e) {
                    const r = this._isCenterPosition(e.toState);
                    this._beforeCentering.emit(r), r && this._onCentering.emit(this._elementRef.nativeElement.clientHeight)
                }

                _getLayoutDirection() {
                    return this._dir && "rtl" === this._dir.value ? "rtl" : "ltr"
                }

                _isCenterPosition(e) {
                    return "center" == e || "left-origin-center" == e || "right-origin-center" == e
                }

                _computePositionAnimationState(e = this._getLayoutDirection()) {
                    this._position = this._positionIndex < 0 ? "ltr" == e ? "left" : "right" : this._positionIndex > 0 ? "ltr" == e ? "right" : "left" : "center"
                }

                _computePositionFromOrigin(e) {
                    const r = this._getLayoutDirection();
                    return "ltr" == r && e <= 0 || "rtl" == r && e > 0 ? "left-origin-center" : "right-origin-center"
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(cs, 8), m(mn))
            }, n.\u0275dir = x({
                type: n,
                inputs: {
                    _content: ["content", "_content"],
                    origin: "origin",
                    animationDuration: "animationDuration",
                    preserveContent: "preserveContent",
                    position: "position"
                },
                outputs: {
                    _onCentering: "_onCentering",
                    _beforeCentering: "_beforeCentering",
                    _afterLeavingCenter: "_afterLeavingCenter",
                    _onCentered: "_onCentered"
                }
            }), n
        })(), YC = (() => {
            class n extends DV {
                constructor(e, r, i) {
                    super(e, r, i)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(cs, 8), m(mn))
            }, n.\u0275cmp = Ye({
                type: n,
                selectors: [["mat-tab-body"]],
                viewQuery: function (e, r) {
                    if (1 & e && et(Bf, 5), 2 & e) {
                        let i;
                        se(i = oe()) && (r._portalHost = i.first)
                    }
                },
                hostAttrs: [1, "mat-tab-body"],
                features: [ee],
                decls: 3,
                vars: 6,
                consts: [["cdkScrollable", "", 1, "mat-tab-body-content"], ["content", ""], ["matTabBodyHost", ""]],
                template: function (e, r) {
                    1 & e && (Q(0, "div", 0, 1), Xe("@translateTab.start", function (s) {
                        return r._onTranslateTabStarted(s)
                    })("@translateTab.done", function (s) {
                        return r._translateTabComplete.next(s)
                    }), De(2, JB, 0, 0, "ng-template", 2), te()), 2 & e && ke("@translateTab", Lv(3, eV, r._position, Ov(1, XB, r.animationDuration)))
                },
                dependencies: [bV],
                styles: ['.mat-tab-body-content{height:100%;overflow:auto}.mat-tab-group-dynamic-height .mat-tab-body-content{overflow:hidden}.mat-tab-body-content[style*="visibility: hidden"]{display:none}'],
                encapsulation: 2,
                data: {animation: [vV.translateTab]}
            }), n
        })();
        const JC = new S("MAT_TABS_CONFIG"), wV = NC(class {
        });
        let XC = (() => {
            class n extends wV {
                constructor(e) {
                    super(), this.elementRef = e
                }

                focus() {
                    this.elementRef.nativeElement.focus()
                }

                getOffsetLeft() {
                    return this.elementRef.nativeElement.offsetLeft
                }

                getOffsetWidth() {
                    return this.elementRef.nativeElement.offsetWidth
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "matTabLabelWrapper", ""]],
                hostVars: 3,
                hostBindings: function (e, r) {
                    2 & e && (ki("aria-disabled", !!r.disabled), rt("mat-tab-disabled", r.disabled))
                },
                inputs: {disabled: "disabled"},
                features: [ee]
            }), n
        })();
        const eE = zl({passive: !0});
        let MV = (() => {
            class n {
                constructor(e, r, i, s, o, a, l) {
                    this._elementRef = e, this._changeDetectorRef = r, this._viewportRuler = i, this._dir = s, this._ngZone = o, this._platform = a, this._animationMode = l, this._scrollDistance = 0, this._selectedIndexChanged = !1, this._destroyed = new ve, this._showPaginationControls = !1, this._disableScrollAfter = !0, this._disableScrollBefore = !0, this._stopScrolling = new ve, this._disablePagination = !1, this._selectedIndex = 0, this.selectFocusedIndex = new ie, this.indexFocused = new ie, o.runOutsideAngular(() => {
                        Po(e.nativeElement, "mouseleave").pipe(Lt(this._destroyed)).subscribe(() => {
                            this._stopInterval()
                        })
                    })
                }

                get disablePagination() {
                    return this._disablePagination
                }

                set disablePagination(e) {
                    this._disablePagination = tn(e)
                }

                get selectedIndex() {
                    return this._selectedIndex
                }

                set selectedIndex(e) {
                    e = Gl(e), this._selectedIndex != e && (this._selectedIndexChanged = !0, this._selectedIndex = e, this._keyManager && this._keyManager.updateActiveItem(e))
                }

                ngAfterViewInit() {
                    Po(this._previousPaginator.nativeElement, "touchstart", eE).pipe(Lt(this._destroyed)).subscribe(() => {
                        this._handlePaginatorPress("before")
                    }), Po(this._nextPaginator.nativeElement, "touchstart", eE).pipe(Lt(this._destroyed)).subscribe(() => {
                        this._handlePaginatorPress("after")
                    })
                }

                ngAfterContentInit() {
                    const e = this._dir ? this._dir.change : R("ltr"), r = this._viewportRuler.change(150), i = () => {
                        this.updatePagination(), this._alignInkBarToSelectedTab()
                    };
                    this._keyManager = new ZL(this._items).withHorizontalOrientation(this._getLayoutDirection()).withHomeAndEnd().withWrap(), this._keyManager.updateActiveItem(this._selectedIndex), this._ngZone.onStable.pipe(Rn(1)).subscribe(i), qo(e, r, this._items.changes, this._itemsResized()).pipe(Lt(this._destroyed)).subscribe(() => {
                        this._ngZone.run(() => {
                            Promise.resolve().then(() => {
                                this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), this._scrollDistance)), i()
                            })
                        }), this._keyManager.withHorizontalOrientation(this._getLayoutDirection())
                    }), this._keyManager.change.pipe(Lt(this._destroyed)).subscribe(s => {
                        this.indexFocused.emit(s), this._setTabFocus(s)
                    })
                }

                _itemsResized() {
                    return "function" != typeof ResizeObserver ? wt : this._items.changes.pipe(go(this._items), Xt(e => new fe(r => this._ngZone.runOutsideAngular(() => {
                        const i = new ResizeObserver(() => {
                            r.next()
                        });
                        return e.forEach(s => {
                            i.observe(s.elementRef.nativeElement)
                        }), () => {
                            i.disconnect()
                        }
                    }))), Nf(1))
                }

                ngAfterContentChecked() {
                    this._tabLabelCount != this._items.length && (this.updatePagination(), this._tabLabelCount = this._items.length, this._changeDetectorRef.markForCheck()), this._selectedIndexChanged && (this._scrollToLabel(this._selectedIndex), this._checkScrollingControls(), this._alignInkBarToSelectedTab(), this._selectedIndexChanged = !1, this._changeDetectorRef.markForCheck()), this._scrollDistanceChanged && (this._updateTabScrollPosition(), this._scrollDistanceChanged = !1, this._changeDetectorRef.markForCheck())
                }

                ngOnDestroy() {
                    this._destroyed.next(), this._destroyed.complete(), this._stopScrolling.complete()
                }

                _handleKeydown(e) {
                    if (!mC(e)) switch (e.keyCode) {
                        case 13:
                        case 32:
                            this.focusIndex !== this.selectedIndex && (this.selectFocusedIndex.emit(this.focusIndex), this._itemSelected(e));
                            break;
                        default:
                            this._keyManager.onKeydown(e)
                    }
                }

                _onContentChanges() {
                    const e = this._elementRef.nativeElement.textContent;
                    e !== this._currentTextContent && (this._currentTextContent = e || "", this._ngZone.run(() => {
                        this.updatePagination(), this._alignInkBarToSelectedTab(), this._changeDetectorRef.markForCheck()
                    }))
                }

                updatePagination() {
                    this._checkPaginationEnabled(), this._checkScrollingControls(), this._updateTabScrollPosition()
                }

                get focusIndex() {
                    return this._keyManager ? this._keyManager.activeItemIndex : 0
                }

                set focusIndex(e) {
                    !this._isValidIndex(e) || this.focusIndex === e || !this._keyManager || this._keyManager.setActiveItem(e)
                }

                _isValidIndex(e) {
                    if (!this._items) return !0;
                    const r = this._items ? this._items.toArray()[e] : null;
                    return !!r && !r.disabled
                }

                _setTabFocus(e) {
                    if (this._showPaginationControls && this._scrollToLabel(e), this._items && this._items.length) {
                        this._items.toArray()[e].focus();
                        const r = this._tabListContainer.nativeElement;
                        r.scrollLeft = "ltr" == this._getLayoutDirection() ? 0 : r.scrollWidth - r.offsetWidth
                    }
                }

                _getLayoutDirection() {
                    return this._dir && "rtl" === this._dir.value ? "rtl" : "ltr"
                }

                _updateTabScrollPosition() {
                    if (this.disablePagination) return;
                    const e = this.scrollDistance, r = "ltr" === this._getLayoutDirection() ? -e : e;
                    this._tabList.nativeElement.style.transform = `translateX(${Math.round(r)}px)`, (this._platform.TRIDENT || this._platform.EDGE) && (this._tabListContainer.nativeElement.scrollLeft = 0)
                }

                get scrollDistance() {
                    return this._scrollDistance
                }

                set scrollDistance(e) {
                    this._scrollTo(e)
                }

                _scrollHeader(e) {
                    return this._scrollTo(this._scrollDistance + ("before" == e ? -1 : 1) * this._tabListContainer.nativeElement.offsetWidth / 3)
                }

                _handlePaginatorClick(e) {
                    this._stopInterval(), this._scrollHeader(e)
                }

                _scrollToLabel(e) {
                    if (this.disablePagination) return;
                    const r = this._items ? this._items.toArray()[e] : null;
                    if (!r) return;
                    const i = this._tabListContainer.nativeElement.offsetWidth, {
                        offsetLeft: s,
                        offsetWidth: o
                    } = r.elementRef.nativeElement;
                    let a, l;
                    "ltr" == this._getLayoutDirection() ? (a = s, l = a + o) : (l = this._tabListInner.nativeElement.offsetWidth - s, a = l - o);
                    const c = this.scrollDistance, u = this.scrollDistance + i;
                    a < c ? this.scrollDistance -= c - a + 60 : l > u && (this.scrollDistance += l - u + 60)
                }

                _checkPaginationEnabled() {
                    if (this.disablePagination) this._showPaginationControls = !1; else {
                        const e = this._tabListInner.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
                        e || (this.scrollDistance = 0), e !== this._showPaginationControls && this._changeDetectorRef.markForCheck(), this._showPaginationControls = e
                    }
                }

                _checkScrollingControls() {
                    this.disablePagination ? this._disableScrollAfter = this._disableScrollBefore = !0 : (this._disableScrollBefore = 0 == this.scrollDistance, this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance(), this._changeDetectorRef.markForCheck())
                }

                _getMaxScrollDistance() {
                    return this._tabListInner.nativeElement.scrollWidth - this._tabListContainer.nativeElement.offsetWidth || 0
                }

                _alignInkBarToSelectedTab() {
                    const e = this._items && this._items.length ? this._items.toArray()[this.selectedIndex] : null,
                        r = e ? e.elementRef.nativeElement : null;
                    r ? this._inkBar.alignToElement(r) : this._inkBar.hide()
                }

                _stopInterval() {
                    this._stopScrolling.next()
                }

                _handlePaginatorPress(e, r) {
                    r && null != r.button && 0 !== r.button || (this._stopInterval(), Rf(650, 100).pipe(Lt(qo(this._stopScrolling, this._destroyed))).subscribe(() => {
                        const {maxScrollDistance: i, distance: s} = this._scrollHeader(e);
                        (0 === s || s >= i) && this._stopInterval()
                    }))
                }

                _scrollTo(e) {
                    if (this.disablePagination) return {maxScrollDistance: 0, distance: 0};
                    const r = this._getMaxScrollDistance();
                    return this._scrollDistance = Math.max(0, Math.min(r, e)), this._scrollDistanceChanged = !0, this._checkScrollingControls(), {
                        maxScrollDistance: r,
                        distance: this._scrollDistance
                    }
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(mn), m(Yl), m(cs, 8), m(Z), m(kn), m(zn, 8))
            }, n.\u0275dir = x({type: n, inputs: {disablePagination: "disablePagination"}}), n
        })(), SV = (() => {
            class n extends MV {
                constructor(e, r, i, s, o, a, l) {
                    super(e, r, i, s, o, a, l), this._disableRipple = !1
                }

                get disableRipple() {
                    return this._disableRipple
                }

                set disableRipple(e) {
                    this._disableRipple = tn(e)
                }

                _itemSelected(e) {
                    e.preventDefault()
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(mn), m(Yl), m(cs, 8), m(Z), m(kn), m(zn, 8))
            }, n.\u0275dir = x({type: n, inputs: {disableRipple: "disableRipple"}, features: [ee]}), n
        })(), TV = (() => {
            class n extends SV {
                constructor(e, r, i, s, o, a, l) {
                    super(e, r, i, s, o, a, l)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(mn), m(Yl), m(cs, 8), m(Z), m(kn), m(zn, 8))
            }, n.\u0275cmp = Ye({
                type: n,
                selectors: [["mat-tab-header"]],
                contentQueries: function (e, r, i) {
                    if (1 & e && yt(i, XC, 4), 2 & e) {
                        let s;
                        se(s = oe()) && (r._items = s)
                    }
                },
                viewQuery: function (e, r) {
                    if (1 & e && (et(KC, 7), et(tV, 7), et(nV, 7), et(rV, 7), et(iV, 5), et(sV, 5)), 2 & e) {
                        let i;
                        se(i = oe()) && (r._inkBar = i.first), se(i = oe()) && (r._tabListContainer = i.first), se(i = oe()) && (r._tabList = i.first), se(i = oe()) && (r._tabListInner = i.first), se(i = oe()) && (r._nextPaginator = i.first), se(i = oe()) && (r._previousPaginator = i.first)
                    }
                },
                hostAttrs: [1, "mat-tab-header"],
                hostVars: 4,
                hostBindings: function (e, r) {
                    2 & e && rt("mat-tab-header-pagination-controls-enabled", r._showPaginationControls)("mat-tab-header-rtl", "rtl" == r._getLayoutDirection())
                },
                inputs: {selectedIndex: "selectedIndex"},
                outputs: {selectFocusedIndex: "selectFocusedIndex", indexFocused: "indexFocused"},
                features: [ee],
                ngContentSelectors: qC,
                decls: 14,
                vars: 10,
                consts: [["aria-hidden", "true", "type", "button", "mat-ripple", "", "tabindex", "-1", 1, "mat-tab-header-pagination", "mat-tab-header-pagination-before", "mat-elevation-z4", 3, "matRippleDisabled", "disabled", "click", "mousedown", "touchend"], ["previousPaginator", ""], [1, "mat-tab-header-pagination-chevron"], [1, "mat-tab-label-container", 3, "keydown"], ["tabListContainer", ""], ["role", "tablist", 1, "mat-tab-list", 3, "cdkObserveContent"], ["tabList", ""], [1, "mat-tab-labels"], ["tabListInner", ""], ["aria-hidden", "true", "type", "button", "mat-ripple", "", "tabindex", "-1", 1, "mat-tab-header-pagination", "mat-tab-header-pagination-after", "mat-elevation-z4", 3, "matRippleDisabled", "disabled", "mousedown", "click", "touchend"], ["nextPaginator", ""]],
                template: function (e, r) {
                    1 & e && (Ys(), Q(0, "button", 0, 1), Xe("click", function () {
                        return r._handlePaginatorClick("before")
                    })("mousedown", function (s) {
                        return r._handlePaginatorPress("before", s)
                    })("touchend", function () {
                        return r._stopInterval()
                    }), pr(2, "div", 2), te(), Q(3, "div", 3, 4), Xe("keydown", function (s) {
                        return r._handleKeydown(s)
                    }), Q(5, "div", 5, 6), Xe("cdkObserveContent", function () {
                        return r._onContentChanges()
                    }), Q(7, "div", 7, 8), Ur(9), te(), pr(10, "mat-ink-bar"), te()(), Q(11, "button", 9, 10), Xe("mousedown", function (s) {
                        return r._handlePaginatorPress("after", s)
                    })("click", function () {
                        return r._handlePaginatorClick("after")
                    })("touchend", function () {
                        return r._stopInterval()
                    }), pr(13, "div", 2), te()), 2 & e && (rt("mat-tab-header-pagination-disabled", r._disableScrollBefore), ke("matRippleDisabled", r._disableScrollBefore || r.disableRipple)("disabled", r._disableScrollBefore || null), he(5), rt("_mat-animation-noopable", "NoopAnimations" === r._animationMode), he(6), rt("mat-tab-header-pagination-disabled", r._disableScrollAfter), ke("matRippleDisabled", r._disableScrollAfter || r.disableRipple)("disabled", r._disableScrollAfter || null))
                },
                dependencies: [VC, UL, KC],
                styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-tab-header-pagination::-moz-focus-inner{border:0}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-ink-bar._mat-animation-noopable{transition:none !important;animation:none !important}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .mat-ink-bar{outline:solid 2px;height:0}.mat-tab-labels{display:flex}[mat-align-tabs=center]>.mat-tab-header .mat-tab-labels{justify-content:center}[mat-align-tabs=end]>.mat-tab-header .mat-tab-labels{justify-content:flex-end}.mat-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-list._mat-animation-noopable{transition:none !important;animation:none !important}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}.mat-tab-label.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-label.mat-tab-disabled{opacity:.5}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-label{opacity:1}.mat-tab-label::before{margin:5px}@media(max-width: 599px){.mat-tab-label{min-width:72px}}"],
                encapsulation: 2
            }), n
        })(), IV = 0;

        class AV {
        }

        const RV = bB(DB(class {
            constructor(n) {
                this._elementRef = n
            }
        }), "primary");
        let xV = (() => {
            class n extends RV {
                constructor(e, r, i, s) {
                    super(e), this._changeDetectorRef = r, this._animationMode = s, this._tabs = new Ki, this._indexToSelect = 0, this._lastFocusedTabIndex = null, this._tabBodyWrapperHeight = 0, this._tabsSubscription = Ne.EMPTY, this._tabLabelSubscription = Ne.EMPTY, this._dynamicHeight = !1, this._selectedIndex = null, this.headerPosition = "above", this._disablePagination = !1, this._preserveContent = !1, this.selectedIndexChange = new ie, this.focusChange = new ie, this.animationDone = new ie, this.selectedTabChange = new ie(!0), this._groupId = IV++, this.animationDuration = i && i.animationDuration ? i.animationDuration : "500ms", this.disablePagination = !(!i || null == i.disablePagination) && i.disablePagination, this.dynamicHeight = !(!i || null == i.dynamicHeight) && i.dynamicHeight, this.contentTabIndex = i?.contentTabIndex ?? null, this.preserveContent = !!i?.preserveContent
                }

                get dynamicHeight() {
                    return this._dynamicHeight
                }

                set dynamicHeight(e) {
                    this._dynamicHeight = tn(e)
                }

                get selectedIndex() {
                    return this._selectedIndex
                }

                set selectedIndex(e) {
                    this._indexToSelect = Gl(e, null)
                }

                get animationDuration() {
                    return this._animationDuration
                }

                set animationDuration(e) {
                    this._animationDuration = /^\d+$/.test(e + "") ? e + "ms" : e
                }

                get contentTabIndex() {
                    return this._contentTabIndex
                }

                set contentTabIndex(e) {
                    this._contentTabIndex = Gl(e, null)
                }

                get disablePagination() {
                    return this._disablePagination
                }

                set disablePagination(e) {
                    this._disablePagination = tn(e)
                }

                get preserveContent() {
                    return this._preserveContent
                }

                set preserveContent(e) {
                    this._preserveContent = tn(e)
                }

                get backgroundColor() {
                    return this._backgroundColor
                }

                set backgroundColor(e) {
                    const r = this._elementRef.nativeElement;
                    r.classList.remove(`mat-background-${this.backgroundColor}`), e && r.classList.add(`mat-background-${e}`), this._backgroundColor = e
                }

                ngAfterContentChecked() {
                    const e = this._indexToSelect = this._clampTabIndex(this._indexToSelect);
                    if (this._selectedIndex != e) {
                        const r = null == this._selectedIndex;
                        if (!r) {
                            this.selectedTabChange.emit(this._createChangeEvent(e));
                            const i = this._tabBodyWrapper.nativeElement;
                            i.style.minHeight = i.clientHeight + "px"
                        }
                        Promise.resolve().then(() => {
                            this._tabs.forEach((i, s) => i.isActive = s === e), r || (this.selectedIndexChange.emit(e), this._tabBodyWrapper.nativeElement.style.minHeight = "")
                        })
                    }
                    this._tabs.forEach((r, i) => {
                        r.position = i - e, null != this._selectedIndex && 0 == r.position && !r.origin && (r.origin = e - this._selectedIndex)
                    }), this._selectedIndex !== e && (this._selectedIndex = e, this._lastFocusedTabIndex = null, this._changeDetectorRef.markForCheck())
                }

                ngAfterContentInit() {
                    this._subscribeToAllTabChanges(), this._subscribeToTabLabels(), this._tabsSubscription = this._tabs.changes.subscribe(() => {
                        const e = this._clampTabIndex(this._indexToSelect);
                        if (e === this._selectedIndex) {
                            const r = this._tabs.toArray();
                            let i;
                            for (let s = 0; s < r.length; s++) if (r[s].isActive) {
                                this._indexToSelect = this._selectedIndex = s, this._lastFocusedTabIndex = null, i = r[s];
                                break
                            }
                            !i && r[e] && Promise.resolve().then(() => {
                                r[e].isActive = !0, this.selectedTabChange.emit(this._createChangeEvent(e))
                            })
                        }
                        this._changeDetectorRef.markForCheck()
                    })
                }

                _subscribeToAllTabChanges() {
                    this._allTabs.changes.pipe(go(this._allTabs)).subscribe(e => {
                        this._tabs.reset(e.filter(r => r._closestTabGroup === this || !r._closestTabGroup)), this._tabs.notifyOnChanges()
                    })
                }

                ngOnDestroy() {
                    this._tabs.destroy(), this._tabsSubscription.unsubscribe(), this._tabLabelSubscription.unsubscribe()
                }

                realignInkBar() {
                    this._tabHeader && this._tabHeader._alignInkBarToSelectedTab()
                }

                updatePagination() {
                    this._tabHeader && this._tabHeader.updatePagination()
                }

                focusTab(e) {
                    const r = this._tabHeader;
                    r && (r.focusIndex = e)
                }

                _focusChanged(e) {
                    this._lastFocusedTabIndex = e, this.focusChange.emit(this._createChangeEvent(e))
                }

                _createChangeEvent(e) {
                    const r = new AV;
                    return r.index = e, this._tabs && this._tabs.length && (r.tab = this._tabs.toArray()[e]), r
                }

                _subscribeToTabLabels() {
                    this._tabLabelSubscription && this._tabLabelSubscription.unsubscribe(), this._tabLabelSubscription = qo(...this._tabs.map(e => e._stateChanges)).subscribe(() => this._changeDetectorRef.markForCheck())
                }

                _clampTabIndex(e) {
                    return Math.min(this._tabs.length - 1, Math.max(e || 0, 0))
                }

                _getTabLabelId(e) {
                    return `mat-tab-label-${this._groupId}-${e}`
                }

                _getTabContentId(e) {
                    return `mat-tab-content-${this._groupId}-${e}`
                }

                _setTabBodyWrapperHeight(e) {
                    if (!this._dynamicHeight || !this._tabBodyWrapperHeight) return;
                    const r = this._tabBodyWrapper.nativeElement;
                    r.style.height = this._tabBodyWrapperHeight + "px", this._tabBodyWrapper.nativeElement.offsetHeight && (r.style.height = e + "px")
                }

                _removeTabBodyWrapperHeight() {
                    const e = this._tabBodyWrapper.nativeElement;
                    this._tabBodyWrapperHeight = e.clientHeight, e.style.height = "", this.animationDone.emit()
                }

                _handleClick(e, r, i) {
                    e.disabled || (this.selectedIndex = r.focusIndex = i)
                }

                _getTabIndex(e, r) {
                    return e.disabled ? null : r === (this._lastFocusedTabIndex ?? this.selectedIndex) ? 0 : -1
                }

                _tabFocusChanged(e, r) {
                    e && "mouse" !== e && "touch" !== e && (this._tabHeader.focusIndex = r)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(mn), m(JC, 8), m(zn, 8))
            }, n.\u0275dir = x({
                type: n,
                inputs: {
                    dynamicHeight: "dynamicHeight",
                    selectedIndex: "selectedIndex",
                    headerPosition: "headerPosition",
                    animationDuration: "animationDuration",
                    contentTabIndex: "contentTabIndex",
                    disablePagination: "disablePagination",
                    preserveContent: "preserveContent",
                    backgroundColor: "backgroundColor"
                },
                outputs: {
                    selectedIndexChange: "selectedIndexChange",
                    focusChange: "focusChange",
                    animationDone: "animationDone",
                    selectedTabChange: "selectedTabChange"
                },
                features: [ee]
            }), n
        })(), kV = (() => {
            class n extends xV {
                constructor(e, r, i, s) {
                    super(e, r, i, s)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(re), m(mn), m(JC, 8), m(zn, 8))
            }, n.\u0275cmp = Ye({
                type: n,
                selectors: [["mat-tab-group"]],
                contentQueries: function (e, r, i) {
                    if (1 & e && yt(i, ZC, 5), 2 & e) {
                        let s;
                        se(s = oe()) && (r._allTabs = s)
                    }
                },
                viewQuery: function (e, r) {
                    if (1 & e && (et(oV, 5), et(aV, 5)), 2 & e) {
                        let i;
                        se(i = oe()) && (r._tabBodyWrapper = i.first), se(i = oe()) && (r._tabHeader = i.first)
                    }
                },
                hostAttrs: [1, "mat-tab-group"],
                hostVars: 4,
                hostBindings: function (e, r) {
                    2 & e && rt("mat-tab-group-dynamic-height", r.dynamicHeight)("mat-tab-group-inverted-header", "below" === r.headerPosition)
                },
                inputs: {color: "color", disableRipple: "disableRipple"},
                exportAs: ["matTabGroup"],
                features: [Ge([{provide: QC, useExisting: n}]), ee],
                decls: 6,
                vars: 7,
                consts: [[3, "selectedIndex", "disableRipple", "disablePagination", "indexFocused", "selectFocusedIndex"], ["tabHeader", ""], ["class", "mat-tab-label mat-focus-indicator", "role", "tab", "matTabLabelWrapper", "", "mat-ripple", "", "cdkMonitorElementFocus", "", 3, "id", "mat-tab-label-active", "ngClass", "disabled", "matRippleDisabled", "click", "cdkFocusChange", 4, "ngFor", "ngForOf"], [1, "mat-tab-body-wrapper"], ["tabBodyWrapper", ""], ["role", "tabpanel", 3, "id", "mat-tab-body-active", "ngClass", "content", "position", "origin", "animationDuration", "preserveContent", "_onCentered", "_onCentering", 4, "ngFor", "ngForOf"], ["role", "tab", "matTabLabelWrapper", "", "mat-ripple", "", "cdkMonitorElementFocus", "", 1, "mat-tab-label", "mat-focus-indicator", 3, "id", "ngClass", "disabled", "matRippleDisabled", "click", "cdkFocusChange"], [1, "mat-tab-label-content"], [3, "ngIf", "ngIfElse"], ["tabTextLabel", ""], [3, "cdkPortalOutlet"], ["role", "tabpanel", 3, "id", "ngClass", "content", "position", "origin", "animationDuration", "preserveContent", "_onCentered", "_onCentering"]],
                template: function (e, r) {
                    1 & e && (Q(0, "mat-tab-header", 0, 1), Xe("indexFocused", function (s) {
                        return r._focusChanged(s)
                    })("selectFocusedIndex", function (s) {
                        return r.selectedIndex = s
                    }), De(2, dV, 5, 15, "div", 2), te(), Q(3, "div", 3, 4), De(5, hV, 1, 11, "mat-tab-body", 5), te()), 2 & e && (ke("selectedIndex", r.selectedIndex || 0)("disableRipple", r.disableRipple)("disablePagination", r.disablePagination), he(2), ke("ngForOf", r._tabs), he(1), rt("_mat-animation-noopable", "NoopAnimations" === r._animationMode), he(2), ke("ngForOf", r._tabs))
                },
                dependencies: [oD, Rh, xh, Bf, VC, lB, XC, YC, TV],
                styles: [".mat-tab-group{display:flex;flex-direction:column;max-width:100%}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}.mat-tab-label.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-label.mat-tab-disabled{opacity:.5}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-label{opacity:1}@media(max-width: 599px){.mat-tab-label{padding:0 12px}}@media(max-width: 959px){.mat-tab-label{padding:0 12px}}.mat-tab-group[mat-stretch-tabs]>.mat-tab-header .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-tab-body-wrapper._mat-animation-noopable{transition:none !important;animation:none !important}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;outline:0;flex-basis:100%}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}"],
                encapsulation: 2
            }), n
        })(), PV = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({imports: [fD, us, fB, IB, bC, cB, us]}), n
        })();

        function Wf(n) {
            return n && "function" == typeof n.connect
        }

        class nE {
            applyChanges(t, e, r, i, s) {
                t.forEachOperation((o, a, l) => {
                    let c, u;
                    if (null == o.previousIndex) {
                        const d = r(o, a, l);
                        c = e.createEmbeddedView(d.templateRef, d.context, d.index), u = 1
                    } else null == l ? (e.remove(a), u = 3) : (c = e.get(a), e.move(c, l), u = 2);
                    s && s({context: c?.context, operation: u, record: o})
                })
            }

            detach() {
            }
        }

        const Oo = new S("_ViewRepeater"), NV = [[["caption"]], [["colgroup"], ["col"]]],
            OV = ["caption", "colgroup, col"];

        function Gf(n) {
            return class extends n {
                constructor(...t) {
                    super(...t), this._sticky = !1, this._hasStickyChanged = !1
                }

                get sticky() {
                    return this._sticky
                }

                set sticky(t) {
                    const e = this._sticky;
                    this._sticky = tn(t), this._hasStickyChanged = e !== this._sticky
                }

                hasStickyChanged() {
                    const t = this._hasStickyChanged;
                    return this._hasStickyChanged = !1, t
                }

                resetStickyChanged() {
                    this._hasStickyChanged = !1
                }
            }
        }

        const ds = new S("CDK_TABLE");
        let hs = (() => {
            class n {
                constructor(e) {
                    this.template = e
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(qe))
            }, n.\u0275dir = x({type: n, selectors: [["", "cdkCellDef", ""]]}), n
        })(), fs = (() => {
            class n {
                constructor(e) {
                    this.template = e
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(qe))
            }, n.\u0275dir = x({type: n, selectors: [["", "cdkHeaderCellDef", ""]]}), n
        })(), Jl = (() => {
            class n {
                constructor(e) {
                    this.template = e
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(qe))
            }, n.\u0275dir = x({type: n, selectors: [["", "cdkFooterCellDef", ""]]}), n
        })();

        class jV {
        }

        const HV = Gf(jV);
        let er = (() => {
            class n extends HV {
                constructor(e) {
                    super(), this._table = e, this._stickyEnd = !1
                }

                get name() {
                    return this._name
                }

                set name(e) {
                    this._setNameInput(e)
                }

                get stickyEnd() {
                    return this._stickyEnd
                }

                set stickyEnd(e) {
                    const r = this._stickyEnd;
                    this._stickyEnd = tn(e), this._hasStickyChanged = r !== this._stickyEnd
                }

                _updateColumnCssClassName() {
                    this._columnCssClassName = [`cdk-column-${this.cssClassFriendlyName}`]
                }

                _setNameInput(e) {
                    e && (this._name = e, this.cssClassFriendlyName = e.replace(/[^a-z0-9_-]/gi, "-"), this._updateColumnCssClassName())
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(ds, 8))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "cdkColumnDef", ""]],
                contentQueries: function (e, r, i) {
                    if (1 & e && (yt(i, hs, 5), yt(i, fs, 5), yt(i, Jl, 5)), 2 & e) {
                        let s;
                        se(s = oe()) && (r.cell = s.first), se(s = oe()) && (r.headerCell = s.first), se(s = oe()) && (r.footerCell = s.first)
                    }
                },
                inputs: {sticky: "sticky", name: ["cdkColumnDef", "name"], stickyEnd: "stickyEnd"},
                features: [Ge([{provide: "MAT_SORT_HEADER_COLUMN_DEF", useExisting: n}]), ee]
            }), n
        })();

        class qf {
            constructor(t, e) {
                e.nativeElement.classList.add(...t._columnCssClassName)
            }
        }

        let Kf = (() => {
            class n extends qf {
                constructor(e, r) {
                    super(e, r)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(er), m(re))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["cdk-header-cell"], ["th", "cdk-header-cell", ""]],
                hostAttrs: ["role", "columnheader", 1, "cdk-header-cell"],
                features: [ee]
            }), n
        })(), Qf = (() => {
            class n extends qf {
                constructor(e, r) {
                    if (super(e, r), 1 === e._table?._elementRef.nativeElement.nodeType) {
                        const i = e._table._elementRef.nativeElement.getAttribute("role");
                        r.nativeElement.setAttribute("role", "grid" === i || "treegrid" === i ? "gridcell" : "cell")
                    }
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(er), m(re))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["cdk-cell"], ["td", "cdk-cell", ""]],
                hostAttrs: [1, "cdk-cell"],
                features: [ee]
            }), n
        })();

        class sE {
            constructor() {
                this.tasks = [], this.endTasks = []
            }
        }

        const Zf = new S("_COALESCED_STYLE_SCHEDULER");
        let oE = (() => {
            class n {
                constructor(e) {
                    this._ngZone = e, this._currentSchedule = null, this._destroyed = new ve
                }

                schedule(e) {
                    this._createScheduleIfNeeded(), this._currentSchedule.tasks.push(e)
                }

                scheduleEnd(e) {
                    this._createScheduleIfNeeded(), this._currentSchedule.endTasks.push(e)
                }

                ngOnDestroy() {
                    this._destroyed.next(), this._destroyed.complete()
                }

                _createScheduleIfNeeded() {
                    this._currentSchedule || (this._currentSchedule = new sE, this._getScheduleObservable().pipe(Lt(this._destroyed)).subscribe(() => {
                        for (; this._currentSchedule.tasks.length || this._currentSchedule.endTasks.length;) {
                            const e = this._currentSchedule;
                            this._currentSchedule = new sE;
                            for (const r of e.tasks) r();
                            for (const r of e.endTasks) r()
                        }
                        this._currentSchedule = null
                    }))
                }

                _getScheduleObservable() {
                    return this._ngZone.isStable ? Oe(Promise.resolve(void 0)) : this._ngZone.onStable.pipe(Rn(1))
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Z))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })(), Yf = (() => {
            class n {
                constructor(e, r) {
                    this.template = e, this._differs = r
                }

                ngOnChanges(e) {
                    if (!this._columnsDiffer) {
                        const r = e.columns && e.columns.currentValue || [];
                        this._columnsDiffer = this._differs.find(r).create(), this._columnsDiffer.diff(r)
                    }
                }

                getColumnsDiff() {
                    return this._columnsDiffer.diff(this.columns)
                }

                extractCellTemplate(e) {
                    return this instanceof Lo ? e.headerCell.template : this instanceof Bo ? e.footerCell.template : e.cell.template
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(qe), m(Gn))
            }, n.\u0275dir = x({type: n, features: [Gt]}), n
        })();

        class UV extends Yf {
        }

        const $V = Gf(UV);
        let Lo = (() => {
            class n extends $V {
                constructor(e, r, i) {
                    super(e, r), this._table = i
                }

                ngOnChanges(e) {
                    super.ngOnChanges(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(qe), m(Gn), m(ds, 8))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "cdkHeaderRowDef", ""]],
                inputs: {columns: ["cdkHeaderRowDef", "columns"], sticky: ["cdkHeaderRowDefSticky", "sticky"]},
                features: [ee, Gt]
            }), n
        })();

        class zV extends Yf {
        }

        const WV = Gf(zV);
        let Bo = (() => {
            class n extends WV {
                constructor(e, r, i) {
                    super(e, r), this._table = i
                }

                ngOnChanges(e) {
                    super.ngOnChanges(e)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(qe), m(Gn), m(ds, 8))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "cdkFooterRowDef", ""]],
                inputs: {columns: ["cdkFooterRowDef", "columns"], sticky: ["cdkFooterRowDefSticky", "sticky"]},
                features: [ee, Gt]
            }), n
        })(), Xl = (() => {
            class n extends Yf {
                constructor(e, r, i) {
                    super(e, r), this._table = i
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(qe), m(Gn), m(ds, 8))
            }, n.\u0275dir = x({
                type: n,
                selectors: [["", "cdkRowDef", ""]],
                inputs: {columns: ["cdkRowDefColumns", "columns"], when: ["cdkRowDefWhen", "when"]},
                features: [ee]
            }), n
        })(), tr = (() => {
            class n {
                constructor(e) {
                    this._viewContainer = e, n.mostRecentCellOutlet = this
                }

                ngOnDestroy() {
                    n.mostRecentCellOutlet === this && (n.mostRecentCellOutlet = null)
                }
            }

            return n.mostRecentCellOutlet = null, n.\u0275fac = function (e) {
                return new (e || n)(m(Ke))
            }, n.\u0275dir = x({type: n, selectors: [["", "cdkCellOutlet", ""]]}), n
        })(), Jf = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275cmp = Ye({
                type: n,
                selectors: [["cdk-header-row"], ["tr", "cdk-header-row", ""]],
                hostAttrs: ["role", "row", 1, "cdk-header-row"],
                decls: 1,
                vars: 0,
                consts: [["cdkCellOutlet", ""]],
                template: function (e, r) {
                    1 & e && Sn(0, 0)
                },
                dependencies: [tr],
                encapsulation: 2
            }), n
        })(), ep = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275cmp = Ye({
                type: n,
                selectors: [["cdk-row"], ["tr", "cdk-row", ""]],
                hostAttrs: ["role", "row", 1, "cdk-row"],
                decls: 1,
                vars: 0,
                consts: [["cdkCellOutlet", ""]],
                template: function (e, r) {
                    1 & e && Sn(0, 0)
                },
                dependencies: [tr],
                encapsulation: 2
            }), n
        })(), ec = (() => {
            class n {
                constructor(e) {
                    this.templateRef = e, this._contentClassName = "cdk-no-data-row"
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(qe))
            }, n.\u0275dir = x({type: n, selectors: [["ng-template", "cdkNoDataRow", ""]]}), n
        })();
        const aE = ["top", "bottom", "left", "right"];

        class GV {
            constructor(t, e, r, i, s = !0, o = !0, a) {
                this._isNativeHtmlTable = t, this._stickCellCss = e, this.direction = r, this._coalescedStyleScheduler = i, this._isBrowser = s, this._needsPositionStickyOnElement = o, this._positionListener = a, this._cachedCellWidths = [], this._borderCellCss = {
                    top: `${e}-border-elem-top`,
                    bottom: `${e}-border-elem-bottom`,
                    left: `${e}-border-elem-left`,
                    right: `${e}-border-elem-right`
                }
            }

            clearStickyPositioning(t, e) {
                const r = [];
                for (const i of t) if (i.nodeType === i.ELEMENT_NODE) {
                    r.push(i);
                    for (let s = 0; s < i.children.length; s++) r.push(i.children[s])
                }
                this._coalescedStyleScheduler.schedule(() => {
                    for (const i of r) this._removeStickyStyle(i, e)
                })
            }

            updateStickyColumns(t, e, r, i = !0) {
                if (!t.length || !this._isBrowser || !e.some(h => h) && !r.some(h => h)) return void (this._positionListener && (this._positionListener.stickyColumnsUpdated({sizes: []}), this._positionListener.stickyEndColumnsUpdated({sizes: []})));
                const s = t[0], o = s.children.length, a = this._getCellWidths(s, i),
                    l = this._getStickyStartColumnPositions(a, e), c = this._getStickyEndColumnPositions(a, r),
                    u = e.lastIndexOf(!0), d = r.indexOf(!0);
                this._coalescedStyleScheduler.schedule(() => {
                    const h = "rtl" === this.direction, f = h ? "right" : "left", p = h ? "left" : "right";
                    for (const g of t) for (let _ = 0; _ < o; _++) {
                        const y = g.children[_];
                        e[_] && this._addStickyStyle(y, f, l[_], _ === u), r[_] && this._addStickyStyle(y, p, c[_], _ === d)
                    }
                    this._positionListener && (this._positionListener.stickyColumnsUpdated({sizes: -1 === u ? [] : a.slice(0, u + 1).map((g, _) => e[_] ? g : null)}), this._positionListener.stickyEndColumnsUpdated({sizes: -1 === d ? [] : a.slice(d).map((g, _) => r[_ + d] ? g : null).reverse()}))
                })
            }

            stickRows(t, e, r) {
                if (!this._isBrowser) return;
                const i = "bottom" === r ? t.slice().reverse() : t, s = "bottom" === r ? e.slice().reverse() : e,
                    o = [], a = [], l = [];
                for (let u = 0, d = 0; u < i.length; u++) {
                    if (!s[u]) continue;
                    o[u] = d;
                    const h = i[u];
                    l[u] = this._isNativeHtmlTable ? Array.from(h.children) : [h];
                    const f = h.getBoundingClientRect().height;
                    d += f, a[u] = f
                }
                const c = s.lastIndexOf(!0);
                this._coalescedStyleScheduler.schedule(() => {
                    for (let u = 0; u < i.length; u++) {
                        if (!s[u]) continue;
                        const d = o[u], h = u === c;
                        for (const f of l[u]) this._addStickyStyle(f, r, d, h)
                    }
                    "top" === r ? this._positionListener?.stickyHeaderRowsUpdated({
                        sizes: a,
                        offsets: o,
                        elements: l
                    }) : this._positionListener?.stickyFooterRowsUpdated({sizes: a, offsets: o, elements: l})
                })
            }

            updateStickyFooterContainer(t, e) {
                if (!this._isNativeHtmlTable) return;
                const r = t.querySelector("tfoot");
                this._coalescedStyleScheduler.schedule(() => {
                    e.some(i => !i) ? this._removeStickyStyle(r, ["bottom"]) : this._addStickyStyle(r, "bottom", 0, !1)
                })
            }

            _removeStickyStyle(t, e) {
                for (const i of e) t.style[i] = "", t.classList.remove(this._borderCellCss[i]);
                aE.some(i => -1 === e.indexOf(i) && t.style[i]) ? t.style.zIndex = this._getCalculatedZIndex(t) : (t.style.zIndex = "", this._needsPositionStickyOnElement && (t.style.position = ""), t.classList.remove(this._stickCellCss))
            }

            _addStickyStyle(t, e, r, i) {
                t.classList.add(this._stickCellCss), i && t.classList.add(this._borderCellCss[e]), t.style[e] = `${r}px`, t.style.zIndex = this._getCalculatedZIndex(t), this._needsPositionStickyOnElement && (t.style.cssText += "position: -webkit-sticky; position: sticky; ")
            }

            _getCalculatedZIndex(t) {
                const e = {top: 100, bottom: 10, left: 1, right: 1};
                let r = 0;
                for (const i of aE) t.style[i] && (r += e[i]);
                return r ? `${r}` : ""
            }

            _getCellWidths(t, e = !0) {
                if (!e && this._cachedCellWidths.length) return this._cachedCellWidths;
                const r = [], i = t.children;
                for (let s = 0; s < i.length; s++) r.push(i[s].getBoundingClientRect().width);
                return this._cachedCellWidths = r, r
            }

            _getStickyStartColumnPositions(t, e) {
                const r = [];
                let i = 0;
                for (let s = 0; s < t.length; s++) e[s] && (r[s] = i, i += t[s]);
                return r
            }

            _getStickyEndColumnPositions(t, e) {
                const r = [];
                let i = 0;
                for (let s = t.length; s > 0; s--) e[s] && (r[s] = i, i += t[s]);
                return r
            }
        }

        const tp = new S("CDK_SPL");
        let tc = (() => {
            class n {
                constructor(e, r) {
                    this.viewContainer = e, this.elementRef = r
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Ke), m(re))
            }, n.\u0275dir = x({type: n, selectors: [["", "rowOutlet", ""]]}), n
        })(), nc = (() => {
            class n {
                constructor(e, r) {
                    this.viewContainer = e, this.elementRef = r
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Ke), m(re))
            }, n.\u0275dir = x({type: n, selectors: [["", "headerRowOutlet", ""]]}), n
        })(), rc = (() => {
            class n {
                constructor(e, r) {
                    this.viewContainer = e, this.elementRef = r
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Ke), m(re))
            }, n.\u0275dir = x({type: n, selectors: [["", "footerRowOutlet", ""]]}), n
        })(), ic = (() => {
            class n {
                constructor(e, r) {
                    this.viewContainer = e, this.elementRef = r
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Ke), m(re))
            }, n.\u0275dir = x({type: n, selectors: [["", "noDataRowOutlet", ""]]}), n
        })(), sc = (() => {
            class n {
                constructor(e, r, i, s, o, a, l, c, u, d, h, f) {
                    this._differs = e, this._changeDetectorRef = r, this._elementRef = i, this._dir = o, this._platform = l, this._viewRepeater = c, this._coalescedStyleScheduler = u, this._viewportRuler = d, this._stickyPositioningListener = h, this._ngZone = f, this._onDestroy = new ve, this._columnDefsByName = new Map, this._customColumnDefs = new Set, this._customRowDefs = new Set, this._customHeaderRowDefs = new Set, this._customFooterRowDefs = new Set, this._headerRowDefChanged = !0, this._footerRowDefChanged = !0, this._stickyColumnStylesNeedReset = !0, this._forceRecalculateCellWidths = !0, this._cachedRenderRowsMap = new Map, this.stickyCssClass = "cdk-table-sticky", this.needsPositionStickyOnElement = !0, this._isShowingNoDataRow = !1, this._multiTemplateDataRows = !1, this._fixedLayout = !1, this.contentChanged = new ie, this.viewChange = new Ot({
                        start: 0,
                        end: Number.MAX_VALUE
                    }), s || this._elementRef.nativeElement.setAttribute("role", "table"), this._document = a, this._isNativeHtmlTable = "TABLE" === this._elementRef.nativeElement.nodeName
                }

                get trackBy() {
                    return this._trackByFn
                }

                set trackBy(e) {
                    this._trackByFn = e
                }

                get dataSource() {
                    return this._dataSource
                }

                set dataSource(e) {
                    this._dataSource !== e && this._switchDataSource(e)
                }

                get multiTemplateDataRows() {
                    return this._multiTemplateDataRows
                }

                set multiTemplateDataRows(e) {
                    this._multiTemplateDataRows = tn(e), this._rowOutlet && this._rowOutlet.viewContainer.length && (this._forceRenderDataRows(), this.updateStickyColumnStyles())
                }

                get fixedLayout() {
                    return this._fixedLayout
                }

                set fixedLayout(e) {
                    this._fixedLayout = tn(e), this._forceRecalculateCellWidths = !0, this._stickyColumnStylesNeedReset = !0
                }

                ngOnInit() {
                    this._setupStickyStyler(), this._isNativeHtmlTable && this._applyNativeTableSections(), this._dataDiffer = this._differs.find([]).create((e, r) => this.trackBy ? this.trackBy(r.dataIndex, r.data) : r), this._viewportRuler.change().pipe(Lt(this._onDestroy)).subscribe(() => {
                        this._forceRecalculateCellWidths = !0
                    })
                }

                ngAfterContentChecked() {
                    this._cacheRowDefs(), this._cacheColumnDefs();
                    const r = this._renderUpdatedColumns() || this._headerRowDefChanged || this._footerRowDefChanged;
                    this._stickyColumnStylesNeedReset = this._stickyColumnStylesNeedReset || r, this._forceRecalculateCellWidths = r, this._headerRowDefChanged && (this._forceRenderHeaderRows(), this._headerRowDefChanged = !1), this._footerRowDefChanged && (this._forceRenderFooterRows(), this._footerRowDefChanged = !1), this.dataSource && this._rowDefs.length > 0 && !this._renderChangeSubscription ? this._observeRenderChanges() : this._stickyColumnStylesNeedReset && this.updateStickyColumnStyles(), this._checkStickyStates()
                }

                ngOnDestroy() {
                    [this._rowOutlet.viewContainer, this._headerRowOutlet.viewContainer, this._footerRowOutlet.viewContainer, this._cachedRenderRowsMap, this._customColumnDefs, this._customRowDefs, this._customHeaderRowDefs, this._customFooterRowDefs, this._columnDefsByName].forEach(e => {
                        e.clear()
                    }), this._headerRowDefs = [], this._footerRowDefs = [], this._defaultRowDef = null, this._onDestroy.next(), this._onDestroy.complete(), Wf(this.dataSource) && this.dataSource.disconnect(this)
                }

                renderRows() {
                    this._renderRows = this._getAllRenderRows();
                    const e = this._dataDiffer.diff(this._renderRows);
                    if (!e) return this._updateNoDataRow(), void this.contentChanged.next();
                    const r = this._rowOutlet.viewContainer;
                    this._viewRepeater.applyChanges(e, r, (i, s, o) => this._getEmbeddedViewArgs(i.item, o), i => i.item.data, i => {
                        1 === i.operation && i.context && this._renderCellTemplateForItem(i.record.item.rowDef, i.context)
                    }), this._updateRowIndexContext(), e.forEachIdentityChange(i => {
                        r.get(i.currentIndex).context.$implicit = i.item.data
                    }), this._updateNoDataRow(), this._ngZone && Z.isInAngularZone() ? this._ngZone.onStable.pipe(Rn(1), Lt(this._onDestroy)).subscribe(() => {
                        this.updateStickyColumnStyles()
                    }) : this.updateStickyColumnStyles(), this.contentChanged.next()
                }

                addColumnDef(e) {
                    this._customColumnDefs.add(e)
                }

                removeColumnDef(e) {
                    this._customColumnDefs.delete(e)
                }

                addRowDef(e) {
                    this._customRowDefs.add(e)
                }

                removeRowDef(e) {
                    this._customRowDefs.delete(e)
                }

                addHeaderRowDef(e) {
                    this._customHeaderRowDefs.add(e), this._headerRowDefChanged = !0
                }

                removeHeaderRowDef(e) {
                    this._customHeaderRowDefs.delete(e), this._headerRowDefChanged = !0
                }

                addFooterRowDef(e) {
                    this._customFooterRowDefs.add(e), this._footerRowDefChanged = !0
                }

                removeFooterRowDef(e) {
                    this._customFooterRowDefs.delete(e), this._footerRowDefChanged = !0
                }

                setNoDataRow(e) {
                    this._customNoDataRow = e
                }

                updateStickyHeaderRowStyles() {
                    const e = this._getRenderedRows(this._headerRowOutlet),
                        i = this._elementRef.nativeElement.querySelector("thead");
                    i && (i.style.display = e.length ? "" : "none");
                    const s = this._headerRowDefs.map(o => o.sticky);
                    this._stickyStyler.clearStickyPositioning(e, ["top"]), this._stickyStyler.stickRows(e, s, "top"), this._headerRowDefs.forEach(o => o.resetStickyChanged())
                }

                updateStickyFooterRowStyles() {
                    const e = this._getRenderedRows(this._footerRowOutlet),
                        i = this._elementRef.nativeElement.querySelector("tfoot");
                    i && (i.style.display = e.length ? "" : "none");
                    const s = this._footerRowDefs.map(o => o.sticky);
                    this._stickyStyler.clearStickyPositioning(e, ["bottom"]), this._stickyStyler.stickRows(e, s, "bottom"), this._stickyStyler.updateStickyFooterContainer(this._elementRef.nativeElement, s), this._footerRowDefs.forEach(o => o.resetStickyChanged())
                }

                updateStickyColumnStyles() {
                    const e = this._getRenderedRows(this._headerRowOutlet), r = this._getRenderedRows(this._rowOutlet),
                        i = this._getRenderedRows(this._footerRowOutlet);
                    (this._isNativeHtmlTable && !this._fixedLayout || this._stickyColumnStylesNeedReset) && (this._stickyStyler.clearStickyPositioning([...e, ...r, ...i], ["left", "right"]), this._stickyColumnStylesNeedReset = !1), e.forEach((s, o) => {
                        this._addStickyColumnStyles([s], this._headerRowDefs[o])
                    }), this._rowDefs.forEach(s => {
                        const o = [];
                        for (let a = 0; a < r.length; a++) this._renderRows[a].rowDef === s && o.push(r[a]);
                        this._addStickyColumnStyles(o, s)
                    }), i.forEach((s, o) => {
                        this._addStickyColumnStyles([s], this._footerRowDefs[o])
                    }), Array.from(this._columnDefsByName.values()).forEach(s => s.resetStickyChanged())
                }

                _getAllRenderRows() {
                    const e = [], r = this._cachedRenderRowsMap;
                    this._cachedRenderRowsMap = new Map;
                    for (let i = 0; i < this._data.length; i++) {
                        let s = this._data[i];
                        const o = this._getRenderRowsForData(s, i, r.get(s));
                        this._cachedRenderRowsMap.has(s) || this._cachedRenderRowsMap.set(s, new WeakMap);
                        for (let a = 0; a < o.length; a++) {
                            let l = o[a];
                            const c = this._cachedRenderRowsMap.get(l.data);
                            c.has(l.rowDef) ? c.get(l.rowDef).push(l) : c.set(l.rowDef, [l]), e.push(l)
                        }
                    }
                    return e
                }

                _getRenderRowsForData(e, r, i) {
                    return this._getRowDefs(e, r).map(o => {
                        const a = i && i.has(o) ? i.get(o) : [];
                        if (a.length) {
                            const l = a.shift();
                            return l.dataIndex = r, l
                        }
                        return {data: e, rowDef: o, dataIndex: r}
                    })
                }

                _cacheColumnDefs() {
                    this._columnDefsByName.clear(), oc(this._getOwnDefs(this._contentColumnDefs), this._customColumnDefs).forEach(r => {
                        this._columnDefsByName.has(r.name), this._columnDefsByName.set(r.name, r)
                    })
                }

                _cacheRowDefs() {
                    this._headerRowDefs = oc(this._getOwnDefs(this._contentHeaderRowDefs), this._customHeaderRowDefs), this._footerRowDefs = oc(this._getOwnDefs(this._contentFooterRowDefs), this._customFooterRowDefs), this._rowDefs = oc(this._getOwnDefs(this._contentRowDefs), this._customRowDefs);
                    const e = this._rowDefs.filter(r => !r.when);
                    this._defaultRowDef = e[0]
                }

                _renderUpdatedColumns() {
                    const e = (o, a) => o || !!a.getColumnsDiff(), r = this._rowDefs.reduce(e, !1);
                    r && this._forceRenderDataRows();
                    const i = this._headerRowDefs.reduce(e, !1);
                    i && this._forceRenderHeaderRows();
                    const s = this._footerRowDefs.reduce(e, !1);
                    return s && this._forceRenderFooterRows(), r || i || s
                }

                _switchDataSource(e) {
                    this._data = [], Wf(this.dataSource) && this.dataSource.disconnect(this), this._renderChangeSubscription && (this._renderChangeSubscription.unsubscribe(), this._renderChangeSubscription = null), e || (this._dataDiffer && this._dataDiffer.diff([]), this._rowOutlet.viewContainer.clear()), this._dataSource = e
                }

                _observeRenderChanges() {
                    if (!this.dataSource) return;
                    let e;
                    Wf(this.dataSource) ? e = this.dataSource.connect(this) : function FV(n) {
                        return !!n && (n instanceof fe || J(n.lift) && J(n.subscribe))
                    }(this.dataSource) ? e = this.dataSource : Array.isArray(this.dataSource) && (e = R(this.dataSource)), this._renderChangeSubscription = e.pipe(Lt(this._onDestroy)).subscribe(r => {
                        this._data = r || [], this.renderRows()
                    })
                }

                _forceRenderHeaderRows() {
                    this._headerRowOutlet.viewContainer.length > 0 && this._headerRowOutlet.viewContainer.clear(), this._headerRowDefs.forEach((e, r) => this._renderRow(this._headerRowOutlet, e, r)), this.updateStickyHeaderRowStyles()
                }

                _forceRenderFooterRows() {
                    this._footerRowOutlet.viewContainer.length > 0 && this._footerRowOutlet.viewContainer.clear(), this._footerRowDefs.forEach((e, r) => this._renderRow(this._footerRowOutlet, e, r)), this.updateStickyFooterRowStyles()
                }

                _addStickyColumnStyles(e, r) {
                    const i = Array.from(r.columns || []).map(a => this._columnDefsByName.get(a)),
                        s = i.map(a => a.sticky), o = i.map(a => a.stickyEnd);
                    this._stickyStyler.updateStickyColumns(e, s, o, !this._fixedLayout || this._forceRecalculateCellWidths)
                }

                _getRenderedRows(e) {
                    const r = [];
                    for (let i = 0; i < e.viewContainer.length; i++) {
                        const s = e.viewContainer.get(i);
                        r.push(s.rootNodes[0])
                    }
                    return r
                }

                _getRowDefs(e, r) {
                    if (1 == this._rowDefs.length) return [this._rowDefs[0]];
                    let i = [];
                    if (this.multiTemplateDataRows) i = this._rowDefs.filter(s => !s.when || s.when(r, e)); else {
                        let s = this._rowDefs.find(o => o.when && o.when(r, e)) || this._defaultRowDef;
                        s && i.push(s)
                    }
                    return i
                }

                _getEmbeddedViewArgs(e, r) {
                    return {templateRef: e.rowDef.template, context: {$implicit: e.data}, index: r}
                }

                _renderRow(e, r, i, s = {}) {
                    const o = e.viewContainer.createEmbeddedView(r.template, s, i);
                    return this._renderCellTemplateForItem(r, s), o
                }

                _renderCellTemplateForItem(e, r) {
                    for (let i of this._getCellTemplates(e)) tr.mostRecentCellOutlet && tr.mostRecentCellOutlet._viewContainer.createEmbeddedView(i, r);
                    this._changeDetectorRef.markForCheck()
                }

                _updateRowIndexContext() {
                    const e = this._rowOutlet.viewContainer;
                    for (let r = 0, i = e.length; r < i; r++) {
                        const o = e.get(r).context;
                        o.count = i, o.first = 0 === r, o.last = r === i - 1, o.even = r % 2 == 0, o.odd = !o.even, this.multiTemplateDataRows ? (o.dataIndex = this._renderRows[r].dataIndex, o.renderIndex = r) : o.index = this._renderRows[r].dataIndex
                    }
                }

                _getCellTemplates(e) {
                    return e && e.columns ? Array.from(e.columns, r => {
                        const i = this._columnDefsByName.get(r);
                        return e.extractCellTemplate(i)
                    }) : []
                }

                _applyNativeTableSections() {
                    const e = this._document.createDocumentFragment(),
                        r = [{tag: "thead", outlets: [this._headerRowOutlet]}, {
                            tag: "tbody",
                            outlets: [this._rowOutlet, this._noDataRowOutlet]
                        }, {tag: "tfoot", outlets: [this._footerRowOutlet]}];
                    for (const i of r) {
                        const s = this._document.createElement(i.tag);
                        s.setAttribute("role", "rowgroup");
                        for (const o of i.outlets) s.appendChild(o.elementRef.nativeElement);
                        e.appendChild(s)
                    }
                    this._elementRef.nativeElement.appendChild(e)
                }

                _forceRenderDataRows() {
                    this._dataDiffer.diff([]), this._rowOutlet.viewContainer.clear(), this.renderRows()
                }

                _checkStickyStates() {
                    const e = (r, i) => r || i.hasStickyChanged();
                    this._headerRowDefs.reduce(e, !1) && this.updateStickyHeaderRowStyles(), this._footerRowDefs.reduce(e, !1) && this.updateStickyFooterRowStyles(), Array.from(this._columnDefsByName.values()).reduce(e, !1) && (this._stickyColumnStylesNeedReset = !0, this.updateStickyColumnStyles())
                }

                _setupStickyStyler() {
                    this._stickyStyler = new GV(this._isNativeHtmlTable, this.stickyCssClass, this._dir ? this._dir.value : "ltr", this._coalescedStyleScheduler, this._platform.isBrowser, this.needsPositionStickyOnElement, this._stickyPositioningListener), (this._dir ? this._dir.change : R()).pipe(Lt(this._onDestroy)).subscribe(r => {
                        this._stickyStyler.direction = r, this.updateStickyColumnStyles()
                    })
                }

                _getOwnDefs(e) {
                    return e.filter(r => !r._table || r._table === this)
                }

                _updateNoDataRow() {
                    const e = this._customNoDataRow || this._noDataRow;
                    if (!e) return;
                    const r = 0 === this._rowOutlet.viewContainer.length;
                    if (r === this._isShowingNoDataRow) return;
                    const i = this._noDataRowOutlet.viewContainer;
                    if (r) {
                        const s = i.createEmbeddedView(e.templateRef), o = s.rootNodes[0];
                        1 === s.rootNodes.length && o?.nodeType === this._document.ELEMENT_NODE && (o.setAttribute("role", "row"), o.classList.add(e._contentClassName))
                    } else i.clear();
                    this._isShowingNoDataRow = r
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(Gn), m(mn), m(re), pi("role"), m(cs, 8), m(_e), m(kn), m(Oo), m(Zf), m(Yl), m(tp, 12), m(Z, 8))
            }, n.\u0275cmp = Ye({
                type: n,
                selectors: [["cdk-table"], ["table", "cdk-table", ""]],
                contentQueries: function (e, r, i) {
                    if (1 & e && (yt(i, ec, 5), yt(i, er, 5), yt(i, Xl, 5), yt(i, Lo, 5), yt(i, Bo, 5)), 2 & e) {
                        let s;
                        se(s = oe()) && (r._noDataRow = s.first), se(s = oe()) && (r._contentColumnDefs = s), se(s = oe()) && (r._contentRowDefs = s), se(s = oe()) && (r._contentHeaderRowDefs = s), se(s = oe()) && (r._contentFooterRowDefs = s)
                    }
                },
                viewQuery: function (e, r) {
                    if (1 & e && (et(tc, 7), et(nc, 7), et(rc, 7), et(ic, 7)), 2 & e) {
                        let i;
                        se(i = oe()) && (r._rowOutlet = i.first), se(i = oe()) && (r._headerRowOutlet = i.first), se(i = oe()) && (r._footerRowOutlet = i.first), se(i = oe()) && (r._noDataRowOutlet = i.first)
                    }
                },
                hostAttrs: [1, "cdk-table"],
                hostVars: 2,
                hostBindings: function (e, r) {
                    2 & e && rt("cdk-table-fixed-layout", r.fixedLayout)
                },
                inputs: {
                    trackBy: "trackBy",
                    dataSource: "dataSource",
                    multiTemplateDataRows: "multiTemplateDataRows",
                    fixedLayout: "fixedLayout"
                },
                outputs: {contentChanged: "contentChanged"},
                exportAs: ["cdkTable"],
                features: [Ge([{provide: ds, useExisting: n}, {provide: Oo, useClass: nE}, {
                    provide: Zf,
                    useClass: oE
                }, {provide: tp, useValue: null}])],
                ngContentSelectors: OV,
                decls: 6,
                vars: 0,
                consts: [["headerRowOutlet", ""], ["rowOutlet", ""], ["noDataRowOutlet", ""], ["footerRowOutlet", ""]],
                template: function (e, r) {
                    1 & e && (Ys(NV), Ur(0), Ur(1, 1), Sn(2, 0)(3, 1)(4, 2)(5, 3))
                },
                dependencies: [tc, nc, rc, ic],
                styles: [".cdk-table-fixed-layout{table-layout:fixed}"],
                encapsulation: 2
            }), n
        })();

        function oc(n, t) {
            return n.concat(Array.from(t))
        }

        let KV = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({imports: [ZB]}), n
        })();
        const QV = [[["caption"]], [["colgroup"], ["col"]]], ZV = ["caption", "colgroup, col"];
        let cE = (() => {
            class n extends sc {
                constructor() {
                    super(...arguments), this.stickyCssClass = "mat-table-sticky", this.needsPositionStickyOnElement = !1
                }
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275cmp = Ye({
                type: n,
                selectors: [["mat-table"], ["table", "mat-table", ""]],
                hostAttrs: [1, "mat-table"],
                hostVars: 2,
                hostBindings: function (e, r) {
                    2 & e && rt("mat-table-fixed-layout", r.fixedLayout)
                },
                exportAs: ["matTable"],
                features: [Ge([{provide: Oo, useClass: nE}, {provide: sc, useExisting: n}, {
                    provide: ds,
                    useExisting: n
                }, {provide: Zf, useClass: oE}, {provide: tp, useValue: null}]), ee],
                ngContentSelectors: ZV,
                decls: 6,
                vars: 0,
                consts: [["headerRowOutlet", ""], ["rowOutlet", ""], ["noDataRowOutlet", ""], ["footerRowOutlet", ""]],
                template: function (e, r) {
                    1 & e && (Ys(QV), Ur(0), Ur(1, 1), Sn(2, 0)(3, 1)(4, 2)(5, 3))
                },
                dependencies: [tc, nc, rc, ic],
                styles: ["mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}table.mat-table{border-spacing:0}tr.mat-header-row{height:56px}tr.mat-row,tr.mat-footer-row{height:48px}th.mat-header-cell{text-align:left}[dir=rtl] th.mat-header-cell{text-align:right}th.mat-header-cell,td.mat-cell,td.mat-footer-cell{padding:0;border-bottom-width:1px;border-bottom-style:solid}th.mat-header-cell:first-of-type,td.mat-cell:first-of-type,td.mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] th.mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}th.mat-header-cell:last-of-type,td.mat-cell:last-of-type,td.mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] th.mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}.mat-table-sticky{position:sticky !important}.mat-table-fixed-layout{table-layout:fixed}"],
                encapsulation: 2
            }), n
        })(), np = (() => {
            class n extends hs {
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275dir = x({
                type: n,
                selectors: [["", "matCellDef", ""]],
                features: [Ge([{provide: hs, useExisting: n}]), ee]
            }), n
        })(), rp = (() => {
            class n extends fs {
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275dir = x({
                type: n,
                selectors: [["", "matHeaderCellDef", ""]],
                features: [Ge([{provide: fs, useExisting: n}]), ee]
            }), n
        })(), ip = (() => {
            class n extends er {
                get name() {
                    return this._name
                }

                set name(e) {
                    this._setNameInput(e)
                }

                _updateColumnCssClassName() {
                    super._updateColumnCssClassName(), this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`)
                }
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275dir = x({
                type: n,
                selectors: [["", "matColumnDef", ""]],
                inputs: {sticky: "sticky", name: ["matColumnDef", "name"]},
                features: [Ge([{provide: er, useExisting: n}, {
                    provide: "MAT_SORT_HEADER_COLUMN_DEF",
                    useExisting: n
                }]), ee]
            }), n
        })(), sp = (() => {
            class n extends Kf {
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275dir = x({
                type: n,
                selectors: [["mat-header-cell"], ["th", "mat-header-cell", ""]],
                hostAttrs: ["role", "columnheader", 1, "mat-header-cell"],
                features: [ee]
            }), n
        })(), op = (() => {
            class n extends Qf {
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275dir = x({
                type: n,
                selectors: [["mat-cell"], ["td", "mat-cell", ""]],
                hostAttrs: ["role", "gridcell", 1, "mat-cell"],
                features: [ee]
            }), n
        })(), uE = (() => {
            class n extends Lo {
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275dir = x({
                type: n,
                selectors: [["", "matHeaderRowDef", ""]],
                inputs: {columns: ["matHeaderRowDef", "columns"], sticky: ["matHeaderRowDefSticky", "sticky"]},
                features: [Ge([{provide: Lo, useExisting: n}]), ee]
            }), n
        })(), dE = (() => {
            class n extends Xl {
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275dir = x({
                type: n,
                selectors: [["", "matRowDef", ""]],
                inputs: {columns: ["matRowDefColumns", "columns"], when: ["matRowDefWhen", "when"]},
                features: [Ge([{provide: Xl, useExisting: n}]), ee]
            }), n
        })(), hE = (() => {
            class n extends Jf {
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275cmp = Ye({
                type: n,
                selectors: [["mat-header-row"], ["tr", "mat-header-row", ""]],
                hostAttrs: ["role", "row", 1, "mat-header-row"],
                exportAs: ["matHeaderRow"],
                features: [Ge([{provide: Jf, useExisting: n}]), ee],
                decls: 1,
                vars: 0,
                consts: [["cdkCellOutlet", ""]],
                template: function (e, r) {
                    1 & e && Sn(0, 0)
                },
                dependencies: [tr],
                encapsulation: 2
            }), n
        })(), fE = (() => {
            class n extends ep {
            }

            return n.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = nt(n)))(r || n)
                }
            }(), n.\u0275cmp = Ye({
                type: n,
                selectors: [["mat-row"], ["tr", "mat-row", ""]],
                hostAttrs: ["role", "row", 1, "mat-row"],
                exportAs: ["matRow"],
                features: [Ge([{provide: ep, useExisting: n}]), ee],
                decls: 1,
                vars: 0,
                consts: [["cdkCellOutlet", ""]],
                template: function (e, r) {
                    1 & e && Sn(0, 0)
                },
                dependencies: [tr],
                encapsulation: 2
            }), n
        })(), oj = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({imports: [KV, us, us]}), n
        })();

        function lj(n, t) {
            if (1 & n) {
                const e = Ui();
                Q(0, "div", 9), Xe("click", function () {
                    const s = or(e).$implicit;
                    return ar(ze().setCharts(s))
                }), it(1), te()
            }
            if (2 & n) {
                const e = t.$implicit;
                rt("is-clicked", e.clicked), he(1), St(" ", e.name, " ")
            }
        }

        function cj(n, t) {
            if (1 & n) {
                const e = Ui();
                Q(0, "div", 9), Xe("click", function () {
                    or(e);
                    const i = ze().$implicit;
                    return ar(ze().setRMS(i))
                }), it(1), te()
            }
            if (2 & n) {
                const e = ze().$implicit;
                rt("is-clicked", e.clicked), he(1), St(" ", e.name, " ")
            }
        }

        function uj(n, t) {
            if (1 & n && (Q(0, "div"), De(1, cj, 2, 3, "div", 10), te()), 2 & n) {
                const e = t.$implicit;
                he(1), ke("ngIf", "analog" === e.type)
            }
        }

        function dj(n, t) {
            if (1 & n) {
                const e = Ui();
                Q(0, "button", 11), Xe("click", function () {
                    return or(e), ar(ze().getTableData())
                }), it(1, "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0442\u0430\u0431\u043b\u0438\u0446\u0443"), te()
            }
        }

        function hj(n, t) {
            1 & n && (Q(0, "th", 21), it(1, " No. "), te())
        }

        function fj(n, t) {
            if (1 & n && (Q(0, "td", 22), it(1), te()), 2 & n) {
                const e = t.index;
                he(1), St(" ", e + 1, " ")
            }
        }

        function pj(n, t) {
            1 & n && (Q(0, "th", 21), it(1, " time "), te())
        }

        function gj(n, t) {
            if (1 & n && (Q(0, "td", 22), it(1), te()), 2 & n) {
                const e = t.$implicit;
                he(1), St(" ", e.time, " ")
            }
        }

        function mj(n, t) {
            1 & n && (Q(0, "th", 21), it(1, " value "), te())
        }

        function _j(n, t) {
            if (1 & n && (Q(0, "td", 22), it(1), te()), 2 & n) {
                const e = t.$implicit;
                he(1), St(" ", e.value, " ")
            }
        }

        function yj(n, t) {
            1 & n && pr(0, "tr", 23)
        }

        function vj(n, t) {
            1 & n && pr(0, "tr", 24)
        }

        function bj(n, t) {
            if (1 & n && (Q(0, "div", 12)(1, "p"), it(2), te(), Q(3, "p"), it(4), te(), Q(5, "table", 13), gr(6, 14), De(7, hj, 2, 0, "th", 15), De(8, fj, 2, 1, "td", 16), mr(), gr(9, 17), De(10, pj, 2, 0, "th", 15), De(11, gj, 2, 1, "td", 16), mr(), gr(12, 18), De(13, mj, 2, 0, "th", 15), De(14, _j, 2, 1, "td", 16), mr(), De(15, yj, 1, 0, "tr", 19), De(16, vj, 1, 0, "tr", 20), te()()), 2 & n) {
                const e = ze();
                he(2), St("\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e \u0442\u043e\u043a\u0430 - ", null == e.tableDatasource[0] ? null : e.tableDatasource[0].name, ""), he(2), St("\u0412\u0440\u0435\u043c\u044f \u043d\u0430\u0447\u0430\u043b\u0430 \u041a\u0417 = ", null == e.tableDatasource[0] ? null : e.tableDatasource[0].time, " \u043c\u0441"), he(1), ke("dataSource", e.tableDatasource), he(10), ke("matHeaderRowDef", e.displayedColumns), he(1), ke("matRowDefColumns", e.displayedColumns)
            }
        }

        let Dj = (() => {
            class n {
                constructor(e, r) {
                    this.service = e, this.el = r, this.title = "front", this.tabIndex = 0, this.tableDatasource = [], this.displayedColumns = ["position", "time", "value"]
                }

                ngOnInit() {
                    this.service.getScopes().subscribe(e => {
                        this.datasource = e
                    })
                }

                setCharts(e) {
                    e.clicked = !e.clicked, this.scopeOptions = {
                        xAxis: [{
                            data: this.datasource[0].values.map((r, i) => i),
                            gridIndex: 0
                        }, {data: this.datasource[0].values.map((r, i) => i), gridIndex: 1}],
                        yAxis: [{gridIndex: 0}, {gridIndex: 1, splitNumber: 1}],
                        series: this.datasource.filter(r => r.clicked).map(r => "analog" === r.type ? {
                            name: r.name,
                            type: "line",
                            showSymbol: !1,
                            data: r.values,
                            xAxisIndex: 0,
                            yAxisIndex: 0
                        } : {
                            name: r.name,
                            type: "line",
                            showSymbol: !1,
                            data: r.values,
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            areaStyle: {opacity: .1}
                        }),
                        dataZoom: [{type: "inside", xAxisIndex: [0, 1]}],
                        grid: [{top: "5%", bottom: "25%", left: "7%", right: "1%"}, {
                            top: "85%",
                            bottom: "5%",
                            left: "7%",
                            right: "1%"
                        }],
                        tooltip: {trigger: "axis", align: "left", verticalAlign: "middle"}
                    }, this.scopeOptions.dataZoom = this.echarts.getOption().dataZoom, this.scopeEcharts.setOption(this.scopeOptions)
                }

                setRMS(e) {
                    "analog" === e.type && (e.clicked = !e.clicked, this.options = {
                        xAxis: {data: this.datasource[0].values.map((r, i) => i)},
                        yAxis: {},
                        series: this.datasource.filter(r => r.clicked).map(r => ({
                            name: r.name,
                            type: "line",
                            showSymbol: !1,
                            data: r.rms
                        })),
                        tooltip: {trigger: "axis", align: "left", verticalAlign: "middle"}
                    }, this.rmsEcharts.setOption(this.options))
                }

                onMatTabChange(e) {
                    this.tabIndex = e.index, this.datasource.forEach(r => {
                        r.clicked = !1
                    })
                }

                onChartScopeInit(e) {
                    this.scopeEcharts = e
                }

                onChartRMSInit(e) {
                    this.rmsEcharts = e
                }

                getTableData() {
                    this.el.nativeElement.querySelector("button").disabled = !0, this.service.getFaultCurrentInfo().subscribe(r => {
                        this.tableDatasource = r
                    })
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(m(cL), m(re))
            }, n.\u0275cmp = Ye({
                type: n,
                selectors: [["app-root"]],
                decls: 13,
                vars: 6,
                consts: [[3, "selectedTabChange"], ["label", "\u041e\u0441\u0446\u0438\u043b\u043b\u043e\u0433\u0440\u0430\u043c\u043c\u044b"], ["class", "menu-raw", 3, "is-clicked", "click", 4, "ngFor", "ngForOf"], ["echarts", "", "theme", "macarons", 1, "custom-chart-1", 3, "options", "chartInit"], ["label", "\u0414\u0435\u0439\u0441\u0442\u0432\u0443\u044e\u0449\u0438\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u044f"], [4, "ngFor", "ngForOf"], ["echarts", "", "theme", "macarons", 1, "custom-chart-2", 3, "options", "chartInit"], [3, "click", 4, "ngIf"], ["class", "custom-table", 4, "ngIf"], [1, "menu-raw", 3, "click"], ["class", "menu-raw", 3, "is-clicked", "click", 4, "ngIf"], [3, "click"], [1, "custom-table"], ["mat-table", "", 1, "mat-elevation-z8", 3, "dataSource"], ["matColumnDef", "position"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "time"], ["matColumnDef", "value"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-header-row", ""], ["mat-row", ""]],
                template: function (e, r) {
                    1 & e && (Q(0, "mat-tab-group", 0), Xe("selectedTabChange", function (s) {
                        return r.onMatTabChange(s)
                    }), Q(1, "mat-tab", 1)(2, "main")(3, "section"), De(4, lj, 2, 3, "div", 2), te(), Q(5, "div", 3), Xe("chartInit", function (s) {
                        return r.onChartScopeInit(s)
                    }), te()()(), Q(6, "mat-tab", 4)(7, "main")(8, "section"), De(9, uj, 2, 1, "div", 5), te(), Q(10, "div", 6), Xe("chartInit", function (s) {
                        return r.onChartRMSInit(s)
                    }), te(), De(11, dj, 2, 0, "button", 7), De(12, bj, 17, 5, "div", 8), te()()()), 2 & e && (he(4), ke("ngForOf", r.datasource), he(1), ke("options", r.scopeOptions), he(4), ke("ngForOf", r.datasource), he(1), ke("options", r.options), he(1), ke("ngIf", 0 === r.tableDatasource.length), he(1), ke("ngIf", 0 !== r.tableDatasource.length))
                },
                dependencies: [Rh, xh, gL, kV, ZC, cE, rp, uE, ip, np, dE, sp, op, hE, fE],
                styles: [".mat-tab-header{min-height:5vh;background:aquamarine;color:#639!important;font-weight:700;font-size:20px}  .mat-tab-labels{justify-content:space-around}main[_ngcontent-%COMP%]{height:95vh;width:100vw;display:flex;flex-direction:row}section[_ngcontent-%COMP%]{width:20vw;overflow-y:scroll}.custom-chart-1[_ngcontent-%COMP%]{height:95vh;width:80vw}.custom-chart-2[_ngcontent-%COMP%]{height:95vh;width:40vw}.custom-table[_ngcontent-%COMP%]{width:40vw;overflow-y:scroll}button[_ngcontent-%COMP%]{width:10%;height:10%;border:none;background:red;color:#fff}table[_ngcontent-%COMP%]{width:100%}.menu-raw[_ngcontent-%COMP%]{height:48px;display:flex;align-items:center;border-bottom:1px solid rgba(0,0,0,.12);padding-left:10px}.menu-raw[_ngcontent-%COMP%]:active{background:#103C8B;color:#fff;transition:.01s}.is-clicked[_ngcontent-%COMP%]{color:#fff;background:#103C8B}button[_ngcontent-%COMP%]:disabled{background:#ccc;color:gray}"]
            }), n
        })();

        function pE(n) {
            return new D(3e3, !1)
        }

        function n2() {
            return typeof window < "u" && typeof window.document < "u"
        }

        function ap() {
            return typeof process < "u" && "[object process]" === {}.toString.call(process)
        }

        function Mr(n) {
            switch (n.length) {
                case 0:
                    return new Fo;
                case 1:
                    return n[0];
                default:
                    return new zC(n)
            }
        }

        function gE(n, t, e, r, i = new Map, s = new Map) {
            const o = [], a = [];
            let l = -1, c = null;
            if (r.forEach(u => {
                const d = u.get("offset"), h = d == l, f = h && c || new Map;
                u.forEach((p, g) => {
                    let _ = g, y = p;
                    if ("offset" !== g) switch (_ = t.normalizePropertyName(_, o), y) {
                        case"!":
                            y = i.get(g);
                            break;
                        case Xn:
                            y = s.get(g);
                            break;
                        default:
                            y = t.normalizeStyleValue(g, _, y, o)
                    }
                    f.set(_, y)
                }), h || a.push(f), c = f, l = d
            }), o.length) throw function zj(n) {
                return new D(3502, !1)
            }();
            return a
        }

        function lp(n, t, e, r) {
            switch (t) {
                case"start":
                    n.onStart(() => r(e && cp(e, "start", n)));
                    break;
                case"done":
                    n.onDone(() => r(e && cp(e, "done", n)));
                    break;
                case"destroy":
                    n.onDestroy(() => r(e && cp(e, "destroy", n)))
            }
        }

        function cp(n, t, e) {
            const s = up(n.element, n.triggerName, n.fromState, n.toState, t || n.phaseName, e.totalTime ?? n.totalTime, !!e.disabled),
                o = n._data;
            return null != o && (s._data = o), s
        }

        function up(n, t, e, r, i = "", s = 0, o) {
            return {element: n, triggerName: t, fromState: e, toState: r, phaseName: i, totalTime: s, disabled: !!o}
        }

        function Bt(n, t, e) {
            let r = n.get(t);
            return r || n.set(t, r = e), r
        }

        function mE(n) {
            const t = n.indexOf(":");
            return [n.substring(1, t), n.slice(t + 1)]
        }

        let dp = (n, t) => !1, _E = (n, t, e) => [], yE = null;

        function hp(n) {
            const t = n.parentNode || n.host;
            return t === yE ? null : t
        }

        (ap() || typeof Element < "u") && (n2() ? (yE = (() => document.documentElement)(), dp = (n, t) => {
            for (; t;) {
                if (t === n) return !0;
                t = hp(t)
            }
            return !1
        }) : dp = (n, t) => n.contains(t), _E = (n, t, e) => {
            if (e) return Array.from(n.querySelectorAll(t));
            const r = n.querySelector(t);
            return r ? [r] : []
        });
        let Xr = null, vE = !1;
        const bE = dp, DE = _E;
        let wE = (() => {
            class n {
                validateStyleProperty(e) {
                    return function s2(n) {
                        Xr || (Xr = function o2() {
                            return typeof document < "u" ? document.body : null
                        }() || {}, vE = !!Xr.style && "WebkitAppearance" in Xr.style);
                        let t = !0;
                        return Xr.style && !function r2(n) {
                            return "ebkit" == n.substring(1, 6)
                        }(n) && (t = n in Xr.style, !t && vE && (t = "Webkit" + n.charAt(0).toUpperCase() + n.slice(1) in Xr.style)), t
                    }(e)
                }

                matchesElement(e, r) {
                    return !1
                }

                containsElement(e, r) {
                    return bE(e, r)
                }

                getParentElement(e) {
                    return hp(e)
                }

                query(e, r, i) {
                    return DE(e, r, i)
                }

                computeStyle(e, r, i) {
                    return i || ""
                }

                animate(e, r, i, s, o, a = [], l) {
                    return new Fo(i, s)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })(), fp = (() => {
            class n {
            }

            return n.NOOP = new wE, n
        })();
        const pp = "ng-enter", ac = "ng-leave", lc = "ng-trigger", cc = ".ng-trigger", EE = "ng-animating",
            gp = ".ng-animating";

        function Sr(n) {
            if ("number" == typeof n) return n;
            const t = n.match(/^(-?[\.\d]+)(m?s)/);
            return !t || t.length < 2 ? 0 : mp(parseFloat(t[1]), t[2])
        }

        function mp(n, t) {
            return "s" === t ? 1e3 * n : n
        }

        function uc(n, t, e) {
            return n.hasOwnProperty("duration") ? n : function c2(n, t, e) {
                let i, s = 0, o = "";
                if ("string" == typeof n) {
                    const a = n.match(/^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i);
                    if (null === a) return t.push(pE()), {duration: 0, delay: 0, easing: ""};
                    i = mp(parseFloat(a[1]), a[2]);
                    const l = a[3];
                    null != l && (s = mp(parseFloat(l), a[4]));
                    const c = a[5];
                    c && (o = c)
                } else i = n;
                if (!e) {
                    let a = !1, l = t.length;
                    i < 0 && (t.push(function wj() {
                        return new D(3100, !1)
                    }()), a = !0), s < 0 && (t.push(function Cj() {
                        return new D(3101, !1)
                    }()), a = !0), a && t.splice(l, 0, pE())
                }
                return {duration: i, delay: s, easing: o}
            }(n, t, e)
        }

        function Vo(n, t = {}) {
            return Object.keys(n).forEach(e => {
                t[e] = n[e]
            }), t
        }

        function ME(n) {
            const t = new Map;
            return Object.keys(n).forEach(e => {
                t.set(e, n[e])
            }), t
        }

        function Tr(n, t = new Map, e) {
            if (e) for (let [r, i] of e) t.set(r, i);
            for (let [r, i] of n) t.set(r, i);
            return t
        }

        function TE(n, t, e) {
            return e ? t + ":" + e + ";" : ""
        }

        function IE(n) {
            let t = "";
            for (let e = 0; e < n.style.length; e++) {
                const r = n.style.item(e);
                t += TE(0, r, n.style.getPropertyValue(r))
            }
            for (const e in n.style) n.style.hasOwnProperty(e) && !e.startsWith("_") && (t += TE(0, f2(e), n.style[e]));
            n.setAttribute("style", t)
        }

        function Pn(n, t, e) {
            n.style && (t.forEach((r, i) => {
                const s = yp(i);
                e && !e.has(i) && e.set(i, n.style[s]), n.style[s] = r
            }), ap() && IE(n))
        }

        function ei(n, t) {
            n.style && (t.forEach((e, r) => {
                const i = yp(r);
                n.style[i] = ""
            }), ap() && IE(n))
        }

        function jo(n) {
            return Array.isArray(n) ? 1 == n.length ? n[0] : UC(n) : n
        }

        const _p = new RegExp("{{\\s*(.+?)\\s*}}", "g");

        function AE(n) {
            let t = [];
            if ("string" == typeof n) {
                let e;
                for (; e = _p.exec(n);) t.push(e[1]);
                _p.lastIndex = 0
            }
            return t
        }

        function dc(n, t, e) {
            const r = n.toString(), i = r.replace(_p, (s, o) => {
                let a = t[o];
                return null == a && (e.push(function Mj(n) {
                    return new D(3003, !1)
                }()), a = ""), a.toString()
            });
            return i == r ? n : i
        }

        function hc(n) {
            const t = [];
            let e = n.next();
            for (; !e.done;) t.push(e.value), e = n.next();
            return t
        }

        const h2 = /-+([a-z0-9])/g;

        function yp(n) {
            return n.replace(h2, (...t) => t[1].toUpperCase())
        }

        function f2(n) {
            return n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
        }

        function Vt(n, t, e) {
            switch (t.type) {
                case 7:
                    return n.visitTrigger(t, e);
                case 0:
                    return n.visitState(t, e);
                case 1:
                    return n.visitTransition(t, e);
                case 2:
                    return n.visitSequence(t, e);
                case 3:
                    return n.visitGroup(t, e);
                case 4:
                    return n.visitAnimate(t, e);
                case 5:
                    return n.visitKeyframes(t, e);
                case 6:
                    return n.visitStyle(t, e);
                case 8:
                    return n.visitReference(t, e);
                case 9:
                    return n.visitAnimateChild(t, e);
                case 10:
                    return n.visitAnimateRef(t, e);
                case 11:
                    return n.visitQuery(t, e);
                case 12:
                    return n.visitStagger(t, e);
                default:
                    throw function Sj(n) {
                        return new D(3004, !1)
                    }()
            }
        }

        function RE(n, t) {
            return window.getComputedStyle(n)[t]
        }

        function v2(n, t) {
            const e = [];
            return "string" == typeof n ? n.split(/\s*,\s*/).forEach(r => function b2(n, t, e) {
                if (":" == n[0]) {
                    const l = function D2(n, t) {
                        switch (n) {
                            case":enter":
                                return "void => *";
                            case":leave":
                                return "* => void";
                            case":increment":
                                return (e, r) => parseFloat(r) > parseFloat(e);
                            case":decrement":
                                return (e, r) => parseFloat(r) < parseFloat(e);
                            default:
                                return t.push(function jj(n) {
                                    return new D(3016, !1)
                                }()), "* => *"
                        }
                    }(n, e);
                    if ("function" == typeof l) return void t.push(l);
                    n = l
                }
                const r = n.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                if (null == r || r.length < 4) return e.push(function Vj(n) {
                    return new D(3015, !1)
                }()), t;
                const i = r[1], s = r[2], o = r[3];
                t.push(xE(i, o));
                "<" == s[0] && !("*" == i && "*" == o) && t.push(xE(o, i))
            }(r, e, t)) : e.push(n), e
        }

        const mc = new Set(["true", "1"]), _c = new Set(["false", "0"]);

        function xE(n, t) {
            const e = mc.has(n) || _c.has(n), r = mc.has(t) || _c.has(t);
            return (i, s) => {
                let o = "*" == n || n == i, a = "*" == t || t == s;
                return !o && e && "boolean" == typeof i && (o = i ? mc.has(n) : _c.has(n)), !a && r && "boolean" == typeof s && (a = s ? mc.has(t) : _c.has(t)), o && a
            }
        }

        const w2 = new RegExp("s*:selfs*,?", "g");

        function vp(n, t, e, r) {
            return new C2(n).build(t, e, r)
        }

        class C2 {
            constructor(t) {
                this._driver = t
            }

            build(t, e, r) {
                const i = new S2(e);
                return this._resetContextStyleTimingState(i), Vt(this, jo(t), i)
            }

            _resetContextStyleTimingState(t) {
                t.currentQuerySelector = "", t.collectedStyles = new Map, t.collectedStyles.set("", new Map), t.currentTime = 0
            }

            visitTrigger(t, e) {
                let r = e.queryCount = 0, i = e.depCount = 0;
                const s = [], o = [];
                return "@" == t.name.charAt(0) && e.errors.push(function Ij() {
                    return new D(3006, !1)
                }()), t.definitions.forEach(a => {
                    if (this._resetContextStyleTimingState(e), 0 == a.type) {
                        const l = a, c = l.name;
                        c.toString().split(/\s*,\s*/).forEach(u => {
                            l.name = u, s.push(this.visitState(l, e))
                        }), l.name = c
                    } else if (1 == a.type) {
                        const l = this.visitTransition(a, e);
                        r += l.queryCount, i += l.depCount, o.push(l)
                    } else e.errors.push(function Aj() {
                        return new D(3007, !1)
                    }())
                }), {type: 7, name: t.name, states: s, transitions: o, queryCount: r, depCount: i, options: null}
            }

            visitState(t, e) {
                const r = this.visitStyle(t.styles, e), i = t.options && t.options.params || null;
                if (r.containsDynamicStyles) {
                    const s = new Set, o = i || {};
                    r.styles.forEach(a => {
                        a instanceof Map && a.forEach(l => {
                            AE(l).forEach(c => {
                                o.hasOwnProperty(c) || s.add(c)
                            })
                        })
                    }), s.size && (hc(s.values()), e.errors.push(function Rj(n, t) {
                        return new D(3008, !1)
                    }()))
                }
                return {type: 0, name: t.name, style: r, options: i ? {params: i} : null}
            }

            visitTransition(t, e) {
                e.queryCount = 0, e.depCount = 0;
                const r = Vt(this, jo(t.animation), e);
                return {
                    type: 1,
                    matchers: v2(t.expr, e.errors),
                    animation: r,
                    queryCount: e.queryCount,
                    depCount: e.depCount,
                    options: ti(t.options)
                }
            }

            visitSequence(t, e) {
                return {type: 2, steps: t.steps.map(r => Vt(this, r, e)), options: ti(t.options)}
            }

            visitGroup(t, e) {
                const r = e.currentTime;
                let i = 0;
                const s = t.steps.map(o => {
                    e.currentTime = r;
                    const a = Vt(this, o, e);
                    return i = Math.max(i, e.currentTime), a
                });
                return e.currentTime = i, {type: 3, steps: s, options: ti(t.options)}
            }

            visitAnimate(t, e) {
                const r = function I2(n, t) {
                    if (n.hasOwnProperty("duration")) return n;
                    if ("number" == typeof n) return bp(uc(n, t).duration, 0, "");
                    const e = n;
                    if (e.split(/\s+/).some(s => "{" == s.charAt(0) && "{" == s.charAt(1))) {
                        const s = bp(0, 0, "");
                        return s.dynamic = !0, s.strValue = e, s
                    }
                    const i = uc(e, t);
                    return bp(i.duration, i.delay, i.easing)
                }(t.timings, e.errors);
                e.currentAnimateTimings = r;
                let i, s = t.styles ? t.styles : Jr({});
                if (5 == s.type) i = this.visitKeyframes(s, e); else {
                    let o = t.styles, a = !1;
                    if (!o) {
                        a = !0;
                        const c = {};
                        r.easing && (c.easing = r.easing), o = Jr(c)
                    }
                    e.currentTime += r.duration + r.delay;
                    const l = this.visitStyle(o, e);
                    l.isEmptyStep = a, i = l
                }
                return e.currentAnimateTimings = null, {type: 4, timings: r, style: i, options: null}
            }

            visitStyle(t, e) {
                const r = this._makeStyleAst(t, e);
                return this._validateStyleAst(r, e), r
            }

            _makeStyleAst(t, e) {
                const r = [], i = Array.isArray(t.styles) ? t.styles : [t.styles];
                for (let a of i) "string" == typeof a ? a === Xn ? r.push(a) : e.errors.push(new D(3002, !1)) : r.push(ME(a));
                let s = !1, o = null;
                return r.forEach(a => {
                    if (a instanceof Map && (a.has("easing") && (o = a.get("easing"), a.delete("easing")), !s)) for (let l of a.values()) if (l.toString().indexOf("{{") >= 0) {
                        s = !0;
                        break
                    }
                }), {type: 6, styles: r, easing: o, offset: t.offset, containsDynamicStyles: s, options: null}
            }

            _validateStyleAst(t, e) {
                const r = e.currentAnimateTimings;
                let i = e.currentTime, s = e.currentTime;
                r && s > 0 && (s -= r.duration + r.delay), t.styles.forEach(o => {
                    "string" != typeof o && o.forEach((a, l) => {
                        const c = e.collectedStyles.get(e.currentQuerySelector), u = c.get(l);
                        let d = !0;
                        u && (s != i && s >= u.startTime && i <= u.endTime && (e.errors.push(function kj(n, t, e, r, i) {
                            return new D(3010, !1)
                        }()), d = !1), s = u.startTime), d && c.set(l, {
                            startTime: s,
                            endTime: i
                        }), e.options && function d2(n, t, e) {
                            const r = t.params || {}, i = AE(n);
                            i.length && i.forEach(s => {
                                r.hasOwnProperty(s) || e.push(function Ej(n) {
                                    return new D(3001, !1)
                                }())
                            })
                        }(a, e.options, e.errors)
                    })
                })
            }

            visitKeyframes(t, e) {
                const r = {type: 5, styles: [], options: null};
                if (!e.currentAnimateTimings) return e.errors.push(function Pj() {
                    return new D(3011, !1)
                }()), r;
                let s = 0;
                const o = [];
                let a = !1, l = !1, c = 0;
                const u = t.steps.map(y => {
                    const C = this._makeStyleAst(y, e);
                    let v = null != C.offset ? C.offset : function T2(n) {
                        if ("string" == typeof n) return null;
                        let t = null;
                        if (Array.isArray(n)) n.forEach(e => {
                            if (e instanceof Map && e.has("offset")) {
                                const r = e;
                                t = parseFloat(r.get("offset")), r.delete("offset")
                            }
                        }); else if (n instanceof Map && n.has("offset")) {
                            const e = n;
                            t = parseFloat(e.get("offset")), e.delete("offset")
                        }
                        return t
                    }(C.styles), E = 0;
                    return null != v && (s++, E = C.offset = v), l = l || E < 0 || E > 1, a = a || E < c, c = E, o.push(E), C
                });
                l && e.errors.push(function Fj() {
                    return new D(3012, !1)
                }()), a && e.errors.push(function Nj() {
                    return new D(3200, !1)
                }());
                const d = t.steps.length;
                let h = 0;
                s > 0 && s < d ? e.errors.push(function Oj() {
                    return new D(3202, !1)
                }()) : 0 == s && (h = 1 / (d - 1));
                const f = d - 1, p = e.currentTime, g = e.currentAnimateTimings, _ = g.duration;
                return u.forEach((y, C) => {
                    const v = h > 0 ? C == f ? 1 : h * C : o[C], E = v * _;
                    e.currentTime = p + g.delay + E, g.duration = E, this._validateStyleAst(y, e), y.offset = v, r.styles.push(y)
                }), r
            }

            visitReference(t, e) {
                return {type: 8, animation: Vt(this, jo(t.animation), e), options: ti(t.options)}
            }

            visitAnimateChild(t, e) {
                return e.depCount++, {type: 9, options: ti(t.options)}
            }

            visitAnimateRef(t, e) {
                return {type: 10, animation: this.visitReference(t.animation, e), options: ti(t.options)}
            }

            visitQuery(t, e) {
                const r = e.currentQuerySelector, i = t.options || {};
                e.queryCount++, e.currentQuery = t;
                const [s, o] = function E2(n) {
                    const t = !!n.split(/\s*,\s*/).find(e => ":self" == e);
                    return t && (n = n.replace(w2, "")), n = n.replace(/@\*/g, cc).replace(/@\w+/g, e => cc + "-" + e.slice(1)).replace(/:animating/g, gp), [n, t]
                }(t.selector);
                e.currentQuerySelector = r.length ? r + " " + s : s, Bt(e.collectedStyles, e.currentQuerySelector, new Map);
                const a = Vt(this, jo(t.animation), e);
                return e.currentQuery = null, e.currentQuerySelector = r, {
                    type: 11,
                    selector: s,
                    limit: i.limit || 0,
                    optional: !!i.optional,
                    includeSelf: o,
                    animation: a,
                    originalSelector: t.selector,
                    options: ti(t.options)
                }
            }

            visitStagger(t, e) {
                e.currentQuery || e.errors.push(function Lj() {
                    return new D(3013, !1)
                }());
                const r = "full" === t.timings ? {duration: 0, delay: 0, easing: "full"} : uc(t.timings, e.errors, !0);
                return {type: 12, animation: Vt(this, jo(t.animation), e), timings: r, options: null}
            }
        }

        class S2 {
            constructor(t) {
                this.errors = t, this.queryCount = 0, this.depCount = 0, this.currentTransition = null, this.currentQuery = null, this.currentQuerySelector = null, this.currentAnimateTimings = null, this.currentTime = 0, this.collectedStyles = new Map, this.options = null, this.unsupportedCSSPropertiesFound = new Set
            }
        }

        function ti(n) {
            return n ? (n = Vo(n)).params && (n.params = function M2(n) {
                return n ? Vo(n) : null
            }(n.params)) : n = {}, n
        }

        function bp(n, t, e) {
            return {duration: n, delay: t, easing: e}
        }

        function Dp(n, t, e, r, i, s, o = null, a = !1) {
            return {
                type: 1,
                element: n,
                keyframes: t,
                preStyleProps: e,
                postStyleProps: r,
                duration: i,
                delay: s,
                totalTime: i + s,
                easing: o,
                subTimeline: a
            }
        }

        class yc {
            constructor() {
                this._map = new Map
            }

            get(t) {
                return this._map.get(t) || []
            }

            append(t, e) {
                let r = this._map.get(t);
                r || this._map.set(t, r = []), r.push(...e)
            }

            has(t) {
                return this._map.has(t)
            }

            clear() {
                this._map.clear()
            }
        }

        const x2 = new RegExp(":enter", "g"), P2 = new RegExp(":leave", "g");

        function wp(n, t, e, r, i, s = new Map, o = new Map, a, l, c = []) {
            return (new F2).buildKeyframes(n, t, e, r, i, s, o, a, l, c)
        }

        class F2 {
            buildKeyframes(t, e, r, i, s, o, a, l, c, u = []) {
                c = c || new yc;
                const d = new Cp(t, e, c, i, s, u, []);
                d.options = l;
                const h = l.delay ? Sr(l.delay) : 0;
                d.currentTimeline.delayNextStep(h), d.currentTimeline.setStyles([o], null, d.errors, l), Vt(this, r, d);
                const f = d.timelines.filter(p => p.containsAnimation());
                if (f.length && a.size) {
                    let p;
                    for (let g = f.length - 1; g >= 0; g--) {
                        const _ = f[g];
                        if (_.element === e) {
                            p = _;
                            break
                        }
                    }
                    p && !p.allowOnlyTimelineStyles() && p.setStyles([a], null, d.errors, l)
                }
                return f.length ? f.map(p => p.buildKeyframes()) : [Dp(e, [], [], [], 0, h, "", !1)]
            }

            visitTrigger(t, e) {
            }

            visitState(t, e) {
            }

            visitTransition(t, e) {
            }

            visitAnimateChild(t, e) {
                const r = e.subInstructions.get(e.element);
                if (r) {
                    const i = e.createSubContext(t.options), s = e.currentTimeline.currentTime,
                        o = this._visitSubInstructions(r, i, i.options);
                    s != o && e.transformIntoNewTimeline(o)
                }
                e.previousNode = t
            }

            visitAnimateRef(t, e) {
                const r = e.createSubContext(t.options);
                r.transformIntoNewTimeline(), this.visitReference(t.animation, r), e.transformIntoNewTimeline(r.currentTimeline.currentTime), e.previousNode = t
            }

            _visitSubInstructions(t, e, r) {
                let s = e.currentTimeline.currentTime;
                const o = null != r.duration ? Sr(r.duration) : null, a = null != r.delay ? Sr(r.delay) : null;
                return 0 !== o && t.forEach(l => {
                    const c = e.appendInstructionToTimeline(l, o, a);
                    s = Math.max(s, c.duration + c.delay)
                }), s
            }

            visitReference(t, e) {
                e.updateOptions(t.options, !0), Vt(this, t.animation, e), e.previousNode = t
            }

            visitSequence(t, e) {
                const r = e.subContextCount;
                let i = e;
                const s = t.options;
                if (s && (s.params || s.delay) && (i = e.createSubContext(s), i.transformIntoNewTimeline(), null != s.delay)) {
                    6 == i.previousNode.type && (i.currentTimeline.snapshotCurrentStyles(), i.previousNode = vc);
                    const o = Sr(s.delay);
                    i.delayNextStep(o)
                }
                t.steps.length && (t.steps.forEach(o => Vt(this, o, i)), i.currentTimeline.applyStylesToKeyframe(), i.subContextCount > r && i.transformIntoNewTimeline()), e.previousNode = t
            }

            visitGroup(t, e) {
                const r = [];
                let i = e.currentTimeline.currentTime;
                const s = t.options && t.options.delay ? Sr(t.options.delay) : 0;
                t.steps.forEach(o => {
                    const a = e.createSubContext(t.options);
                    s && a.delayNextStep(s), Vt(this, o, a), i = Math.max(i, a.currentTimeline.currentTime), r.push(a.currentTimeline)
                }), r.forEach(o => e.currentTimeline.mergeTimelineCollectedStyles(o)), e.transformIntoNewTimeline(i), e.previousNode = t
            }

            _visitTiming(t, e) {
                if (t.dynamic) {
                    const r = t.strValue;
                    return uc(e.params ? dc(r, e.params, e.errors) : r, e.errors)
                }
                return {duration: t.duration, delay: t.delay, easing: t.easing}
            }

            visitAnimate(t, e) {
                const r = e.currentAnimateTimings = this._visitTiming(t.timings, e), i = e.currentTimeline;
                r.delay && (e.incrementTime(r.delay), i.snapshotCurrentStyles());
                const s = t.style;
                5 == s.type ? this.visitKeyframes(s, e) : (e.incrementTime(r.duration), this.visitStyle(s, e), i.applyStylesToKeyframe()), e.currentAnimateTimings = null, e.previousNode = t
            }

            visitStyle(t, e) {
                const r = e.currentTimeline, i = e.currentAnimateTimings;
                !i && r.hasCurrentStyleProperties() && r.forwardFrame();
                const s = i && i.easing || t.easing;
                t.isEmptyStep ? r.applyEmptyStep(s) : r.setStyles(t.styles, s, e.errors, e.options), e.previousNode = t
            }

            visitKeyframes(t, e) {
                const r = e.currentAnimateTimings, i = e.currentTimeline.duration, s = r.duration,
                    a = e.createSubContext().currentTimeline;
                a.easing = r.easing, t.styles.forEach(l => {
                    a.forwardTime((l.offset || 0) * s), a.setStyles(l.styles, l.easing, e.errors, e.options), a.applyStylesToKeyframe()
                }), e.currentTimeline.mergeTimelineCollectedStyles(a), e.transformIntoNewTimeline(i + s), e.previousNode = t
            }

            visitQuery(t, e) {
                const r = e.currentTimeline.currentTime, i = t.options || {}, s = i.delay ? Sr(i.delay) : 0;
                s && (6 === e.previousNode.type || 0 == r && e.currentTimeline.hasCurrentStyleProperties()) && (e.currentTimeline.snapshotCurrentStyles(), e.previousNode = vc);
                let o = r;
                const a = e.invokeQuery(t.selector, t.originalSelector, t.limit, t.includeSelf, !!i.optional, e.errors);
                e.currentQueryTotal = a.length;
                let l = null;
                a.forEach((c, u) => {
                    e.currentQueryIndex = u;
                    const d = e.createSubContext(t.options, c);
                    s && d.delayNextStep(s), c === e.element && (l = d.currentTimeline), Vt(this, t.animation, d), d.currentTimeline.applyStylesToKeyframe(), o = Math.max(o, d.currentTimeline.currentTime)
                }), e.currentQueryIndex = 0, e.currentQueryTotal = 0, e.transformIntoNewTimeline(o), l && (e.currentTimeline.mergeTimelineCollectedStyles(l), e.currentTimeline.snapshotCurrentStyles()), e.previousNode = t
            }

            visitStagger(t, e) {
                const r = e.parentContext, i = e.currentTimeline, s = t.timings, o = Math.abs(s.duration),
                    a = o * (e.currentQueryTotal - 1);
                let l = o * e.currentQueryIndex;
                switch (s.duration < 0 ? "reverse" : s.easing) {
                    case"reverse":
                        l = a - l;
                        break;
                    case"full":
                        l = r.currentStaggerTime
                }
                const u = e.currentTimeline;
                l && u.delayNextStep(l);
                const d = u.currentTime;
                Vt(this, t.animation, e), e.previousNode = t, r.currentStaggerTime = i.currentTime - d + (i.startTime - r.currentTimeline.startTime)
            }
        }

        const vc = {};

        class Cp {
            constructor(t, e, r, i, s, o, a, l) {
                this._driver = t, this.element = e, this.subInstructions = r, this._enterClassName = i, this._leaveClassName = s, this.errors = o, this.timelines = a, this.parentContext = null, this.currentAnimateTimings = null, this.previousNode = vc, this.subContextCount = 0, this.options = {}, this.currentQueryIndex = 0, this.currentQueryTotal = 0, this.currentStaggerTime = 0, this.currentTimeline = l || new bc(this._driver, e, 0), a.push(this.currentTimeline)
            }

            get params() {
                return this.options.params
            }

            updateOptions(t, e) {
                if (!t) return;
                const r = t;
                let i = this.options;
                null != r.duration && (i.duration = Sr(r.duration)), null != r.delay && (i.delay = Sr(r.delay));
                const s = r.params;
                if (s) {
                    let o = i.params;
                    o || (o = this.options.params = {}), Object.keys(s).forEach(a => {
                        (!e || !o.hasOwnProperty(a)) && (o[a] = dc(s[a], o, this.errors))
                    })
                }
            }

            _copyOptions() {
                const t = {};
                if (this.options) {
                    const e = this.options.params;
                    if (e) {
                        const r = t.params = {};
                        Object.keys(e).forEach(i => {
                            r[i] = e[i]
                        })
                    }
                }
                return t
            }

            createSubContext(t = null, e, r) {
                const i = e || this.element,
                    s = new Cp(this._driver, i, this.subInstructions, this._enterClassName, this._leaveClassName, this.errors, this.timelines, this.currentTimeline.fork(i, r || 0));
                return s.previousNode = this.previousNode, s.currentAnimateTimings = this.currentAnimateTimings, s.options = this._copyOptions(), s.updateOptions(t), s.currentQueryIndex = this.currentQueryIndex, s.currentQueryTotal = this.currentQueryTotal, s.parentContext = this, this.subContextCount++, s
            }

            transformIntoNewTimeline(t) {
                return this.previousNode = vc, this.currentTimeline = this.currentTimeline.fork(this.element, t), this.timelines.push(this.currentTimeline), this.currentTimeline
            }

            appendInstructionToTimeline(t, e, r) {
                const i = {
                        duration: e ?? t.duration,
                        delay: this.currentTimeline.currentTime + (r ?? 0) + t.delay,
                        easing: ""
                    },
                    s = new N2(this._driver, t.element, t.keyframes, t.preStyleProps, t.postStyleProps, i, t.stretchStartingKeyframe);
                return this.timelines.push(s), i
            }

            incrementTime(t) {
                this.currentTimeline.forwardTime(this.currentTimeline.duration + t)
            }

            delayNextStep(t) {
                t > 0 && this.currentTimeline.delayNextStep(t)
            }

            invokeQuery(t, e, r, i, s, o) {
                let a = [];
                if (i && a.push(this.element), t.length > 0) {
                    t = (t = t.replace(x2, "." + this._enterClassName)).replace(P2, "." + this._leaveClassName);
                    let c = this._driver.query(this.element, t, 1 != r);
                    0 !== r && (c = r < 0 ? c.slice(c.length + r, c.length) : c.slice(0, r)), a.push(...c)
                }
                return !s && 0 == a.length && o.push(function Bj(n) {
                    return new D(3014, !1)
                }()), a
            }
        }

        class bc {
            constructor(t, e, r, i) {
                this._driver = t, this.element = e, this.startTime = r, this._elementTimelineStylesLookup = i, this.duration = 0, this._previousKeyframe = new Map, this._currentKeyframe = new Map, this._keyframes = new Map, this._styleSummary = new Map, this._localTimelineStyles = new Map, this._pendingStyles = new Map, this._backFill = new Map, this._currentEmptyStepKeyframe = null, this._elementTimelineStylesLookup || (this._elementTimelineStylesLookup = new Map), this._globalTimelineStyles = this._elementTimelineStylesLookup.get(e), this._globalTimelineStyles || (this._globalTimelineStyles = this._localTimelineStyles, this._elementTimelineStylesLookup.set(e, this._localTimelineStyles)), this._loadKeyframe()
            }

            containsAnimation() {
                switch (this._keyframes.size) {
                    case 0:
                        return !1;
                    case 1:
                        return this.hasCurrentStyleProperties();
                    default:
                        return !0
                }
            }

            hasCurrentStyleProperties() {
                return this._currentKeyframe.size > 0
            }

            get currentTime() {
                return this.startTime + this.duration
            }

            delayNextStep(t) {
                const e = 1 === this._keyframes.size && this._pendingStyles.size;
                this.duration || e ? (this.forwardTime(this.currentTime + t), e && this.snapshotCurrentStyles()) : this.startTime += t
            }

            fork(t, e) {
                return this.applyStylesToKeyframe(), new bc(this._driver, t, e || this.currentTime, this._elementTimelineStylesLookup)
            }

            _loadKeyframe() {
                this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe), this._currentKeyframe = this._keyframes.get(this.duration), this._currentKeyframe || (this._currentKeyframe = new Map, this._keyframes.set(this.duration, this._currentKeyframe))
            }

            forwardFrame() {
                this.duration += 1, this._loadKeyframe()
            }

            forwardTime(t) {
                this.applyStylesToKeyframe(), this.duration = t, this._loadKeyframe()
            }

            _updateStyle(t, e) {
                this._localTimelineStyles.set(t, e), this._globalTimelineStyles.set(t, e), this._styleSummary.set(t, {
                    time: this.currentTime,
                    value: e
                })
            }

            allowOnlyTimelineStyles() {
                return this._currentEmptyStepKeyframe !== this._currentKeyframe
            }

            applyEmptyStep(t) {
                t && this._previousKeyframe.set("easing", t);
                for (let [e, r] of this._globalTimelineStyles) this._backFill.set(e, r || Xn), this._currentKeyframe.set(e, Xn);
                this._currentEmptyStepKeyframe = this._currentKeyframe
            }

            setStyles(t, e, r, i) {
                e && this._previousKeyframe.set("easing", e);
                const s = i && i.params || {}, o = function O2(n, t) {
                    const e = new Map;
                    let r;
                    return n.forEach(i => {
                        if ("*" === i) {
                            r = r || t.keys();
                            for (let s of r) e.set(s, Xn)
                        } else Tr(i, e)
                    }), e
                }(t, this._globalTimelineStyles);
                for (let [a, l] of o) {
                    const c = dc(l, s, r);
                    this._pendingStyles.set(a, c), this._localTimelineStyles.has(a) || this._backFill.set(a, this._globalTimelineStyles.get(a) ?? Xn), this._updateStyle(a, c)
                }
            }

            applyStylesToKeyframe() {
                0 != this._pendingStyles.size && (this._pendingStyles.forEach((t, e) => {
                    this._currentKeyframe.set(e, t)
                }), this._pendingStyles.clear(), this._localTimelineStyles.forEach((t, e) => {
                    this._currentKeyframe.has(e) || this._currentKeyframe.set(e, t)
                }))
            }

            snapshotCurrentStyles() {
                for (let [t, e] of this._localTimelineStyles) this._pendingStyles.set(t, e), this._updateStyle(t, e)
            }

            getFinalKeyframe() {
                return this._keyframes.get(this.duration)
            }

            get properties() {
                const t = [];
                for (let e in this._currentKeyframe) t.push(e);
                return t
            }

            mergeTimelineCollectedStyles(t) {
                t._styleSummary.forEach((e, r) => {
                    const i = this._styleSummary.get(r);
                    (!i || e.time > i.time) && this._updateStyle(r, e.value)
                })
            }

            buildKeyframes() {
                this.applyStylesToKeyframe();
                const t = new Set, e = new Set, r = 1 === this._keyframes.size && 0 === this.duration;
                let i = [];
                this._keyframes.forEach((a, l) => {
                    const c = Tr(a, new Map, this._backFill);
                    c.forEach((u, d) => {
                        "!" === u ? t.add(d) : u === Xn && e.add(d)
                    }), r || c.set("offset", l / this.duration), i.push(c)
                });
                const s = t.size ? hc(t.values()) : [], o = e.size ? hc(e.values()) : [];
                if (r) {
                    const a = i[0], l = new Map(a);
                    a.set("offset", 0), l.set("offset", 1), i = [a, l]
                }
                return Dp(this.element, i, s, o, this.duration, this.startTime, this.easing, !1)
            }
        }

        class N2 extends bc {
            constructor(t, e, r, i, s, o, a = !1) {
                super(t, e, o.delay), this.keyframes = r, this.preStyleProps = i, this.postStyleProps = s, this._stretchStartingKeyframe = a, this.timings = {
                    duration: o.duration,
                    delay: o.delay,
                    easing: o.easing
                }
            }

            containsAnimation() {
                return this.keyframes.length > 1
            }

            buildKeyframes() {
                let t = this.keyframes, {delay: e, duration: r, easing: i} = this.timings;
                if (this._stretchStartingKeyframe && e) {
                    const s = [], o = r + e, a = e / o, l = Tr(t[0]);
                    l.set("offset", 0), s.push(l);
                    const c = Tr(t[0]);
                    c.set("offset", FE(a)), s.push(c);
                    const u = t.length - 1;
                    for (let d = 1; d <= u; d++) {
                        let h = Tr(t[d]);
                        const f = h.get("offset");
                        h.set("offset", FE((e + f * r) / o)), s.push(h)
                    }
                    r = o, e = 0, i = "", t = s
                }
                return Dp(this.element, t, this.preStyleProps, this.postStyleProps, r, e, i, !0)
            }
        }

        function FE(n, t = 3) {
            const e = Math.pow(10, t - 1);
            return Math.round(n * e) / e
        }

        class Ep {
        }

        const L2 = new Set(["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight", "left", "top", "bottom", "right", "fontSize", "outlineWidth", "outlineOffset", "paddingTop", "paddingLeft", "paddingBottom", "paddingRight", "marginTop", "marginLeft", "marginBottom", "marginRight", "borderRadius", "borderWidth", "borderTopWidth", "borderLeftWidth", "borderRightWidth", "borderBottomWidth", "textIndent", "perspective"]);

        class B2 extends Ep {
            normalizePropertyName(t, e) {
                return yp(t)
            }

            normalizeStyleValue(t, e, r, i) {
                let s = "";
                const o = r.toString().trim();
                if (L2.has(e) && 0 !== r && "0" !== r) if ("number" == typeof r) s = "px"; else {
                    const a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
                    a && 0 == a[1].length && i.push(function Tj(n, t) {
                        return new D(3005, !1)
                    }())
                }
                return o + s
            }
        }

        function NE(n, t, e, r, i, s, o, a, l, c, u, d, h) {
            return {
                type: 0,
                element: n,
                triggerName: t,
                isRemovalTransition: i,
                fromState: e,
                fromStyles: s,
                toState: r,
                toStyles: o,
                timelines: a,
                queriedElements: l,
                preStyleProps: c,
                postStyleProps: u,
                totalTime: d,
                errors: h
            }
        }

        const Mp = {};

        class OE {
            constructor(t, e, r) {
                this._triggerName = t, this.ast = e, this._stateStyles = r
            }

            match(t, e, r, i) {
                return function V2(n, t, e, r, i) {
                    return n.some(s => s(t, e, r, i))
                }(this.ast.matchers, t, e, r, i)
            }

            buildStyles(t, e, r) {
                let i = this._stateStyles.get("*");
                return void 0 !== t && (i = this._stateStyles.get(t?.toString()) || i), i ? i.buildStyles(e, r) : new Map
            }

            build(t, e, r, i, s, o, a, l, c, u) {
                const d = [], h = this.ast.options && this.ast.options.params || Mp,
                    p = this.buildStyles(r, a && a.params || Mp, d), g = l && l.params || Mp,
                    _ = this.buildStyles(i, g, d), y = new Set, C = new Map, v = new Map, E = "void" === i,
                    B = {params: j2(g, h), delay: this.ast.options?.delay},
                    Y = u ? [] : wp(t, e, this.ast.animation, s, o, p, _, B, c, d);
                let Te = 0;
                if (Y.forEach(Ht => {
                    Te = Math.max(Ht.duration + Ht.delay, Te)
                }), d.length) return NE(e, this._triggerName, r, i, E, p, _, [], [], C, v, Te, d);
                Y.forEach(Ht => {
                    const Ut = Ht.element, gs = Bt(C, Ut, new Set);
                    Ht.preStyleProps.forEach(bn => gs.add(bn));
                    const nr = Bt(v, Ut, new Set);
                    Ht.postStyleProps.forEach(bn => nr.add(bn)), Ut !== e && y.add(Ut)
                });
                const jt = hc(y.values());
                return NE(e, this._triggerName, r, i, E, p, _, Y, jt, C, v, Te)
            }
        }

        function j2(n, t) {
            const e = Vo(t);
            for (const r in n) n.hasOwnProperty(r) && null != n[r] && (e[r] = n[r]);
            return e
        }

        class H2 {
            constructor(t, e, r) {
                this.styles = t, this.defaultParams = e, this.normalizer = r
            }

            buildStyles(t, e) {
                const r = new Map, i = Vo(this.defaultParams);
                return Object.keys(t).forEach(s => {
                    const o = t[s];
                    null !== o && (i[s] = o)
                }), this.styles.styles.forEach(s => {
                    "string" != typeof s && s.forEach((o, a) => {
                        o && (o = dc(o, i, e));
                        const l = this.normalizer.normalizePropertyName(a, e);
                        o = this.normalizer.normalizeStyleValue(a, l, o, e), r.set(l, o)
                    })
                }), r
            }
        }

        class $2 {
            constructor(t, e, r) {
                this.name = t, this.ast = e, this._normalizer = r, this.transitionFactories = [], this.states = new Map, e.states.forEach(i => {
                    this.states.set(i.name, new H2(i.style, i.options && i.options.params || {}, r))
                }), LE(this.states, "true", "1"), LE(this.states, "false", "0"), e.transitions.forEach(i => {
                    this.transitionFactories.push(new OE(t, i, this.states))
                }), this.fallbackTransition = function z2(n, t, e) {
                    return new OE(n, {
                        type: 1,
                        animation: {type: 2, steps: [], options: null},
                        matchers: [(o, a) => !0],
                        options: null,
                        queryCount: 0,
                        depCount: 0
                    }, t)
                }(t, this.states)
            }

            get containsQueries() {
                return this.ast.queryCount > 0
            }

            matchTransition(t, e, r, i) {
                return this.transitionFactories.find(o => o.match(t, e, r, i)) || null
            }

            matchStyles(t, e, r) {
                return this.fallbackTransition.buildStyles(t, e, r)
            }
        }

        function LE(n, t, e) {
            n.has(t) ? n.has(e) || n.set(e, n.get(t)) : n.has(e) && n.set(t, n.get(e))
        }

        const W2 = new yc;

        class G2 {
            constructor(t, e, r) {
                this.bodyNode = t, this._driver = e, this._normalizer = r, this._animations = new Map, this._playersById = new Map, this.players = []
            }

            register(t, e) {
                const r = [], s = vp(this._driver, e, r, []);
                if (r.length) throw function Wj(n) {
                    return new D(3503, !1)
                }();
                this._animations.set(t, s)
            }

            _buildPlayer(t, e, r) {
                const i = t.element, s = gE(0, this._normalizer, 0, t.keyframes, e, r);
                return this._driver.animate(i, s, t.duration, t.delay, t.easing, [], !0)
            }

            create(t, e, r = {}) {
                const i = [], s = this._animations.get(t);
                let o;
                const a = new Map;
                if (s ? (o = wp(this._driver, e, s, pp, ac, new Map, new Map, r, W2, i), o.forEach(u => {
                    const d = Bt(a, u.element, new Map);
                    u.postStyleProps.forEach(h => d.set(h, null))
                })) : (i.push(function Gj() {
                    return new D(3300, !1)
                }()), o = []), i.length) throw function qj(n) {
                    return new D(3504, !1)
                }();
                a.forEach((u, d) => {
                    u.forEach((h, f) => {
                        u.set(f, this._driver.computeStyle(d, f, Xn))
                    })
                });
                const c = Mr(o.map(u => {
                    const d = a.get(u.element);
                    return this._buildPlayer(u, new Map, d)
                }));
                return this._playersById.set(t, c), c.onDestroy(() => this.destroy(t)), this.players.push(c), c
            }

            destroy(t) {
                const e = this._getPlayer(t);
                e.destroy(), this._playersById.delete(t);
                const r = this.players.indexOf(e);
                r >= 0 && this.players.splice(r, 1)
            }

            _getPlayer(t) {
                const e = this._playersById.get(t);
                if (!e) throw function Kj(n) {
                    return new D(3301, !1)
                }();
                return e
            }

            listen(t, e, r, i) {
                const s = up(e, "", "", "");
                return lp(this._getPlayer(t), r, s, i), () => {
                }
            }

            command(t, e, r, i) {
                if ("register" == r) return void this.register(t, i[0]);
                if ("create" == r) return void this.create(t, e, i[0] || {});
                const s = this._getPlayer(t);
                switch (r) {
                    case"play":
                        s.play();
                        break;
                    case"pause":
                        s.pause();
                        break;
                    case"reset":
                        s.reset();
                        break;
                    case"restart":
                        s.restart();
                        break;
                    case"finish":
                        s.finish();
                        break;
                    case"init":
                        s.init();
                        break;
                    case"setPosition":
                        s.setPosition(parseFloat(i[0]));
                        break;
                    case"destroy":
                        this.destroy(t)
                }
            }
        }

        const BE = "ng-animate-queued", Sp = "ng-animate-disabled", Y2 = [],
            VE = {namespaceId: "", setForRemoval: !1, setForMove: !1, hasAnimation: !1, removedBeforeQueried: !1},
            J2 = {namespaceId: "", setForMove: !1, setForRemoval: !1, hasAnimation: !1, removedBeforeQueried: !0},
            nn = "__ng_removed";

        class Tp {
            constructor(t, e = "") {
                this.namespaceId = e;
                const r = t && t.hasOwnProperty("value");
                if (this.value = function nH(n) {
                    return n ?? null
                }(r ? t.value : t), r) {
                    const s = Vo(t);
                    delete s.value, this.options = s
                } else this.options = {};
                this.options.params || (this.options.params = {})
            }

            get params() {
                return this.options.params
            }

            absorbOptions(t) {
                const e = t.params;
                if (e) {
                    const r = this.options.params;
                    Object.keys(e).forEach(i => {
                        null == r[i] && (r[i] = e[i])
                    })
                }
            }
        }

        const Ho = "void", Ip = new Tp(Ho);

        class X2 {
            constructor(t, e, r) {
                this.id = t, this.hostElement = e, this._engine = r, this.players = [], this._triggers = new Map, this._queue = [], this._elementListeners = new Map, this._hostClassName = "ng-tns-" + t, rn(e, this._hostClassName)
            }

            listen(t, e, r, i) {
                if (!this._triggers.has(e)) throw function Qj(n, t) {
                    return new D(3302, !1)
                }();
                if (null == r || 0 == r.length) throw function Zj(n) {
                    return new D(3303, !1)
                }();
                if (!function rH(n) {
                    return "start" == n || "done" == n
                }(r)) throw function Yj(n, t) {
                    return new D(3400, !1)
                }();
                const s = Bt(this._elementListeners, t, []), o = {name: e, phase: r, callback: i};
                s.push(o);
                const a = Bt(this._engine.statesByElement, t, new Map);
                return a.has(e) || (rn(t, lc), rn(t, lc + "-" + e), a.set(e, Ip)), () => {
                    this._engine.afterFlush(() => {
                        const l = s.indexOf(o);
                        l >= 0 && s.splice(l, 1), this._triggers.has(e) || a.delete(e)
                    })
                }
            }

            register(t, e) {
                return !this._triggers.has(t) && (this._triggers.set(t, e), !0)
            }

            _getTrigger(t) {
                const e = this._triggers.get(t);
                if (!e) throw function Jj(n) {
                    return new D(3401, !1)
                }();
                return e
            }

            trigger(t, e, r, i = !0) {
                const s = this._getTrigger(e), o = new Ap(this.id, e, t);
                let a = this._engine.statesByElement.get(t);
                a || (rn(t, lc), rn(t, lc + "-" + e), this._engine.statesByElement.set(t, a = new Map));
                let l = a.get(e);
                const c = new Tp(r, this.id);
                if (!(r && r.hasOwnProperty("value")) && l && c.absorbOptions(l.options), a.set(e, c), l || (l = Ip), c.value !== Ho && l.value === c.value) {
                    if (!function oH(n, t) {
                        const e = Object.keys(n), r = Object.keys(t);
                        if (e.length != r.length) return !1;
                        for (let i = 0; i < e.length; i++) {
                            const s = e[i];
                            if (!t.hasOwnProperty(s) || n[s] !== t[s]) return !1
                        }
                        return !0
                    }(l.params, c.params)) {
                        const g = [], _ = s.matchStyles(l.value, l.params, g), y = s.matchStyles(c.value, c.params, g);
                        g.length ? this._engine.reportError(g) : this._engine.afterFlush(() => {
                            ei(t, _), Pn(t, y)
                        })
                    }
                    return
                }
                const h = Bt(this._engine.playersByElement, t, []);
                h.forEach(g => {
                    g.namespaceId == this.id && g.triggerName == e && g.queued && g.destroy()
                });
                let f = s.matchTransition(l.value, c.value, t, c.params), p = !1;
                if (!f) {
                    if (!i) return;
                    f = s.fallbackTransition, p = !0
                }
                return this._engine.totalQueuedPlayers++, this._queue.push({
                    element: t,
                    triggerName: e,
                    transition: f,
                    fromState: l,
                    toState: c,
                    player: o,
                    isFallbackTransition: p
                }), p || (rn(t, BE), o.onStart(() => {
                    ps(t, BE)
                })), o.onDone(() => {
                    let g = this.players.indexOf(o);
                    g >= 0 && this.players.splice(g, 1);
                    const _ = this._engine.playersByElement.get(t);
                    if (_) {
                        let y = _.indexOf(o);
                        y >= 0 && _.splice(y, 1)
                    }
                }), this.players.push(o), h.push(o), o
            }

            deregister(t) {
                this._triggers.delete(t), this._engine.statesByElement.forEach(e => e.delete(t)), this._elementListeners.forEach((e, r) => {
                    this._elementListeners.set(r, e.filter(i => i.name != t))
                })
            }

            clearElementCache(t) {
                this._engine.statesByElement.delete(t), this._elementListeners.delete(t);
                const e = this._engine.playersByElement.get(t);
                e && (e.forEach(r => r.destroy()), this._engine.playersByElement.delete(t))
            }

            _signalRemovalForInnerTriggers(t, e) {
                const r = this._engine.driver.query(t, cc, !0);
                r.forEach(i => {
                    if (i[nn]) return;
                    const s = this._engine.fetchNamespacesByElement(i);
                    s.size ? s.forEach(o => o.triggerLeaveAnimation(i, e, !1, !0)) : this.clearElementCache(i)
                }), this._engine.afterFlushAnimationsDone(() => r.forEach(i => this.clearElementCache(i)))
            }

            triggerLeaveAnimation(t, e, r, i) {
                const s = this._engine.statesByElement.get(t), o = new Map;
                if (s) {
                    const a = [];
                    if (s.forEach((l, c) => {
                        if (o.set(c, l.value), this._triggers.has(c)) {
                            const u = this.trigger(t, c, Ho, i);
                            u && a.push(u)
                        }
                    }), a.length) return this._engine.markElementAsRemoved(this.id, t, !0, e, o), r && Mr(a).onDone(() => this._engine.processLeaveNode(t)), !0
                }
                return !1
            }

            prepareLeaveAnimationListeners(t) {
                const e = this._elementListeners.get(t), r = this._engine.statesByElement.get(t);
                if (e && r) {
                    const i = new Set;
                    e.forEach(s => {
                        const o = s.name;
                        if (i.has(o)) return;
                        i.add(o);
                        const l = this._triggers.get(o).fallbackTransition, c = r.get(o) || Ip, u = new Tp(Ho),
                            d = new Ap(this.id, o, t);
                        this._engine.totalQueuedPlayers++, this._queue.push({
                            element: t,
                            triggerName: o,
                            transition: l,
                            fromState: c,
                            toState: u,
                            player: d,
                            isFallbackTransition: !0
                        })
                    })
                }
            }

            removeNode(t, e) {
                const r = this._engine;
                if (t.childElementCount && this._signalRemovalForInnerTriggers(t, e), this.triggerLeaveAnimation(t, e, !0)) return;
                let i = !1;
                if (r.totalAnimations) {
                    const s = r.players.length ? r.playersByQueriedElement.get(t) : [];
                    if (s && s.length) i = !0; else {
                        let o = t;
                        for (; o = o.parentNode;) if (r.statesByElement.get(o)) {
                            i = !0;
                            break
                        }
                    }
                }
                if (this.prepareLeaveAnimationListeners(t), i) r.markElementAsRemoved(this.id, t, !1, e); else {
                    const s = t[nn];
                    (!s || s === VE) && (r.afterFlush(() => this.clearElementCache(t)), r.destroyInnerAnimations(t), r._onRemovalComplete(t, e))
                }
            }

            insertNode(t, e) {
                rn(t, this._hostClassName)
            }

            drainQueuedTransitions(t) {
                const e = [];
                return this._queue.forEach(r => {
                    const i = r.player;
                    if (i.destroyed) return;
                    const s = r.element, o = this._elementListeners.get(s);
                    o && o.forEach(a => {
                        if (a.name == r.triggerName) {
                            const l = up(s, r.triggerName, r.fromState.value, r.toState.value);
                            l._data = t, lp(r.player, a.phase, l, a.callback)
                        }
                    }), i.markedForDestroy ? this._engine.afterFlush(() => {
                        i.destroy()
                    }) : e.push(r)
                }), this._queue = [], e.sort((r, i) => {
                    const s = r.transition.ast.depCount, o = i.transition.ast.depCount;
                    return 0 == s || 0 == o ? s - o : this._engine.driver.containsElement(r.element, i.element) ? 1 : -1
                })
            }

            destroy(t) {
                this.players.forEach(e => e.destroy()), this._signalRemovalForInnerTriggers(this.hostElement, t)
            }

            elementContainsData(t) {
                let e = !1;
                return this._elementListeners.has(t) && (e = !0), e = !!this._queue.find(r => r.element === t) || e, e
            }
        }

        class eH {
            constructor(t, e, r) {
                this.bodyNode = t, this.driver = e, this._normalizer = r, this.players = [], this.newHostElements = new Map, this.playersByElement = new Map, this.playersByQueriedElement = new Map, this.statesByElement = new Map, this.disabledNodes = new Set, this.totalAnimations = 0, this.totalQueuedPlayers = 0, this._namespaceLookup = {}, this._namespaceList = [], this._flushFns = [], this._whenQuietFns = [], this.namespacesByHostElement = new Map, this.collectedEnterElements = [], this.collectedLeaveElements = [], this.onRemovalComplete = (i, s) => {
                }
            }

            _onRemovalComplete(t, e) {
                this.onRemovalComplete(t, e)
            }

            get queuedPlayers() {
                const t = [];
                return this._namespaceList.forEach(e => {
                    e.players.forEach(r => {
                        r.queued && t.push(r)
                    })
                }), t
            }

            createNamespace(t, e) {
                const r = new X2(t, e, this);
                return this.bodyNode && this.driver.containsElement(this.bodyNode, e) ? this._balanceNamespaceList(r, e) : (this.newHostElements.set(e, r), this.collectEnterElement(e)), this._namespaceLookup[t] = r
            }

            _balanceNamespaceList(t, e) {
                const r = this._namespaceList, i = this.namespacesByHostElement;
                if (r.length - 1 >= 0) {
                    let o = !1, a = this.driver.getParentElement(e);
                    for (; a;) {
                        const l = i.get(a);
                        if (l) {
                            const c = r.indexOf(l);
                            r.splice(c + 1, 0, t), o = !0;
                            break
                        }
                        a = this.driver.getParentElement(a)
                    }
                    o || r.unshift(t)
                } else r.push(t);
                return i.set(e, t), t
            }

            register(t, e) {
                let r = this._namespaceLookup[t];
                return r || (r = this.createNamespace(t, e)), r
            }

            registerTrigger(t, e, r) {
                let i = this._namespaceLookup[t];
                i && i.register(e, r) && this.totalAnimations++
            }

            destroy(t, e) {
                if (!t) return;
                const r = this._fetchNamespace(t);
                this.afterFlush(() => {
                    this.namespacesByHostElement.delete(r.hostElement), delete this._namespaceLookup[t];
                    const i = this._namespaceList.indexOf(r);
                    i >= 0 && this._namespaceList.splice(i, 1)
                }), this.afterFlushAnimationsDone(() => r.destroy(e))
            }

            _fetchNamespace(t) {
                return this._namespaceLookup[t]
            }

            fetchNamespacesByElement(t) {
                const e = new Set, r = this.statesByElement.get(t);
                if (r) for (let i of r.values()) if (i.namespaceId) {
                    const s = this._fetchNamespace(i.namespaceId);
                    s && e.add(s)
                }
                return e
            }

            trigger(t, e, r, i) {
                if (Dc(e)) {
                    const s = this._fetchNamespace(t);
                    if (s) return s.trigger(e, r, i), !0
                }
                return !1
            }

            insertNode(t, e, r, i) {
                if (!Dc(e)) return;
                const s = e[nn];
                if (s && s.setForRemoval) {
                    s.setForRemoval = !1, s.setForMove = !0;
                    const o = this.collectedLeaveElements.indexOf(e);
                    o >= 0 && this.collectedLeaveElements.splice(o, 1)
                }
                if (t) {
                    const o = this._fetchNamespace(t);
                    o && o.insertNode(e, r)
                }
                i && this.collectEnterElement(e)
            }

            collectEnterElement(t) {
                this.collectedEnterElements.push(t)
            }

            markElementAsDisabled(t, e) {
                e ? this.disabledNodes.has(t) || (this.disabledNodes.add(t), rn(t, Sp)) : this.disabledNodes.has(t) && (this.disabledNodes.delete(t), ps(t, Sp))
            }

            removeNode(t, e, r, i) {
                if (Dc(e)) {
                    const s = t ? this._fetchNamespace(t) : null;
                    if (s ? s.removeNode(e, i) : this.markElementAsRemoved(t, e, !1, i), r) {
                        const o = this.namespacesByHostElement.get(e);
                        o && o.id !== t && o.removeNode(e, i)
                    }
                } else this._onRemovalComplete(e, i)
            }

            markElementAsRemoved(t, e, r, i, s) {
                this.collectedLeaveElements.push(e), e[nn] = {
                    namespaceId: t,
                    setForRemoval: i,
                    hasAnimation: r,
                    removedBeforeQueried: !1,
                    previousTriggersValues: s
                }
            }

            listen(t, e, r, i, s) {
                return Dc(e) ? this._fetchNamespace(t).listen(e, r, i, s) : () => {
                }
            }

            _buildInstruction(t, e, r, i, s) {
                return t.transition.build(this.driver, t.element, t.fromState.value, t.toState.value, r, i, t.fromState.options, t.toState.options, e, s)
            }

            destroyInnerAnimations(t) {
                let e = this.driver.query(t, cc, !0);
                e.forEach(r => this.destroyActiveAnimationsForElement(r)), 0 != this.playersByQueriedElement.size && (e = this.driver.query(t, gp, !0), e.forEach(r => this.finishActiveQueriedAnimationOnElement(r)))
            }

            destroyActiveAnimationsForElement(t) {
                const e = this.playersByElement.get(t);
                e && e.forEach(r => {
                    r.queued ? r.markedForDestroy = !0 : r.destroy()
                })
            }

            finishActiveQueriedAnimationOnElement(t) {
                const e = this.playersByQueriedElement.get(t);
                e && e.forEach(r => r.finish())
            }

            whenRenderingDone() {
                return new Promise(t => {
                    if (this.players.length) return Mr(this.players).onDone(() => t());
                    t()
                })
            }

            processLeaveNode(t) {
                const e = t[nn];
                if (e && e.setForRemoval) {
                    if (t[nn] = VE, e.namespaceId) {
                        this.destroyInnerAnimations(t);
                        const r = this._fetchNamespace(e.namespaceId);
                        r && r.clearElementCache(t)
                    }
                    this._onRemovalComplete(t, e.setForRemoval)
                }
                t.classList?.contains(Sp) && this.markElementAsDisabled(t, !1), this.driver.query(t, ".ng-animate-disabled", !0).forEach(r => {
                    this.markElementAsDisabled(r, !1)
                })
            }

            flush(t = -1) {
                let e = [];
                if (this.newHostElements.size && (this.newHostElements.forEach((r, i) => this._balanceNamespaceList(r, i)), this.newHostElements.clear()), this.totalAnimations && this.collectedEnterElements.length) for (let r = 0; r < this.collectedEnterElements.length; r++) rn(this.collectedEnterElements[r], "ng-star-inserted");
                if (this._namespaceList.length && (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
                    const r = [];
                    try {
                        e = this._flushAnimations(r, t)
                    } finally {
                        for (let i = 0; i < r.length; i++) r[i]()
                    }
                } else for (let r = 0; r < this.collectedLeaveElements.length; r++) this.processLeaveNode(this.collectedLeaveElements[r]);
                if (this.totalQueuedPlayers = 0, this.collectedEnterElements.length = 0, this.collectedLeaveElements.length = 0, this._flushFns.forEach(r => r()), this._flushFns = [], this._whenQuietFns.length) {
                    const r = this._whenQuietFns;
                    this._whenQuietFns = [], e.length ? Mr(e).onDone(() => {
                        r.forEach(i => i())
                    }) : r.forEach(i => i())
                }
            }

            reportError(t) {
                throw function Xj(n) {
                    return new D(3402, !1)
                }()
            }

            _flushAnimations(t, e) {
                const r = new yc, i = [], s = new Map, o = [], a = new Map, l = new Map, c = new Map, u = new Set;
                this.disabledNodes.forEach(I => {
                    u.add(I);
                    const k = this.driver.query(I, ".ng-animate-queued", !0);
                    for (let O = 0; O < k.length; O++) u.add(k[O])
                });
                const d = this.bodyNode, h = Array.from(this.statesByElement.keys()),
                    f = UE(h, this.collectedEnterElements), p = new Map;
                let g = 0;
                f.forEach((I, k) => {
                    const O = pp + g++;
                    p.set(k, O), I.forEach(ne => rn(ne, O))
                });
                const _ = [], y = new Set, C = new Set;
                for (let I = 0; I < this.collectedLeaveElements.length; I++) {
                    const k = this.collectedLeaveElements[I], O = k[nn];
                    O && O.setForRemoval && (_.push(k), y.add(k), O.hasAnimation ? this.driver.query(k, ".ng-star-inserted", !0).forEach(ne => y.add(ne)) : C.add(k))
                }
                const v = new Map, E = UE(h, Array.from(y));
                E.forEach((I, k) => {
                    const O = ac + g++;
                    v.set(k, O), I.forEach(ne => rn(ne, O))
                }), t.push(() => {
                    f.forEach((I, k) => {
                        const O = p.get(k);
                        I.forEach(ne => ps(ne, O))
                    }), E.forEach((I, k) => {
                        const O = v.get(k);
                        I.forEach(ne => ps(ne, O))
                    }), _.forEach(I => {
                        this.processLeaveNode(I)
                    })
                });
                const B = [], Y = [];
                for (let I = this._namespaceList.length - 1; I >= 0; I--) this._namespaceList[I].drainQueuedTransitions(e).forEach(O => {
                    const ne = O.player, tt = O.element;
                    if (B.push(ne), this.collectedEnterElements.length) {
                        const dt = tt[nn];
                        if (dt && dt.setForMove) {
                            if (dt.previousTriggersValues && dt.previousTriggersValues.has(O.triggerName)) {
                                const ni = dt.previousTriggersValues.get(O.triggerName),
                                    sn = this.statesByElement.get(O.element);
                                if (sn && sn.has(O.triggerName)) {
                                    const Ec = sn.get(O.triggerName);
                                    Ec.value = ni, sn.set(O.triggerName, Ec)
                                }
                            }
                            return void ne.destroy()
                        }
                    }
                    const Fn = !d || !this.driver.containsElement(d, tt), $t = v.get(tt), Ir = p.get(tt),
                        Ie = this._buildInstruction(O, r, Ir, $t, Fn);
                    if (Ie.errors && Ie.errors.length) return void Y.push(Ie);
                    if (Fn) return ne.onStart(() => ei(tt, Ie.fromStyles)), ne.onDestroy(() => Pn(tt, Ie.toStyles)), void i.push(ne);
                    if (O.isFallbackTransition) return ne.onStart(() => ei(tt, Ie.fromStyles)), ne.onDestroy(() => Pn(tt, Ie.toStyles)), void i.push(ne);
                    const YE = [];
                    Ie.timelines.forEach(dt => {
                        dt.stretchStartingKeyframe = !0, this.disabledNodes.has(dt.element) || YE.push(dt)
                    }), Ie.timelines = YE, r.append(tt, Ie.timelines), o.push({
                        instruction: Ie,
                        player: ne,
                        element: tt
                    }), Ie.queriedElements.forEach(dt => Bt(a, dt, []).push(ne)), Ie.preStyleProps.forEach((dt, ni) => {
                        if (dt.size) {
                            let sn = l.get(ni);
                            sn || l.set(ni, sn = new Set), dt.forEach((Ec, kp) => sn.add(kp))
                        }
                    }), Ie.postStyleProps.forEach((dt, ni) => {
                        let sn = c.get(ni);
                        sn || c.set(ni, sn = new Set), dt.forEach((Ec, kp) => sn.add(kp))
                    })
                });
                if (Y.length) {
                    const I = [];
                    Y.forEach(k => {
                        I.push(function e2(n, t) {
                            return new D(3505, !1)
                        }())
                    }), B.forEach(k => k.destroy()), this.reportError(I)
                }
                const Te = new Map, jt = new Map;
                o.forEach(I => {
                    const k = I.element;
                    r.has(k) && (jt.set(k, k), this._beforeAnimationBuild(I.player.namespaceId, I.instruction, Te))
                }), i.forEach(I => {
                    const k = I.element;
                    this._getPreviousPlayers(k, !1, I.namespaceId, I.triggerName, null).forEach(ne => {
                        Bt(Te, k, []).push(ne), ne.destroy()
                    })
                });
                const Ht = _.filter(I => zE(I, l, c)), Ut = new Map;
                HE(Ut, this.driver, C, c, Xn).forEach(I => {
                    zE(I, l, c) && Ht.push(I)
                });
                const nr = new Map;
                f.forEach((I, k) => {
                    HE(nr, this.driver, new Set(I), l, "!")
                }), Ht.forEach(I => {
                    const k = Ut.get(I), O = nr.get(I);
                    Ut.set(I, new Map([...Array.from(k?.entries() ?? []), ...Array.from(O?.entries() ?? [])]))
                });
                const bn = [], ms = [], _s = {};
                o.forEach(I => {
                    const {element: k, player: O, instruction: ne} = I;
                    if (r.has(k)) {
                        if (u.has(k)) return O.onDestroy(() => Pn(k, ne.toStyles)), O.disabled = !0, O.overrideTotalTime(ne.totalTime), void i.push(O);
                        let tt = _s;
                        if (jt.size > 1) {
                            let $t = k;
                            const Ir = [];
                            for (; $t = $t.parentNode;) {
                                const Ie = jt.get($t);
                                if (Ie) {
                                    tt = Ie;
                                    break
                                }
                                Ir.push($t)
                            }
                            Ir.forEach(Ie => jt.set(Ie, tt))
                        }
                        const Fn = this._buildAnimation(O.namespaceId, ne, Te, s, nr, Ut);
                        if (O.setRealPlayer(Fn), tt === _s) bn.push(O); else {
                            const $t = this.playersByElement.get(tt);
                            $t && $t.length && (O.parentPlayer = Mr($t)), i.push(O)
                        }
                    } else ei(k, ne.fromStyles), O.onDestroy(() => Pn(k, ne.toStyles)), ms.push(O), u.has(k) && i.push(O)
                }), ms.forEach(I => {
                    const k = s.get(I.element);
                    if (k && k.length) {
                        const O = Mr(k);
                        I.setRealPlayer(O)
                    }
                }), i.forEach(I => {
                    I.parentPlayer ? I.syncPlayerEvents(I.parentPlayer) : I.destroy()
                });
                for (let I = 0; I < _.length; I++) {
                    const k = _[I], O = k[nn];
                    if (ps(k, ac), O && O.hasAnimation) continue;
                    let ne = [];
                    if (a.size) {
                        let Fn = a.get(k);
                        Fn && Fn.length && ne.push(...Fn);
                        let $t = this.driver.query(k, gp, !0);
                        for (let Ir = 0; Ir < $t.length; Ir++) {
                            let Ie = a.get($t[Ir]);
                            Ie && Ie.length && ne.push(...Ie)
                        }
                    }
                    const tt = ne.filter(Fn => !Fn.destroyed);
                    tt.length ? iH(this, k, tt) : this.processLeaveNode(k)
                }
                return _.length = 0, bn.forEach(I => {
                    this.players.push(I), I.onDone(() => {
                        I.destroy();
                        const k = this.players.indexOf(I);
                        this.players.splice(k, 1)
                    }), I.play()
                }), bn
            }

            elementContainsData(t, e) {
                let r = !1;
                const i = e[nn];
                return i && i.setForRemoval && (r = !0), this.playersByElement.has(e) && (r = !0), this.playersByQueriedElement.has(e) && (r = !0), this.statesByElement.has(e) && (r = !0), this._fetchNamespace(t).elementContainsData(e) || r
            }

            afterFlush(t) {
                this._flushFns.push(t)
            }

            afterFlushAnimationsDone(t) {
                this._whenQuietFns.push(t)
            }

            _getPreviousPlayers(t, e, r, i, s) {
                let o = [];
                if (e) {
                    const a = this.playersByQueriedElement.get(t);
                    a && (o = a)
                } else {
                    const a = this.playersByElement.get(t);
                    if (a) {
                        const l = !s || s == Ho;
                        a.forEach(c => {
                            c.queued || !l && c.triggerName != i || o.push(c)
                        })
                    }
                }
                return (r || i) && (o = o.filter(a => !(r && r != a.namespaceId || i && i != a.triggerName))), o
            }

            _beforeAnimationBuild(t, e, r) {
                const s = e.element, o = e.isRemovalTransition ? void 0 : t,
                    a = e.isRemovalTransition ? void 0 : e.triggerName;
                for (const l of e.timelines) {
                    const c = l.element, u = c !== s, d = Bt(r, c, []);
                    this._getPreviousPlayers(c, u, o, a, e.toState).forEach(f => {
                        const p = f.getRealPlayer();
                        p.beforeDestroy && p.beforeDestroy(), f.destroy(), d.push(f)
                    })
                }
                ei(s, e.fromStyles)
            }

            _buildAnimation(t, e, r, i, s, o) {
                const a = e.triggerName, l = e.element, c = [], u = new Set, d = new Set, h = e.timelines.map(p => {
                    const g = p.element;
                    u.add(g);
                    const _ = g[nn];
                    if (_ && _.removedBeforeQueried) return new Fo(p.duration, p.delay);
                    const y = g !== l, C = function sH(n) {
                            const t = [];
                            return $E(n, t), t
                        }((r.get(g) || Y2).map(Te => Te.getRealPlayer())).filter(Te => !!Te.element && Te.element === g),
                        v = s.get(g), E = o.get(g), B = gE(0, this._normalizer, 0, p.keyframes, v, E),
                        Y = this._buildPlayer(p, B, C);
                    if (p.subTimeline && i && d.add(g), y) {
                        const Te = new Ap(t, a, g);
                        Te.setRealPlayer(Y), c.push(Te)
                    }
                    return Y
                });
                c.forEach(p => {
                    Bt(this.playersByQueriedElement, p.element, []).push(p), p.onDone(() => function tH(n, t, e) {
                        let r = n.get(t);
                        if (r) {
                            if (r.length) {
                                const i = r.indexOf(e);
                                r.splice(i, 1)
                            }
                            0 == r.length && n.delete(t)
                        }
                        return r
                    }(this.playersByQueriedElement, p.element, p))
                }), u.forEach(p => rn(p, EE));
                const f = Mr(h);
                return f.onDestroy(() => {
                    u.forEach(p => ps(p, EE)), Pn(l, e.toStyles)
                }), d.forEach(p => {
                    Bt(i, p, []).push(f)
                }), f
            }

            _buildPlayer(t, e, r) {
                return e.length > 0 ? this.driver.animate(t.element, e, t.duration, t.delay, t.easing, r) : new Fo(t.duration, t.delay)
            }
        }

        class Ap {
            constructor(t, e, r) {
                this.namespaceId = t, this.triggerName = e, this.element = r, this._player = new Fo, this._containsRealPlayer = !1, this._queuedCallbacks = new Map, this.destroyed = !1, this.markedForDestroy = !1, this.disabled = !1, this.queued = !0, this.totalTime = 0
            }

            setRealPlayer(t) {
                this._containsRealPlayer || (this._player = t, this._queuedCallbacks.forEach((e, r) => {
                    e.forEach(i => lp(t, r, void 0, i))
                }), this._queuedCallbacks.clear(), this._containsRealPlayer = !0, this.overrideTotalTime(t.totalTime), this.queued = !1)
            }

            getRealPlayer() {
                return this._player
            }

            overrideTotalTime(t) {
                this.totalTime = t
            }

            syncPlayerEvents(t) {
                const e = this._player;
                e.triggerCallback && t.onStart(() => e.triggerCallback("start")), t.onDone(() => this.finish()), t.onDestroy(() => this.destroy())
            }

            _queueEvent(t, e) {
                Bt(this._queuedCallbacks, t, []).push(e)
            }

            onDone(t) {
                this.queued && this._queueEvent("done", t), this._player.onDone(t)
            }

            onStart(t) {
                this.queued && this._queueEvent("start", t), this._player.onStart(t)
            }

            onDestroy(t) {
                this.queued && this._queueEvent("destroy", t), this._player.onDestroy(t)
            }

            init() {
                this._player.init()
            }

            hasStarted() {
                return !this.queued && this._player.hasStarted()
            }

            play() {
                !this.queued && this._player.play()
            }

            pause() {
                !this.queued && this._player.pause()
            }

            restart() {
                !this.queued && this._player.restart()
            }

            finish() {
                this._player.finish()
            }

            destroy() {
                this.destroyed = !0, this._player.destroy()
            }

            reset() {
                !this.queued && this._player.reset()
            }

            setPosition(t) {
                this.queued || this._player.setPosition(t)
            }

            getPosition() {
                return this.queued ? 0 : this._player.getPosition()
            }

            triggerCallback(t) {
                const e = this._player;
                e.triggerCallback && e.triggerCallback(t)
            }
        }

        function Dc(n) {
            return n && 1 === n.nodeType
        }

        function jE(n, t) {
            const e = n.style.display;
            return n.style.display = t ?? "none", e
        }

        function HE(n, t, e, r, i) {
            const s = [];
            e.forEach(l => s.push(jE(l)));
            const o = [];
            r.forEach((l, c) => {
                const u = new Map;
                l.forEach(d => {
                    const h = t.computeStyle(c, d, i);
                    u.set(d, h), (!h || 0 == h.length) && (c[nn] = J2, o.push(c))
                }), n.set(c, u)
            });
            let a = 0;
            return e.forEach(l => jE(l, s[a++])), o
        }

        function UE(n, t) {
            const e = new Map;
            if (n.forEach(a => e.set(a, [])), 0 == t.length) return e;
            const i = new Set(t), s = new Map;

            function o(a) {
                if (!a) return 1;
                let l = s.get(a);
                if (l) return l;
                const c = a.parentNode;
                return l = e.has(c) ? c : i.has(c) ? 1 : o(c), s.set(a, l), l
            }

            return t.forEach(a => {
                const l = o(a);
                1 !== l && e.get(l).push(a)
            }), e
        }

        function rn(n, t) {
            n.classList?.add(t)
        }

        function ps(n, t) {
            n.classList?.remove(t)
        }

        function iH(n, t, e) {
            Mr(e).onDone(() => n.processLeaveNode(t))
        }

        function $E(n, t) {
            for (let e = 0; e < n.length; e++) {
                const r = n[e];
                r instanceof zC ? $E(r.players, t) : t.push(r)
            }
        }

        function zE(n, t, e) {
            const r = e.get(n);
            if (!r) return !1;
            let i = t.get(n);
            return i ? r.forEach(s => i.add(s)) : t.set(n, r), e.delete(n), !0
        }

        class wc {
            constructor(t, e, r) {
                this.bodyNode = t, this._driver = e, this._normalizer = r, this._triggerCache = {}, this.onRemovalComplete = (i, s) => {
                }, this._transitionEngine = new eH(t, e, r), this._timelineEngine = new G2(t, e, r), this._transitionEngine.onRemovalComplete = (i, s) => this.onRemovalComplete(i, s)
            }

            registerTrigger(t, e, r, i, s) {
                const o = t + "-" + i;
                let a = this._triggerCache[o];
                if (!a) {
                    const l = [], u = vp(this._driver, s, l, []);
                    if (l.length) throw function $j(n, t) {
                        return new D(3404, !1)
                    }();
                    a = function U2(n, t, e) {
                        return new $2(n, t, e)
                    }(i, u, this._normalizer), this._triggerCache[o] = a
                }
                this._transitionEngine.registerTrigger(e, i, a)
            }

            register(t, e) {
                this._transitionEngine.register(t, e)
            }

            destroy(t, e) {
                this._transitionEngine.destroy(t, e)
            }

            onInsert(t, e, r, i) {
                this._transitionEngine.insertNode(t, e, r, i)
            }

            onRemove(t, e, r, i) {
                this._transitionEngine.removeNode(t, e, i || !1, r)
            }

            disableAnimations(t, e) {
                this._transitionEngine.markElementAsDisabled(t, e)
            }

            process(t, e, r, i) {
                if ("@" == r.charAt(0)) {
                    const [s, o] = mE(r);
                    this._timelineEngine.command(s, e, o, i)
                } else this._transitionEngine.trigger(t, e, r, i)
            }

            listen(t, e, r, i, s) {
                if ("@" == r.charAt(0)) {
                    const [o, a] = mE(r);
                    return this._timelineEngine.listen(o, e, a, s)
                }
                return this._transitionEngine.listen(t, e, r, i, s)
            }

            flush(t = -1) {
                this._transitionEngine.flush(t)
            }

            get players() {
                return this._transitionEngine.players.concat(this._timelineEngine.players)
            }

            whenRenderingDone() {
                return this._transitionEngine.whenRenderingDone()
            }
        }

        let lH = (() => {
            class n {
                constructor(e, r, i) {
                    this._element = e, this._startStyles = r, this._endStyles = i, this._state = 0;
                    let s = n.initialStylesByElement.get(e);
                    s || n.initialStylesByElement.set(e, s = new Map), this._initialStyles = s
                }

                start() {
                    this._state < 1 && (this._startStyles && Pn(this._element, this._startStyles, this._initialStyles), this._state = 1)
                }

                finish() {
                    this.start(), this._state < 2 && (Pn(this._element, this._initialStyles), this._endStyles && (Pn(this._element, this._endStyles), this._endStyles = null), this._state = 1)
                }

                destroy() {
                    this.finish(), this._state < 3 && (n.initialStylesByElement.delete(this._element), this._startStyles && (ei(this._element, this._startStyles), this._endStyles = null), this._endStyles && (ei(this._element, this._endStyles), this._endStyles = null), Pn(this._element, this._initialStyles), this._state = 3)
                }
            }

            return n.initialStylesByElement = new WeakMap, n
        })();

        function Rp(n) {
            let t = null;
            return n.forEach((e, r) => {
                (function cH(n) {
                    return "display" === n || "position" === n
                })(r) && (t = t || new Map, t.set(r, e))
            }), t
        }

        class WE {
            constructor(t, e, r, i) {
                this.element = t, this.keyframes = e, this.options = r, this._specialStyles = i, this._onDoneFns = [], this._onStartFns = [], this._onDestroyFns = [], this._initialized = !1, this._finished = !1, this._started = !1, this._destroyed = !1, this._originalOnDoneFns = [], this._originalOnStartFns = [], this.time = 0, this.parentPlayer = null, this.currentSnapshot = new Map, this._duration = r.duration, this._delay = r.delay || 0, this.time = this._duration + this._delay
            }

            _onFinish() {
                this._finished || (this._finished = !0, this._onDoneFns.forEach(t => t()), this._onDoneFns = [])
            }

            init() {
                this._buildPlayer(), this._preparePlayerBeforeStart()
            }

            _buildPlayer() {
                if (this._initialized) return;
                this._initialized = !0;
                const t = this.keyframes;
                this.domPlayer = this._triggerWebAnimation(this.element, t, this.options), this._finalKeyframe = t.length ? t[t.length - 1] : new Map, this.domPlayer.addEventListener("finish", () => this._onFinish())
            }

            _preparePlayerBeforeStart() {
                this._delay ? this._resetDomPlayerState() : this.domPlayer.pause()
            }

            _convertKeyframesToObject(t) {
                const e = [];
                return t.forEach(r => {
                    e.push(Object.fromEntries(r))
                }), e
            }

            _triggerWebAnimation(t, e, r) {
                return t.animate(this._convertKeyframesToObject(e), r)
            }

            onStart(t) {
                this._originalOnStartFns.push(t), this._onStartFns.push(t)
            }

            onDone(t) {
                this._originalOnDoneFns.push(t), this._onDoneFns.push(t)
            }

            onDestroy(t) {
                this._onDestroyFns.push(t)
            }

            play() {
                this._buildPlayer(), this.hasStarted() || (this._onStartFns.forEach(t => t()), this._onStartFns = [], this._started = !0, this._specialStyles && this._specialStyles.start()), this.domPlayer.play()
            }

            pause() {
                this.init(), this.domPlayer.pause()
            }

            finish() {
                this.init(), this._specialStyles && this._specialStyles.finish(), this._onFinish(), this.domPlayer.finish()
            }

            reset() {
                this._resetDomPlayerState(), this._destroyed = !1, this._finished = !1, this._started = !1, this._onStartFns = this._originalOnStartFns, this._onDoneFns = this._originalOnDoneFns
            }

            _resetDomPlayerState() {
                this.domPlayer && this.domPlayer.cancel()
            }

            restart() {
                this.reset(), this.play()
            }

            hasStarted() {
                return this._started
            }

            destroy() {
                this._destroyed || (this._destroyed = !0, this._resetDomPlayerState(), this._onFinish(), this._specialStyles && this._specialStyles.destroy(), this._onDestroyFns.forEach(t => t()), this._onDestroyFns = [])
            }

            setPosition(t) {
                void 0 === this.domPlayer && this.init(), this.domPlayer.currentTime = t * this.time
            }

            getPosition() {
                return this.domPlayer.currentTime / this.time
            }

            get totalTime() {
                return this._delay + this._duration
            }

            beforeDestroy() {
                const t = new Map;
                this.hasStarted() && this._finalKeyframe.forEach((r, i) => {
                    "offset" !== i && t.set(i, this._finished ? r : RE(this.element, i))
                }), this.currentSnapshot = t
            }

            triggerCallback(t) {
                const e = "start" === t ? this._onStartFns : this._onDoneFns;
                e.forEach(r => r()), e.length = 0
            }
        }

        class uH {
            validateStyleProperty(t) {
                return !0
            }

            validateAnimatableStyleProperty(t) {
                return !0
            }

            matchesElement(t, e) {
                return !1
            }

            containsElement(t, e) {
                return bE(t, e)
            }

            getParentElement(t) {
                return hp(t)
            }

            query(t, e, r) {
                return DE(t, e, r)
            }

            computeStyle(t, e, r) {
                return window.getComputedStyle(t)[e]
            }

            animate(t, e, r, i, s, o = []) {
                const l = {duration: r, delay: i, fill: 0 == i ? "both" : "forwards"};
                s && (l.easing = s);
                const c = new Map, u = o.filter(f => f instanceof WE);
                (function p2(n, t) {
                    return 0 === n || 0 === t
                })(r, i) && u.forEach(f => {
                    f.currentSnapshot.forEach((p, g) => c.set(g, p))
                });
                let d = function u2(n) {
                    return n.length ? n[0] instanceof Map ? n : n.map(t => ME(t)) : []
                }(e).map(f => Tr(f));
                d = function g2(n, t, e) {
                    if (e.size && t.length) {
                        let r = t[0], i = [];
                        if (e.forEach((s, o) => {
                            r.has(o) || i.push(o), r.set(o, s)
                        }), i.length) for (let s = 1; s < t.length; s++) {
                            let o = t[s];
                            i.forEach(a => o.set(a, RE(n, a)))
                        }
                    }
                    return t
                }(t, d, c);
                const h = function aH(n, t) {
                    let e = null, r = null;
                    return Array.isArray(t) && t.length ? (e = Rp(t[0]), t.length > 1 && (r = Rp(t[t.length - 1]))) : t instanceof Map && (e = Rp(t)), e || r ? new lH(n, e, r) : null
                }(t, d);
                return new WE(t, d, l, h)
            }
        }

        let dH = (() => {
            class n extends HC {
                constructor(e, r) {
                    super(), this._nextAnimationId = 0, this._renderer = e.createRenderer(r.body, {
                        id: "0",
                        encapsulation: an.None,
                        styles: [],
                        data: {animation: []}
                    })
                }

                build(e) {
                    const r = this._nextAnimationId.toString();
                    this._nextAnimationId++;
                    const i = Array.isArray(e) ? UC(e) : e;
                    return GE(this._renderer, null, r, "register", [i]), new hH(r, this._renderer)
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Us), w(_e))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();

        class hH extends class NB {
        } {
            constructor(t, e) {
                super(), this._id = t, this._renderer = e
            }

            create(t, e) {
                return new fH(this._id, t, e || {}, this._renderer)
            }
        }

        class fH {
            constructor(t, e, r, i) {
                this.id = t, this.element = e, this._renderer = i, this.parentPlayer = null, this._started = !1, this.totalTime = 0, this._command("create", r)
            }

            _listen(t, e) {
                return this._renderer.listen(this.element, `@@${this.id}:${t}`, e)
            }

            _command(t, ...e) {
                return GE(this._renderer, this.element, this.id, t, e)
            }

            onDone(t) {
                this._listen("done", t)
            }

            onStart(t) {
                this._listen("start", t)
            }

            onDestroy(t) {
                this._listen("destroy", t)
            }

            init() {
                this._command("init")
            }

            hasStarted() {
                return this._started
            }

            play() {
                this._command("play"), this._started = !0
            }

            pause() {
                this._command("pause")
            }

            restart() {
                this._command("restart")
            }

            finish() {
                this._command("finish")
            }

            destroy() {
                this._command("destroy")
            }

            reset() {
                this._command("reset"), this._started = !1
            }

            setPosition(t) {
                this._command("setPosition", t)
            }

            getPosition() {
                return this._renderer.engine.players[+this.id]?.getPosition() ?? 0
            }
        }

        function GE(n, t, e, r, i) {
            return n.setProperty(t, `@@${e}:${r}`, i)
        }

        const qE = "@.disabled";
        let pH = (() => {
            class n {
                constructor(e, r, i) {
                    this.delegate = e, this.engine = r, this._zone = i, this._currentId = 0, this._microtaskId = 1, this._animationCallbacksBuffer = [], this._rendererCache = new Map, this._cdRecurDepth = 0, this.promise = Promise.resolve(0), r.onRemovalComplete = (s, o) => {
                        const a = o?.parentNode(s);
                        a && o.removeChild(a, s)
                    }
                }

                createRenderer(e, r) {
                    const s = this.delegate.createRenderer(e, r);
                    if (!(e && r && r.data && r.data.animation)) {
                        let u = this._rendererCache.get(s);
                        return u || (u = new KE("", s, this.engine), this._rendererCache.set(s, u)), u
                    }
                    const o = r.id, a = r.id + "-" + this._currentId;
                    this._currentId++, this.engine.register(a, e);
                    const l = u => {
                        Array.isArray(u) ? u.forEach(l) : this.engine.registerTrigger(o, a, e, u.name, u)
                    };
                    return r.data.animation.forEach(l), new gH(this, a, s, this.engine)
                }

                begin() {
                    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin()
                }

                _scheduleCountTask() {
                    this.promise.then(() => {
                        this._microtaskId++
                    })
                }

                scheduleListenerCallback(e, r, i) {
                    e >= 0 && e < this._microtaskId ? this._zone.run(() => r(i)) : (0 == this._animationCallbacksBuffer.length && Promise.resolve(null).then(() => {
                        this._zone.run(() => {
                            this._animationCallbacksBuffer.forEach(s => {
                                const [o, a] = s;
                                o(a)
                            }), this._animationCallbacksBuffer = []
                        })
                    }), this._animationCallbacksBuffer.push([r, i]))
                }

                end() {
                    this._cdRecurDepth--, 0 == this._cdRecurDepth && this._zone.runOutsideAngular(() => {
                        this._scheduleCountTask(), this.engine.flush(this._microtaskId)
                    }), this.delegate.end && this.delegate.end()
                }

                whenRenderingDone() {
                    return this.engine.whenRenderingDone()
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)(w(Us), w(wc), w(Z))
            }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
        })();

        class KE {
            constructor(t, e, r) {
                this.namespaceId = t, this.delegate = e, this.engine = r, this.destroyNode = this.delegate.destroyNode ? i => e.destroyNode(i) : null
            }

            get data() {
                return this.delegate.data
            }

            destroy() {
                this.engine.destroy(this.namespaceId, this.delegate), this.delegate.destroy()
            }

            createElement(t, e) {
                return this.delegate.createElement(t, e)
            }

            createComment(t) {
                return this.delegate.createComment(t)
            }

            createText(t) {
                return this.delegate.createText(t)
            }

            appendChild(t, e) {
                this.delegate.appendChild(t, e), this.engine.onInsert(this.namespaceId, e, t, !1)
            }

            insertBefore(t, e, r, i = !0) {
                this.delegate.insertBefore(t, e, r), this.engine.onInsert(this.namespaceId, e, t, i)
            }

            removeChild(t, e, r) {
                this.engine.onRemove(this.namespaceId, e, this.delegate, r)
            }

            selectRootElement(t, e) {
                return this.delegate.selectRootElement(t, e)
            }

            parentNode(t) {
                return this.delegate.parentNode(t)
            }

            nextSibling(t) {
                return this.delegate.nextSibling(t)
            }

            setAttribute(t, e, r, i) {
                this.delegate.setAttribute(t, e, r, i)
            }

            removeAttribute(t, e, r) {
                this.delegate.removeAttribute(t, e, r)
            }

            addClass(t, e) {
                this.delegate.addClass(t, e)
            }

            removeClass(t, e) {
                this.delegate.removeClass(t, e)
            }

            setStyle(t, e, r, i) {
                this.delegate.setStyle(t, e, r, i)
            }

            removeStyle(t, e, r) {
                this.delegate.removeStyle(t, e, r)
            }

            setProperty(t, e, r) {
                "@" == e.charAt(0) && e == qE ? this.disableAnimations(t, !!r) : this.delegate.setProperty(t, e, r)
            }

            setValue(t, e) {
                this.delegate.setValue(t, e)
            }

            listen(t, e, r) {
                return this.delegate.listen(t, e, r)
            }

            disableAnimations(t, e) {
                this.engine.disableAnimations(t, e)
            }
        }

        class gH extends KE {
            constructor(t, e, r, i) {
                super(e, r, i), this.factory = t, this.namespaceId = e
            }

            setProperty(t, e, r) {
                "@" == e.charAt(0) ? "." == e.charAt(1) && e == qE ? this.disableAnimations(t, r = void 0 === r || !!r) : this.engine.process(this.namespaceId, t, e.slice(1), r) : this.delegate.setProperty(t, e, r)
            }

            listen(t, e, r) {
                if ("@" == e.charAt(0)) {
                    const i = function mH(n) {
                        switch (n) {
                            case"body":
                                return document.body;
                            case"document":
                                return document;
                            case"window":
                                return window;
                            default:
                                return n
                        }
                    }(t);
                    let s = e.slice(1), o = "";
                    return "@" != s.charAt(0) && ([s, o] = function _H(n) {
                        const t = n.indexOf(".");
                        return [n.substring(0, t), n.slice(t + 1)]
                    }(s)), this.engine.listen(this.namespaceId, i, s, o, a => {
                        this.factory.scheduleListenerCallback(a._data || -1, r, a)
                    })
                }
                return this.delegate.listen(t, e, r)
            }
        }

        const QE = [{provide: HC, useClass: dH}, {
                provide: Ep, useFactory: function vH() {
                    return new B2
                }
            }, {
                provide: wc, useClass: (() => {
                    class n extends wc {
                        constructor(e, r, i, s) {
                            super(e.body, r, i)
                        }

                        ngOnDestroy() {
                            this.flush()
                        }
                    }

                    return n.\u0275fac = function (e) {
                        return new (e || n)(w(_e), w(fp), w(Ep), w(ao))
                    }, n.\u0275prov = A({token: n, factory: n.\u0275fac}), n
                })()
            }, {
                provide: Us, useFactory: function bH(n, t, e) {
                    return new pH(n, t, e)
                }, deps: [vl, wc, Z]
            }], xp = [{provide: fp, useFactory: () => new uH}, {provide: zn, useValue: "BrowserAnimations"}, ...QE],
            ZE = [{provide: fp, useClass: wE}, {provide: zn, useValue: "NoopAnimations"}, ...QE];
        let DH = (() => {
            class n {
                static withConfig(e) {
                    return {ngModule: n, providers: e.disableAnimations ? ZE : xp}
                }
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({type: n}), n.\u0275inj = Me({providers: xp, imports: [kD]}), n
        })(), wH = (() => {
            class n {
            }

            return n.\u0275fac = function (e) {
                return new (e || n)
            }, n.\u0275mod = Ae({
                type: n,
                bootstrap: [Dj]
            }), n.\u0275inj = Me({imports: [kD, q1, lL, mL.forRoot({echarts: () => Uo.e(45).then(Uo.bind(Uo, 45))}), PV, oj, DH]}), n
        })();
        (function Uk() {
            Fb = !1
        })(), nN().bootstrapModule(wH).catch(n => console.error(n))
    }
}, Mc => {
    Mc(Mc.s = 179)
}]);