"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var modal_action_creator_1 = require("angular-rx-ui/src/components/modal/modal.action-creator");
var professional_service_actions_1 = require("./professional-service.actions");
var ProfessionalServiceActionCreator = (function (_super) {
    __extends(ProfessionalServiceActionCreator, _super);
    function ProfessionalServiceActionCreator($location, dispatcher, professionalServiceService, guid, invokeAsync, modalActionCreator) {
        var _this = this;
        _super.call(this, $location, professionalServiceService, dispatcher, guid, professional_service_actions_1.AddOrUpdateProfessionalServiceAction, professional_service_actions_1.AllProfessionalServicesAction, professional_service_actions_1.RemoveProfessionalServiceAction, professional_service_actions_1.SetCurrentProfessionalServiceAction);
        this.invokeAsync = invokeAsync;
        this.modalActionCreator = modalActionCreator;
        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new professional_service_actions_1.AddOrUpdateProfessionalServiceSuccessAction(options.entity)); };
        this.currentProfessionalServiceRemoved = function () { return _this.dispatcher.dispatch(new professional_service_actions_1.CurrentProfessionalServiceRemovedAction()); };
        this.openAllProfessionalServicesModal = function () {
            _this.invokeAsync(_this.all).then(function (results) {
                _this.modalActionCreator.open({ html: "<all-professional-service-modal></all-professional-service-modal>" });
            });
        };
    }
    ProfessionalServiceActionCreator = __decorate([
        core_1.Service({
            serviceName: "professionalServiceActionCreator",
            viewProviders: ["$location", "dispatcher", "professionalServiceService", "guid", "invokeAsync", "modalActionCreator"]
        }), 
        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
    ], ProfessionalServiceActionCreator);
    return ProfessionalServiceActionCreator;
}(core_1.BaseActionCreator));
exports.ProfessionalServiceActionCreator = ProfessionalServiceActionCreator;
