import React, { useState } from 'react';
import { EncodingOptions } from './EncodingOptions';

export interface IDesktopSettings {
  changeDesktopSettings: (settings: { encoding: string | number; }) => void
  getConnectState: () => number
}

export const DesktopSettings:React.FC<IDesktopSettings> =({changeDesktopSettings, getConnectState}) => {
  const [desktopSettings, setDesktopSettings] = useState<{ encoding: number }>({ encoding: 1 });

  const changeEncoding = (encoding: number): void => {
    setDesktopSettings({ encoding: encoding });
    changeDesktopSettings(desktopSettings);
  }

  return (
    <EncodingOptions changeEncoding={changeEncoding} getConnectState={getConnectState}/>
  )

}
