import twilio from "twilio";

let twilioClient: twilio.Twilio | null = null;

export function getTwilio(): twilio.Twilio | null {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  if (!twilioClient) {
    twilioClient = twilio(sid, token);
  }
  return twilioClient;
}

export function isTwilioConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
}

export function getTwilioPhoneNumber(): string {
  return process.env.TWILIO_PHONE_NUMBER || "";
}
