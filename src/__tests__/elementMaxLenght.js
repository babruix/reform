import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import Reform from '../index';
import { controlOnChangeTest, controlIntialStateTest } from '../testTemplates'
import * as maxLength from '../officialValidators/maxLength'


const validatorKey = "maxLength"

describe(validatorKey, () => {
  const validator = {[validatorKey]: 10}
  const successValue = ""
  const failureValue = "superExtraFine"
  maxLength
  .supportedInputTypes
  .forEach(inputType => {
    describe(`<input type="${inputType}" ${validatorKey}=${validator.maxLength} />"`, () => {
      const successConfig = {type: 'input', inputType: inputType, validator, value: successValue, error: false}
      const failureConfig = {type: 'input', inputType: inputType, validator, value: failureValue, error: true}
      controlIntialStateTest(successConfig)
      controlOnChangeTest(failureConfig)
      controlOnChangeTest(successConfig)
    });
  })

  describe(`<textarea ${validatorKey}=${validator.maxLength} />"`, () => {
    const successConfig = {type: 'textarea', validator, value: successValue, error: false}
    const failureConfig = {type: 'textarea', validator, value: failureValue, error: true}
    controlIntialStateTest(successConfig)
    controlOnChangeTest(failureConfig)
    controlOnChangeTest(successConfig)
  });
});
