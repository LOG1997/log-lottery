// test axios request
import Request from '@/api/request';
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import axios from 'axios';

const fn = vi.fn();
const mockRes = {
  data: {
    code: 200,
    success: true,
    message: 'success',
    data: {
      name: 'test',
      age: 18,
    },
  },
};
fn(mockRes);
fn.mock.calls[0] === [mockRes];

describe('Request', () => {
  it('should return data when request success', async () => {
    const request = new Request();
    const res = await request({
      url: '/test',
      method: 'GET',
    });
    expect(res).toEqual(mockRes.data);
  });
});
