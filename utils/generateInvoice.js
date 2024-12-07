const getRandomId = (min = 1000, max = 50000) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
};

const generateInvoice = () => {
  const date = new Date();
  const randomId = getRandomId(100, 900);
  const INV = "INV";
  const tgl = date.getUTCDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const result = `${INV}${tgl}${month}${year}-${randomId}`;
  return result;
};

module.exports = generateInvoice;
