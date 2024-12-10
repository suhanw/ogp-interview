function isVaccinated(doses) {
  const brandDosesMap = {
    PZ: 2,
    MD: 2,
    CV: 2,
    JJ: 1,
  };

  const brandIntervals = {
    PZ: 17,
    MD: 24,
    CV: 13,
  };

  let counter = {};
  let lastBrand = "";

  //  1. sort the doses by timestamp asc
  const sortedDoses = doses.sort((a, b) => a[1] - b[1]);

  for (let i = 0; i < sortedDoses.length; i++) {
    // 2. iterate through each dose,
    const currentBrand = sortedDoses[i][0];
    const currentTimestamp = sortedDoses[i][1];

    if (currentBrand === "JJ") {
      return ["vaccinated", currentTimestamp + 14];
    } else if (!lastBrand || currentBrand === lastBrand) {
      // 2a. for each brand, create a counter
      counter[currentBrand] = counter[currentBrand]
        ? {
            ...counter[currentBrand],
            count: counter[currentBrand].count + 1,
          }
        : {
            count: 1,
            lastTimestamp: currentTimestamp,
          };
    } else {
      // 2c. if the current brand !== last brand, reset the counter of the last brand
      counter[lastBrand] = null;
    }

    // 2b. check if the counter >= brandDosesMap
    // AND the interval >= brandIntervals[currentBrand]
    // return `vaccinated`
    // else, continue
    if (
      counter[currentBrand]?.count >= brandDosesMap[currentBrand] &&
      currentTimestamp - counter[currentBrand].lastTimestamp >=
        brandIntervals[currentBrand]
    ) {
      return ["vaccinated", currentTimestamp + 14];
    }

    lastBrand = currentBrand;
    if (counter[currentBrand]) {
      counter[currentBrand].lastTimestamp = currentTimestamp;
    }
  }

  return "not_vaccinated";
}

console.log({
  actual: isVaccinated([
    ["PZ", 15],
    ["PZ", 32],
  ]),
  expected: ["vaccinated", 46],
}); // ['vaccinated', 46]
console.log({
  actual: isVaccinated([
    ["PZ", 15],
    ["PZ", 31],
  ]),
  expected: "not_vaccinated",
}); // 'not_vaccinated'
console.log({
  actual: isVaccinated([
    ["MD", 0],
    ["MD", 24],
    ["PZ", 25],
    ["PZ", 42],
  ]),
  expected: ["vaccinated", 38],
}); // ['vaccinated', 38]
console.log({
  actual: isVaccinated([
    ["MD", 30],
    ["MD", 40],
    ["MD", 54],
  ]),
  expected: "not_vaccinated",
}); // 'not_vaccinated'
console.log({
  actual: isVaccinated([
    ["JJ", 10],
    ["CV", 11],
    ["CV", 24],
  ]),
  expected: ["vaccinated", 24],
}); // ['vaccinated', 24]
console.log({
  actual: isVaccinated([
    ["CV", 10],
    ["CV", 35],
    ["MD", 20],
  ]),
  expected: "not_vaccinated",
}); // 'not_vaccinated'
