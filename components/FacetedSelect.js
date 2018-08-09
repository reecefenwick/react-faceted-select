'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactSelect = require('react-select');

var _Creatable = require('react-select/lib/Creatable');

var _Creatable2 = _interopRequireDefault(_Creatable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
Constants for 'actions' associated with onChange in react-select
 */
var ReactSelectActions = {
    SELECT_OPTION: 'select-option',
    CREATE_OPTION: 'create-option',
    REMOVE_VAL: 'remove-value',
    POP_VALUE: 'pop-value'
};
var FILTER_SEPARATOR = ':';

var FacetedSelect = function (_React$Component) {
    _inherits(FacetedSelect, _React$Component);

    function FacetedSelect() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, FacetedSelect);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FacetedSelect.__proto__ || Object.getPrototypeOf(FacetedSelect)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            inputValue: '',
            selectedValues: []
        }, _this.buildOptions = function () {
            var options = _this.props.options;
            var inputValue = _this.state.inputValue;

            if (inputValue.includes(FILTER_SEPARATOR)) {
                var key = inputValue.split(FILTER_SEPARATOR)[0];
                var option = options.find(function (o) {
                    return o.label === key;
                });
                // TODO RF - if no option is matched what do?
                var suggestions = option.getSuggestions ? option.getSuggestions() : [];
                return suggestions.map(function (suggestedValue) {
                    return {
                        value: suggestedValue,
                        label: suggestedValue,
                        originalOption: option
                    };
                });
            } else {
                return options.map(function (o) {
                    return {
                        value: o.label,
                        label: o.label,
                        getSuggestions: o.getSuggestions
                    };
                });
            }
        }, _this.handleChange = function (selectedValues, meta) {
            var inputValue = _this.state.inputValue;

            var inputHasSeparator = inputValue.includes(FILTER_SEPARATOR);
            // TODO RF - create-option with no input separator
            if (meta.action === ReactSelectActions.REMOVE_VAL || meta.action === ReactSelectActions.POP_VALUE) {
                _this.setState({
                    selectedValues: selectedValues
                });
            } else if ((meta.action === ReactSelectActions.SELECT_OPTION || meta.action === ReactSelectActions.CREATE_OPTION) && inputHasSeparator) {
                // selected a suggested value
                var newSelectedValue = selectedValues[selectedValues.length - 1];
                if (meta.action === ReactSelectActions.CREATE_OPTION) {
                    // No originalOption available - don't modify newSelectedValue
                } else {
                    newSelectedValue.label = '' + newSelectedValue.originalOption.label + FILTER_SEPARATOR + newSelectedValue.label;
                    newSelectedValue.value = '' + newSelectedValue.label;
                }
                // TODO RF - refactor splitting
                _this.props.onOptionSelected(selectedValues.map(function (val) {
                    return {
                        label: val.label.split(FILTER_SEPARATOR)[0],
                        value: val.label.split(FILTER_SEPARATOR)[1]
                    };
                }));
                _this.setState({
                    selectedValues: selectedValues
                });
            } else if (meta.action === ReactSelectActions.SELECT_OPTION && !inputHasSeparator) {
                // selected a suggested key
                var selectedOption = selectedValues[selectedValues.length - 1];
                _this.setState({ inputValue: selectedOption.label + ':' });
            } else {
                throw new Error('Unexpected state for input ' + inputValue + ' and meta ' + JSON.stringify(meta));
            }
        }, _this.handleInputChange = function (inputValue) {
            _this.setState({ inputValue: inputValue });
        }, _this.renderCustomInput = function (props) {
            // if type 'date' render date-picker
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_reactSelect.components.Input, props)
            );
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    /*
    Only static for easy testing, fix?
     */


    /*
     * See https://react-select.com/props#replacing-components
     */


    _createClass(FacetedSelect, [{
        key: 'render',
        value: function render() {
            var options = this.buildOptions();

            var _state = this.state,
                inputValue = _state.inputValue,
                selectedValues = _state.selectedValues;


            return _react2.default.createElement(_Creatable2.default, {
                isMulti: true,
                components: {
                    Input: this.renderCustomInput
                },
                placeholder: 'Search...',
                isClearable: false,
                closeMenuOnSelect: false,
                filterOption: FacetedSelect.filterOption,
                onChange: this.handleChange,
                blurInputOnSelect: false,
                options: options,
                onInputChange: this.handleInputChange,
                inputValue: inputValue,
                value: selectedValues,
                formatCreateLabel: function formatCreateLabel(inputValue) {
                    return inputValue;
                }
            });
        }
    }]);

    return FacetedSelect;
}(_react2.default.Component);

FacetedSelect.filterOption = function (option, inputValue) {
    if (!inputValue) return true;
    var searchTerm = inputValue.toLowerCase();
    if (searchTerm.includes(FILTER_SEPARATOR)) {
        searchTerm = searchTerm.split(FILTER_SEPARATOR)[1];
    }
    return option.label.toLowerCase().includes(searchTerm);
};

FacetedSelect.propTypes = {
    options: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        // TODO RF - Control if multiple entries for an option can be input? e.g. 2 x "First Name"
        label: _propTypes2.default.string.isRequired,
        type: _propTypes2.default.string.isRequired, // TODO RF - Not currently used (needed for dates tho)
        getSuggestions: _propTypes2.default.func
    })).isRequired,
    onOptionSelected: _propTypes2.default.func.isRequired
};
exports.default = FacetedSelect;