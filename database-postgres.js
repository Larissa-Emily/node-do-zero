import { randomUUID } from "node:crypto";
import { sql } from "./db.js";

export class DatabasePostgres {
  // Listar vídeos, com suporte à pesquisa por título
  async list(search) {
    let videos;
    if (search) {
      videos = await sql`select * from videos where title ilike ${'%' + search + '%'}`;
    } else {
      videos = await sql`select * from videos`;
    }
    return videos;
  }

  // Criar um novo vídeo
  async create(video) {
    const video_id = randomUUID();
    const { title, description, duration } = video;

    await sql`
      insert into videos (id, title, description, duration) 
      values (${video_id}, ${title}, ${description}, ${duration})
    `;
  }

  // Atualizar um vídeo
  async update(id, video) {
    const { title, description, duration } = video;

    await sql`
      update videos 
      set title = ${title}, description = ${description}, duration = ${duration} 
      where id = ${id}
    `;
  }

  // Deletar um vídeo
  async delete(id) {
    await sql`
      delete from videos where id = ${id}
    `;
  }
}
