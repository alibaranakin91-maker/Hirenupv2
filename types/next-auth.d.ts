import { AccountType } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      accountType?: AccountType
      twoFactorEnabled?: boolean
      kycStatus?: string
    }
  }

  interface User {
    accountType?: AccountType
    twoFactorEnabled?: boolean
    kycStatus?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accountType?: AccountType
    twoFactorEnabled?: boolean
    kycStatus?: string
  }
}

