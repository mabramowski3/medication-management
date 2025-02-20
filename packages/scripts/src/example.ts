import { Resource } from "sst";
import { Example } from "@medication-management/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
