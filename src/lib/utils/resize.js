/// Array of primes larger than: 2 ^ (4 x n)
var primes = [17, 67, 257, 1031, 4099, 16411, 65537, 262147, 1048583, 4194319, 16777259];

export default function resize(size) {
    for (var i = 0, len = primes.length; i < len; i++) {
        if (primes[i] > size) {
            return primes[i];
        }
    }

    return primes[primes.length - 1];
}
