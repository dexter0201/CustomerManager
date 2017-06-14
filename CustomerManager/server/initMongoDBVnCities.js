var db = db.getSiblingDB('customermanager');

var cities = [
    {
        name: 'Bắc Giang',
        isProvince: true
    }, {
        name: 'Bắc Kạn',
        isProvince: true
    }, {
        name: 'Cao Bằng',
        isProvince: true
    }, {
        name: 'Hà Giang',
        isProvince: true
    }, {
        name: 'Lạng Sơn',
        isProvince: true
    }, {
        name: 'Phú Thọ',
        isProvince: true
    }, {
        name: 'Quảng Ninh',
        isProvince: true
    }, {
        name: 'Thái Nguyên',
        isProvince: true
    }, {
        name: 'Tuyên Quang',
        isProvince: true
    }, {
        name: 'Lào Cai',
        isProvince: true
    }, {
        name: 'Yên Bái',
        isProvince: true
    }, {
        name: 'Điện Biên',
        isProvince: true
    }, {
        name: 'Hòa Bình',
        isProvince: true
    }, {
        name: 'Lai Châu',
        isProvince: true
    }, {
        name: 'Sơn La',
        isProvince: true
    }, {
        name: 'Bắc Ninh',
        isProvince: true
    }, {
        name: 'Hà Nam',
        isProvince: true
    }, {
        name: 'Hải Dương',
        isProvince: true
    }, {
        name: 'Hưng Yên',
        isProvince: true
    }, {
        name: 'Nam Định',
        isProvince: true
    }, {
        name: 'Ninh Bình',
        isProvince: true
    }, {
        name: 'Thái Bình',
        isProvince: true
    }, {
        name: 'Vĩnh Phúc',
        isProvince: true
    }, {
        name: 'Hà Nội',
        isProvince: false
    }, {
        name: 'Hải Phòng',
        isProvince: false
    }, {
        name: 'Hà Tĩnh',
        isProvince: true
    }, {
        name: 'Nghệ An',
        isProvince: true
    }, {
        name: 'Quảng Bình',
        isProvince: true
    }, {
        name: 'Quảng Trị',
        isProvince: true
    }, {
        name: 'Thanh Hóa',
        isProvince: true
    }, {
        name: 'Thừa Thiên–Huế',
        isProvince: true
    }, {
        name: 'Đắk Lắk',
        isProvince: true
    }, {
        name: 'Đắk Nông',
        isProvince: true
    }, {
        name: 'Gia Lai',
        isProvince: true
    }, {
        name: 'Kon Tum',
        isProvince: true
    }, {
        name: 'Lâm Đồng',
        isProvince: true
    }, {
        name: 'Bình Định',
        isProvince: true
    }, {
        name: 'Bình Thuận',
        isProvince: true
    }, {
        name: 'Khánh Hòa',
        isProvince: true
    }, {
        name: 'Ninh Thuận',
        isProvince: true
    }, {
        name: 'Phú Yên',
        isProvince: true
    }, {
        name: 'Quảng Nam',
        isProvince: true
    }, {
        name: 'Quảng Ngãi',
        isProvince: true
    }, {
        name: 'Đà Nẵng',
        isProvince: false
    }, {
        name: 'Bà Rịa–Vũng Tàu',
        isProvince: true
    }, {
        name: 'Bình Dương',
        isProvince: true
    }, {
        name: 'Bình Phước',
        isProvince: true
    }, {
        name: 'Đồng Nai',
        isProvince: true
    }, {
        name: 'Tây Ninh',
        isProvince: true
    }, {
        name: 'Hồ Chí Minh',
        isProvince: false
    }, {
        name: 'An Giang',
        isProvince: true
    }, {
        name: 'Bạc Liêu',
        isProvince: true
    }, {
        name: 'Bến Tre',
        isProvince: true
    }, {
        name: 'Cà Mau',
        isProvince: true
    }, {
        name: 'Đồng Tháp',
        isProvince: true
    }, {
        name: 'Hậu Giang',
        isProvince: true
    }, {
        name: 'Kiên Giang',
        isProvince: true
    }, {
        name: 'Long An',
        isProvince: true
    }, {
        name: 'Sóc Trăng',
        isProvince: true
    }, {
        name: 'Tiền Giang',
        isProvince: true
    }, {
        name: 'Trà Vinh',
        isProvince: true
    }, {
        name: 'Vĩnh Long',
        isProvince: true
    }, {
        name: 'Cần Thơ',
        isProvince: false
    }
];

db.cities.remove({});

for (var i = 0; i < cities.length; ++i) {
    var r = {
        id: i + 1,
        name: cities[i].name,
        isProvince: cities[i].isProvince
    };

    db.cities.insert(r);
}