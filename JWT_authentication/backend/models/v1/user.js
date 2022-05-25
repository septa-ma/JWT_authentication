const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');

const AddressSchema = new mongoose.Schema({
    store_id: { type: String },
    city : { type: String, trim: true, match: /[آ-یa-zA-Z0-9]/, maxlength: 50 },
    state : { type: String, trim: true, match: /[آ-یa-zA-Z0-9]/, maxlength: 50 },
    postal_code : { type: Number, maxlength: 11 },
    detail : { type: String, trim: true, match: /[آ-یa-zA-Z0-9]/, maxlength: 200 },
    locations: { type: String },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String
    },
    email : { type: String, dropDups: true, match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },
    telphone : { type: Number, dropDups: true, maxlength: 10 },
    created_at: { type: Date, default: Date.now }
});

const userSchema = new Schema({

    qrcode : { type: String, trim: true, unique : true, dropDups: true, default: 'dose n0t0ot have qr!!!' },
    delete_key : { type: Number, min: 10, max: 12, required: true, default: 10 },
    verify_code : {
        code : { type: Number, trim: true, default: null},
        created_at: { type : Date, default: Date.now}
    },
    personal_info : {
        first_name : { type: String, trim: true, match: /[آ-یa-zA-Z]/, maxlength: 50 },
        last_name : { type: String, trim: true, match: /[آ-یa-zA-Z]/, maxlength: 50 },
        user_name : { type: String, trim: true, match: /[آ-یa-zA-Z0-9_]/, unique: true, maxlength: 50, sparse: true },
        password : { type: String, /*required: true,*/ minlength: 8 },
        project_type : { type: Number, maxlength: 6 }, // user az kodom proje dare miad: ( HPA -> 8161, HPW -> 81623, HPAD -> 81614, TB -> 220, GG -> 77, GW -> 723 )
        birth_date : { type: Date, default: Date.now },
        bio: { type: String, match: /[a-zA-Z0-9.!#$%&*+/=?^_{|}~-]/,  maxlength: 250 },
        gender : { type: String, enum: ['F', 'M', 'other'] },
        phone_number : { type: Number, dropDups: true, unique : true, maxlength: 11 }
    },
    address_info : [AddressSchema],
    request_id : [{ type: Schema.Types.ObjectId, ref: 'requests' }]
    
});
userSchema.plugin(timestamp,{
    createdAt: 'created_at',
    updatedAt: 'update_at'
});

module.exports = mongoose.model('users', userSchema);