import { DarkwritePreloadAPI } from "./api";
import { DarkwriteIPCBridge } from "@darkwrite/common";

// Ensure all required APIs are actually exposed into the frontend and have the correct types. This is a compile-time test and doesn't run at runtime.
expectTypeOf<DarkwriteIPCBridge>().toEqualTypeOf<DarkwritePreloadAPI>();
