import { authenticator } from "otplib"
import QRCode from "qrcode"

export async function generateTOTPSecret(email: string): Promise<{ secret: string; qrCode: string }> {
  const secret = authenticator.generateSecret()
  const serviceName = "HireNUp"
  const otpAuthUrl = authenticator.keyuri(email, serviceName, secret)
  
  const qrCode = await QRCode.toDataURL(otpAuthUrl)
  
  return { secret, qrCode }
}

export async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  try {
    return authenticator.verify({ token, secret })
  } catch (error) {
    return false
  }
}

export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  return codes
}

