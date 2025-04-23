import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("users")
            .withIndex("by_email")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .first();
    },
});

export const isUserAdmin = query({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
        return (
            await ctx.db
                .query("users")
                .withIndex("by_role")
                .filter((q) => q.eq(q.field("role"), "admin"))
                .collect()
        ).some((u) => u.clerkUserId === clerkId);
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

export const updateUser = mutation({
    args: {
        id: v.id("users"),
        values: v.array(
            v.object({
                field: v.string(),
                value: v.string(),
            })
        ),
    },
    handler: async (ctx, { id, values }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const updates: { [key: string]: string } = {};
        for (const { field, value } of values) {
            updates[field] = value;
        }

        await ctx.db.patch(id, updates);
    },
});
