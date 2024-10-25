export const getExtensionName = (name: string) => {
  const splitName = name.split(".");
  return splitName[splitName.length - 1];
};
export const getColorByExt = (ext: string) => {
  if (ext.toLowerCase().includes("doc")) {
    return "#174DA4";
  } else if (ext.toLowerCase() === "pdf") {
    return "#E52F31";
  } else if (ext.toLowerCase().includes("xls")) {
    return "#2B774C";
  } else if (ext.toLowerCase().includes("ppt")) {
    return "#E23B13";
  } else {
    return "#09121F";
  }
};
