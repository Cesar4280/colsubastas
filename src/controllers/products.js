const { Product } = require("../models");
const { httpResponse } = require("../helpers");
const { isValidObjectId } = require("mongoose");
const { generateRandom } = require("../helpers/datetime");

exports.getProduct = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const product = await Product.findOne({ _id: id, active: true });
        return product === null ?
            httpResponse(response, 404, "Producto no encontrado") :
            httpResponse(response, 200, "Producto encontrado", product);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Servicio inactivo en el momento");
    }
};

exports.getProducts = async (request, response) => {
    try {
        const products = await Product.find({ active: true });
        httpResponse(response, 200, "Listado de Productos", products);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Algo ha ido mal en el servidor");
    }
};

exports.addProduct = async (request, response) => {
    try {
        const product = new Product({
            name:        request.body.name,
            price:       request.body.price,
            image_url:   `${request.body.name}_${Date.now()}_${generateRandom(1, 100)}.PNG`,
            description: request.body.description
        });
        await product.save();
        httpResponse(response, 201, "Producto agregado al sistema", product);
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
        if(Boolean(name))        product.name = name;
        if(Boolean(price))       product.price = price;
        if(Boolean(description)) product.description = description;
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