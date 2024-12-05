// for query all the boards for a given organization
import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAllOrThrow } from "convex-helpers/server/relationships";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    // if the user wants to fetch the favorite boards
    if (args.favorites) {
      const favoriteBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q
            .eq("userId", identity.subject)
            .eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      const ids = favoriteBoards.map(b => b.boardId);

      const boards = await getAllOrThrow(ctx.db, ids as Id<"boards">[]);

      return boards.map(board => ({
        ...board,
        isFavorite: true
      }));
    }

    // fetch all the boards for the given organization
    const title = args.search as string;
    let boards = [];

    if (title) {
      // search the boards by title
      boards = await ctx
        .db.query("boards")
        .withSearchIndex("search_title", (q) =>
          q
            .search("title", title)
            .eq("orgId", args.orgId)
        )
        .collect();
    } else {
      // fetch all the boards for the given organization
      boards = await ctx
        .db.query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

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
