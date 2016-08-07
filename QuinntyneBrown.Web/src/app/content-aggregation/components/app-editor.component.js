"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular-rx-ui/src/components/core");
var AppEditorComponent = (function () {
    function AppEditorComponent() {
        var _this = this;
        this.removeProperty = function (options) { return core_1.pluckOut({ items: _this.entity.properties, value: options.property.id }); };
        this.removeUI = function (options) { return core_1.pluckOut({ items: _this.entity.uis, value: options.ui.id }); };
    }
    AppEditorComponent = __decorate([
        core_1.Component({
            template: require("./app-editor.component.html"),
            styles: [require("./app-editor.component.scss")],
            selector: "app-editor",
            inputs: ['entity', 'addOrUpdate', 'remove', 'create'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [])
    ], AppEditorComponent);
    return AppEditorComponent;
}());
exports.AppEditorComponent = AppEditorComponent;
