import { query } from "./_generated/server";

export const getOrders = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const isAdmin = await ctx.db
            .query("users")
            .withIndex("by_email")
            .filter(
                (q) =>
                    q.eq(q.field("email"), identity.email) &&
                    q.eq(q.field("role"), "admin")
            )
            .first();

        if (isAdmin) {
            return ctx.db.query("orders").collect();
        } else {
            return ctx.db
                .query("orders")
                .withIndex("by_email")
                .filter((q) => q.eq(q.field("email"), identity.email))
                .collect();
        }
    },
});
