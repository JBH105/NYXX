'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { FcGoogle } from 'react-icons/fc';
import Checkbox from 'components/checkbox';
import { Controller, useForm } from 'react-hook-form';
import { RegisterSchema } from '../../../../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { registerNewUser, sendSignUpOTP, verifyEmailOTP } from '../../../../../backendActions/userAuth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import OtpInput from 'components/auth/OtpInput';

function SignUpDefault() {
  const [inputValues, setInputValues] = useState({
    verifyCode1: '',
    verifyCode2: '',
    verifyCode3: '',
    verifyCode4: '',
  });
  const [step, setStep] = useState('1');
  const [loader,setLoader]=useState(false)
  const [signUpData, setSignUpData] = useState<any>();
  const isEmpty = Object.values(inputValues).some((value) => value === '');

    const onSubmitOtp = (e:any) => {
      e.preventDefault()


      const otp = Object.values(inputValues).join('');
    
      const payload={
        OTP:otp,
        email:signUpData.email
      }
      setLoader(true)
      verifyEmailOTP(payload).then((data)=>{
        if(data.status_code==200){

             registerNewUser(signUpData).then((data) => {
        console.log('data', data);
        if (data?.success) {
          setLoader(false)
          toast.success(data?.success);
          reset();
          route.push('/auth/sign-in/default');
        } else {
          setLoader(false)
          toast.error(data?.error);
        }
      });
        
        }else{
          setLoader(false)
          toast.error(data.detail)
        }
      })
  

   };
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });
  const [isPending, startTransition] = useTransition();

  // const fv = watch('firstName');
  // console.log('fv', fv);
  const route = useRouter();

  console.log('errors', errors);

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    console.log('values', values);
    setSignUpData(values)
    setLoader(true)
      sendSignUpOTP(values.email).then((data)=>{
        if(data.status_code==200){
          setLoader(false)
          toast.success(data.detail)
          setStep("2")
        }else{
          setLoader(false)
          toast.error(data.detail)
        }
      })
   
   
  };

  return (
    <Default
      maincard={
        <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-start lg:justify-start">
          {/* Sign up section */}
          <div className="mt-[10vh] w-full max-w-full flex-col md:pl-4 lg:pl-0 xl:max-w-[420px]">
            {step == '1' ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="text-4xl font-bold text-navy-700 dark:text-white">
                  Sign Up
                </h3>
                <p className="ml-1 mt-[10px] text-base text-gray-600">
                  Enter your email and password to sign up!
                </p>
                {/* user info */}
                <div className="mb-3 flex w-full items-center justify-center gap-4">
                  <div className="w-1/2">
                    <Controller
                      control={control}
                      name="firstName"
                      render={({ field }) => (
                        <InputField
                          variant="auth"
                          {...field}
                          extra="mb-3"
                          label="First Name*"
                          placeholder="John"
                          id="firstname"
                          type="text"
                        />
                      )}
                    />
                    {errors.firstName && (
                      <span className="text-base text-red-500">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>

                  <div className="w-1/2">
                    <Controller
                      control={control}
                      name="lastName"
                      render={({ field }) => (
                        <InputField
                          {...field}
                          variant="auth"
                          extra="mb-3"
                          label="Last Name*"
                          placeholder="Doe"
                          id="lastname"
                          type="text"
                        />
                      )}
                    />
                    {errors.lastName && (
                      <span className="text-base text-red-500">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>
                {/* Email */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <InputField
                      variant="auth"
                      extra="mb-3"
                      label="Email*"
                      {...field}
                      placeholder="customer@company.com"
                      id="email"
                      type="email"
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-base text-red-500">
                    {errors.email.message}
                  </span>
                )}

                {/* Password */}

                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <InputField
                      variant="auth"
                      extra="mb-3"
                      {...field}
                      label="Password*"
                      placeholder="Min 7 characters"
                      id="password"
                      type="password"
                    />
                  )}
                />
                {errors.password && (
                  <span className="text-base text-red-500">
                    {errors.password.message}
                  </span>
                )}

                <button
                  type="submit"
                  disabled={loader}
                  className="linear mt-4 w-full cursor-pointer rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                >
                  {loader ? 'Processing...' : 'Create my account'}
                </button>
              </form>
            ) : (
              <>
              <form onSubmit={onSubmitOtp}>
                <h3 className="text-4xl font-bold text-navy-700 dark:text-white">
                  Verify OTP
                </h3>

                <div className="ml-1 mt-[10px] text-base  text-gray-600">
                  Enter Your Email OTP
                </div>

                <OtpInput
                  inputValues={inputValues}
                  setInputValues={setInputValues}
                />

                <button
                  type="submit"
                  className="linear mt-4 w-full cursor-pointer rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                >
                  {loader ? 'Processing...' : 'Verify OTP'}
                </button>
                </form>
              </>
            )}

            {/* button */}

            <div className="mt-4 ">
              <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
                Already a member?
              </span>
              <a
                href="/auth/sign-in/default"
                className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SignUpDefault;
