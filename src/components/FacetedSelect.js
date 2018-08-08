import React from 'react';
import PropTypes from 'prop-types';
import {components} from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

const FILTER_SEPARATOR = ':';

class FacetedSelect extends React.Component {

    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired, // TODO RF - May be redundant
            getSuggestions: PropTypes.func
        })).isRequired
    };

    state = {
        inputValue: '',
        value: []
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
        // TODO RF - handle meta-action "create-option"
        const inputHasSeparator = inputValue && inputValue.includes(FILTER_SEPARATOR);
        if (meta.action === 'remove-value' || meta.action === 'pop-value') {
            this.setState({
                value: selectedValues
            });
        } else if ((meta.action === 'select-option' || meta.action === 'create-option') && inputHasSeparator) {
            // selected a suggested value
            const newSelectedValue = selectedValues[selectedValues.length - 1];
            if (meta.action === 'create-option') {
                // No originalOption available
                newSelectedValue.label = `${newSelectedValue.label}`;
                newSelectedValue.value = `${newSelectedValue.value}`;
            } else {
                newSelectedValue.label = `${newSelectedValue.originalOption.label}: ${newSelectedValue.label}`;
                newSelectedValue.value = `${newSelectedValue.originalOption.value}: ${newSelectedValue.value}`;
            }
            // TODO RF - Call parent component (prop method)
            this.setState({
                value: selectedValues
            });
        } else if (meta.action === 'select-option' && !inputHasSeparator) {
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

    filterOption = (option, inputValue) => {
        if (!inputValue) return true;
        let searchTerm = inputValue.toLowerCase();
        if (searchTerm.includes(FILTER_SEPARATOR)) {
            searchTerm = searchTerm.split(FILTER_SEPARATOR)[1];
        }
        return option.label.toLowerCase().includes(searchTerm);
    };

    render() {
        const options = this.buildOptions();

        const {inputValue, value} = this.state;

        return (
            <CreatableSelect
                isMulti
                components={{
                    Input: this.renderCustomInput
                }}
                placeholder="Search..."
                isClearable={false}
                closeMenuOnSelect={false}
                filterOption={this.filterOption}
                onChange={this.handleChange}
                options={options}
                onInputChange={this.handleInputChange}
                inputValue={inputValue}
                value={value}
                formatCreateLabel={(inputValue) => inputValue}
            />
        )
    }
}

export default FacetedSelect;