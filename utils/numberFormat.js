export const formatNumber = (value) => {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("vi-VN").format(value);
};
