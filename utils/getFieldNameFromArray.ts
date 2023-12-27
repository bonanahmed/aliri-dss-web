const getFieldNameFromArray = (data: any[]) => {
  if (data.length > 0) {
    const keys = Object.keys(data[0]).map((key) => {
      return {
        key,
        label: key,
      };
    });
    return keys;
  }
  return [{ key: "", label: "Data Kosong" }];
};

export default getFieldNameFromArray;
