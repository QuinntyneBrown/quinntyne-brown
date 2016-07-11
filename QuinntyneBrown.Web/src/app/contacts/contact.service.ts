import { BaseService, Injectable, Service } from "angular-rx-ui/src/components/core";

@Injectable()
@Service({
	serviceName: "contactService",
	viewProviders: ["$q","apiEndpoint","fetch"]
})
export class ContactService {
    constructor(private $q: angular.IQService, private apiEndpoint, private fetch) {
        
    }

    get baseUri() { return this.apiEndpoint.getBaseUrl() + "/contact"; }

}
