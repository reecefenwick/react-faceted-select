import React from 'react';
import FacetedSelect from '../components/FacetedSelect';
import { shallow } from "enzyme";
import OptionTypes from "../model/OptionTypes";

const mockCreatableSelectRefMock = () => {
    return {
        blur: jest.fn(),
        focus: jest.fn()
    }
};

const getFirstNameSuggestions = () => {
    return [
        'John',
        'Jane',
        'Joe'
    ]
};

const getLastNameSuggestions = () => {
    return [
        'Doe',
        'Bloggs'
    ]
};

const options = [
    {
        label: "First Name",
        type: OptionTypes.TextOption,
        getSuggestions: getFirstNameSuggestions
    },
    {
        label: "Last Name",
        type: OptionTypes.TextOption,
        getSuggestions: getLastNameSuggestions
    },
    {
        label: "Description",
        type: OptionTypes.Text
    }
];

const initialValues = [
    {
        label: "First Name",
        value: "Strangelove"
    }
];

describe('FacetedSelect', () => {
    it('should suggest options for keys', () => {
        const wrapper = shallow(<FacetedSelect
            options={options}
            onOptionsChanged={() => {}}
            initialValues={initialValues}
        />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should display empty select when no initial values', () => {
        const wrapper = shallow(<FacetedSelect
            options={options}
            onOptionsChanged={() => {}}
        />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should suggest values for selected key', () => {
        const wrapper = shallow(<FacetedSelect
            options={options}
            onOptionsChanged={() => {}}
            initialValues={initialValues}
        />);
        wrapper.instance().handleInputChange('First Name:');
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render label with bold key', () => {
        const wrapper = shallow(<FacetedSelect
            options={options}
            onOptionsChanged={() => {}}
        />);
        const multiValueLabel = shallow(
            wrapper.instance().renderCustomLabel({ children: 'First Name: Jane'}));
        expect(multiValueLabel).toMatchSnapshot();
    });

    // TODO RF - When key input that matches no options e.g. 'Search:the entered value'

});

describe('FacetedSelect #handleChange', () => {
    let wrapper;
    let onOptionsChangedMock;
    let creatableSelectRefMock;

    beforeEach(() => {
        onOptionsChangedMock = jest.fn();
        creatableSelectRefMock = mockCreatableSelectRefMock();
        wrapper = shallow(<FacetedSelect
            options={options}
            onOptionsChanged={onOptionsChangedMock}
        />);
        wrapper.instance().bindCreatableSelectRef(creatableSelectRefMock);
        wrapper = wrapper.update();
    });

    it('should override selectedValues on remove-value', () => {
        const stubSelectedValues = [{ label: 'Foo:Bar'}];
        wrapper.instance().handleChange(stubSelectedValues, {action: 'remove-value'});
        wrapper.state().selectedValues = stubSelectedValues;
        expect(onOptionsChangedMock).toHaveBeenCalled();
    });

    it('should override selectedValues on pop-value', () => {
        const stubSelectedValues = [{ label: 'Foo:Bar'}];
        wrapper.instance().handleChange(stubSelectedValues, {action: 'pop-value'});
        wrapper.state().selectedValues = stubSelectedValues;
        expect(onOptionsChangedMock).toHaveBeenCalled();
    });

    it('should add separator to inputValue when selecting key to search on', () => {
        const stubSelectedValues = [{label: 'First Name'}];
        wrapper.setState({inputValue: 'First Name'});
        wrapper.update();
        wrapper.instance().handleChange(stubSelectedValues, {action: 'select-option'});
        expect(wrapper.state().inputValue).toEqual('First Name:');
        expect(onOptionsChangedMock).toHaveBeenCalledTimes(0);
    });

    it('should not modify selectedValues when entering value not suggested', () => {
        const stubSelectedValues = [{ label: 'First Name:Jane' }];
        wrapper.setState({inputValue: 'First Name:Jane'});
        wrapper.update();
        wrapper.instance().handleChange(stubSelectedValues, {action: 'create-option'});
        wrapper.update();
        const state = wrapper.state();
        expect(state.inputValue).toEqual('First Name:Jane');
        expect(state.selectedValues).toEqual(stubSelectedValues);
        expect(onOptionsChangedMock).toHaveBeenCalled();
        expect(creatableSelectRefMock.blur).toHaveBeenCalled();
        expect(creatableSelectRefMock.focus).toHaveBeenCalled();
    });

    it('should modify last entry in selectedValues with labels from original option', () => {
        const stubSelectedValues = [
            {
                label: 'I should be ignored',
            },
            {
                label: 'Jane',
                originalOption: {
                    label: 'First Name',
                    type: OptionTypes.TextOption,
                    getSuggestions: null
                }
            }
        ];
        wrapper.setState({inputValue: 'First Name:Jane'});
        wrapper.instance().handleChange(stubSelectedValues, {action: 'select-option'});

        expect(creatableSelectRefMock.blur).toHaveBeenCalled();
        expect(creatableSelectRefMock.focus).toHaveBeenCalled();

        const state = wrapper.state();
        expect(state.inputValue).toEqual('First Name:Jane');
        expect(state.selectedValues[1]).toEqual(stubSelectedValues[1]);

        expect(onOptionsChangedMock).toHaveBeenCalled();
        const onSelectOptionCall = onOptionsChangedMock.mock.calls[0][0];
        expect(onSelectOptionCall.length).toEqual(2);
        expect(onSelectOptionCall[1].label).toEqual('First Name');
        expect(onSelectOptionCall[1].value).toEqual('Jane');
    });
});

describe('FacetedSelect #filterOption', () => {
    it('should return true for falsy selectedValues', () => {
        expect(FacetedSelect.filterOption({}, false)).toEqual(true);
        expect(FacetedSelect.filterOption({}, undefined)).toEqual(true);
        expect(FacetedSelect.filterOption({}, null)).toEqual(true);
        expect(FacetedSelect.filterOption({}, '')).toEqual(true);
    });

    it('should match case insensitive', () => {
        const option = {label: 'FirSt nAmE'};
        expect(FacetedSelect.filterOption(option, 'first name'))
            .toEqual(true);
    });

    it('should match case insensitive using token AFTER separator', () => {
        const option = {label: 'John'};
        expect(FacetedSelect.filterOption(option, 'First name:John'))
            .toEqual(true);
    });
});