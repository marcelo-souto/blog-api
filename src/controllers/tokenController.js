import { verifyToken } from "../functions/handleToken.js";

const tokenController = {
  validate: async (req, res) => {
    const { accessToken } = req.body;

    try {
      verifyToken(accessToken, "accessToken");
      return res.status(200).send(true);
    } catch (error) {
      return res.status(401).send(false);
    }
  },
};

export default tokenController;
