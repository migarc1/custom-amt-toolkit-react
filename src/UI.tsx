/* eslint-disable react-hooks/exhaustive-deps */
import { AMTDesktop, AMTKvmDataRedirector, DataProcessor, /*ImageHelper,*/ KeyBoardHelper, MouseHelper, Protocol, type Desktop, type IDataProcessor, type IKvmDataCommunicator, type RedirectorConfig } from '@open-amt-cloud-toolkit/ui-toolkit/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Header } from './Header'
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

const KVM: React.FC<KVMProps> = (props) => {
  const [kvmState, setKvmState] = useState(0)
  const [encodingOption, setEncodingOption] = useState(1)
  // const [rotation, setRotation] = useState(0)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const moduleRef = useRef<Desktop | null>(null)
  const dataProcessorRef = useRef<IDataProcessor | null>(null)
  const redirectorRef = useRef<IKvmDataCommunicator | null>(null)
  const mouseHelperRef = useRef<MouseHelper | null>(null)
  const keyboardRef = useRef<KeyBoardHelper | null>(null)
  const desktopSettingsChangeRef = useRef(false)

  const init = useCallback(() => {
    const deviceUuid: string = props.deviceId ?? ''
    const server: string = props.mpsServer != null ? props.mpsServer.replace('http', 'ws') : ''
    const config: RedirectorConfig = {
      mode: 'kvm',
      protocol: Protocol.KVM,
      fr: new FileReader(),
      host: deviceUuid,
      port: 16994,
      user: '',
      pass: '',
      tls: 0,
      tls1only: 0,
      authToken: props.authToken ?? '',
      server
    }
    console.log('server', server)
    console.log('deviceUuid', deviceUuid)
    console.log('authToken', props.authToken)
    moduleRef.current = new AMTDesktop(ctxRef.current)
    redirectorRef.current = new AMTKvmDataRedirector(config)
    dataProcessorRef.current = new DataProcessor(redirectorRef.current, moduleRef.current)
    mouseHelperRef.current = new MouseHelper(moduleRef.current, redirectorRef.current, props.mouseDebounceTime < 200 ? 200 : props.mouseDebounceTime) // anything less than 200 ms causes timeout
    keyboardRef.current = new KeyBoardHelper(moduleRef.current, redirectorRef.current)

    redirectorRef.current.onProcessData = moduleRef.current.processData.bind(moduleRef.current)
    redirectorRef.current.onStart = moduleRef.current.start.bind(moduleRef.current)
    redirectorRef.current.onNewState = moduleRef.current.onStateChange.bind(moduleRef.current)
    redirectorRef.current.onSendKvmData = moduleRef.current.onSendKvmData.bind(moduleRef.current)
    redirectorRef.current.onStateChanged = OnConnectionStateChange
    redirectorRef.current.onError = onRedirectorError
    moduleRef.current.onSend = redirectorRef.current.send.bind(redirectorRef.current)
    moduleRef.current.onProcessData = dataProcessorRef.current.processData.bind(dataProcessorRef.current)
    moduleRef.current.bpp = encodingOption
  }, [props.deviceId, props.mpsServer, props.authToken, props.mouseDebounceTime, encodingOption])

  const cleanUp = useCallback(() => {
    moduleRef.current = null
    redirectorRef.current = null
    dataProcessorRef.current = null
    mouseHelperRef.current = null
    keyboardRef.current = null
    ctxRef.current?.clearRect(0, 0, ctxRef.current.canvas.height, ctxRef.current.canvas.width)
  }, [])

  const reset = () => {
    cleanUp()
    init()
  }

  const onRedirectorError = () => {
    reset()
  }

  const OnConnectionStateChange = (communicator: { state: number }) => {
    const state = communicator.state;
    setKvmState(state)
    if (desktopSettingsChangeRef.current && state === 0) {
      desktopSettingsChangeRef.current = false
      setTimeout(() => { startKVM() }, 2000) // Introduced delay to start KVM
    }
  };

  const changeDesktopSettings = useCallback((settings: { encoding: string | number }) => {
    if(!moduleRef.current) return;
    if(!settings) return;
    if (kvmState === 2) {
      desktopSettingsChangeRef.current = true
      moduleRef.current.bpp = typeof settings.encoding === 'number' ? settings.encoding : parseInt(settings.encoding)
      stopKVM()
    } else {
      setEncodingOption(parseInt(settings.encoding.toString()))
      moduleRef.current.bpp = parseInt(settings.encoding.toString())
    }
  }, [kvmState])

  const startKVM = () => {
    if(redirectorRef.current === null) return;
    if (redirectorRef.current) {
      redirectorRef.current.start(WebSocket)
    }
    if (keyboardRef.current) keyboardRef.current.GrabKeyInput()
  }

  const stopKVM = () => {
    if (redirectorRef.current) redirectorRef.current.stop()
      if (keyboardRef.current) keyboardRef.current.UnGrabKeyInput()
    reset()
  }

  const handleConnectClick = (e: { persist: () => void }) => {
    e.persist()
    if (kvmState === 0) {
      startKVM()
    } else if (kvmState === 1) {
      // Take Action
    } else if (kvmState === 2) {
      stopKVM()
    } else {
      // Take Action
    }
  }

  // const rotateScreen = useCallback(() => {
  //   setRotation((prevRotation) => {
  //     if(moduleRef.current === null) return prevRotation;
  //     const newRotation = (prevRotation + 1) % 4
  //     ImageHelper.setRotation(moduleRef.current, newRotation)
  //     return newRotation
  //   })
  // }, [])

  // const handleKeyCombination = useCallback((event: { target: { value: unknown } }) => {
    // const value = event.target.value
    // switch (value) {
    //   case '1':
    //     sendCtrlAltDelete()
    //     break
    //   case '2':
    //     sendAltTab()
    //     break
    //   case '3':
    //     sendAltF4()
    //     break
    //   case '4':
    //     sendCtrlShiftEsc()
    //     break
    //   default:
    //     break
    // }
  // }, [])

  // const sendCtrlAltDelete = useCallback(() => {
  //   if(!keyboardRef.current) return;
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 17, code: 'ControlLeft', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 18, code: 'AltLeft', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 46, code: 'Delete', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 46, code: 'Delete', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 18, code: 'AltLeft', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 17, code: 'ControlLeft', shiftKey: false })
  // }, [])

  // const sendAltTab = useCallback(() => {
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 18, code: 'AltLeft', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 9, code: 'Tab', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 9, code: 'Tab', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 18, code: 'AltLeft', shiftKey: false })
  // }, [])

  // const sendAltF4 = useCallback(() => {
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 18, code: 'AltLeft', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 115, code: 'F4', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 115, code: 'F4', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 18, code: 'AltLeft', shiftKey: false })
  // }, [])

  // const sendCtrlShiftEsc = useCallback(() => {
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 17, code: 'ControlLeft', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 16, code: 'ShiftLeft', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(1, { keyCode: 27, code: 'Escape', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 27, code: 'Escape', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 16, code: 'ShiftLeft', shiftKey: false })
  //   keyboardRef.current.handleKeyEvent(0, { keyCode: 17, code: 'ControlLeft', shiftKey: false })
  // }, [])

  useEffect(() => {
    init()
    return () => {
      stopKVM()
    }
  }, [])

  useEffect(() => {
    if (props.deviceId !== null) {
      stopKVM()
    }
  }, [props.deviceId])

  return (
    <div className="canvas-container">
      {!isFalsy(props.autoConnect) ? (
        <Header
          key="kvm_header"
          handleConnectClick={handleConnectClick}
          // rotateScreen={rotateScreen}
          // handleKeyCombination={handleKeyCombination}
          getConnectState={() => kvmState}
          kvmState={kvmState}
          changeDesktopSettings={changeDesktopSettings}
          deviceId={props.deviceId}
          server={props.mpsServer}
        />
      ) : ''}
      <PureCanvas
        key="kvm_comp"
        contextRef={(ctx) => { ctxRef.current = ctx }}
        canvasHeight={props.canvasHeight}
        canvasWidth={props.canvasWidth}
        mouseMove={(event) => { if (mouseHelperRef.current) mouseHelperRef.current.mousemove(event.nativeEvent as MouseEvent) }}
        mouseDown={(event) => { if (mouseHelperRef.current) mouseHelperRef.current.mousedown(event.nativeEvent as MouseEvent) }}
        mouseUp={(event) => { if (mouseHelperRef.current) mouseHelperRef.current.mouseup(event.nativeEvent as MouseEvent) }}
      />
    </div>
  )
}

export default KVM