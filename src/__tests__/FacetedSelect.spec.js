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
    it ('should export FacetedSelect', () => {
        const component = shallow(<FacetedSelect
            options={options}
        />);
        expect(component).toMatchSnapshot();
    })
});