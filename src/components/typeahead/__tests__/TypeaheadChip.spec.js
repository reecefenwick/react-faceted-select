import React from 'react';
import { shallow } from 'enzyme';
import TypeaheadChip from '../TypeaheadChip';

describe('TypeaheadChip', () => {

    it('should call onRemove when delete button clicked', () => {
        const onRemove = jest.fn();
        const preventDefault = jest.fn();

        const component = shallow(
            <TypeaheadChip
                children={{
                    category: "Name",
                    operator: "contains",
                    value: "John"
                }}
                onRemove={onRemove}
            />
        );

        component
            .find('a.typeahead-chip-close')
            .simulate('click', { preventDefault });

        expect(onRemove).toHaveBeenCalled();
        expect(component).toMatchSnapshot();
    });
});