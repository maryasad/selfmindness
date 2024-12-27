import React from 'react';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { Language } from '../types';

interface TherapistSelectorProps {
  selectedTherapist: string;
  onTherapistChange: (therapist: string) => void;
  language: Language;
}

export const therapists = {
  en: [
    'Dr. Sarah Johnson - Anxiety & Depression Specialist',
    'Dr. Michael Chen - Relationship Counselor',
    'Dr. Emily Parker - Trauma Therapist',
    'Dr. David Wilson - Addiction Recovery Specialist'
  ],
  fa: [
    'دکتر سارا جانسون - متخصص اضطراب و افسردگی',
    'دکتر مایکل چن - مشاور روابط',
    'دکتر امیلی پارکر - درمانگر تروما',
    'دکتر دیوید ویلسون - متخصص بهبود اعتیاد'
  ],
  da: [
    'Dr. Sarah Johnson - Specialist i angst og depression',
    'Dr. Michael Chen - Parterapeut',
    'Dr. Emily Parker - Traumeterapeut',
    'Dr. David Wilson - Specialist i misbrugsbehandling'
  ],
  fr: [
    'Dr. Sarah Johnson - Spécialiste anxiété et dépression',
    'Dr. Michael Chen - Conseiller conjugal',
    'Dr. Emily Parker - Thérapeute trauma',
    'Dr. David Wilson - Spécialiste en addictologie'
  ],
  ar: [
    'د. سارة جونسون - أخصائية القلق والاكتئاب',
    'د. مايكل تشن - مستشار العلاقات',
    'د. إيميلي باركر - معالجة الصدمات',
    'د. ديفيد ويلسون - أخصائي علاج الإدمان'
  ]
};

export const TherapistSelector: React.FC<TherapistSelectorProps> = ({
  selectedTherapist,
  onTherapistChange,
  language
}) => {
  const handleChange = (event: { target: { value: string } }) => {
    onTherapistChange(event.target.value);
  };

  const currentTherapists = therapists[language] || therapists.en;

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'
        }}
      >
        {language === 'en' ? 'Select Your Therapist' :
         language === 'fa' ? 'درمانگر خود را انتخاب کنید' :
         language === 'da' ? 'Vælg din terapeut' :
         language === 'fr' ? 'Choisissez votre thérapeute' :
         'اختر معالجك النفسي'}
      </Typography>
      <FormControl fullWidth>
        <Select
          value={selectedTherapist}
          onChange={handleChange}
          displayEmpty
          sx={{
            backgroundColor: 'white',
            direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'
          }}
          MenuProps={{
            PaperProps: {
              style: {
                direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'
              }
            }
          }}
        >
          <MenuItem value="" disabled>
            <em>
              {language === 'en' ? 'Choose a therapist' :
               language === 'fa' ? 'یک درمانگر انتخاب کنید' :
               language === 'da' ? 'Vælg en terapeut' :
               language === 'fr' ? 'Choisir un thérapeute' :
               'اختر معالجاً'}
            </em>
          </MenuItem>
          {currentTherapists.map((therapist, index) => (
            <MenuItem 
              key={index} 
              value={therapist}
              sx={{
                direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr',
                textAlign: language === 'ar' || language === 'fa' ? 'right' : 'left'
              }}
            >
              {therapist}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
