export default async function MergeData(data) {
  // console.log('MergeData', data);

  if (
    !data
    || data.length < 1
    // || !data.pdata
    || !data[0].pdata
    || data[0].pdata.length < 1
    || !data[0].pdata[0].fts
    || !data[0].pdata[0].type
    || !data[0].pdata[0].date
    || !data[0].pdata[0].ldata
    // || !data[0].pdata[0]?.ln
  ) {
    return null;
  }

  const dout = { fname: [], data: [] };
  const cntf = data.length;
  const counts = { max: 0, tot: [], lts: data[0].pdata[0].fts, its: [], idx: [] };

  const getNextOut = (cf) => {
    let outed = false;

    for (let i = 0; i < cf; i++) {
      const idx = counts.idx[i];
      if (idx < counts.tot[i]) {
        const ts = data[i].pdata[idx].fts;
        // console.log('i-ts-lts', i, ts, counts.lts);
        if (ts <= counts.lts) {
          counts.idx[i]++;
          outed = true;
          // console.log('out', data[i].pdata[idx], data[i].fname);
          const d = data[i].pdata[idx];
          dout.data.push({ date: d.date, type: d.type, ldata: d.ldata, nf: i, ln: d.ln });
        } else {
          counts.its[i] = ts;
        }
      }
    }

    return outed;
  };

  const getNextTs = (cf) => {
    let i = 0;
    const old = counts.lts;
    for (i = 0; i < cf; i++) {
      if (counts.tot[i] > counts.idx[i]) {
        counts.lts = data[i].pdata[counts.idx[i]].fts;
        i++;
        break;
      }
    }
    for (; i < cf; i++) {
      if (counts.tot[i] > counts.idx[i]) {
        if (counts.lts > data[i].pdata[counts.idx[i]].fts) {
          counts.lts = data[i].pdata[counts.idx[i]].fts;
        }
      }
    }
    return old != counts.lts;
  };

  for (let i = 0; i < cntf; i++) {
    // busca do maior vetor, e valores iniciais
    if (data[i].pdata.length > counts.max) counts.max = data[i].pdata.length;
    if (data[i].pdata[0].fts < counts.lts) counts.lts = data[i].pdata[0].fts;
    counts.tot.push(data[i].pdata.length);
    counts.its.push(data[i].pdata[0].fts);
    counts.idx.push(0);
    dout.fname.push(data[i].fname);
  }
  // console.log('counts1', counts);

  let i = 1;
  while (i) {
    // console.log('cnt', i++);
    if (!getNextOut(cntf)) {
      if (getNextTs(cntf)) {
        getNextOut(cntf);
      } else break;
      // break;
    }
  }
  // console.log('counts2', counts);
  // console.log('dout', dout);

  return dout;
}
