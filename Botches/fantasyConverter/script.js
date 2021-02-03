//Use meter as base
let from = null;
let to = null;
const systems = {
    'metric': {
        'meter': {
            'value': 1,
        },
        'centimeter': {
            'value': 100,
        }
    },
    'imperial': {
        'inch': {
            'value': 39.37
        },
        'feet': {
            'value': 3.28084
        },
        'mile': {
            'value': 0.00062137119224,
        }
    }
};

//https://www.thermofisher.com/nl/en/home/references/ambion-tech-support/rna-tools-and-calculators/orders-of-magnitude-prefixes-for-si-units.html
const siUnits = {
    '18': "exa",
    '15': "peta",
    '12': "tera",
    '9': "giga",
    '6': "mega",
    '3': "kilo",
    '2': "hecto",
    '1': "deca",
    '-1': "deci",
    '-2': "centi",
    '-3': "mili",
    '-6': "micro",
    '-9': "nano",
    '-12': "pico",
    '-15': "femto",
    '-18': "atto",
};

function init() {
    // Populate the selectors
    fillFrom();
    fillTo(systems.imperial);
    document.querySelector("#calc").addEventListener('click', () => calculate());
}

//Flatten object if nessecary
function getCleanObj(system = null) {
    let res = {};
    let obj = systems;
    console.log(system)
    if (system) {
        Object.keys(system).map(unit => {
            res[unit] = system[unit].value;
        });
    } else {
        //flatten object
        Object.keys(obj).map(key => {
                Object.keys(obj[key]).map(unit => {
                        res[unit] = obj[key][unit].value;
                    }
                );
            }
        )
    }
    return res;
}

//Fill the 'from' selector
function fillFrom(system = null) {
    let data = getCleanObj(system);
    let selector = document.querySelector("#fromUnit");
    fillSelect(selector, data);
}

//fill the 'to' selector
function fillTo(system = null) {
    let data = getCleanObj(system);
    let selector = document.querySelector("#toUnit");
    fillSelect(selector, data);
}

//Generate the element and populate
function fillSelect(select, data) {
    Object.keys(data).map(unit => {
            //Append units to from selector
            let node = document.createElement("option");
            node.value = data[unit];
            node.innerHTML = unit;
            select.append(node);
        }
    );
}

function calculate() {
    let fromNumber = document.querySelector("#fromNumber").value;
    let fromUnitSelector = document.querySelector("#fromUnit");
    let fromUnit = fromUnitSelector[fromUnitSelector.selectedIndex].value;
    let fromUnitName = fromUnitSelector[fromUnitSelector.selectedIndex].innerHTML;
    let toUnitSelector = document.querySelector("#toUnit");
    let toUnit = toUnitSelector[toUnitSelector.selectedIndex].value;
    let toUnitName = toUnitSelector[toUnitSelector.selectedIndex].innerHTML;

    //Convert from to meters
    let calc = fromNumber;
    calc = calc / fromUnit;
    calc = calc * toUnit;
    if(calc > 10){
        calc = Math.ceil(calc);
    }

    //Beautify it
    // Get the magnitute
    let mag = convert(calc);
    console.log("b4 mag", calc);
    calc = calc * Math.pow(10, mag);
    console.log("Magdix; ", calc);
    let prefix = getPrefix(mag);
    let unit = prefix.prefix + "" + toUnitName;
    calc = calc * Math.pow(10, prefix.rest);
    document.querySelector("#result").innerHTML = `${fromNumber} ${fromUnitName} converts to ${calc} ${unit}`;
}
function convert(n) {
    let order = Math.floor(Math.log(n) / Math.LN10
        + 0.000000001); // because float math sucks like that
    return order;
}

function getPrefix(magnitude){
    let keys = Object.keys(siUnits);
    let rest = 0;
    while(!keys.includes(magnitude.toString())){
        if(magnitude < 0){
            magnitude++;
            rest --;
        } else {
            magnitude--;
            rest++;
        }
    }
    return {
        "prefix": siUnits[magnitude],
        "rest": rest
    }
}
init();
