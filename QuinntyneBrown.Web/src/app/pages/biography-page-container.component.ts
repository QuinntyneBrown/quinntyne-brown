import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./biography-page-container.component.html"),
    styles: [require("./biography-page-container.component.scss")],
    selector: "biography-page-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BiographyPageContainerComponent {
    constructor() { }
    public biographyPageHtmlBody: string;
}
