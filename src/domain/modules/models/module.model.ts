import { Operation } from "./operation.model";

export interface Module {
    id: number;
    description: string;
    operations: Operation[];
  }