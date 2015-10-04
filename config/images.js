/* jslint node: true */

exports.images = {
    'images/island.jpg': [{
        width: 150,
        rename: 'images/island-150.jpg'
    }, {
        width: 150,
        rename: 'images/island-x1.jpg'
    }, {
        width: 300,
        rename: 'images/island-x2.jpg'
    }]
};

exports.config = {
    quality: 90,
    errorOnUnusedImage: false,
    passThroughUnused: true
};
