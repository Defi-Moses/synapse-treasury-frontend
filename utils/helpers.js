// helpers.js
export function formatToDollar(value) {
    return `$${Math.round(value).toLocaleString()}`;
  }


export default formatToDollar