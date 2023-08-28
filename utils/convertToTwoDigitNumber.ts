const convertToTwoDigitNumber = (numberDigit: number) => {
  return numberDigit.toString().padStart(2, "0");
};

export default convertToTwoDigitNumber;
