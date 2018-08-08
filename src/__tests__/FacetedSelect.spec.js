import React from 'react';
import FacetedSelect from '../components/FacetedSelect';
import { shallow } from "enzyme";
import OptionTypes from "../model/OptionTypes";

const getCaptureProcessNameSuggestions = () => {
    return [
        'GI-PI-Claims',
        'Life-Claims-RetailClaims'
    ]
};

const getFlowSuggestions = () => {
    return [
        'Life-Claims-V10',
        'BounceBack-Emails-v1'
    ]
};

const options = [
    {
        label:"Capture Process Name",
        type: OptionTypes.TextOption,
        getSuggestions: getCaptureProcessNameSuggestions
    },
    {
        label:"Flow",
        type: OptionTypes.TextOption,
        getSuggestions: getFlowSuggestions
    },
    {
        label:"Capture Correlation ID",
        type: OptionTypes.Text
    }
];

describe('FacetedSelect.js', () => {
    it('should suggest options for keys', () => {
        const wrapper = shallow(<FacetedSelect
            options={options}
        />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should suggest values for selected key', () => {
        const wrapper = shallow(<FacetedSelect
            options={options}
        />);
        wrapper.instance().handleInputChange('Capture Process Name:');
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });

    // When key input that matches no options e.g. 'Unknown:'

    // Should call this.props.onSelectOption when adding item and input is complete


});

describe('FacetedSelect #filterOption', () => {
    it('should return true for falsy value', () => {
        expect(FacetedSelect.filterOption({}, false)).toEqual(true);
        expect(FacetedSelect.filterOption({}, undefined)).toEqual(true);
        expect(FacetedSelect.filterOption({}, null)).toEqual(true);
        expect(FacetedSelect.filterOption({}, '')).toEqual(true);
    });

    it('should match case insensitive', () => {
        const option = { label: 'FirSt nAmE' };
        expect(FacetedSelect.filterOption(option, 'first name'))
            .toEqual(true);
    });

    it('should match using token AFTER separator', () => {
        const option = { label: 'John' };
        expect(FacetedSelect.filterOption(option, 'First name:John'))
            .toEqual(true);
    });
});