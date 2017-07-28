import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('dictionary');

var Dictionary = mx.Dictionary;

qtest('create dictionary', function (assert) {
    var dic = new Dictionary();

    dic.add('A', 1);
    assert.ok(dic.get('A') === 1, 'dictionary add/get');

    dic.remove('A');
    assert.ok(dic.containsKey('A') === false, 'dictionary remove');

    dic.clear();
});


qtest('dictionary toString', function (assert) {
    assert.equal(new Dictionary().toString(), '[Dictionary]', 'Dictionary toString');
});
