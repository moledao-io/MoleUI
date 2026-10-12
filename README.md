# Mole UI

Mole UI 是一个为 MoleDAO 产品准备的轻量级 React 组件库脚手架。它以 TypeScript 编写，React 只作为 peer dependency，样式基于原生 CSS variables，不绑定 Tailwind 或 CSS-in-JS 运行时。当前兼容 React 18 和 React 19。

## 开始使用

```bash
corepack pnpm install
corepack pnpm dev
```

项目已在 `package.json` 中锁定 pnpm 版本，不需要在 `/usr/local/bin` 创建全局命令，也不需要使用 `sudo`。

本地演示站默认运行在 `http://localhost:5173`。
组件文档位于 `http://localhost:5173/docs.html`，包含真实组件示例、设计令牌和 API 表格。

```tsx
import { Button, MoleProvider } from 'moledao';
import 'moledao/styles.css';

export function App() {
  return (
    <MoleProvider theme="system">
      <Button variant="primary">创建项目</Button>
    </MoleProvider>
  );
}
```

Button 按 Figma 规范提供 `sm`、`md`、`lg` 三种尺寸，以及 `primary`、`destructive`、`white-line`、`secondary`、`destructive-secondary`、`link` 六种外观。默认显示设计稿图标；可用 `showIcon={false}` 隐藏，或通过 `startContent` 替换。纯图标按钮使用 `iconOnly`，请同时提供 `aria-label`。

## 品牌颜色

颜色变量来自 [Moledao Brand Colour](https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=1592-1268)，定义在 `moledao/styles.css` 中，可由业务项目覆盖。

| 颜色 | CSS 变量 | 色值 |
| --- | --- | --- |
| Moledao Red | `--mole-color-brand-red` | `#F44527` |
| Silver Black | `--mole-color-silver-black` | `#25282D` |
| Dark Blue | `--mole-color-dark-blue` | `#858891` |
| Med Blue | `--mole-color-med-blue` | `#BCC1CB` |
| Light Blue | `--mole-color-light-blue` | `#DFE4EA` |
| Lightest Blue | `--mole-color-lightest-blue` | `#F2F4F8` |
| Success Green | `--mole-color-success-green` | `#13C39C` |
| Moledao Yellow | `--mole-color-yellow` | `#FFD500` |

两组品牌渐变分别使用 `--mole-gradient-light` 和 `--mole-gradient-dark`。现有 `--mole-color-brand-600` 与 Button 主色都指向 Moledao Red，覆盖 `--mole-color-brand-red` 即可同步调整。

## 工程结构

```text
apps/
  playground/       Vite 演示和手动验收环境
packages/
  ui/               可发布的 moledao 包
    src/button/      Button 实现、导出和测试
    src/spinner/     Spinner 实现、导出和测试
    src/provider/    主题和密度容器
    src/styles/      设计令牌与组件样式
```

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `corepack pnpm dev` | 启动演示站 |
| `corepack pnpm build` | 构建组件包和演示站 |
| `corepack pnpm test` | 监听模式运行组件测试 |
| `corepack pnpm check` | 依次运行 lint、类型、测试和构建检查 |
| `corepack pnpm changeset` | 为一次对外变更添加版本说明 |

## 添加组件

1. 在 `packages/ui/src/<component>` 下放置实现、测试和局部导出文件。
2. 在 `packages/ui/src/index.ts` 暴露公共 API。
3. 如需支持 `moledao/<component>` 按需导入，把入口加入 `tsup.config.ts` 和 `package.json#exports`。
4. 将样式放在 `src/styles/index.css` 的 `mole.components` layer，并沿用 `mole-` 类名前缀。
5. 运行 `corepack pnpm check`，再用 `corepack pnpm changeset` 记录版本影响。

## 设计原则

- React 和 React DOM 不打进产物，避免宿主项目出现重复实例。
- 公共 API 支持类型推导、ref 转发和原生 DOM 属性。
- 基础交互支持键盘、可见焦点、辅助技术标签和减少动态效果偏好。
- CSS variables 是主题契约；品牌色、圆角和密度都可以由业务侧覆盖。
- 先保持小而稳定，再根据真实产品需求增加组件。

## 发布

确认 npm 包名和发布权限后：

```bash
corepack pnpm changeset
corepack pnpm version-packages
corepack pnpm release
```

当前包名为 `moledao`，正式发布前请确认该 npm 包名可用。
