/**
 * Authentication Middleware
 *
 * This middleware validates that requests include a valid user ID.
 *
 * TODO: For production, integrate with Clerk JWT verification:
 * 1. Install @clerk/express: npm install @clerk/express
 * 2. Use clerkMiddleware() to verify JWT tokens
 * 3. Extract userId from verified token instead of accepting it from client
 *
 * Current implementation provides basic validation but trusts client-provided userId.
 * This is NOT production-ready and should be enhanced with proper JWT verification.
 */

export function validateUserId(req, res, next) {
  const userId = req.params.userId || req.body.user_id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: User ID is required"
    });
  }

  // Basic validation - userId should be a non-empty string
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    return res.status(401).json({
      message: "Unauthorized: Invalid user ID format"
    });
  }

  // TODO: Add Clerk JWT token verification here
  // Example with @clerk/express:
  // const { userId } = req.auth;
  // if (!userId) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  next();
}

/**
 * Validates transaction ownership
 * Ensures users can only delete their own transactions
 */
export async function validateTransactionOwnership(sql) {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.body.user_id || req.query.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID required" });
      }

      // Check if transaction belongs to user
      const transaction = await sql`
        SELECT user_id FROM transactions WHERE id = ${id}
      `;

      if (transaction.length === 0) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      if (transaction[0].user_id !== userId) {
        return res.status(403).json({
          message: "Forbidden: You can only delete your own transactions"
        });
      }

      next();
    } catch (error) {
      console.error("Error validating transaction ownership:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
