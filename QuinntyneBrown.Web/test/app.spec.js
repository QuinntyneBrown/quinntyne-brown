describe("photographer", function () {
    var photographerComponent;
    var $compile;
    var $rootScope;
    var MockActionCreator = (function () {
        function MockActionCreator() {
        }
        return MockActionCreator;
    }());
    beforeEach(function () {
        angular.mock.module("app.photographer");
    });
    beforeEach(inject(function ($controller, _$compile_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        photographerComponent = $controller("photographerComponent", { photographerActionCreator: new MockActionCreator() });
    }));
    it("should compile", function () {
        var element = $compile("<photographer></photographer>")($rootScope);
        expect(element).toBeDefined();
    });
    it("should be defined", function () {
        expect(photographerComponent).toBeDefined();
    });
});
