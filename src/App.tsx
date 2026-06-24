import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  ExternalLink,
  FileText,
  Gauge,
  Github,
  LineChart,
  LockKeyhole,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'

import { findKeywordPageByPath, keywordPages, type KeywordPage } from './content/keyword-pages'
import { trackEvent, trackPageView } from './lib/analytics'
import {
  analyzePlannerSelection,
  cadenceOptions,
  defaultPlannerSelection,
  horizonOptions,
  marketOptions,
  objectiveOptions,
  qualityOptions,
  rolloutOptions,
  type PlanId,
  type PlannerSelection,
} from './lib/planner'
import { buildSeoDocument, syncSeoDocument } from './lib/seo'
import { deriveRouteView, normalizePathname, scrollToHashTarget, type RouteView } from './lib/routing'

const defaultPublicAppOrigin = 'https://kronos.rest'

type Billing = 'monthly' | 'annual'

type CheckoutModalState = {
  planId: PlanId
  billing: Billing
  loadingKey: string
  status: 'loading' | 'popup' | 'retry'
  checkoutUrl?: string
}

const ctaPrimary = 'Start Pro annual'
const ctaSecondary = 'Review plans'

const plans: Array<{
  id: PlanId
  name: string
  tagline: string
  monthlyUsd: number
  bullets: string[]
  popular?: boolean
}> = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'A lean evaluation path for one market, one cadence, and a small review team.',
    monthlyUsd: 29,
    bullets: ['One K-line workspace', 'OHLCV readiness review', 'Forecast path summary', 'Email onboarding support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'The default managed path for serious Kronos AI forecast evaluation.',
    monthlyUsd: 79,
    popular: true,
    bullets: ['Multi-asset forecast planning', 'Volatility and confidence notes', 'Batch review guidance', 'Priority onboarding'],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'For production gates, cross-market rollout, and higher-touch model review.',
    monthlyUsd: 199,
    bullets: ['Production rollout checklist', 'Risk and monitoring review', 'Team operating notes', 'Dedicated workflow support'],
  },
]

const proofItems = [
  { label: 'Training corpus', value: '12B+', detail: 'K-line records described in the Kronos research paper' },
  { label: 'Market reach', value: '45', detail: 'Global exchanges in the upstream training corpus' },
  { label: 'Default plan', value: 'Pro', detail: 'Selected with annual billing for the most complete evaluation path' },
  { label: 'Annual savings', value: '50%', detail: 'The annual run-rate is half the monthly plan price' },
]

const workflowCards = [
  {
    title: 'K-line data contract',
    body: 'Start from required OHLC columns, optional volume and amount, aligned timestamps, and a forecast horizon that the team can review.',
    icon: <Database size={21} />,
  },
  {
    title: 'Model lane selection',
    body: 'Match Kronos-mini, small, or base style evaluation to context length, latency, and the amount of history you trust.',
    icon: <BrainCircuit size={21} />,
  },
  {
    title: 'Scenario review',
    body: 'Compare path shape, volatility, and confidence notes before any forecast becomes a trading or portfolio input.',
    icon: <LineChart size={21} />,
  },
  {
    title: 'Commercial handoff',
    body: 'Open checkout in a centered Polar window, keep the original page visible, and return to the homepage after payment.',
    icon: <ShieldCheck size={21} />,
  },
]

const trustLinks = [
  {
    label: 'Open-source repo',
    href: 'https://github.com/shiyu-coder/Kronos',
    icon: <Github size={17} />,
  },
  {
    label: 'Research paper',
    href: 'https://arxiv.org/abs/2508.02739',
    icon: <FileText size={17} />,
  },
  {
    label: 'Live upstream demo',
    href: 'https://shiyu-coder.github.io/Kronos/',
    icon: <Activity size={17} />,
  },
]

const legalPrivacySections = [
  {
    title: 'What we collect',
    paragraphs: [
      'This site collects limited analytics events, checkout metadata, and the information you submit through hosted payment or support flows.',
      'The homepage readiness check runs in the browser from your selections. It does not require uploading private market data to use the public page.',
    ],
  },
  {
    title: 'Why we collect it',
    paragraphs: [
      'Analytics help us understand which pages, calls to action, and plan flows create confidence or confusion.',
      'Payment metadata is used to confirm purchases, return users to the homepage, and support onboarding after checkout.',
    ],
  },
]

const legalTermsSections = [
  {
    title: 'Service scope',
    paragraphs: [
      'The managed Kronos AI site covers forecast workflow planning, plan selection, hosted checkout, and related support around financial K-line model evaluation.',
      'The upstream open-source repository, paper, and public demo remain independently available through their own channels.',
    ],
  },
  {
    title: 'Payments and returns',
    paragraphs: [
      'Payments are processed by Polar in a hosted popup window. Successful checkouts return the user to the homepage.',
      'Displayed annual pricing reflects a 50% discount versus the monthly run-rate for the same plan.',
    ],
  },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const rawText = await response.text()
  if (!rawText.trim()) return null
  try {
    return JSON.parse(rawText) as T
  } catch {
    return null
  }
}

async function createCheckoutSession(planId: PlanId, billing: Billing, endpoint = '/api/checkout') {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, billing }),
  })

  const payload = await readJsonResponse<{ ok?: boolean; checkoutUrl?: string; error?: string }>(response)
  if (!response.ok || !payload?.ok || !payload.checkoutUrl) {
    throw new Error(payload?.error || 'Checkout could not be started.')
  }

  return payload.checkoutUrl
}

function openCenteredCheckoutWindow() {
  const width = 560
  const height = 760
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  const popup = window.open(
    'about:blank',
    'kronos-checkout',
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  )

  if (popup) {
    try {
      popup.document.title = 'Opening secure checkout'
      popup.document.body.innerHTML =
        '<main style="min-height:100vh;display:grid;place-items:center;background:#08110f;color:#f4f8f4;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:32px"><div><h1 style="font-size:22px;margin:0 0 8px">Opening secure checkout...</h1><p style="margin:0;color:#b6c9bf">Your Kronos AI payment window is being prepared.</p></div></main>'
    } catch {
      /* Existing named checkout windows can be cross-origin. */
    }
  }

  return popup
}

function sendPopupToCheckout(popup: Window | null, url: string) {
  if (!popup || popup.closed) return false

  try {
    popup.location.replace(url)
    popup.focus()
    return true
  } catch {
    return false
  }
}

function useRouteSignal() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [search, setSearch] = useState(() => window.location.search)

  function navigate(to: string) {
    const url = new URL(to, window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPathname(url.pathname)
    setSearch(url.search)

    if (url.hash) {
      requestAnimationFrame(() => scrollToHashTarget(url.hash))
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPop = () => {
      setPathname(window.location.pathname)
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { pathname, search, navigate }
}

function CheckoutDoneBridge({ publicAppOrigin }: { publicAppOrigin: string }) {
  useEffect(() => {
    const origin = window.location.origin || new URL(publicAppOrigin).origin

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'kronos-checkout-complete' }, origin)
      return
    }

    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'kronos-checkout-complete' }, origin)
      } catch {
        /* The opener may be closed or cross-origin. */
      }
      window.close()
      return
    }

    window.location.replace(`${origin}/?payment=success`)
  }, [publicAppOrigin])

  return (
    <main className="kro-main">
      <section className="kro-center-card">
        <p className="kro-eyebrow">Checkout</p>
        <h1>Finishing checkout...</h1>
        <p className="kro-muted">You will return to the Kronos AI homepage when the hosted payment session closes.</p>
      </section>
    </main>
  )
}

export default function App() {
  const { pathname, search, navigate } = useRouteSignal()
  const routeView: RouteView = useMemo(() => deriveRouteView(pathname), [pathname])
  const normalizedPath = normalizePathname(pathname)
  const keywordPage = useMemo(() => findKeywordPageByPath(pathname), [pathname])

  const [publicAppOrigin, setPublicAppOrigin] = useState(defaultPublicAppOrigin)
  const [headerCompact, setHeaderCompact] = useState(() => window.scrollY > 18)
  const [billing, setBilling] = useState<Billing>('annual')
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('pro')
  const [checkoutLoadingKey, setCheckoutLoadingKey] = useState<string | null>(null)
  const [checkoutModal, setCheckoutModal] = useState<CheckoutModalState | null>(null)
  const [plannerSelection, setPlannerSelection] = useState<PlannerSelection>(defaultPlannerSelection)

  const planner = useMemo(() => analyzePlannerSelection(plannerSelection), [plannerSelection])

  useEffect(() => {
    let cancelled = false
    fetch('/api/runtime')
      .then((response) => readJsonResponse<{ publicAppOrigin?: string }>(response))
      .then((payload) => {
        if (!cancelled && payload?.publicAppOrigin) {
          setPublicAppOrigin(payload.publicAppOrigin)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const seo = buildSeoDocument({
      pathname,
      routeView,
      publicAppOrigin,
      keywordPage,
    })
    syncSeoDocument(seo)
  }, [keywordPage, pathname, publicAppOrigin, routeView])

  useEffect(() => {
    const onScroll = () => setHeaderCompact(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    trackPageView(`${pathname}${search}`)
  }, [pathname, search])

  useEffect(() => {
    const allowed = new Set([window.location.origin, new URL(publicAppOrigin).origin])
    const onMessage = (event: MessageEvent) => {
      if (!allowed.has(event.origin)) return
      if (event.data?.type === 'kronos-checkout-complete') {
        setCheckoutModal(null)
        trackEvent('checkout_complete_return', { path: pathname })
        navigate('/?payment=success')
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate, pathname, publicAppOrigin])

  useEffect(() => {
    const hash = window.location.hash
    if (hash) requestAnimationFrame(() => scrollToHashTarget(hash))
  }, [pathname])

  function updatePlannerSelection<Key extends keyof PlannerSelection>(key: Key, value: PlannerSelection[Key]) {
    setPlannerSelection((current) => ({ ...current, [key]: value }))
    trackEvent('planner_change', { key, value })
  }

  async function startHostedCheckout(planId: PlanId, nextBilling: Billing, loadingKey: string, provider = 'polar') {
    setSelectedPlanId(planId)
    setBilling(nextBilling)
    setCheckoutLoadingKey(loadingKey)
    setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'loading' })
    trackEvent('checkout_start', { planId, billing: nextBilling })

    const popup = openCenteredCheckoutWindow()

    try {
      const url = await createCheckoutSession(planId, nextBilling, provider === 'polar' ? '/api/polar-checkout' : '/api/checkout')
      const popupOpened = sendPopupToCheckout(popup, url)
      if (!popupOpened) {
        try {
          if (popup && !popup.closed) popup.close()
        } catch {}
        throw new Error('Popup could not be opened.')
      }

      setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'popup', checkoutUrl: url })
      trackEvent('checkout_popup_opened', { planId, billing: nextBilling })
    } catch (error) {
      try {
        if (popup && !popup.closed) popup.close()
      } catch {}
      setCheckoutModal({ planId, billing: nextBilling, loadingKey, status: 'retry' })
      trackEvent('checkout_error', {
        planId,
        billing: nextBilling,
        message: error instanceof Error ? error.message : 'unknown',
      })
    } finally {
      setCheckoutLoadingKey(null)
    }
  }

  function startDefaultCheckout(source: string) {
    trackEvent('primary_cta_click', { source })
    void startHostedCheckout('pro', 'annual', source)
  }

  function openPage(path: string) {
    trackEvent('internal_page_open', { path })
    navigate(path)
  }

  const renderHeader = () => (
    <header className={`kro-header${headerCompact ? ' compact' : ''}`}>
      <div className="kro-header-inner">
        <a
          className="kro-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <span className="kro-brand-mark" aria-hidden>
            <Sparkles size={20} />
          </span>
          <span className="kro-brand-copy">
            <strong>Kronos AI</strong>
            <span>Financial K-line forecasting</span>
          </span>
        </a>

        <nav className="kro-nav" aria-label="Primary">
          <a
            href="/#workspace"
            onClick={(event) => {
              event.preventDefault()
              navigate('/#workspace')
            }}
          >
            Workspace
          </a>
          <a
            href="/kronos-ai"
            onClick={(event) => {
              event.preventDefault()
              openPage('/kronos-ai')
            }}
          >
            Kronos AI
          </a>
          <a
            href="/kronos-github"
            onClick={(event) => {
              event.preventDefault()
              openPage('/kronos-github')
            }}
          >
            GitHub
          </a>
          <a
            href="/pricing"
            onClick={(event) => {
              event.preventDefault()
              openPage('/pricing')
            }}
          >
            Pricing
          </a>
        </nav>

        <button type="button" className="kro-btn kro-btn-primary kro-header-cta" onClick={() => startDefaultCheckout('header-pro-annual')}>
          <Rocket size={16} />
          {ctaPrimary}
        </button>
      </div>
    </header>
  )

  const renderCheckoutModal = () => {
    if (!checkoutModal) return null

    const checkoutUrl = checkoutModal.status === 'popup' ? checkoutModal.checkoutUrl : undefined

    return (
      <div className="kro-checkout-backdrop" role="presentation">
        <section className="kro-checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <button
            type="button"
            className="kro-checkout-close"
            aria-label="Close checkout"
            onClick={() => {
              setCheckoutModal(null)
              trackEvent('checkout_overlay_closed', { status: checkoutModal.status })
            }}
          >
            <X size={18} />
          </button>
          {checkoutUrl ? (
            <div className="kro-checkout-copy">
              <p className="kro-eyebrow">Secure checkout</p>
              <h2 id="checkout-title">Polar checkout opened.</h2>
              <p className="kro-muted">
                Complete payment in the centered popup. This page stays in place and returns to the homepage after success.
              </p>
              <div className="kro-checkout-actions">
                <a className="kro-btn kro-btn-primary" href={checkoutUrl} target="_blank" rel="noreferrer noopener">
                  Focus payment window
                </a>
                <button type="button" className="kro-btn kro-btn-ghost" onClick={() => setCheckoutModal(null)}>
                  Keep reviewing
                </button>
              </div>
            </div>
          ) : checkoutModal.status === 'loading' ? (
            <div className="kro-checkout-loading" aria-live="polite">
              <span />
              Preparing secure checkout...
            </div>
          ) : (
            <div className="kro-checkout-copy">
              <p className="kro-eyebrow">Popup needed</p>
              <h2 id="checkout-title">Checkout could not open yet.</h2>
              <p className="kro-muted">
                Allow the payment popup and try again. Kronos AI keeps payment in a separate Polar window so the original page is not replaced.
              </p>
              <div className="kro-checkout-actions">
                <button
                  type="button"
                  className="kro-btn kro-btn-primary"
                  onClick={() => void startHostedCheckout(checkoutModal.planId, checkoutModal.billing, checkoutModal.loadingKey)}
                >
                  Try checkout again
                </button>
                <button type="button" className="kro-btn kro-btn-ghost" onClick={() => setCheckoutModal(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    )
  }

  const renderCandles = () => {
    const candles = [
      [28, 54, 34, 49],
      [34, 62, 56, 38],
      [30, 48, 36, 44],
      [22, 57, 25, 53],
      [41, 70, 66, 47],
      [37, 66, 44, 61],
      [46, 76, 71, 55],
      [51, 82, 58, 78],
      [62, 86, 80, 67],
      [58, 88, 63, 84],
      [67, 92, 86, 74],
      [70, 96, 76, 91],
    ]

    return (
      <div className="kro-candle-stage" aria-hidden>
        <div className="kro-chart-grid" />
        {candles.map(([low, high, open, close], index) => {
          const green = close >= open
          const top = 100 - high
          const wickHeight = high - low
          const bodyTop = 100 - Math.max(open, close)
          const bodyHeight = Math.max(8, Math.abs(close - open))
          return (
            <span
              className="kro-candle"
              data-green={green ? 'true' : 'false'}
              key={`${index}-${low}`}
              style={
                {
                  '--x': `${index}`,
                  '--wick-top': `${top}%`,
                  '--wick-height': `${wickHeight}%`,
                  '--body-top': `${bodyTop}%`,
                  '--body-height': `${bodyHeight}%`,
                } as CSSProperties
              }
            />
          )
        })}
        <svg className="kro-forecast-line" viewBox="0 0 460 170" role="img" aria-label="Forecast path">
          <path d="M25 125 C 84 112, 104 146, 146 104 S 220 72, 258 89 S 334 122, 410 50" />
          <path className="soft" d="M25 142 C 90 130, 110 152, 152 116 S 220 86, 260 102 S 328 135, 410 72" />
        </svg>
      </div>
    )
  }

  const renderOptionButtons = <Key extends keyof PlannerSelection>(
    key: Key,
    options: Array<{ id: PlannerSelection[Key]; label: string; summary: string }>,
  ) => (
    <div className="kro-option-grid">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="kro-option"
          data-active={plannerSelection[key] === option.id ? 'true' : 'false'}
          onClick={() => updatePlannerSelection(key, option.id)}
        >
          <strong>{option.label}</strong>
          <span>{option.summary}</span>
        </button>
      ))}
    </div>
  )

  const renderForecastPanel = () => (
    <aside className="kro-workspace-panel" aria-label="Kronos AI forecast fit workspace">
      <div className="kro-panel-top">
        <div>
          <p className="kro-eyebrow">Forecast fit workspace</p>
          <h2>{planner.headline}</h2>
        </div>
        <div className="kro-score">
          <strong>{planner.fitScore}</strong>
          <span>{planner.fitLabel}</span>
        </div>
      </div>

      {renderCandles()}

      <div className="kro-choice-stack">
        <section>
          <div className="kro-choice-label">Market</div>
          {renderOptionButtons('market', marketOptions)}
        </section>
        <section>
          <div className="kro-choice-label">Data quality</div>
          {renderOptionButtons('quality', qualityOptions)}
        </section>
        <section className="kro-split-options">
          <div>
            <div className="kro-choice-label">Cadence</div>
            {renderOptionButtons('cadence', cadenceOptions)}
          </div>
          <div>
            <div className="kro-choice-label">Horizon</div>
            {renderOptionButtons('horizon', horizonOptions)}
          </div>
        </section>
        <section className="kro-split-options">
          <div>
            <div className="kro-choice-label">Objective</div>
            {renderOptionButtons('objective', objectiveOptions)}
          </div>
          <div>
            <div className="kro-choice-label">Rollout</div>
            {renderOptionButtons('rollout', rolloutOptions)}
          </div>
        </section>
      </div>

      <div className="kro-result-grid">
        {planner.modules.map((module) => (
          <article key={module.label}>
            <span>{module.label}</span>
            <strong>{module.detail}</strong>
          </article>
        ))}
      </div>

      <div className="kro-next-box">
        <div>
          <p className="kro-eyebrow">Recommended next move</p>
          <h3>{planner.operatorMessage}</h3>
          <p>{planner.proofLine}</p>
        </div>
        <button type="button" className="kro-btn kro-btn-primary" onClick={() => startDefaultCheckout('workspace-pro-annual')}>
          <Play size={18} />
          {ctaPrimary}
        </button>
      </div>
    </aside>
  )

  const renderPricingSection = (standalone = false) => (
    <section className={`kro-section kro-pricing-section${standalone ? ' standalone' : ''}`} id="pricing">
      <div className="kro-section-head kro-pricing-head">
        <div>
          <p className="kro-eyebrow">Pricing</p>
          <h2>Pro annual is selected by default because real model evaluation needs enough room to be useful.</h2>
          <p>Annual billing is active by default and is 50% cheaper than paying month to month.</p>
        </div>
        <div className="kro-cycle" role="group" aria-label="Billing cycle">
          <button
            type="button"
            data-active={billing === 'monthly' ? 'true' : 'false'}
            onClick={() => {
              setBilling('monthly')
              trackEvent('billing_cycle_change', { billing: 'monthly' })
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            data-active={billing === 'annual' ? 'true' : 'false'}
            onClick={() => {
              setBilling('annual')
              trackEvent('billing_cycle_change', { billing: 'annual' })
            }}
          >
            Annual - 50% off
          </button>
        </div>
      </div>

      <div className="kro-plan-grid">
        {plans.map((plan) => {
          const monthly = billing === 'annual' ? plan.monthlyUsd * 0.5 : plan.monthlyUsd
          const strike = billing === 'annual' ? plan.monthlyUsd : null
          const loadingKey = `plan-${plan.id}-${billing}`

          return (
            <article className="kro-plan-card" data-popular={plan.popular ? 'true' : 'false'} key={plan.id}>
              {plan.popular ? <span className="kro-plan-badge">Default choice</span> : null}
              <h3>{plan.name}</h3>
              <p>{plan.tagline}</p>
              <div className="kro-price-line">
                {formatMoney(monthly)}
                <small>/mo</small>
                {strike ? <span>{formatMoney(strike)}</span> : null}
              </div>
              <strong className="kro-billing-note">
                {billing === 'annual' ? `${formatMoney(monthly * 12)} billed annually` : 'Billed monthly'}
              </strong>
              <ul>
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Check size={15} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={plan.popular ? 'kro-btn kro-btn-primary' : 'kro-btn kro-btn-ghost'}
                onClick={() => void startHostedCheckout(plan.id, billing, loadingKey)}
                onMouseEnter={() => setSelectedPlanId(plan.id)}
                disabled={checkoutLoadingKey !== null}
              >
                {checkoutLoadingKey === loadingKey
                  ? 'Opening secure checkout...'
                  : plan.id === 'pro'
                    ? ctaPrimary
                    : `Open ${plan.name} ${billing}`}
              </button>
                <button
                  type="button"
                  className="kro-btn kro-btn-ghost"
                  onClick={() => void startHostedCheckout(plan.id, billing, `${loadingKey}-wallet`, 'polar')}
                  disabled={checkoutLoadingKey !== null}
                >
                  {checkoutLoadingKey === `${loadingKey}-wallet` ? 'Opening USDC wallet...' : 'Pay with USDC Wallet'}
                </button>
              {selectedPlanId === plan.id ? <span className="kro-plan-selected">Selected</span> : null}
            </article>
          )
        })}
      </div>

      {standalone ? (
        <div className="kro-faq-grid">
          <article>
            <h3>Why is Pro selected first?</h3>
            <p>Most serious teams need enough capacity for model review, batch planning, and onboarding. Starter can feel cheaper but less decisive.</p>
          </article>
          <article>
            <h3>Why annual by default?</h3>
            <p>A model evaluation cycle usually lasts longer than one month, so annual billing is priced at 50% off the monthly run-rate.</p>
          </article>
          <article>
            <h3>Does payment replace this page?</h3>
            <p>No. Checkout opens in a centered Polar popup with the original page blurred in the background.</p>
          </article>
        </div>
      ) : null}
    </section>
  )

  const renderHome = () => {
    const paymentSuccess = new URLSearchParams(search).get('payment') === 'success'

    return (
      <main className="kro-main">
        {paymentSuccess ? (
          <section className="kro-success-banner">
            <CheckCircle2 size={18} />
            Payment received. Kronos AI onboarding will continue from the email used at checkout.
          </section>
        ) : null}

        <section className="kro-hero" id="workspace">
          <div className="kro-hero-copy">
            <p className="kro-eyebrow">Kronos AI forecasting workspace</p>
            <h1>Turn market K-lines into forecast decisions.</h1>
            <p className="kro-lede">
              Kronos AI helps quant teams check OHLCV readiness, choose a forecast lane, and move into Pro annual checkout in one focused flow.
            </p>

            <div className="kro-hero-actions">
              <button type="button" className="kro-btn kro-btn-primary" onClick={() => startDefaultCheckout('hero-pro-annual')}>
                <Rocket size={18} />
                {ctaPrimary}
              </button>
              <button
                type="button"
                className="kro-btn kro-btn-ghost"
                onClick={() => {
                  trackEvent('pricing_review', { source: 'hero-secondary' })
                  scrollToHashTarget('#pricing')
                }}
              >
                <Gauge size={18} />
                {ctaSecondary}
              </button>
              <button type="button" className="kro-btn kro-btn-subtle" onClick={() => openPage('/kronos-github')}>
                <Github size={18} />
                Inspect GitHub path
              </button>
            </div>
            <p className="kro-payment-note">
              <CheckCircle2 size={16} />
              Pro annual is selected. Annual saves 50%.
            </p>

            <div className="kro-trust-row">
              {trustLinks.map((link) => (
                <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                  {link.icon}
                  {link.label}
                  <ExternalLink size={13} />
                </a>
              ))}
            </div>

            <div className="kro-hero-proof">
              <div>
                <span>Default workflow</span>
                <strong>Fit check to Pro annual to Polar popup to homepage return</strong>
              </div>
              <div>
                <span>Model context</span>
                <strong>OHLCV tokenizer, autoregressive forecast, batch review notes</strong>
              </div>
            </div>
          </div>

          {renderForecastPanel()}
        </section>

        <section className="kro-proof-strip" id="proof" aria-label="Kronos proof points">
          {proofItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="kro-section">
          <div className="kro-section-head">
            <p className="kro-eyebrow">Why it works</p>
            <h2>The first screen answers the practical question: will my market data fit a Kronos workflow?</h2>
            <p>
              People arriving from GitHub or model searches usually need a fast fit check, not another abstract model overview.
            </p>
          </div>

          <div className="kro-card-grid">
            {workflowCards.map((card) => (
              <article className="kro-card" key={card.title}>
                <div className="kro-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="kro-section kro-signal-section">
          <div className="kro-section-head">
            <p className="kro-eyebrow">Forecast discipline</p>
            <h2>Kronos AI is strongest when it is treated as a review layer, not a shortcut around risk.</h2>
          </div>
          <div className="kro-signal-grid">
            <article>
              <Clock3 size={20} />
              <h3>Respect context length</h3>
              <p>Shorter windows move faster. Longer windows need truncation, sampling, and validation discipline.</p>
            </article>
            <article>
              <BarChart3 size={20} />
              <h3>Compare path shape</h3>
              <p>Do not sell a single price. Show ranges, volatility, and how the forecast path behaves.</p>
            </article>
            <article>
              <Zap size={20} />
              <h3>Keep the workflow in view</h3>
              <p>Checkout opens in a popup and keeps the product page visible while payment is completed.</p>
            </article>
          </div>
        </section>

        {renderPricingSection(false)}

        <section className="kro-section">
          <div className="kro-section-head">
            <p className="kro-eyebrow">Find the right Kronos page</p>
            <h2>Each common search path gets a clear answer before the next step.</h2>
            <p>AI, GitHub, login, HR, mythology, company, software, and golf searches all carry different intent. The pages below sort that out quickly.</p>
          </div>
          <div className="kro-guide-grid">
            {[
              ...keywordPages,
              {
                path: '/pricing',
                eyebrow: 'Pricing',
                h1: 'Kronos AI pricing',
                intent: 'Choose Starter, Pro, or Scale with Pro annual already selected.',
              },
            ].map((page) => (
              <a
                className="kro-guide-card"
                href={page.path}
                key={page.path}
                onClick={(event) => {
                  event.preventDefault()
                  openPage(page.path)
                }}
              >
                <span>{page.eyebrow}</span>
                <strong>{page.h1}</strong>
                <p>{page.intent}</p>
                <ChevronRight size={18} />
              </a>
            ))}
          </div>
        </section>
      </main>
    )
  }

  const renderKeywordPage = (page: KeywordPage) => (
    <main className="kro-main">
      <article className="kro-article">
        <a
          className="kro-back-link"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <ArrowRight size={16} />
          Back to Kronos AI
        </a>
        <p className="kro-eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p className="kro-lede">{page.lede}</p>
        <div className="kro-article-intent">
          <strong>Best for</strong>
          <span>{page.intent}</span>
        </div>

        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section>
          <h2>Common questions</h2>
          <div className="kro-faq-list">
            {page.faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="kro-article-cta">
          <div>
            <p className="kro-eyebrow">Recommended next step</p>
            <h2>Keep the product page open and start Pro annual only when the fit is clear.</h2>
            <p>Checkout stays in a centered Polar popup, with annual billing selected by default.</p>
          </div>
          <div className="kro-article-cta-actions">
            <button type="button" className="kro-btn kro-btn-primary" onClick={() => startDefaultCheckout(`article-${page.path}`)}>
              <Play size={18} />
              {page.ctaLabel}
            </button>
            <button type="button" className="kro-btn kro-btn-ghost" onClick={() => navigate('/pricing')}>
              <TrendingUp size={18} />
              Review plans
            </button>
          </div>
        </aside>
      </article>
    </main>
  )

  const renderPricingPage = () => (
    <main className="kro-main">
      <section className="kro-pricing-page-hero">
        <p className="kro-eyebrow">Pricing</p>
        <h1>Kronos AI pricing starts with the middle plan selected and annual billing already on.</h1>
        <p className="kro-lede">
          The plan table keeps choice clear: Starter for one lane, Pro for serious evaluation, Scale for production gates. Payment opens in a centered Polar popup.
        </p>
      </section>
      {renderPricingSection(true)}
    </main>
  )

  const renderLegalPage = (title: string, intro: string, sections: typeof legalPrivacySections) => (
    <main className="kro-main">
      <article className="kro-article">
        <p className="kro-eyebrow">Legal</p>
        <h1>{title}</h1>
        <p className="kro-lede">{intro}</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  )

  const renderNotFound = () => (
    <main className="kro-main">
      <section className="kro-center-card">
        <p className="kro-eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="kro-muted">That route is not available.</p>
        <button type="button" className="kro-btn kro-btn-primary" onClick={() => navigate('/')}>
          Return home
        </button>
      </section>
    </main>
  )

  let body: React.ReactNode
  if (routeView === 'home' && normalizedPath === '/') {
    body = renderHome()
  } else if (routeView === 'keyword' && keywordPage) {
    body = renderKeywordPage(keywordPage)
  } else if (routeView === 'pricing') {
    body = renderPricingPage()
  } else if (routeView === 'privacy') {
    body = renderLegalPage(
      'Privacy Policy',
      'This policy covers how the managed Kronos AI site handles analytics, checkout, and related user interactions.',
      legalPrivacySections,
    )
  } else if (routeView === 'terms') {
    body = renderLegalPage(
      'Terms of Service',
      'These terms describe the limits and responsibilities of the managed Kronos AI site and its hosted payment flow.',
      legalTermsSections,
    )
  } else if (routeView === 'checkout-done') {
    body = <CheckoutDoneBridge publicAppOrigin={publicAppOrigin} />
  } else {
    body = renderNotFound()
  }

  return (
    <div className="kro-shell">
      <div className="kro-page-texture" aria-hidden />
      {renderHeader()}
      {body}
      {renderCheckoutModal()}
      <footer className="kro-footer">
        <div className="kro-footer-inner">
          <span>Kronos AI</span>
          <a
            href="/privacy"
            onClick={(event) => {
              event.preventDefault()
              navigate('/privacy')
            }}
          >
            Privacy
          </a>
          <a
            href="/terms"
            onClick={(event) => {
              event.preventDefault()
              navigate('/terms')
            }}
          >
            Terms
          </a>
          <a href="https://github.com/shiyu-coder/Kronos" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://arxiv.org/abs/2508.02739" target="_blank" rel="noreferrer">
            Paper
          </a>
        </div>
      </footer>
    </div>
  )
}
