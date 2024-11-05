### 数据迁移流程

1. 生成迁移文件

```bash
pnpm build;
pnpm run migration:generate
```

2. 执行迁移

```bash
pnpm run migration:run
```

3. 回滚迁移

```bash
pnpm run migration:revert
```
