import * as types from '../..';

const parser = types.getTypeParser(types.TypeId.JSONB, 'text');
const value: any = parser('{"ok":true}');
types.setTypeParser(types.TypeId.TIMESTAMP, (input: string) => new Date(input));
types.setTypeParser(types.TypeId.INT8, 'binary', (input: any) => input.toString('hex'));

void value;
