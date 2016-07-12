import { BaseService, Injectable, Service } from "../core";

@Injectable()
@Service({
	serviceName: "propertyService",
	viewProviders: ["$q","apiEndpoint","fetch"]
})
export class PropertyService extends BaseService {
    constructor($q: angular.IQService, apiEndpoint, fetch) {
        super($q, apiEndpoint, fetch)
    }

    get baseUri() { return this.apiEndpoint.getBaseUrl() + "/v1/property"; }

}
