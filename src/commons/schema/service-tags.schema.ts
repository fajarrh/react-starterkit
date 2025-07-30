
import * as z from "zod";
    
export const inputServiceTagsSchema = (zod:typeof z) => zod.object({
  service:zod.any(),
tag:zod.any()
});

export type InputServiceTagsSchema = z.infer<ReturnType<typeof inputServiceTagsSchema>>;

