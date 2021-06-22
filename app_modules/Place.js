import App from "./App.js";

export default class Place {
    _marker = null;
    constructor(name, coords) {
        this._name = name;
        this._coords = coords;
        this._marker = this._createMarker();
    }

    _createMarker() {
        return new L.marker(this._coords, {
            icon: App.photoIcon,
            alt: this._name,
            riseOnHover: true,
        });
    }
}
