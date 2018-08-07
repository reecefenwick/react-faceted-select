import React from 'react';
import { shallow } from 'enzyme';
import Typeahead from '../Typeahead';

describe('Typeahead', () => {

    it('should render Typeahead', () => {
        const onOptionSelected = jest.fn();
        const onKeyDown = jest.fn();

        const component = shallow(
            <Typeahead
                datatype={"text"}
                onKeyDown={onKeyDown}
                onOptionSelected={onOptionSelected}
                placeholder={"Search..."}
            />
        );

        expect(component).toMatchSnapshot();
    });
});