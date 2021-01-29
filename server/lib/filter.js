const findACategory = (categories, text) => {
    return categories.filter(category => category.FILTER_CATEGORY === text);
}

const isEmpty = (param) => {
    return Object.keys(param).length === 0;
}

const getObjValues = (req, text) => {
    const arr = [];
    let obj;
    isEmpty(req.query) ? obj = req.body : obj = req.query;
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