import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  const toReturn = numeral(number);
  if (toReturn === 'NaN') {
    return numeral(0).format('$0.00');
  }
  if (toReturn % 1 !== 0) {
    return toReturn.format('$0,0.00');
  }
  return toReturn.format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fCurrencyLonger(number) {
  const toReturn = numeral(number);
  if (toReturn === 'NaN') {
    return numeral(0).format(Number.isInteger(0) ? '$0,0' : '$0,0.00000000');
  }
  return toReturn.format(Number.isInteger(number) ? '$0,0' : '$0,0.00000000');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  const toReturn = numeral(number).format();
  if (toReturn === 'NaN') {
    return numeral(0).format();
  }
  return toReturn;
}

export function fNumberWithDecimals(number) {
  return numeral(number).format('0.0000');
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
