const { httpResponse } = require("../helpers");
const { isValidObjectId } = require("mongoose");
const { Bid, User, Product } = require("../models");

exports.getBid = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const bid = await Bid.findOne({ _id: id, active: true });
        return bid === null ?
            httpResponse(response, 404, "Puja no encontrada") :
            httpResponse(response, 200, "Puja encontrada", bid);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Servicio inactivo en el momento");
    }
};

exports.getBids = async (request, response) => {
    try {
        const bids = await Bid.find({ active: true });
        httpResponse(response, 200, "Listado de Pujas", bids);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Algo ha ido mal en el servidor");
    }
};

exports.getWinner = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const bid = await Bid.findOne({ _id: id, active: true });
        if (bid === null) return httpResponse(response, 404, "Puja no encontrada");
        httpResponse(response, 200, "Ganador de la subasta", bid.getWinner());
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Algo ha ido mal en el servidor");
    }
};

exports.addBid = async (request, response) => {
    try {
        const { product_id, datetime = {} } = request.body;
        const { opening, cancel, ending }   = datetime;
        if (!isValidObjectId(product_id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const product = await Product.findOne({ _id: product_id, active: true});
        if (product === null) return httpResponse(response, 404, "Producto no encontrado");
        const bid = new Bid({
            product_id:    product._id,
            initial_price: product.price,
            datetime:   {
                opening: new Date(opening),
                cancel:  new Date(cancel),
                ending:  new Date(ending)
            }
        });
        await bid.save();
        httpResponse(response, 201, "Puja agregada al sistema", bid);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};

exports.addContestant = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const bid = await Bid.findOne({ _id: id, active: true });
        if (bid === null) return httpResponse(response, 404, "Puja no encontrada");
        const current = new Date();
        const { opening, ending } = bid.datetime;
        if (opening > current) return httpResponse(response, 409, "Subasta no iniciada");
        if (ending  <= current) return httpResponse(response, 409, "Subasta terminada");
        const { id: _id, price } = request.body;
        if (!isValidObjectId(_id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const user = await User.findOne({ _id, active: true });
        if (user === null) return httpResponse(response, 404, "Usuario no encontrado");
        if (price === undefined) return httpResponse(response, 400, "Debe especificar el precio a ofrecer");
        if (price < bid.initial_price) return httpResponse(response, 400, "Precio ofertado no es valido");
        const winner = bid.getWinner();
        if (winner !== null) if (price <= winner.price) return httpResponse(response, 400, "Precio ofertado inferior a la puja anterior");
        bid.contestants.push({ _id, price });
        await bid.save();
        httpResponse(response, 201, "Concursante agregado a la puja");
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};

exports.removeContestant = async (request, response) => {
    try {
        const { id, _id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        if (!isValidObjectId(_id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const bid = await Bid.findOne({ _id: id, active: true });
        if (bid === null) return httpResponse(response, 404, "Puja no encontrada");
        const winner = bid.getWinner();
        if (winner === null) return httpResponse(response, 400, "No hay concursantes en la subasta");
        if (winner._id.toString() !== _id) return httpResponse(response, 409, "No eres ganador actual de la puja");
        const current = new Date();
        const { opening, cancel } = bid.datetime;
        if (opening > current) return httpResponse(response, 409, "Subasta no iniciada");
        if (current > cancel) return httpResponse(response, 409, "Tiempo de cancelacion de puja finalizado");
        const newWinner = await bid.cancelBidAndGetWinner();
        httpResponse(response, 200, "Has cancelado tu ultima puja", newWinner);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};

exports.updateProduct = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const product = await Product.findOne({ _id: id, active: true });
        if (product === null) return httpResponse(response, 404, "Producto no encontrado");
        const { name, price, description } = request.body;
        if (Boolean(name)) product.name = name;
        if (Boolean(price)) product.price = price;
        if (Boolean(description)) product.description = description;
        await product.save();
        httpResponse(response, 200, "Producto actualizado");
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};

exports.removeProduct = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const product = await Product.findOne({ _id: id, active: true });
        if (product === null) return httpResponse(response, 404, "Producto no encontrado");
        product.active = false;
        await product.save();
        httpResponse(response, 200, "Producto eliminado");
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};