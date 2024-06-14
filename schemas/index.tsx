import * as z from "zod";


export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(7, {
    message: "Minimum 7 characters required",
  }),
  firstName: z.string().min(1, {
    message: "First Name is Required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is Required",
  }),

});










