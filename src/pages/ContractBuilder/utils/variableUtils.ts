/**
 * Utility functions for handling dynamic variables in contract templates
 */

export interface ContractVariable {
  key: string;
  label: string;
  example: string;
  category: string;
}

/**
 * Get all available contract variables
 */
export const getAllVariables = (): ContractVariable[] => {
  const categories = [
    {
      name: 'buyer',
      variables: [
        { key: 'buyerName', label: 'Buyer Full Name', example: 'John Smith' },
        { key: 'buyerFirstName', label: 'Buyer First Name', example: 'John' },
        { key: 'buyerLastName', label: 'Buyer Last Name', example: 'Smith' },
        { key: 'buyerAddress', label: 'Buyer Address', example: '456 Oak Street, City, State 12345' },
        { key: 'buyerPhone', label: 'Buyer Phone', example: '(555) 123-4567' },
        { key: 'buyerEmail', label: 'Buyer Email', example: 'john.smith@email.com' },
      ]
    },
    {
      name: 'seller',
      variables: [
        { key: 'sellerName', label: 'Seller Full Name', example: 'Jane Doe' },
        { key: 'sellerFirstName', label: 'Seller First Name', example: 'Jane' },
        { key: 'sellerLastName', label: 'Seller Last Name', example: 'Doe' },
        { key: 'sellerAddress', label: 'Seller Address', example: '789 Pine Avenue, City, State 12345' },
        { key: 'sellerPhone', label: 'Seller Phone', example: '(555) 987-6543' },
        { key: 'sellerEmail', label: 'Seller Email', example: 'jane.doe@email.com' },
      ]
    },
    {
      name: 'property',
      variables: [
        { key: 'propertyAddress', label: 'Property Address', example: '123 Main Street, City, State 12345' },
        { key: 'propertyPrice', label: 'Property Price', example: '$450,000' },
        { key: 'propertyType', label: 'Property Type', example: 'Single Family Residence' },
        { key: 'bedrooms', label: 'Bedrooms', example: '3' },
        { key: 'bathrooms', label: 'Bathrooms', example: '2.5' },
        { key: 'squareFootage', label: 'Square Footage', example: '2,100 sq ft' },
        { key: 'lotSize', label: 'Lot Size', example: '0.25 acres' },
        { key: 'yearBuilt', label: 'Year Built', example: '2018' },
        { key: 'parcelNumber', label: 'Parcel Number', example: 'APN: 123-456-789' },
      ]
    },
    {
      name: 'financial',
      variables: [
        { key: 'purchasePrice', label: 'Purchase Price', example: '$450,000' },
        { key: 'downPayment', label: 'Down Payment', example: '$90,000' },
        { key: 'loanAmount', label: 'Loan Amount', example: '$360,000' },
        { key: 'earnestMoney', label: 'Earnest Money', example: '$5,000' },
        { key: 'closingCosts', label: 'Closing Costs', example: '$8,000' },
        { key: 'escrowAmount', label: 'Escrow Amount', example: '$2,500' },
      ]
    },
    {
      name: 'dates',
      variables: [
        { key: 'contractDate', label: 'Contract Date', example: 'March 15, 2024' },
        { key: 'closingDate', label: 'Closing Date', example: 'April 30, 2024' },
        { key: 'inspectionDeadline', label: 'Inspection Deadline', example: 'March 25, 2024' },
        { key: 'appraisalDeadline', label: 'Appraisal Deadline', example: 'April 10, 2024' },
        { key: 'financingDeadline', label: 'Financing Deadline', example: 'April 15, 2024' },
        { key: 'possessionDate', label: 'Possession Date', example: 'May 1, 2024' },
      ]
    },
    {
      name: 'agents',
      variables: [
        { key: 'buyerAgentName', label: 'Buyer Agent Name', example: 'Alice Johnson' },
        { key: 'buyerAgentPhone', label: 'Buyer Agent Phone', example: '(555) 111-2222' },
        { key: 'buyerAgentEmail', label: 'Buyer Agent Email', example: 'alice@realty.com' },
        { key: 'buyerBrokerage', label: 'Buyer Brokerage', example: 'Premier Realty' },
        { key: 'sellerAgentName', label: 'Seller Agent Name', example: 'Bob Wilson' },
        { key: 'sellerAgentPhone', label: 'Seller Agent Phone', example: '(555) 333-4444' },
        { key: 'sellerAgentEmail', label: 'Seller Agent Email', example: 'bob@realty.com' },
        { key: 'sellerBrokerage', label: 'Seller Brokerage', example: 'Elite Properties' },
      ]
    },
    {
      name: 'legal',
      variables: [
        { key: 'titleCompany', label: 'Title Company', example: 'First National Title' },
        { key: 'escrowCompany', label: 'Escrow Company', example: 'Secure Escrow Services' },
        { key: 'lender', label: 'Lender', example: 'City Bank' },
        { key: 'attorney', label: 'Attorney', example: 'Smith & Associates Law Firm' },
        { key: 'notary', label: 'Notary Public', example: 'Mary Williams, Notary Public' },
      ]
    },
    {
      name: 'system',
      variables: [
        { key: 'currentDate', label: 'Current Date', example: 'March 10, 2024' },
        { key: 'currentTime', label: 'Current Time', example: '10:30 AM PST' },
        { key: 'documentNumber', label: 'Document Number', example: 'DOC-2024-001' },
        { key: 'companyName', label: 'Company Name', example: 'Your Real Estate Company' },
        { key: 'companyAddress', label: 'Company Address', example: '100 Business Blvd, Suite 200' },
        { key: 'companyPhone', label: 'Company Phone', example: '(555) 000-0000' },
      ]
    }
  ];

  const allVariables: ContractVariable[] = [];
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
 * Format a variable for insertion into contract content
 */
export const formatVariable = (variableKey: string): string => {
  return `{{${variableKey}}}`;
};

/**
 * Replace variables in contract text with actual values
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
 * Extract variables from contract template
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
 * Get variables by category for contracts
 */
export const getVariablesByCategory = (): Record<string, ContractVariable[]> => {
  const allVariables = getAllVariables();
  const grouped: Record<string, ContractVariable[]> = {};
  
  allVariables.forEach(variable => {
    if (!grouped[variable.category]) {
      grouped[variable.category] = [];
    }
    grouped[variable.category].push(variable);
  });
  
  return grouped;
};
