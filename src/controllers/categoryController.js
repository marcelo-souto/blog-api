// Funcoes de Apoio
import sendResponse from "../config/server/sendResponse.js";

// Modelos
import Category from "../models/Category.js";

const categoryController = {
  getAll: async (req, res) => {
    
    try {
      const categories = await Category.findAll();
      return sendResponse(res, 200, null, categories);

    } catch (error) {
      return sendResponse(res, 400, error.message);
    }
  },
  getById: async (req, res) => {},
  create: async (req, res) => {},
  update: async (req, res) => {},
  delete: async (req, res) => {},
};

export default categoryController;
