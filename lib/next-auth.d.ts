type credentialLogin = {
  email: string;
  password: string;
};

type userType = {
  role: string;
  id: string;
  collectionId?: string;
  isVerified: boolean;
};

interface collectionTypeU {
  title: string;
  id: string;
}

interface UserType {
  id: string; // Unique identifier for the user
  name: string; // Optional name of the user
  email: string; // Optional email of the user
  emailVerified?: Date | null; // Date when the email was verified
  isVerified: boolean; // Whether the user is verified
  isProvider: boolean; // Whether the user is a provider
  password?: string; // Optional password for the user
  verifyOtp?: string; // Optional OTP for verification
  verifyOtpExpiry?: number; // Optional OTP expiry time
  collections?: collectionTypeU;
  forgotOtp?: string; // Optional OTP for password reset
  forgotOtpExpiry?: number; // Optional OTP expiry time for password reset
  forgotVerify: boolean; // Whether the forgot password process is verified
  image?: string; // Optional profile image URL
  collectionId?: string | null; // Optional collection ID associated with the user
  role: "USER" | "ADMIN" | "OWNER"; // User role (enum)
  createdAt: Date; // Timestamp when the user was created
  updatedAt: Date; // Timestamp when the user was last updated
}
interface Session {
  role: string; // User role (e.g., "USER", "ADMIN", "OWNER")
  collectionId?: string; // Optional collection ID associated with the user
  user: {
    id: string; // Unique identifier for the user
    role: string; // User role
    collectionId?: string; // Optional collection ID
    isVerified: boolean; // Whether the user is verified
  };
}
