const { model, Schema } = require("mongoose");

const BidSchema = new Schema({
    product_id:    { type: String, required: true },  // se soltara el ultimo si es necesario
    contestants:   { type: Array,   default: []   }, //TODO: [ { id: 1, price: 100 }, { id: 2, price: 200 }, { id: 3, price: 300 } ]
    initial_price: { type: Number, required: true },
    datetime:      {
        opening:   { type: Date, required: true },
        cancel:    { type: Date, required: true },
        ending:    { type: Date, required: true },
    },
    active:        { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});

BidSchema.methods.getWinner = function () {
    try {
        const length = this.contestants.length;
        if (length === 0)  return null;
        return this.contestants[length - 1];
    } catch (error) {
        throw error;
    }
};

BidSchema.methods.cancelBidAndGetWinner = async function () {
    try {
        this.contestants.pop();
        await this.save();
        return this.getWinner();
    } catch (error) {
        throw error;
    }
};

module.exports = model("Puja", BidSchema);