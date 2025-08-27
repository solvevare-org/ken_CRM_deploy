/**
 * Utility functions for handling dynamic variables in email templates
 */

export interface EmailVariable {
  key: string;
  label: string;
  example: string;
  category: string;
}

/**
 * Get all available email variables
 */
export const getAllVariables = (): EmailVariable[] => {
  const categories = [
    {
      name: 'client',
      variables: [
        { key: 'firstName', label: 'First Name', example: 'John' },
        { key: 'lastName', label: 'Last Name', example: 'Smith' },
        { key: 'fullName', label: 'Full Name', example: 'John Smith' },
        { key: 'email', label: 'Email Address', example: 'john.smith@email.com' },
        { key: 'phone', label: 'Phone Number', example: '+1 (555) 123-4567' },
        { key: 'preferredContactMethod', label: 'Preferred Contact', example: 'Email' },
      ]
    },
    {
      name: 'property',
      variables: [
        { key: 'propertyAddress', label: 'Property Address', example: '123 Main St, City, State 12345' },
        { key: 'propertyPrice', label: 'Property Price', example: '$450,000' },
        { key: 'propertyType', label: 'Property Type', example: 'Single Family Home' },
        { key: 'bedrooms', label: 'Bedrooms', example: '3' },
        { key: 'bathrooms', label: 'Bathrooms', example: '2.5' },
        { key: 'squareFootage', label: 'Square Footage', example: '2,100 sq ft' },
        { key: 'lotSize', label: 'Lot Size', example: '0.25 acres' },
        { key: 'yearBuilt', label: 'Year Built', example: '2018' },
      ]
    },
    {
      name: 'realtor',
      variables: [
        { key: 'realtorName', label: 'Realtor Name', example: 'Jane Doe' },
        { key: 'realtorEmail', label: 'Realtor Email', example: 'jane.doe@realty.com' },
        { key: 'realtorPhone', label: 'Realtor Phone', example: '+1 (555) 987-6543' },
        { key: 'brokerage', label: 'Brokerage', example: 'Prime Real Estate' },
        { key: 'licenseNumber', label: 'License Number', example: 'RE123456789' },
        { key: 'realtorWebsite', label: 'Website', example: 'www.janedoe-realty.com' },
      ]
    },
    {
      name: 'appointment',
      variables: [
        { key: 'appointmentDate', label: 'Appointment Date', example: 'March 15, 2024' },
        { key: 'appointmentTime', label: 'Appointment Time', example: '2:00 PM' },
        { key: 'showingDate', label: 'Showing Date', example: 'March 20, 2024' },
        { key: 'closingDate', label: 'Closing Date', example: 'April 30, 2024' },
        { key: 'currentDate', label: 'Current Date', example: 'Today\'s Date' },
      ]
    },
    {
      name: 'financial',
      variables: [
        { key: 'loanAmount', label: 'Loan Amount', example: '$360,000' },
        { key: 'downPayment', label: 'Down Payment', example: '$90,000' },
        { key: 'monthlyPayment', label: 'Monthly Payment', example: '$2,150' },
        { key: 'interestRate', label: 'Interest Rate', example: '3.75%' },
        { key: 'preApprovalAmount', label: 'Pre-approval Amount', example: '$500,000' },
      ]
    }
  ];

  return categories.flatMap(category =>
    category.variables.map(variable => ({
      ...variable,
      category: category.name
    }))
  );
};

/**
 * Format a variable key for use in templates
 */
export const formatVariable = (key: string): string => {
  return `{{${key}}}`;
};

/**
 * Extract all variables from an email template
 */
export const extractVariablesFromTemplate = (template: string): string[] => {
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const matches = [];
  let match;
  
  while ((match = variableRegex.exec(template)) !== null) {
    matches.push(match[1]);
  }
  
  return [...new Set(matches)]; // Remove duplicates
};

/**
 * Replace variables in a template with actual values
 */
export const replaceVariables = (
  template: string, 
  values: Record<string, string>
): string => {
  let result = template;
  
  Object.entries(values).forEach(([key, value]) => {
    const variablePattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(variablePattern, value);
  });
  
  return result;
};

/**
 * Validate that all variables in a template have corresponding values
 */
export const validateTemplateVariables = (
  template: string, 
  values: Record<string, string>
): { isValid: boolean; missingVariables: string[] } => {
  const templateVariables = extractVariablesFromTemplate(template);
  const missingVariables = templateVariables.filter(variable => !values[variable]);
  
  return {
    isValid: missingVariables.length === 0,
    missingVariables
  };
};

/**
 * Generate sample data for preview purposes
 */
export const generateSampleData = (): Record<string, string> => {
  const variables = getAllVariables();
  const sampleData: Record<string, string> = {};
  
  variables.forEach(variable => {
    sampleData[variable.key] = variable.example;
  });
  
  return sampleData;
};
