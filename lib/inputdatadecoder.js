const fs = require('fs');
const Buffer = require('buffer/').Buffer;
const isBuffer = require('is-buffer');
const { ethers } = require('ethers');

/**
 * ==========
 * Util funcs
 * ==========
 */
function genMethodId(methodName, types) {
    var input = methodName + '(' + types.reduce(function(acc, x) {
        acc.push(handleInputs(x, x.type === 'tuple[]'));
        return acc;
    }, []).join(',') + ')';
    return ethers.utils.keccak256(Buffer.from(input)).slice(2, 10);
}

function handleInputs(input, tupleArray) {
    if (input instanceof Object && input.components) {
        input = input.components;
    }

    if (!Array.isArray(input)) {
        if (input instanceof Object && input.type) {
            return input.type;
        }
        return input;
    }

    var ret = '(' + input.reduce(function(acc, x) {
        if (x.type === 'tuple') {
            acc.push(handleInputs(x.components));
        } else if (x.type === 'tuple[]') {
            acc.push(handleInputs(x.components) + '[]');
        } else {
            acc.push(x.type);
        }
        return acc;
    }, []).join(',') + ')';

    if (tupleArray) {
        return ret + '[]';
    }

    return ret;
}

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

function deepRemoveUnwantedArrayProperties(arr) {
    return [].concat(_toConsumableArray(arr.map(function(item) {
        if (Array.isArray(item)) return deepRemoveUnwantedArrayProperties(item);
        return item;
    })));
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }

        return arr2;
    } else {
        return Array.from(arr);
    }
}

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * ==============
 * Util funcs End
 * ==============
 */

let InputDataDecoder = function() {

    function InputDataDecoder(prop) {
        _classCallCheck(this, InputDataDecoder);
        this.abi = [];
        if (typeof prop === 'string') {
            this.abi = JSON.parse(fs.readFileSync(prop));
        } else if (prop instanceof Object) {
            this.abi = prop;
        } else {
            throw new TypeError('Must pass ABI array object or file path to constructor');
        }
    }

    _createClass(InputDataDecoder, [{
            key: 'decodeConstructor',
            value: function decodeConstructor(data) {
                if (isBuffer(data)) {
                    data = data.toString('utf8');
                }
                if (typeof data !== 'string') {
                    data = '';
                }

                data = data.trim();
                for (var i = 0; i < this.abi.length; i++) {
                    var obj = this.abi[i];

                    if (obj.type !== 'constructor') {
                        continue;
                    }

                    var method = obj.name || null;

                    var types = obj.inputs ? obj.inputs.map(function(x) {
                        return x.type;
                    }) : [];

                    data = data.slice(-256);

                    if (data.length !== 256) {
                        throw new Error('fail');
                    }

                    if (data.indexOf('0x') !== 0) {
                        data = '0x' + data;
                    }

                    var inputs = ethers.utils.defaultAbiCoder.decode(types, data);

                    var names = obj.inputs ? obj.inputs.map(function(x) {
                        return x.name;
                    }) : [];

                    return {
                        method: method,
                        types: types,
                        inputs: inputs,
                        names: names
                    };
                }

                throw new Error('not found');
            }
        },
        {
            key: 'decodeData',
            value: function decodeData(data) {
                if (isBuffer(data)) {
                    data = data.toString('utf8');
                }
                if (typeof data !== 'string') {
                    data = '';
                }

                data = data.trim();
                var dataBuf = Buffer.from(data.replace(/^0x/, ''), 'hex');
                var methodId = toHexString(dataBuf.subarray(0, 4));
                var inputsBuf = dataBuf.subarray(4);

                var result = this.abi.reduce(function(acc, obj) {
                    if (obj.type === 'constructor') return acc;
                    if (obj.type === 'event') return acc;

                    var method = obj.name || null;

                    var types = obj.inputs ? obj.inputs.map(function(x) {
                        if (x.type.includes('tuple')) {
                            return x;
                        } else {
                            return x.type;
                        }
                    }) : [];

                    var names = obj.inputs ? obj.inputs.map(function(x) {
                        if (x.type.includes('tuple')) {
                            return [x.name, x.components.map(function(a) {
                                return a.name;
                            })];
                        } else {
                            return x.name;
                        }
                    }) : [];

                    var hash = genMethodId(method, types);

                    if (hash === methodId) {
                        var inputs = [];
                        try {
                            inputsBuf = normalizeAddresses(types, inputsBuf);
                            inputs = ethabi.rawDecode(types, inputsBuf);
                        } catch (err) {
                            inputs = ethers.utils.defaultAbiCoder.decode(types, inputsBuf);
                            inputs = deepRemoveUnwantedArrayProperties(inputs);
                        }

                        var typesToReturn = types.map(function(t) {
                            if (t.components) {
                                var arr = t.components.reduce(function(acc, cur) {
                                    return [].concat(_toConsumableArray(acc), [cur.type]);
                                }, []);
                                var tupleStr = '(' + arr.join(',') + ')';
                                if (t.type === 'tuple[]') return tupleStr + '[]';
                                return tupleStr;
                            }
                            return t;
                        });

                        return {
                            method: method,
                            types: typesToReturn,
                            inputs: inputs,
                            names: names
                        };
                    }
                    return acc;
                }, {
                    method: null,
                    types: [],
                    inputs: [],
                    names: []
                });

                if (!result.method) {
                    try {
                        var decoded = this.decodeConstructor(data);
                        if (decoded) {
                            return decoded;
                        }
                    } catch (err) {}
                }

                return result;
            }
        }
    ]);

    return InputDataDecoder;
}();

module.exports = InputDataDecoder;