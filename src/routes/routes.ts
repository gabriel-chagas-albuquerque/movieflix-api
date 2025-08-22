import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
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
    return res.status(200).json(movies);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Houve um erro ao carregar os filmes" });
  }
});

router.get("/:genreName", async (req, res) => {
  try {
    const genreName = req.params.genreName;
    const moviesFilteredByGenre = await prisma.movie.findMany({
      where: {
        genres: {
          name: {
            equals: genreName,
            mode: "insensitive",
          },
        },
      },
      include: {
        genres: true,
        languages:true,
      }
    });

    if (!moviesFilteredByGenre) {
      return res
        .status(404)
        .json({ message: "Não existe filmes com esse gênero" });
    }

    return res.status(200).json(moviesFilteredByGenre);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Houve um erro na filtragem dos filmes" });
  }
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

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const verificaExistenciaId = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!verificaExistenciaId) {
      return res.status(404).json({ message: "O filme não existe" });
    }

    await prisma.movie.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Filme deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar o filme" });
  }
});
export default router;
