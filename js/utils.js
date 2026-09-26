function levenshtein(a, b) {
  a = (a||'').toLowerCase().trim(); b = (b||'').toLowerCase().trim();
  const m = a.length, n = b.length;
  const d = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const cost = a[i-1] === b[j-1] ? 0 : 1;
    d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + cost);
  }
  return d[m][n];
}
function similarity(a, b) {
  const maxLen = Math.max((a||'').length, (b||'').length) || 1;
  return 1 - levenshtein(a, b) / maxLen;
}
function parseDate(str) {
  if (!str) return null;
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  const mm = parseInt(parts[0],10), dd = parseInt(parts[1],10), yy = parseInt(parts[2],10);
  if (!mm || !dd || !yy) return null;
  return new Date(yy, mm-1, dd);
}
function daysBetween(d1, d2) { return Math.round((d2 - d1) / 86400000); }

function effectiveAllocations(list) {
  const n = list.length || 1;
  return list.map(x => x.allocationMethod === 'Equal' ? (100 / n) : (x.allocationValue || 0));
}
function allocationTotalLabel(list) {
  if (!list.length) return '0.00%';
  const allEqual = list.every(x => x.allocationMethod === 'Equal');
  return allEqual ? '100.00%' : list.reduce((s,x)=>s+(x.allocationMethod==='Equal'?0:(x.allocationValue||0)),0).toFixed(2) + '%';
}
