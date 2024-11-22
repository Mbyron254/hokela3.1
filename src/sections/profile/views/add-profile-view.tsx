'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import QRCode from 'react-qr-code';
import Paper from '@mui/material/Paper';
import { alpha, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react';
import MobileStepper from '@mui/material/MobileStepper';
import FormHelperText from '@mui/material/FormHelperText';

// ----------------------------------------------------------------------

const steps = [
  'Location Details',
  'Employment History',
  'Job Search Preferences', 
  'Job Alerts',
  'Recruiter Visibility',
  'Mobile App',
  'Connect'
];

const AddProfileView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState<number>(0);
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [employmentHistory, setEmploymentHistory] = useState<{role: string, type: string}[]>([{
    role: '',
    type: ''
  }]);
  const [lookingForJob, setLookingForJob] = useState<string>('no');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [jobAlerts, setJobAlerts] = useState<boolean>(false);
  const [recruiterVisible, setRecruiterVisible] = useState<boolean>(false);

  // Add validation states
  const [errors, setErrors] = useState({
    country: false,
    city: false,
    employmentHistory: false,
    jobTypes: false
  });

  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = {...errors};

    switch(step) {
      case 0: {
        if (!country) {
          newErrors.country = true;
          isValid = false;
        } else {
          newErrors.country = false;
        }
        if (!city) {
          newErrors.city = true;
          isValid = false;
        } else {
          newErrors.city = false;
        }
        break;
      }
      
      case 1:
        const hasEmptyFields = employmentHistory.some(entry => !entry.role || !entry.type);
        if (hasEmptyFields) {
          newErrors.employmentHistory = true;
          isValid = false;
        } else {
          newErrors.employmentHistory = false;
        }
        break;

      case 2:
        if (lookingForJob === 'yes' && jobTypes.length === 0) {
          newErrors.jobTypes = true;
          isValid = false;
        } else {
          newErrors.jobTypes = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) {
      return;
    }

    setActiveStep((prevStep) => {
      const nextStep = prevStep + 1;
      
      if (nextStep === steps.length) {
        const profileData = {
          location: {
            country,
            city
          },
          employmentHistory,
          jobPreferences: {
            lookingForJob,
            jobTypes: lookingForJob === 'yes' ? jobTypes : []
          },
          settings: {
            jobAlerts,
            recruiterVisible
          }
        };
        
        console.log('Profile Data:', profileData);
      }
      
      return nextStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const addEmploymentEntry = () => {
    setEmploymentHistory([...employmentHistory, { role: '', type: '' }]);
  };

  const removeEmploymentEntry = (index: number) => {
    const newHistory = employmentHistory.filter((_, i) => i !== index);
    setEmploymentHistory(newHistory);
  };

  const updateEmploymentEntry = (index: number, field: string, value: string) => {
    const newHistory = [...employmentHistory];
    newHistory[index] = {
      ...newHistory[index],
      [field]: value
    };
    setEmploymentHistory(newHistory);
    setErrors({...errors, employmentHistory: false});
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              mt: 2, 
              borderRadius: 3,
              height: '60dvh',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              backdropFilter: 'blur(8px)',
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1,
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Welcome to Hokela!
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
              Find people, jobs and news in your area
            </Typography>
            <FormControl 
              fullWidth 
              required
              error={errors.country}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }
              }}
            >
              <InputLabel>Country</InputLabel>
              <Select 
                value={country} 
                onChange={(e) => {
                  setCountry(e.target.value);
                  setErrors({...errors, country: false});
                }}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderRadius: 2,
                    borderWidth: 2,
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <MenuItem value="za">South Africa</MenuItem>
                <MenuItem value="ke">Kenya</MenuItem>
                <MenuItem value="ng">Nigeria</MenuItem>
              </Select>
              {errors.country && (
                <FormHelperText error>Please select a country</FormHelperText>
              )}
            </FormControl>
            <FormControl 
              fullWidth
              required
              error={errors.city}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }
              }}
            >
              <InputLabel>City</InputLabel>
              <Select 
                value={city} 
                onChange={(e) => {
                  setCity(e.target.value);
                  setErrors({...errors, city: false});
                }}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderRadius: 2,
                    borderWidth: 2,
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <MenuItem value="johannesburg">Johannesburg</MenuItem>
                <MenuItem value="capetown">Cape Town</MenuItem>
                <MenuItem value="durban">Durban</MenuItem>
              </Select>
              {errors.city && (
                <FormHelperText error>Please select a city</FormHelperText>
              )}
            </FormControl>
          </Paper>
        );
      case 1:
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              mt: 2, 
              borderRadius: 3,
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              backdropFilter: 'blur(8px)',
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 'bold'
                  }}
                >
                  Employment History
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Tell us about your work experience
                </Typography>
              </Box>
              <Button
                startIcon={<Icon icon="mdi:plus" />}
                onClick={addEmploymentEntry}
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                Add Position
              </Button>
            </Box>
            
            <Box sx={{ display: 'grid', gap: 3 }}>
              {employmentHistory.map((entry, index) => (
                <Box key={index} sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
                  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                      Position {index + 1}
                    </Typography>
                    {employmentHistory.length > 1 && (
                      <IconButton 
                        onClick={() => removeEmploymentEntry(index)}
                        sx={{ 
                          color: 'error.main',
                          '&:hover': { 
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.1)
                          }
                        }}
                      >
                        <Icon icon="mdi:delete" />
                      </IconButton>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl 
                      fullWidth
                      required
                      error={errors.employmentHistory && !entry.role}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          }
                        }
                      }}
                    >
                      <InputLabel>Role</InputLabel>
                      <Select 
                        value={entry.role}
                        onChange={(e) => updateEmploymentEntry(index, 'role', e.target.value)}
                        sx={{ 
                          '& .MuiOutlinedInput-notchedOutline': { 
                            borderRadius: 2,
                            borderWidth: 2,
                            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      >
                        <MenuItem value="developer">Software Developer</MenuItem>
                        <MenuItem value="designer">UI/UX Designer</MenuItem>
                        <MenuItem value="manager">Project Manager</MenuItem>
                      </Select>
                      {errors.employmentHistory && !entry.role && (
                        <FormHelperText error>Please select a role</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl 
                      fullWidth
                      required
                      error={errors.employmentHistory && !entry.type}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          }
                        }
                      }}
                    >
                      <InputLabel>Employment Type</InputLabel>
                      <Select 
                        value={entry.type}
                        onChange={(e) => updateEmploymentEntry(index, 'type', e.target.value)}
                        sx={{ 
                          '& .MuiOutlinedInput-notchedOutline': { 
                            borderRadius: 2,
                            borderWidth: 2,
                            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      >
                        <MenuItem value="fulltime">Full Time</MenuItem>
                        <MenuItem value="parttime">Part Time</MenuItem>
                        <MenuItem value="contract">Contract</MenuItem>
                      </Select>
                      {errors.employmentHistory && !entry.type && (
                        <FormHelperText error>Please select employment type</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        );
      case 2:
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              mt: 2, 
              borderRadius: 3,
              height: '60dvh',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              backdropFilter: 'blur(8px)',
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1,
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Job Preferences
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
              Let us know what you're looking for
            </Typography>
            <FormControl sx={{ mb: 4 }} required>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>Are you currently looking for a job?</Typography>
              <RadioGroup 
                value={lookingForJob} 
                onChange={(e) => setLookingForJob(e.target.value)}
                sx={{
                  '& .MuiRadio-root': {
                    color: (theme) => alpha(theme.palette.primary.main, 0.5),
                  }
                }}
              >
                <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
              </RadioGroup>
            </FormControl>
            {lookingForJob === 'yes' && (
              <FormControl 
                fullWidth
                required
                error={errors.jobTypes}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    }
                  }
                }}
              >
                <InputLabel>What kind of jobs are you looking for?</InputLabel>
                <Select 
                  multiple 
                  value={jobTypes} 
                  onChange={(e) => {
                    setJobTypes(e.target.value as string[]);
                    setErrors({...errors, jobTypes: false});
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderRadius: 2,
                      borderWidth: 2,
                      borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <MenuItem value="tech">Technology</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="management">Management</MenuItem>
                </Select>
                {errors.jobTypes && (
                  <FormHelperText error>Please select at least one job type</FormHelperText>
                )}
              </FormControl>
            )}
          </Paper>
        );
      case 3:
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              mt: 2, 
              borderRadius: 3,
              height: '60dvh',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              backdropFilter: 'blur(8px)',
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1,
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Job Alerts
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
              Stay updated with new opportunities
            </Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={jobAlerts} 
                  onChange={(e) => setJobAlerts(e.target.checked)} 
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    }
                  }}
                />
              }
              label={<Typography variant="body1" sx={{ color: 'text.secondary' }}>Enable job alerts for selected job types</Typography>}
            />
          </Paper>
        );
      case 4:
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              mt: 2, 
              borderRadius: 3,
              height: '60dvh',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              backdropFilter: 'blur(8px)',
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1,
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Recruiter Visibility
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
              Control who can see your profile
            </Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={recruiterVisible} 
                  onChange={(e) => setRecruiterVisible(e.target.checked)} 
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    }
                  }}
                />
              }
              label={<Typography variant="body1" sx={{ color: 'text.secondary' }}>Let recruiters know you're open to opportunities</Typography>}
            />
          </Paper>
        );
      case 5:
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              mt: 2, 
              borderRadius: 3,
              height: '60dvh',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              backdropFilter: 'blur(8px)',
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1,
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Mobile App
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500, textAlign: 'center' }}>
              Take Hokela with you everywhere
            </Typography>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              p: 3, 
              borderRadius: 2, 
              display: 'flex',
              justifyContent: 'center',
              boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
            }}>
              <QRCode value="https://play.google.com/store/apps/details?id=com.hokela" size={200} />
            </Box>
          </Paper>
        );
      case 6:
        return (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              mt: 2, 
              borderRadius: 3,
              height: '60dvh',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              backdropFilter: 'blur(8px)',
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1,
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Let's Connect
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500, textAlign: 'center' }}>
              Start building your professional network
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                width: '80%',
                maxWidth: '400px',
                boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Start Connecting
            </Button>
          </Paper>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      p: { xs: 2, sm: 3, md: 5 },
      pb: { xs: 10, sm: 12, md: 15 }
    }}>
      <Box sx={{ maxWidth: 800, width: '100%', mx: 'auto', mb: { xs: 4, sm: 5, md: 6 } }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            backdropFilter: 'blur(8px)',
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            '& .MuiStepLabel-label': {
              color: (theme) => alpha(theme.palette.text.primary, 0.7),
              '&.Mui-active': {
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }
            },
            '& .MuiStepIcon-root': {
              color: (theme) => alpha(theme.palette.primary.main, 0.3),
              '&.Mui-active': {
                color: 'primary.main'
              },
              '&.Mui-completed': {
                color: 'primary.main'
              }
            }
          }}
        >
          {isMobile ? (
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography 
                sx={{ 
                  background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                {steps[activeStep]}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{ 
                    color: (theme) => alpha(theme.palette.primary.main, 0.7),
                    '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }
                  }}
                >
                  <Icon icon="mdi:chevron-left" />
                </IconButton>
                <IconButton 
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                  sx={{ 
                    color: (theme) => alpha(theme.palette.primary.main, 0.7),
                    '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }
                  }}
                >
                  <Icon icon="mdi:chevron-right" />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
        </Paper>
        
        {activeStep === steps.length ? (
          <Paper elevation={3} sx={{ p: 4, mt: 2, borderRadius: 2, textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
              All steps completed - you're ready to go!
            </Typography>
          </Paper>
        ) : (
          <Box>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 3, pb: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1, borderRadius: 2 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button 
                variant="contained" 
                onClick={handleNext}
                sx={{ 
                  borderRadius: 2,
                  boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`
                }}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AddProfileView;