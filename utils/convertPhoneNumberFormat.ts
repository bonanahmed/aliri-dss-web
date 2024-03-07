export const convertPhoneNumberFormat = (phone: string) => {
  return phone.replace(/^\+/, "");
};
