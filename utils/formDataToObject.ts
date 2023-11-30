const formDataToObject = (formData: FormData) => {
  let formDataObject: any = {};
  formData.forEach((value, key) => {
    if (key.includes(".")) {
      let dataMap: any = {};
      let temp = dataMap;
      const keys = key.split(".");
      keys.forEach((keySplit: string, indexKeySplit) => {
        if (indexKeySplit === keys.length - 1) {
          temp[keySplit] = value;
        } else {
          temp[keySplit] = {};
          temp = temp[keySplit];
        }
      });
      formDataObject = {
        ...formDataObject,
        ...dataMap,
      };
    } else {
      if (value) formDataObject[key] = value;
    }
  });
  return formDataObject;
};

export default formDataToObject;
