import { useEffect, useRef, useState } from 'react'
import './Item.css'
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
    p1 += ' [';
    if (p2?.req) p1 += ' req:' + p2.req;
    if (p2?.cmd) p1 += ' cmd:' + p2.cmd;
    else if (p2?.data?.cmd) p1 += ' cmd:' + p2.data.cmd;
    p1 += ' ]';
    
    return {p1, p2};
  } catch (error) {
  }

  return null;
};

function syntaxHighlight(json, exp = false) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ret = json
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
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
      },
    );
    if (exp) {
      return ret
        .replace(/[{]/g, '{<br>')
        .replace(/[}]$/, '<br>}')
        .replace(/['\t']/g, '&nbsp;')
        .replace(/[,]/g, ',<br>');
    }
    return ret;
}

export default function Item({ text, idx }) {
  const [exp, setExp] = useState(false);
  const p = procLinha(text);

  const handleCheck = (c) => {
    setExp(c.target.checked);
  };

  if (p) {
    return (
      <Collapsible
        className="titItem"
        openedClassName="titItemOpen"
        trigger={p.p1}
        transitionTime={1}
        key={`linha${idx}`}
      >
        <div>
          <input
            type="checkbox"
            name="expand"
            id={`ck${idx}`}
            checked={exp}
            onChange={handleCheck}
          />
          <label htmlFor="expand"> Expand</label>
        </div>
        <p
          className="item"
          dangerouslySetInnerHTML={{
            __html: syntaxHighlight(JSON.stringify(p.p2, undefined, '\t'), exp),
          }}
        ></p>
      </Collapsible>
    );
  }
  return (
    <Collapsible
      className="titItemErr"
      openedClassName="titItemErr"
      trigger={`Linha ${idx} com erro`}
      transitionTime={1}
      key={`linha${idx}`}
    >
      <div className="item"> {text}</div>
    </Collapsible>
  );
}