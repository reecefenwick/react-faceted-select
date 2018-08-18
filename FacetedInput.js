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

var FILTER_SEPARATOR = ':';

var FacetedInput = function (_React$Component) {
    _inherits(FacetedInput, _React$Component);

    function FacetedInput() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, FacetedInput);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FacetedInput.__proto__ || Object.getPrototypeOf(FacetedInput)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            inputValue: '',
            value: []
        }, _this.buildOptions = function (state, props) {
            var options = _this.props.options;
            var inputValue = _this.state.inputValue;
            // TODO RF - May need to maintain more properties

            if (inputValue.includes(FILTER_SEPARATOR)) {
                // extract the key
                var option = options.find(function (o) {
                    return o.label === inputValue.split(FILTER_SEPARATOR)[0];
                });
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
            // TODO RF - handle meta-action "create-option"

            var inputHasSeparator = inputValue && inputValue.includes(FILTER_SEPARATOR);
            if (meta.action === 'remove-value' || meta.action === 'pop-value') {
                _this.setState({
                    value: selectedValues
                });
            } else if ((meta.action === 'select-option' || meta.action === 'create-option') && inputHasSeparator) {
                // selected a suggested value
                var newSelectedValue = selectedValues[selectedValues.length - 1];
                if (meta.action === 'create-option') {
                    // No originalOption available
                    newSelectedValue.label = '' + newSelectedValue.label;
                    newSelectedValue.value = '' + newSelectedValue.value;
                } else {
                    newSelectedValue.label = newSelectedValue.originalOption.label + ': ' + newSelectedValue.label;
                    newSelectedValue.value = newSelectedValue.originalOption.value + ': ' + newSelectedValue.value;
                }
                // TODO RF - Change value
                console.log('Selected suggested value');
                _this.setState({
                    value: selectedValues
                });
            } else if (meta.action === 'select-option' && !inputHasSeparator) {
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
        }, _this.filterOption = function (option, inputValue) {
            if (!inputValue) return true;
            var searchTerm = inputValue.toLowerCase();
            if (searchTerm.includes(FILTER_SEPARATOR)) {
                searchTerm = searchTerm.split(FILTER_SEPARATOR)[1];
            }
            return option.label.toLowerCase().includes(searchTerm);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    /*
     * See https://react-select.com/props#replacing-components
     */


    _createClass(FacetedInput, [{
        key: 'render',
        value: function render() {
            var options = this.buildOptions(this.state, this.props);

            var _state = this.state,
                inputValue = _state.inputValue,
                value = _state.value;


            return _react2.default.createElement(_Creatable2.default, {
                isMulti: true,
                components: {
                    Input: this.renderCustomInput
                },
                isClearable: false,
                closeMenuOnSelect: false,
                filterOption: this.filterOption,
                onChange: this.handleChange,
                options: options,
                onInputChange: this.handleInputChange,
                inputValue: inputValue,
                value: value
            });
        }
    }]);

    return FacetedInput;
}(_react2.default.Component);

FacetedInput.propTypes = {
    options: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        label: _propTypes2.default.string.isRequired,
        type: _propTypes2.default.string.isRequired, // TODO RF - May be redundant
        getSuggestions: _propTypes2.default.func
    })).isRequired
};
exports.default = FacetedInput;