'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { FcGoogle } from 'react-icons/fc';
import Checkbox from 'components/checkbox';
import { toast } from 'react-toastify';
import { LoginSchema } from '../../../../../schemas';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { login } from '../../../../../backendActions/userAuth';
import { useDispatch } from 'react-redux';

import { loginAction } from 'store/user/userSlice';


function SignInDefault() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [isPending, startTransition] = useTransition();

  const route = useRouter();
  const dispatch:any=useDispatch()

  console.log('errors', errors);

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log('values', values);
    startTransition(() => {
      login(values).then((data) => {
        console.log("data",data)
        if(data.success){
          dispatch(loginAction(data.data,()=>{
            route.push("/user/my-documents")
            toast.success("login Successfully")
          }))
        }else{
          toast.error(data?.error)
        }
      });
    });
  };
  return (
    <Default
      maincard={
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          {/* Sign in section */}
          <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Sign In
            </h3>
            <p className="mb-5 ml-1 text-base text-gray-600">
              Enter your email and password to sign in!
            </p>
            <div className="mb-6 flex items-center  gap-3">
          
            </div>
            <form  onSubmit={handleSubmit(onSubmit)} >
            {/* Email */}

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <InputField
                  {...field}
                  variant="auth"
                  extra="mb-3"
                  label="Email*"
                  placeholder="customer@company.com"
                  id="email"
                  type="text"
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
                  {...field}
                  variant="auth"
                  extra="mb-3"
                  label="Password*"
                  placeholder="password"
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
            {/* Checkbox */}
            {/* <div className="mb-4 flex items-center justify-between px-2">
              <div className="mt-2 flex items-center">
                <Checkbox />
                <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                  Keep me logged In
                </p>
              </div>
              <a
                className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                href=" "
              >
                Forgot Password?
              </a>
            </div> */}
            <button
              type="submit"
              disabled={isPending}
              className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              {isPending ? 'Processing...' : 'Sign In'}
            </button>
            </form>
            <div className="mt-4">
              <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
                Not registered yet?
              </span>
              <a
                href="/auth/sign-up/default"
                className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SignInDefault;
