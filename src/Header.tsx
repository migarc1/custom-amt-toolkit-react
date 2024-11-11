/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import React from 'react'
import { ConnectButton } from './ConnectButton'
import { DesktopSettings } from './DesktopSettings'
// import './Header.scss'

export interface IHeaderProps {
  kvmState: number
  deviceId: string | null
  server: string | null
  handleConnectClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  // rotateScreen: (e: unknown) => void
  // handleKeyCombination: (event: { target: { value: unknown; }; }) => void
  changeDesktopSettings: (settings: { encoding: string | number; }) => void
  getConnectState: () => number
}

export const Header = ({kvmState, handleConnectClick, /*rotateScreen, *//*handleKeyCombination, */changeDesktopSettings, getConnectState} : IHeaderProps) => {
  return (
    <React.Fragment>
      <div className="header">
      <ConnectButton
          handleConnectClick={handleConnectClick}
          kvmState={kvmState}
        />
        {/* <label>Screen:</label>
        <select>
        <option value="">Screen 1</option>
      </select> */}
      <DesktopSettings
          changeDesktopSettings={changeDesktopSettings}
          getConnectState={getConnectState}
        />

        {/* <label>SendKeys:</label> */}
        {/* <select onChange={handleKeyCombination}>
        <option value="">Select a key combination</option>
        <option value="1">Ctrl + Alt + Delete</option>
        <option value="2">Alt + Tab</option>
        <option value="3">Alt + F4</option>
        <option value="4">Ctrl + Shift + Esc</option>
      </select> */}
        {/* <button className='rotate' onClick={rotateScreen}>↺</button> */}
      </div>
    </React.Fragment>
  )
}
