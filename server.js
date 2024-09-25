import { fastify } from "fastify";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

// Inicializando o banco de dados
const database = new DatabasePostgres();

// Rota para criar um vídeo
server.post("/videos", async (request, response) => {
  try {
    const { title, description, duration } = request.body;

    await database.create({
      title,
      description,
      duration,
    });

    return response.status(201).send({ message: "Vídeo criado com sucesso" });
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    return response.status(500).send({ error: "Erro ao criar vídeo" });
  }
});

// Rota para listar vídeos (com suporte a pesquisa)
server.get("/videos", async (request, response) => {
  try {
    const search = request.query.search;
    const videos = await database.list(search);
    return response.status(200).send(videos);
  } catch (error) {
    console.error("Erro ao listar vídeos:", error);
    return response.status(500).send({ error: "Erro ao listar vídeos" });
  }
});

// Rota para atualizar um vídeo
server.put("/videos/:id", async (request, response) => {
  try {
    const videoId = request.params.id;
    const { title, description, duration } = request.body;

    await database.update(videoId, {
      title,
      description,
      duration,
    });

    return response.status(204).send();
  } catch (error) {
    console.error("Erro ao atualizar vídeo:", error);
    return response.status(500).send({ error: "Erro ao atualizar vídeo" });
  }
});

// Rota para deletar um vídeo
server.delete("/videos/:id", async (request, response) => {
  try {
    const videoId = request.params.id;
    await database.delete(videoId);

    return response.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar vídeo:", error);
    return response.status(500).send({ error: "Erro ao deletar vídeo" });
  }
});

// Iniciar o servidor
server.listen({
  host: "0.0.0.0",
  port: process.env.PORT ?? 3333,
});
