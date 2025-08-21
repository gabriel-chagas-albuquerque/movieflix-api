import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
app.use(express.json());
const prisma = new PrismaClient();

app.get("/movies", async (req, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: {
      title: "asc",
    },
    include: {
      genres: true,
      languages: true,
    },
    omit: {
      genre_id: true,
      language_id: true,
    },
  });
  res.json(movies);
});

app.post("/movies", async (req, res) => {
  try {
    const { title, genre_id, language_id, oscar_count, release_date } =
      req.body;

    const verificaDuplicacao = await prisma.movie.findFirst({
      where: {
        title: {
          equals:title,
          mode:"insensitive",
        },
      },
    });

    if (verificaDuplicacao) {
      return res.status(409).json({ message: "Filme já cadastrado" });
    }
    const movie = await prisma.movie.create({
      data: {
        title,
        genre_id,
        language_id,
        oscar_count,
        release_date: new Date(release_date),
      },
    });

    return res.status(201).json({
      message: "Filme adicionado com sucesso",
      data: movie,
    });
  } catch (err) {
    res.status(500).json({
      message: "Houve um problema ao adicionar o filme",
      erro: err,
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
