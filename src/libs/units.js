
const BN = require("bn.js");

const Units = {
  wei: '1',
  kwei: '1000',
  ada: '1000',
  femtoether: '1000',
  mwei: '1000000',
  babbage: '1000000',
  picoether: '1000000',
  gwei: '1000000000',
  shannon: '1000000000',
  nanoether: '1000000000',
  nano: '1000000000',
  szabo: '1000000000000',
  microether: '1000000000000',
  micro: '1000000000000',
  finney: '1000000000000000',
  milliether: '1000000000000000',
  milli: '1000000000000000',
  ether: '1000000000000000000',
  kether: '1000000000000000000000',
  grand: '1000000000000000000000',
  einstein: '1000000000000000000000',
  mether: '1000000000000000000000000',
  gether: '1000000000000000000000000000',
  tether: '1000000000000000000000000000000'
};

function stripHexPrefix(value) {
  return value.replace('0x', '');
}

function stripHexPrefixAndLower(value) {
  return stripHexPrefix(value).toLowerCase();
}

const handleValues = (input) => {
  if (typeof input === 'string') {
    return input.startsWith('0x') ? new BN(stripHexPrefix(input), 16) : new BN(input);
  }
  if (typeof input === 'number') {
    return new BN(input);
  }
  if (BN.isBN(input)) {
    return input;
  } else {
    throw Error('unsupported value conversion');
  }
};

const gasPriceToBase = (price) => toWei(price.toString(), getDecimalFromEtherUnit('gwei'));

const getDecimalFromEtherUnit = (key) => Units[key].length - 1;


const stripRightZeros = (str) => {
  const strippedStr = str.replace(/0+$/, '');
  return strippedStr === '' ? null : strippedStr;
};

const baseToConvertedUnit = (value, decimal) => {
  if (decimal === 0) {
    return value;
  }
  const paddedValue = value.padStart(decimal + 1, '0'); //0.1 ==>
  const integerPart = paddedValue.slice(0, -decimal);
  const fractionPart = stripRightZeros(paddedValue.slice(-decimal));
  return fractionPart ? `${integerPart}.${fractionPart}` : `${integerPart}`;
};

const convertedToBaseUnit = (value, decimal) => {
  if (decimal === 0) {
    return value;
  }
  const [integerPart, fractionPart = ''] = value.split('.');
  const paddedFraction = fractionPart.padEnd(decimal, '0');
  return `${integerPart}${paddedFraction}`;
};

const Wei = input => handleValues(input);

const fromWei = (wei, unit) => {
  const decimal = getDecimalFromEtherUnit(unit);
  return baseToConvertedUnit(wei.toString(), decimal);
};

const toWei = (value, decimal) => {
  const wei = convertedToBaseUnit(value, decimal);
  return Wei(wei);
};

module.exports = {
  gasPriceToBase,
  fromWei,
  toWei
};