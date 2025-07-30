
import * as z from "zod";
    
export const inputTagsSchema = (zod:typeof z) => zod.object({
  name:zod.string().nonempty(),
slug:zod.string().nonempty(),
createdAt:zod.string(),
updatedAt:zod.string().nonempty(),
serviceTags:zod.any()
});

export type InputTagsSchema = z.infer<ReturnType<typeof inputTagsSchema>>;

