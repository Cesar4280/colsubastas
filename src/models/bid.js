const { model, Schema } = require("mongoose");

const BidSchema = new Schema({
    product_id:   { type: String, required: true },  // se soltara el ultimo si es necesario
    contestants:  { type: Array,   default: []   }, //TODO: [ { id: 1, price: 100 }, { id: 2, price: 200 }, { id: 3, price: 300 } ]
    datetime:     {
        opening:  { type: Date, required: true },
        cancel:   { type: Date, required: true },
        ending:   { type: Date, required: true },
    },
    active:       { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});

BidSchema.methods = function getWinner() {
    const length = this.contestants.length;
    return this.contestants[length - 1];
};

BidSchema.methods = async function cancelBidAndGetWinner() {
    try {
        this.contestants.pop();
        await this.save();
        return this.getWinner();
    } catch (error) {
        throw error;
    }
};

module.exports = model("Puja", BidSchema);