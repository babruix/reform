import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import Reform from '../index';
import { controlOnChangeTest, controlIntialStateTest } from '../testTemplates'


const name = "test_control_1";

function render() {
  const onChange = jest.fn();

  const wrapper = shallow(
    <Reform>
      <form onSubmit={function() {}}>
        <input
          type="text"
          name={name}
          value=""
          onChange={onChange}
          required
          data-reform={{
            validationRules: {
              myRule: control => control.value !== 'Delfina'
            }
          }}
          />
      </form>
    </Reform>
  );

  return [wrapper, onChange];
}

describe('Custom Validations: Ad Hoc', () => {
  describe('test case 1', () => {
    describe('fail', () => {
      const [wrapper, onChange] = render();
      wrapper.find('input').simulate('change', {target: { value: ''}});

      it('should call the original onChange handler', () => {
        expect(onChange).toBeCalled()
      })

      it('should set error={myRule: true}', () => {
        const [control] = onChange.mock.calls[0];
        expect(control.errors.myRule).toBeDefined()
        expect(control.errors.myRule).toBe(true)
      })

      it('should set error={required: true}', () => {
        const [control] = onChange.mock.calls[0];
        expect(control.errors.required).toBeDefined()
        expect(control.errors.required).toBe(true)
      })
    })

    describe('success', () => {
      const [wrapper, onChange] = render();
      wrapper.find('input').simulate('change', {target: { value: 'Delfina'}});


      it('should call the original onChange handler', () => {
        expect(onChange).toBeCalled()
      })

      it('should set error={myRule: true}', () => {
        const [control] = onChange.mock.calls[0]
        expect(control.errors.myRule).toBeDefined()
        expect(control.errors.myRule).toBe(false)
      })

      it('should set error={required: true}', () => {
        const [control] = onChange.mock.calls[0]
        expect(control.errors.required).toBeDefined()
        expect(control.errors.required).toBe(false)
      })
    })
  })
})
