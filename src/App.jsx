
import { useRef, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TabData from './TabData';
import ProcFiles from './ProcFiles'
import MergeData from './MergeData';

export default function App() {
  const inputFile = useRef(null);
  const [mdata, setMdata] = useState(null);
  const [msg, setMsg] = useState('Selecione um ou mais arquivos');
  
  const onButtonClick = () => {
    inputFile.current.click();
  };

  const handleChange = async (event) => {
    setMsg('Aguarde, processando');
    setMdata(null);
    const pdata = await ProcFiles(event.target.files);
    // console.log('ProcFiles', pdata);
    if (!pdata) {
      setMsg('Arquivo(s) inválido(s)');
      return;
    }

    const m = await MergeData(pdata);
    if (m) {
      setMdata(m);
      setMsg('Processado');
    } else {
      setMsg('Erro processando arquivo(s)');
    }
  };

  return (
    <Container maxWidth="false">
      <Box sx={{ my: 1 }}>
        <input
          type="file"
          id="file"
          ref={inputFile}
          style={{ display: 'none' }}
          multiple
          onChange={handleChange}
        />
        <button onClick={onButtonClick}>Open Log files</button>
        <span>&emsp;Status:&ensp;{msg}</span>
      </Box>
      {mdata ? <TabData data={mdata} /> : null}
    </Container>
  );
}

