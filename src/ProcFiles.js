const ProcFileData = (data) => {
  const regex1 = /[0-9]{2}\/[0-9]{2}\.[0-9]{2}:[0-9]{2}:[0-9]{2} (resp:|req:)/;
  const regex2 = /{.*}/;
  const dout = [];

  data
    .replace('/\r\n/g', '\n')
    .replace('/\n\r/g', '\n')
    .split('\n')
    .forEach((line, ln) => {
      const _p1 = line.match(regex1);
      const _p2 = line.match(regex2);
      if (_p1 && _p2) {
        const fts =
          Date.parse(
            '2000-' +
              line.substring(3, 5) +
              '-' +
              line.substring(0, 2) +
              'T' +
              line.substring(6, 14),
          ) / 1000;
        const type = _p1[1];
        const date = line.substring(0, 14);
        const ldata = JSON.parse(_p2[0]);
        dout.push({ fts, type, date, ldata, ln });
      }
    });

  return dout;
};

const ReadFile = async (file) => {
  if (!file) return;
  return await file.text();
};

export default async function ProcFiles(fileList) {
  const dataF = [];
  for (let f = 0; f < fileList.length; f++) {
    const data = await ReadFile(fileList[f]);
    // console.log('file', fileList[f]);
    if (!data) {
      alert(`Não foi possivel ler o arquivo "${fileList[f].name}"`);
      continue;
    }

    const pdata = ProcFileData(data);
    // console.log('pdata', pdata);
    if (!pdata.length) {
      alert(`Arquivo "${fileList[f].name}" inválido`);
      continue;
    }

    dataF.push({ pdata, fname: fileList[f].name });    
  }
  return dataF;
}
