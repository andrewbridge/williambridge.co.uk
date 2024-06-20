const configuration = Array(10).fill('0');

const animals = [
    'cat',
    'snake',
    'dinosaur',
    'dog',
    'budgie'
];

const biomes = [
    'space',
    'beach',
    'city',
    'mountains',
    'spooky'
];

const weather = [
    'wind',
    'cloud',
    'sun',
    'night',
    'rain'
];

const configurationMap = {
    'animal': 0,
    'biome': 1,
    'weather': 2,
    'slot machine score': [3, 4, 5, 6],
    'tap score': [7, 8, 9]
}

export const setConfiguration = (type, value) => {
    if (!(type in configurationMap)) throw Error('Invalid configuration type');
    const index = configurationMap[type];
    const indexArray = !Array.isArray(index) ? [index] : index;
    const strValue = String(value);
    indexArray.forEach((i, index) => configuration[i] = strValue[index]);
};

export const getConfiguration = () => configuration.join('');

export const parseConfiguration = (configurationString) => {
    if (configurationString.length !== 10) throw Error('Invalid configuration string');
    if (!Number.isFinite(Number(configurationString))) throw Error('Configuration is not parsable');
    const configurationArray = configurationString.split('');
    const result = {};
    for (const [key, value] of Object.entries(configurationMap)) {
        let resultValue = null;
        let index = NaN;
        if (!Array.isArray(value)) {
            index = Number(configurationArray[value]);
        }
        switch(key) {
            case 'animal':
                resultValue = animals[index % animals.length];
                break;
            case 'biome':
                resultValue = biomes[index % animals.length];
                break;
            case 'weather':
                resultValue = weather[index % animals.length];
                break;
            case 'slot machine score':
            case 'tap score':
                resultValue = Number(configurationMap[key].map((index) => configurationArray[index]).join(''));
                break;
        }
        result[key.replaceAll(' ', '_')] = resultValue;
    }
    return result;
};