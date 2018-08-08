'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _fuzzy = require('fuzzy');

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _reactDatetime = require('react-datetime');

var _reactDatetime2 = _interopRequireDefault(_reactDatetime);

require('react-datetime/css/react-datetime.css');

var _TypeaheadSelector = require('./TypeaheadSelector');

var _TypeaheadSelector2 = _interopRequireDefault(_TypeaheadSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO RF - onclick outside or replace Typeahead altogether

/**
 * A "typeahead", an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.  Requires CSS for MASSIVE DAMAGE.
 */
var Typeahead = function (_React$Component) {
    _inherits(Typeahead, _React$Component);

    function Typeahead() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Typeahead);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Typeahead.__proto__ || Object.getPrototypeOf(Typeahead)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            // The set of all options... Does this need to be state?  I guess for lazy load...
            options: _this.props.options,
            header: _this.props.header,
            datatype: _this.props.datatype,

            focused: false,

            // Typeahead suggestions
            suggestions: _this.props.options,

            // This should be called something else, "entryValue"
            entryValue: _this.props.defaultValue,

            // A valid typeahead value
            selection: null
        }, _this.componentWillReceiveProps = function (nextProps) {
            _this.setState({
                options: nextProps.options,
                header: nextProps.header,
                datatype: nextProps.datatype,
                suggestions: nextProps.options
            });
        }, _this.getSuggestionsForValue = function (value, options) {
            var result = _fuzzy2.default.filter(value, options).map(function (res) {
                return res.string;
            });

            if (_this.props.maxVisible) {
                result = result.slice(0, _this.props.maxVisible);
            }
            return result;
        }, _this.setEntryText = function (value) {
            if (_this.refs.entry != null) {
                _reactDom2.default.findDOMNode(_this.refs.entry).value = value;
            }
            _this._onTextEntryUpdated();
        }, _this._renderIncrementalSearchResults = function () {
            if (!_this.state.focused) {
                return '';
            }

            // Something was just selected
            if (_this.state.selection) {
                return '';
            }

            // There are no typeahead / autocomplete suggestions
            if (!_this.state.suggestions.length) {
                return '';
            }

            return _react2.default.createElement(_TypeaheadSelector2.default, {
                ref: 'sel',
                options: _this.state.suggestions,
                header: _this.state.header,
                onOptionSelected: _this._onOptionSelected,
                customClasses: _this.props.customClasses
            });
        }, _this._onOptionSelected = function (option) {
            var nEntry = _reactDom2.default.findDOMNode(_this.refs.entry);
            nEntry.focus();
            nEntry.value = option;
            _this.setState({
                suggestions: _this.getSuggestionsForValue(option, _this.state.options),
                selection: option,
                entryValue: option
            });

            _this.props.onOptionSelected(option);
        }, _this._onTextEntryUpdated = function () {
            var value = '';
            if (_this.refs.entry != null) {
                value = _reactDom2.default.findDOMNode(_this.refs.entry).value;
            }
            _this.setState({
                suggestions: _this.getSuggestionsForValue(value, _this.state.options),
                selection: null,
                entryValue: value
            });
        }, _this._onEnter = function (event) {
            if (!_this.refs.sel.state.selection) {
                return _this.props.onKeyDown(event);
            }

            _this._onOptionSelected(_this.refs.sel.state.selection);
        }, _this._onEscape = function () {
            _this.refs.sel.setSelectionIndex(null);
        }, _this._onTab = function () {
            var option = _this.refs.sel.state.selection ? _this.refs.sel.state.selection : _this.state.suggestions[0];
            _this._onOptionSelected(option);
        }, _this.eventMap = function () {
            var events = {};

            events[KeyboardEvent.DOM_VK_UP] = _this.refs.sel.navUp;
            events[KeyboardEvent.DOM_VK_DOWN] = _this.refs.sel.navDown;
            events[KeyboardEvent.DOM_VK_RETURN] = events[KeyboardEvent.DOM_VK_ENTER] = _this._onEnter;
            events[KeyboardEvent.DOM_VK_ESCAPE] = _this._onEscape;
            events[KeyboardEvent.DOM_VK_TAB] = _this._onTab;

            return events;
        }, _this._onKeyDown = function (event) {
            // If Enter pressed
            if (event.keyCode === KeyboardEvent.DOM_VK_RETURN || event.keyCode === KeyboardEvent.DOM_VK_ENTER) {
                // If no options were provided so we can match on anything
                if (_this.props.options.length === 0) {
                    _this._onOptionSelected(_this.state.entryValue);
                }

                // If what has been typed in is an exact match of one of the options
                if (_this.props.options.indexOf(_this.state.entryValue) > -1) {
                    _this._onOptionSelected(_this.state.entryValue);
                }
            }

            // If there are no suggestions elements, don't perform selector navigation.
            // Just pass this up to the upstream onKeydown handler
            if (!_this.refs.sel) {
                return _this.props.onKeyDown(event);
            }

            var handler = _this.eventMap()[event.keyCode];

            if (handler) {
                handler(event);
            } else {
                return _this.props.onKeyDown(event);
            }
            // Don't propagate the keystroke back to the DOM/browser
            event.preventDefault();
        }, _this._onFocus = function () {
            _this.setState({ focused: true });
        }, _this.handleClickOutside = function (event) {
            _this.setState({ focused: false });
        }, _this.isDescendant = function (parent, child) {
            var node = child.parentNode;
            while (node !== null) {
                if (node === parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }, _this._handleDateChange = function (date) {
            var newDate = (0, _moment2.default)(date, 'lll');
            if (!newDate.isValid()) newDate = (0, _moment2.default)();
            _this.props.onOptionSelected(newDate.format('lll'));
        }, _this._showDatePicker = function () {
            if (_this.state.datatype === 'date') {
                return true;
            }
            return false;
        }, _this.inputRef = function () {
            if (_this._showDatePicker()) {
                return _this.refs.datepicker.refs.dateinput.refs.entry;
            }

            return _this.refs.entry;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Typeahead, [{
        key: 'render',
        value: function render() {
            var inputClasses = {};
            inputClasses[this.props.customClasses.input] = !!this.props.customClasses.input;
            var inputClassList = (0, _classnames2.default)(inputClasses);

            var classes = {
                typeahead: true
            };
            classes[this.props.className] = !!this.props.className;
            var classList = (0, _classnames2.default)(classes);

            if (this._showDatePicker()) {
                var defaultDate = (0, _moment2.default)(this.state.entryValue, 'lll');
                if (!defaultDate.isValid()) defaultDate = (0, _moment2.default)();
                return _react2.default.createElement(
                    'span',
                    {
                        ref: 'input',
                        className: classList,
                        onFocus: this._onFocus
                    },
                    _react2.default.createElement(_reactDatetime2.default, {
                        ref: 'datepicker',
                        dateFormat: "ll",
                        defaultValue: defaultDate,
                        onChange: this._handleDateChange,
                        open: this.state.focused
                    })
                );
            }

            return _react2.default.createElement(
                'span',
                {
                    ref: 'input',
                    className: classList,
                    onFocus: this._onFocus
                },
                _react2.default.createElement('input', {
                    ref: 'entry',
                    type: 'text',
                    placeholder: this.props.placeholder,
                    className: inputClassList,
                    defaultValue: this.state.entryValue,
                    onChange: this._onTextEntryUpdated,
                    onKeyDown: this._onKeyDown
                }),
                this._renderIncrementalSearchResults()
            );
        }
    }]);

    return Typeahead;
}(_react2.default.Component);

Typeahead.propTypes = {
    customClasses: _propTypes2.default.object,
    maxVisible: _propTypes2.default.number,
    options: _propTypes2.default.array,
    header: _propTypes2.default.string,
    datatype: _propTypes2.default.string,
    defaultValue: _propTypes2.default.string,
    placeholder: _propTypes2.default.string,
    onOptionSelected: _propTypes2.default.func,
    onKeyDown: _propTypes2.default.func,
    className: _propTypes2.default.string
};
Typeahead.defaultProps = {
    options: [],
    header: 'Category',
    datatype: 'text',
    customClasses: {},
    defaultValue: '',
    placeholder: '',
    onKeyDown: function onKeyDown() {},
    onOptionSelected: function onOptionSelected() {}
};
exports.default = Typeahead;