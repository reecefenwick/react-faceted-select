import React from 'react';
import { shallow } from 'enzyme';
import TypeaheadOption from '../TypeaheadOption';

describe('TypeaheadOption', () => {

    it('should render TypeaheadOption', () => {
        const onClickOption = jest.fn();
        const preventDefault = jest.fn();

        const component = shallow(
            <TypeaheadOption
                classes={{}}
                result={"result"}
                onClickOption={onClickOption}
            >
                John Doe
            </TypeaheadOption>
        );

        component
            .find('#typeahead-option')
            .simulate('click', { preventDefault });

        expect(onClickOption).toHaveBeenCalled();
        expect(onClickOption.mock.calls[0][0]).toEqual("result");
        expect(component).toMatchSnapshot();
    });

});