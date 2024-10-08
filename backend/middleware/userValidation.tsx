import { clerkClient, clerkMiddleware, getAuth, requireAuth, type User } from '@clerk/express';
import { PrismaClient } from '@prisma/client';

// every time the server recieves a request it will run this middleware first
const userValidation = function (req, res, next) {
  // if the user is authenticated, this helper is used to get the userId
  const { userId } = getAuth(req)

}