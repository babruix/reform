import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import Reform from '../Reform';
import * as Validator from '../validators';
import { controlOnChangeTest, controlIntialStateTest, spy } from '../testTemplates'

Validator.addRule('myRule', control => control.value !== 'Delfina');

const name1 = "test_control_1";
const name2 = "test_control_2";

function render() {
  const onChange = jest.fn();

  const wrapper = shallow(
    <Reform>
      <form onSubmit={function() {}}>
        <input
          type="text"
          name={name1}
          value=""
          onChange={onChange}
          required
          data-reform={{
            validationRules: {
              myRule: true
            }
          }}
          />
      </form>
    </Reform>
  );

  return [wrapper, onChange];
}

describe('Custom Validations: Globals', () => {
  describe('test case 1', () => {
    describe('fail', () => {
      const [wrapper, onChange] = render();
      wrapper.find('input').simulate('change', {target: { value: '', getAttribute: _ => name1}});
      const [control] = onChange.mock.calls[0]

      it('should call the original onChange handler', () => {
        expect(onChange).toBeCalled()
      })

      it('should set error={myRule: true}', () => {
        expect(control.errors.myRule).toBeDefined()
        expect(control.errors.myRule).toBe(true)
      })

      it('should set error={required: true}', () => {
        expect(control.errors.required).toBeDefined()
        expect(control.errors.required).toBe(true)
      })
    })

    describe('success', () => {
      const [wrapper, onChange] = render();
      wrapper.find('input').simulate('change', {target: { value: 'Delfina', getAttribute: _ => name1}});
      const [control] = onChange.mock.calls[0]

      it('should call the original onChange handler', () => {
        expect(onChange).toBeCalled()
      })

      it('should set error={myRule: true}', () => {
        expect(control.errors.myRule).toBeDefined()
        expect(control.errors.myRule).toBe(false)
      })

      it('should set error={required: true}', () => {
        expect(control.errors.required).toBeDefined()
        expect(control.errors.required).toBe(false)
      })
    })
  })


  describe('test case 2: formState', () => {

    Validator.addRule('myComposedRule', (control, formState) => {
      return control.value !== formState[name2].value
    });

    function render() {
      const onChange = jest.fn();

      const wrapper = shallow(
        <Reform>
          <form onSubmit={function() {}}>
            <input
              id={name1}
              type="text"
              name={name1}
              value=""
              onChange={onChange}
              required
              data-reform={{
                validationRules: {
                  myComposedRule: true
                }
              }}
              />
            <input
              id={name2}
              type="text"
              name={name2}
              value="Delfina"
              onChange={onChange}
              />
          </form>
        </Reform>
      );

      return [wrapper, onChange];
    }

    describe('fail', () => {
      const [wrapper, onChange] = render();
      wrapper.find(`#${name1}`).simulate('change', {target: { value: '', getAttribute: _ => name1}});
      const [control] = onChange.mock.calls[0]

      it('should call the original onChange handler', () => {
        expect(onChange).toBeCalled()
      })

      it('should set error={myComposedRule: true}', () => {
        expect(control.errors.myComposedRule).toBeDefined()
        expect(control.errors.myComposedRule).toBe(true)
      })

      it('should set error={required: true}', () => {
        expect(control.errors.required).toBeDefined()
        expect(control.errors.required).toBe(true)
      })
    })

    describe('success', () => {
      const [wrapper, onChange] = render();
      wrapper.find(`#${name1}`).simulate('change', {target: { value: 'Delfina', getAttribute: _ => name1}});
      const [control] = onChange.mock.calls[0]

      it('should call the original onChange handler', () => {
        expect(onChange).toBeCalled()
      })

      it('should set error={myComposedRule: true}', () => {
        expect(control.errors.myComposedRule).toBeDefined()
        expect(control.errors.myComposedRule).toBe(false)
      })

      it('should set error={required: true}', () => {
        expect(control.errors.required).toBeDefined()
        expect(control.errors.required).toBe(false)
      })
    })
  })
})

