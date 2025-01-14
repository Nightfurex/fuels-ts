/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormatTypes, ParamType } from '@ethersproject/abi';

import type { JsonFragment } from './fragment';
import { Fragment } from './fragment';

/**
 * An override for the `format` method of Ethers' ParamType to handle Fuel/Ethereum ABI incompatibilities
 */
function formatOverride(this: ParamType, format?: string): string {
  if ((!format || format === FormatTypes.sighash) && this.type.startsWith('struct ')) {
    return `s${this.format(format)}`;
  }

  return this.format(format);
}

export default class FunctionFragment extends Fragment {
  static fromObject(value: JsonFragment): FunctionFragment {
    const { inputs = [], outputs = [] } = value;

    const params = {
      type: 'function',
      name: value.name,
      // TODO: Remove `as any`s when forc doesn't output nulls (https://github.com/FuelLabs/sway/issues/926)
      inputs: (inputs as any).map(ParamType.fromObject),
      outputs: (outputs as any).map(ParamType.fromObject),
    };

    return new FunctionFragment(params);
  }

  format(): string {
    const inputFormat = this.inputs.map((input) => formatOverride.call(input));
    return `${this.name}(${inputFormat.join(',')})`;
  }
}
