import { InputType } from '../types';
import { booleanHelper } from './boolean';
import { collectionHelper } from './collection';
import { datetimeHelper } from './datetime';
import { durationHelper } from './duration';
import { floatHelper } from './float';
import { integerHelper } from './integer';
import { noneHelper } from './none';
import { stringHelper } from './string';
import { InputHelper } from './types';

const unsupportedHelper = noneHelper;

/** Maps an `InputType` to a function which will convert its value into a `Literal` */
const inputHelpers: Record<InputType, InputHelper> = {
    [InputType.Binary]: noneHelper,
    [InputType.Blob]: unsupportedHelper,
    [InputType.Boolean]: booleanHelper,
    [InputType.Collection]: collectionHelper,
    [InputType.Datetime]: datetimeHelper,
    [InputType.Duration]: durationHelper,
    [InputType.Error]: unsupportedHelper,
    [InputType.Float]: floatHelper,
    [InputType.Integer]: integerHelper,
    [InputType.Map]: unsupportedHelper,
    [InputType.None]: noneHelper,
    [InputType.Schema]: unsupportedHelper,
    [InputType.String]: stringHelper,
    [InputType.Struct]: unsupportedHelper,
    [InputType.Unknown]: unsupportedHelper
};

export function getHelperForInput(type: InputType): InputHelper {
    return inputHelpers[type] || unsupportedHelper;
}
