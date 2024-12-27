import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { 
  Psychology,
  SelfImprovement,
  Favorite,
  Work,
  SentimentDissatisfied,
  Storm,
  Healing,
  Block,
  Favorite as HeartBroken
} from '@mui/icons-material';
import { CounselingCategory, Language } from '../types';

interface CategorySelectorProps {
  currentCategory: CounselingCategory;
  onCategoryChange: (category: CounselingCategory) => void;
  language: Language;
}

const categoryInfo: Record<CounselingCategory, {
  icon: React.ReactNode;
  color: string;
  gradient: string;
  titles: Record<Language, string>;
}> = {
  general: {
    icon: <Psychology fontSize="large" />,
    color: '#4CAF50',
    gradient: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
    titles: {
      en: 'General',
      fa: 'عمومی',
      da: 'Generelt',
      fr: 'Général',
      ar: 'عام'
    }
  },
  'self-esteem': {
    icon: <SelfImprovement fontSize="large" />,
    color: '#2196F3',
    gradient: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
    titles: {
      en: 'Self-Esteem',
      fa: 'عزت نفس',
      da: 'Selvværd',
      fr: 'Estime de soi',
      ar: 'تقدير الذات'
    }
  },
  relationships: {
    icon: <Favorite fontSize="large" />,
    color: '#E91E63',
    gradient: 'linear-gradient(45deg, #E91E63 30%, #F06292 90%)',
    titles: {
      en: 'Relationships',
      fa: 'روابط',
      da: 'Relationer',
      fr: 'Relations',
      ar: 'العلاقات'
    }
  },
  anxiety: {
    icon: <Storm fontSize="large" />,
    color: '#FF9800',
    gradient: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
    titles: {
      en: 'Anxiety',
      fa: 'اضطراب',
      da: 'Angst',
      fr: 'Anxiété',
      ar: 'القلق'
    }
  },
  depression: {
    icon: <SentimentDissatisfied fontSize="large" />,
    color: '#9C27B0',
    gradient: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
    titles: {
      en: 'Depression',
      fa: 'افسردگی',
      da: 'Depression',
      fr: 'Dépression',
      ar: 'الاكتئاب'
    }
  },
  trauma: {
    icon: <Healing fontSize="large" />,
    color: '#673AB7',
    gradient: 'linear-gradient(45deg, #673AB7 30%, #9575CD 90%)',
    titles: {
      en: 'Trauma',
      fa: 'تروما',
      da: 'Traume',
      fr: 'Traumatisme',
      ar: 'الصدمة'
    }
  },
  grief: {
    icon: <HeartBroken fontSize="large" />,
    color: '#795548',
    gradient: 'linear-gradient(45deg, #795548 30%, #A1887F 90%)',
    titles: {
      en: 'Grief',
      fa: 'سوگ',
      da: 'Sorg',
      fr: 'Deuil',
      ar: 'الحزن'
    }
  },
  addiction: {
    icon: <Block fontSize="large" />,
    color: '#F44336',
    gradient: 'linear-gradient(45deg, #F44336 30%, #E57373 90%)',
    titles: {
      en: 'Addiction',
      fa: 'اعتیاد',
      da: 'Afhængighed',
      fr: 'Dépendance',
      ar: 'الإدمان'
    }
  }
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  currentCategory,
  onCategoryChange,
  language
}) => {
  return (
    <div>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '15px',
          direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'
        }}
      >
        {language === 'en' ? 'Choose Your Focus Area' : 
         language === 'fa' ? 'حوزه تمرکز خود را انتخاب کنید' : 
         language === 'da' ? 'Vælg dit fokusområde' : 
         language === 'fr' ? 'Choisissez votre domaine de concentration' : 
         'اختر مجال تركيزك'}
      </Typography>

      <Grid container spacing={1.5}>
        {Object.entries(categoryInfo).map(([category, info]) => (
          <Grid item xs={6} sm={4} md={3} key={category}>
            <Paper
              elevation={currentCategory === category ? 3 : 1}
              sx={{
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: currentCategory === category 
                  ? info.gradient
                  : 'white',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  background: info.gradient
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                direction: language === 'ar' || language === 'fa' ? 'rtl' : 'ltr',
                minHeight: '80px',
                justifyContent: 'center'
              }}
              onClick={() => onCategoryChange(category as CounselingCategory)}
            >
              <Box 
                sx={{ 
                  color: currentCategory === category ? 'white' : info.color,
                  marginBottom: '4px',
                  transition: 'color 0.3s ease',
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                {info.icon}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: currentCategory === category ? 'white' : 'rgba(0,0,0,0.87)',
                  fontWeight: 500,
                  transition: 'color 0.3s ease',
                  fontSize: '0.9rem',
                  lineHeight: 1.2
                }}
              >
                {info.titles[language]}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
