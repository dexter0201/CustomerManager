var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SettingsSchema = new Schema({
    collectionName : {
        type : String,
        required: true,
        trim: true,
        default: 'customers'
    },
    nextSeqNumber: {
        type: Number,
        default: 1
    }
});

var OrderSchema = new Schema({
    product : {
        type : String,
        required: true,
        trim: true
    },
    price : {
        type : Number,
    },
    quantity : {
        type : Number,
    }
});

var CustomerTypeScheme = new Schema({
    id: {
        type : Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
});

var CustomerSchema = new Schema({
    firstName : {
        type : String,
        required: true,
        trim: true
    },
    lastName : {
        type : String,
        required: true,
        trim: true
    },
    email : {
        type : String,
        required: true,
        trim: true
    },
    address : {
        type : String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    gender : {
        type : String,
    },
    id : {
        type : Number,
        required: true,
        unique: true
    },
    orderCount : {
        type : Number,
    },
    phone: {
        type: String,
        required: true
    },
    facebook: {
        type: String
    },
    orders: [OrderSchema],
    type: {
        type: Schema.Types.ObjectId,
        ref: 'Type'
    }
});

CustomerSchema.index({
    id: 1,
    type: 1
}); // schema level

// I make sure this is the last pre-save middleware (just in case)
var Settings = mongoose.model('settings', SettingsSchema);

CustomerSchema.pre('save', function (next) {
    var doc = this;
    // Calculate the next id on new Customers only.
    if (this.isNew) {
        Settings.findOneAndUpdate({
            'collectionName': 'customers'
        }, {
            $inc: {
                nextSeqNumber: 1
            }
        }, function (err, settings) {
            if (err) {
                next(err);
            }

            doc.id = settings.nextSeqNumber - 1; // substract 1 because I need the 'current' sequence number, not the next
            next();
        });
    } else {
        next();
    }
});

exports.CustomerSchema = CustomerSchema;
module.exports = mongoose.model('Customer', CustomerSchema);
