"use strict";
exports.appGuard = {
    promise: [
        "$q",
        "$route",
        "invokeAsync",
        "appActionCreator",
        "store",
        function ($q, $route, invokeAsync, appActionCreator, store) {
            return invokeAsync({ action: appActionCreator.getById, params: { id: 2 } });
        }],
    route: "*"
};
