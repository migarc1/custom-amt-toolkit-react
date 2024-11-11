
import React from 'react'
import { Header } from './Header'
import useUI from './hooks/useUI'
import { PureCanvas } from './PureCanvas'
import { isFalsy } from './shared/Utilities'

// import './UI.scss'

export interface KVMProps {
  deviceId: string | null
  mpsServer: string | null
  mouseDebounceTime: number
  canvasHeight: string
  canvasWidth: string
  autoConnect?: boolean
  authToken: string | null
}

const KVM: React.FC<KVMProps> = ({deviceId, mpsServer, mouseDebounceTime, canvasHeight, canvasWidth, autoConnect, authToken}) => {
  const {kvmState,
    ctxRef,
    mouseHelperRef,
    changeDesktopSettings,
    handleConnectClick,
    rotateScreen,
    handleKeyCombination } = useUI({deviceId, mpsServer, mouseDebounceTime, authToken})


  return (
    <div className="canvas-container">
      {!isFalsy(autoConnect) ? (
        <Header
          key="kvm_header"
          handleConnectClick={handleConnectClick}
          rotateScreen={rotateScreen}
          handleKeyCombination={handleKeyCombination}
          getConnectState={() => kvmState}
          kvmState={kvmState}
          changeDesktopSettings={changeDesktopSettings}
          deviceId={deviceId}
          server={mpsServer}
        />
      ) : ''}
      <PureCanvas
        key="kvm_comp"
        contextRef={(ctx) => { ctxRef.current = ctx }}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        mouseMove={(event) => { if (mouseHelperRef.current) mouseHelperRef.current.mousemove(event.nativeEvent as MouseEvent) }}
        mouseDown={(event) => { if (mouseHelperRef.current) mouseHelperRef.current.mousedown(event.nativeEvent as MouseEvent) }}
        mouseUp={(event) => { if (mouseHelperRef.current) mouseHelperRef.current.mouseup(event.nativeEvent as MouseEvent) }}
      />
    </div>
  )
}

export default KVM