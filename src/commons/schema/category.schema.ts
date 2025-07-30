
import * as z from "zod";
    
export const inputCategorySchema = (zod:typeof z) => zod.object({
  name:zod.string().nonempty(),
slug:zod.string().nonempty(),
createdAt:zod.string(),
updatedAt:zod.string().nonempty(),
parent:zod.any(),
children:zod.any(),
services:zod.any()
});

export type InputCategorySchema = z.infer<ReturnType<typeof inputCategorySchema>>;

