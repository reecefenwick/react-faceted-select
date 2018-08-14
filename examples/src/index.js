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

const onOptionsChanged = (selectedOptions) => {
    if (selectedOptions.length){
        console.group('onOptionsChanged - new option');
        console.log('option.label: %s', selectedOptions[selectedOptions.length - 1].label);
        console.log('option.value: %s', selectedOptions[selectedOptions.length - 1].value);
        console.groupEnd();
    }
};

const OptionGroups = {
    PERSON_ATTRS: 'Person Attributes',
    BIO_ATTRS: 'Bio Attributes'
};

const App = () => (
    <FacetedSelect
        initialValues={[{label: "First Name:Jane", value: "First Name:Jane"}]}
        onOptionsChanged={onOptionsChanged}
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