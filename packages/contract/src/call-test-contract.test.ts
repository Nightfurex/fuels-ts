import { BigNumber } from '@ethersproject/bignumber';
import type { Interface, JsonFragment } from '@fuel-ts/abi-coder';
import { NativeAssetId } from '@fuel-ts/constants';
import { Provider } from '@fuel-ts/providers';
import { Wallet } from '@fuel-ts/wallet';
import { seedWallet } from '@fuel-ts/wallet/dist/test-utils';
import { readFileSync } from 'fs';
import { join } from 'path';

import abiJSON from './call-test-contract/out/debug/call-test-abi.json';
import ContractFactory from './contract-factory';

const setup = async (abi: ReadonlyArray<JsonFragment> | Interface = abiJSON) => {
  const provider = new Provider('http://127.0.0.1:4000/graphql');

  // Create wallet
  const wallet = Wallet.generate({ provider });
  await seedWallet(wallet, [{ assetId: NativeAssetId, amount: 1 }]);

  // Deploy contract
  const bytecode = readFileSync(join(__dirname, './call-test-contract/out/debug/call-test.bin'));
  const factory = new ContractFactory(bytecode, abi, wallet);
  const contract = await factory.deployContract();

  return contract;
};

describe('TestContractTwo', () => {
  it('can call a contract with structs', async () => {
    const contract = await setup();

    // Call contract
    const result = await contract.functions.boo({ a: true, b: BigNumber.from(0xdeadbeee) });

    expect(result.a).toEqual(false);
    expect(result.b.toNumber()).toEqual(BigNumber.from(0xdeadbeef).toNumber());
  });

  it('can call a function with empty arguments', async () => {
    const contract = await setup();

    let result = await contract.functions.barfoo(0);
    expect(result.toNumber()).toEqual(63);

    result = await contract.functions.foobar();
    expect(result.toNumber()).toEqual(63);
  });

  it('function with empty return output configured should resolve undefined', async () => {
    const contract = await setup([
      {
        type: 'function',
        name: 'return_void',
        outputs: [{ type: '()' }],
      },
    ]);

    const result = await contract.functions.return_void();
    expect(result).toEqual(undefined);
  });

  it('function with empty return should resolve undefined', async () => {
    const contract = await setup([
      {
        type: 'function',
        name: 'return_void',
      },
    ]);

    // Call method with no params but with no result and no value on config
    const result = await await contract.functions.return_void();
    expect(result).toEqual(undefined);
  });

  it.each([
    [
      'foobar_no_params',
      {
        values: [],
        expected: 50,
      },
    ],
    [
      'sum',
      {
        values: [10, 20],
        expected: 30,
      },
    ],
    [
      'sum_test',
      {
        values: [
          10,
          {
            a: 20,
            b: 30,
          },
        ],
        expected: 60,
      },
    ],
    [
      'sum_single',
      {
        values: [
          {
            a: 34,
            b: 34,
          },
        ],
        expected: 68,
      },
    ],
    [
      'sum_multparams',
      {
        values: [10, 10, 10, 10, 40],
        expected: 80,
      },
    ],
    [
      'add_ten',
      {
        values: [
          {
            a: 20,
          },
        ],
        expected: 30,
      },
    ],
    [
      'echo_b256',
      {
        values: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
        expected: 1,
      },
    ],
  ])(
    `Test call with multiple arguments and different types -> %s`,
    async (method, { values, expected }) => {
      const contract = await setup();

      const result = await contract.functions[method](...values);

      expect(BigNumber.from(result).toNumber()).toBe(expected);
    }
  );
});
