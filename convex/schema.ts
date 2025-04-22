import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    shoes: defineTable({
        name: v.string(),
        sizes: v.array(v.object({ size: v.number(), stock: v.number() })),
        price: v.number(),
        discountPrice: v.optional(v.number()),
        defaultImage: v.string(),
        imageId: v.id("_storage"),
        brand: v.string(),
        description: v.string(),
        category: v.string(),
    })
        .index("by_brand", ["brand"])
        .index("by_category", ["category"]),

    users: defineTable({
        name: v.string(),
        role: v.union(v.literal("user"), v.literal("admin")),
        email: v.string(),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        zipCode: v.optional(v.string()),
        profileImage: v.optional(v.string()),
        profileImageId: v.optional(v.id("_storage")),
        clerkUserId: v.string()
    })
        .index("by_name", ["name"])
        .index("by_role", ["role"])
        .index("by_email", ["email"]),

    orders: defineTable({
        userId: v.optional(v.id("users")),
        email: v.string(),
        phone: v.string(),
        address: v.string(),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        zipCode: v.optional(v.string()),
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
});
