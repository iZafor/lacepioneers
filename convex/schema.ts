import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    shoes: defineTable({
        name: v.string(),
        sizes: v.array(v.object({ size: v.number(), stock: v.number() })),
        price: v.number(),
        discountPrice: v.optional(v.number()),
        brand: v.optional(v.string()),
        description: v.string(),
        category: v.string(),
    }),
});
