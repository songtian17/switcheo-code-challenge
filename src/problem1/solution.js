var sum_to_n_a = function (n) {
    sum = 0;
    for (let i = 0; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function (n) {
    if (n == 0) return 0;
    return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function (n) {
    return (n + 1) * n / 2;
};