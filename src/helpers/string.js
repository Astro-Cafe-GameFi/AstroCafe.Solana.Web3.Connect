export const hexToByte = (hexString) => {
  var result = [];
  for (var i = 0, len = hexString.length; i < len; i+=2) {
    result.push(parseInt(hexString.substring(i,i+2),16));
  }
  return new Uint8Array(result);
}