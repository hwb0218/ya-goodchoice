const findACategory = (categories, text) => {
    return categories.filter(category => category.FILTER_CATEGORY === text);
}

const getObjValues = (req, text) => {
    const arr = [];
    const obj = req.query;
    Object.entries(obj).forEach(([key, value]) => {
        if (key.startsWith(text)) {
            arr.push(value);
        } else if (key.endsWith(text)) {
            arr.push(value);
        }
    });
    return arr.flat();
}

const getCategory = (req, text) => {
    return getObjValues(req, text).map(x => `,${x},`).join('|');
}

module.exports = {
    findACategory,
    getCategory,
    getObjValues
}