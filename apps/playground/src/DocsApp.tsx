import { useEffect, useState, type ReactNode } from 'react';
import { Button, ICON_NAMES, Icon, Input, LockIcon, MoleProvider, Spinner, Toggle, Tooltip, Typography } from 'moledao';

type Theme = 'light' | 'dark';

const navGroups = [
  { title: '开始', items: [{ id: 'overview', label: '概览' }, { id: 'installation', label: '快速上手' }] },
  { title: '基础', items: [{ id: 'tokens', label: '设计令牌' }, { id: 'typography', label: 'Typography 文字' }] },
  { title: '组件', items: [{ id: 'button', label: 'Button 按钮' }, { id: 'input', label: 'Input 输入框' }, { id: 'toggle', label: 'Toggle 开关' }, { id: 'tooltip', label: 'Tooltip 提示' }, { id: 'icon', label: 'Icon 图标' }, { id: 'lock-icon', label: 'LockIcon 锁动画' }, { id: 'spinner', label: 'Spinner 加载' }, { id: 'provider', label: 'MoleProvider' }] },
  { title: '开发', items: [{ id: 'storybook', label: 'Storybook' }, { id: 'contributing', label: '扩展组件' }] },
] as const;

const colorGroups = [
  { title: '主色 Primary', colors: [
    { name: 'Moledao Red', value: '#F44527', token: '--mole-color-brand-red', className: 'red' },
    { name: 'Silver Black', value: '#25282D', token: '--mole-color-silver-black', className: 'black' },
  ] },
  { title: '辅助色 Secondary', colors: [
    { name: 'Dark Blue', value: '#858891', token: '--mole-color-dark-blue', className: 'dark-blue' },
    { name: 'Med Blue', value: '#BCC1CB', token: '--mole-color-med-blue', className: 'med-blue' },
    { name: 'Light Blue', value: '#DFE4EA', token: '--mole-color-light-blue', className: 'light-blue' },
    { name: 'Lightest Blue', value: '#F2F4F8', token: '--mole-color-lightest-blue', className: 'lightest-blue' },
  ] },
  { title: '强调色 Accent', colors: [
    { name: 'Moledao Yellow', value: '#FFC94A', token: '--mole-color-yellow', className: 'yellow' },
    { name: 'Moledao Green', value: '#43C59E', token: '--mole-color-green', className: 'green' },
    { name: 'Moledao Blue', value: '#4285F4', token: '--mole-color-blue', className: 'blue' },
    { name: 'Moledao Purple', value: '#8B6FE8', token: '--mole-color-purple', className: 'purple' },
    { name: 'Moledao Pink', value: '#F06C9B', token: '--mole-color-pink', className: 'pink' },
  ] },
] as const;

const typographyLevels = [
  { level: 'h1', label: 'H1', spec: '28px / Bold' },
  { level: 'h2', label: 'H2', spec: '24px / Bold' },
  { level: 'h3', label: 'H3', spec: '18px / Medium' },
  { level: 'h4', label: 'H4', spec: '16px / Medium' },
  { level: 'body-large', label: 'Body Large', spec: '16px / Regular' },
  { level: 'body', label: 'Body Regular', spec: '14px / Regular' },
  { level: 'body-small', label: 'Body Small', spec: '12px / Regular' },
  { level: 'caption', label: 'Caption', spec: '10px / Regular' },
] as const;

const typographyStates = [
  { state: 'default', label: '默认' },
  { state: 'secondary', label: '次要' },
  { state: 'success', label: '成功' },
  { state: 'warning', label: '警告' },
  { state: 'disabled', label: '禁用' },
  { state: 'mark', label: '标记' },
  { state: 'link', label: '链接' },
  { state: 'delete', label: '删除' },
] as const;

const iconGroups = [
  { title: 'Social', names: ICON_NAMES.filter((name) => name.startsWith('social-')) },
  { title: 'Operation', names: ICON_NAMES.filter((name) => name.startsWith('operation-')) },
  { title: 'Dashboard / Admin', names: ICON_NAMES.filter((name) => name.startsWith('dashboard-') || name.startsWith('admin-')) },
  { title: 'Profile', names: ICON_NAMES.filter((name) => name.startsWith('profile-')) },
  { title: 'Forms', names: ICON_NAMES.filter((name) => name.startsWith('forms-')) },
  { title: 'Utility', names: ICON_NAMES.filter((name) => name.startsWith('utility-')) },
] as const;

const installCode = `# 在当前仓库启动演示站与文档
corepack pnpm install
corepack pnpm dev`;

const storybookCode = `# 在仓库根目录另开一个终端
corepack pnpm storybook

# 构建可部署的静态 Storybook
corepack pnpm build:storybook`;

const storybookOrigin = 'http://127.0.0.1:6006';

const buttonCode = `import { Button } from 'moledao';
import 'moledao/styles.css';

<Button variant="primary" size="sm" onClick={() => console.log('clicked')}>
  主要
</Button>`;

const lockIconCode = `import { LockIcon } from 'moledao';
import 'moledao/styles.css';

const [locked, setLocked] = useState(true);

<button onClick={() => setLocked((value) => !value)} type="button">
  <LockIcon locked={locked} size="lg" speed={1} aria-label={locked ? '已锁定' : '未锁定'} />
</button>`;

const spinnerCode = `import { Spinner } from 'moledao';

<Spinner size="md" tone="brand" label="正在加载内容" />`;

const inputCode = `import { Input } from 'moledao';
import 'moledao/styles.css';

<Input
  label="账户名称"
  placeholder="Focus in"
  clearable
  value={name}
  onValueChange={setName}
/>`;

const typographyCode = `import { Typography } from 'moledao';
import 'moledao/styles.css';

<Typography level="h1">Moledao 设计系统</Typography>
<Typography level="body" state="secondary">中英文字体自动匹配</Typography>
<Typography level="body" state="link" href="/docs.html">查看文档</Typography>`;

const toggleCode = `import { Toggle } from 'moledao';
import 'moledao/styles.css';

<Toggle label="接收通知" defaultChecked showText onCheckedChange={setEnabled} />`;

const tooltipCode = `import { Tooltip, Button } from 'moledao';
import 'moledao/styles.css';

<Tooltip content="复制链接" placement="top" align="center">
  <Button>复制</Button>
</Tooltip>`;

const iconCode = `import { Icon } from 'moledao';
import 'moledao/styles.css';

<Icon name="utility-search" aria-label="搜索" />
<Icon name="social-discord" size="lg" />`;

const providerCode = `import { MoleProvider, Button } from 'moledao';
import 'moledao/styles.css';

<MoleProvider theme="system" density="comfortable">
  <Button>开始探索</Button>
</MoleProvider>`;

function CodeBlock({ code, label = '代码示例' }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="docs-code">
      <div className="docs-code__bar"><span>{label}</span><button onClick={copy} type="button">{copied ? '已复制' : '复制'}</button></div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function Demo({
  children,
  code,
  overflowVisible = false,
}: {
  children: ReactNode;
  code: string;
  overflowVisible?: boolean;
}) {
  return (
    <div className={overflowVisible ? 'docs-demo docs-demo--overflow-visible' : 'docs-demo'}>
      <div className="docs-demo__stage">{children}</div>
      <details className="docs-demo__details">
        <summary>查看代码</summary>
        <CodeBlock code={code} />
      </details>
    </div>
  );
}

function NavLinks({ activeId, onNavigate }: { activeId: string; onNavigate?: () => void }) {
  return navGroups.map((group) => (
    <div className="docs-nav__group" key={group.title}>
      <span className="docs-nav__title">{group.title}</span>
      {group.items.map((item) => (
        <a
          aria-current={activeId === item.id ? 'location' : undefined}
          href={`#${item.id}`}
          key={item.id}
          onClick={onNavigate}
        >
          {item.label}
        </a>
      ))}
    </div>
  ));
}

export function DocsApp() {
  const [theme, setTheme] = useState<Theme>('light');
  const [activeId, setActiveId] = useState('overview');
  const [clickCount, setClickCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lockLocked, setLockLocked] = useState(true);
  const [lockSpeed, setLockSpeed] = useState(1);
  const [lockSound, setLockSound] = useState(true);

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) {
      window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    }

    const sections = navGroups.flatMap((group) => group.items.map((item) => item.id))
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const supportsIntersectionObserver = typeof Reflect.get(window, 'IntersectionObserver') === 'function';
    if (!supportsIntersectionObserver) {
      let frame = 0;
      const updateActiveSection = () => {
        if (frame) window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => {
          const passedSections = sections
            .filter((section) => section.getBoundingClientRect().top <= 160);
          const activeSection = passedSections[passedSections.length - 1] ?? sections[0];
          if (activeSection) setActiveId(activeSection.id);
        });
      };

      updateActiveSection();
      window.addEventListener('scroll', updateActiveSection, { passive: true });
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener('scroll', updateActiveSection);
      };
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActiveId(visible.target.id);
    }, { rootMargin: '-110px 0px -65% 0px' });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <MoleProvider className="docs-shell" theme={theme}>
      <header className="docs-header">
        <div className="docs-header__inner">
          <a className="docs-brand" href="./index.html" aria-label="返回 Mole UI 首页">
            <img src="/brand/moledao-logo.png" alt="Moledao" />
            <span className="docs-brand__divider" aria-hidden="true" />
            <span>Docs</span>
          </a>
          <div className="docs-header__actions">
            <a className="docs-header__home" href="./index.html">首页</a>
            <a href="#storybook">Storybook</a>
            <span className="docs-version">v0.1.0</span>
            <button
              aria-label={`切换到${theme === 'light' ? '深色' : '浅色'}主题`}
              className="docs-theme-toggle"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              type="button"
            >
              {theme === 'light' ? '深色模式' : '浅色模式'}
            </button>
          </div>
        </div>
      </header>

      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label="文档导航">
          <div className="docs-sidebar__heading">文档目录</div>
          <nav className="docs-nav"><NavLinks activeId={activeId} /></nav>
          <div className="docs-sidebar__foot">当前仅记录已实现的 React 组件。</div>
        </aside>

        <main className="docs-main">
          <details className="docs-mobile-nav" onToggle={(event) => setMobileNavOpen(event.currentTarget.open)} open={mobileNavOpen}>
            <summary>文档目录</summary>
            <nav aria-label="移动端文档导航" className="docs-nav"><NavLinks activeId={activeId} onNavigate={() => setMobileNavOpen(false)} /></nav>
          </details>

          <section className="docs-section docs-intro" id="overview">
            <span className="docs-eyebrow">DOCUMENTATION / 01</span>
            <h1>Mole UI 文档</h1>
            <p className="docs-lead">为 Moledao 产品打造的轻量 React 组件库。这里记录如何安装、试用和扩展当前已经实现的组件。</p>
            <div className="docs-tags"><span>React 18 / 19</span><span>TypeScript</span><span>CSS Variables</span><span>MIT License</span></div>
            <div className="docs-callout">
              <strong>当前版本范围</strong>
              <p>组件包现有 Button、Input、Toggle、Tooltip、Icon、LockIcon、Spinner、Typography 和 MoleProvider。参考文件夹中的 Radio 属于另一套原生 HTML/JS 实现，尚未进入当前 React 包；本页不会把它写成可用 API。</p>
            </div>
          </section>

          <section className="docs-section" id="installation">
            <span className="docs-eyebrow">GET STARTED</span>
            <h2>快速上手</h2>
            <p className="docs-section__lead">当前仓库使用 pnpm 工作区管理。先在仓库中运行演示站，发布后再通过包管理器安装 <code>moledao</code>。</p>
            <CodeBlock code={installCode} label="Terminal" />
            <div className="docs-info-grid">
              <div><span>01</span><h3>打开文档</h3><p>启动后访问 <code>/docs.html</code>，首页可访问 <code>/</code>。</p></div>
              <div><span>02</span><h3>引入样式</h3><p>使用组件时同时导入 <code>moledao/styles.css</code>。</p></div>
              <div><span>03</span><h3>发布状态</h3><p>目前未发布到 npm；<code>pnpm add moledao</code> 需等发布后使用。</p></div>
            </div>
          </section>

          <section className="docs-section" id="tokens">
            <span className="docs-eyebrow">FOUNDATIONS</span>
            <h2>设计令牌</h2>
            <p className="docs-section__lead">依据 <a href="https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=10957-207" rel="noreferrer" target="_blank">新版 Moledao 色板</a>，品牌色分为主色、辅助色和强调色。业务样式使用 CSS 变量，主题可在 MoleProvider 上切换。</p>
            {colorGroups.map((group) => (
              <div className="docs-color-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="docs-color-grid">
                  {group.colors.map((color) => (
                    <div className="docs-color" key={color.name}>
                      <div className={`docs-color__sample docs-color__sample--${color.className}`} />
                      <strong>{color.name}</strong>
                      <span>{color.value}</span>
                      <code>{color.token}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="docs-note">主色 <code>--mole-color-brand-600</code> 与 Button 主色均指向 <code>--mole-color-brand-red</code>（#F44527）。旧版渐变变量和 <code>--mole-color-success-green</code> 继续保留兼容；Input 等组件的状态色仍遵循各自设计规范。</div>
          </section>

          <section className="docs-section" id="typography">
            <span className="docs-eyebrow">FOUNDATIONS / TYPOGRAPHY</span>
            <h2>Typography 文字</h2>
            <p className="docs-section__lead">参考 <a href="https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=1602-50920" rel="noreferrer" target="_blank">Figma Typography</a>：西文使用 Poppins，中文使用 OPPO Sans。Mole UI 网页、文档和组件共享同一字体栈。</p>
            <h3>文字层级</h3>
            <div className="docs-type-scale">
              {typographyLevels.map(({ level, label, spec }) => (
                <div className="docs-type-row" key={level}>
                  <div className="docs-type-row__meta"><strong>{label}</strong><span>{spec}</span></div>
                  <Typography level={level}>Moledao 设计系统 · Design System</Typography>
                </div>
              ))}
            </div>
            <h3>语义状态</h3>
            <div className="docs-type-states">
              {typographyStates.map(({ state, label }) => (
                <div className="docs-type-state" key={state}>
                  <span>{label}</span>
                  <Typography href={state === 'link' ? '#typography' : undefined} level="body-large" state={state}>Moledao 文字示例</Typography>
                </div>
              ))}
            </div>
            <h3>使用方式</h3>
            <CodeBlock code={typographyCode} label="Typography.tsx" />
            <div className="docs-table-wrap"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              <tr><td><code>level</code></td><td><code>h1 | h2 | h3 | h4 | body-large | body | body-small | caption</code></td><td><code>body</code></td><td>对应设计稿的字号与字重，统一使用 1.5 行高。</td></tr>
              <tr><td><code>state</code></td><td><code>default | secondary | success | warning | disabled | mark | link | delete</code></td><td><code>default</code></td><td>文字颜色或装饰；mark 与 delete 保留语义标签。</td></tr>
              <tr><td><code>as</code></td><td><code>h1 | h2 | h3 | h4 | p | span | a</code></td><td>按 level 自动选择</td><td>需要时覆盖实际 HTML 标签。</td></tr>
              <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>链接状态提供 href 时渲染为可访问的链接。</td></tr>
            </tbody></table></div>
            <a className="docs-storybook-inline" href={`${storybookOrigin}/?path=/docs/foundations-typography--docs`} rel="noreferrer" target="_blank">在 Storybook 查看 Typography ↗</a>
          </section>

          <section className="docs-section" id="button">
            <span className="docs-eyebrow">COMPONENTS / ACTIONS</span>
            <h2>Button 按钮</h2>
            <p className="docs-section__lead">用于触发操作。提供六种外观、三档尺寸，以及加载、禁用、只读与纯图标状态。下方示例使用真实的 <code>moledao</code> 组件。</p>
            <h3>外观</h3>
            <Demo code={buttonCode}>
              <Button onClick={() => setClickCount((count) => count + 1)} size="sm" variant="primary">主要</Button>
              <Button size="sm" variant="destructive">深色</Button>
              <Button size="sm" variant="white-line">描边</Button>
              <Button size="sm" variant="secondary">次要</Button>
              <Button size="sm" variant="destructive-secondary">深色次要</Button>
              <Button size="sm" variant="link">链接</Button>
              <span aria-live="polite" className="docs-demo__feedback">{clickCount ? `主要按钮已点击 ${clickCount} 次` : '点击主要按钮试试'}</span>
            </Demo>
            <h3>尺寸与状态</h3>
            <Demo code={'<Button size="sm">小</Button>\n<Button size="md">中</Button>\n<Button size="lg">大</Button>\n<Button loading>处理中</Button>\n<Button disabled>不可用</Button>\n<Button readOnly size="sm" variant="white-line">只读</Button>'}>
              <Button size="sm">小</Button><Button size="md">中</Button><Button size="lg">大</Button>
              <Button loading size="sm">处理中</Button><Button disabled size="sm">不可用</Button>
              <Button readOnly size="sm" variant="white-line">只读</Button>
              <Button aria-label="纯图标按钮" iconOnly size="sm" />
            </Demo>
            <h3>API</h3>
            <div className="docs-table-wrap"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              <tr><td><code>variant</code></td><td><code>primary | destructive | white-line | secondary | destructive-secondary | link</code></td><td><code>primary</code></td><td>外观；另兼容旧别名 solid、outline、ghost、danger。</td></tr>
              <tr><td><code>size</code></td><td><code>sm | md | lg</code></td><td><code>md</code></td><td>按钮尺寸。</td></tr>
              <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示转圈提示并阻止点击。</td></tr>
              <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>原生禁用状态。</td></tr>
              <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>阻止交互并显示 Figma 只读外观；当前设计用于小号 White/Line。</td></tr>
              <tr><td><code>iconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>仅显示图标；请提供 <code>aria-label</code>。</td></tr>
              <tr><td><code>showIcon</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示默认图标。</td></tr>
              <tr><td><code>startContent / endContent</code></td><td><code>ReactNode</code></td><td>—</td><td>自定义前后内容。</td></tr>
              <tr><td><code>fullWidth</code></td><td><code>boolean</code></td><td><code>false</code></td><td>撑满容器宽度。</td></tr>
            </tbody></table></div>
            <p className="docs-small">同时支持原生 button 属性，并将 ref 转发到按钮元素；默认 <code>type="button"</code>。</p>
            <a className="docs-storybook-inline" href={`${storybookOrigin}/?path=/docs/components-button--docs`} rel="noreferrer" target="_blank">在 Storybook 查看 Button ↗</a>
          </section>

          <section className="docs-section" id="input">
            <span className="docs-eyebrow">COMPONENTS / FORMS</span>
            <h2>Input 输入框</h2>
            <p className="docs-section__lead">对应 <a href="https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=1602-52042">Figma Text Field Input</a>：大 / 中尺寸、标题、辅助说明、前后图标、密码显隐，以及成功、警告、禁用和只读状态。悬停和聚焦由实际交互触发。</p>
            <h3>输入与清空</h3>
            <Demo code={inputCode}>
              <div className="docs-input-example">
                <Input clearable helperText="输入至少 3 个字符即可看到成功状态" label="账户名称" onValueChange={setInputValue} placeholder="Focus in" status={inputValue.length >= 3 ? 'success' : 'default'} value={inputValue} />
              </div>
            </Demo>
            <h3>尺寸、图标与密码</h3>
            <Demo code={'<Input size="md" placeholder="中尺寸" aria-label="中尺寸输入" />\n<Input startContent={<span className="mole-input-icon mole-input-icon--user" />} aria-label="用户名" />\n<Input endContent={<span className="mole-input-icon mole-input-icon--copy" />} aria-label="邀请码" />\n<Input label="密码" type="password" showPasswordToggle />'}>
              <div className="docs-input-examples">
                <Input aria-label="中尺寸输入" placeholder="中尺寸 · 45px" size="md" />
                <Input aria-label="用户名" placeholder="带前置图标" startContent={<span aria-hidden="true" className="mole-input-icon mole-input-icon--user" />} />
                <Input aria-label="邀请码" endContent={<span aria-hidden="true" className="mole-input-icon mole-input-icon--copy" />} placeholder="带后置图标" />
                <Input aria-label="组合图标" endContent={<span aria-hidden="true" className="mole-input-icon mole-input-icon--copy" />} placeholder="前后图标" startContent={<span aria-hidden="true" className="mole-input-icon mole-input-icon--user" />} />
                <Input label="密码" placeholder="输入密码" showPasswordToggle type="password" />
              </div>
            </Demo>
            <h3>语义状态</h3>
            <Demo code={'<Input label="邮箱" status="warning" helperText="请填写必填项" />\n<Input label="验证结果" status="success" defaultValue="已验证" />\n<Input label="只读" readOnly defaultValue="不可修改" />\n<Input label="禁用" disabled defaultValue="不可输入" />'}>
              <div className="docs-input-examples">
                <Input helperText="请填写必填项" label="邮箱" status="warning" />
                <Input defaultValue="已验证" label="验证结果" status="success" />
                <Input defaultValue="不可修改" label="只读" readOnly />
                <Input defaultValue="不可输入" disabled label="禁用" />
              </div>
            </Demo>
            <h3>API</h3>
            <div className="docs-table-wrap"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              <tr><td><code>size</code></td><td><code>md | lg</code></td><td><code>lg</code></td><td>对应设计稿 Med（45px）与 Large（48px），上下内边距均为 12px。</td></tr>
              <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>可见标题；不显示标题时应提供 <code>aria-label</code>。</td></tr>
              <tr><td><code>status</code></td><td><code>default | success | warning</code></td><td><code>default</code></td><td>边框语义色；warning 同时设置 <code>aria-invalid</code>。</td></tr>
              <tr><td><code>helperText</code></td><td><code>string</code></td><td>—</td><td>输入框下方说明；警告时以提醒播报。</td></tr>
              <tr><td><code>startContent / endContent</code></td><td><code>ReactNode</code></td><td>—</td><td>装饰性前后内容；可复用图标样式。</td></tr>
              <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>有值时显示清空按钮。</td></tr>
              <tr><td><code>showPasswordToggle</code></td><td><code>boolean</code></td><td><code>false</code></td><td>仅当 <code>type="password"</code> 时显示密码显隐按钮。</td></tr>
              <tr><td><code>value / defaultValue</code></td><td><code>string</code></td><td>—</td><td>受控或非受控值。</td></tr>
              <tr><td><code>onValueChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>输入和清空时均触发；受控清空请用它更新状态。</td></tr>
              <tr><td><code>disabled / readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>原生禁用与只读属性。</td></tr>
              <tr><td><code>fullWidth</code></td><td><code>boolean</code></td><td><code>false</code></td><td>默认最大宽度 350px；开启后撑满容器。</td></tr>
            </tbody></table></div>
            <p className="docs-small">同时支持原生 input 属性、<code>onChange</code> 与 ref 转发。成功边框可通过 <code>--mole-color-input-success</code> 覆盖。设计稿的 Inputting / Enterred 由输入值和焦点自然呈现，不需要手动传入状态。</p>
            <a className="docs-storybook-inline" href={`${storybookOrigin}/?path=/docs/components-input--docs`} rel="noreferrer" target="_blank">在 Storybook 查看 Input ↗</a>
          </section>

          <section className="docs-section" id="toggle">
            <span className="docs-eyebrow">COMPONENTS / FORMS</span>
            <h2>Toggle 开关</h2>
            <p className="docs-section__lead">参考 <a href="https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=5334-1256" rel="noreferrer" target="_blank">Figma Toggle</a>：67 × 36px 的胶囊开关，关闭时为浅蓝灰，开启时为 Moledao Red；可选择显示 Yes / No 文案。</p>
            <Demo code={toggleCode}>
              <div className="docs-toggle-examples">
                <div><Toggle label="通知开关" /><span>默认关闭</span></div>
                <div><Toggle defaultChecked label="已开启的通知" /><span>默认开启</span></div>
                <div><Toggle label="显示状态文字" showText /><span>显示文字</span></div>
                <div><Toggle disabled label="不可用的开关" /><span>禁用</span></div>
              </div>
            </Demo>
            <h3>API</h3>
            <div className="docs-table-wrap"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              <tr><td><code>label</code></td><td><code>string</code></td><td>必填</td><td>屏幕阅读器使用的稳定名称。</td></tr>
              <tr><td><code>checked / defaultChecked</code></td><td><code>boolean</code></td><td><code>false</code></td><td>受控或非受控开关状态。</td></tr>
              <tr><td><code>onCheckedChange</code></td><td><code>(checked: boolean) =&gt; void</code></td><td>—</td><td>状态变化时回调。</td></tr>
              <tr><td><code>showText</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在轨道上显示状态文字；可通过 <code>onText / offText</code> 替换。</td></tr>
              <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>原生禁用状态。</td></tr>
            </tbody></table></div>
            <a className="docs-storybook-inline" href={`${storybookOrigin}/?path=/docs/components-toggle--docs`} rel="noreferrer" target="_blank">在 Storybook 查看 Toggle ↗</a>
          </section>

          <section className="docs-section" id="tooltip">
            <span className="docs-eyebrow">COMPONENTS / FEEDBACK</span>
            <h2>Tooltip 文字提示</h2>
            <p className="docs-section__lead">参考 <a href="https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=3456-19587" rel="noreferrer" target="_blank">Figma Tooltip</a>：深色背景、6px 圆角、12px 文字和原始箭头素材。悬停或键盘聚焦触发，Escape 可关闭。</p>
            <Demo code={tooltipCode} overflowVisible>
              <div className="docs-tooltip-examples">
                <Tooltip content="上方提示" open placement="top"><button className="docs-tooltip-trigger" type="button">上方</button></Tooltip>
                <Tooltip content="右侧提示" placement="right"><button className="docs-tooltip-trigger" type="button">右侧</button></Tooltip>
                <Tooltip content="下方提示" placement="bottom"><button className="docs-tooltip-trigger" type="button">下方</button></Tooltip>
                <Tooltip content="左侧提示" placement="left"><button className="docs-tooltip-trigger" type="button">左侧</button></Tooltip>
              </div>
            </Demo>
            <h3>API</h3>
            <div className="docs-table-wrap"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              <tr><td><code>content</code></td><td><code>ReactNode</code></td><td>必填</td><td>提示内容。</td></tr>
              <tr><td><code>placement</code></td><td><code>top | right | bottom | left</code></td><td><code>top</code></td><td>提示框相对触发元素的位置。</td></tr>
              <tr><td><code>align</code></td><td><code>start | center | end</code></td><td><code>center</code></td><td>上方和下方时的水平对齐。</td></tr>
              <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>受控显示状态，适合预览或自定义交互。</td></tr>
            </tbody></table></div>
            <p className="docs-small">子元素应为可聚焦的单个 React 元素，例如 Button；组件会为其附加 <code>aria-describedby</code>。</p>
            <a className="docs-storybook-inline" href={`${storybookOrigin}/?path=/docs/components-tooltip--docs`} rel="noreferrer" target="_blank">在 Storybook 查看 Tooltip ↗</a>
          </section>

          <section className="docs-section" id="icon">
            <span className="docs-eyebrow">COMPONENTS / ICONOGRAPHY</span>
            <h2>Icon 图标</h2>
            <p className="docs-section__lead">来自 <a href="https://www.figma.com/design/HlPbDntJNj8msM3m7rzWzZ/Moledao-Wenyu.Zhang-Worker-file?node-id=3437-19426" rel="noreferrer" target="_blank">Figma Icon</a> 的 48 个原始 SVG 图标。默认 20px，可设 16 / 24px；颜色继承当前文字色。作为独立信息使用时请提供 <code>aria-label</code>。</p>
            {iconGroups.map((group) => (
              <div className="docs-icon-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="docs-icon-grid">
                  {group.names.map((name) => <div className="docs-icon-cell" key={name}><Icon name={name} /><code>{name}</code></div>)}
                </div>
              </div>
            ))}
            <CodeBlock code={iconCode} label="Icon.tsx" />
            <a className="docs-storybook-inline" href={`${storybookOrigin}/?path=/docs/components-icon--docs`} rel="noreferrer" target="_blank">在 Storybook 查看 Icon ↗</a>
          </section>

          <section className="docs-section" id="lock-icon">
            <span className="docs-eyebrow">COMPONENTS / ICONOGRAPHY</span>
            <h2>LockIcon 锁动画</h2>
            <p className="docs-section__lead">参考 <a href="https://www.figma.com/design/9UrUKdruApKIBYprtHyXir/Moledao.io-Web-Compontes?node-id=61-1838" rel="noreferrer" target="_blank">Figma 锁动画</a>。切换 <code>locked</code> 时锁梁抬起、绕左侧锁脚翻转 180° 后落下，解锁时播放开锁音效。点击下方的锁或按钮试试。</p>
            <Demo code={lockIconCode}>
              <div className="docs-lock-demo">
                <button
                  aria-label={lockLocked ? '解锁' : '上锁'}
                  className="docs-lock-demo__trigger"
                  onClick={() => setLockLocked((value) => !value)}
                  type="button"
                >
                  <LockIcon locked={lockLocked} size={96} sound={lockSound} speed={lockSpeed} />
                </button>
                <div className="docs-lock-demo__controls">
                  <Button onClick={() => setLockLocked((value) => !value)} showIcon={false} size="sm" variant="secondary">
                    {lockLocked ? '解锁' : '上锁'}
                  </Button>
                  <label className="docs-lock-demo__speed">
                    <span>速度 <b>{lockSpeed}×</b><small>{Math.round(380 / lockSpeed)}ms</small></span>
                    <input
                      max={4}
                      min={0.25}
                      onChange={(event) => setLockSpeed(Number(event.currentTarget.value))}
                      step={0.25}
                      type="range"
                      value={lockSpeed}
                    />
                  </label>
                  <div className="docs-lock-demo__sound">
                    <Toggle checked={lockSound} label="开锁音效" onCheckedChange={setLockSound} />
                    <span aria-hidden="true">开锁音效</span>
                  </div>
                </div>
                <div className="docs-lock-demo__sizes">
                  {(['sm', 'md', 'lg'] as const).map((lockSize) => (
                    <div className="docs-spinner-example" key={lockSize}>
                      <LockIcon locked={lockLocked} size={lockSize} sound={false} speed={lockSpeed} />
                      <span>{lockSize}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Demo>
            <h3>API</h3>
            <div className="docs-table-wrap"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              <tr><td><code>locked</code></td><td><code>boolean</code></td><td>必填</td><td>锁定状态，变化时播放上锁 / 解锁动画。</td></tr>
              <tr><td><code>size</code></td><td><code>sm | md | lg | number</code></td><td><code>md</code></td><td>16 / 20 / 24px，或任意像素值。</td></tr>
              <tr><td><code>speed</code></td><td><code>number</code></td><td><code>1</code></td><td>速度倍数：2 快一倍，0.5 慢一倍，0 跳过动画。</td></tr>
              <tr><td><code>duration</code></td><td><code>number</code></td><td><code>380</code></td><td>基准时长（毫秒），实际时长为 <code>duration / speed</code>。</td></tr>
              <tr><td><code>sound</code></td><td><code>boolean</code></td><td><code>true</code></td><td>从锁定变为解锁时播放开锁音效（Opus/WebM，885 字节）。</td></tr>
              <tr><td><code>soundVolume</code></td><td><code>number</code></td><td><code>1</code></td><td>音效音量，0–1。</td></tr>
              <tr><td><code>onAnimationComplete</code></td><td><code>(locked: boolean) =&gt; void</code></td><td>—</td><td>动画结束后回调；减弱动效时立即回调。</td></tr>
            </tbody></table></div>
            <p className="docs-small">颜色继承 <code>currentColor</code>。系统开启减弱动效或 <code>MoleProvider motion="reduced"</code> 时直接切换到终态。单独传达状态时请提供 <code>aria-label</code>。</p>
            <a className="docs-storybook-inline" href={`${storybookOrigin}/?path=/docs/components-lockicon--docs`} rel="noreferrer" target="_blank">在 Storybook 查看 LockIcon ↗</a>
          </section>

          <section className="docs-section" id="spinner">
            <span className="docs-eyebrow">COMPONENTS / FEEDBACK</span>
            <h2>Spinner 加载</h2>
            <p className="docs-section__lead">为等待中的内容提供可见反馈，并通过 <code>role="status"</code> 和 label 通知辅助技术。</p>
            <Demo code={spinnerCode}>
              <div className="docs-spinner-example"><Spinner size="sm" tone="brand" /><span>小</span></div>
              <div className="docs-spinner-example"><Spinner size="md" tone="brand" /><span>中</span></div>
              <div className="docs-spinner-example"><Spinner size="lg" tone="brand" /><span>大</span></div>
              <div className="docs-spinner-example"><Spinner size="md" tone="current" /><span>继承文字色</span></div>
            </Demo>
            <h3>API</h3>
            <div className="docs-table-wrap"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              <tr><td><code>size</code></td><td><code>sm | md | lg</code></td><td><code>md</code></td><td>加载图标尺寸。</td></tr>
              <tr><td><code>tone</code></td><td><code>current | brand</code></td><td><code>current</code></td><td>继承文字色或使用品牌红。</td></tr>
              <tr><td><code>label</code></td><td><code>string</code></td><td><code>加载中</code></td><td>辅助技术播报文案。</td></tr>
            </tbody></table></div>
            <a className="docs-storybook-inline" href={`${storybookOrigin}/?path=/docs/components-spinner--docs`} rel="noreferrer" target="_blank">在 Storybook 查看 Spinner ↗</a>
          </section>

          <section className="docs-section" id="provider">
            <span className="docs-eyebrow">FOUNDATIONS / THEMING</span>
            <h2>MoleProvider</h2>
            <p className="docs-section__lead">在组件树外包一层 Provider，设置亮暗主题与控件密度。页面右上角的主题开关就是一个实时示例。</p>
            <CodeBlock code={providerCode} label="App.tsx" />
            <div className="docs-table-wrap"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              <tr><td><code>theme</code></td><td><code>light | dark | system</code></td><td><code>system</code></td><td>亮色、暗色或跟随系统。</td></tr>
              <tr><td><code>density</code></td><td><code>comfortable | compact</code></td><td><code>comfortable</code></td><td>标准或紧凑控件间距。</td></tr>
              <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>必填</td><td>被主题包裹的内容。</td></tr>
            </tbody></table></div>
            <a className="docs-storybook-inline" href={`${storybookOrigin}/?path=/docs/foundations-moleprovider--docs`} rel="noreferrer" target="_blank">在 Storybook 查看 MoleProvider ↗</a>
          </section>

          <section className="docs-section" id="storybook">
            <span className="docs-eyebrow">DEVELOP / STORYBOOK</span>
            <h2>Storybook 组件预览</h2>
            <p className="docs-section__lead">在独立画布中查看每个组件的状态，并通过 Controls 调整参数。Storybook 与当前文档分别运行；打开下方链接前，请先启动本地 Storybook 服务。</p>
            <CodeBlock code={storybookCode} label="Terminal" />
            <div className="docs-storybook-grid">
              <a href={`${storybookOrigin}/?path=/docs/components-button--docs`} rel="noreferrer" target="_blank"><span>01 / ACTIONS</span><strong>Button</strong><small>外观、尺寸、加载与禁用</small><b aria-hidden="true">↗</b></a>
              <a href={`${storybookOrigin}/?path=/docs/components-input--docs`} rel="noreferrer" target="_blank"><span>02 / FORMS</span><strong>Input</strong><small>图标、密码、校验与清空</small><b aria-hidden="true">↗</b></a>
              <a href={`${storybookOrigin}/?path=/docs/components-toggle--docs`} rel="noreferrer" target="_blank"><span>03 / FORMS</span><strong>Toggle</strong><small>开关状态与文字标签</small><b aria-hidden="true">↗</b></a>
              <a href={`${storybookOrigin}/?path=/docs/components-tooltip--docs`} rel="noreferrer" target="_blank"><span>04 / FEEDBACK</span><strong>Tooltip</strong><small>四向提示与对齐</small><b aria-hidden="true">↗</b></a>
              <a href={`${storybookOrigin}/?path=/docs/components-icon--docs`} rel="noreferrer" target="_blank"><span>05 / ICONOGRAPHY</span><strong>Icon</strong><small>48 个原始设计图标</small><b aria-hidden="true">↗</b></a>
              <a href={`${storybookOrigin}/?path=/docs/components-spinner--docs`} rel="noreferrer" target="_blank"><span>06 / FEEDBACK</span><strong>Spinner</strong><small>尺寸与颜色</small><b aria-hidden="true">↗</b></a>
              <a href={`${storybookOrigin}/?path=/docs/foundations-moleprovider--docs`} rel="noreferrer" target="_blank"><span>07 / FOUNDATIONS</span><strong>MoleProvider</strong><small>主题与密度</small><b aria-hidden="true">↗</b></a>
              <a href={`${storybookOrigin}/?path=/docs/foundations-typography--docs`} rel="noreferrer" target="_blank"><span>08 / FOUNDATIONS</span><strong>Typography</strong><small>文字层级、状态与中英混排</small><b aria-hidden="true">↗</b></a>
              <a href={`${storybookOrigin}/?path=/docs/components-lockicon--docs`} rel="noreferrer" target="_blank"><span>09 / ICONOGRAPHY</span><strong>LockIcon</strong><small>上锁动画、速度与音效</small><b aria-hidden="true">↗</b></a>
            </div>
            <p className="docs-small">默认地址为 <code>http://127.0.0.1:6006</code>。静态构建输出至 <code>apps/playground/storybook-static/</code>，不包含在组件包发布产物中。</p>
          </section>

          <section className="docs-section" id="contributing">
            <span className="docs-eyebrow">FOR CONTRIBUTORS</span>
            <h2>扩展组件</h2>
            <p className="docs-section__lead">参考文件夹里的组件可以作为设计与交互资料，但要进入本项目，需要实现 React 组件、类型、测试和文档，而不是直接复制原生 JS 运行时。</p>
            <ol className="docs-steps">
              <li>在 <code>packages/ui/src/组件名/</code> 添加实现、类型和测试。</li>
              <li>在 <code>packages/ui/src/index.ts</code> 导出公共 API，并补充按需导入入口。</li>
              <li>样式放入 <code>packages/ui/src/styles/index.css</code>，复用现有 <code>--mole-*</code> 设计令牌。</li>
              <li>在本页加入真实组件示例和 API 表，再运行 <code>corepack pnpm check</code>。</li>
            </ol>
          </section>

          <footer className="docs-footer"><span>Mole UI · v0.1.0 · 使用 OPPO Sans © OPPO 和 Poppins · <a href="/OPPO-SANS-LICENSE.txt">字体许可</a></span><a href="./index.html">返回首页 ↑</a></footer>
        </main>
      </div>
    </MoleProvider>
  );
}
