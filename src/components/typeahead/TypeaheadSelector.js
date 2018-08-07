import React from 'react';
import PropTypes from 'prop-types';
import TypeaheadOption from './TypeaheadOption';
import classNames from 'classnames';

export default class TypeaheadSelector extends React.Component {
    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.string),
        customClasses: PropTypes.object,
        selectionIndex: PropTypes.number,
        onOptionSelected: PropTypes.func
    };

    static defaultProps = {
        selectionIndex: null,
        customClasses: {},
        onOptionSelected() {}
    };

    state = {
        selectionIndex: this.props.selectionIndex,
        selection: null
    };

    setSelectionIndex = (index) => {
        this.setState({
            selectionIndex: index,
            selection: this.getSelectionForIndex(index)
        });
    };

    getSelectionForIndex = (index) => {
        if (index === null) {
            return null;
        }
        return this.props.options[index];
    };

    onClickOption = (result) => {
        this.props.onOptionSelected(result);
    };

    nav = (delta) => {
        if (!this.props.options) {
            return;
        }

        let newIndex;
        if (this.state.selectionIndex === null) {
            if (delta === 1) {
                newIndex = 0;
            } else {
                newIndex = delta;
            }
        } else {
            newIndex = this.state.selectionIndex + delta;
        }

        if (newIndex < 0) {
            newIndex += this.props.options.length;
        } else if (newIndex >= this.props.options.length) {
            newIndex -= this.props.options.length;
        }

        const newSelection = this.getSelectionForIndex(newIndex);
        this.setState({
            selectionIndex: newIndex,
            selection: newSelection,
        });
    };

    navDown = () => {
        this.nav(1);
    };

    navUp = () => {
        this.nav(-1);
    };

    render() {
        const classes = {
            'typeahead-selector': true,
        };
        classes[this.props.customClasses.results] = this.props.customClasses.results;

        const options = this.props.options.map(
            (option, i) => (
                <TypeaheadOption
                    key={option}
                    result={option}
                    hover={this.state.selectionIndex === i}
                    customClasses={this.props.customClasses}
                    onClickOption={this.onClickOption}
                >
                    {option}
                </TypeaheadOption>
            )
            , this);

        return (
            <ul className={classNames(classes)}>
                {options}
            </ul>
        );
    }
}
