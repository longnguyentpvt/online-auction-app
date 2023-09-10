const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const validateEmail = (str : string) : boolean => {
  if (!!str) {
    return EMAIL_REGEX.test(str);
  }
  return false;
};
