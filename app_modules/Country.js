export default class Country {
    _places = [];

    static _countryCodes = JSON.parse(codes);

    static _getCountryCode(country) {
        return Object.keys(Country._countryCodes).find(
            (key) => Country._countryCodes[key] === country
        );
    }
    constructor(name, coords, zoomLevel, cities) {
        //  super();
        this._name = name;
        //this._places = places;
        this._coords = coords;
        this._zoomLevel = zoomLevel;
        this._cities = cities;
    }

    getFlagHTML() {
        // HTML for flag
        const countryCode = Country._getCountryCode(this._name);
        const flagHTML = `
        <li class="country" data-country='${this._name}'>
            <img class="country__flag" src="https://flagcdn.com/w80/${countryCode}.png" srcset="https://flagcdn.com/w160/${countryCode}.png 2x" width="80"
                alt="${this._name}" draggable="false">
         </li>`;
        if (!this._cities) return flagHTML;

        // HTML for cities list, if exists
        let listHTML =
            "<li class='citiesList'><div class = 'citiesList__container'><ul>";
        for (const city of Object.keys(this._cities)) {
            listHTML += `<li class='citiesList__item'>${city}</li>`;
        }
        listHTML += "</ul></div></li>";

        return flagHTML + listHTML;
    }

    addPlace(place) {
        this._places.push(place);
    }
}
