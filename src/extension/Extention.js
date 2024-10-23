const VND2Word = (amount) => {
    const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];

    function convertGroup(number) {
        let result = '';
        const hundred = Math.floor(number / 100);
        const ten = Math.floor((number % 100) / 10);
        const one = number % 10;

        if (hundred > 0) {
            result += ones[hundred] + ' trăm';
            if (ten > 0 || one > 0) {
                result += ' lẻ';
            }
        }

        if (ten > 1) {
            result += ' ' + tens[ten];
            if (one > 0) {
                result += ' ' + ones[one];
            }
        } else if (ten === 1) {
            result += ' mười';
            if (one > 0) {
                result += ' ' + ones[one];
            }
        } else if (one > 0) {
            result += ' ' + ones[one];
        }

        return result.trim();
    }

    if (amount === 0) {
        return 'Không đồng';
    }

    const billion = Math.floor(amount / 1000000000);
    const million = Math.floor((amount % 1000000000) / 1000000);
    const thousand = Math.floor((amount % 1000000) / 1000);
    const dong = amount % 1000;

    let result = '';

    if (billion > 0) {
        result += convertGroup(billion) + ' tỷ';
    }

    if (million > 0) {
        result += ' ' + convertGroup(million) + ' triệu';
    }

    if (thousand > 0) {
        result += ' ' + convertGroup(thousand) + ' nghìn';
    }

    if (dong > 0) {
        result += ' ' + convertGroup(dong);
    }

    result = result.trim();
    return result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
};

const VND2USD = (amount, exchangeRate) => {
    return amount / exchangeRate;
};

const USD2Word = (amount) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    function convertLessThanOneThousand(number) {
        let current;

        if (number % 100 < 20) {
            current = number % 100 < 10 ? ones[number % 100] : teens[(number % 100) - 10];
            number = Math.floor(number / 100);
        } else {
            current = ones[number % 10];
            number = Math.floor(number / 10);

            current = tens[number % 10] + (current ? '-' + current : '');
            number = Math.floor(number / 10);
        }
        if (number === 0) return current;
        return ones[number] + ' hundred' + (current ? ' ' + current : '');
    }

    function convert(number) {
        if (number === 0) return 'zero';
        if (number < 0) return 'minus ' + convert(-number);

        let result = '';
        let billions = Math.floor(number / 1000000000);
        let millions = Math.floor((number - billions * 1000000000) / 1000000);
        let thousands = Math.floor((number - billions * 1000000000 - millions * 1000000) / 1000);
        let remainder = number % 1000;

        if (billions > 0) {
            result += convertLessThanOneThousand(billions) + ' billion ';
        }
        if (millions > 0) {
            result += convertLessThanOneThousand(millions) + ' million ';
        }
        if (thousands > 0) {
            result += convertLessThanOneThousand(thousands) + ' thousand ';
        }
        if (remainder > 0) {
            result += convertLessThanOneThousand(remainder);
        }

        return result.trim();
    }

    let dollars = Math.floor(amount);
    let cents = Math.round((amount - dollars) * 100);

    let dollarsWord = convert(dollars);
    let centsWord = cents > 0 ? convert(cents) : '';

    return `${dollarsWord} dollar${dollars !== 1 ? 's' : ''}${centsWord ? ' and ' + centsWord + ' cent' + (cents !== 1 ? 's' : '') : ''}`;
};

export { VND2Word, VND2USD, USD2Word };
