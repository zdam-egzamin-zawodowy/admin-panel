const formatNumber = (variant: 'commas', v: number | string): string => {
  if (typeof v === 'string') {
    v = parseFloat(v);
  }
  switch (variant) {
    case 'commas':
      return v.toLocaleString('en');
    default:
      return v + '';
  }
};

export default formatNumber;
