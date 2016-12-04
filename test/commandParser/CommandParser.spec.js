/* eslint-disable arrow-parens, max-len, import/no-extraneous-dependencies */
import ava from 'ava';
import sinon from 'sinon';
import _isEqual from 'lodash/isEqual';
import _map from 'lodash/map';
import _tail from 'lodash/tail';

import CommandParser from '../../src/assets/scripts/commandParser/CommandParser';
import CommandModel from '../../src/assets/scripts/commandParser/CommandModel';

const CALLSIGN_MOCK = 'AA777';
const FH_COMMAND_MOCK = 'fh 180';
const D_COMMAND_MOCK = 'd 030';
const CAF_MOCK = 'caf';
const CVS_MOCK = 'cvs';
const TO_MOCK = 'to';
const STAR_MOCK = 'star quiet7';
const ROUTE_MOCK = 'route KSEA.MTN7.ELN..HAMUR.J12.DNJ';
const COMPLEX_HOLD_MOCK = 'hold dumba right 2min';
const UNICODE_HEADING_MOCK = '\u2BA2 180';
// _Syntax -_ `AAL123 fh[hdg]` or `AAL123 (rightarrow)[hdg]` or `AAL123 t r [hdg]`

const buildCommandString = (...args) => `${CALLSIGN_MOCK} ${args.join(' ')}`;

const buildCommandList = (...args) => {
    const commandString = buildCommandString(...args);

    return commandString.split(' ');
};

ava('throws when called without parameters', t => {
    t.throws(() => new CommandParser());
});

ava('._extractCommandsAndArgs() calls _buildCommandList()', t => {
    const commandStringMock = buildCommandString(CAF_MOCK, CVS_MOCK, TO_MOCK);
    const expectedArgs = buildCommandList(CAF_MOCK, CVS_MOCK, TO_MOCK);
    const model = new CommandParser('');
    const _buildCommandListStub = sinon.stub(model, '_buildCommandList');

    model._extractCommandsAndArgs(commandStringMock);

    t.true(_buildCommandListStub.calledWithExactly(_tail(expectedArgs)));
});

ava('._extractCommandsAndArgs() sets commandList with CommandModel objects', t => {
    const commandStringMock = buildCommandString(CAF_MOCK, CVS_MOCK, TO_MOCK);
    const model = new CommandParser(commandStringMock);

    t.true(model.commandList.length === 3);

    _map(model.commandList, (command) => {
        t.true(command instanceof CommandModel);
    });
});

ava('._buildCommandList() finds correct command when it recieves a space before a unicode value', t => {
    const commandListMock = buildCommandList('', UNICODE_HEADING_MOCK);
    const model = new CommandParser('');
    const result = model._buildCommandList(_tail(commandListMock));

    t.true(result[0].name === 'heading');
    t.true(result[0].args[0] === '180');
});
