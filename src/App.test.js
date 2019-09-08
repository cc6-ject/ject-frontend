// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });
// import React from 'react';
// import { configure, shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import sinon from 'sinon';

// import App from './App';

// configure({ adapter: new Adapter() });

// describe('The App component', () => {
//   let wrapper;
//   sinon.spy(global.window, 'speechRecognition');

//   beforeEach(() => {
//     wrapper = shallow(<App />);
//   });

//   it('render child component div', () => {
//     expect(wrapper.find('div').exists()).toEqual(true);
//   });
//   it('should a call to the componentDidMount lifecycle method', () => {
//     sinon.spy(App.prototype, 'componentDidMount');
//     wrapper = shallow(<App />);
//     expect(App.prototype.componentDidMount.calledOnce).toEqual(true);
//   });
// });

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
