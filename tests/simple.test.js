// 一个非常简单的测试文件，确保 Jest 能够正常运行

describe('基本测试', () => {
  it('应该能够通过简单的断言', () => {
    expect(1 + 1).toBe(2);
  });

  it('应该能够处理异步操作', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
