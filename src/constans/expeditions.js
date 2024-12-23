// constants/expedition.js
export const expeditionOptions = {
  jne: {
    label: 'JNE',
    value: 'jne',
    code: 'jne',
  },
  pos: {
    label: 'POS Indonesia',
    value: 'pos',
    code: 'pos',
  },
  tiki: {
    label: 'TIKI',
    value: 'tiki',
    code: 'tiki',
  },
  jnt: {
    label: 'J&T Express',
    value: 'jnt',
    code: 'jnt',
  },
  sicepat: {
    label: 'SiCepat',
    value: 'sicepat',
    code: 'sicepat',
  },
};

export const getCourierLabel = (code) => {
  return expeditionOptions[code]?.label || code.toUpperCase();
};
