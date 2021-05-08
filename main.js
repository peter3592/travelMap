//const { render } = require("node-sass");

// 'map' is id of HTML element where should be map displayed
const countriesList = document.querySelector(".countries");
const content = document.querySelector(".content");
const photo = document.querySelector(".photo");
const backdrop = document.querySelector(".backdrop");
const sidebar = document.querySelector(".sidebar");
const sidebarArrow = sidebar.querySelector(".sidebar__arrow");
const sidebarMouse = sidebar.querySelector(".sidebar__mouse");

class App {
    _myMap;
    _countries = [];
    _markers = [];
    _defaultCoords = [37, 35];
    _defaultZoomLevel = 2;
    _activeList = null;

    static photoIcon = L.icon({
        iconUrl: "img/camera-icon.png",
        // shadowUrl: "leaf-shadow.png",

        iconSize: [20, 20], // size of the icon
        //  shadowSize: [50, 64], // size of the shadow
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        //   shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -30], // point from which the popup should open relative to the iconAnchor
    });

    constructor() {
        this._loadMap();
        countriesList.addEventListener("click", this._sidebarClick.bind(this));
        photo.addEventListener("click", this._closePhoto.bind(this));
        sidebarArrow.addEventListener("click", this._sidebarShowHide);
        sidebar.addEventListener("wheel", () => {
            sidebarMouse.remove();
        });
        backdrop.addEventListener("click", this._closePhoto.bind(this));
    }

    _loadMap() {
        this._myMap = L.map("map", { zoomControl: false }).setView(
            this._defaultCoords,
            this._defaultZoomLevel
        );
        L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
            maxZoom: 18,
            minZoom: 2,
            subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }).addTo(this._myMap);

        // Click event listener on map
        this._myMap.on("click", function (e) {
            console.log(e.sourceTarget._zoom);
            console.log([+e.latlng.lat.toFixed(3), +e.latlng.lng.toFixed(3)]);
        });
    }

    _addPlaces(country) {
        for (const place of country._places) {
            this._addMarker(place);
            //  this._addPhotos(place);
        }
    }

    _addMarker(place) {
        place._marker
            .addTo(this._myMap)
            .on("click", this._openPhoto.bind(this))
            .bindPopup(place._name, {
                className: "popup",
                closeButton: false,
            })
            .on("mouseover", function () {
                this.openPopup();
            })
            .on("mouseout", function () {
                this.closePopup();
            });
    }

    _openPhoto(e) {
        backdrop.classList.remove("backdrop__hidden");

        photo.innerHTML = "";
        const placeName = e.target.options.alt;

        let imgLoadedFlag1 = false;
        let imgLoadedFlag2 = false;

        const html = `
        <div class="photo__container">
            <img src="img/${placeName}.jpg" onload='imgLoadedFlag1=true' alt="">
            <div class="btn__container">
                <img src="img/${placeName}.jpg" onload='imgLoadedFlag2=true' alt="">
                <button class="photo__btn">&#10005;</button>
            </div>
        </div>`;

        photo.insertAdjacentHTML("afterbegin", html);

        // Waiting until photo is loaded
        const intervalID = setInterval(function () {
            //
            if (imgLoadedFlag1 && imgLoadedFlag2) {
                photo.classList.remove("photo--hidden");
                clearInterval(intervalID);
            }
        }, 50);
    }

    _closePhoto(e) {
        // Close button or backdrop clicked
        if (
            !e.target.classList.contains("photo__btn") &&
            !e.target.classList.contains("backdrop") &&
            !e.target.classList.contains("photo__container")
        )
            return;
        //  photo.innerHTML = "";
        backdrop.classList.add("backdrop__hidden");
        photo.classList.add("photo--hidden");
        //  console.log(e);
    }

    _addFlag(country) {
        countriesList.insertAdjacentHTML("beforeend", country.getFlagHTML());
    }

    _sidebarClick(e) {
        const target = e.target;

        // Flag was clicked
        if (target.classList.contains("country__flag")) {
            const countryClicked = this._countries.find(
                (country) => country._name === e.target.alt
            );

            // Move to country location
            this._myMap.flyTo(
                countryClicked._coords,
                countryClicked._zoomLevel,
                {
                    animate: true,
                    duration: 2,
                }
            );

            // Show cities list of clicked country, if country has one
            if (countryClicked._cities) {
                // Check if clicked country has already open list
                /*   if (
                    this._activeList &&
                    this._activeList.parentElement.previousElementSibling
                        .dataset.country === countryClicked._name
                ) {
                     this._activeList.style.maxHeight = "0";
                       this._activeList = null;
                    return;
                }*/

                // Check if some other country has open list
                if (this._activeList) {
                    this._activeList.style.maxHeight = "0";
                }

                // Add list to clicked country
                // Calculate dynamic height of list container (due to CSS heigth transition)
                // Get number of cities
                const numOfCities = Object.keys(countryClicked._cities).length;
                // Get fontsize of list item from CSS
                const listItemFontSize = window
                    .getComputedStyle(document.documentElement)
                    .getPropertyValue("--listFontSize");
                // Calcutale and set new height
                const newMaxHeight =
                    Number.parseFloat(listItemFontSize) * numOfCities * 1.3;
                this._activeList =
                    target.parentElement.nextElementSibling.firstChild;
                this._activeList.style.maxHeight = `${newMaxHeight}rem`;
            } else if (this._activeList) {
                // If clicked country has no list but some other list
                // is open, hide it
                this._activeList.style.maxHeight = "0";
                this._activeList = null;
            }
        }

        // City from list was clicked
        if (target.classList.contains("citiesList__item")) {
            const city = target.textContent;
            const countryName = target.closest(".citiesList")
                .previousElementSibling.dataset.country;
            const countryObject = this._countries.find(
                (country) => country._name === countryName
            );
            const coords = countryObject._cities[city].coords;
            const zoomLevel = countryObject._cities[city].zoomLevel;

            this._myMap.flyTo(coords, zoomLevel, {
                animate: true,
                duration: 2,
            });
        }
    }

    _showCitiesList(country) {
        const flagElement = document.querySelector(
            `[data-country="${country._name}"]`
        );
        const nextElement = flagElement.nextElementSibling;
        if (nextElement.classList.contains("citiesList")) {
            // Country cities list already exits, delete it
            nextElement.remove();
            return;
        }

        let listHTML =
            "<li class='citiesList'><div class = 'citiesList__container citiesList__container--hidden'><ul>";
        for (const city of Object.keys(country._cities)) {
            listHTML += `<li class='citiesList__item'>${city}</li>`;
        }
        listHTML += "</ul></div></li>";
        console.log(listHTML);
        flagElement.insertAdjacentHTML("afterend", listHTML);

        console.log(flagElement.nextElementSibling);

        console.log(
            flagElement
                .closest(".country")
                .nextElementSibling.querySelector(".citiesList__container")
        );
        flagElement
            .closest(".country")
            .nextElementSibling.querySelector(".citiesList__container")
            .classList.remove("citiesList__container--hidden");
    }

    _sidebarShowHide() {
        //
        sidebarArrow.classList.toggle("sidebar__arrow--rotate");
        sidebar.classList.toggle("sidebar--hidden");
    }

    // Public methods

    addCountry(country) {
        this._countries.push(country);
        // this._loadCountries();
        this._addFlag(country);
        this._addPlaces(country);
    }

    _deleteCountry(country) {
        const countryItem = this._countries.find((cn) => cn._name === country);

        // Remove markers on map
        for (const place of countryItem._places) {
            this._myMap.removeLayer(place._marker);
        }

        const countryEl = countriesList.querySelector(
            `[data-country="${country}"`
        );

        // Remove flag from list
        countryEl.remove();

        // Remove country from countries array
        this._countries.splice(
            this._countries.findIndex((con) => con._name === country),
            1
        );
    }
}

class Country {
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
                alt="${this._name}">
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

class Place {
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

// IIFE
(function () {
    const app = new App();

    // --------------
    // --- Poland ---
    // --------------

    const countryPoland = new Country("Poland", [51.253, 20.626], 7, {
        Warsaw: { coords: [52.228, 20.995], zoomLevel: 12 },
        Krakow: { coords: [50.061, 19.938], zoomLevel: 14 },
    });

    countryPoland.addPlace(
        new Place("Palace of Culture and Science", [52.232, 21.006])
    );
    countryPoland.addPlace(
        new Place("Warsaw Uprising Museum", [52.232, 20.981])
    );

    countryPoland.addPlace(
        new Place("Castle Square", [52.247418546319174, 21.01367599535141])
    );

    countryPoland.addPlace(new Place("The Cloth Hall", [50.061645, 19.9375]));

    app.addCountry(countryPoland);

    // ---------------
    // --- Czechia ---
    // ---------------

    const countryCzechia = new Country("Czechia", [50.082, 14.427], 12);

    countryCzechia.addPlace(new Place("Charles Bridge", [50.08644, 14.412091]));

    countryCzechia.addPlace(
        new Place("Prague astronomical clock", [50.08699, 14.4207])
    );

    app.addCountry(countryCzechia);

    // ---------------
    // --- Austria ---
    // ---------------

    const countryAustria = new Country("Austria", [48.206, 16.38], 10);

    countryAustria.addPlace(
        new Place("St. Stephen's Cathedral", [48.2084, 16.3731])
    );

    app.addCountry(countryAustria);

    // ---------------
    // --- Hungary ---
    // ---------------

    const countryHungary = new Country("Hungary", [47.498, 19.032], 13);

    countryHungary.addPlace(
        new Place("Hungarian Parliament", [47.507149, 19.045868])
    );

    app.addCountry(countryHungary);

    // --------------
    // --- France ---
    // --------------

    const countryFrance = new Country("France", [48.859, 2.321], 11);

    countryFrance.addPlace(new Place("Eiffel Tower", [48.85837, 2.294251]));
    countryFrance.addPlace(
        new Place("Sacré-Cœur Basilica", [48.886708, 2.3430346])
    );
    countryFrance.addPlace(
        new Place("Arc de Triomphe", [48.8738111, 2.2950382])
    );
    countryFrance.addPlace(new Place("Notre-Dame", [48.853063, 2.349744]));

    app.addCountry(countryFrance);

    // -------------
    // --- Italy ---
    // -------------

    const countryItaly = new Country("Italy", [43.849, 11.114], 7, {
        Rome: { coords: [41.901, 12.488], zoomLevel: 12 },
        Milan: { coords: [45.466, 9.187], zoomLevel: 13 },
        Florence: { coords: [43.772, 11.255], zoomLevel: 13.5 },
        Pisa: { coords: [43.722, 10.395], zoomLevel: 15 },
    });

    countryItaly.addPlace(new Place("Colloseum", [41.8902071, 12.492338]));
    countryItaly.addPlace(new Place("Trevi Fountain", [41.901006, 12.4832461]));
    countryItaly.addPlace(new Place("Vatican City", [41.9021796, 12.453393]));
    countryItaly.addPlace(
        new Place("Castel Sant'Angelo", [41.903042, 12.4663538])
    );

    countryItaly.addPlace(new Place("Milan Cathedral", [45.464138, 9.1917677]));

    countryItaly.addPlace(new Place("Tower of Pisa", [43.7229452, 10.3966224]));

    countryItaly.addPlace(new Place("Palazzo Vecchio", [43.7693321, 11.25611]));
    countryItaly.addPlace(new Place("Ponte Vecchio", [43.768, 11.2531663]));
    countryItaly.addPlace(
        new Place("Florence Cathedral", [43.7731504, 11.2565556])
    );

    app.addCountry(countryItaly);

    // ----------------------
    // --- United Kingdom ---
    // ----------------------

    const countryUK = new Country("United Kingdom", [51.61, -0.277], 10, {
        London: { coords: [51.504, -0.117], zoomLevel: 12 },
        "St Albans": { coords: [51.75, -0.34], zoomLevel: 14 },
    });

    countryUK.addPlace(
        new Place("Buckingham Palace", [51.501084, -0.14237103])
    );
    countryUK.addPlace(
        new Place("St. Paul's Cathedral", [51.513725, -0.09857725])
    );
    countryUK.addPlace(new Place("Tower Bridge", [51.505433, -0.07543276]));
    countryUK.addPlace(
        new Place("Palace of Westminster", [51.49945982, -0.1247642])
    );

    countryUK.addPlace(
        new Place("St Albans Cathedral", [51.7504512, -0.3424302])
    );

    app.addCountry(countryUK);

    // ----------------
    // --- Slovenia ---
    // ----------------

    const countrySlovenia = new Country("Slovenia", [46.225, 14.237], 10, {
        Ljubljana: { coords: [46.049, 14.501], zoomLevel: 14 },
        Bled: { coords: [46.376, 14.08], zoomLevel: 13 },
    });

    countrySlovenia.addPlace(new Place("Lake Bled", [46.3642987, 14.095313]));
    countrySlovenia.addPlace(
        new Place("Vintgar Gorge", [46.393542, 14.085736])
    );

    countrySlovenia.addPlace(
        new Place("Ljubljanica", [46.043802, 14.50599372])
    );
    countrySlovenia.addPlace(
        new Place("Ljubljana Castle", [46.0488916, 14.5084678])
    );

    app.addCountry(countrySlovenia);

    // -------------------
    // --- Switzerland ---
    // -------------------

    app.addCountry(new Country("Switzerland", [46.002, 8.949], 11));

    // ----------------------------
    // --- United Arab Emirates ---
    // ----------------------------

    const countryUAE = new Country(
        "United Arab Emirates",
        [24.735, 54.564],
        9,
        {
            Dubai: { coords: [25.101, 55.181], zoomLevel: 10 },
            "Abu Dhabi": { coords: [24.415, 54.397], zoomLevel: 11 },
        }
    );

    countryUAE.addPlace(new Place("Burj Khalifa", [25.1971727, 55.273786]));
    countryUAE.addPlace(new Place("Arabian Desert", [25.166519, 55.573838]));
    countryUAE.addPlace(new Place("Burj Al Arab", [25.1412635, 55.185394]));
    countryUAE.addPlace(
        new Place("Sheikh Zayed Mosque", [24.4125214, 54.475366])
    );

    app.addCountry(countryUAE);

    // -------------
    // --- Qatar ---
    // -------------

    const countryQatar = new Country("Qatar", [25.283, 51.466], 11);

    countryQatar.addPlace(
        new Place("Aspire Tower", [25.262384659045377, 51.44494028604675])
    );

    countryQatar.addPlace(
        new Place("Doha Night City", [25.313800053103524, 51.522377047898786])
    );

    //The Pearl-Qatar
    countryQatar.addPlace(
        new Place("The Pearl Monument", [25.291369687274504, 51.53363183585993])
    );

    app.addCountry(countryQatar);

    // --------------
    // --- Turkey ---
    // --------------

    const countryTurkey = new Country("Turkey", [38.698, 35.158], 10, {
        Kayseri: { coords: [38.722, 35.485], zoomLevel: 12 },
        Cappadocia: { coords: [38.648, 34.843], zoomLevel: 12 },
    });

    app.addCountry(countryTurkey);

    // -----------------
    // --- Sri Lanka ---
    // -----------------

    const countrySriLanka = new Country("Sri Lanka", [6.368, 80.522], 10, {
        Galle: { coords: [6.032, 80.216], zoomLevel: 14 },
        Udawalawa: { coords: [6.434, 80.851], zoomLevel: 13 },
        Deniyaya: { coords: [6.343, 80.556], zoomLevel: 15 },
    });

    countrySriLanka.addPlace(
        new Place("Udawalawe Safari", [6.4681752, 80.864655])
    );
    countrySriLanka.addPlace(new Place("Galle Fort", [6.027507, 80.216967]));
    countrySriLanka.addPlace(
        new Place("Tea Plantation", [6.3419237, 80.534229])
    );
    app.addCountry(countrySriLanka);

    // ----------------
    // --- Thailand ---
    // ----------------

    const countryThailand = new Country("Thailand", [11.548, 100.307], 6.3, {
        Bangkok: { coords: [13.718, 100.537], zoomLevel: 11 },
        Ayutthaya: { coords: [14.355, 100.569], zoomLevel: 13 },
        "Koh Samui": { coords: [9.505, 99.812], zoomLevel: 10.5 },
    });

    countryThailand.addPlace(
        new Place("Wat Plai Laem", [9.5713914, 100.066971])
    );
    countryThailand.addPlace(
        new Place("Na Mueang Waterfall", [9.4662645, 99.98389])
    );
    countryThailand.addPlace(new Place("Wat Arun", [13.7437, 100.488898]));
    countryThailand.addPlace(
        new Place("Sanphet Prasat", [13.5460457, 100.628524])
    );
    countryThailand.addPlace(
        new Place("Ang Thong National Park", [9.6394751, 99.671693])
    );
    countryThailand.addPlace(new Place("Grand Palace", [13.7496656, 100.4913]));
    countryThailand.addPlace(
        new Place("Ayutthaya Historical Park", [14.3567587, 100.5670365])
    );

    app.addCountry(countryThailand);

    // ----------------
    // --- Cambodia ---
    // ----------------

    const countryCambodia = new Country("Cambodia", [13.385, 103.861], 12);

    countryCambodia.addPlace(
        new Place("Angkor Wat", [13.412523190616056, 103.86610352384471])
    );

    countryCambodia.addPlace(
        new Place("Ta Prohm Temple", [13.434898442939396, 103.88877838450254])
    );

    countryCambodia.addPlace(
        new Place("Bayon Temple", [13.441041470953483, 103.8591873490537])
    );

    countryCambodia.addPlace(new Place("Siem Reap City", [13.362, 103.865]));

    app.addCountry(countryCambodia);

    // ----------------
    // --- Malaysia ---
    // ----------------

    //app.addCountry(new Country("Malaysia", [3.128, 101.668], 11));

    const countryMalaysia = new Country("Malaysia", [3.128, 101.668], 11);

    countryMalaysia.addPlace(
        new Place("Batu Caves", [3.2376805173344976, 101.68335361344508])
    );
    countryMalaysia.addPlace(
        new Place("Thean Hou Temple", [3.1219644073423036, 101.68767418386837])
    );

    countryMalaysia.addPlace(
        new Place("Petronas Towers", [3.1573726513637927, 101.7120936516849])
    );

    app.addCountry(countryMalaysia);
})();
