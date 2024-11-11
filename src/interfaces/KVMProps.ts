export interface KVMProps {
  deviceId: string | null
  mpsServer: string | null
  mouseDebounceTime: number
  autoConnect?: boolean
  authToken: string | null
}
