import { mutation, query } from "./_generated/server";

export const getUser = query({
    handler: async (ctx) => {
        return await ctx.auth.getUserIdentity();
    },
});

export const syncUser = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const clerkUserId = identity.subject;
        const email = identity.email!;
        const name = identity.name || "Unnamed User";
        const phone = identity.phoneNumber;
        const profileImage = identity.pictureUrl;
        const role = "user";
        
        const userExists = await ctx.db
            .query("users")
            .withIndex("by_email")
            .filter((q) => q.eq(q.field("email"), email))
            .first();

        if (!userExists) {
            await ctx.db.insert("users", {
                email,
                name,
                phone,
                role,
                profileImage,
                clerkUserId,
            });
        }
    },
});
