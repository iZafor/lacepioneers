import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const addOrders = mutation({
    args: {
        order: v.object({
            name: v.string(),
            email: v.string(),
            phone: v.string(),
            address: v.string(),
            city: v.optional(v.string()),
            state: v.optional(v.string()),
            zipCode: v.optional(v.string()),
            orderDate: v.string(),
            paymentMethod: v.union(v.literal("cod"), v.literal("online")),
            paymentStatus: v.union(
                v.literal("in-complete"),
                v.literal("complete")
            ),
            status: v.union(
                v.literal("processing"),
                v.literal("confirmed"),
                v.literal("in-transit"),
                v.literal("delivered")
            ),
            items: v.array(
                v.object({
                    productId: v.id("shoes"),
                    price: v.number(),
                    size: v.number(),
                    quantity: v.number(),
                })
            ),
        }),
    },
    handler: async (ctx, { order }) => {
        try {
            if (order.items.length > 0) {
                await ctx.db.insert("orders", order);
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
});

export const deleteOrder = mutation({
    args: { id: v.id("orders") },
    handler: async (ctx, { id }) => {
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
            await ctx.db.delete(id);
        }
    },
});
