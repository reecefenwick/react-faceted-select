import React from 'react';
import PropTypes from 'prop-types';
import {components} from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

/*
Constants for 'actions' associated with onChange in react-select
 */
const ReactSelectActions = {
    SELECT_OPTION: 'select-option',
    CREATE_OPTION: 'create-option',
    REMOVE_VAL: 'remove-value',
    POP_VALUE: 'pop-value'
};
const FILTER_SEPARATOR = ':';

class FacetedSelect extends React.Component {

    /*
    Only static for easy testing, fix?
     */
    static filterOption = (option, inputValue) => {
        if (!inputValue) return true;
        let searchTerm = inputValue.toLowerCase();
        if (searchTerm.includes(FILTER_SEPARATOR)) {
            searchTerm = searchTerm.split(FILTER_SEPARATOR)[1];
        }
        return option.label.toLowerCase().includes(searchTerm);
    };

    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired, // TODO RF - Not currently used (needed for dates tho)
            getSuggestions: PropTypes.func
        })).isRequired
    };

    state = {
        inputValue: '',
        selectedValues: []
    };

    buildOptions = () => {
        const {options} = this.props;
        const {inputValue} = this.state;
        if (inputValue.includes(FILTER_SEPARATOR)) {
            const key = inputValue.split(FILTER_SEPARATOR)[0];
            const option = options.find(o => {
                return o.label === key
            });
            // TODO RF - if no option is matched what do?
            const suggestions = option.getSuggestions ? option.getSuggestions() : [];
            return suggestions
                .map(suggestedValue => {
                    return {
                        value: suggestedValue,
                        label: suggestedValue,
                        originalOption: option
                    }
                });

        } else {
            return options.map(o => {
                return {
                    value: o.label,
                    label: o.label,
                    getSuggestions: o.getSuggestions
                }
            })
        }
    };

    handleChange = (selectedValues, meta) => {
        const {inputValue} = this.state;
        const inputHasSeparator = inputValue && inputValue.includes(FILTER_SEPARATOR);
        // TODO RF - create-option with no input separator
        if (meta.action === ReactSelectActions.REMOVE_VAL || meta.action === ReactSelectActions.POP_VALUE) {
            this.setState({
                selectedValues: selectedValues
            });
        } else if ((meta.action === ReactSelectActions.SELECT_OPTION || meta.action === ReactSelectActions.CREATE_OPTION) && inputHasSeparator) {
            // selected a suggested value
            const newSelectedValue = selectedValues[selectedValues.length - 1];
            if (meta.action === ReactSelectActions.CREATE_OPTION) {
                // No originalOption available - don't modify newSelectedValue
            } else {
                newSelectedValue.label = `${newSelectedValue.originalOption.label}${FILTER_SEPARATOR}${newSelectedValue.label}`;
                newSelectedValue.value = `${newSelectedValue.originalOption.selectedValues}${FILTER_SEPARATOR}${newSelectedValue.selectedValues}`;
            }
            // TODO RF - Call parent component (prop method)
            this.setState({
                selectedValues: selectedValues
            });
        } else if (meta.action === ReactSelectActions.SELECT_OPTION && !inputHasSeparator) {
            // selected a suggested key
            const selectedOption = selectedValues[selectedValues.length - 1];
            this.setState({inputValue: `${selectedOption.label}:`})
        } else {
            throw new Error(`Unexpected state for input ${inputValue} and meta ${JSON.stringify(meta)}`);
        }
    };

    handleInputChange = (inputValue) => {
        this.setState({inputValue});
    };

    /*
     * See https://react-select.com/props#replacing-components
     */
    renderCustomInput = (props) => {
        // if type 'date' render date-picker
        return (
            <div>
                <components.Input {...props} />
            </div>
        )
    };

    render() {
        const options = this.buildOptions();

        const {inputValue, selectedValues} = this.state;

        return (
            <CreatableSelect
                isMulti
                components={{
                    Input: this.renderCustomInput
                }}
                placeholder="Search..."
                isClearable={false}
                closeMenuOnSelect={false}
                filterOption={FacetedSelect.filterOption}
                onChange={this.handleChange}
                options={options}
                onInputChange={this.handleInputChange}
                inputValue={inputValue}
                value={selectedValues}
                formatCreateLabel={(inputValue) => inputValue}
            />
        )
    }
}

export default FacetedSelect;