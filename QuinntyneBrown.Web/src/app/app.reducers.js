"use strict";
var app_actions_1 = require("./content-aggregation/actions/app.actions");
var app_constants_1 = require("./app.constants");
exports.allAppsReducer = function (state, action) {
    if (action instanceof app_actions_1.AddOrUpdateAppAction) {
        state.app = state.app || { properties: [] };
        for (var i = 0; i < action.entity.properties.length; i++) {
            if (action.entity.properties[i].name === app_constants_1.appProperties.biography)
                state.app.biographyHtmlBody = action.entity.properties[i].htmlBody;
            if (action.entity.properties[i].name === app_constants_1.appProperties.products)
                state.app.products = JSON.parse(action.entity.properties[i].value);
        }
    }
    return state;
};
