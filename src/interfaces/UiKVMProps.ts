import { KVMProps } from "./KVMProps";

export interface UiKVMProps extends KVMProps {
  canvasHeight: string;
  canvasWidth: string;
  autoConnect?: boolean;
}