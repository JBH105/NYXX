'use server';
import * as z from 'zod';

const bcrypt = require('bcrypt');
import { db } from '../lib/db';
const nodemailer = require('nodemailer');

import { LoginSchema, RegisterSchema } from '../schemas/index';

export const getUserByEmail = async (email: string) => {
  try {
    console.log('email', email);

    const user = await db.user.findUnique({
      where: { email },
    });
    console.log('user...', user);
    return user;
  } catch(e) {
    console.log('error', e  )
    return e;
  }
};

function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Function to send verification code via email
async function sendVerificationEmail(email, code) {
  // Configure nodemailer with your email service
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'OpenTruth.Auth@gmail.com',
      pass: 'fmpa tdrw bqug bnbk',
    },
  });
  // Send email
  await transporter.sendMail({
    from: 'OpenTruth.Auth@gmail.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`,
  });
}
export const sendSignUpOTP=async(email: string) =>{
  try {
    const existingUser: any = await getUserByEmail(email);
    if (existingUser) {
      return {
        detail: 'Email already in use!',
      };
    } else {
      const verificationCode = generateVerificationCode();
      console.log('verificationCode', verificationCode);
      const verificationRecord = await db.verifyOTP.create({
        data: {
          email,
          code: verificationCode,
          expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        },
      });

      // Convert verificationRecord to a plain object
      const verificationRecordPlain = {
        id: verificationRecord.id,
        email: verificationRecord.email,
        code: verificationRecord.code,
        expiresAt: verificationRecord.expiresAt,
        // Add any other properties you need
      };
      console.log('verificationRecord', verificationRecordPlain);

      // Send verification code via email
      await sendVerificationEmail(email, verificationCode);
      return { status_code: 200, detail: 'Send OTP Successfully' };
    }
  } catch (error) {
    return { detail: error };
  }
}

export const verifyEmailOTP=async(payload: any) =>{
  try {
        // Find verification records by email and code
        const verificationRecords = await db.verifyOTP.findMany({
          where: {
              email:payload.email,
              code:payload.OTP,
              expiresAt: {
                  gte: new Date() // Verify within expiration time
              }
          }
      });

      if (verificationRecords && verificationRecords.length > 0) {
          const now = new Date();

          const validVerificationRecords = verificationRecords.filter(record => record.expiresAt >= now);

          if (validVerificationRecords.length === 0) {
            return { detail:"Verification code has expired."}
          }
          await db.verifyOTP.deleteMany({
            where: {
                email:payload.email,
                id: {
                    in: validVerificationRecords.map(record => record.id)
                }
            }
        });
        return { status_code: 200, detail: 'Send OTP Successfully' };
       
      }else {
        return {detail:'Invalid verification code'};
    }
  



  
  
  } catch (error) {
    return { detail: error };
  }
}
export const getUserById = async (
  id: string | undefined,
  includeOptions?: any,
) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: includeOptions,
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user by ID:', error);
    return null;
  }
};
 export const registerNewUser = async (
  values: z.infer<typeof RegisterSchema>,
) => {
 
  const validatedFields = RegisterSchema.safeParse(values);
 

  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields!',
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser: any = await getUserByEmail(email);
    if (existingUser) {
      return {
        error: 'Email already in use!',
      };
    } else {
     
      await db.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });
      return { success: 'User Registered Successfully!' };
    }
  }
};
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields!',
    };
  }
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email) {
    return { error: 'Email does not exist!' };
  }
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return { error: 'Invalid password!' };
  }
  return {
    data: { id: existingUser.id, email: existingUser.email,firstName:existingUser.firstName,lastName:existingUser.lastName },
    success: true,
  };
};
