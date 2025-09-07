export const ValidateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  export const addThousandSeparator = (num) => {
    if (num === null || num === undefined) return "";
  
    const [integerPart, decimalPart] = num.toString().split(".");
  
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };
  