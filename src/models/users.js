const { model, Schema } = require("mongoose");
const { hash, compare, genSalt } = require("bcryptjs");

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    document: {
        _type: { type: String, required: true },
        number: { type: String, required: true, unique: true },
        issue_date: { type: Date, required: true }
    },
    birthdate: { type: Date, required: true },
    active: { type: Boolean, default: true }
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

UserSchema.statics.checkMessage = async function (user) {
    try {
        let found = await this.findOne({ username: user.username });
        if (found !== null) return "Nombre de usuario ya registrado";
        found = await this.findOne({ email: user.email });
        if (found !== null) return "Correo electrónico ya registrado";
        found = await this.findOne({ "document.number": user.document.number });
        if (found !== null) return "Número de documento ya registrado";
        return "";
    } catch (error) {
        throw error;
    }
};

module.exports = model("Usuario", UserSchema);