import React, { useState } from 'react';

export interface IEncodingOptions {
  changeEncoding: (encoding: number) => void
  getConnectState: () => number
}

export const EncodingOptions: React.FC<IEncodingOptions> = ({ changeEncoding, getConnectState }) => {
  const [value, setValue] = useState<number>(1);


  const onEncodingChange = (e: React.ChangeEvent<HTMLSelectElement>):void => {
    const intValue = parseInt(e.target.value);
    setValue(intValue)
    changeEncoding(intValue)
  }

  return (
    <span className="encoding">
      <label >Encoding:</label>
      <select value={value} onChange={onEncodingChange} disabled={getConnectState() === 2}>
        <option value="1">RLE 8</option>
        <option value="2">RLE 16</option>
      </select>
    </span>
  )
}
