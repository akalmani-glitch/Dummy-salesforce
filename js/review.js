/* ---------- Review logic ---------- */

function findMatch(name, list) { return list.find(x => x.name && similarity(x.name, name) > 0.9); }

function checkSsn(formSsn, recSsn, label, items) {
  const isOnFile = (formSsn||'').toLowerCase().includes('on file');
  if (isOnFile) {
    if (!recSsn || !recSsn.trim()) items.push({ status:'block', title:'SSN/TIN — '+label, detail:'"On file" referenced on the form, but the client record has no SSN/TIN stored for '+label+'.' });
    else items.push({ status:'pass', title:'SSN/TIN — '+label, detail:'"On file" confirmed against the client record.' });
  } else if (formSsn && formSsn.trim()) {
    if (formSsn.trim() !== (recSsn||'').trim()) items.push({ status:'block', title:'SSN/TIN — '+label, detail:'Digits shown on the form don\'t match the client record for '+label+'.' });
    else items.push({ status:'pass', title:'SSN/TIN — '+label, detail:'Matches client record.' });
  } else {
    items.push({ status:'block', title:'SSN/TIN — '+label, detail:'Missing on the form for '+label+' (no digits, no "On file" reference).' });
  }
}
function checkDob(formDob, recDob, label, items) {
  if (!formDob || !recDob) items.push({ status:'block', title:'Date of birth — '+label, detail:'Missing on the '+(!formDob?'form':'client record')+' for '+label+'.' });
  else if (formDob.trim() !== recDob.trim()) items.push({ status:'block', title:'Date of birth — '+label, detail:'Form shows '+formDob+', client record shows '+recDob+' for '+label+'.' });
  else items.push({ status:'pass', title:'Date of birth — '+label, detail:'Matches client record.' });
}
function checkAllocationMatch(formB, recB, label, items) {
  if (formB.allocationMethod !== recB.allocationMethod) items.push({ status:'block', title:'Allocation method — '+label, detail:'Form uses "'+formB.allocationMethod+'," client record uses "'+recB.allocationMethod+'." Method must match exactly.' });
  else if (formB.allocationMethod === 'Percentage' && (formB.allocationValue||0) !== (recB.allocationValue||0)) items.push({ status:'block', title:'Allocation value — '+label, detail:'Form shows '+formB.allocationValue+'%, client record shows '+recB.allocationValue+'% for '+label+'.' });
  else items.push({ status:'pass', title:'Allocation — '+label, detail:'Matches client record.' });
}

function runReview() {
  const caseId = currentRecordData.accountNumber || document.getElementById('caseSelect').value;
  const rec = currentRecordData;
  const f = currentFormData;
  const reviewDate = parseDate(document.getElementById('reviewDate').value);
  const items = [];

  if ((f.title||'').trim().toLowerCase() === 'transfer on death agreement') items.push({ status:'pass', title:'Scan Title', detail:'Reads "Transfer on Death Agreement."' });
  else items.push({ status:'block', title:'Scan Title', detail:'Reads "'+f.title+'" — must read "Transfer on Death Agreement."' });

  const scanD = parseDate(f.scanDate), sigD = parseDate(f.signatureDate);
  if (reviewDate && sigD && sigD > reviewDate) items.push({ status:'block', title:'Document date', detail:'Signature date ('+f.signatureDate+') is later than the review date — signature dated at future date.' });
  else if (reviewDate && ((scanD && Math.abs(daysBetween(scanD, reviewDate)) <= 60) || (sigD && Math.abs(daysBetween(sigD, reviewDate)) <= 60))) items.push({ status:'pass', title:'Document date', detail:'At least one of the scan or signature dates is within 60 days of the review date.' });
  else items.push({ status:'block', title:'Document date', detail:'Neither the scan date nor the signature date is within 60 days of the review date.' });

  if ((f.stateCode||'').trim().length === 2) items.push({ status:'pass', title:'State Code', detail:'Present on the form ('+f.stateCode+').' });
  else items.push({ status:'block', title:'State Code', detail:'Missing or not a valid 2-letter code on the form.' });

  const recPrimaries = rec.beneficiaryDetail.primaries;
  const formPrimaries = f.primaries;
  const recNames = recPrimaries.map(p=>p.name.toLowerCase()).filter(Boolean);
  const formNames = formPrimaries.map(p=>p.name.toLowerCase()).filter(Boolean);
  const added = formPrimaries.filter(p=>p.name && !recNames.includes(p.name.toLowerCase()));
  const removed = recPrimaries.filter(p=>p.name && !formNames.includes(p.name.toLowerCase()));
  if (!added.length && !removed.length) items.push({ status:'pass', title:'Primary beneficiary list', detail:'No primaries added or removed compared to the client record.' });
  else {
    let d=[]; if (added.length) d.push('Added: '+added.map(p=>p.name+' ('+(p.relationship||'relationship not stated')+')').join(', ')+'.');
    if (removed.length) d.push('Removed: '+removed.map(p=>p.name).join(', ')+'.');
    items.push({ status:'flag', title:'Primary beneficiary list changed', detail: d.join(' ')+' Confirm this change is intentional before authorizing.' });
  }

  const primTotal = formPrimaries.reduce((s,p)=>s+(p.allocationMethod==='Equal'?0:(p.allocationValue||0)),0);
  const primAllEqual = formPrimaries.length && formPrimaries.every(p=>p.allocationMethod==='Equal');
  if (formPrimaries.length && (primAllEqual || Math.round(primTotal)===100)) items.push({ status:'pass', title:'Primary allocation sum', detail:'Primary beneficiary allocations sum to 100%.' });
  else items.push({ status:'block', title:'Primary allocation sum', detail:'Primary beneficiary allocations do not sum to 100%.' });

  formPrimaries.forEach(fp => {
    if (!fp.name) return;
    const rp = findMatch(fp.name, recPrimaries);
    if (!rp) return;
    checkDob(fp.dob, rp.dob, fp.name, items);
    checkSsn(fp.ssn, rp.ssn, fp.name, items);
    if (!fp.relationship || !rp.relationship) items.push({ status:'block', title:'Relationship — '+fp.name, detail:'Relationship is missing on the '+(!fp.relationship?'form':'client record')+' for primary beneficiary '+fp.name+'.' });
    else items.push({ status:'pass', title:'Relationship — '+fp.name, detail:'Present on form and client record.' });
    checkAllocationMatch(fp, rp, fp.name, items);
    if (fp.contingents.length !== rp.contingents.length) items.push({ status:'block', title:'Contingent count — '+fp.name, detail:'Form shows '+fp.contingents.length+' contingent(s) under '+fp.name+', client record shows '+rp.contingents.length+'.' });
    else items.push({ status:'pass', title:'Contingent count — '+fp.name, detail:'Matches client record ('+fp.contingents.length+').' });

    if (fp.contingents.length) {
      const cAllEqual = fp.contingents.every(c=>c.allocationMethod==='Equal');
      const cTotal = fp.contingents.reduce((s,c)=>s+(c.allocationMethod==='Equal'?0:(c.allocationValue||0)),0);
      if (cAllEqual || Math.round(cTotal)===100) items.push({ status:'pass', title:'Contingent allocation sum — '+fp.name, detail:'Contingents under '+fp.name+' sum to 100%.' });
      else items.push({ status:'block', title:'Contingent allocation sum — '+fp.name, detail:'Contingents under '+fp.name+' do not sum to 100%.' });
    }
    fp.contingents.forEach(fc => {
      if (!fc.name) return;
      const rc = findMatch(fc.name, rp.contingents);
      if (!rc) return;
      checkDob(fc.dob, rc.dob, fc.name+' (contingent)', items);
      checkSsn(fc.ssn, rc.ssn, fc.name+' (contingent)', items);
      checkAllocationMatch(fc, rc, fc.name+' (contingent)', items);
    });
  });

  const signerName = (f.signerName || f.clientName || '').trim();
  const owner = rec.ownersRoles.find(r=>r.role==='Owner') || { name: rec.clientName };
  if (similarity(signerName, owner.name) > 0.92) items.push({ status:'pass', title:'Signer identity', detail:'Form was signed by the account owner.' });
  else {
    const match = rec.ownersRoles.find(r=>r.role!=='Owner' && r.role!=='Trusted Contact' && similarity(r.name, signerName) > 0.9);
    if (match) items.push({ status:'flag', title:'Signer identity', detail:'Signer "'+signerName+'" does not match the account owner, but matches '+match.role+' on file ("'+match.name+'"). Confirm this is an intentional non-owner signature before authorizing.' });
    else items.push({ status:'flag', title:'Signer identity', detail:'Signer "'+signerName+'" does not match the account owner and does not match any Power of Attorney or 3rd Party Signer on file. Confirm signing authority before authorizing.' });
  }

  const hasBlock = items.some(i=>i.status==='block');
  const hasFlag = items.some(i=>i.status==='flag');
  const overall = hasBlock ? 'block' : hasFlag ? 'flag' : 'pass';
  const overallLabel = hasBlock ? 'Blocked — do not proceed' : hasFlag ? 'Flagged for review' : 'Passed — ready for processing';

  document.getElementById('verdictPill').className = 'verdict-pill ' + overall;
  document.getElementById('verdictPill').textContent = overallLabel;
  document.getElementById('verdictCase').textContent = caseId;

  const blocks = items.filter(i=>i.status==='block');
  const flags = items.filter(i=>i.status==='flag');
  const passes = items.filter(i=>i.status==='pass');
  const renderGroup = (title, list, cls) => !list.length ? '' : '<div class="group-label '+cls+'">'+title+'</div>' + list.map(i =>
    '<div class="item"><div class="status '+i.status+'">'+(i.status==='block'?'✕':'⚠')+'</div><div class="body"><div class="title">'+i.title+'</div><div class="detail">'+i.detail+'</div></div></div>').join('');

  let html = renderGroup('Blocked', blocks, 'block') + renderGroup('Flagged for review', flags, 'flag');
  if (passes.length) html += '<details class="clean-summary"><summary><span class="tick">✓</span> '+passes.length+' other check'+(passes.length===1?'':'s')+' passed</summary><div class="clean-list">' +
    passes.map(i=>'<div class="clean-row">'+i.title+'</div>').join('') + '</div></details>';

  document.getElementById('itemsCard').innerHTML = html;
  document.getElementById('verdictShell').classList.add('show');
}
