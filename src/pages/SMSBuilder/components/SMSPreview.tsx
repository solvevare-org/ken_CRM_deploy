import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { replaceVariables, getSMSInfo } from '../utils/variableUtils';

interface SMSPreviewProps {
  message: string;
  sampleData?: Record<string, string>;
}

const SMSPreview: React.FC<SMSPreviewProps> = ({ 
  message, 
  sampleData = {
    firstName: 'John',
    lastName: 'Smith',
    fullName: 'John Smith',
    phone: '(555) 123-4567',
    propertyAddress: '123 Main Street',
    propertyPrice: '$450,000',
    realtorName: 'Jane Doe',
    realtorPhone: '(555) 987-6543',
    appointmentDate: 'March 15',
    appointmentTime: '2:00 PM',
    currentDate: 'March 10, 2024',
    companyName: 'Your Realty Co.',
  }
}) => {
  const previewMessage = replaceVariables(message, sampleData);
  const smsInfo = getSMSInfo(previewMessage);

  return (
    <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <MessageIcon color="primary" />
        <Typography variant="h6">SMS Preview</Typography>
      </Box>

      {/* Phone Mockup */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 300,
            bgcolor: 'white',
            border: '8px solid #333',
            borderRadius: '25px',
            p: 2,
            boxShadow: 3,
          }}
        >
          {/* Phone Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #eee' }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              SMS from {sampleData.companyName || 'Your Company'}
            </Typography>
          </Box>

          {/* SMS Bubble */}
          <Box
            sx={{
              bgcolor: '#007AFF',
              color: 'white',
              p: 2,
              borderRadius: '18px 18px 18px 4px',
              mb: 1,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: '16px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {previewMessage || 'Type your message to see preview...'}
          </Box>

          {/* Message Status */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Delivered
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* SMS Information */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            SMS Information
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`${smsInfo.length} characters`}
              color={smsInfo.exceeds ? 'error' : 'default'}
              variant="outlined"
              size="small"
            />
            <Chip 
              label={`${smsInfo.segments} segment${smsInfo.segments > 1 ? 's' : ''}`}
              color={smsInfo.segments > 1 ? 'warning' : 'success'}
              variant="outlined"
              size="small"
            />
            {smsInfo.isExtended && (
              <Chip 
                label="Extended SMS"
                color="info"
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Box>

        {smsInfo.segments > 1 && (
          <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="caption" color="warning.dark">
              ⚠️ This message will be sent as {smsInfo.segments} SMS segments. 
              Standard SMS rates apply for each segment.
            </Typography>
          </Box>
        )}

        {smsInfo.exceeds && (
          <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography variant="caption" color="error.dark">
              ❌ Message exceeds maximum SMS length. Please shorten your message.
            </Typography>
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Sample Data Used
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(sampleData).map(([key, value]) => 
              message.includes(`{{${key}}}`) && (
                <Chip 
                  key={key}
                  label={`${key}: ${value}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SMSPreview;
