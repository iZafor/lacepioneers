import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { stream } from "convex-helpers/server/stream";
import schema from "./schema";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const field = v.union(
    v.literal("_id"),
    v.literal("name"),
    v.literal("sizes"),
    v.literal("price"),
    v.literal("discountPrice"),
    v.literal("brand"),
    v.literal("category"),
    v.literal("defaultImage"),
    v.literal("imageId")
);

const value = v.union(
    v.number(),
    v.string(),
    v.array(v.object({ size: v.number(), stock: v.number() }))
);

export const getShoesBy = query({
    args: {
        field: v.optional(field),
        values: v.optional(v.array(value)),
        take: v.optional(v.number()),
        distinct: v.optional(
            v.union(v.literal("brand"), v.literal("category"))
        ),
        select: v.optional(v.array(field)),
    },
    handler: async (ctx, { field, values, take, distinct, select }) => {
        const baseQuery = stream(ctx.db, schema).query("shoes");

        const distinctQuery =
            distinct === undefined
                ? baseQuery
                : baseQuery.withIndex(`by_${distinct}`).distinct([distinct]);

        const filterQuery =
            field === undefined || values === undefined
                ? distinctQuery
                : distinctQuery.filterWith(async (q) =>
                      values.some((v) => v === q[field])
                  );

        const selectQuery =
            select === undefined
                ? filterQuery
                : filterQuery.map(async (q) => {
                      const res: { [key: string]: unknown } = {};
                      for (const c of select) {
                          res[c] = q[c];
                      }
                      return res;
                  });

        const takeQuery = await (take === undefined
            ? selectQuery.collect()
            : selectQuery.take(take));

        return takeQuery;
    },
});

export const getShoesPaginated = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: (ctx, { paginationOpts }) => {
        return ctx.db.query("shoes").paginate(paginationOpts);
    },
});

type FieldValue = {
    field: (typeof field)["type"][number];
    value: string | number | Array<{ size: number; stock: number }> | undefined;
};

export const updateShoeData = mutation({
    args: {
        id: v.id("shoes"),
        values: v.array(
            v.object({ field: v.string(), value: v.optional(value) })
        ),
    },
    handler: async (ctx, { id, values }) => {
        const updates: Partial<
            Record<FieldValue["field"], FieldValue["value"]>
        > = {};

        for (const { field, value } of values) {
            updates[field] = value;
            if (field === "imageId") {
                updates["defaultImage"] =
                    (await ctx.storage.getUrl(value as Id<"_storage">)) || "";
            }
        }

        return await ctx.db.patch(id, updates);
    },
});

export const deleteShoeData = mutation({
    args: { id: v.id("shoes") },
    handler: async (ctx, { id }) => {
        return await ctx.db.delete(id);
    },
});

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});
