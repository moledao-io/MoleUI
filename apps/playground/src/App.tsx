import { useState } from 'react';
import { Button, MoleProvider, Spinner } from 'moledao';

type Theme = 'light' | 'dark';
type PreviewState = 'default' | 'loading' | 'disabled';

const installCommand = 'pnpm add moledao';
const githubUrl = 'https://github.com/RyuProject/MoleUI';
const variantOptions = [
  { value: 'primary', label: '主要' },
  { value: 'destructive', label: '深色' },
  { value: 'white-line', label: '描边' },
  { value: 'secondary', label: '次要' },
  { value: 'destructive-secondary', label: '深色次要' },
  { value: 'link', label: '链接' },
] as const;
const sizeOptions = [
  { value: 'sm', label: '小' },
  { value: 'md', label: '中' },
  { value: 'lg', label: '大' },
] as const;
const stateOptions = [
  { value: 'default', label: '默认' },
  { value: 'loading', label: '加载中' },
  { value: 'disabled', label: '禁用' },
] as const;

const exampleCode = `import { Button, MoleProvider } from 'moledao';
import 'moledao/styles.css';

<MoleProvider theme="system">
  <Button variant="primary">开始探索</Button>
</MoleProvider>`;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [copied, setCopied] = useState(false);
  const [variant, setVariant] = useState<(typeof variantOptions)[number]['value']>('primary');
  const [size, setSize] = useState<(typeof sizeOptions)[number]['value']>('md');
  const [previewState, setPreviewState] = useState<PreviewState>('default');
  const [iconOnly, setIconOnly] = useState(false);

  const previewCode = iconOnly
    ? `<Button aria-label="预览按钮" iconOnly variant="${variant}" size="${size}"${previewState === 'default' ? '' : ` ${previewState === 'loading' ? 'loading' : 'disabled'}`} />`
    : `<Button variant="${variant}" size="${size}"${previewState === 'default' ? '' : ` ${previewState === 'loading' ? 'loading' : 'disabled'}`}>预览按钮</Button>`;

  async function copyInstallCommand() {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <MoleProvider className="app" theme={theme}>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="brand" href="#top" aria-label="Mole UI 首页">
            <img src="/brand/moledao-logo.png" alt="Moledao" />
            <span className="brand__divider" aria-hidden="true" />
            <span className="brand__suffix">UI</span>
          </a>
          <nav className="site-nav" aria-label="主导航">
            <a href="./docs.html">文档</a>
            <a href="#lab">在线体验</a>
            <a href="#components">组件</a>
            <a href="#tokens">设计语言</a>
            <a href="#start">快速开始</a>
          </nav>
          <div className="site-header__actions">
            <span className="version-pill">v0.1.0</span>
            <Button
              aria-label={`切换到${theme === 'light' ? '深色' : '浅色'}主题`}
              className="theme-toggle"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              showIcon={false}
              size="sm"
              variant="white-line"
            >
              {theme === 'light' ? '深色模式' : '浅色模式'}
            </Button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero__art" src="/brand/moledao-hero.webp" alt="" aria-hidden="true" />
          <div className="hero__content">
            <span className="eyebrow"><span aria-hidden="true" />MOLEDAO DESIGN SYSTEM · V0.1</span>
            <h1 id="hero-title">Mole UI</h1>
            <p className="hero__lead">让 Web3 产品体验更有温度</p>
            <p className="hero__description">
              轻量、清晰、可复用的 React 组件。把 Moledao 的设计语言带进每一次构建。
            </p>
            <div className="hero__actions">
              <Button onClick={() => scrollTo('start')} showIcon={false} size="lg">
                开始使用
              </Button>
              <Button onClick={() => scrollTo('lab')} showIcon={false} size="lg" variant="white-line">
                体验组件
              </Button>
            </div>
          </div>
        </section>

        <section className="intro-links" aria-label="探索 Mole UI">
          <a className="intro-card" href="#lab">
            <span className="intro-card__eyebrow">LIVE PLAYGROUND <span>01</span></span>
            <h2>先动手，再了解</h2>
            <p>切换 Button 的外观、尺寸和状态，直接感受组件细节。</p>
            <span className="intro-card__arrow" aria-hidden="true">↗</span>
          </a>
          <a className="intro-card" href="#components">
            <span className="intro-card__eyebrow">COMPONENTS <span>02</span></span>
            <h2>从基础组件出发</h2>
            <p>从 Button 与 Spinner 开始，逐步建立一致的交互语言。</p>
            <span className="intro-card__arrow" aria-hidden="true">↗</span>
          </a>
          <a className="intro-card" href="#tokens">
            <span className="intro-card__eyebrow">DESIGN TOKENS <span>03</span></span>
            <h2>让品牌保持一致</h2>
            <p>品牌色、文字与基础间距，统一收进可覆盖的样式变量。</p>
            <span className="intro-card__arrow" aria-hidden="true">↗</span>
          </a>
        </section>

        <div className="capability-strip" aria-label="项目特性">
          <span>React 18 / 19</span>
          <span>TypeScript</span>
          <span>CSS Variables</span>
          <span>MIT License</span>
        </div>

        <section className="section lab-section" id="lab" aria-labelledby="lab-title">
          <div className="section-heading section-heading--center">
            <span className="section-kicker">EXPLORE THE DETAILS</span>
            <h2 id="lab-title">组件状态，所见即所得</h2>
            <p>像参考组件库一样，先在页面上试用，再将代码带回项目。</p>
          </div>
          <div className="lab-shell">
            <div className="lab-controls">
              <div className="lab-controls__intro">
                <span>BUTTON PLAYGROUND</span>
                <h3>调出你需要的按钮</h3>
                <p>六种外观，三档尺寸，以及常用交互状态。</p>
              </div>
              <fieldset className="control-group">
                <legend>外观</legend>
                <div className="control-options">
                  {variantOptions.map((option) => (
                    <button
                      key={option.value}
                      aria-pressed={variant === option.value}
                      onClick={() => setVariant(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="control-group">
                <legend>尺寸</legend>
                <div className="control-options control-options--compact">
                  {sizeOptions.map((option) => (
                    <button
                      key={option.value}
                      aria-pressed={size === option.value}
                      onClick={() => setSize(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="control-group">
                <legend>状态</legend>
                <div className="control-options control-options--compact">
                  {stateOptions.map((option) => (
                    <button
                      key={option.value}
                      aria-pressed={previewState === option.value}
                      onClick={() => setPreviewState(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="icon-toggle">
                <input checked={iconOnly} onChange={(event) => setIconOnly(event.target.checked)} type="checkbox" />
                仅显示图标
              </label>
            </div>
            <div className="lab-preview">
              <div className="lab-preview__top"><span>实时预览</span><span>01 / 02</span></div>
              <div className="lab-preview__stage">
                <div className="lab-preview__halo" aria-hidden="true" />
                <Button
                  aria-label={iconOnly ? '预览按钮' : undefined}
                  disabled={previewState === 'disabled'}
                  iconOnly={iconOnly}
                  loading={previewState === 'loading'}
                  size={size}
                  variant={variant}
                >
                  {iconOnly ? undefined : '预览按钮'}
                </Button>
                <div className="lab-preview__hint">点击左侧选项，组合出适合你的状态</div>
              </div>
              <div className="lab-preview__code">
                <span>React</span>
                <code>{previewCode}</code>
              </div>
            </div>
          </div>
        </section>

        <section className="section components-section" id="components" aria-labelledby="components-title">
          <div className="section-heading section-heading--center">
            <span className="section-kicker">THE BUILDING BLOCKS</span>
            <h2 id="components-title">基础组件，按需选用</h2>
            <p>现在从两个可靠的基础组件开始，之后继续扩展。</p>
          </div>
          <div className="component-grid">
            <article className="component-card component-card--button">
              <div className="component-card__top">
                <span className="component-card__number">01 / ACTIONS</span>
                <span className="component-card__category">READY TO USE</span>
              </div>
              <div className="component-card__preview button-preview">
                <div className="button-preview__row">
                  <Button size="sm" variant="primary">主要</Button>
                  <Button size="sm" variant="destructive">深色</Button>
                  <Button size="sm" variant="white-line">描边</Button>
                </div>
                <div className="button-preview__row">
                  <Button size="sm" variant="secondary">次要</Button>
                  <Button size="sm" variant="destructive-secondary">深色次要</Button>
                  <Button size="sm" variant="link">文字链接</Button>
                </div>
                <div className="button-preview__row">
                  <Button aria-label="图标按钮" iconOnly size="sm" />
                  <Button aria-label="图标按钮" iconOnly />
                  <Button aria-label="图标按钮" iconOnly size="lg" />
                  <Button disabled size="sm">不可用</Button>
                  <Button loading size="sm">处理中</Button>
                </div>
              </div>
              <div className="component-card__footer">
                <div><h3>Button</h3><p>明确下一步，也照顾每一种状态。</p></div>
                <a href="#lab">在线体验 <span aria-hidden="true">↗</span></a>
              </div>
            </article>
            <article className="component-card component-card--spinner">
              <div className="component-card__top">
                <span className="component-card__number">02 / FEEDBACK</span>
                <span className="component-card__category">READY TO USE</span>
              </div>
              <div className="component-card__preview spinner-preview">
                <Spinner label="加载中" size="sm" tone="brand" />
                <Spinner label="加载中" size="md" tone="brand" />
                <Spinner label="加载中" size="lg" tone="brand" />
              </div>
              <div className="component-card__footer">
                <div><h3>Spinner</h3><p>在等待时，也把体验交代清楚。</p></div>
              </div>
            </article>
          </div>
        </section>

        <section className="section tokens-section" id="tokens" aria-labelledby="tokens-title">
          <div className="section-heading section-heading--center">
            <span className="section-kicker">DESIGN LANGUAGE</span>
            <h2 id="tokens-title">风格统一，也足够灵活</h2>
            <p>从视觉基础到使用方式，为 Moledao 产品建立一致的起点。</p>
          </div>
          <div className="tokens-panel">
            <div className="tokens-panel__copy">
              <span className="tokens-panel__label">MOLEDAO BRAND COLOUR</span>
              <h3>让每一个界面都像我们。</h3>
              <p>以 Moledao Red 为主色，搭配 Silver Black、蓝灰阶，以及用于反馈和强调的绿与黄。</p>
            </div>
            <div className="swatches" aria-label="主题色板">
              <div className="swatch swatch--red"><span>Moledao Red</span><code>#F44527</code></div>
              <div className="swatch swatch--black"><span>Silver Black</span><code>#25282D</code></div>
              <div className="swatch swatch--gradient"><span>Moledao Gradient</span><code>#BCC1CB → #F2F4F8</code></div>
              <div className="swatch swatch--dark-gradient"><span>Dark Gradient</span><code>#BCC1CB → #3E424A</code></div>
              <div className="swatch swatch--dark-blue"><span>Dark Blue</span><code>#858891</code></div>
              <div className="swatch swatch--med-blue"><span>Med Blue</span><code>#BCC1CB</code></div>
              <div className="swatch swatch--light-blue"><span>Light Blue</span><code>#DFE4EA</code></div>
              <div className="swatch swatch--lightest-blue"><span>Lightest Blue</span><code>#F2F4F8</code></div>
              <div className="swatch swatch--green"><span>Success Green</span><code>#13C39C</code></div>
              <div className="swatch swatch--yellow"><span>Moledao Yellow</span><code>#FFD500</code></div>
            </div>
          </div>
          <div className="principles-grid">
            <div><span>01 / CONSISTENT</span><h3>统一变量</h3><p>颜色、圆角与尺寸使用同一套样式契约。</p></div>
            <div><span>02 / ADAPTABLE</span><h3>按需定制</h3><p>通过 CSS 变量与组件属性贴合不同场景。</p></div>
            <div><span>03 / ACCESSIBLE</span><h3>照顾每个人</h3><p>键盘焦点、加载反馈与辅助技术标签都有明确支持。</p></div>
          </div>
        </section>

        <section className="section start-section" id="start" aria-labelledby="start-title">
          <div className="section-heading section-heading--center">
            <span className="section-kicker">START BUILDING</span>
            <h2 id="start-title">把想法，变成下一件作品</h2>
            <p>从安装到使用，只需几个简单步骤。</p>
          </div>
          <div className="install-bar" aria-label="安装命令">
            <div className="install-bar__intro"><span className="install-bar__marker" aria-hidden="true">$</span><span>安装组件包</span></div>
            <code>{installCommand}</code>
            <Button
              aria-label={copied ? '已复制安装命令' : '复制安装命令'}
              onClick={copyInstallCommand}
              showIcon={false}
              size="sm"
            >
              {copied ? '已复制' : '复制命令'}
            </Button>
          </div>
          <div className="start-layout">
            <ol className="start-steps">
              <li><span>01</span><div><h3>安装依赖</h3><p>发布后通过包管理器添加 moledao。</p></div></li>
              <li><span>02</span><div><h3>引入样式</h3><p>按需导入组件，同时加载基础样式。</p></div></li>
              <li><span>03</span><div><h3>开始构建</h3><p>组合属性与设计变量，完成你的界面。</p></div></li>
            </ol>
            <div className="code-panel" aria-label="代码示例">
              <div className="code-panel__header"><span>App.tsx</span><span>React + TypeScript</span></div>
              <pre><code>{exampleCode}</code></pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <img src="/brand/moledao-logo.png" alt="Moledao" />
            <p>为更好的 Web3 体验而造。</p>
          </div>
          <div className="footer__links"><span>探索</span><a href="#lab">在线体验</a><a href="#components">组件</a><a href="#tokens">设计语言</a></div>
          <div className="footer__links"><span>项目</span><a href="./docs.html">文档</a><a href="#start">快速开始</a><a href={githubUrl} rel="noreferrer" target="_blank">GitHub</a></div>
          <span className="footer__copyright">Mole UI · MIT License</span>
        </div>
      </footer>
    </MoleProvider>
  );
}
