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
var paged_list_1 = require("angular-rx-ui/src/components/paged-list");
var PropertyPagedListComponent = (function () {
    function PropertyPagedListComponent() {
        var _this = this;
        this.ngOnInit = function () {
            _this.pagedList = paged_list_1.toPageListFromInMemory(_this.entities, _this.pageNumber, _this.pageSize);
        };
        this.next = function () {
            if (_this.pageNumber == _this.pagedList.totalPages) {
                _this.pageNumber = 1;
            }
            else {
                _this.pageNumber = _this.pageNumber + 1;
            }
            _this.ngOnInit();
        };
        this.previous = function () {
            if (_this.pageNumber == 1) {
                _this.pageNumber = _this.pagedList.totalPages;
            }
            else {
                _this.pageNumber = _this.pageNumber - 1;
            }
            _this.ngOnInit();
        };
    }
    PropertyPagedListComponent = __decorate([
        core_1.Component({
            template: require("./property-paged-list.component.html"),
            styles: [require("./property-paged-list.component.scss")],
            selector: "property-paged-list",
            inputs: ['entities', 'edit', 'remove', 'pageNumber', 'pageSize', 'select'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [])
    ], PropertyPagedListComponent);
    return PropertyPagedListComponent;
}());
exports.PropertyPagedListComponent = PropertyPagedListComponent;
