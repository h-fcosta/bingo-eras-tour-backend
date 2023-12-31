import { Request, Response } from "express";
import prisma from "../db/dbConnect";

export default class SongAndSinglesController {
  static async getSongsAndSingles(req: Request, res: Response) {
    try {
      const songs = await prisma.song.findMany({
        include: {
          links: true,
          album: {
            select: {
              release_order: true,
              album_color: true
            }
          }
        },
        orderBy: {
          album: {
            release_order: "asc"
          }
        }
      });

      const singles = await prisma.single.findMany({
        include: {
          links: true,
          album: {
            select: {
              release_order: true,
              album_color: true
            }
          }
        },
        orderBy: {
          album: {
            release_order: "asc"
          }
        }
      });

      const songsAndSingles = [...songs, ...singles].sort(
        (a, b) =>
          Number(a.album?.release_order) - Number(b.album?.release_order)
      );

      return res.json(songsAndSingles);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAlbums(req: Request, res: Response) {
    try {
      const albums = await prisma.album.findMany({
        orderBy: {
          release_order: "asc"
        }
      });

      const albumsOrder = albums.sort(
        (a, b) => Number(a.release_order) - Number(b.release_order)
      );

      return res.json(albumsOrder);
    } catch (error: any) {
      console.error("Error:", error);
    }
  }
}
