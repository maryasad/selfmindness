import React from 'react';
import { Box, Paper, IconButton, Tooltip, Select, MenuItem, FormControl } from '@mui/material';
import { Woman, Man } from '@mui/icons-material';
import { VoiceSettings } from '../types';
import { setVoiceSettings } from '../services/chatbot';

interface VoiceSelectorProps {
  currentSettings: VoiceSettings;
  onVoiceChange: (settings: VoiceSettings) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  currentSettings,
  onVoiceChange,
}) => {
  const handleGenderChange = (gender: 'male' | 'female') => {
    const newSettings = { ...currentSettings, gender };
    setVoiceSettings(newSettings);
    onVoiceChange(newSettings);
  };

  const handleLanguageChange = (event: any) => {
    const language = event.target.value as 'en' | 'fa' | 'da';
    console.log('Language changed to:', language);
    
    // Create new settings
    const newSettings = { 
      ...currentSettings, 
      language 
    };
    
    // Update both local and global settings
    setVoiceSettings(newSettings);
    onVoiceChange(newSettings);
    
    console.log('Voice settings updated:', newSettings);
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 1.5,
        background: 'linear-gradient(135deg, #f6f8ff 0%, #f0f3ff 100%)',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #2196f3, #e91e63)',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        justifyContent: 'space-between'
      }}>
        {/* Language Selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={currentSettings.language}
            onChange={handleLanguageChange}
            size="small"
            sx={{
              '& .MuiSelect-select': {
                py: 1,
                px: 1.5,
              }
            }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="da">Dansk</MenuItem>
            <MenuItem value="fa">فارسی</MenuItem>
          </Select>
        </FormControl>

        {/* Gender Selection */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1
        }}>
          <Tooltip title={currentSettings.language === 'en' ? "Female Voice" : "صدای زن"}>
            <Paper
              elevation={currentSettings.gender === 'female' ? 4 : 1}
              sx={{
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                transform: currentSettings.gender === 'female' ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: 'linear-gradient(135deg, #fff5f8 0%, #fff0f7 100%)',
                }
              }}
              onClick={() => handleGenderChange('female')}
            >
              <IconButton
                size="small"
                sx={{
                  color: currentSettings.gender === 'female' ? '#e91e63' : '#9e9e9e',
                  backgroundColor: currentSettings.gender === 'female' ? '#fce4ec' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#fce4ec',
                  }
                }}
              >
                <Woman />
              </IconButton>
            </Paper>
          </Tooltip>

          <Tooltip title={currentSettings.language === 'en' ? "Male Voice" : "صدای مرد"}>
            <Paper
              elevation={currentSettings.gender === 'male' ? 4 : 1}
              sx={{
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                transform: currentSettings.gender === 'male' ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: 'linear-gradient(135deg, #f3f8ff 0%, #e6f0ff 100%)',
                }
              }}
              onClick={() => handleGenderChange('male')}
            >
              <IconButton
                size="small"
                sx={{
                  color: currentSettings.gender === 'male' ? '#2196f3' : '#9e9e9e',
                  backgroundColor: currentSettings.gender === 'male' ? '#e3f2fd' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  }
                }}
              >
                <Man />
              </IconButton>
            </Paper>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};
