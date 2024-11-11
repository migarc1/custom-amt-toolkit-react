/* eslint-disable react-hooks/exhaustive-deps */
import { AMTDesktop, AMTKvmDataRedirector, DataProcessor, ImageHelper, KeyBoardHelper, MouseHelper, Protocol, type Desktop, type IDataProcessor, type IKvmDataCommunicator, type RedirectorConfig } from '@open-amt-cloud-toolkit/ui-toolkit/core'
import { useEffect, useRef, useState } from "react"

export interface KVMProps {
  deviceId: string | null
  mpsServer: string | null
  mouseDebounceTime: number
  autoConnect?: boolean
  authToken: string | null
}

const useUI = ({deviceId, mpsServer, mouseDebounceTime, authToken}: KVMProps) => {
  const [kvmState, setKvmState] = useState(0)
  const [encodingOption, setEncodingOption] = useState(1)
  const [rotation, setRotation] = useState(0)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const moduleRef = useRef<Desktop | null>(null)
  const dataProcessorRef = useRef<IDataProcessor | null>(null)
  const redirectorRef = useRef<IKvmDataCommunicator | null>(null)
  const mouseHelperRef = useRef<MouseHelper | null>(null)
  const keyboardRef = useRef<KeyBoardHelper | null>(null)
  const desktopSettingsChangeRef = useRef(false)

  const init = () => {
    const deviceUuid: string = deviceId ?? ''
    const server: string = mpsServer != null ? mpsServer.replace('http', 'ws') : ''
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
      authToken: authToken ?? '',
      server
    }

    moduleRef.current = new AMTDesktop(ctxRef.current)
    redirectorRef.current = new AMTKvmDataRedirector(config)
    dataProcessorRef.current = new DataProcessor(redirectorRef.current, moduleRef.current)
    mouseHelperRef.current = new MouseHelper(moduleRef.current, redirectorRef.current, mouseDebounceTime < 200 ? 200 : mouseDebounceTime) // anything less than 200 ms causes timeout
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
  }

  useEffect(() => {
    if(deviceId && mpsServer && authToken) {
      init()
    }
    return () => {
      stopKVM()
    }
  }, [deviceId, mpsServer, authToken])

  useEffect(() => {
    if (moduleRef.current) {
      ImageHelper.setRotation(moduleRef.current, rotation)
    }
  }, [rotation])

  const cleanUp = () => {
    moduleRef.current = null
    redirectorRef.current = null
    dataProcessorRef.current = null
    mouseHelperRef.current = null
    keyboardRef.current = null
    ctxRef.current?.clearRect(0, 0, ctxRef.current.canvas.height, ctxRef.current.canvas.width)
  }

  const reset = () => {
    cleanUp()
    init()
  }

  const onRedirectorError = () => {
    reset()
  }

  const OnConnectionStateChange = (communicator: { state: number }) => {
    const state = communicator.state
    setKvmState(state)
    if (desktopSettingsChangeRef.current && state === 0) {
      desktopSettingsChangeRef.current = false
      setTimeout(() => { startKVM() }, 2000) // Introduced delay to start KVM
    }
  }

  const changeDesktopSettings = (settings: { encoding: string | number }) => {
    if(!moduleRef.current || !settings) return
    if (kvmState === 2) {
      desktopSettingsChangeRef.current = true
      moduleRef.current.bpp = typeof settings.encoding === 'number' ? settings.encoding : parseInt(settings.encoding)
      stopKVM()
    } else {
      setEncodingOption(parseInt(settings.encoding.toString()))
      moduleRef.current.bpp = parseInt(settings.encoding.toString())
    }
  }

  const startKVM = () => {
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

  const rotateScreen = () => {
    setRotation((prevRotation) => (prevRotation + 1) % 4)
  }


  const handleKeyCombination = (event: { target: { value: unknown } }) => {
    const value = event.target.value
    switch (value) {
      case '1':
        sendCtrlAltDelete()
        break
      case '2':
        sendAltTab()
        break
      case '3':
        sendAltF4()
        break
      case '4':
        sendCtrlShiftEsc()
        break
      default:
        break
    }
  }

  const sendCtrlAltDelete = () => {
    if(!keyboardRef.current) return
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keydown', { keyCode: 17, code: 'ControlLeft', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keydown', { keyCode: 18, code: 'AltLeft', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keydown', { keyCode: 46, code: 'Delete', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 46, code: 'Delete', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 18, code: 'AltLeft', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 17, code: 'ControlLeft', shiftKey: false }))
  }

  const sendAltTab = () => {
    if(!keyboardRef.current) return
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keydown', { keyCode: 18, code: 'AltLeft', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keydown', { keyCode: 9, code: 'Tab', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 9, code: 'Tab', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 18, code: 'AltLeft', shiftKey: false }))
  }

  const sendAltF4 = () => {
    if(!keyboardRef.current) return
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keyup', { keyCode: 18, code: 'AltLeft', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keydown', { keyCode: 115, code: 'F4', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 115, code: 'F4', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 18, code: 'AltLeft', shiftKey: false }))
  }

  const sendCtrlShiftEsc = () => {
    if(!keyboardRef.current) return
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keydown', { keyCode: 17, code: 'ControlLeft', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keydown', { keyCode: 16, code: 'ShiftLeft', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(1, new KeyboardEvent('keydown', { keyCode: 27, code: 'Escape', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 27, code: 'Escape', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 16, code: 'ShiftLeft', shiftKey: false }))
    keyboardRef.current.handleKeyEvent(0, new KeyboardEvent('keyup', { keyCode: 17, code: 'ControlLeft', shiftKey: false }))
  }

  return {
    kvmState,
    ctxRef,
    mouseHelperRef,
    changeDesktopSettings,
    handleConnectClick,
    rotateScreen,
    handleKeyCombination
  }
}

export default useUI