function kidsWithCandies(candies: number[], extraCandies: number): boolean[] {
  const boolArray: boolean[] = []

  const kidWithMostCandies = Math.max(...candies);
  candies.map((kid, i) => {
    (kid + extraCandies) >= kidWithMostCandies ? boolArray.push(true) : boolArray.push(false);
  })

  console.log(boolArray)
  return boolArray
};

kidsWithCandies([12, 1, 12], 10)
