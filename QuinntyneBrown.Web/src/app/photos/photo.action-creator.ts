import { IDispatcher, Service, BaseActionCreator } from "angular-rx-ui/src/components/core";
import { Photo } from "./photo.model";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { AddOrUpdatePhotoAction, AddOrUpdatePhotoSuccessAction, CurrentPhotoRemovedAction, SetCurrentPhotoAction, RemovePhotoAction, AllPhotosAction, PhotoSearchAction, PhotosFilterAction, PhotoUploadAction} from "./photo.actions";

@Service({
    serviceName: "photoActionCreator",
    viewProviders: [
        "$location", "dispatcher", "photoService", "guid","invokeAsync","modalActionCreator"
    ]
})
export class PhotoActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, photoService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,photoService,dispatcher,guid,AddOrUpdatePhotoAction,AllPhotosAction,RemovePhotoAction,SetCurrentPhotoAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdatePhotoSuccessAction(options.entity));

    currentPhotoRemoved = () => this.dispatcher.dispatch(new CurrentPhotoRemovedAction());

    public upload = (dragEvent: DragEvent) => {
        dragEvent.stopPropagation();
        dragEvent.preventDefault();
        let newId = this.guid();
        if (dragEvent.dataTransfer && dragEvent.dataTransfer.files) {
            var packageFiles = function (fileList: FileList) {
                var formData = new FormData();
                for (var i = 0; i < fileList.length; i++) {
                    formData.append(fileList[i].name, fileList[i]);
                }
                return formData;
            }
            this.service
                .tryToUpload({ data: packageFiles(dragEvent.dataTransfer.files) })
                .then((response: any) => {                    
                    this.dispatcher.dispatch(new PhotoUploadAction(newId, response.files))
                });
        }
        return newId;
    }

    openPhotoUploadModal = () => {
        this.modalActionCreator.open({ html: "<photo-upload-modal></photo-upload-modal>" });
    }

    openPhotoPickerModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<photo-picker-modal></photo-picker-modal>" });
        });
    }

    public search = options => {
        var id = this.guid()
        this.service.search({ params: { searchText: options.searchText } })
            .then((results: any) => {
                this.dispatcher.dispatch(new PhotoSearchAction(id, results));
            });
        return id;
    }
}


