import React from 'react';

import { render} from 'react-dom';
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

const App = () => (
    <FacetedSelect
        onOptionSelected={onOptionSelected}
        options={[
            { 
                label:"First Name",
                type: OptionTypes.TextOption, 
                getSuggestions: getFirstNameSuggestions
            },
            {
                label:"Last Name",
                type: OptionTypes.TextOption,
                getSuggestions: getLastNameSuggestions
            },
            {
                label:"Description",
                type: OptionTypes.Text
            }
        ]}
      />
);

render(<App />, document.getElementById("root"));