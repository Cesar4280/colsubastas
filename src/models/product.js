const { join } = require("path");
const { model, Schema } = require("mongoose");

const ProductSchema = new Schema({
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    image_url:   { type: String, required: true, unique: true },
    description: { type: String, required: true },
    active:      { type: Boolean, default: true }
},{
    timestamps: true, //TODO: add creation and update datetime
    versionKey: false //FIXME: remove mongo version key 
});

ProductSchema.methods = function generateImageUrl() {
    this.image_url = this.name.concat(Date.now.toString());
};

module.exports = model("Product", ProductSchema);