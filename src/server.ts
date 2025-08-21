import express from "express";
import router from "./routes/routes.js";

const port = 3000;
const app = express();

app.use(express.json());
app.use("/movies", router);
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
