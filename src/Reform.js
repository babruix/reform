import React, { Component } from 'react';
import * as Element from './element'
import Control from './control'

const noop = function() {};

export default class Reform extends Component {
  constructor(props) {
    super(props)
    this.formState = {}
  }

  render() {
    const newChildren = this.monkeyPatchChildrens(this.props.children)
    return <div>{newChildren}</div>
  }

  onChangeFactory(name, child, oldOnChange) {
    return (event, ...args) => {
      // If cant found then something horrible wrong happended
      let control = this.formState[name]

      if (!control) {
        throw new Error(`Could not find control with name ${name}. This is likely a bug with Reform :(`)
      }

      // Update value
      control.value = control.getValue(event, control)

      try {
        control.checked = event.target.checked
      } catch(e) {
        control.checked = null;
      }


      // Update error hash
      control.validate(this.formState)

      oldOnChange.apply(null, [control, event, ...args])
    }
  }

  onSubmitFactory(oldOnSubmit) {
    return (event, ...args) => {
      this.validateForm();
      oldOnSubmit.apply(null, [this, event, ...args]);
    }
  }


  monkeyPatchChildrens(children) {
    return React.Children.map(children, element => {
      if (!element) {
        return element
      }
      if (Element.isTextType(element)) {
        return element
      }

      const oldChildren = element.props.children

      // Recursive call
      const newChildren = this.monkeyPatchChildrens(oldChildren)


      let newProps = {};

      const REFORM_CONFIG_KEY = 'data-reform'

      // the way to distinguish controls from other element should be the following:
      // - checkboxes, radios and Custom checkboxes and Radios should have onChange, checked, value
      // - The rest of the inputs and their Custom counterparts should have onChanve and value
      const isControl =
        element.props.hasOwnProperty('onChange') &&
        (element.props.hasOwnProperty('value') || element.props.hasOwnProperty('checked'));
      const isForm = element.props.hasOwnProperty('onSubmit');
      // TODO: hack all submit mechanisms
      const isSubmit = Element.isSubmitInput(element) || Element.isSubmitButton(element);
      if (isControl) {
        const oldOnChange = element.props.onChange

        const control = new Control(element, element.props[REFORM_CONFIG_KEY]);

        // Special case for Radio buttons
        if (Element.isRadio(element)) {
          const existingControl = this.formState[control.name];
          if (existingControl) {
            control.value = control.checked ? control.value : existingControl.value;
          }
        }

        this.formState[control.name] = control;

        const onChange = this.onChangeFactory(control.name, element, oldOnChange)
        newProps = {onChange}

      } else if (isForm) {
        const oldOnSubmit = element.props.onSubmit;
        const onSubmit = this.onSubmitFactory(oldOnSubmit);
        // Disable html5 native validation
        newProps =  {onSubmit, noValidate: true};

      } else if (isSubmit) {

        const oldOnClick = element.props.onClick || noop;
        const onClick = this.onSubmitFactory(oldOnClick);
        newProps = {onClick}
      }


      return React.cloneElement(element, newProps, newChildren)
    })
  }

  validateForm() {
    for (const fieldName in this.formState) {
      const control = this.formState[fieldName];
      control.validate(this.formState);
    }

    return this.isValid();
  }

  isValid() {
    return Object.keys(this.formState)
      .map(fieldName => this.formState[fieldName])
      .every(control => control.isValid())
  }


  getErrorMap() {
    let errorMap = {}
    for (let fieldName in this.formState) {
      const control = this.formState[fieldName];
      errorMap[fieldName] = control.errors;
    }

    return errorMap;
  }

}
