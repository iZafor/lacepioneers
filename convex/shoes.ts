import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("shoes").collect();
    },
});

export const getByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, { category }) => {
        return await ctx.db
            .query("shoes")
            .filter((q) => q.eq(q.field("category"), category))
            .collect();
    },
});
