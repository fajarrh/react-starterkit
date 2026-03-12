/**
 *
 * @param {*} jsonSchema
 * @param {*} modelName
 * @description Generate service template string based on the provided JSON schema and model name.
 * @returns {string} Template string
 */

import * as helper from "./_helper.template.js";

export default function serviceTemplate({ modelName, funcName, urlName }) {

  return `
import { EventSend } from "ezhooks";
import api from "./api.service";
import { HttpResponse } from "@typings/index";
import { ${funcName} } from "@typings/${helper.toKebabCase(funcName)}.type";

const url = {
  index: "/${urlName}",
};

export type All${funcName}Response = HttpResponse<${funcName}[]>;
export type ${funcName}Response = Pick<HttpResponse<${funcName}>, "data">;

export const getAll${funcName} = (event: EventSend) => {
  return api.get<All${funcName}Response>(url.index, {
    params: event.params,
    signal: event.ctr.signal,
  });
};

export const post${funcName} = (event: EventSend) => {
  return api.post<${funcName}Response>(url.index, event.data?.(), {
    signal: event.ctr.signal,
  });
};

export const put${funcName} = (event: EventSend) => {
  return api.put<${funcName}Response>(url.index, event.data?.(), {
    signal: event.ctr.signal,
  });
};

export const get${funcName}ID = (event: EventSend) => {
  const { id } = event.params;
  return api.get<${funcName}Response>(\`\${url.index}/\${id}\`, {
    signal: event.ctr.signal,
  });
};

export const delete${funcName} = async (event: EventSend) => {
  const { id } = event.params;
  await api.delete(\`\${url.index}/\${id}\`, {
    signal: event.ctr.signal,
  });
};

    `;
}
