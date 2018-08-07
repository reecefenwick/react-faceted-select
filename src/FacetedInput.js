import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TypeaheadChip from './components/typeahead/TypeaheadChip';
import Typeahead from './components/typeahead/Typeahead';
import classNames from 'classnames';
import './FacetedInput.css';

class FacetedInput extends React.Component {

    static propTypes = {
        /**
         * An array of structures with the components `category` and `type`
         *
         * * _category_: Name of the first thing the user types.
         * * _type_: This can be one of the following:
         *   * _text_: Arbitrary text for the value. No autocomplete suggestions.
         *     Operator choices will be: `==`, `!=`, `contains`, `!contains`.
         *   * _textoptions_: You must additionally pass an suggestions value which
         *     will be a function that returns the list of suggestions choices as an
         *     array (for example `function getOptions() {return ["MSFT", "AAPL",
     *     "GOOG"]}`). Operator choices will be: `==`, `!=`.
         *   * _number_: Arbitrary text for the value. No autocomplete suggestions.
         *     Operator choices will be: `==`, `!=`, `<`, `<=`, `>`, `>=`.
         *   * _date_: Shows a calendar and the input must be of the form
         *     `MMM D, YYYY H:mm A`. Operator choices will be: `==`, `!=`, `<`, `<=`, `>`,
         *     `>=`.
         *
         * Example:
         *
         *     [
         *       {
     *         "category": "Symbol",
     *         "type": "textoptions",
     *         "suggestions": function() {return ["MSFT", "AAPL", "GOOG"]}
     *       },
         *       {
     *         "category": "Name",
     *         "type": "text"
     *       },
         *       {
     *         "category": "Price",
     *         "type": "number"
     *       },
         *       {
     *         "category": "MarketCap",
     *         "type": "number"
     *       },
         *       {
     *         "category": "IPO",
     *         "type": "date"
     *       }
         *     ]
         */
        options: PropTypes.array,

        /**
         * An object containing custom class names for child elements. Useful for
         * integrating with 3rd party UI kits. Allowed Keys: `input`, `results`,
         * `listItem`, `listAnchor`, `typeahead`, `hover`
         *
         * Example:
         *
         *     {
     *       input: 'faceted-input-text-input',
     *       results: 'faceted-input-list__container',
     *       listItem: 'faceted-input-list__item'
     *     }
         */
        customClasses: PropTypes.object,

        /**
         * **Uncontrolled Component:** A default set of values of tokens to be
         * loaded on first render. Each token should be an object with a
         * `category`, `operator`, and `value` key.
         *
         * Example:
         *
         *     [
         *       {
     *         category: 'Industry',
     *         operator: '==',
     *         value: 'Books',
     *       },
         *       {
     *         category: 'IPO',
     *         operator: '>',
     *         value: 'Dec 8, 1980 10:50 PM',
     *       },
         *       {
     *         category: 'Name',
     *         operator: 'contains',
     *         value: 'Nabokov',
     *       },
         *     ]
         */
        defaultValue: PropTypes.array,

        /**
         * **Controlled Component:** A set of values of tokens to be loaded on
         * each render. Each token should be an object with a `category`,
         * `operator`, and `value` key.
         *
         * Example:
         *
         *     [
         *       {
     *         category: 'Industry',
     *         operator: '==',
     *         value: 'Books',
     *       },
         *       {
     *         category: 'IPO',
     *         operator: '>',
     *         value: 'Dec 8, 1980 10:50 PM',
     *       },
         *       {
     *         category: 'Name',
     *         operator: 'contains',
     *         value: 'Nabokov',
     *       },
         *     ]
         */
        value: PropTypes.array,

        /**
         * Placeholder text for the typeahead input.
         */
        placeholder: PropTypes.string,

        /**
         * Event handler triggered whenever the filter is changed and a token
         * is added or removed. Params: `(filter)`
         */
        onChange: PropTypes.func,
        /**
         * A mapping of datatypes to operators.
         * Resolved by merging with default operators.
         * Example:
         *
         * ```javascript
         * {
     *    "textoptions":["equals","does not equal"],
     *    "text":["like","not like","equals","does not equal","matches","does not match"]
     * }
         * ```
         */
        operators: PropTypes.object,
    };

    static defaultProps = {
        // value: [],
        // defaultValue: [],
        options: [],
        customClasses: {},
        placeholder: '',
        onChange() {
        },
        operators: {
            textoptions: [`==`, `!=`],
            text: [`==`, `!=`, `contains`, `!contains`],
            number: [`==`, `!=`, `<`, `<=`, `>`, `>=`],
            date: [`==`, `!=`, `<`, `<=`, `>`, `>=`],
        }
    };

    static getStateFromProps = (props) => {
        const value = props.value || props.defaultValue || [];
        return value.slice(0);
    };

    state = {
        selected: FacetedInput.getStateFromProps(this.props),
        category: '',
        operator: '',
    };

    componentDidMount = () => {
        this.props.onChange(this.state.selected);
    };

    componentWillReceiveProps = (nextProps) => {
        const update = {};
        if (nextProps.value !== this.props.value) {
            update.selected = this.getStateFromProps(nextProps);
        }
        this.setState(update);
    };

    _renderTokens() {
        const tokenClasses = {};
        tokenClasses[this.props.customClasses.token] = !!this.props.customClasses.token;
        const classList = classNames(tokenClasses);
        return this.state.selected.map(selected => {
            const key = selected.category + selected.operator + selected.value;

            return (
                <TypeaheadChip
                    key={key}
                    className={classList}
                    onRemove={this.removeTokenForValue}
                >
                    {selected}
                </TypeaheadChip>

            );
        }, this);
    }

    getSuggestionsForTypeahead = () => {
        let categoryType;

        if (this.state.category === '') {
            const categories = [];
            for (let i = 0; i < this.props.options.length; i++) {
                categories.push(this.props.options[i].category);
            }
            return categories;
        } else if (this.state.operator === '') {
            categoryType = this.getCategoryType();

            const operators = Object.assign({}, FacetedInput.defaultProps.operators, this.props.operators);
            switch (categoryType) {
                case 'text':
                    return operators.text;
                case 'textoptions':
                    return operators.textoptions;
                case 'date':
                    return operators.date;
                case 'number':
                    return operators.number;
                default:
                    /* eslint-disable no-console */
                    console.warn(`WARNING: Unknown category type: "${categoryType}"`);
                    /* eslint-enable no-console */
                    return [];
            }
        }
        const options = this.getCategoryOptions();
        if (options === null || options === undefined) return [];
        return options();
    };

    getCategoryType = (category) => {
        let categoryType;
        let cat = category;
        if (!category || category === '') {
            cat = this.state.category;
        }
        for (let i = 0; i < this.props.options.length; i++) {
            if (this.props.options[i].category === cat) {
                categoryType = this.props.options[i].type;
                return categoryType;
            }
        }
    };

    getCategoryOptions = () => {
        for (let i = 0; i < this.props.options.length; i++) {
            if (this.props.options[i].category === this.state.category) {
                return this.props.options[i].suggestions;
            }
        }
    };


    onKeyDown = (event) => {
        // We only care about intercepting backspaces
        if (event.keyCode !== KeyboardEvent.DOM) {
            return;
        }

        // Remove token ONLY when bksp pressed at beginning of line
        // without a selection
        const entry = ReactDOM.findDOMNode(this.refs.typeahead.refs.inner.inputRef());
        if (entry.selectionStart === entry.selectionEnd &&
            entry.selectionStart === 0) {
            if (this.state.operator !== '') {
                this.setState({operator: ''});
            } else if (this.state.category !== '') {
                this.setState({category: ''});
            } else {
                // No tokens
                if (!this.state.selected.length) {
                    return;
                }
                const lastSelected = JSON.parse(
                    JSON.stringify(this.state.selected[this.state.selected.length - 1])
                );
                this.removeTokenForValue(
                    this.state.selected[this.state.selected.length - 1]
                );
                this.setState({category: lastSelected.category, operator: lastSelected.operator});
                if (this.getCategoryType(lastSelected.category) !== 'textoptions') {
                    this.refs.typeahead.refs.inner.setEntryText(lastSelected.value);
                }
            }
            event.preventDefault();
        }
    };

    removeTokenForValue = (value) => {
        const index = this.state.selected.indexOf(value);
        if (index === -1) {
            return;
        }

        this.state.selected.splice(index, 1);
        this.setState({selected: this.state.selected});
        this.props.onChange(this.state.selected);
    };

    addTokenForValue = (value) => {
        if (this.state.category === '') {
            this.setState({category: value});
            console.log(this.refs.typeahead.refs);
            this.refs.typeahead.refs.inner.setEntryText('');
            return;
        }

        if (this.state.operator === '') {
            this.setState({operator: value});
            this.refs.typeahead.refs.inner.setEntryText('');
            return;
        }

        const newValue = {
            category: this.state.category,
            operator: this.state.operator,
            value,
        };

        this.state.selected.push(newValue);
        this.setState({selected: this.state.selected});
        this.refs.typeahead.refs.inner.setEntryText('');
        this.props.onChange(this.state.selected);

        this.setState({
            category: '',
            operator: '',
        });
    };

    /*
     * Returns the data type the input should use ("date" or "text")
     */
    getInputType = () => {
        if (this.state.category !== '' && this.state.operator !== '') {
            return this.getCategoryType();
        }
        return 'text';
    };

    render() {
        const classes = {};
        classes[this.props.customClasses.typeahead] = this.props.customClasses.typeahead;
        const classList = classNames(classes);
        return (
            <div className="faceted-input">
                <div className="chip-collection">
                    {this._renderTokens()}

                    <div className="filter-input-group">
                        <div className="filter-category">{this.state.category} </div>
                        <div className="filter-operator">{this.state.operator} </div>

                        <Typeahead ref="typeahead"
                                   className={classList}
                                   placeholder={this.props.placeholder}
                                   customClasses={this.props.customClasses}
                                   suggestions={this.getSuggestionsForTypeahead()}
                                   datatype={this.getInputType()}
                                   onOptionSelected={this.addTokenForValue}
                                   onKeyDown={this.onKeyDown}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default FacetedInput;