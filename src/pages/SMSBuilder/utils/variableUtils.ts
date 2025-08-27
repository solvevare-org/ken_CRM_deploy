/**
 * Utility functions for handling dynamic variables in SMS templates
 */

export interface SMSVariable {
  key: string;
  label: string;
  example: string;
  category: string;
}

/**
 * Get all available SMS variables (same as email but optimized for SMS)
 */
export const getAllVariables = (): SMSVariable[] => {
  const categories = [
    {
      name: 'client',
      variables: [
        { key: 'firstName', label: 'First Name', example: 'John' },
        { key: 'lastName', label: 'Last Name', example: 'Smith' },
        { key: 'fullName', label: 'Full Name', example: 'John Smith' },
        { key: 'phone', label: 'Phone Number', example: '(555) 123-4567' },
        { key: 'email', label: 'Email Address', example: 'john@email.com' },
      ]
    },
    {
      name: 'property',
      variables: [
        { key: 'propertyAddress', label: 'Property Address', example: '123 Main St' },
        { key: 'propertyPrice', label: 'Property Price', example: '$450K' },
        { key: 'propertyType', label: 'Property Type', example: 'Single Family' },
        { key: 'bedrooms', label: 'Bedrooms', example: '3' },
        { key: 'bathrooms', label: 'Bathrooms', example: '2' },
      ]
    },
    {
      name: 'realtor',
      variables: [
        { key: 'realtorName', label: 'Realtor Name', example: 'Jane Doe' },
        { key: 'realtorPhone', label: 'Realtor Phone', example: '(555) 987-6543' },
        { key: 'brokerage', label: 'Brokerage', example: 'Prime Realty' },
      ]
    },
    {
      name: 'appointment',
      variables: [
        { key: 'appointmentDate', label: 'Appointment Date', example: 'March 15' },
        { key: 'appointmentTime', label: 'Appointment Time', example: '2:00 PM' },
        { key: 'meetingLocation', label: 'Meeting Location', example: 'Property Location' },
      ]
    },
    {
      name: 'system',
      variables: [
        { key: 'currentDate', label: 'Current Date', example: 'March 10, 2024' },
        { key: 'currentTime', label: 'Current Time', example: '10:30 AM' },
        { key: 'companyName', label: 'Company Name', example: 'Your Realty Co.' },
        { key: 'companyPhone', label: 'Company Phone', example: '(555) 000-0000' },
        { key: 'unsubscribeLink', label: 'Unsubscribe Link', example: 'Reply STOP' },
      ]
    }
  ];

  const allVariables: SMSVariable[] = [];
  categories.forEach(category => {
    category.variables.forEach(variable => {
      allVariables.push({
        ...variable,
        category: category.name
      });
    });
  });

  return allVariables;
};

/**
 * Format a variable for insertion into SMS content
 */
export const formatVariable = (variableKey: string): string => {
  return `{{${variableKey}}}`;
};

/**
 * Replace variables in SMS text with actual values
 */
export const replaceVariables = (text: string, values: Record<string, string>): string => {
  let result = text;
  
  Object.entries(values).forEach(([key, value]) => {
    const variablePattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(variablePattern, value);
  });
  
  return result;
};

/**
 * Extract variables from SMS template
 */
export const extractVariablesFromTemplate = (text: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    variables.push(match[1]);
  }
  
  return [...new Set(variables)]; // Remove duplicates
};

/**
 * Get variables by category for SMS
 */
export const getVariablesByCategory = (): Record<string, SMSVariable[]> => {
  const allVariables = getAllVariables();
  const grouped: Record<string, SMSVariable[]> = {};
  
  allVariables.forEach(variable => {
    if (!grouped[variable.category]) {
      grouped[variable.category] = [];
    }
    grouped[variable.category].push(variable);
  });
  
  return grouped;
};

/**
 * Get SMS character count and segment info
 */
export const getSMSInfo = (text: string) => {
  const length = text.length;
  const basicLimit = 160;
  const extendedLimit = 1600;
  
  let segments = 1;
  if (length > basicLimit) {
    segments = Math.ceil(length / 153); // SMS segments after first are 153 chars
  }
  
  return {
    length,
    segments,
    isExtended: length > basicLimit,
    exceeds: length > extendedLimit,
    remaining: length > basicLimit ? extendedLimit - length : basicLimit - length
  };
};
