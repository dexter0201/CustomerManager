var db = db.getSiblingDB('customermanager');

var types = [
    {
        id: 1,
        name: ' Khách lẻ'
    }, {
        id: 2,
        name: 'Khách sỉ'
    }
];

db.types.remove({});

for (var i = 0; i < types.length; ++i) {
    db.types.insert({
        id: types[i].id,
        name: types[i].name
    });
}