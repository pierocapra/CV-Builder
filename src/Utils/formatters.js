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

const formatDate = (dateString) => {
  if (!dateString) return '';
  if (dateString === 'Present') return 'Present';
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  } catch (e) {
    console.error('Error formatting date:', e);
  }
  return dateString;
};

export const formatCvValue = (key, value) => {
  // List of known boolean fields
  const booleanFields = ['eligibleToWorkInUk', 'hasDrivingLicense'];

  if (booleanFields.includes(key)) {
    return value ? 'Yes' : 'No';
  }

  // Handle date formatting
  if (key === 'dateOfBirth' || key === 'startDate' || key === 'endDate') {
    return formatDate(value);
  }

  return value;
};

export { formatFieldName, formatDate };
