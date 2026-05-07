export type PlanId = 'starter' | 'pro' | 'scale'

export type Option<T extends string = string> = {
  id: T
  label: string
  summary: string
}

export type PlannerSelection = {
  market: 'crypto' | 'equities' | 'futures' | 'multi'
  cadence: 'intraday' | 'hourly' | 'daily'
  quality: 'clean' | 'mixed' | 'fragile'
  horizon: 'session' | 'week' | 'month'
  objective: 'price' | 'volatility' | 'synthetic' | 'portfolio'
  rollout: 'research' | 'desk' | 'production'
}

export type PlannerResult = {
  fitScore: number
  fitLabel: string
  headline: string
  proofLine: string
  recommendedPlanId: PlanId
  modelLane: string
  forecastWindow: string
  confidence: string
  reasons: string[]
  watchouts: string[]
  modules: Array<{ label: string; detail: string }>
  nextSteps: string[]
  operatorMessage: string
}

export const marketOptions: Option<PlannerSelection['market']>[] = [
  { id: 'crypto', label: 'Crypto', summary: '24/7 candles, fast regime changes, strong fit for short horizon demos.' },
  { id: 'equities', label: 'Equities', summary: 'Session-aware OHLCV with cleaner review loops and benchmark context.' },
  { id: 'futures', label: 'Futures', summary: 'Macro-sensitive contracts where volatility and rollover notes matter.' },
  { id: 'multi', label: 'Multi-market', summary: 'Cross-asset review across venues, symbols, and data vendors.' },
]

export const cadenceOptions: Option<PlannerSelection['cadence']>[] = [
  { id: 'intraday', label: '5-15 min', summary: 'Higher signal density, but data quality and latency checks matter.' },
  { id: 'hourly', label: 'Hourly', summary: 'Balanced context window for model review and operator decisions.' },
  { id: 'daily', label: 'Daily', summary: 'Cleaner research cadence for portfolio and factor review.' },
]

export const qualityOptions: Option<PlannerSelection['quality']>[] = [
  { id: 'clean', label: 'Clean OHLCV', summary: 'Required candle columns, aligned timestamps, and stable history.' },
  { id: 'mixed', label: 'Some gaps', summary: 'Mostly usable history with missing rows, venue drift, or outlier patches.' },
  { id: 'fragile', label: 'Needs cleanup', summary: 'Unstable columns or timestamps that should be fixed before checkout.' },
]

export const horizonOptions: Option<PlannerSelection['horizon']>[] = [
  { id: 'session', label: 'Next session', summary: 'Short window forecast review and intraday risk notes.' },
  { id: 'week', label: '1-5 days', summary: 'Operational horizon for team review and watchlist planning.' },
  { id: 'month', label: '20-30 days', summary: 'Longer scenario review where drift and validation become central.' },
]

export const objectiveOptions: Option<PlannerSelection['objective']>[] = [
  { id: 'price', label: 'Price paths', summary: 'Forecast likely OHLC movement and compare alternative paths.' },
  { id: 'volatility', label: 'Volatility', summary: 'Review volatility risk and confidence before sizing decisions.' },
  { id: 'synthetic', label: 'Synthetic data', summary: 'Generate market-like candles for stress tests and validation.' },
  { id: 'portfolio', label: 'Portfolio signal', summary: 'Turn forecasts into research signals before portfolio controls.' },
]

export const rolloutOptions: Option<PlannerSelection['rollout']>[] = [
  { id: 'research', label: 'Research', summary: 'Notebook-to-review workflow with lightweight governance.' },
  { id: 'desk', label: 'Desk review', summary: 'Repeatable review loop for analysts, PMs, or trading teams.' },
  { id: 'production', label: 'Production gate', summary: 'Higher-touch controls, monitoring, and rollout documentation.' },
]

export const defaultPlannerSelection: PlannerSelection = {
  market: 'crypto',
  cadence: 'hourly',
  quality: 'clean',
  horizon: 'week',
  objective: 'price',
  rollout: 'desk',
}

export function analyzePlannerSelection(selection: PlannerSelection): PlannerResult {
  let score = 78
  const reasons: string[] = []
  const watchouts: string[] = []

  if (selection.quality === 'clean') {
    score += 10
    reasons.push('Your data profile has the required OHLCV shape and aligned timestamps.')
  } else if (selection.quality === 'mixed') {
    score -= 8
    reasons.push('The workflow can start, but gap handling should be documented before rollout.')
    watchouts.push('Repair missing candles and venue outliers before comparing model runs.')
  } else {
    score -= 24
    watchouts.push('Data cleanup should happen before a serious paid rollout.')
  }

  if (selection.market === 'crypto') {
    score += 4
    reasons.push('Crypto candles are a strong first demo because 24/7 history keeps the sequence continuous.')
  }
  if (selection.market === 'multi') {
    score += 2
    watchouts.push('Multi-market review needs consistent history length for fair batch comparisons.')
  }

  if (selection.cadence === 'hourly') {
    score += 6
    reasons.push('Hourly candles usually balance context length with review speed.')
  } else if (selection.cadence === 'intraday') {
    score += 2
    watchouts.push('Intraday runs need stricter timestamp and liquidity checks.')
  } else {
    score -= 2
    watchouts.push('Daily candles are easier to review but may need longer validation windows.')
  }

  if (selection.horizon === 'month') {
    score -= 8
    watchouts.push('Longer horizons should be treated as scenario review, not precise point forecasts.')
  } else if (selection.horizon === 'session') {
    score += 2
  }

  if (selection.objective === 'volatility') {
    score += 4
    reasons.push('Volatility review is a natural Kronos-style downstream task.')
  }
  if (selection.objective === 'synthetic') {
    score -= 2
    watchouts.push('Synthetic K-line generation should be validated against real market distribution checks.')
  }
  if (selection.objective === 'portfolio') {
    score += 1
    watchouts.push('Portfolio signals still need optimization, risk factor controls, and transaction-cost assumptions.')
  }

  if (selection.rollout === 'production') {
    score -= selection.quality === 'clean' ? 2 : 10
    watchouts.push('Production use should include monitoring, backtests, slippage assumptions, and human review.')
  } else if (selection.rollout === 'desk') {
    score += 5
    reasons.push('Desk review is the best default stage before model output affects capital allocation.')
  }

  score = Math.max(38, Math.min(96, score))

  const recommendedPlanId: PlanId = selection.rollout === 'production' || selection.market === 'multi' ? 'scale' : 'pro'
  const fitLabel = score >= 86 ? 'Strong fit' : score >= 72 ? 'Good fit' : score >= 58 ? 'Fix data first' : 'Research only'
  const confidence = score >= 86 ? 'High' : score >= 72 ? 'Moderate' : 'Cautious'
  const forecastWindow =
    selection.horizon === 'session' ? 'next market session' : selection.horizon === 'week' ? '1-5 trading days' : '20-30 trading days'
  const modelLane =
    selection.cadence === 'intraday'
      ? 'Kronos-small with strict context checks'
      : selection.quality === 'fragile'
        ? 'Tokenizer/data audit before model choice'
        : 'Kronos-base evaluation lane'

  const modules = [
    { label: 'Input contract', detail: 'OHLC required, volume and amount recommended when available.' },
    { label: 'Forecast desk', detail: `${forecastWindow} review with ${confidence.toLowerCase()} confidence.` },
    { label: 'Model lane', detail: modelLane },
    { label: 'Risk review', detail: selection.objective === 'portfolio' ? 'Signal review before portfolio construction.' : 'Scenario and volatility checks before action.' },
  ]

  const nextSteps = [
    'Upload or connect a clean OHLCV sample with aligned timestamps.',
    `Run a ${forecastWindow} baseline and compare paths against recent realized candles.`,
    'Document whether outputs are used for research, desk review, or production gates.',
    'Start Pro annual unless multi-market production controls are already required.',
  ]

  return {
    fitScore: score,
    fitLabel,
    headline:
      score >= 72
        ? 'This is ready for a managed Kronos AI evaluation.'
        : 'Fix the data contract before treating checkout as the next step.',
    proofLine:
      score >= 72
        ? 'The workflow has enough clarity to make Pro annual a natural next step.'
        : 'The data issue should be fixed before pricing becomes the main decision.',
    recommendedPlanId,
    modelLane,
    forecastWindow,
    confidence,
    reasons,
    watchouts: watchouts.length ? watchouts : ['Keep the first rollout in review mode until backtests and risk checks are documented.'],
    modules,
    nextSteps,
    operatorMessage:
      recommendedPlanId === 'scale'
        ? 'Use Pro annual for the first evaluation, then move to Scale when production controls are confirmed.'
        : 'Pro annual is the cleanest default for a real Kronos AI evaluation.',
  }
}
