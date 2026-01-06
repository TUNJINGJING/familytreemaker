# 开发原则文档

## 📋 目录
- [SOLID 原则](#solid-原则)
- [其他核心原则](#其他核心原则)
- [KISS 四问](#kiss-四问)
- [健壮性要求](#健壮性要求)
- [代码审查清单](#代码审查清单)

---

## SOLID 原则

### 单一职责原则 (SRP - Single Responsibility Principle)
**要求**: 一个类/模块只负责一个功能领域

✅ **正确示例**:
```typescript
// Good: 单一职责
class UserRepository {
  findById(id: string) { /* ... */ }
  save(user: User) { /* ... */ }
}

class UserValidator {
  validate(user: User) { /* ... */ }
}
```

❌ **错误示例**:
```typescript
// Bad: 职责过多
class User {
  findById(id: string) { /* ... */ }
  save() { /* ... */ }
  validate() { /* ... */ }
  sendEmail() { /* ... */ }  // 违反 SRP
}
```

---

### 开闭原则 (OCP - Open/Closed Principle)
**要求**: 对扩展开放，对修改封闭

✅ **正确示例**:
```typescript
// Good: 通过扩展新增功能
interface PaymentStrategy {
  pay(amount: number): void;
}

class StripePayment implements PaymentStrategy {
  pay(amount: number) { /* Stripe logic */ }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number) { /* PayPal logic */ }
}
```

❌ **错误示例**:
```typescript
// Bad: 每次新增支付方式都要修改
class Payment {
  pay(amount: number, method: string) {
    if (method === 'stripe') { /* ... */ }
    else if (method === 'paypal') { /* ... */ }
    // 每次都要修改这里
  }
}
```

---

### 里氏替换原则 (LSP - Liskov Substitution Principle)
**要求**: 子类必须能替换父类

✅ **正确示例**:
```typescript
class Bird {
  fly() { /* ... */ }
}

class Sparrow extends Bird {
  fly() { /* 仍然能飞 */ }
}
```

❌ **错误示例**:
```typescript
class Penguin extends Bird {
  fly() {
    throw new Error("Penguins can't fly!") // 违反 LSP
  }
}
```

---

### 接口隔离原则 (ISP - Interface Segregation Principle)
**要求**: 接口小而专注

✅ **正确示例**:
```typescript
// Good: 小接口
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

class File implements Readable, Writable {
  read() { /* ... */ }
  write(data: string) { /* ... */ }
}

class ReadOnlyFile implements Readable {
  read() { /* ... */ }
}
```

❌ **错误示例**:
```typescript
// Bad: 臃肿接口
interface FileOperations {
  read(): string;
  write(data: string): void;
  delete(): void;
  compress(): void;
}

class ReadOnlyFile implements FileOperations {
  read() { /* ... */ }
  write() { throw new Error("Not supported") } // 被迫实现不需要的方法
  delete() { throw new Error("Not supported") }
  compress() { throw new Error("Not supported") }
}
```

---

### 依赖倒置原则 (DIP - Dependency Inversion Principle)
**要求**: 依赖抽象而非具体实现

✅ **正确示例**:
```typescript
// Good: 依赖抽象
interface Database {
  save(data: any): void;
}

class UserService {
  constructor(private db: Database) {} // 依赖抽象

  saveUser(user: User) {
    this.db.save(user);
  }
}

class PostgresDB implements Database {
  save(data: any) { /* ... */ }
}
```

❌ **错误示例**:
```typescript
// Bad: 依赖具体实现
class UserService {
  constructor(private db: PostgresDB) {} // 紧耦合

  saveUser(user: User) {
    this.db.save(user);
  }
}
```

---

## 其他核心原则

### DRY (Don't Repeat Yourself)
**要求**: 不重复实现，先 Grep 检查

**实践**:
1. 编写新功能前，先搜索是否已存在类似实现
2. 使用 `Grep` 工具搜索关键字
3. 提取共同逻辑到工具函数/组件

```bash
# 先检查是否已存在类似功能
Grep "pattern: 'user.*validate'"
```

✅ **正确示例**:
```typescript
// Good: 提取公共逻辑
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 多处使用
validateEmail(user.email);
validateEmail(contact.email);
```

❌ **错误示例**:
```typescript
// Bad: 重复代码
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) { /* ... */ }
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) { /* ... */ }
```

---

### SoC (Separation of Concerns)
**要求**: 关注点分离，各层各司其职

**架构层次**:
```
Presentation Layer (UI)
    ↓
Business Logic Layer (Services)
    ↓
Data Access Layer (Repositories)
    ↓
Database
```

✅ **正确示例**:
```typescript
// UI Layer
function UserProfile() {
  const user = useUserService().getCurrentUser();
  return <div>{user.name}</div>;
}

// Service Layer
class UserService {
  constructor(private repo: UserRepository) {}
  getCurrentUser() {
    return this.repo.findById(currentUserId);
  }
}

// Data Layer
class UserRepository {
  findById(id: string) {
    return db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}
```

---

### LoD (Law of Demeter - 迪米特法则)
**要求**: 最少知道，只与直接朋友通信

✅ **正确示例**:
```typescript
// Good: 只调用直接依赖
class Order {
  constructor(private customer: Customer) {}

  getCustomerName() {
    return this.customer.getName(); // 通过 customer 获取
  }
}
```

❌ **错误示例**:
```typescript
// Bad: 链式调用过长
order.getCustomer().getAddress().getCity().getName(); // 违反 LoD
```

---

### 组合优于继承
**要求**: 优先组合，避免继承层次过深

✅ **正确示例**:
```typescript
// Good: 使用组合
class Logger {
  log(message: string) { console.log(message); }
}

class UserService {
  constructor(private logger: Logger) {}

  createUser(user: User) {
    this.logger.log('Creating user');
    // ...
  }
}
```

❌ **错误示例**:
```typescript
// Bad: 过深继承
class Base { /* ... */ }
class Level1 extends Base { /* ... */ }
class Level2 extends Level1 { /* ... */ }
class Level3 extends Level2 { /* ... */ } // 太深了
```

---

### YAGNI (You Aren't Gonna Need It)
**要求**: 只实现当前需要的功能

✅ **正确示例**:
```typescript
// Good: 只实现当前需要的
function getUserById(id: string) {
  return db.users.findById(id);
}
```

❌ **错误示例**:
```typescript
// Bad: 过度设计
function getUserById(id: string, options?: {
  includeDeleted?: boolean,
  includeInactive?: boolean,
  includePending?: boolean,
  cache?: boolean,
  timeout?: number,
  // ... 20 个未使用的选项
}) {
  // 复杂的逻辑，但当前只用到基本查询
}
```

---

## KISS 四问

**编码前必须回答**:

### 1. 这是真问题还是臆想的？
- ❓ **提问**: 用户真的需要这个功能吗？
- ✅ **验证**: 有明确的需求文档或用户反馈
- ❌ **警惕**: "也许将来会用到"、"万一需要呢"

### 2. 有更简单的方法吗？
- ❓ **提问**: 是否存在更简单的实现方式？
- ✅ **验证**: 对比至少 2 种实现方案
- ❌ **警惕**: 第一个想到的方案就是最好的

### 3. 会破坏什么吗？
- ❓ **提问**: 这个改动会影响现有功能吗？
- ✅ **验证**: 运行测试套件，检查依赖关系
- ❌ **警惕**: "应该不会有问题"

### 4. 真的需要这个功能吗？
- ❓ **提问**: 不做这个功能会怎样？
- ✅ **验证**: 功能与核心业务直接相关
- ❌ **警惕**: "这个功能很酷"、"我想试试"

---

## 健壮性要求

**适用范围**: 关键路径（用户数据、支付、认证等）

### 幂等性
**要求**: 写操作必须幂等（多次执行结果相同）

✅ **正确示例**:
```typescript
// Good: 幂等操作
async function createUser(id: string, data: UserData) {
  // 检查是否已存在
  const existing = await db.users.findById(id);
  if (existing) return existing;

  return await db.users.create({ id, ...data });
}
```

❌ **错误示例**:
```typescript
// Bad: 非幂等
async function createUser(data: UserData) {
  return await db.users.create(data); // 重复调用会创建多个用户
}
```

---

### 限流
**要求**: 保护系统不被压垮

```typescript
// 示例: 限流中间件
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制 100 次请求
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

---

### 熔断
**要求**: 快速失败，防止级联故障

```typescript
// 示例: 熔断器
class CircuitBreaker {
  private failureCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  async call(fn: () => Promise<any>) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onFailure() {
    this.failureCount++;
    if (this.failureCount >= 5) {
      this.state = 'OPEN';
      setTimeout(() => this.state = 'HALF_OPEN', 60000);
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
}
```

---

### 重试
**要求**: 指数退避，配合幂等

```typescript
// 示例: 指数退避重试
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// 使用
const result = await retryWithBackoff(() =>
  fetch('/api/important-data')
);
```

---

## 代码审查清单

在提交代码前，检查以下项目：

### ✅ SOLID 原则
- [ ] 每个类/模块职责单一
- [ ] 新功能通过扩展而非修改实现
- [ ] 子类可以替换父类
- [ ] 接口小而专注
- [ ] 依赖抽象而非具体实现

### ✅ 其他原则
- [ ] 使用 Grep 检查是否有重复代码 (DRY)
- [ ] 各层职责清晰 (SoC)
- [ ] 避免链式调用过长 (LoD)
- [ ] 优先使用组合
- [ ] 只实现当前需要的功能 (YAGNI)

### ✅ KISS 四问
- [ ] 确认是真实需求
- [ ] 对比了更简单的方案
- [ ] 检查了破坏性影响
- [ ] 功能确实必要

### ✅ 健壮性（关键路径）
- [ ] 写操作是幂等的
- [ ] 添加了限流保护
- [ ] 实现了熔断机制
- [ ] 配置了重试策略

---

## 总结

**记住**:
1. **简单 > 复杂**: 先写能用的，再优化
2. **可读 > 炫技**: 团队能看懂比你炫技重要
3. **测试 > 文档**: 测试是最好的文档
4. **迭代 > 完美**: 完美是迭代的敌人

**金句**:
> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
> — Martin Fowler

---

**最后更新**: 2026-01-06
