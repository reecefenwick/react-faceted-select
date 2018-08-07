import React from 'react';
import PropTypes from 'prop-types';

class TypeaheadChip extends React.Component {
    static propTypes = {
        children: PropTypes.object,
        onRemove: PropTypes.func,
    };

    handleClick = (event) =>{
        this.props.onRemove(this.props.children);
        event.preventDefault();
    };

    makeCloseButton = () => {
        if (!this.props.onRemove) {
            return '';
        }
        return (
            <a className="typeahead-chip-close" href="#" onClick={this.handleClick}>&#x00d7;</a>
        );
    };

    render() {
        const {category, operator, value} = this.props.children;
        return (
            <div className="typeahead-chip">
                <span className="chip-category">{category}</span>
                <span className="chip-operator">{operator}</span>
                <span className="chip-value">{value}</span>
                {this.makeCloseButton()}
            </div>
        );
    }
}

export default TypeaheadChip;