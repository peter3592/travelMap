//const { render } = require("node-sass");
import App from "./app_modules/App.js";
import Country from "./app_modules/Country.js";
import Place from "./app_modules/Place.js";

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
    countryItaly.addPlace(
        new Place("Sforzesco Castle", [45.470424, 9.1791394])
    );

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
    const countrySwitzerland = new Country("Switzerland", [46.004, 8.944], 12);

    countrySwitzerland.addPlace(new Place("Lugano", [46.00562835, 8.94764338]));

    app.addCountry(countrySwitzerland);

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
    /*
    const countryTurkey = new Country("Turkey", [38.698, 35.158], 10, {
        Kayseri: { coords: [38.722, 35.485], zoomLevel: 12 },
        Cappadocia: { coords: [38.648, 34.843], zoomLevel: 12 },
    });

    app.addCountry(countryTurkey);*/

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

// TESTING WEATHER API

// Using XMLHttpRequest

/*
const request = new XMLHttpRequest();

request.responseType = "json";

request.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?lat=48.1486&lon=17.1077&appid=89e796cf8888849d282255778bed06bd&units=metric`
);
request.send();

request.onload = function () {
    console.log(this.response);
};*/

// Using Fetch API
/*
const printWeather = function (lat, lng) {
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
        });
};
*/
