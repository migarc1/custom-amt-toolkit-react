import React from 'react'

export interface ConnectProps {
  kvmState: number
  handleConnectClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const ConnectButton:React.FC<ConnectProps> = ({kvmState, handleConnectClick}) => {
  const classes = `button ${kvmState === 1 ? 'connecting' : (kvmState === 2 ? 'disconnect' : 'connect')}`
  return (
    <button className={classes} onClick={handleConnectClick}>
      {kvmState === 1 ? 'Connecting KVM' : (kvmState === 2 ? 'Disconnect KVM' : 'Connect KVM')}
    </button>
  )
}