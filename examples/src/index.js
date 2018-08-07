import React from 'react';

import { render} from 'react-dom';
import { FacetedInput } from '../../src';

const App = () => (
    <FacetedInput
        placeholder="Search..."
        options={[
            {category:"Name",type:"text"},
            {category:"Price",type:"number"},
        ]}
      />
);

render(<App />, document.getElementById("root"));