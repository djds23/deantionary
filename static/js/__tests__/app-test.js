import React from 'react/addons';
import {WordDefinition} from '../app.jsx';


const TestUtils = React.addons.TestUtils;
const FakeLookUp = {
	word: 'Test',
	definition: 'To determine a status of geniune',
	suggestions: []
}

jest.dontMock('../app.jsx');
describe('app.jsx', () => {
	it('Test WordDefinition', () => { 
		const worddefinition = TestUtils.renderIntoDocument(
		  <WordDefinition LookUpObject={FakeLookUp} />
		);
		const label =  TestUtils.findRenderedDOMComponentWithTag(
		  worddefinition, 'h5'
		);
		expect(React.findDOMNode(label).textContent).toEqual('Test');
	})
});