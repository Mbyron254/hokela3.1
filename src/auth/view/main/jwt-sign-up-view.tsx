/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import MuiPhoneNumber from 'mui-phone-number';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { GQLMutation } from 'src/lib/client';
import { USER_CREATE_SELF } from 'src/lib/mutations/user.mutation';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';



// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
  officialName: zod.string().min(1, { message: 'Official name is required!' }),
  phoneNumber: zod.string().min(1, { message: 'Phone number is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();
  const router = useRouter();
  
  const { action: signup, loading } = GQLMutation({
    mutation: USER_CREATE_SELF,
    resolver: 'userCreateSelf',
    toastmsg: true,
    callback: () => {
      router.push('/auth/main/sign-in');
    },
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [phoneValue, setPhoneValue] = useState('');

  const defaultValues = {
    officialName: '',
    phoneNumber: '',
    email: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const input = {
        email: data.email,
        name: data.officialName, // Changed from officialName to name
        phone: phoneValue, // Changed from phoneNumber to phone
      };

      await signup({ 
        variables: { input }
      });

    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const handlePhoneChange = (
    value: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (typeof value === 'string') {
      setPhoneValue(value);
      setValue('phoneNumber', value); // Update form value
    }
  };

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text 
        name="officialName"
        label="Official Name"
        InputLabelProps={{ shrink: true }}
      />
      
      <Field.Text 
        name="email"
        label="Email Address"
        InputLabelProps={{ shrink: true }}
      />

      <MuiPhoneNumber
        name="phoneNumber"
        label="Phone Number"
        defaultCountry="ke"
        variant="outlined"
        fullWidth
        onChange={handlePhoneChange}
        InputLabelProps={{ shrink: true }}
      />

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || loading}
        loadingIndicator="Creating account..."
      >
        Create Account
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Get Started Absolutely Free"
        description={
          <>
            {`Already have an account? `}
            <Link component={RouterLink} href={paths.auth.main.signIn} variant="subtitle2">
              Sign In
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 5 }}
      />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <SignUpTerms />
    </>
  );
}
