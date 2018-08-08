'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chip = function (_React$Component) {
    _inherits(Chip, _React$Component);

    function Chip() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Chip);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Chip.__proto__ || Object.getPrototypeOf(Chip)).call.apply(_ref, [this].concat(args))), _this), _this._handleClick = function (event) {
            _this.props.onRemove(_this.props.children);
            event.preventDefault();
        }, _this._makeCloseButton = function () {
            if (!_this.props.onRemove) {
                return '';
            }
            return _react2.default.createElement(
                'a',
                { className: 'typeahead-chip-close', href: '#', onClick: _this._handleClick },
                '\xD7'
            );
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Chip, [{
        key: 'render',
        value: function render() {
            var _props$children = this.props.children,
                category = _props$children.category,
                operator = _props$children.operator,
                value = _props$children.value;

            return _react2.default.createElement(
                'div',
                { className: 'typeahead-chip' },
                _react2.default.createElement(
                    'span',
                    { className: 'chip-category' },
                    category
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'chip-operator' },
                    operator
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'chip-value' },
                    value
                ),
                this._makeCloseButton()
            );
        }
    }]);

    return Chip;
}(_react2.default.Component);

Chip.propTypes = {
    children: _propTypes2.default.object,
    onRemove: _propTypes2.default.func
};
exports.default = Chip;