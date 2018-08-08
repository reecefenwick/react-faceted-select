'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FacetedSelect = require('../components/FacetedSelect');

var _FacetedSelect2 = _interopRequireDefault(_FacetedSelect);

var _enzyme = require('enzyme');

var _OptionTypes = require('../model/OptionTypes');

var _OptionTypes2 = _interopRequireDefault(_OptionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getFirstNameSuggestions = function getFirstNameSuggestions() {
    return ['John', 'Jane', 'Joe'];
};

var getLastNameSuggestions = function getLastNameSuggestions() {
    return ['Doe', 'Bloggs'];
};

var options = [{
    label: "First Name",
    type: _OptionTypes2.default.TextOption,
    getSuggestions: getFirstNameSuggestions
}, {
    label: "Last Name",
    type: _OptionTypes2.default.TextOption,
    getSuggestions: getLastNameSuggestions
}, {
    label: "Description",
    type: _OptionTypes2.default.Text
}];

describe('FacetedSelect', function () {
    it('should suggest options for keys', function () {
        var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(_FacetedSelect2.default, {
            options: options
        }));
        expect(wrapper).toMatchSnapshot();
    });

    it('should suggest values for selected key', function () {
        var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(_FacetedSelect2.default, {
            options: options
        }));
        wrapper.instance().handleInputChange('First Name:');
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });

    // When key input that matches no options e.g. 'Unknown:'

    // Should call this.props.onSelectOption when adding item and input is complete
});

describe('FacetedSelect #handleChange', function () {
    var wrapper = void 0;
    beforeEach(function () {
        wrapper = (0, _enzyme.shallow)(_react2.default.createElement(_FacetedSelect2.default, {
            options: options
        }));
    });

    it('should override selectedValues on remove-value', function () {
        var stubSelectedValues = [123];
        wrapper.instance().handleChange(stubSelectedValues, { action: 'remove-value' });
        wrapper.state().selectedValues = stubSelectedValues;
    });

    it('should override selectedValues on pop-value', function () {
        var stubSelectedValues = [123];
        wrapper.instance().handleChange(stubSelectedValues, { action: 'pop-value' });
        wrapper.state().selectedValues = stubSelectedValues;
    });

    it('should add separator to inputValue when selecting key to search on', function () {
        var stubSelectedValues = [{ label: 'First Name' }];
        wrapper.setState({ inputValue: 'First Name' });
        wrapper.update();
        wrapper.instance().handleChange(stubSelectedValues, { action: 'select-option' });
        expect(wrapper.state().inputValue).toEqual('First Name:');
    });

    it('should not modify selectedValues when entering value not suggested', function () {
        var stubSelectedValues = [{ label: 'First Name' }];
        wrapper.setState({ inputValue: 'First Name:Jane' });
        wrapper.update();
        wrapper.instance().handleChange(stubSelectedValues, { action: 'create-option' });
        wrapper.update();
        var state = wrapper.state();
        expect(state.inputValue).toEqual('First Name:Jane');
        expect(state.selectedValues).toEqual(stubSelectedValues);
    });

    it('should modify last entry in selectedValues with labels from original option', function () {
        var stubSelectedValues = [{
            foo: 'I should be ignored'
        }, {
            label: 'Jane',
            originalOption: {
                label: 'First Name',
                type: _OptionTypes2.default.TextOption,
                getSuggestions: null
            }
        }];
        wrapper.setState({ inputValue: 'First Name:Jane' });
        wrapper.instance().handleChange(stubSelectedValues, { action: 'select-option' });

        var state = wrapper.state();
        expect(state.inputValue).toEqual('First Name:Jane');
        expect(state.selectedValues[1]).toEqual(stubSelectedValues[1]);
    });
});

describe('FacetedSelect #filterOption', function () {
    it('should return true for falsy selectedValues', function () {
        expect(_FacetedSelect2.default.filterOption({}, false)).toEqual(true);
        expect(_FacetedSelect2.default.filterOption({}, undefined)).toEqual(true);
        expect(_FacetedSelect2.default.filterOption({}, null)).toEqual(true);
        expect(_FacetedSelect2.default.filterOption({}, '')).toEqual(true);
    });

    it('should match case insensitive', function () {
        var option = { label: 'FirSt nAmE' };
        expect(_FacetedSelect2.default.filterOption(option, 'first name')).toEqual(true);
    });

    it('should match case insensitive using token AFTER separator', function () {
        var option = { label: 'John' };
        expect(_FacetedSelect2.default.filterOption(option, 'First name:John')).toEqual(true);
    });
});