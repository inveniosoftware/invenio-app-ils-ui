import { serializer } from './serializer';

const stringDate = '2018-01-01T11:05:00+01:00';

describe('Document object serialization', () => {
  it('should serialize dates', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      metadata: {},
    });

    expect(serialized).toEqual({
      id: 123,
      created: stringDate,
      updated: stringDate,
    });
  });

  it('should serialize all fields', () => {
    const serialized = serializer.fromJSON({
      id: 123,
      updated: stringDate,
      created: stringDate,
      links: 'test',
      metadata: {
        pid: '123',
        authors: ['A', 'B'],
        title: 'p',
      },
    });

    expect(serialized).toEqual({
      pid: '123',
      id: 123,
      updated: stringDate,
      created: stringDate,
      links: 'test',
      metadata: {
        pid: '123',
        authors: ['A', 'B'],
        title: 'p',
      },
    });
  });
});
