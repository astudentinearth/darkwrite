import { Optional } from "@/common/ts-util";
import _ from "lodash";

export function tryParse(str: string): Optional<Record<string, any>> {
  const result = _.attempt(()=>JSON.parse(str));
  if(result instanceof Error) return {error: result};
  else return {result: result as Record<string, any>};
}

const JSONUtil = {
  tryParse
}

export default JSONUtil;