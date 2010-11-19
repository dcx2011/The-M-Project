// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      11.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('core/foundation/object.js');

/**
 * @class
 *
 * Object for decoding and encoding with Base64.
 *
 */
M.Base64 = M.Object.extend({

    /**
     * The type of this object.
     *
     * @property {String}
     */
    type: 'M.Base64',

    /**
     * The key string for the base 64 decoding and encoding.
     *
     * @property {String}
     */
    keyString: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",    

    /**
     * This method encodes a given input string, using the base64 encoding.
     *
     * @param {String} input The string to be encoded.
     */
    encode: function(input) {
        var output = '';
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = M.Cypher.utf8_encode(input);

        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if(isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if(isNaN(chr3)) {
                enc4 = 64;
            }

            output += this.keyString.charAt(enc1) + this.keyString.charAt(enc2) + this.keyString.charAt(enc3) + this.keyString.charAt(enc4);
        }

        return output;
    },

    /**
     * This method decodes a given input string, using the base64 decoding.
     *
     * @param {String} input The string to be decoded.
     */
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {
            enc1 = this.keyString.indexOf(input.charAt(i++));
            enc2 = this.keyString.indexOf(input.charAt(i++));
            enc3 = this.keyString.indexOf(input.charAt(i++));
            enc4 = this.keyString.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if(enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            
            if(enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        return M.Cypher.utf8_decode(output);
    }

});