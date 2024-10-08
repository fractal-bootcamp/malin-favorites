import express from 'express'
import { createServer } from "http"
import { PrismaClient } from '@prisma/client';
import { clerkClient, clerkMiddleware, getAuth, requireAuth, type User } from '@clerk/express';
import cors from 'cors';
import 'dotenv/config'

// create an express app
const app = express();
// create the prisma client
const prisma = new PrismaClient();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// clerk middleware function checks the request cookies and headers for a session jwt.
// if found attaches the Auth object to the request object under the auth key
app.use(clerkMiddleware())

type UserStructure = {
  id:         String;  
  uniqueId:   String;
  email:      String;
  name?:      String;
  favorites?: Movie[];
}

type Director = {
  id: string;
  name: string;
}

type Genre = {
  id: string;
  name: string;
}

type Movie = {
  id: string;
  title: string;
  description: string;
  genres: Genre[];
  director: Director;
  releaseDate: string;
  posterUrl: string;
  favoritedBy: UserStructure[]
}

// protect your routes by redirecting unauthenticated users to the sign-in page
// requireAuth is used to protect the /protected route
// if user is not authenticated and enters a protected route they are redirected to the sign-in route
app.get('/protected', requireAuth({ signInUrl: '/sign-in '}), async(req, res) => {
  console.log('in protected')
// if the user is authenticated, this helper is used to get the userId
  const {userId} = getAuth(req)
// this process fetches the current user's User object from the Clerk API
  if (userId) {
    // user is where the users specific personal info is stored
    const user = await clerkClient.users.getUser(userId)
    console.log(user)
    //access the user data object from Clerk and extract email and other info
    const email: string = user.emailAddresses[0]?.emailAddress
    const { 
      id: userID, 
      imageUrl, 
      username, 
      firstName,
    } = user

    // IS THERE A WAY TO NOT DO THIS EVERY TIME THE USER REFRESHES?
    const storeUserInDatabase = await prisma.user.upsert({
      where: {
        uniqueId: userID,
      },
      update: {},
      create: {
        uniqueId: userID,
        email: email,
        name: username,
      }
    })
  }
})

app.post('/api/movies/favorites', async (req, res) => {
  
})

// first we need a /GET request for the frontend to query movie data from
app.get('/api/movies/search', async (req, res) => {
  // destructure the request query and assign the value to query
  const { query } = req.query;
  // explicitly check that the query is a string
  const searchQuery = typeof query === "string" ? query : "";
  // call the psql database and store the related movies in a variable as an objectc
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});