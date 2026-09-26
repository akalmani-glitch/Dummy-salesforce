const SYSTEM_RECORDS = {
  "ACC-10234": {
    clientName: "Jane M. Carter", dob: "1965-04-12", address: "123 Main St, St. Louis",
    stateCode: "MO", accountType: "Individual Brokerage", maritalStatus: "Married", status: "Pending",
    ownersRoles: [ { name: "Jane M. Carter", role: "Owner" } ],
    beneficiaryDetail: { primaries: [
      { name: "Robert Carter", relationship: "Spouse", ssn: "XXX-XX-2210", dob: "1962-03-01", type: "Individual",
        allocationMethod: "Percentage", allocationValue: 100, contingents: [] }
    ] },
    docs: [
      { docType: "TOD", name: "Transfer on Death Agreement - signed", date: "08/20/2026", status: "Filed" }
    ],
    notepad: [
      { date: "08/21/2026", author: "M. Reyes", note: "TOD form reviewed, no exceptions found. Approved for processing." }
    ],
    contacts: [
      { name: "Jane M. Carter", roleType: "Owner", phone: "314-555-0110", address: "123 Main St, St. Louis, MO" },
      { name: "Robert Carter", roleType: "Beneficiary", phone: "314-555-0199", address: "" }
    ],
    poaDetail: { agentName: "", ownerName: "", beneficiaryPower: "" },
    poaRole: { agentName: "", powerOfAttorneyFor: "", ssn: "", status: "", effectiveDate: "", notes: "" }
  },
  "ACC-12045": {
    clientName: "Robert T. Ellis", dob: "1948-06-15", address: "9 Birch Ln, Peoria",
    stateCode: "IL", accountType: "Individual Brokerage", maritalStatus: "Widowed", status: "Pending",
    ownersRoles: [
      { name: "Robert T. Ellis", role: "Owner" },
      { name: "Susan Ellis-Marks", role: "Power of Attorney" }
    ],
    beneficiaryDetail: { primaries: [
      { name: "Susan Ellis-Marks", relationship: "Daughter", ssn: "XXX-XX-3391", dob: "1985-01-05", type: "Individual",
        allocationMethod: "Percentage", allocationValue: 100, contingents: [] }
    ] },
    docs: [
      { docType: "POA", name: "Power of Attorney agreement", date: "07/02/2026", status: "Completed" },
      { docType: "TOD", name: "Transfer on Death Agreement - signed", date: "09/01/2026", status: "Pending review" }
    ],
    notepad: [
      { date: "07/03/2026", author: "K. Nolan", note: "POA agreement reviewed. Susan Ellis-Marks authorized as POA with full scope, exp 01/2028. Added to Owners & Roles." }
    ],
    contacts: [
      { name: "Robert T. Ellis", roleType: "Owner", phone: "309-555-0142", address: "9 Birch Ln, Peoria, IL" },
      { name: "Susan Ellis-Marks", roleType: "POA / Beneficiary", phone: "309-555-0187", address: "" }
    ],
    poaDetail: { agentName: "Susan Ellis-Marks", ownerName: "Robert T. Ellis", beneficiaryPower: "Yes — authorized to designate or change beneficiary" },
    poaRole: { agentName: "Susan Ellis-Marks", powerOfAttorneyFor: "Robert T. Ellis", ssn: "XXX-XX-9021", status: "Authorised", effectiveDate: "07/02/2026", notes: "Full scope POA, exp 01/2028." }
  },
  "ACC-10567": {
    clientName: "David L. Nguyen", dob: "1978-09-03", address: "45 Oak Ave, Kansas City",
    stateCode: "MO", accountType: "Trust", maritalStatus: "Married", status: "Pending",
    ownersRoles: [ { name: "David L. Nguyen", role: "Owner" } ],
    beneficiaryDetail: { primaries: [
      { name: "Emily Nguyen", relationship: "Daughter", ssn: "XXX-XX-4471", dob: "1985-01-05", type: "Individual",
        allocationMethod: "Equal", allocationValue: null, contingents: [
          { name: "Sophia Nguyen", ssn: "XXX-XX-4472", dob: "2012-05-19", type: "Individual", allocationMethod: "Equal", allocationValue: null },
          { name: "Ethan Nguyen", ssn: "XXX-XX-4473", dob: "2015-09-02", type: "Individual", allocationMethod: "Equal", allocationValue: null }
        ] },
      { name: "Michael Nguyen", relationship: "Son", ssn: "XXX-XX-4481", dob: "1988-09-10", type: "Individual",
        allocationMethod: "Equal", allocationValue: null, contingents: [] }
    ] },
    docs: [
      { docType: "Trust", name: "Trust Certification", date: "06/15/2026", status: "Filed" },
      { docType: "TOD", name: "Transfer on Death Agreement - signed", date: "09/05/2026", status: "Pending review" }
    ],
    notepad: [
      { date: "06/16/2026", author: "T. Ibarra", note: "Trust document reviewed. Trustee authority confirmed for David L. Nguyen. Account converted from Individual to Trust." }
    ],
    contacts: [
      { name: "David L. Nguyen", roleType: "Owner / Trustee", phone: "816-555-0121", address: "45 Oak Ave, Kansas City, MO" }
    ],
    poaDetail: { agentName: "", ownerName: "", beneficiaryPower: "" },
    poaRole: { agentName: "", powerOfAttorneyFor: "", ssn: "", status: "", effectiveDate: "", notes: "" }
  },
  "ACC-11890": {
    clientName: "Patricia A. Owens", dob: "1952-11-27", address: "78 River Rd, Springfield",
    stateCode: "IL", accountType: "Individual Brokerage", maritalStatus: "Married", status: "Pending",
    ownersRoles: [ { name: "Patricia A. Owens", role: "Owner" } ],
    beneficiaryDetail: { primaries: [
      { name: "Thomas Owens", relationship: "Son", ssn: "XXX-XX-5510", dob: "1980-02-14", type: "Individual",
        allocationMethod: "Percentage", allocationValue: 60, contingents: [
          { name: "Sofia Owens-Diaz", ssn: "XXX-XX-5511", dob: "2009-07-22", type: "Individual", allocationMethod: "Equal", allocationValue: null }
        ] },
      { name: "Karen Owens-Diaz", relationship: "Daughter", ssn: "XXX-XX-5520", dob: "1983-11-03", type: "Individual",
        allocationMethod: "Percentage", allocationValue: 40, contingents: [] }
    ] },
    docs: [],
    notepad: [],
    contacts: [
      { name: "Patricia A. Owens", roleType: "Owner", phone: "217-555-0133", address: "78 River Rd, Springfield, IL" }
    ],
    poaDetail: { agentName: "", ownerName: "", beneficiaryPower: "" },
    poaRole: { agentName: "", powerOfAttorneyFor: "", ssn: "", status: "", effectiveDate: "", notes: "" }
  },
  "BLANK": {
    clientName: "", dob: "", address: "", stateCode: "", accountType: "Individual Brokerage",
    maritalStatus: "", status: "Pending",
    ownersRoles: [ { name: "", role: "Owner" } ],
    beneficiaryDetail: { primaries: [] },
    docs: [], notepad: [], contacts: [],
    poaDetail: { agentName: "", ownerName: "", beneficiaryPower: "" },
    poaRole: { agentName: "", powerOfAttorneyFor: "", ssn: "", status: "Authorised", effectiveDate: "", notes: "" }
  }
};

const FORM_SCENARIOS = {
  "ACC-10234": { clientName: "Jane M. Carter", signerName: "Jane M. Carter", capacityNoted: "",
    title: "Transfer on Death Agreement", scanDate: "08/20/2026", signatureDate: "09/10/2026", stateCode: "MO",
    primaries: [ { name: "Robert Carter", relationship: "Spouse", ssn: "On file", dob: "1962-03-01",
      allocationMethod: "Percentage", allocationValue: 100, contingents: [] } ] },
  "ACC-12045": { clientName: "Robert T. Ellis", signerName: "Susan Ellis-Marks", capacityNoted: "",
    title: "Transfer on Death Agreement", scanDate: "09/01/2026", signatureDate: "09/12/2026", stateCode: "IL",
    primaries: [ { name: "Susan Ellis-Marks", relationship: "Daughter", ssn: "On file", dob: "1985-01-05",
      allocationMethod: "Percentage", allocationValue: 100, contingents: [] } ] },
  "ACC-10567": { clientName: "David L. Nguyen", signerName: "David L. Nguyen", capacityNoted: "",
    title: "Transfer on Death Agreement", scanDate: "09/05/2026", signatureDate: "09/15/2026", stateCode: "MO",
    primaries: [
      { name: "Emily Nguyen", relationship: "Daughter", ssn: "On file", dob: "1985-01-05",
        allocationMethod: "Equal", allocationValue: null, contingents: [
          { name: "Sophia Nguyen", ssn: "On file", dob: "2012-05-19", allocationMethod: "Equal", allocationValue: null },
          { name: "Ethan Nguyen", ssn: "On file", dob: "2015-09-02", allocationMethod: "Equal", allocationValue: null }
        ] },
      { name: "Michael Nguyen", relationship: "Son", ssn: "On file", dob: "1988-09-10",
        allocationMethod: "Equal", allocationValue: null, contingents: [] }
    ] },
  "ACC-11890": { clientName: "Patricia A. Owens", signerName: "Patricia A. Owens", capacityNoted: "",
    title: "Beneficiary Change Request", scanDate: "05/01/2026", signatureDate: "05/03/2026", stateCode: "IL",
    primaries: [
      { name: "Thomas Owens", relationship: "Son", ssn: "On file", dob: "1980-02-14",
        allocationMethod: "Percentage", allocationValue: 60, contingents: [
          { name: "Sofia Owens-Diaz", ssn: "On file", dob: "2009-07-22", allocationMethod: "Equal", allocationValue: null }
        ] },
      { name: "Karen Owens-Diaz", relationship: "Daughter", ssn: "On file", dob: "1983-11-04",
        allocationMethod: "Percentage", allocationValue: 40, contingents: [] }
    ] },
  "BLANK": { clientName: "", signerName: "", capacityNoted: "", title: "", scanDate: "", signatureDate: "", stateCode: "", primaries: [] }
};
