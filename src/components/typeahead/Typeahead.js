import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import fuzzy from 'fuzzy';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import TypeaheadSelector from './TypeaheadSelector';

// TODO RF - onclick outside or replace Typeahead altogether

class Typeahead extends React.Component {
    static propTypes = {
        customClasses: PropTypes.object,
        maxVisible: PropTypes.number,
        suggestions: PropTypes.array,
        datatype: PropTypes.string,
        defaultValue: PropTypes.string,
        placeholder: PropTypes.string,
        onOptionSelected: PropTypes.func,
        onKeyDown: PropTypes.func,
        className: PropTypes.string,
    };

    static defaultProps = {
        suggestions: [],
        datatype: 'text',
        customClasses: {},
        defaultValue: '',
        placeholder: '',
        onKeyDown: () => {},
        onOptionSelected: () => {},
    };

    state = {
        // The set of all suggestions... Does this need to be state?  I guess for lazy load...
        options: this.props.suggestions,
        datatype: this.props.datatype,

        focused: false,

        suggestions: this.props.suggestions,

        inputText: this.props.defaultValue,

        // A valid typeahead value
        selection: null
    };

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            suggestions: nextProps.suggestions,
            datatype: nextProps.datatype
        });
    };

    getSuggestionsForValue = (value, options) => {
        let result = fuzzy
            .filter(value, options)
            .map(res => res.string);

        if (this.props.maxVisible) {
            result = result.slice(0, this.props.maxVisible);
        }
        return result;
    };

    setEntryText = (value) => {
        if (this.refs.entry != null) {
            ReactDOM.findDOMNode(this.refs.entry).value = value;
        }
        this.onInputTextChanged();
    };

    _renderIncrementalSearchResults = () => {
        if (!this.state.focused) {
            return '';
        }

        // Something was just selected
        if (this.state.selection) {
            return '';
        }

        // There are no typeahead / autocomplete suggestions
        if (!this.state.suggestions.length) {
            return '';
        }

        return (
            <TypeaheadSelector
                ref="sel"
                options={this.state.suggestions}
                onOptionSelected={this.onOptionSelected}
                customClasses={this.props.customClasses}
            />
        );
    };

    onOptionSelected = (option) => {
        // TODO RF - focus back on input
        this.setState({
            suggestions: this.getSuggestionsForValue(option, this.state.options),
            selection: option,
            inputText: option,
        });

        this.props.onOptionSelected(option);
    };

    onInputTextChanged = (event) => {
        const value = event.target.value;
        this.setState({
            suggestions: this.getSuggestionsForValue(value, this.state.options),
            selection: null,
            inputText: value
        });
    };

    _onEnter = (event) => {
        if (!this.refs.sel.state.selection) {
            return this.props.onKeyDown(event);
        }

        this.onOptionSelected(this.refs.sel.state.selection);
    };

    _onEscape = () => {
        this.refs.sel.setSelectionIndex(null);
    };

    _onTab = () => {
        const option = this.refs.sel.state.selection ?
            this.refs.sel.state.selection : this.state.suggestions[0];
        this.onOptionSelected(option);
    };

    eventMap = () => {
        const events = {};

        events[KeyboardEvent.DOM_VK_UP] = this.refs.sel.navUp;
        events[KeyboardEvent.DOM_VK_DOWN] = this.refs.sel.navDown;
        events[KeyboardEvent.DOM_VK_RETURN] = events[KeyboardEvent.DOM_VK_ENTER] = this._onEnter;
        events[KeyboardEvent.DOM_VK_ESCAPE] = this._onEscape;
        events[KeyboardEvent.DOM_VK_TAB] = this._onTab;

        return events;
    };

    _onKeyDown = (event) => {
        // If Enter pressed
        if (event.keyCode === KeyboardEvent.DOM_VK_RETURN || event.keyCode === KeyboardEvent.DOM_VK_ENTER) {
            // If no suggestions were provided so we can match on anything
            if (this.props.suggestions.length === 0) {
                this.onOptionSelected(this.state.inputText);
            }

            // If what has been typed in is an exact match of one of the suggestions
            if (this.props.suggestions.indexOf(this.state.inputText) > -1) {
                this.onOptionSelected(this.state.inputText);
            }
        }

        // If there are no suggestions elements, don't perform selector navigation.
        // Just pass this up to the upstream onKeydown handler
        if (!this.refs.sel) {
            return this.props.onKeyDown(event);
        }

        const handler = this.eventMap()[event.keyCode];

        if (handler) {
            handler(event);
        } else {
            return this.props.onKeyDown(event);
        }
        // Don't propagate the keystroke back to the DOM/browser
        event.preventDefault();
    };

    _onFocus = () => {
        this.setState({focused: true});
    };

    _handleDateChange = (date) => {
        let newDate = moment(date, 'lll');
        if (!newDate.isValid()) newDate = moment();
        this.props.onOptionSelected(newDate.format('lll'));
    };

    _showDatePicker = () => {
        return this.state.datatype === 'date';
    };

    inputRef = () => {
        if (this._showDatePicker()) {
            return this.refs.datepicker.refs.dateinput.refs.entry;
        }

        return this.refs.entry;
    };

    render() {
        const inputClasses = {};
        inputClasses[this.props.customClasses.input] = !!this.props.customClasses.input;
        const inputClassList = classNames(inputClasses);

        const classes = {
            typeahead: true,
        };
        classes[this.props.className] = !!this.props.className;
        const classList = classNames(classes);

        if (this._showDatePicker()) {
            let defaultDate = moment(this.state.inputText, 'lll');
            if (!defaultDate.isValid()) defaultDate = moment();
            return (
                <span
                    ref={this.inputRef}
                    className={classList}
                    onFocus={this._onFocus}
                >
                  <Datetime
                      ref="datepicker"
                      dateFormat={"ll"}
                      defaultValue={defaultDate}
                      onChange={this._handleDateChange}
                      open={this.state.focused}
                  />
                </span>
            );
        }

        return (
            <span
                ref="input"
                className={classList}
                onFocus={this._onFocus}
            >
                <input
                    type="text"
                    placeholder={this.props.placeholder}
                    className={inputClassList}
                    defaultValue={this.state.inputText}
                    onChange={this.onInputTextChanged}
                    onKeyDown={this._onKeyDown}
                />
                {this._renderIncrementalSearchResults()}
                </span>
        );
    }
}

export default Typeahead;
