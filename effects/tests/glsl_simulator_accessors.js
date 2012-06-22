Object.defineProperty(Array.prototype, 'x', {
    get: function () {
        return this[0];
    }
});

Object.defineProperty(Array.prototype, 'y', {
    get: function () {
        return this[1];
    }
});

Object.defineProperty(Array.prototype, 'z', {
    get: function () {
        return this[2];
    }
});

Object.defineProperty(Array.prototype, 'w', {
    get: function () {
        return this[1];
    }
});

Object.defineProperty(Array.prototype, 'r', {
    get: function () {
        return this[0];
    }
});

Object.defineProperty(Array.prototype, 'g', {
    get: function () {
        return this[1];
    }
});

Object.defineProperty(Array.prototype, 'b', {
    get: function () {
        return this[2];
    }
});

Object.defineProperty(Array.prototype, 'a', {
    get: function () {
        return this[3];
    }
});

Object.defineProperty(Array.prototype, 'rg', {
    get: function () {
        return this.slice(0, 2);
    }
});

Object.defineProperty(Array.prototype, 'xy', {
    get: function () {
        return this.slice(0, 2);
    }
});

Object.defineProperty(Array.prototype, 'ba', {
    get: function () {
        return this.slice(2, 4);
    }
});

Object.defineProperty(Array.prototype, 'zw', {
    get: function () {
        return this.slice(2, 4);
    }
});

Object.defineProperty(Array.prototype, 'rgb', {
    get: function () {
        return this.slice(0, 3);
    }
});

Object.defineProperty(Array.prototype, 'xyz', {
    get: function () {
        return this.slice(0, 3);
    }
});

Object.defineProperty(Array.prototype, 'gba', {
    get: function () {
        return this.slice(1, 4);
    }
});

Object.defineProperty(Array.prototype, 'yzw', {
    get: function () {
        return this.slice(1, 4);
    }
});

Object.defineProperty(Array.prototype, 'gb', {
    get: function () {
        return this.slice(1, 3);
    }
});

Object.defineProperty(Array.prototype, 'yz', {
    get: function () {
        return this.slice(1, 3);
    }
});