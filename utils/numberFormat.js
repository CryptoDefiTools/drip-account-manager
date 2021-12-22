const numberFormat = (number, decimals) => {
    return parseFloat(number).toLocaleString('en-US', {
        maximumFractionDigits: decimals,
    });
};

export default numberFormat;
