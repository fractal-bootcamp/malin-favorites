import { PrismaClient } from '@prisma/client';
import { movieData } from './movieData';

const prisma = new PrismaClient();

type MovieData = {
  title: string;
  director: string;
  description: string;
  genre: string[];
  releaseDate?: string | undefined;
  posterUrl: string;
}

const typedMovieData: MovieData[] = movieData;

async function deleteAllData() {
  // Use a transaction to ensure all deletions happen or none happen
  await prisma.$transaction([
    // Delete all movies first (because they reference directors and genres)
    prisma.movie.deleteMany(),
    // Then delete all genres
    prisma.genre.deleteMany(),
    // Finally delete all directors
    prisma.director.deleteMany(),
  ]);

  console.log('All data has been deleted');
}

deleteAllData();