const { response } = require("express");
const db = require("../database/models");

const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    // Do the magic
    db.Product.findAll()
      .then((products) => {
        return res.render("products", {
          products,
          toThousand,
        });
      })
      .catch((error) => console.log(error));
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    // Do the magic

    db.Product.findByPk(req.params.id)
      .then((product) => {
        return res.render("detail", {
          ...product.dataValues,
          toThousand,
        });
      })
      .catch((error) => console.log(error));
  },

  // Create - Form to create
  create: (req, res) => {
    // Do the magic
    db.Category.findAll({
      order: ["name"],
    })
      .then((categories) => {
        return res.render("product-create-form", {
          categories,
        });
      })
      .catch((error) => console.log(error));
  },

  // Create -  Method to store
  store: (req, res) => {
    const { name, description, price, discount, categoryId } = req.body;
    db.Product.create({
      name: name.trim(),
      price,
      discount,
      description: description.trim(),
      categoryId,
    })
      .then((newProduct) => {
        return res.redirect("/products/detail/" + newProduct.id);
      })
      .catch((error) => console.log(error));
  },

  // Update - Form to edit
  edit: (req, res) => {
    // Do the magic
    const categories = db.Category.findAll({
      order: ["name"],
    });

    const product = db.Product.findByPk(req.params.id);

    Promise.all([categories, product])
      .then(([categories, product]) => {
        return res.render("product-edit-form", {
          ...product.dataValues,
          categories,
        });
      })
      .catch((error) => console.log(error));
  },
  // Update - Method to update
  update: (req, res) => {
    // Do the magic

    const { name, price, discount, categoryId, description } = req.body;

    db.Product.update(
      {
        name: name.trim(),
        price,
        discount,
        description: description.trim(),
        categoryId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
        .then((response) => {
          console.log(response);
          return res.redirect("/products/detail/" + req.params.id);
        })
        .catch((error) => console.log(error))
    );
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    // Do the magic
    db.Product.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((response) => {
        console.log(response);
        return res.redirect("/products");
      })
      .catch((error) => console.log(error));
  },
};

module.exports = controller;
