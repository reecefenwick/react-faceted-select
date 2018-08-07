import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TypeaheadOption extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        result: PropTypes.string,
        onClickOption: PropTypes.func,
        children: PropTypes.string,
        hover: PropTypes.bool
    };

    static defaultProps = {
        classes: {},
        onClickOption: (event) => event.preventDefault()
    };

    getClasses = () => {
        const classes = {
            'typeahead-option': true,
        };
        classes[this.props.classes.listAnchor] = !!this.props.classes.listAnchor;
        return classNames(classes);
    };

    onClickOption = (event) => {
        event.preventDefault();
        return this.props.onClickOption(this.props.result);
    };

    render() {
        const classes = {
            hover: this.props.hover,
        };
        classes[this.props.classes.listItem] = !!this.props.classes.listItem;

        return (
            <li className={classNames(classes)}>
                <a
                    href="#"
                    id="typeahead-option"
                    onClick={this.onClickOption}
                    className={this.getClasses()}
                    ref="anchor"
                >
                    {this.props.children}
                </a>
            </li>
        );
    }
}
