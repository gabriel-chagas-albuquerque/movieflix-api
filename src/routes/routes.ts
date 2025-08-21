import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
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
router.post("/", async (req, res) => {
  try {
    const { title, genre_id, language_id, oscar_count, release_date } =
      req.body;

    const verificaDuplicacao = await prisma.movie.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (verificaDuplicacao) {
      return res
        .status(409)
        .json({ message: "Já existe um filme com o mesmo nome" });
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
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, genre_id, language_id, oscar_count, release_date } =
      req.body;

    const verificaExistenciaId = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!verificaExistenciaId) {
      return res.status(404).json({ message: "O filme não existe" });
    }

    const verificaDuplicacao = await prisma.movie.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (verificaDuplicacao) {
      return res
        .status(409)
        .json({ message: "Já existe um filme com o mesmo nome" });
    }
    await prisma.movie.update({
      where: {
        id,
      },
      data: {
        title,
        genre_id,
        language_id,
        oscar_count,
        release_date: new Date(release_date),
      },
    });

    return res
      .status(200)
      .json({ message: "Informações do filme atualizadas com sucesso" });
  } catch (err) {
    return res.status(500).json({
      message: "Houve um erro ao atualizar as informações do filme",
      error: err,
    });
  }
});

export default router;
