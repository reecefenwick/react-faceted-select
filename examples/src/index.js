import React from 'react';

import { render} from 'react-dom';
import { FacetedSelect } from '../../src';
import { OptionTypes } from '../../src/model/OptionTypes';

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

const App = () => (
    <FacetedSelect
        placeholder="Search..."
        options={[
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
        ]}
      />
);

render(<App />, document.getElementById("root"));