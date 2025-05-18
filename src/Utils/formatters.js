const formatFieldName = (key) => {
  const fieldNameMap = {
    dateOfBirth: 'Date of Birth',
    eligibleToWorkInUk: 'Eligible to Work in the UK',
    hasDrivingLicense: 'Driving License',
  };

  return (
    fieldNameMap[key] ||
    key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase())
  ); // Capitalize first letter
};

export const formatCvValue = (key, value) => {
  // List of known boolean fields
  const booleanFields = ['eligibleToWorkInUk', 'hasDrivingLicense'];

  if (booleanFields.includes(key)) {
    return value ? 'Yes' : 'No';
  }

  return value;
};

export { formatFieldName };
