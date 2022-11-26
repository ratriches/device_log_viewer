import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Collapsible from 'react-collapsible'

const procLinha = (l) => {
  const regex = /[0-9]{2}\/[0-9]{2}\.[0-9]{2}:[0-9]{2}:[0-9]{2} (resp:|req:)/;
  const regex2 = /{.*}/;
  const _p1 = l.match(regex);
  const _p2 = l.match(regex2);

  if (!_p1 || !_p2) return null;

  try {
    let p1 = _p1[0];
    const p2 = JSON.parse(_p2[0]);
    if (p2?.cmd) p1 += ' [' + p2.cmd + ']';
    else if (p2?.data?.cmd) p1 += ' [' + p2.data.cmd + ']';
    // console.log('p1', p1,'p2', p2);
    return {p1, p2};
  } catch (error) {
  }

  return null;
};

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  }).replace(/[{]/g, '{<br>').replace(/[}]$/, '<br>}').replace(/['\t']/g, '&nbsp;').replace(/[,]/g, ',<br>');
}

function App() {
  // const [count, setCount] = useState(0);
  // const [dt, setDt] = useState('fake');
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [inTxt, setInTxt] = useState('01/11.10:01:02 resp: {"cmd":"ex","exemplo":true}');

  const onButtonClick = () => {
    // `current` points to the mounted file input element
   inputFile.current.click();

  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  

  useEffect(() => {
    if (selectedFile) {
      // console.log(selectedFile);
      // await showFile(selectedFile);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        // console.log(text);
        // alert(text);
        setInTxt(text);
      };
      reader.readAsText(selectedFile);
    }
  }, [selectedFile]);



  return (
    <div className="App">
      <div className="card">
        <input
          type="file"
          id="file"
          ref={inputFile}
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <button onClick={onButtonClick}>Open Log file</button>
      </div>
      <div className="datalist">
        {inTxt.split('\n').map((t, i) => {
          const p = procLinha(t);
          if (p) {
            // console.log('p', p);
            return (
              <Collapsible className="titItem" trigger={p.p1} transitionTime={1} key={`linha${i}`}>
                {/* <button >mode</button> */}
                {/* <div className="item"> {syntaxHighlight(JSON.stringify(p.p2, undefined, 2))}</div> */}
                {/* <div> { syntaxHighlight(JSON.stringify(p.p2, undefined, 2))}</div> */}
                <p className="item" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(p.p2, undefined, '\t')) }}></p>
                {/* <p className="item"> {syntaxHighlight(JSON.stringify(p.p2, undefined, '\t'))}</p> */}
              </Collapsible>
            );
          }
          return (
            <Collapsible trigger={`Linha ${i} com erro`} key={`linha${i}`}>
              <div className="item"> {t}</div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}

export default App
