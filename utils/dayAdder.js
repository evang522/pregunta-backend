'use strict';
module.exports = (issuedAt, daysToAdd) => {
  if (typeof(daysToAdd) !== 'number') {
    const err = new Error();
    err.message = 'daysToAdd parameter must be a number';
    return err;
  }

  let start = new Date(issuedAt);
  start.setDate(start.getDate() + daysToAdd);
  return new Date(start).getTime();
};