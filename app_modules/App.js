// 'map' is id of HTML element where should be map displayed
const countriesList = document.querySelector(".countries");
//const content = document.querySelector(".content");
const photo = document.querySelector(".photo");
const backdrop = document.querySelector(".backdrop");
const backdropDots = document.querySelector(".backdrop__dots");
const sidebar = document.querySelector(".sidebar");
const sidebarLogo = document.querySelector(".sidebar__logo");
const sidebarTitle = document.querySelector(".sidebar__title");
const sidebarArrow = sidebar.querySelector(".sidebar__arrow");
const sidebarMouse = sidebar.querySelector(".sidebar__mouse");
const weatherIcon = document.querySelector(".weather__icon");
const mapElement = document.getElementById("map");

const weather = document.querySelector(".weather__data");
const weatherTherm = document.querySelector(".weather__data__therm");
const weatherHumidity = document.querySelector(".weather__data__humidity");
const weatherWind = document.querySelector(".weather__data__wind");

globalThis.imgLoadedFlag1 = false;
globalThis.imgLoadedFlag2 = false;

export default class App {
    _myMap;
    _countries = [];
    _markers = [];
    _defaultCoords = [37, 35];
    _defaultZoomLevel = 2;
    _activeList = null;
    _weatherMode = false;

    static photoIcon = L.icon({
        iconUrl: "img/icons/camera-icon.png",
        // shadowUrl: "leaf-shadow.png",

        iconSize: [22, 22], // size of the icon
        //  shadowSize: [50, 64], // size of the shadow
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        //  shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -30], // point from which the popup should open relative to the iconAnchor
    });

    constructor() {
        this._loadMap();
        countriesList.addEventListener("click", this._sidebarClick.bind(this));
        photo.addEventListener("click", this._closePhoto.bind(this));
        sidebarArrow.addEventListener("click", this._sidebarShowHide);
        // Mouse Wheel
        sidebar.addEventListener("wheel", (e) => {
            // Scrolling Down
            if (e.deltaY > 0) {
                sidebarMouse.remove();
            }
        });

        weatherIcon.addEventListener(
            "click",
            this._weatherModeActivate.bind(this)
        );

        backdrop.addEventListener("click", this._closePhoto.bind(this));

        setTimeout(
            this.animatedText.bind(null, sidebarTitle, "Travel Map"),
            100
        );
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
        /* this._myMap.on("click", function (e) {
            console.log("TEST");
            console.log(this);
            printWeather(+e.latlng.lat, +e.latlng.lng);
        });*/

        this._myMap.on("click", this._getCurrentWeather.bind(this));
    }

    _getCurrentWeather(e) {
        if (!this._weatherMode) return;
        //printWeather(+e.latlng.lat, +e.latlng.lng);

        if (weather.classList.contains("weather__data--hidden"))
            weather.classList.remove("weather__data--hidden");

        const lat = +e.latlng.lat;
        const lng = +e.latlng.lng;

        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=89e796cf8888849d282255778bed06bd&units=metric`
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                console.log("City:", data.name);
                console.log("Temperature:", data.main.temp, "°C");
                console.log("Humidity:", data.main.humidity, "%");
                console.log(
                    "Wind speed:",
                    (data.wind.speed * 3.6).toFixed(0),
                    "km/h"
                );

                weatherTherm.textContent = `${data.main.temp.toFixed(0)} °C`;
                weatherHumidity.textContent = `${data.main.humidity} %`;
                weatherWind.textContent = `${(data.wind.speed * 3.6).toFixed(
                    0
                )} km/h`;
            });
    }

    _addPlaces(country) {
        for (const place of country._places) {
            this._addMarker(place);
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
                console.log(this);
                this.openPopup();
            })
            .on("mouseout", function () {
                this.closePopup();
            });
    }

    _openPhoto(e) {
        //     if (this._weatherMode) return;

        backdrop.classList.remove("backdrop__hidden");
        backdropDots.classList.remove("backdrop__dots__hidden");

        photo.innerHTML = "";
        const placeName = e.target.options.alt;

        globalThis.imgLoadedFlag1 = false;
        globalThis.imgLoadedFlag2 = false;

        console.log(placeName);

        const html = `
        <div class="photo__container">
            <img src="img/${placeName}.jpg" onload='globalThis.imgLoadedFlag1=true' alt="">
            <div class="btn__container">
                <img src="img/${placeName}.jpg" onload='globalThis.imgLoadedFlag2=true' alt="">
                <button class="photo__btn">&#10005;</button>
            </div>
        </div>`;

        photo.insertAdjacentHTML("afterbegin", html);

        // Waiting until photo is loaded
        const intervalID = setInterval(function () {
            console.log(imgLoadedFlag1, imgLoadedFlag2);
            if (globalThis.imgLoadedFlag1 && globalThis.imgLoadedFlag2) {
                backdropDots.classList.add("backdrop__dots__hidden");
                photo.classList.remove("photo--hidden");
                clearInterval(intervalID);
            }
        }, 100);
    }

    _closePhoto(e) {
        //   if (this._weatherMode) return;

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
                // Check if some other country has open list
                if (this._activeList) {
                    // Hide others country cities list
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
                // Calculate and set dynamic height of list
                const newMaxHeight =
                    Number.parseFloat(listItemFontSize) * numOfCities * 1.35;
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
            const countryName =
                target.closest(".citiesList").previousElementSibling.dataset
                    .country;
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

    _sidebarShowHide() {
        //
        sidebarArrow.classList.toggle("sidebar__arrow--rotate");
        sidebar.classList.toggle("sidebar--hidden");
        sidebarTitle.classList.toggle("sidebar--hidden");
        sidebarLogo.classList.toggle("sidebar--hidden");
        countriesList.classList.toggle("sidebar--hidden");
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

    animatedText(element, text) {
        let index = 1;

        const animationID = setInterval(function () {
            if (text[index] === " ") {
                index++;
            }
            element.innerHTML = text.slice(0, index);
            index++;
            if (index - 1 === text.length) {
                sidebarLogo.classList.remove("sidebar__logo--hidden");
                clearInterval(animationID);
                return;
            }
        }, 180);
    }

    _weatherModeActivate() {
        weatherIcon.classList.toggle("weather__icon--active");
        mapElement.classList.toggle("map__weather");
        this._weatherMode = !this._weatherMode;
        console.log(this._weatherMode);
        if (!weather.classList.contains("weather__data--hidden"))
            weather.classList.add("weather__data--hidden");
    }
}
