/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import React from 'react'
// import './PureCanvas.scss'
import { isFalsy } from './shared/Utilities'

export interface PureCanvasProps {
  contextRef: (ctx: CanvasRenderingContext2D) => void
  mouseDown: (event: React.MouseEvent) => void
  mouseUp: (event: React.MouseEvent) => void
  mouseMove: (event: React.MouseEvent) => void
  canvasHeight: string
  canvasWidth: string
}

export const PureCanvas = ({ contextRef, mouseDown, mouseUp, mouseMove}: PureCanvasProps) => {

  const canvasAttributes: React.CanvasHTMLAttributes<HTMLCanvasElement> = {
    width: '1366',
    height: '768',
    onContextMenu: (e) => { e.preventDefault(); return false },
    onMouseDown: mouseDown,
    onMouseUp: mouseUp,
    onMouseMove: mouseMove
  }
  return (
    <canvas {...canvasAttributes} data-testid="pure-canvas-testid" className="canvas" ref={(c: HTMLCanvasElement | null) => isFalsy(c) ? contextRef(c!.getContext('2d')!) : null}/>
  )
}