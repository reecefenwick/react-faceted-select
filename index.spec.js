'use strict';

var _index = require('./index');

describe('index.js', function () {
    it('should export FacetedSelect', function () {
        expect(_index.FacetedSelect).not.toBeNull();
    });

    it('should export OptionTypes', function () {
        expect(_index.OptionTypes).not.toBeNull();
    });
});