import { FacetedSelect, OptionTypes } from './index';

describe('index.js', () => {
    it ('should export FacetedSelect', () => {
        expect(FacetedSelect).not.toBeNull()
    });

    it ('should export OptionTypes', () => {
        expect(OptionTypes).not.toBeNull()
    })
});