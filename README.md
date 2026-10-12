# Mole UI

Mole UI 是一个为 MoleDAO 产品准备的轻量级 React 组件库脚手架。它以 TypeScript 编写，React 只作为 peer dependency，样式基于原生 CSS variables，不绑定 Tailwind 或 CSS-in-JS 运行时。当前兼容 React 18 和 React 19。

## 开始使用

```bash
corepack pnpm install
corepack pnpm dev
```

项目已在 `package.json` 中锁定 pnpm 版本，不需要在 `/usr/local/bin` 创建全局命令，也不需要使用 `sudo`。

本地演示站默认运行在 `http://localhost:5173`。
组件文档位于 `http://localhost:5173/docs.html`，包含真实组件示例、设计令牌、Typography 文字规范和 API 表格。

Storybook 为组件提供独立预览、状态列表和 Controls。另开终端运行 `corepack pnpm storybook`，然后打开 `http://127.0.0.1:6006`；文档页的 Storybook 区域也提供了各组件的直达链接。运行 `corepack pnpm build:storybook` 可生成 `apps/playground/storybook-static/` 静态站点。

```tsx
import { Button, Input, MoleProvider } from 'moledao';
import 'moledao/styles.css';

export function App() {
  return (
    <MoleProvider theme="system">
      <Button variant="primary">创建项目</Button>
      <Input label="项目名称" placeholder="输入名称" clearable />
    </MoleProvider>
  );
}
```

Button 按 Figma 规范提供 `sm`、`md`、`lg` 三种尺寸，以及 `primary`、`destructive`、`white-line`、`secondary`、`destructive-secondary`、`link` 六种外观。默认显示设计稿图标；可用 `showIcon={false}` 隐藏，或通过 `startContent` 替换。纯图标按钮使用 `iconOnly`，请同时提供 `aria-label`。

Input 参考 [Figma Text Field Input](https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=1602-52042)，提供 `md`、`lg` 尺寸、标题、辅助文字、前后内容、清空与密码显隐。`status="success"` / `status="warning"` 用于语义反馈，禁用和只读直接使用原生属性。受控值建议配合 `onValueChange`，以便清空按钮同步更新状态。也支持 `import { Input } from 'moledao/input'`。

Toggle 参考 [Figma Toggle](https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=5334-1256)，提供受控 / 非受控开关、可选 Yes / No 文字和禁用状态。必须提供稳定的 `label`，组件以原生按钮和 `role="switch"` 呈现；支持 `import { Toggle } from 'moledao/toggle'`。

Tooltip 参考 [Figma Tooltip](https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=3456-19587)，支持四向位置、上 / 下方的对齐方式，以及悬停、键盘聚焦和 Escape 交互。子元素应是一个可聚焦的 React 元素；支持 `import { Tooltip } from 'moledao/tooltip'`。

Icon 收录 [Figma Icon](https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=3437-19426) 中的 48 个可调描边图标，默认 20px，支持 16 / 24px 与继承文字色。描边默认随尺寸缩放，也可通过 `strokeMode="fixed"`、`strokeWidth` 或 `--mole-icon-stroke-width` 固定粗细。可从 `moledao` 或 `moledao/icon` 导入 `Icon` 和 `ICON_NAMES`。单独传达信息时请提供 `aria-label`。

AnimatedIcon 是一组在两种状态之间带动画切换的图标，共用同一个组件：`<AnimatedIcon name="lock" active={locked} />`。`name` 选择图标（`ANIMATED_ICON_NAMES` 列出全部），`active` 控制状态；尺寸同 Icon（`sm` / `md` / `lg` 或任意像素数字），颜色继承 `currentColor`；`speed` 按倍数调速（默认 1；`2` 快一倍，`0.5` 慢一倍，`0` 跳过动画），`duration` 覆盖图标自身的基准时长，实际时长 = `duration / speed`；`sound` / `soundVolume` 控制图标自带的音效，`onAnimationComplete` 在动画结束后回调。减弱动效（系统设置或 `MoleProvider motion="reduced"`）时直接切换到终态。单独传达状态时请提供 `aria-label`；支持 `import { AnimatedIcon } from 'moledao/animated-icon'`。

目前收录的动画图标：

| name | 状态（false / true） | 说明 |
| --- | --- | --- |
| `lock` | 未锁定 / 已锁定 | 参考 [Figma 锁动画](https://www.figma.com/design/9UrUKdruApKIBYprtHyXir/Moledao.io-Web-Compontes?node-id=61-1838)：锁梁抬起 → 绕左侧锁脚翻转 180° → 落下，上锁时带弹簧回弹；解锁时播放内联的 885 字节 Opus/WebM 开锁音效（Chrome、Edge、Firefox、Safari 17+，不支持的浏览器保持静音，CSP 需允许 `media-src data:`）。`<LockIcon locked />` 是它的简写。 |

新增动画图标：在 `packages/ui/src/animated-icon/icons/<name>/` 用 `defineAnimatedIcon` 描述静止姿态、动画曲线、SVG 和音效，再在 `registry.ts` 注册即可，速度、音效、减弱动效与中途反转由 AnimatedIcon 统一处理。

Typography 参考 [Figma Typography](https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=1602-50920)：正文以 14px 为基准，备注和 Caption 为 12px，往上的字号按 16、18、20、22、24、26、28px 逐级递增。提供 H1–H6、三级正文和 Caption，以及默认、次要、成功、警告、禁用、标记、链接与删除状态。使用 `import { Typography } from 'moledao'` 或 `moledao/typography`。`moledao/styles.css` 同时加载拉丁字符的 Poppins 和中文的 OPPO Sans；Mole UI 网页与文档使用同一字体栈。字体文件不适用组件代码的 MIT 许可，见 [OPPO Sans 许可](packages/ui/OPPO-SANS-LICENSE.txt) 和 [Poppins 许可](packages/ui/POPPINS-LICENSE.txt)。

## 品牌颜色

颜色变量来自 [新版 Moledao Brand Colour](https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=10957-207)，定义在 `moledao/styles.css` 中，可由业务项目覆盖。

| 分类 | 颜色 | CSS 变量 | 色值 |
| --- | --- | --- | --- |
| 主色 | Moledao Red | `--mole-color-brand-red` | `#F44527` |
| 主色 | Silver Black | `--mole-color-silver-black` | `#25282D` |
| 辅助色 | Dark Blue | `--mole-color-dark-blue` | `#858891` |
| 辅助色 | Med Blue | `--mole-color-med-blue` | `#BCC1CB` |
| 辅助色 | Light Blue | `--mole-color-light-blue` | `#DFE4EA` |
| 辅助色 | Lightest Blue | `--mole-color-lightest-blue` | `#F2F4F8` |
| 强调色 | Moledao Yellow | `--mole-color-yellow` | `#FFC94A` |
| 强调色 | Moledao Green | `--mole-color-green` | `#43C59E` |
| 强调色 | Moledao Blue | `--mole-color-blue` | `#4285F4` |
| 强调色 | Moledao Purple | `--mole-color-purple` | `#8B6FE8` |
| 强调色 | Moledao Pink | `--mole-color-pink` | `#F06C9B` |

旧版 `--mole-color-success-green` 作为 `--mole-color-green` 的兼容别名保留，两组渐变变量 `--mole-gradient-light` 和 `--mole-gradient-dark` 也继续可用，但不属于新版基础色板。现有 `--mole-color-brand-600` 与 Button 主色都指向 Moledao Red，覆盖 `--mole-color-brand-red` 即可同步调整。Input 等组件专属的状态色遵循各自设计规范，不随品牌强调色替换。

## 工程结构

```text
apps/
  playground/       Vite 演示和手动验收环境
packages/
  ui/               可发布的 moledao 包
    src/button/      Button 实现、导出和测试
    src/input/       Input 实现、导出和测试
    src/toggle/      Toggle 实现、导出和测试
    src/tooltip/     Tooltip 实现、导出和测试
    src/icon/        Icon 实现、导出和测试
    src/animated-icon/ AnimatedIcon 动画图标（共用引擎、图标注册表、各图标几何与音效）和测试
    src/spinner/     Spinner 实现、导出和测试
    src/typography/  Typography 实现、导出和测试
    src/provider/    主题和密度容器
    src/runtime/     浏览器能力、系统偏好和轻量任务调度
    src/deferred-render/  进入视口前延迟呈现复杂内容
    src/styles/      设计令牌与组件样式
```

## AI / Agent 使用

仓库根目录的 [`llms.txt`](llms.txt) 是给 AI 的快速入口；[`docs/ai/component-manifest.json`](docs/ai/component-manifest.json) 是可直接解析的完整组件清单，记录公共导入路径、属性、默认值、枚举、无障碍约束、图标名称、设计变量和正确示例。演示站会分别在 `/llms.txt` 与 `/component-manifest.json` 暴露这两份资料。AI 应以 TypeScript 源码和包导出为最终事实来源，不应猜测未记录的组件或属性。

## Runtime Engine

Mole UI 的浏览器兼容、运行时能力检测、性能预算和分阶段实施方案见 [Mole Runtime Engine 设计方案](docs/mole-runtime-engine.md)。

```tsx
import { createMoleRuntime, DeferredRender, MoleProvider } from 'moledao';

const runtime = createMoleRuntime({ compatibility: 'auto' });

export function Root() {
  return (
    <MoleProvider locale="zh-CN" motion="system" runtime={runtime} theme="system">
      <DeferredRender fallback={<div>正在准备内容…</div>} minHeight={240}>
        <ExpensiveSection />
      </DeferredRender>
    </MoleProvider>
  );
}
```

`DeferredRender` 默认在内容距离视口约 200px 时开始渲染。浏览器缺少 `IntersectionObserver` 时会在下一帧直接呈现内容，不会阻断核心操作。运行时也可以调度视觉或后台任务：

```ts
const cancel = runtime.schedule('background', preloadNextSection, { timeout: 300 });
// 页面离开时可取消尚未执行的任务。
cancel();
```

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `corepack pnpm dev` | 启动演示站 |
| `corepack pnpm storybook` | 启动 Storybook 组件预览 |
| `corepack pnpm build:storybook` | 构建 Storybook 静态站点 |
| `corepack pnpm build` | 构建组件包和演示站 |
| `corepack pnpm docs:validate` | 校验 AI 组件清单与公共导出、图标名称是否同步 |
| `corepack pnpm test` | 监听模式运行组件测试 |
| `corepack pnpm check` | 依次运行 lint、类型、测试和构建检查 |
| `corepack pnpm changeset` | 为一次对外变更添加版本说明 |

## 添加组件

1. 在 `packages/ui/src/<component>` 下放置实现、测试和局部导出文件。
2. 在 `packages/ui/src/index.ts` 暴露公共 API。
3. 如需支持 `moledao/<component>` 按需导入，把入口加入 `tsup.config.ts` 和 `package.json#exports`。
4. 将样式放在 `src/styles/index.css` 的 `mole.components` layer，并沿用 `mole-` 类名前缀。
5. 同步更新 `docs/ai/component-manifest.json`；校验脚本会检查公共组件、包信息和图标名称是否一致。
6. 运行 `corepack pnpm check`，再用 `corepack pnpm changeset` 记录版本影响。

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
