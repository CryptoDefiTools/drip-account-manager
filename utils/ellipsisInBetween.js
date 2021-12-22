const ellipsisInBetween = str => str.length > 35 ? `${str.substr(0, 4)}...${str.substr(str.length - 4, str.length)}` : str;

export default ellipsisInBetween;
