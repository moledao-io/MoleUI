import { useEffect, useState, type ReactNode } from 'react';
import { Button, MoleProvider, Spinner } from 'moledao';

type Theme = 'light' | 'dark';

const navGroups = [
  { title: '开始', items: [{ id: 'overview', label: '概览' }, { id: 'installation', label: '快速上手' }, { id: 'tokens', label: '设计令牌' }] },
  { title: '组件', items: [{ id: 'button', label: 'Button 按钮' }, { id: 'spinner', label: 'Spinner 加载' }, { id: 'provider', label: 'MoleProvider' }] },
  { title: '开发', items: [{ id: 'contributing', label: '扩展组件' }] },
] as const;

const colors = [
  { name: 'Moledao Red', value: '#F44527', token: '--mole-color-brand-red', className: 'red' },
  { name: 'Silver Black', value: '#25282D', token: '--mole-color-silver-black', className: 'black' },
  { name: 'Dark Blue', value: '#858891', token: '--mole-color-dark-blue', className: 'dark-blue' },
  { name: 'Med Blue', value: '#BCC1CB', token: '--mole-color-med-blue', className: 'med-blue' },
  { name: 'Light Blue', value: '#DFE4EA', token: '--mole-color-light-blue', className: 'light-blue' },
  { name: 'Lightest Blue', value: '#F2F4F8', token: '--mole-color-lightest-blue', className: 'lightest-blue' },
  { name: 'Success Green', value: '#13C39C', token: '--mole-color-success-green', className: 'green' },
  { name: 'Moledao Yellow', value: '#FFD500', token: '--mole-color-yellow', className: 'yellow' },
] as const;

const installCode = `# 在当前仓库启动演示站与文档
corepack pnpm install
corepack pnpm dev`;

const buttonCode = `import { Button } from 'moledao';
import 'moledao/styles.css';

<Button variant="primary" size="sm" onClick={() => console.log('clicked')}>
  主要
</Button>`;

const spinnerCode = `import { Spinner } from 'moledao';

<Spinner size="md" tone="brand" label="正在加载内容" />`;

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

function Demo({ children, code }: { children: ReactNode; code: string }) {
  return (
    <div className="docs-demo">
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) {
      window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    }

    const sections = navGroups.flatMap((group) => group.items.map((item) => item.id))
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
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
            <a href="./index.html">首页</a>
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
              <p>组件包现有 Button、Spinner 和 MoleProvider。参考文件夹中的 Radio、Icon、Tooltip 属于另一套原生 HTML/JS 实现，尚未进入当前 React 包；本页不会把它们写成可用 API。</p>
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
            <p className="docs-section__lead">品牌色由组件库样式统一提供。业务样式使用 CSS 变量，不必复制十六进制色值；主题可在 MoleProvider 上切换。</p>
            <div className="docs-color-grid">
              {colors.map((color) => (
                <div className="docs-color" key={color.name}>
                  <div className={`docs-color__sample docs-color__sample--${color.className}`} />
                  <strong>{color.name}</strong>
                  <span>{color.value}</span>
                  <code>{color.token}</code>
                </div>
              ))}
              <div className="docs-color docs-color--wide">
                <div className="docs-color__sample docs-color__sample--gradient" />
                <strong>Moledao Gradient</strong><code>--mole-gradient-light</code>
              </div>
              <div className="docs-color docs-color--wide">
                <div className="docs-color__sample docs-color__sample--dark-gradient" />
                <strong>Dark Gradient</strong><code>--mole-gradient-dark</code>
              </div>
            </div>
            <div className="docs-note">主色 <code>--mole-color-brand-600</code> 与 Button 主色均指向 <code>--mole-color-brand-red</code>（#F44527）。</div>
          </section>

          <section className="docs-section" id="button">
            <span className="docs-eyebrow">COMPONENTS / ACTIONS</span>
            <h2>Button 按钮</h2>
            <p className="docs-section__lead">用于触发操作。提供六种外观、三档尺寸，以及加载、禁用与纯图标状态。下方示例使用真实的 <code>moledao</code> 组件。</p>
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
            <Demo code={'<Button size="sm">小</Button>\n<Button size="md">中</Button>\n<Button size="lg">大</Button>\n<Button loading>处理中</Button>\n<Button disabled>不可用</Button>'}>
              <Button size="sm">小</Button><Button size="md">中</Button><Button size="lg">大</Button>
              <Button loading size="sm">处理中</Button><Button disabled size="sm">不可用</Button>
              <Button aria-label="纯图标按钮" iconOnly size="sm" />
            </Demo>
            <h3>API</h3>
            <div className="docs-table-wrap"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              <tr><td><code>variant</code></td><td><code>primary | destructive | white-line | secondary | destructive-secondary | link</code></td><td><code>primary</code></td><td>外观；另兼容旧别名 solid、outline、ghost、danger。</td></tr>
              <tr><td><code>size</code></td><td><code>sm | md | lg</code></td><td><code>md</code></td><td>按钮尺寸。</td></tr>
              <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示转圈提示并阻止点击。</td></tr>
              <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>原生禁用状态。</td></tr>
              <tr><td><code>iconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>仅显示图标；请提供 <code>aria-label</code>。</td></tr>
              <tr><td><code>showIcon</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示默认图标。</td></tr>
              <tr><td><code>startContent / endContent</code></td><td><code>ReactNode</code></td><td>—</td><td>自定义前后内容。</td></tr>
              <tr><td><code>fullWidth</code></td><td><code>boolean</code></td><td><code>false</code></td><td>撑满容器宽度。</td></tr>
            </tbody></table></div>
            <p className="docs-small">同时支持原生 button 属性，并将 ref 转发到按钮元素；默认 <code>type="button"</code>。</p>
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

          <footer className="docs-footer"><span>Mole UI · v0.1.0</span><a href="./index.html">返回首页 ↑</a></footer>
        </main>
      </div>
    </MoleProvider>
  );
}
