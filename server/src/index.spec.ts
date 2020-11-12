
import { MyProject } from './index';
import { expect } from 'chai';

describe('MyProject', (): void => {

  describe('myMethod()', () => {

    it('should return "it works!!"', (): void => {
      expect(MyProject.myMethod('', 0)).to.equal('It works!!');
    });

  });

});
