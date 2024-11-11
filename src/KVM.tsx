
import React from 'react';
import { Header } from './components/Header';
import { PureCanvas } from './components/PureCanvas';
import useUI from './hooks/useUI';
import { UiKVMProps } from './interfaces/UiKVMProps';
import { isFalsy } from './shared/Utilities';

const KVM: React.FC<UiKVMProps> = ({deviceId, mpsServer, mouseDebounceTime, canvasHeight, canvasWidth, autoConnect, authToken}) => {
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

export default KVM;