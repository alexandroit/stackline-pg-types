import * as types from '../..';

const builtins: types.TypesBuiltins = types.builtins;
const textParser: any = types.getTypeParser(types.TypeId.INT8, 'text');
const binaryParser: any = types.getTypeParser(types.TypeId.FLOAT8, 'binary');
const textValue: string = textParser('42');
const binaryValue: number = binaryParser([200, 1, 0, 15]);
const arrayValue: any[] = types.arrayParser('{1,2,3}', (entry: any) => parseInt(entry, 10));

types.setTypeParser(types.TypeId.INT8, parseInt);
types.setTypeParser(types.TypeId.FLOAT8, 'binary', (data: any) => data[0]);

void builtins;
void textValue;
void binaryValue;
void arrayValue;
