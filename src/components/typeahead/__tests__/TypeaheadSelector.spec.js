import React from 'react';
import { shallow } from 'enzyme';
import TypeaheadSelector from '../TypeaheadSelector';

describe('TypeaheadSelector', () => {

    it('should render TypeaheadSelector', () => {
        const options = ['Jane Doe', 'John Doe'];

        const onOptionSelected = jest.fn();

        const component = shallow(
            <TypeaheadSelector
                options={options}
                classes={{}}
                result={"result"}
                onOptionSelected={onOptionSelected}
            >
                John Doe
            </TypeaheadSelector>
        );

        component.instance().onClickOption();

        expect(onOptionSelected).toHaveBeenCalled();
        expect(component).toMatchSnapshot();
    });

});