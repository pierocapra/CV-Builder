import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

function Test() {
  const contentRef = useRef();
  const handlePrint = useReactToPrint({ contentRef }); 


  return (
    <div>
      <button onClick={handlePrint}>Print Preview</button>

      <div ref={contentRef} style={{ padding: 20, backgroundColor: 'white' }}>
        <h1>John Doe</h1>
        <p>Email: john@example.com</p>
        <p>Education: University of Examples</p>
      </div>
    </div>
  );
}

export default Test;
