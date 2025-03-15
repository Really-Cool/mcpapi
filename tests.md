# MCPAPI 测试文档

## 测试设计概述

本项目采用了多层次的测试策略，确保代码的可靠性和功能的正确性。我们的测试架构包括：

1. **单元测试**：测试独立组件和钩子函数
2. **集成测试**：测试组件之间的交互
3. **端到端测试**：测试完整的用户流程

### 测试技术栈

- **Jest**：JavaScript 测试框架
- **React Testing Library**：React 组件测试工具
- **Mock Service Worker**：API 请求模拟

## 测试结构

```
mcpapi/
├── app/
│   └── __tests__/           # 页面组件测试
├── components/
│   └── mcpapi/
│       └── __tests__/       # UI 组件测试
├── hooks/
│   └── __tests__/           # 自定义钩子测试
├── e2e/
│   └── __tests__/           # 端到端测试
├── jest.config.js           # Jest 配置
├── jest.setup.js            # Jest 设置和模拟
└── babel.config.js          # Babel 配置
```

## 单元测试设计

### 组件测试

组件测试主要关注组件的渲染和交互逻辑。我们使用 React Testing Library 来测试组件，因为它鼓励良好的测试实践，如测试用户行为而非实现细节。

**示例：SearchResults 组件测试**

```typescript
// 测试组件在不同状态下的渲染
it('应该在加载状态下显示加载指示器', () => {
  const { getByTestId } = render(<SearchResults isLoading={true} results={[]} />);
  expect(getByTestId('loading-indicator')).toBeInTheDocument();
});

// 测试组件交互
it('应该在点击重置按钮时调用 onReset', () => {
  const onReset = jest.fn();
  const { getByTestId } = render(
    <SearchResults results={[]} onReset={onReset} />
  );
  fireEvent.click(getByTestId('reset-button'));
  expect(onReset).toHaveBeenCalled();
});
```

### 钩子测试

自定义钩子测试使用 `renderHook` 函数来模拟钩子的使用环境。

**示例：useMCPSearch 钩子测试**

```typescript
it('应该执行搜索并更新状态', async () => {
  const { result } = renderHook(() => useMCPSearch());
  
  await act(async () => {
    await result.current.search('测试查询');
  });
  
  expect(ApiClient.search).toHaveBeenCalledWith('测试查询', 1, 10);
  expect(result.current.query).toBe('测试查询');
  expect(result.current.searchState.status).toBe('success');
});
```

## 集成测试设计

集成测试关注多个组件或功能之间的交互。我们模拟了 API 响应，以确保组件在不同数据情况下的正确行为。

**示例：Home 页面集成测试**

```typescript
it('应该在搜索后显示结果', async () => {
  // 设置 API 模拟
  (ApiClient.search as jest.Mock).mockResolvedValue({
    results: mockResults,
    recommendations: mockRecommendations,
    hasMore: true
  });
  
  const { getByTestId, getByText } = render(<Home />);
  
  // 执行搜索
  const searchInput = getByTestId('search-input');
  fireEvent.change(searchInput, { target: { value: '测试查询' } });
  fireEvent.keyDown(searchInput, { key: 'Enter' });
  
  // 验证结果显示
  await waitFor(() => {
    expect(getByTestId('search-results')).toBeInTheDocument();
  });
});
```

## 端到端测试设计

端到端测试模拟真实用户场景，测试完整的功能流程。

**示例：无限滚动测试**

```typescript
it('应该在点击加载更多按钮时加载额外结果', async () => {
  // 设置初始和额外结果的模拟
  const { getByTestId, rerender } = render(<Home />);
  
  // 验证初始状态
  expect(getByTestId('load-more-button')).toBeInTheDocument();
  
  // 点击加载更多
  getByTestId('load-more-button').click();
  
  // 验证加载更多函数被调用
  expect(mockUseMCPSearch.loadMoreResults).toHaveBeenCalled();
});
```

## 模拟策略

### API 请求模拟

我们使用 Jest 的模拟功能来模拟 API 客户端：

```typescript
jest.mock('@/lib/services/api-client', () => ({
  ApiClient: {
    search: jest.fn(),
    getRecommendations: jest.fn(),
    loadMoreResults: jest.fn()
  }
}));
```

### 浏览器 API 模拟

为了测试依赖于浏览器 API 的功能（如 IntersectionObserver），我们在 `jest.setup.js` 中创建了模拟实现：

```javascript
// IntersectionObserver 模拟
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.mockIsIntersecting = false;
  }
  
  // 模拟交叉状态变化
  simulateIntersection(isIntersecting) {
    this.elements.forEach(element => {
      this.callback([
        {
          isIntersecting,
          target: element,
          intersectionRatio: isIntersecting ? 1 : 0,
        }
      ]);
    });
  }
  
  // 其他必要方法...
}

global.IntersectionObserver = MockIntersectionObserver;
```

## 测试维护

### 最佳实践

1. **保持测试独立**：每个测试应该独立运行，不依赖于其他测试的状态
2. **使用 beforeEach 和 afterEach**：在每次测试前后重置模拟和状态
3. **模拟外部依赖**：始终模拟外部 API 和浏览器功能
4. **测试用户行为**：关注用户如何与应用交互，而非内部实现细节
5. **使用数据测试 ID**：使用 `data-testid` 属性来选择元素，避免依赖于 CSS 类或 DOM 结构

### 测试覆盖率

使用以下命令运行测试覆盖率报告：

```bash
npm test -- --coverage
```

覆盖率报告会显示代码的测试覆盖情况，包括：

- **语句覆盖率**：执行的代码语句百分比
- **分支覆盖率**：执行的代码分支百分比（如 if/else 语句）
- **函数覆盖率**：调用的函数百分比
- **行覆盖率**：执行的代码行百分比

### 提高测试覆盖率的策略

1. 优先测试核心业务逻辑
2. 识别未测试的代码路径，特别是错误处理路径
3. 为每个组件添加至少一个快照测试
4. 为复杂逻辑添加边界条件测试

## 测试验证

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- components/mcpapi/__tests__/search-results.test.tsx

# 监视模式（在文件更改时自动运行测试）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 调试测试

当测试失败时，可以使用以下技术进行调试：

1. **使用 console.log**：在测试或组件中添加日志
2. **检查测试输出**：Jest 提供详细的错误信息
3. **使用 screen.debug()**：打印当前 DOM 状态
4. **使用 Jest 的 --verbose 标志**：显示更多测试细节

```bash
npm test -- --verbose
```

### 常见问题及解决方案

1. **异步测试超时**
   - 确保使用 `await` 等待异步操作完成
   - 使用 `waitFor` 等待条件满足

2. **模拟不起作用**
   - 确保模拟在正确的位置（通常在 describe 块外）
   - 使用 `jest.clearAllMocks()` 在测试之间重置模拟

3. **测试环境与生产环境不一致**
   - 在 `jest.setup.js` 中添加必要的浏览器 API 模拟
   - 确保正确模拟 Next.js 特定功能（如路由）

## 持续集成

在 CI/CD 流程中，测试应该自动运行，以确保代码更改不会破坏现有功能：

1. 在提交前运行测试
2. 在 PR 合并前验证测试通过
3. 定期运行覆盖率报告，确保测试覆盖率不会下降

## 结论

良好的测试策略是保证代码质量和可维护性的关键。通过遵循本文档中的实践，我们可以确保 MCPAPI 项目的稳定性和可靠性。随着项目的发展，测试策略也应该不断调整和完善，以适应新的需求和挑战。
