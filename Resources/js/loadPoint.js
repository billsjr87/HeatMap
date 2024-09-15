function loadFakeDOMforJQuery() {
    var document = self.document = { parentNode: null, nodeType: 9, toString: function () { return "FakeDocument" } };
    var window = self.window = self;
    var fakeElement = Object.create(document);
    fakeElement.nodeType = 1;
    fakeElement.toString = function () { return "FakeElement" };
    fakeElement.parentNode = fakeElement.firstChild = fakeElement.lastChild = fakeElement;
    fakeElement.ownerDocument = document;

    document.head = document.body = fakeElement;
    document.ownerDocument = document.documentElement = document;
    document.getElementById = document.createElement = function () { return fakeElement; };
    document.createDocumentFragment = function () { return this; };
    document.getElementsByTagName = document.getElementsByClassName = function () { return [fakeElement]; };
    document.getAttribute = document.setAttribute = document.removeChild =
        document.addEventListener = document.removeEventListener =
        function () { return null; };
    document.cloneNode = document.appendChild = function () { return this; };
    document.appendChild = function (child) { return child; };
}

loadFakeDOMforJQuery();
importScripts('papaparse.min.js');
importScripts('GeoJson.js');
importScripts('xlsx.full.min.js');

onmessage = function (event) {
    // console.log('Worker Load Point from ' + event.data[0] + ' started!');
    loadDataToArray(event.data[1], event.data[2], event.data[3], event.data[4], event.data[5], event.data[6])
        .then((response) => {
            // console.log('Worker Load Point from ' + event.data[0] + ' completed!');
            self.postMessage({ source: event.data[0], result: response });
        })
        .catch(error => console.error(error));
}

async function loadDataToArray(fileLoc, fileType, geo = false, lat = "Latitude", lng = "Longitude", convert = 0) {
    // If param geo == true, transform coordinates and return geoJson
    if (geo) {
        // geo == true and type == xlsx
        if (fileType && fileType == 'xlsx') {
            async function loadXlsxFile(fileLoc) {
                return await fetch(fileLoc)
                    .then(resp => resp.arrayBuffer())
                    .then(arrayBuffer => {
                        var workbook = XLSX.readFile(arrayBuffer);
                        var sheet = workbook.Sheets[workbook.SheetNames[0]];
                        return XLSX.utils.sheet_to_row_object_array(sheet);
                    })
                    .catch(error => console.error(error));
            }
            return convertToGeoJsonFromArray(await loadXlsxFile(fileLoc), lat, lng);
        }
        //  geo == true and type == json
        else if (fileType && fileType == 'json') {
            let response =
                await fetch(fileLoc)
                    .then(resp => resp.json())
                    .then(json => { return json; })
                    .catch(error => console.error(error));

            if (convert == 1) {
                response.forEach(item => {
                    item[lat] = convertStringToNumber(item[lat]);
                    item[lng] = convertStringToNumber(item[lng]);
                });
                return convertToGeoJsonFromArray(response, lat, lng);
            } else {
                return convertToGeoJsonFromArray(response, lat, lng);
            }

        }
        //  geo == true and type other than xlsx and json
        else {
            return await fetch(fileLoc)
                .then(resp => resp.text())
                .then(text => {
                    return responseTextToGeoJson(text);
                })
                .catch(error => console.error(error));
        }
    }
    // If param geo == false, return json 
    else {
        // If param geo == false and type == json
        if (fileType && fileType == 'json') {
            return await fetch(fileLoc)
                .then(resp => resp.json())
                .then(json => { return json; })
                .catch(error => console.error(error));
        }
        // If param geo == false and type == xlsx
        else if (fileType && fileType == 'xlsx') {
            async function loadXlsxFile(fileLoc) {
                return await fetch(fileLoc)
                    .then(resp => resp.arrayBuffer())
                    .then(arrayBuffer => {
                        var workbook = XLSX.readFile(arrayBuffer);
                        var sheet = workbook.Sheets[workbook.SheetNames[0]];
                        return XLSX.utils.sheet_to_row_object_array(sheet);
                    })
                    .catch(error => console.error(error));
            }
            return loadXlsxFile(fileLoc);
        }
        else {
            let response = fetch(fileLoc);
            return stringToArray(response);
        }
    }

    function convertStringToNumber(string) {
        return Number(string);
    }

    /** PARSE ARRAY TO GEOJSON **/
    function convertToGeoJsonFromArray(array, latitude = "Latitude", longitude = "Longitude") {
        var output = {};
        output['type'] = 'FeatureCollection';
        var temp_array = [];
        array.forEach(item => {
            var temp = {};
            temp['type'] = 'Feature';
            temp['geometry'] = { "type": "Point", "coordinates": [item[longitude], item[latitude]] };
            temp['properties'] = item;
            temp_array.push(temp);
        });
        output['features'] = temp_array;
        return output;
    }

    /* PARSE AJAX RESPONSE TEXT TO GEOJSON */
    function responseTextToGeoJson(data, latColumnName = "Latitude", longColumnName = "Longitude", type = 1) {
        var csvObject = Papa.parse(data.trim(), { dynamicTyping: true }).data;
        return GeoJSON.parse(
            latLonColumnsToNumbers(massageData(csvObject), latColumnName, longColumnName),
            {
                Point: [latColumnName, longColumnName],
            }
        );

    }

    /* TRANSFORM CSV TO ARRAY FOR GEOJSON */
    function massageData(text) {
        if (!text || !text.length) return null;
        var firstRow = text[0];
        var map = text.map(function (item) {
            var returnItem = {},
                i = 0;
            firstRow.forEach(function (columnName) {
                returnItem[columnName] = item[i++];
            });
            return returnItem;
        });
        map.shift();
        return map;
    }

    /* GEO JSON CONVERSION FUNCTION */
    function latLonColumnsToNumbers(data, latName, lonName) {
        return data.map(function (item) {
            if (Object.hasOwn(item, "latname")) {
                item[latName] = parseFloat(item[latName]);
            }
            if (Object.hasOwn(item, "lonName")) {
                item[lonName] = parseFloat(item[lonName]);
            }
            return item;
        });
    }

    /* PARSE PLAIN TEXT RESPONSE TO ARRAY */
    function stringToArray(text) {
        let lines = text.split(/(?:\r\n|\n)+/).filter(function (el) { return el.length != 0 });
        let headers = lines.splice(0, 1)[0].split(csvDelimiter);
        let elements = [];
        for (var i = 0; i < lines.length; i++) {
            let element = {};
            let j = 0;
            if (lines[i].match("\".*\"")) {
                var value = lines[i].split(/((?:[^",]|(?:"(?:\\{2}|\\"|[^"])*?"))*)/g);
                value = value.filter(a => a != ",");
                value.shift();
                for (var y = 0; y < headers.length; y++) {
                    if (value[y]) {
                        if (value[y].includes('\"\"')) {
                            value[y] = value[y].replace(/\"\"/g, '');
                        }
                    }
                    element[headers[j]] = value[y];
                    j++;
                }
            } else {
                var value = lines[i].split(csvDelimiter);
                for (var y = 0; y < headers.length; y++) {
                    element[headers[j]] = value[y];
                    j++;
                }
            }
            elements.push(element);
        }
        return elements;
    }

}