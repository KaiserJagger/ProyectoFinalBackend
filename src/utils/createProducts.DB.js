import productModel from "../dao/models/product.model.js";

export const createProductsDB = async () => {
  const existingProducts = await productModel.countDocuments();
  if (!existingProducts) {
    const products = await productModel.insertMany([
      {
        "title": "Notebook DELL",
        "description": "Potente laptop para tareas de trabajo y diseño.",
        "price": 998.99,
        "category": "Laptops",
        "status": "Available",
        "thumbnails": [
          "laptop_dell.jpg"
        ],
        "code": "LENTR002",
        "stock": 4
      },
      {
        "title": "Placa de video MSI 4080",
        "description": "Potente tarjeta grafica ideal para gamers y diseñadores.",
        "price": 350.99,
        "category": "Graphics Cards",
        "status": "Available",
        "thumbnails": [
          "placa_msi_4080.jpg"
        ],
        "code": "PENTP005",
        "stock": 5
      },
      {
        "title": "SSD 500GB KINGSTON",
        "description": "Disco de estado solido de alta velocidad y almacenamiento",
        "price": 999.99,
        "category": "Storage",
        "status": "Available",
        "thumbnails": [
          "ssd_kingston_500.jpg"
        ],
        "code": "LENTP001",
        "stock": 50
      }
    ]);
  }
};
