export type KeywordSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type KeywordFaq = {
  question: string
  answer: string
}

export type KeywordPage = {
  path: string
  eyebrow: string
  title: string
  description: string
  h1: string
  lede: string
  intent: string
  ctaLabel: string
  sections: KeywordSection[]
  faqs: KeywordFaq[]
}

export const keywordPages: KeywordPage[] = [
  {
    path: '/kronos-ai',
    eyebrow: 'Kronos AI',
    title: 'Kronos AI for Financial K-Line Forecasting',
    description:
      'Understand how Kronos AI applies financial K-line foundation modeling to OHLCV forecasting, volatility review, synthetic data checks, and quant workflow planning.',
    h1: 'Kronos AI for teams turning market candles into forecast decisions',
    lede:
      'Kronos AI is best understood as a financial-market language model workflow: it reads OHLCV candles as structured sequences, then helps teams reason about price paths, volatility, and rollout risk before a model touches production.',
    intent: 'For traders, researchers, and product teams evaluating Kronos as an AI forecasting layer rather than a generic time-series demo.',
    ctaLabel: 'Run the forecast fit check',
    sections: [
      {
        heading: 'What makes Kronos AI different',
        paragraphs: [
          'Most time-series tools start from generic numerical sequences. Kronos starts from the shape of financial candles: open, high, low, close, volume, amount, timestamps, and the noise patterns that appear when real markets move.',
          'The original open-source work describes a tokenizer for continuous K-line data and an autoregressive Transformer trained on large multi-market candle history. That matters because the model is built around the way traders and quant systems already structure market observations.',
        ],
        bullets: [
          'Useful when your raw material is OHLCV data, not clean business metrics.',
          'Useful when the question is forecast distribution and risk review, not a single magic price.',
          'Useful when you need a bridge from research notebooks to a repeatable decision workflow.',
        ],
      },
      {
        heading: 'How to evaluate it before buying infrastructure',
        paragraphs: [
          'Start by checking whether your market, cadence, columns, and forecast horizon match the assumptions of a K-line model. The workspace does that first so the plan choice comes after the obvious fit questions are answered.',
          'If your team has clean OHLCV history, consistent timestamps, and a clear review loop for predictions, the managed Pro path usually makes more sense than a long self-hosting detour.',
        ],
      },
      {
        heading: 'Where it should sit in a stack',
        paragraphs: [
          'Kronos AI should not be sold as a black-box trading signal. The practical position is a forecast and scenario layer that feeds model review, portfolio research, volatility monitoring, and synthetic-data sanity checks.',
          'The best production teams keep the model behind evaluation gates: backtests, walk-forward validation, slippage assumptions, risk limits, and human review for high-impact decisions.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Kronos AI a trading bot?',
        answer:
          'No. It is better treated as a forecasting and research workflow for financial K-line data. Execution, portfolio construction, and risk controls still need their own systems.',
      },
      {
        question: 'Does Kronos AI need volume data?',
        answer:
          'The open-source examples can work with required OHLC columns and optional volume or amount fields. Cleaner volume and amount history usually gives teams more context to review.',
      },
      {
        question: 'Which plan is the default?',
        answer:
          'Pro annual is selected by default because most serious evaluation teams need more than a tiny trial lane, and annual billing is 50% cheaper than the monthly run-rate.',
      },
    ],
  },
  {
    path: '/kronos-github',
    eyebrow: 'Kronos GitHub',
    title: 'Kronos GitHub Guide and Managed Workflow',
    description:
      'A practical guide to the Kronos GitHub project, model choices, repository evaluation, and when a managed Kronos AI workspace is worth using.',
    h1: 'Kronos GitHub is the right first stop. The workspace is the faster operating path.',
    lede:
      'The public Kronos repository is where technical teams should inspect the model, examples, license, and finetuning path. This managed site exists for the next step: turning that research surface into a repeatable forecast workflow.',
    intent: 'For users searching the repository who need a quick path from code review to an operational Kronos forecasting setup.',
    ctaLabel: 'Open Pro annual checkout',
    sections: [
      {
        heading: 'What to inspect on GitHub',
        paragraphs: [
          'Start with the model loading examples, predictor API, batch prediction support, finetuning scripts, and license. These tell you whether the project can fit your internal research process without rewriting your entire data pipeline.',
          'Kronos is open source under the MIT license, so teams can evaluate the model before using a managed workflow. That transparency is a strong trust signal for technical teams.',
        ],
        bullets: [
          'Check the tokenizer and model names you plan to load.',
          'Check context length limits before choosing a lookback window.',
          'Check whether your data includes required OHLC columns and stable timestamps.',
          'Check finetuning scripts only after a baseline forecast workflow is already clear.',
        ],
      },
      {
        heading: 'When GitHub is enough',
        paragraphs: [
          'If your team only needs a notebook experiment, the repository may be enough. You can load a model, prepare a DataFrame, and inspect forecast outputs locally.',
          'GitHub stops being enough when the decision moves from code curiosity to repeatable review: team access, plan selection, audit-friendly analytics, onboarding, and hosted payment all become part of the product experience.',
        ],
      },
      {
        heading: 'How this site complements the repo',
        paragraphs: [
          'The site keeps the first step close to the actual task. It checks data readiness, produces an implementation path, and opens checkout in a popup so the original page stays available for comparison.',
          'That flow is especially useful for users who already trust the repository but need a commercial path that does not feel like a generic SaaS landing page.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this the official Kronos GitHub repository?',
        answer:
          'No. This is a managed SaaS workflow around Kronos-style financial K-line forecasting. The public repository remains the place to inspect upstream code and research materials.',
      },
      {
        question: 'Should I self-host from GitHub or use the managed workspace?',
        answer:
          'Self-host if you need full control and have ML operations capacity. Use the managed workflow when speed, onboarding, checkout, and repeatable review matter more than owning every moving part.',
      },
      {
        question: 'Can I still cite the original paper?',
        answer:
          'Yes. Research or academic usage should cite the upstream Kronos paper and repository rather than this commercial workflow.',
      },
    ],
  },
  {
    path: '/kronos-login',
    eyebrow: 'Kronos Login',
    title: 'Kronos Login for the AI Forecast Workspace',
    description:
      'Find the right Kronos login path and avoid confusing Kronos AI financial forecasting with unrelated workforce, HR, or timekeeping products.',
    h1: 'Kronos login: use the right door for the product you actually need',
    lede:
      'Kronos is a crowded name. If you are trying to access workforce scheduling or payroll, you are likely looking for a different provider. If you are evaluating financial K-line forecasting, this page points you toward the Kronos AI workspace path.',
    intent: 'For searchers who typed Kronos login and need to quickly distinguish financial forecasting access from HR or workforce portals.',
    ctaLabel: 'Start the workspace plan',
    sections: [
      {
        heading: 'If you need an HR or timekeeping login',
        paragraphs: [
          'This site is not a workforce management or payroll portal. We do not provide employee clock-in, HR scheduling, or legacy enterprise workforce login support.',
          'For those tools, use the login link provided by your employer or the vendor listed in your company documentation. That is safer than following a random search result with a familiar name.',
        ],
      },
      {
        heading: 'If you need the Kronos AI workspace',
        paragraphs: [
          'The forecasting workspace starts from plan selection and hosted checkout. Pro annual is selected by default because most teams evaluating financial models need enough room for real OHLCV data review, not only a small demo.',
          'Checkout opens in a centered Polar window while this page stays in place. After payment succeeds, the popup returns you to the homepage so onboarding can continue without losing context.',
        ],
      },
      {
        heading: 'How to reduce login confusion for a team',
        paragraphs: [
          'Bookmark the exact product domain, keep vendor names clear in internal docs, and avoid using “Kronos” by itself when you mean a specific system.',
          'For financial teams, use labels such as Kronos AI, K-line forecasting workspace, or Kronos market model to make the destination obvious.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I log into an employee Kronos account here?',
        answer:
          'No. This site is for a financial forecasting SaaS workflow and is not connected to employee HR, payroll, or timekeeping accounts.',
      },
      {
        question: 'Why does checkout open in a popup?',
        answer:
          'It lets you finish Polar payment while keeping the product page available in the background, which reduces accidental drop-off during plan review.',
      },
      {
        question: 'What happens after payment succeeds?',
        answer:
          'The checkout completion route returns you to the homepage, where the onboarding state can continue from the email used at checkout.',
      },
    ],
  },
  {
    path: '/kronos-hr',
    eyebrow: 'Kronos HR',
    title: 'Kronos HR vs Kronos AI',
    description:
      'Clarify the difference between Kronos HR searches and Kronos AI financial market forecasting so users reach the correct product faster.',
    h1: 'Kronos HR is usually a workforce search. Kronos AI is a market forecasting workflow.',
    lede:
      'People search “Kronos HR” when they need employee scheduling, payroll, or timekeeping help. This site is different: it focuses on AI-assisted financial K-line forecasting and model evaluation.',
    intent: 'For users who need a clear, non-confusing split between HR systems and financial-market AI software.',
    ctaLabel: 'Check market-model fit',
    sections: [
      {
        heading: 'The fast distinction',
        paragraphs: [
          'HR Kronos searches usually involve employees, shifts, managers, clock-in records, payroll, and workforce administration.',
          'Kronos AI searches usually involve candles, OHLCV data, forecast horizons, volatility, model selection, and quant research workflows.',
        ],
        bullets: [
          'Need payroll or scheduling: use your employer-provided HR link.',
          'Need market forecasting: use the Kronos AI workspace and pricing flow here.',
          'Need upstream code: inspect the open-source Kronos repository first.',
        ],
      },
      {
        heading: 'Why the distinction matters',
        paragraphs: [
          'A useful page should help the wrong visitor leave safely and help the right visitor move faster. Mixing HR searches with financial AI copy wastes time for both groups.',
          'That is why this page answers the HR question directly before presenting the market-model path.',
        ],
      },
      {
        heading: 'What financial teams can do next',
        paragraphs: [
          'Use the homepage readiness check to map your asset class, candle interval, data columns, and forecast horizon. If the fit is strong, Pro annual is the recommended default path.',
          'If the fit is weak, fix data quality first. A clearer dataset beats a larger checkout every time.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Kronos AI an HR product?',
        answer:
          'No. Kronos AI on this site is a financial-market forecasting workflow, not an employee scheduling or payroll system.',
      },
      {
        question: 'Can HR teams use this site?',
        answer:
          'Only if they are evaluating financial K-line forecasting for a separate business use case. It does not solve workforce administration tasks.',
      },
      {
        question: 'Why keep an HR page at all?',
        answer:
          'Because it helps users who arrive through an ambiguous search identify the right destination quickly, without pretending this product does HR.',
      },
    ],
  },
  {
    path: '/kronos-mythology',
    eyebrow: 'Kronos Mythology',
    title: 'Kronos Mythology and the Product Name',
    description:
      'A concise explanation of Kronos mythology searches and how the time-oriented name connects to financial forecasting without confusing the product.',
    h1: 'Kronos mythology points to time. Kronos AI turns time into market context.',
    lede:
      'In mythology searches, Kronos is associated with time, succession, and cycles. In this product context, the name works because financial candles are also a language of time: repeated intervals, changing regimes, and decisions made under uncertainty.',
    intent: 'For users researching the name who may still be curious about the financial forecasting product behind it.',
    ctaLabel: 'See the forecasting workspace',
    sections: [
      {
        heading: 'Why the name fits the workflow',
        paragraphs: [
          'Financial markets are not static tables. They are time-ordered sequences where the same shape can mean different things depending on context, interval, liquidity, and recent volatility.',
          'Kronos AI leans into that idea by treating K-lines as a sequence language rather than isolated rows in a spreadsheet.',
        ],
      },
      {
        heading: 'What the name should not imply',
        paragraphs: [
          'The mythology connection is a naming cue, not a claim of prediction certainty. Good financial forecasting still needs validation, risk limits, and humility around changing market regimes.',
          'The product is not a mythology site, a history database, or a general encyclopedia. It is a market-model workflow for people who need to evaluate financial time-series decisions.',
        ],
      },
      {
        heading: 'From curiosity to evaluation',
        paragraphs: [
          'If you came here through a name search and actually need software, start with the homepage readiness check. It gives you a fast answer on whether your data shape is suitable for a Kronos-style model workflow.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this a mythology website?',
        answer:
          'No. This page answers the name-search intent, but the site itself is about financial K-line forecasting software.',
      },
      {
        question: 'Does Kronos AI predict the future with certainty?',
        answer:
          'No. It supports forecast review and scenario analysis. Any production use should include independent evaluation and risk controls.',
      },
      {
        question: 'Why include this page?',
        answer:
          'Because the name has multiple meanings. A useful page should clarify that quickly instead of forcing visitors to guess.',
      },
    ],
  },
  {
    path: '/kronos-company',
    eyebrow: 'Kronos Company',
    title: 'Kronos Company Search Guide',
    description:
      'A practical guide for users searching Kronos company, including how to distinguish this financial AI SaaS from unrelated companies with similar names.',
    h1: 'Kronos company searches need context before they need a pitch',
    lede:
      'There are multiple organizations and products using the Kronos name. This site is a managed Kronos AI workflow for financial K-line forecasting, not a workforce management company, golf brand, or general corporate portal.',
    intent: 'For users trying to identify which Kronos company or product matches their intent.',
    ctaLabel: 'Evaluate Kronos AI',
    sections: [
      {
        heading: 'How to tell which Kronos you need',
        paragraphs: [
          'Look at the nouns around the search. HR, payroll, workforce, shifts, and timekeeping point to workforce software. Golf points to a sports-related intent. OHLCV, candles, forecasting, GitHub, AI, and paper point toward the financial model workflow.',
          'This page exists to make that distinction clear before sending people deeper into the product.',
        ],
      },
      {
        heading: 'What this company-style site offers',
        paragraphs: [
          'Kronos AI packages a financial forecasting evaluation flow: dataset fit, model rollout guidance, pricing, hosted checkout, analytics, and useful explainers for common search intents.',
          'The managed path is built for teams that already see promise in the open-source model but need a faster commercial route.',
        ],
      },
      {
        heading: 'Trust signals to check',
        paragraphs: [
          'Before paying for any model workflow, review the upstream repository, understand the model limits, check the data assumptions, and confirm the checkout provider and return flow.',
          'The site keeps those trust signals visible because serious teams move faster when the next step feels calm and reversible.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Kronos AI affiliated with other Kronos-named companies?',
        answer:
          'No affiliation is implied. This site is focused on a financial-market AI workflow and helps users avoid confusing similarly named products.',
      },
      {
        question: 'What is the commercial offer?',
        answer:
          'The commercial offer is a managed Kronos AI forecasting workspace with Pro annual selected by default and annual billing discounted by 50%.',
      },
      {
        question: 'Where should technical teams start?',
        answer:
          'Technical teams should inspect the open-source repository, then use the homepage readiness check to decide whether a managed workflow is worth starting.',
      },
    ],
  },
  {
    path: '/kronos-software',
    eyebrow: 'Kronos Software',
    title: 'Kronos Software for Financial Forecasting',
    description:
      'Compare Kronos software intents and learn when Kronos AI fits financial forecasting, K-line model review, and managed quant workflows.',
    h1: 'Kronos software can mean many things. Kronos AI means market candles first.',
    lede:
      'If your search is about software for employee timekeeping, this is not that product. If your search is about AI software for financial K-line forecasting, this page explains the workflow and the buying path.',
    intent: 'For users searching broad Kronos software terms and needing a concrete software path.',
    ctaLabel: 'Review plans',
    sections: [
      {
        heading: 'Core software workflow',
        paragraphs: [
          'The workflow starts with OHLCV readiness, then moves into forecast horizon selection, model size, batch review, volatility concern, and deployment confidence.',
          'That is a better sequence than forcing every visitor directly into pricing. Teams can see whether the product fits their data before the card details appear.',
        ],
        bullets: [
          'Readiness check for market, cadence, columns, and horizon.',
          'Forecast plan output with model suggestion and rollout notes.',
          'Pricing that defaults to Pro annual with a 50% annual discount.',
          'Polar checkout in a centered popup so the page stays open.',
        ],
      },
      {
        heading: 'What the software is not',
        paragraphs: [
          'It is not a broker, exchange, or execution venue. It is not HR software. It is not a promise of guaranteed alpha.',
          'The strongest positioning is a research-to-review workflow for teams that already understand financial data quality and model risk.',
        ],
      },
      {
        heading: 'What makes it useful in practice',
        paragraphs: [
          'The page gives a team enough context to move without feeling trapped: what data is needed, what the model does, what plan is default, and how payment behaves.',
          'That reduces confusion and keeps the next step tied to a real evaluation workflow.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Kronos software cloud-based?',
        answer:
          'This managed site is built for a cloud workflow on Cloudflare, with Workers handling API routes and checkout while static pages stay fast and indexable.',
      },
      {
        question: 'Can it process multiple assets?',
        answer:
          'Kronos-style workflows can support batch prediction when input sequences share the same history length and forecast length. The managed evaluation flow helps teams plan that before rollout.',
      },
      {
        question: 'What is the easiest next step?',
        answer:
          'Use the homepage fit check, then start Pro annual if the output says the data and horizon are ready.',
      },
    ],
  },
  {
    path: '/kronos-golf',
    eyebrow: 'Kronos Golf',
    title: 'Kronos Golf Search Clarifier',
    description:
      'Clarify Kronos Golf searches and route users who intended Kronos AI toward the financial K-line forecasting workspace.',
    h1: 'Kronos Golf is a different search intent. Kronos AI is for financial forecasts.',
    lede:
      'If you were looking for golf equipment, apparel, lessons, or a sports brand, this is not the right destination. If you meant the AI market-model workflow, the useful path is below.',
    intent: 'For users who arrive through a mismatched Kronos Golf query and need a clean route to the correct product.',
    ctaLabel: 'Go to Kronos AI',
    sections: [
      {
        heading: 'The quick answer',
        paragraphs: [
          'This site does not sell golf products or provide golf services. It uses the Kronos name for a financial AI workspace focused on K-line forecasting.',
          'The fastest way to decide whether you are in the right place is to look for your data shape: if you have candles, OHLCV history, forecast horizons, and portfolio review needs, you are probably close.',
        ],
      },
      {
        heading: 'Why this page still exists',
        paragraphs: [
          'Broad brand-name searches often mix unrelated intents. A useful page should not pretend every visitor needs the same product. It should help the wrong visitor leave quickly and help the right visitor understand the next step.',
        ],
      },
      {
        heading: 'For financial users who landed here accidentally',
        paragraphs: [
          'Start with Kronos AI, GitHub, or software pages if you need model context. Start with pricing only if you already know your data is ready and you want the managed Pro annual path.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does this site provide Kronos Golf support?',
        answer:
          'No. It is unrelated to golf products or services and focuses on financial K-line forecasting.',
      },
      {
        question: 'Where should financial users go next?',
        answer:
          'Use the homepage readiness check or the Kronos AI page to understand whether your OHLCV data fits the workflow.',
      },
      {
        question: 'Why not redirect this page away?',
        answer:
          'A direct clarification is more helpful and safer than sending users to a product page before they understand the mismatch.',
      },
    ],
  },
]

export function findKeywordPageByPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return keywordPages.find((page) => page.path === normalized) ?? null
}
