import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { FacetedSelect } from '../../src';
import OptionTypes from '../../src/model/OptionTypes';

const getFirstNameSuggestions = () => {
    return [
        'Jane',
        'John',
        'Joe'
    ]
};

const getLastNameSuggestions = () => {
    return [
        'Doe',
        'Bloggs'
    ]
};

const onOptionSelected = (option) => {
    console.group('onOptionSelected');
    console.log('option.label: %s', option.label);
    console.log('option.value: %s', option.value);
    console.groupEnd();
};

const OptionGroups = {
    PERSON_ATTRS: 'Person Attributes',
    BIO_ATTRS: 'Bio Attributes'
};

const App = () => (
    <FacetedSelect
        onOptionSelected={onOptionSelected}
        options={[
            {
                group: OptionGroups.PERSON_ATTRS,
                label:"First Name",
                type: OptionTypes.TextOption, 
                getSuggestions: getFirstNameSuggestions
            },
            {
                group: OptionGroups.PERSON_ATTRS,
                label:"Last Name",
                type: OptionTypes.TextOption,
                getSuggestions: getLastNameSuggestions
            },
            {
                group: OptionGroups.BIO_ATTRS,
                label:"Description",
                type: OptionTypes.Text
            }
        ]}
      />
);

render(<App />, document.getElementById("root"));