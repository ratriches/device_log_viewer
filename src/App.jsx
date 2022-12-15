
import { useRef, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TabData from './TabData';
import ProcFiles from './ProcFiles'
import MergeData from './MergeData';

export default function App() {
  const inputFile = useRef(null);
  const [mdata, setMdata] = useState({});
  
  const onButtonClick = () => {
   inputFile.current.click();
  };

  const handleChange = async (event) => {
    const pdata = await ProcFiles(event.target.files);
    // console.log('ProcFiles', pdata);
    setMdata(await MergeData(pdata));
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
      </Box>
      <TabData data={mdata} />
    </Container>
  );
}

