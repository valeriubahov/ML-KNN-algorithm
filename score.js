const outputs = [];

// Ran every time a ball drops into a bucket
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;

  const k = 10;

  _.range(0, 3).forEach((feature) => {
    // feature === 0. 1 and 2
    const data = _.map(outputs, (row) => [row[feature], _.last(row)]);
    const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);

    const accuracy = _.chain(testSet)
      .filter((testPoint) => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value();

    const featureName = getFeatureName(feature);
    console.log(featureName, "the accuracy is", accuracy);
  });
}

// KNN => K-Nearest Neighbor

function knn(data, point, k) {
  return _.chain(data)
    .map((row) => {
      return [distance(_.initial(row), point), _.last(row)];
    })
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  // Will take in consideration and will work if more values are passed into the array
  // Pythagorean Theorem to find the distance between 2 points
  return (
    _.chain(pointA)
      .zip(pointB) // create an array of arrays that will include pointA and pointB
      .map(([a, b]) => (a - b) ** 2) // find difference between 2 points
      .sum()
      .value() ** 0.5 // apply square root to final result
  );
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

function minMax(data, numColumns) {
  const clonedData = _.cloneDeep(data);

  for (let i = 0; i < numColumns; i++) {
    const column = clonedData.map((row) => row[i]);

    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }

  return clonedData;
}

function getFeatureName(feature) {
  switch (feature) {
    case 0:
      return "Considering only the position";
    case 1:
      return "Considering only the bounciness";
    case 2:
      return "Considering only the ball size";
    default:
      return "For feature of";
  }
}
