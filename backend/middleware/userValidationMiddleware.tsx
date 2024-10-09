import { clerkClient, clerkMiddleware, getAuth, requireAuth, type User } from '@clerk/express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// every time the server recieves a request it will run this middleware first
export const userValidationMiddleware = async (req, res, next) => {
  try {
    // if the user is authenticated, this helper is used to get the userId
    const { userId } = getAuth(req)
    // this process fetches the current user's User object from the Clerk API
    if (userId) {
      // user is where the users specific personal info is stored
      const user = await clerkClient.users.getUser(userId)
      //access the user data object from Clerk and extract email and other info
      const email: string = user.emailAddresses[0]?.emailAddress
      const {
        id: userID,
        username,
      } = user

      // check whether the user exists in the db, if they do skip, if the don't create a new entry
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
    next();
  } catch (error) {
    console.error('Error in userValidationMiddleware:', error)
    next(error);
  }
};