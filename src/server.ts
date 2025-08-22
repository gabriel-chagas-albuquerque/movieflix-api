import express from "express";
import router from "./routes/routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with {type:'json'}

const port = 3000;
const app = express();

app.use(express.json());
app.use("/movies", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
