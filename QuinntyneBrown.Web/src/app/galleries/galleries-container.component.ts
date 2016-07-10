import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./galleries-container.component.html"),
    styles: [require("./galleries-container.component.scss")],
    selector: "galleries-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleriesContainerComponent { }
