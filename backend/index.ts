import express from 'express'
import { createServer } from "http"
import { PrismaClient } from '@prisma/client';

// create an express app
const app = express();
// create the prisma client
const prisma = new PrismaClient();

// Middleware to parse JSON bodies
app.use(express.json());

// first we need a /GET request for the frontend to query movie data from
app.get('/api/movies/search', async (req, res) => {
  // destructure the request query and assign the value to q
  const { q } = req.query;
  // explicitly check that the query is a string
  const searchQuery = typeof q === "string" ? q : "";
  // call the psql database and store the related movies in a variable as an object
  const movies = await prisma.movie.findMany({
    where: {
      OR: [
        { title: { contains: searchQuery, mode: 'insensitive'} },
        // use the relation between Movie and Director to perform a join operation behind the scenes.
        // search the name field in the related Director table for each movie
        { director: { name: { contains: searchQuery, mode: 'insensitive' } } },
        { genres: { some: { name: { contains: searchQuery, mode: 'insensitive'} } } }
      ]
    },
    // return all the information from the related director and genre tables too
    include: {
      director: true,
      genres: true
    },
    take: 20
  });
  console.log('returning a movies object:', movies, typeof(movies))
  // send the movies object back to the client as a json object
  res.json(movies)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});