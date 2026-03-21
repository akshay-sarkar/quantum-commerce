import resolvers from '../graphQL/resolvers/resolvers';
import AddressModel from '../models/Address';
import { AuthenticationError } from 'apollo-server-express';

// ── Mock Mongoose models ──────────────────────────────────────────────────────
jest.mock('../models/Address');

// ── Helpers ───────────────────────────────────────────────────────────────────

const authCtx = { user: { userId: 'user-123', userType: 'BUYER' } };
const unauthCtx = { user: null };

const mockAddress = {
  _id: 'addr-1',
  userId: 'user-123',
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'United States',
};

// ── myAddresses ───────────────────────────────────────────────────────────────

describe('Query.myAddresses', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws AuthenticationError when not authenticated', async () => {
    await expect(
      resolvers.Query.myAddresses({}, {}, unauthCtx)
    ).rejects.toThrow(AuthenticationError);
  });

  it('queries addresses by userId', async () => {
    (AddressModel.find as jest.Mock).mockResolvedValue([mockAddress]);

    const result = await resolvers.Query.myAddresses({}, {}, authCtx);

    expect(AddressModel.find).toHaveBeenCalledWith({ userId: 'user-123' });
    expect(result).toEqual([mockAddress]);
  });

  it('returns an empty array when the user has no saved addresses', async () => {
    (AddressModel.find as jest.Mock).mockResolvedValue([]);

    const result = await resolvers.Query.myAddresses({}, {}, authCtx);
    expect(result).toEqual([]);
  });
});

// ── saveAddress ───────────────────────────────────────────────────────────────

describe('Mutation.saveAddress', () => {
  beforeEach(() => jest.clearAllMocks());

  const validInput = {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
  };

  it('throws AuthenticationError when not authenticated', async () => {
    await expect(
      resolvers.Mutation.saveAddress({}, { input: validInput }, unauthCtx)
    ).rejects.toThrow(AuthenticationError);
  });

  it('throws when street is missing', async () => {
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, street: '' } }, authCtx)
    ).rejects.toThrow('Street is required');
  });

  it('throws when city is missing', async () => {
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, city: '   ' } }, authCtx)
    ).rejects.toThrow('City is required');
  });

  it('throws when state is missing', async () => {
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, state: '' } }, authCtx)
    ).rejects.toThrow('State is required');
  });

  it('throws when zip is missing', async () => {
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, zip: '' } }, authCtx)
    ).rejects.toThrow('ZIP code is required');
  });

  it('throws when country is missing', async () => {
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, country: '' } }, authCtx)
    ).rejects.toThrow('Country is required');
  });

  it('throws when US zip is not exactly 5 digits', async () => {
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, zip: '1234', country: 'US' } }, authCtx)
    ).rejects.toThrow('US ZIP code must be exactly 5 digits');

    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, zip: '123456', country: 'US' } }, authCtx)
    ).rejects.toThrow('US ZIP code must be exactly 5 digits');
  });

  it('accepts a valid US 5-digit zip', async () => {
    (AddressModel.create as jest.Mock).mockResolvedValue({ ...mockAddress, country: 'US', zip: '10001' });
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, zip: '10001', country: 'US' } }, authCtx)
    ).resolves.toBeDefined();
  });

  it('throws when Canadian postal code format is invalid', async () => {
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, zip: '12345', country: 'CA' } }, authCtx)
    ).rejects.toThrow('Canadian postal code must be in the format A1A 1A1');
  });

  it('accepts a valid Canadian postal code with and without space', async () => {
    (AddressModel.create as jest.Mock).mockResolvedValue({ ...mockAddress, country: 'CA', zip: 'M5V 3A8' });
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, zip: 'M5V 3A8', country: 'CA' } }, authCtx)
    ).resolves.toBeDefined();

    (AddressModel.create as jest.Mock).mockResolvedValue({ ...mockAddress, country: 'CA', zip: 'M5V3A8' });
    await expect(
      resolvers.Mutation.saveAddress({}, { input: { ...validInput, zip: 'M5V3A8', country: 'CA' } }, authCtx)
    ).resolves.toBeDefined();
  });

  it('creates address with userId and trimmed fields', async () => {
    (AddressModel.create as jest.Mock).mockResolvedValue({ ...mockAddress, _id: 'addr-new' });

    const result = await resolvers.Mutation.saveAddress({}, { input: validInput }, authCtx);

    expect(AddressModel.create).toHaveBeenCalledWith({
      userId: 'user-123',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    });
    expect(result).toMatchObject({ street: '123 Main St', city: 'New York' });
  });

  it('trims whitespace from all input fields', async () => {
    (AddressModel.create as jest.Mock).mockResolvedValue(mockAddress);

    await resolvers.Mutation.saveAddress(
      {},
      {
        input: {
          street: '  123 Main St  ',
          city: '  New York  ',
          state: '  NY  ',
          zip: '  10001  ',
          country: '  United States  ',
        },
      },
      authCtx
    );

    expect(AddressModel.create).toHaveBeenCalledWith({
      userId: 'user-123',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    });
  });
});

// ── deleteAddress ─────────────────────────────────────────────────────────────

describe('Mutation.deleteAddress', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws AuthenticationError when not authenticated', async () => {
    await expect(
      resolvers.Mutation.deleteAddress({}, { id: 'addr-1' }, unauthCtx)
    ).rejects.toThrow(AuthenticationError);
  });

  it('throws when address does not belong to the user (ownership via userId)', async () => {
    (AddressModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

    await expect(
      resolvers.Mutation.deleteAddress({}, { id: 'addr-1' }, authCtx)
    ).rejects.toThrow('Address not found or does not belong to you');

    expect(AddressModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: 'addr-1',
      userId: 'user-123',
    });
  });

  it('deletes address by _id and userId atomically', async () => {
    (AddressModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockAddress);

    const result = await resolvers.Mutation.deleteAddress({}, { id: 'addr-1' }, authCtx);

    expect(AddressModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: 'addr-1',
      userId: 'user-123',
    });
    expect(result).toBe(true);
  });
});

// ── Field resolvers ───────────────────────────────────────────────────────────

describe('Address.id field resolver', () => {
  it('returns _id as id', () => {
    const parent = { _id: 'mongo-id-abc' };
    expect(resolvers.Address.id(parent)).toBe('mongo-id-abc');
  });
});
