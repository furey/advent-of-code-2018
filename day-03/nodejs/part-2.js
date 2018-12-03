const {claims} = require(__dirname + '/src/shared.js');

const nonOverlappingClaims = Object.entries(claims)
  .filter(([, claim]) => claim.overlaps === undefined)
  .map(([, claim]) => claim);

const nonOverlappingClaimId = nonOverlappingClaims[0].id;

console.log(`non-overlapping claim id: ${nonOverlappingClaimId}`);
