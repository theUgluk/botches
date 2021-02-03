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
            'value': 39.37,
        },
        'foot': {
            'value': 3.28084,
        },
        'yard': {
            'value': 1.09361,
        },
        'chain': {
            'value': 0.0497097,
        },
        'furlong': {
            'value': 0.0497097,
        },
        'mile': {
            'value': 0.00062137119224,
        },
        'league': {
            'value': 0.000179986,
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
    console.info("SiUnits: ", siUnits);
    console.info("Input variables: ", input);
    let nNumber = calculate(input.nIn, input.nUnitIn, input.nUnitOut);
    console.info('nNumber before thousands', nNumber);
    //Get the magnitude and simplify to thousands
    let [nResult, nMagnitude] = convertToThousand(nNumber);
    console.info('converdToThousand', nResult, nMagnitude);
    let [nResNumber, sPrefix] = convertToSI(nResult, nMagnitude);
    console.log("Result convertToSI: ", nResNumber, sPrefix);
    let el = document.querySelector("#result");
    nResNumber = parseFloat(nResNumber).toLocaleString("nl-NL", {
        maximumFractionDigits: 3
    });
    let sNewUnit = sPrefix + input.sUnitOut;
    el.innerHTML = `${input.nIn} ${input.sUnitIn} converts to ${nResNumber} ${sNewUnit}`;
}
// @ Does the conversion between units
// @Returns [nNumber]
function calculate(nIn, nUnitIn, nUnitOut) {
    //@TODO cleanup inputs
    let fromNumber = nIn;
    // let fromUnitSelector = document.querySelector("#fromUnit");
    let fromUnit = nUnitIn;
    // let fromUnitName = fromUnitSelector[fromUnitSelector.selectedIndex].innerHTML;
    // let toUnitSelector = document.querySelector("#toUnit");
    let toUnit = nUnitOut;
    // let toUnitName = toUnitSelector[toUnitSelector.selectedIndex].innerHTML;
    console.debug(fromUnit, toUnit);
    //Convert from to meters
    let nNumber = fromNumber;
    // Do conversion
    nNumber = nNumber / fromUnit * toUnit;
    return nNumber
}

/*
 * @ Fixes number and provides SI prefix
 * @Returns: [nNumber, sPrefix]
 */
function convertToSI(nNumber, nMagnitude) {
    nMagnitude = nMagnitude * -1;
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
    let nTestNumberUp;
    let nCurrDown = nMagnitude;
    let nTestNumberDown;
    for(let i = 1; i < 5; i++){
        console.debug(i);
        nTestNumberDown = nNumber * Math.pow(10, nCurrDown);
        if(nTestNumberDown > 10 && nTestNumberDown < 10000 && indexes.includes(nCurrDown.toString())){
            console.log("as");
            return [nTestNumberDown, siUnits[nCurrDown]]
        }
        nTestNumberUp = nNumber * Math.pow(10, nCurrUp);
        if(nTestNumberUp > 10 && nTestNumberUp < 10000 && indexes.includes(nCurrUp.toString())){
            return [nTestNumberUp , siUnits[nCurrUp]];
        }
        nCurrDown--;
        nCurrUp++;
    }
    alert("Difference top big");
    return [nTestNumberDown, siUnits[nMin]];
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
 * @ Get all input fields, checks them for numerals and return them in 1 object
 * @Returns {
 *  nIn: number,
 *  sUnitIn: string,
 *  nUnitIn: num
 *  sUnitOut: string
 *  nUnitOut: num
 * }
 */
function getInputs() {
    //@TODO check for filled
    let nIn = document.querySelector("#fromNumber").value;

    let elUnitIn = document.querySelector("#fromUnit");
    elUnitIn = elUnitIn[elUnitIn.selectedIndex];
    let sUnitIn = elUnitIn.text;
    let nUnitIn = elUnitIn.value;

    let elUnitOut = document.querySelector("#toUnit");
    elUnitOut = elUnitOut[elUnitOut.selectedIndex];
    let sUnitOut = elUnitOut.text;
    let nUnitOut = elUnitOut.value;
    return {
        'nIn': nIn,
        'sUnitIn': sUnitIn,
        'nUnitIn': nUnitIn,
        'sUnitOut': sUnitOut,
        'nUnitOut': nUnitOut
    };
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
