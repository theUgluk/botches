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
        },
        'kilometer': {
            'value': 0.001,
        },
    },
    'imperial': {
        'thou': {
            value: 39370.1,
        },
        'barleycorn': {
            value: 118.11,
        },
        'inch': {
            'value': 39.37
        },
        'foot': {
            'value': 3.28084
        },
        'yard': {
            'value': 1.09361
        },
        'chain': {
            'value': 0.0497097
        },
        'furlong': {
            'value': 0.0497097
        },
        'mile': {
            'value': 0.00062137119224,
        },
        'league': {
            'value': 0.000179986
        },
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
    '-21': 'septo'
};

function init() {
    // Populate the selectors
    fillSelect(document.querySelector("#fromUnit"));
    fillSelect(document.querySelector("#toUnit"), systems.imperial);
    document.querySelector("#calc").addEventListener('click', () => process());
}

function process() {
    let input = getInputs();
    console.info("Input variables: ", input);
    let nNumber = calculate(input.nIn, input.nUnitIn, input.nUnitOut);
    console.debug("nNumber: " + convertToThousand(nNumber));
    //Get the magnitude and simplify to thousands
    let [nResult, nMagnitude] = convertToThousand(nNumber);
    console.debug(convertToSI(nResult, nMagnitude));
    let [nResNumber, sPrefix] = convertToSI(nResult, nMagnitude);
    console.log("Result convertToSI: ", nResNumber, sPrefix);
    let el = document.querySelector("#result");
    nResNumber = nResNumber.toLocaleString("nl-NL", {
        maximumFractionDigits: 3
    });
    let sNewUnit = sPrefix + input.sUnitOut;
    el.innerHTML = `${input.nIn} ${input.sUnitIn} converts to ${nResNumber} ${sNewUnit}`;
}
/*
 * @Description gets does the conversion between units
 * @Returns [nNumber]
 */
function calculate(nIn, nUnitIn, nUnitOut) {
    //@TODO cleanup inputs
    let fromNumber = nIn;
    // let fromUnitSelector = document.querySelector("#fromUnit");
    let fromUnit = nUnitIn;
    // let fromUnitName = fromUnitSelector[fromUnitSelector.selectedIndex].innerHTML;
    // let toUnitSelector = document.querySelector("#toUnit");
    let toUnit = nUnitOut;
    // let toUnitName = toUnitSelector[toUnitSelector.selectedIndex].innerHTML;

    //Convert from to meters
    let nNumber = fromNumber;
    // Do conversion
    nNumber = nNumber / fromUnit * toUnit;
    return nNumber
}

/*
 * @Description fixes number and provides SI prefix
 * @Returns: [nNumber, sPrefix]
 */
function convertToSI(nNumber, nMagnitude) {
    //Get mix/max magnitude
    let indexes = Object.keys(siUnits);
    let nMin = indexes[indexes.length - 1];
    let nMax = Math.max.apply(Math, Object.keys(siUnits));
    //Check min/max boundries
    if(nMagnitude > nMax){
        return [nMagnitude, siUnits[nMax]];
    }
    if(nMagnitude < nMin){
        return [nMagnitude, siUnits[nMin]];
    }
    let nCurrUp = nMagnitude
    let nCurrDown = nMagnitude;
    for(let i = 1; i < 5; i++){
        if(indexes.includes(nCurrDown.toString())){
            return [nNumber, siUnits[nCurrDown]]
        }
        if(indexes.includes(nCurrUp.toString())){
            return [nNumber , siUnits[nCurrUp]];
        }
        nCurrDown--;
        nCurrUp++;
    }
}

/*=============================
 #     #  #######  ###  #
 #     #     #      #   #
 #     #     #      #   #
 #     #     #      #   #
 #     #     #      #   #
 #     #     #      #   #
  #####      #     ###  #######
================================ */

/*
 * @Description Get all input fields, checks them for numerals and return them in 1 object
 * @Returns {
 *  nIn: number,
 *  sUnitIn: string,
 *  nUnitIn: num
 *  sUnitOut: string
 *  nUnitOut: num
 * }
 */
function getInputs() {
    let nIn = document.querySelector("#fromNumber").value;

    let elUnitIn = document.querySelector("#fromUnit");
    elUnitIn = elUnitIn[elUnitIn.selectedIndex];
    let sUnitIn = elUnitIn.text;
    let nUnitIn = elUnitIn.value;

    let elUnitOut = document.querySelector("#toUnit");
    elUnitOut = elUnitOut[elUnitOut.selectedIndex];
    let sUnitOut = elUnitOut.text;
    let nUnitOut = elUnitOut.value;
    let oReturn =  {
        'nIn': nIn,
        'sUnitIn': sUnitIn,
        'nUnitIn': nUnitIn,
        'sUnitOut': sUnitOut,
        'nUnitOut': nUnitOut
    };
    return oReturn;
}

//Flatten object if nessecary
function getCleanObj(system) {
    let res = {};
    let obj = systems;
    if (!Object.keys(system).includes('metric')) {
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


//Generate the element and populate
function fillSelect(select, data = systems) {
    data = getCleanObj(data)
    Object.keys(data).map(unit => {
            //Append units to from selector
            let node = document.createElement("option");
            node.value = data[unit];
            node.innerHTML = unit;
            select.append(node);
        }
    );
}

/*
 * @ Checks if n is between 1.000 and 10.000, if not converts it between those to and returns the result + magnitude needed
 * @returns [number, nMagnitude: number]
 */
function convertToThousand(nResult) {
    let nReturn = nResult
    let nMagnitude = 0;
    // While nReturn is not between 1.00 and 10.00
    while (nReturn < 100 || nReturn > 1000) {
        if (nReturn < 100) {
            nMagnitude++;
            nReturn = nReturn * 10;
        } else {
            nMagnitude--;
            nReturn = nReturn / 10;
        }
    }
    return [nReturn, nMagnitude];
}

init();
