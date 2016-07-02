import mx from '../../multiplex'
import {qmodule, qtest} from '../../qunit'

qmodule('hash');

qtest('basic hash', function (assert) {
    assert.equal(mx.hash(), 0, 'hash method without arguments!');
    assert.equal(mx.hash(null), 0, 'hash null is zero!');
    assert.equal(mx.hash(undefined), 0, 'hash undefined is zero!');
});
