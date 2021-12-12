const { model, Schema } = require("mongoose");
const { hash, compare, genSalt } = require("bcryptjs");

const UserSchema = new Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true },
    username:  { type: String, required: true },
    password:  { type: String, required: true },
    document:  { 
        _type:      { type: String, required: true },
        number:     { type: String, required: true },
        issue_date: { type: Date,   required: true }
    },
    birthdate: { type: Date, required: true }
}, {
    timestamps: true, 
    versionKey: false
});

UserSchema.methods.encryptPassword = async password => {
    const salt = await genSalt();
    return await hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
    return await compare(password, this.password);
};

module.exports = model("Usuario", UserSchema);