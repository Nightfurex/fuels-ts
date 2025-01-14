import { BigNumber } from '@ethersproject/bignumber';
import { arrayify, hexlify } from '@ethersproject/bytes';

import type { Output } from './output';
import { OutputCoder, OutputType } from './output';

const B256 = '0xd5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b';

describe('OutputCoder', () => {
  it('Can encode Coin', () => {
    const output: Output = {
      type: OutputType.Coin,
      to: B256,
      amount: BigNumber.from(0),
      assetId: B256,
    };

    const encoded = hexlify(new OutputCoder('output').encode(output));

    expect(encoded).toEqual(
      '0x0000000000000000d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b0000000000000000d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b'
    );

    const [decoded, offset] = new OutputCoder('output').decode(arrayify(encoded), 0);

    expect(offset).toEqual((encoded.length - 2) / 2);
    expect(decoded).toEqual(output);
  });

  it('Can encode Contract', () => {
    const output: Output = {
      type: OutputType.Contract,
      inputIndex: BigNumber.from(0),
      balanceRoot: B256,
      stateRoot: B256,
    };

    const encoded = hexlify(new OutputCoder('output').encode(output));

    expect(encoded).toEqual(
      '0x00000000000000010000000000000000d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930bd5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b'
    );

    const [decoded, offset] = new OutputCoder('output').decode(arrayify(encoded), 0);

    expect(offset).toEqual((encoded.length - 2) / 2);
    expect(decoded).toEqual(output);
  });

  it('Can encode Withdrawal', () => {
    const output: Output = {
      type: OutputType.Withdrawal,
      to: B256,
      amount: BigNumber.from(0),
      assetId: B256,
    };

    const encoded = hexlify(new OutputCoder('output').encode(output));

    expect(encoded).toEqual(
      '0x0000000000000002d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b0000000000000000d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b'
    );

    const [decoded, offset] = new OutputCoder('output').decode(arrayify(encoded), 0);

    expect(offset).toEqual((encoded.length - 2) / 2);
    expect(decoded).toEqual(output);
  });

  it('Can encode Change', () => {
    const output: Output = {
      type: OutputType.Change,
      to: B256,
      amount: BigNumber.from(0),
      assetId: B256,
    };

    const encoded = hexlify(new OutputCoder('output').encode(output));

    expect(encoded).toEqual(
      '0x0000000000000003d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b0000000000000000d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b'
    );

    const [decoded, offset] = new OutputCoder('output').decode(arrayify(encoded), 0);

    expect(offset).toEqual((encoded.length - 2) / 2);
    expect(decoded).toEqual(output);
  });

  it('Can encode Variable', () => {
    const output: Output = {
      type: OutputType.Variable,
      to: B256,
      amount: BigNumber.from(0),
      assetId: B256,
    };

    const encoded = hexlify(new OutputCoder('output').encode(output));

    expect(encoded).toEqual(
      '0x0000000000000004d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b0000000000000000d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b'
    );

    const [decoded, offset] = new OutputCoder('output').decode(arrayify(encoded), 0);

    expect(offset).toEqual((encoded.length - 2) / 2);
    expect(decoded).toEqual(output);
  });

  it('Can encode ContractCreated', () => {
    const output: Output = {
      type: OutputType.ContractCreated,
      contractId: B256,
      stateRoot: B256,
    };

    const encoded = hexlify(new OutputCoder('output').encode(output));

    expect(encoded).toEqual(
      '0x0000000000000005d5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930bd5579c46dfcc7f18207013e65b44e4cb4e2c2298f4ac457ba8f82743f31e930b'
    );

    const [decoded, offset] = new OutputCoder('output').decode(arrayify(encoded), 0);

    expect(offset).toEqual((encoded.length - 2) / 2);
    expect(decoded).toEqual(output);
  });
});
