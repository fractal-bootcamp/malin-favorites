// Import the PrismaClient from the @prisma/client package
// This client allows us to interact with our database
import { PrismaClient } from '@prisma/client';

// Import the movie data from our separate movieData file
import { movieData } from './movieData';

// Create a new instance of PrismaClient
const prisma = new PrismaClient();

// Define types for our movie data structure
type MovieData = {
  title: string;
  director: string;
  description: string;
  genre: string[];
  releaseDate?: string | undefined;
  posterUrl: string;
}

// Ensure movieData conforms to MovieData type
const typedMovieData: MovieData[] = movieData;

// Define the main function to insert movies
async function main() {
  // Loop through each movie in our movieData array
  for (const movie of typedMovieData) {
    // First, try to find the director
    let director = await prisma.director.findUnique({
      where: { name: movie.director },
    });

    // If the director doesn't exist, create them
    if (!director) {
      director = await prisma.director.create({
        data: { name: movie.director },
      });
    }

    // Upsert each genre for the movie
    // We use Promise.all to perform these operations concurrently
    const genres = await Promise.all(
      movie.genre.map(genreName =>
        prisma.genre.upsert({
          where: { name: genreName },  // Look for a genre with this name
          update: {},  // If found, don't update anything
          create: { name: genreName },  // If not found, create a new genre
        })
      )
    );

    // Create the movie record and connect it to the director and genres
    // Upsert the movie
    await prisma.movie.upsert({
      where: { title: movie.title },  // Assuming title is unique
      update: {
        description: movie.description,
        releaseDate: movie.releaseDate || 'Unknown',
        posterUrl: movie.posterUrl,
        director: { connect: { id: director.id } },
        genres: { set: genres.map(genre => ({ id: genre.id })) },
      },
      create: {
        title: movie.title,
        description: movie.description,
        releaseDate: movie.releaseDate || 'Unknown',
        posterUrl: movie.posterUrl,
        director: { connect: { id: director.id } },
        genres: { connect: genres.map(genre => ({ id: genre.id })) },
      },
    });

    // Log progress to the console
    console.log(`Inserted movie: ${movie.title} with ${movie.posterUrl}`);
  }

  // Log completion message
  console.log('All movies have been inserted!');
}

// Execute the main function
main()
  .catch((e: Error) => {
    // If an error occurs, log it to the console and exit the process
    console.error('Error in movie insertion', e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect from the database when the script is done
    // This is important for cleaning up the database connection
    await prisma.$disconnect();
  });