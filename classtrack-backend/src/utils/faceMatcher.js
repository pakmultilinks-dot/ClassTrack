const euclideanDistance = (descriptor1, descriptor2) => {
  if (!Array.isArray(descriptor1) || !Array.isArray(descriptor2)) {
    throw new Error("Both descriptors must be arrays");
  }

  if (descriptor1.length !== descriptor2.length) {
    throw new Error("Descriptors must have the same length");
  }

  const sumOfSquaredDifferences = descriptor1.reduce((sum, value, index) => {
    const difference = value - descriptor2[index];
    return sum + difference * difference;
  }, 0);

  return Math.sqrt(sumOfSquaredDifferences);
};

const findBestFaceMatch = (scannedDescriptor, students, threshold = 0.6) => {
  if (!Array.isArray(scannedDescriptor) || !Array.isArray(students)) {
    return {
      matched: false,
      student: null,
      distance: null,
      confidence: 0
    };
  }

  let matchedStudent = null;
  let bestDistance = null;

  students
    .filter((student) => student.isActive !== false && student.faceRegistered === true)
    .forEach((student) => {
      const faceDescriptors = Array.isArray(student.faceDescriptors) ? student.faceDescriptors : [];

      faceDescriptors.forEach((sample) => {
        if (!Array.isArray(sample.descriptor)) {
          return;
        }

        if (sample.descriptor.length !== scannedDescriptor.length) {
          return;
        }

        const distance = euclideanDistance(scannedDescriptor, sample.descriptor);

        if (bestDistance === null || distance < bestDistance) {
          bestDistance = distance;
          matchedStudent = student;
        }
      });
    });

  const confidence = bestDistance === null
    ? 0
    : Math.max(0, Math.round((1 - bestDistance) * 100));

  if (bestDistance !== null && bestDistance <= threshold) {
    return {
      matched: true,
      student: matchedStudent,
      distance: bestDistance,
      confidence
    };
  }

  return {
    matched: false,
    student: null,
    distance: bestDistance,
    confidence: 0
  };
};

module.exports = {
  euclideanDistance,
  findBestFaceMatch
};
