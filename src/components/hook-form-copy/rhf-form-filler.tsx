import Yup from 'yup';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { isEmpty, isString } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Grid, Stack, Button, Tooltip, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

// import {
//   IReportQuestion,
//   IReportErrorDetails,
//   IReportErrorResponse,
// } from 'src/types/realm/realm-types';

import FormProvider from './form-provider'; // Adjust the import path as needed


type DynamicFormProps = {
  questions: [];
  onSubmit: (data: any) => Promise<boolean>;
  onCancel?: () => void;
  reportSubmissionError?: string;
};

const RHFFormFiller: React.FC<DynamicFormProps> = ({
  questions,
  onSubmit,
  onCancel,
  reportSubmissionError,
}) => {
  const mdUp = useResponsive('up', 'md');

  const campaignRefs = useRef<Array<HTMLElement | null>>([]);

  const generateSchema = (q: any) =>
    Yup.object().shape(
      q.reduce(
        // (acc, question) => {
          // let validator: any = Yup.string(); // Default to string validator

          // if (question.input_type === 'number') {
          //   validator = Yup.number().typeError('Must be a number');
          //   // Numeric validations
          //   if (question.validation?.minValue !== undefined) {
          //     validator = validator.min(
          //       question.validation.minValue,
          //       `Minimum value is ${question.validation.minValue}`
          //     );
          //   }
          //   if (question.validation?.maxValue !== undefined) {
          //     validator = validator.max(
          //       question.validation.maxValue,
          //       `Maximum value is ${question.validation.maxValue}`
          //     );
          //   }
          // } else if(question.input_type === 'multiselect') {
          //   validator =  Yup.array().of(Yup.string()).required('This field is required')
          // }
          // else if (question.input_type === 'file' || question.input_type === 'upload') {
          //   validator = Yup.lazy((value) => {
          //     if (Array.isArray(value)) {
          //       return Yup.array().of(
          //         Yup.mixed().test(
          //           'file-type',
          //           `${question.validation?.regex?.message || 'Invalid Input'} `,
          //           (val) =>
          //             val instanceof File ||
          //             (typeof val === 'string' && !!val) ||
          //             // @ts-expect-error
          //             (val && val?.preview && val?.path)
          //         )
          //       );
          //     }
          //     return Yup.mixed().test(
          //       'file-type',
          //       'Invalid file type',
          //       (val) =>
          //         val instanceof File ||
          //         (typeof val === 'string' && !!val) ||
          //         // @ts-expect-error
          //         (val && val?.preview && val?.path)
          //     );
          //   });
          // } else if (question.input_type === 'geopoint') {
          //   validator = Yup.array()
          //     .of(Yup.number().typeError('Must be a number'))
          //     .length(2, 'Location must be an array of two numbers (latitude and longitude)')
          //     .test(
          //       'is-latitude',
          //       'Latitude must be between -90 and 90',
          //       (value: any) => value && value.length === 2 && value[0] >= -90 && value[0] <= 90
          //     )
          //     .test(
          //       'is-longitude',
          //       'Longitude must be between -180 and 180',
          //       (value: any) => value && value.length === 2 && value[1] >= -180 && value[1] <= 180
          //     );
          // } else {
          //   // String validations
          //   if (question.validation?.required) {
          //     validator = validator.required('This field is required');
          //   }
          //   if (question.validation?.minLength !== undefined) {
          //     validator = validator.min(
          //       question.validation.minLength,
          //       `Minimum length is ${question.validation.minLength}`
          //     );
          //   }
          //   if (question.validation?.maxLength !== undefined) {
          //     validator = validator.max(
          //       question.validation.maxLength,
          //       `Maximum length is ${question.validation.maxLength}`
          //     );
          //   }
          //   if (question.validation?.regex?.matches !== undefined) {
          //     validator = validator.matches(
          //       new RegExp(question.validation.regex.matches),
          //       question.validation?.regex?.message ?? 'Invalid Input'
          //     );
          //   }
          // }
          // acc[question._id] = validator;
          // return acc;
        // },
        // {} as Record<string, Yup.StringSchema | Yup.NumberSchema>
      )
    );
  const validationSchema = React.useMemo(() => generateSchema(questions), [questions]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    shouldFocusError: false,
  });

  const {
    reset,
    resetField,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { isSubmitting, isValid, errors },
  } = methods;

  // useEffect(() => {
  //   if (reportSubmissionError) {
  //     const t: IReportErrorDetails[] | string = Array.isArray(reportSubmissionError.error)
  //       ? reportSubmissionError.error
  //       : reportSubmissionError.error;
  //     if (Array.isArray(t)) {
  //       t?.forEach((r, i) => {
  //         setError(r.question_id?.toString(), { message: r.error });
  //       });
  //     }
  //   }
  // }, [reportSubmissionError, setError]);

  // useEffect(() => {
  //   questions.map((question) => {
  //     if(question.input_type === 'select'){
  //       if()
  //     }
  //   })
  // }, [questions]);

  const handleSubmitting = handleSubmit(async (formData) => {
    const transformedData: Record<string, string> = {};

    Object.entries(formData).forEach(([_id, value]) => {
      if (!isString(value)) {
        value = JSON.stringify(value);
      }
      transformedData[_id] = value;
    });

    const res = await onSubmit(transformedData);
    if (!res) {
      throw new Error('Failed to submit report');
    }
    reset();
    // questions.forEach((question) => {
    //   resetField(question._id.toString());
    // });
  });

  // const handleDrop = useCallback(
  //   (name: string, acceptedFiles: File[]) => {
  //     const files = getValues(name) ?? [];

  //     const newFiles = acceptedFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //         fileType: file.type,
  //       })
  //     );
     
  //     setValue(name, [...files, ...newFiles], { shouldValidate: true });
  //   },
  //   [setValue, getValues]
  // );

  // const handleRemoveFile = useCallback(
  //   (name: string, inputFile: File | string) => {
  //     const files = getValues(name) as unknown as File[];
  //     const filtered = files && files?.filter((file) => file !== inputFile);
  //     // @ts-expect-error
  //     setValue(name, filtered);
  //   },
  //   [setValue, getValues]
  // );

  // const handleRemoveAllFiles = useCallback(
  //   (name: string) => {
  //     // @ts-expect-error
  //     setValue(name, []);
  //   },
  //   [setValue]
  // );

  const handleCancel = () => {
    reset();
    if (onCancel) {
      onCancel();
    }
  };

  console.log(errors, 'ERRORS');
  console.log(isValid, 'IS VALID');

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitting}>
      <Grid container spacing={3} px={1}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* {questions.map((question, index) => {
              let InputComponent: any = RHFTextField; // Default to text field
              let additionalProps = {};

              switch (question.input_type) {
                case 'text':
                case 'email':
                  InputComponent = RHFTextField;
                  break;

                case 'checkbox':
                  InputComponent = RHFCheckbox;
                  break;
                case 'select':
                  InputComponent = RHFSelect;

                  // additionalProps = {
                  //   children: question.options?.map((option) => (
                  //     <MenuItem key={option} value={option}>
                  //       {option}
                  //     </MenuItem>
                  //   )),
                  // };

                  break;
                case 'multiselect':
                  InputComponent = RHFMultiSelect;
                  additionalProps = {
                    options: question.options?.map((option) => ({
                      label: option,
                      value: option,
                    })),
                    placeholder: 'Select multiple options', // Optional placeholder
                    checkbox: true, // Show checkboxes if needed
                    chip: true, // Show chips with selected values if needed
                  };
                  break;

                case 'radio':
                  InputComponent = RHFRadioGroup;
                  additionalProps = {
                    options: question.options.map((option) => ({
                      label: option,
                      value: option,
                    })),
                  };
                  break;
                case 'switch':
                  InputComponent = RHFSwitch;
                  break;
                case 'autocomplete':
                  InputComponent = RHFAutocomplete;
                  additionalProps = {
                    options: question.options,
                  };
                  break;
                case 'slider':
                case 'range':
                  InputComponent = RHFSlider;
                  break;
                case 'code':
                  InputComponent = RHFCode;
                  break;
                case 'editor':
                  InputComponent = RHFEditor;
                  break;
                case 'upload':
                case 'file':
                  InputComponent = RHFUpload;
                  additionalProps = {
                    multiple: question.input_type === 'file',
                    thumbnail: question.input_type === 'file',
                    onDrop: (acceptedFiles: File[]) =>
                      handleDrop(question._id.toString(), acceptedFiles),
                    onRemove: (inputFile: File) =>
                      handleRemoveFile(question._id.toString(), inputFile),
                    onRemoveAll: () => handleRemoveAllFiles(question._id.toString()),
                  };
                  break;
                case 'geopoint':
                  InputComponent = RHFGeoLocation;
                  break;
                case 'image':
                  InputComponent = RHFCamera;
                  additionalProps = {
                    title: question.text,
                  };
                  break;
                case 'number':
                  InputComponent = RHFTextField;
                  additionalProps = {
                    type: 'number',
                  };
                  break;
                default:
                  console.error('Unsupported input type:', question.input_type);
              }

              return (
                <InputComponent
                  key={question._id.toString()} // Add refreshKey to force re-render
                  name={question._id.toString()}
                  ref={(el: HTMLElement | null) => {
                    campaignRefs.current[index] = el;
                  }}
                  {...(question.placeholder ? { placeholder: question.placeholder } : {})}
                  {...(question.initialValue ? { initialValue: question.initialValue } : {})}
                  label={question.text}
                  {...additionalProps}
                />
              );
            })} */}

            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Button variant="outlined" color="error" onClick={handleCancel}>
                Cancel
              </Button>
              <Tooltip
                title={
                  <>
                    {/* {!isEmpty(errors) && (
                      <Stack>
                        <Typography variant="caption" color="info.main">
                          Please fix the errors in questions:
                        </Typography>
                        {Object.keys(errors)?.map((errorKeys, index) => {
                          const errQ = questions.find((x) => x._id.toString() === errorKeys);
                          return (
                            <Typography variant="caption" key={index} color="info">
                              {`${index + 1} ${errQ?.text}`}
                            </Typography>
                          );
                        })}
                      </Stack>
                    )} */}
                    {isEmpty(errors) && (
                      <Typography variant="caption">Please Fill the form</Typography>
                    )}
                    {isEmpty(errors) && <Typography variant="caption">Submit</Typography>}
                  </>
                }
                arrow
                followCursor
                sx={{
                  cursor: isEmpty(errors) && isValid ? 'pointer' : 'not-allowed',
                }}
              >
                <span>
                  <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                    Submit
                  </LoadingButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Grid>
        {mdUp && (
          <Grid item md={4}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Summary
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Number of questions: {questions.length}
            </Typography>
          </Grid>
        )}
      </Grid>
    </FormProvider>
  );
};

export default RHFFormFiller;
