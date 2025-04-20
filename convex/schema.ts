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
        brand: v.optional(v.string()),
        description: v.string(),
        category: v.string(),
    })
        .index("by_brand", ["brand"])
        .index("by_category", ["category"]),
});
