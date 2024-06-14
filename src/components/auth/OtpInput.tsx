import React, { useRef } from 'react'

const OtpInput = ({inputValues,setInputValues}) => {

  const inputRefs = useRef([]);

  const onInputChange = (event,index) => {
    const { name, value } = event.target;
  
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value && inputRefs.current) {
      if (index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const onInputKeyDown = (event,index) => {
    if (event.key === 'Backspace') {
      const name = event.target.name;
      if (!inputValues[name]) {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      }
    }
  };
  const onPaste = (event) => {
    const pasteData = event.clipboardData.getData('text');
    const pasteDataArray = pasteData.split('').filter((char, index) => index < 4);

    if (pasteDataArray.length === 4) {
      setInputValues({
        verifyCode1: pasteDataArray[0] || '',
        verifyCode2: pasteDataArray[1] || '',
        verifyCode3: pasteDataArray[2] || '',
        verifyCode4: pasteDataArray[3] || '',
      });
      setTimeout(() => inputRefs.current[3].focus(), 0);
    }
  };
  return (
    <div className='flex justify-center items-center  gap-6 mt-3'> 
    
      {Object.keys(inputValues).map((key, index) => (
      <input
        key={key}
        ref={(el) => (inputRefs.current[index] = el)}
        name={key}
        value={inputValues[key]}
        onChange={(e)=>onInputChange(e,index)}
        onKeyDown={(e)=>onInputKeyDown(e,index)}
        onPaste={onPaste}
        maxLength={1}
        className="w-full max-w-16 h-14 text-2xl text-center p-4 rounded bg-gray-200 focus:outline-none mb-2"
        required
      />
     
    ))}</div>
  )
}

export default OtpInput