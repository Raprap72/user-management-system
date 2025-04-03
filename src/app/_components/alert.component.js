"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertComponent = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const _models_1 = require("@app/_models");
let AlertComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({ selector: 'alert', templateUrl: 'alert.component.html' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _fade_decorators;
    let _fade_initializers = [];
    let _fade_extraInitializers = [];
    var AlertComponent = _classThis = class {
        constructor(router, alertService) {
            this.router = router;
            this.alertService = alertService;
            this.id = __runInitializers(this, _id_initializers, 'default-alert');
            this.fade = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _fade_initializers, true));
            this.alerts = (__runInitializers(this, _fade_extraInitializers), []);
        }
        ngOnInit() {
            // subscribe to new alert notifications
            this.alertSubscription = this.alertService.onAlert(this.id)
                .subscribe(alert => {
                // clear alerts when an empty alert is received
                if (!alert.message) {
                    // filter out alerts without 'keepAfterRouteChange' flag
                    this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);
                    // remove 'keepAfterRouteChange' flag on the rest
                    this.alerts.forEach(x => delete x.keepAfterRouteChange);
                    return;
                }
                // add alert to array
                this.alerts.push(alert);
                // auto close alert if required
                if (alert.autoClose) {
                    setTimeout(() => this.removeAlert(alert), 3000);
                }
            });
            // clear alerts on location change
            this.routeSubscription = this.router.events.subscribe(event => {
                if (event instanceof router_1.NavigationStart) {
                    this.alertService.clear(this.id);
                }
            });
        }
        ngOnDestroy() {
            // unsubscribe to avoid memory leaks
            this.alertSubscription.unsubscribe();
            this.routeSubscription.unsubscribe();
        }
        removeAlert(alert) {
            // check if already removed to prevent error on auto close
            if (!this.alerts.includes(alert))
                return;
            if (this.fade) {
                // fade out alert
                alert.fade = true;
                // remove alert after faded out
                setTimeout(() => {
                    this.alerts = this.alerts.filter(x => x !== alert);
                }, 250);
            }
            else {
                // remove alert
                this.alerts = this.alerts.filter(x => x !== alert);
            }
        }
        cssClasses(alert) {
            if (!alert)
                return;
            const classes = ['alert', 'alert-dismissable'];
            const alertTypeClass = {
                [_models_1.AlertType.Success]: 'alert alert-success',
                [_models_1.AlertType.Error]: 'alert alert-danger',
                [_models_1.AlertType.Info]: 'alert alert-info',
                [_models_1.AlertType.Warning]: 'alert alert-warning'
            };
            classes.push(alertTypeClass[alert.type]);
            if (alert.fade) {
                classes.push('fade');
            }
            return classes.join(' ');
        }
    };
    __setFunctionName(_classThis, "AlertComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, core_1.Input)()];
        _fade_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _fade_decorators, { kind: "field", name: "fade", static: false, private: false, access: { has: obj => "fade" in obj, get: obj => obj.fade, set: (obj, value) => { obj.fade = value; } }, metadata: _metadata }, _fade_initializers, _fade_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AlertComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AlertComponent = _classThis;
})();
exports.AlertComponent = AlertComponent;
