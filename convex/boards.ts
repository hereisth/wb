// for query all the boards for a given organization
import { v } from "convex/values";
import { query } from "./_generated/server";
import { favorite } from "./board";

export const get = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }
    // fetch all the boards for the given organization
    const boards = await ctx
      .db.query("boards")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();

    // fetch the favorite relation for each board
    const boardsWithFavoriteRelation = await Promise.all(
      boards.map(async (board) => {
        const favorite = await ctx.db
          .query("userFavorites")
          .withIndex("by_user_board", (q) => q
            .eq("userId", identity.subject)
            .eq("boardId", board._id)
          )
          .unique();

        return {
          ...board,
          isFavorite: !!favorite
        };
      })
    );

    return boardsWithFavoriteRelation;
  },
});
