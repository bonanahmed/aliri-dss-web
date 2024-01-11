export const convertStringToProperties = (inputString: string, parent: any) => {
  var propertyParts: any = inputString.split(".");
  var result: any = parent;
  for (var i = 0; i < propertyParts.length; i++) {
    var propertyPart = propertyParts[i];
    result = result[propertyPart];
  }
  return result;
};
