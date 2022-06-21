import { merge } from "lodash";
import { userResolvers } from "./user";
import { postResolvers } from "./post";

export default merge(userResolvers, postResolvers);
