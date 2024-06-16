const configuration = Array(10);

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
    console.log(configuration);
};