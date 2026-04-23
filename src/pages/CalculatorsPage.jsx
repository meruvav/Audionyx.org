import { useMemo, useState } from 'react';
import Panel from '../components/Panel';
import SeoBlock from '../components/SeoBlock';

const keypad = [
  ['sin', 'cos', 'tan', 'pi', 'e'],
  ['x^y', 'x^3', 'x^2', 'exp', '10^x'],
  ['sqrt', 'cbrt', '(', ')', 'ln'],
  ['1/x', '%', 'n!', 'log', 'Back'],
  ['7', '8', '9', '/', 'AC'],
  ['4', '5', '6', '*', 'Ans'],
  ['1', '2', '3', '-', '+/-'],
  ['0', '.', '+', '=', 'Rnd'],
];

const calculatorCatalog = [
  { id: 'scientific', title: 'Scientific Calculator', keywords: 'math trig log exponent' },
  { id: 'percentage', title: 'Percentage Calculator', keywords: 'percent increase decrease' },
  { id: 'discount', title: 'Discount Calculator', keywords: 'sale price retail' },
  { id: 'loan', title: 'Loan Payment Calculator', keywords: 'finance emi payment interest' },
  { id: 'savings', title: 'Savings Growth Calculator', keywords: 'investment future value' },
  { id: 'tip', title: 'Tip Split Calculator', keywords: 'restaurant split bill' },
  { id: 'bmi', title: 'BMI Calculator', keywords: 'health body mass' },
  { id: 'bmr', title: 'BMR Calculator', keywords: 'calorie metabolic' },
  { id: 'pace', title: 'Running Pace Calculator', keywords: 'fitness running marathon' },
  { id: 'age', title: 'Age Calculator', keywords: 'birthday years months days' },
  { id: 'datediff', title: 'Date Difference Calculator', keywords: 'calendar range duration' },
  { id: 'gpa', title: 'GPA Calculator', keywords: 'school grades average' },
  { id: 'unit', title: 'Unit Converter', keywords: 'length miles km feet meters' },
  { id: 'random', title: 'Random Number Generator', keywords: 'rng lottery' },
];

function factorial(n) {
  if (!Number.isInteger(n) || n < 0 || n > 170) {
    throw new Error('Factorial input out of range');
  }

  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
}

function evaluateExpression(expression, ans) {
  let prepared = expression
    .replace(/\s+/g, '')
    .replace(/Ans/g, String(ans))
    .replace(/÷/g, '/')
    .replace(/×/g, '*')
    .replace(/pi/g, 'PI')
    .replace(/\be\b/g, 'E')
    .replace(/\^/g, '**');

  prepared = prepared
    .replace(/sqrt\(/g, 'sqrt(')
    .replace(/cbrt\(/g, 'cbrt(')
    .replace(/ln\(/g, 'ln(')
    .replace(/log\(/g, 'log10(')
    .replace(/sin\(/g, 'sin(')
    .replace(/cos\(/g, 'cos(')
    .replace(/tan\(/g, 'tan(')
    .replace(/(\d+(\.\d+)?)!/g, (_, value) => `factorial(${value})`);

  if (!/^[0-9+\-*/%.(),A-Za-z*]+$/.test(prepared)) {
    throw new Error('Unsafe expression');
  }

  const fn = new Function(
    'factorial',
    'sin',
    'cos',
    'tan',
    'sqrt',
    'cbrt',
    'ln',
    'log10',
    'PI',
    'E',
    `return ${prepared};`,
  );

  return fn(
    factorial,
    Math.sin,
    Math.cos,
    Math.tan,
    Math.sqrt,
    Math.cbrt,
    Math.log,
    Math.log10,
    Math.PI,
    Math.E,
  );
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return 'Invalid';
  }
  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

function monthsBetween(start, end) {
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) {
    months -= 1;
  }
  return Math.max(months, 0);
}

function daysBetween(start, end) {
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function ResultRow({ label, value }) {
  return (
    <div className="calc-result-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function CalculatorsPage() {
  const [query, setQuery] = useState('');
  const [display, setDisplay] = useState('0');
  const [lastAnswer, setLastAnswer] = useState(0);
  const [percentageBase, setPercentageBase] = useState(120);
  const [percentageRate, setPercentageRate] = useState(15);
  const [discountPrice, setDiscountPrice] = useState(240);
  const [discountRate, setDiscountRate] = useState(20);
  const [loanAmount, setLoanAmount] = useState(25000);
  const [loanRate, setLoanRate] = useState(6.5);
  const [loanYears, setLoanYears] = useState(5);
  const [savingsStart, setSavingsStart] = useState(5000);
  const [savingsMonthly, setSavingsMonthly] = useState(200);
  const [savingsRate, setSavingsRate] = useState(7);
  const [savingsYears, setSavingsYears] = useState(10);
  const [billAmount, setBillAmount] = useState(86);
  const [tipRate, setTipRate] = useState(18);
  const [splitCount, setSplitCount] = useState(3);
  const [heightCm, setHeightCm] = useState(176);
  const [weightKg, setWeightKg] = useState(74);
  const [ageYears, setAgeYears] = useState(29);
  const [sex, setSex] = useState('male');
  const [paceDistance, setPaceDistance] = useState(5);
  const [paceTime, setPaceTime] = useState(28);
  const [birthDate, setBirthDate] = useState('1996-07-15');
  const [dateStart, setDateStart] = useState('2026-01-01');
  const [dateEnd, setDateEnd] = useState('2026-12-31');
  const [gpaCourses, setGpaCourses] = useState('4,3.7,3.3,4');
  const [unitValue, setUnitValue] = useState(1);
  const [unitFrom, setUnitFrom] = useState('km');
  const [unitTo, setUnitTo] = useState('mi');
  const [randomMin, setRandomMin] = useState(1);
  const [randomMax, setRandomMax] = useState(100);
  const [randomValue, setRandomValue] = useState(42);

  const visibleCalculators = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return calculatorCatalog;
    }

    return calculatorCatalog.filter((item) =>
      `${item.title} ${item.keywords}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  const visibleIds = new Set(visibleCalculators.map((item) => item.id));

  const percentageAmount = (percentageBase * percentageRate) / 100;
  const percentageTotal = percentageBase + percentageAmount;
  const discountSavings = (discountPrice * discountRate) / 100;
  const discountFinal = discountPrice - discountSavings;
  const monthlyRate = loanRate / 100 / 12;
  const loanPayments = loanYears * 12;
  const loanPayment = monthlyRate === 0
    ? loanAmount / loanPayments
    : (loanAmount * monthlyRate) / (1 - (1 + monthlyRate) ** -loanPayments);
  const totalLoanPaid = loanPayment * loanPayments;
  const totalLoanInterest = totalLoanPaid - loanAmount;

  let futureSavings = savingsStart;
  const monthlySavingsRate = savingsRate / 100 / 12;
  for (let i = 0; i < savingsYears * 12; i += 1) {
    futureSavings = futureSavings * (1 + monthlySavingsRate) + savingsMonthly;
  }
  const totalSavedContribution = savingsStart + savingsMonthly * savingsYears * 12;
  const savingsGrowth = futureSavings - totalSavedContribution;

  const totalTip = (billAmount * tipRate) / 100;
  const totalWithTip = billAmount + totalTip;
  const perPerson = totalWithTip / Math.max(splitCount, 1);
  const bmi = weightKg / ((heightCm / 100) ** 2);
  const bmr = sex === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  const pacePerKm = paceTime / Math.max(paceDistance, 0.01);
  const pacePerMile = pacePerKm * 1.60934;

  const birth = new Date(birthDate);
  const today = new Date();
  const ageInDays = birthDate ? daysBetween(birth, today) : 0;
  const ageInMonths = birthDate ? monthsBetween(birth, today) : 0;
  const ageInYears = birthDate ? Math.floor(ageInMonths / 12) : 0;

  const start = new Date(dateStart);
  const end = new Date(dateEnd);
  const diffDays = daysBetween(start, end);
  const diffWeeks = diffDays / 7;
  const diffMonths = monthsBetween(start, end);

  const gpaValues = gpaCourses
    .split(/[\s,]+/)
    .map(Number)
    .filter((value) => Number.isFinite(value));
  const gpaAverage = gpaValues.length
    ? gpaValues.reduce((sum, value) => sum + value, 0) / gpaValues.length
    : 0;

  const unitFactors = {
    cm: 0.01,
    ft: 0.3048,
    km: 1000,
    m: 1,
    mi: 1609.34,
  };
  const convertedUnit = (unitValue * unitFactors[unitFrom]) / unitFactors[unitTo];

  function insertToken(token) {
    setDisplay((current) => (current === '0' || current === 'Error' ? token : `${current}${token}`));
  }

  function handleScientificKey(token) {
    if (token === 'AC') {
      setDisplay('0');
      return;
    }

    if (token === 'Back') {
      setDisplay((current) => (current.length <= 1 ? '0' : current.slice(0, -1)));
      return;
    }

    if (token === 'Ans') {
      insertToken(String(lastAnswer));
      return;
    }

    if (token === 'Rnd') {
      const value = Math.random();
      setDisplay(String(value));
      setLastAnswer(value);
      return;
    }

    if (token === '=') {
      try {
        const result = evaluateExpression(display, lastAnswer);
        if (!Number.isFinite(result)) {
          throw new Error('Invalid result');
        }
        setDisplay(String(result));
        setLastAnswer(result);
      } catch {
        setDisplay('Error');
      }
      return;
    }

    if (token === '+/-') {
      setDisplay((current) => {
        const value = Number(current);
        return Number.isFinite(value) ? String(value * -1) : current;
      });
      return;
    }

    const map = {
      sin: 'sin(',
      cos: 'cos(',
      tan: 'tan(',
      pi: 'pi',
      e: 'e',
      'x^y': '^',
      'x^3': '^3',
      'x^2': '^2',
      exp: 'e^',
      '10^x': '10^',
      sqrt: 'sqrt(',
      cbrt: 'cbrt(',
      '1/x': '1/',
      'n!': '!',
      log: 'log(',
      ln: 'ln(',
    };

    insertToken(map[token] || token);
  }

  function randomize() {
    const min = Math.ceil(Math.min(randomMin, randomMax));
    const max = Math.floor(Math.max(randomMin, randomMax));
    const next = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomValue(next);
  }

  return (
    <div className="page-stack">
      <Panel title="Calculator">
        <p>
          A full original calculator tab built inside the current Audionyx design system.
          It keeps the fast directory feeling of utility hubs, but every calculator below is
          implemented locally for this project.
        </p>

        <div className="calculator-hero">
          <section className="calc-shell" aria-label="Scientific calculator">
            <div className="calc-display-wrap">
              <div className="calc-display-label">Scientific Calculator</div>
              <div className="calc-display">{display}</div>
            </div>

            <div className="calc-keypad">
              {keypad.flat().map((key) => (
                <button
                  key={key}
                  className={`calc-key ${/[0-9.=]/.test(key) ? 'number' : 'action'}`}
                  onClick={() => handleScientificKey(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </section>

          <section className="calc-intro-card">
            <h3>14 working calculators in one tab</h3>
            <p>
              Search calculators by name, jump between financial, health, math, and utility tools,
              and keep everything inside the same blue Audionyx visual language.
            </p>

            <label className="field">
              <span>Search calculators</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search BMI, loan, age, GPA, discount..."
              />
            </label>

            <div className="calculator-anchor-row">
              {visibleCalculators.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="button-link">
                  {item.title}
                </a>
              ))}
            </div>
          </section>
        </div>
      </Panel>

      <SeoBlock
        title="Financial Calculators"
        intro="Useful for payments, savings, deals, and shared costs."
      >
        <div className="calculator-tool-grid">
          {visibleIds.has('percentage') && (
            <article id="percentage" className="calculator-tool-card">
              <h4>Percentage Calculator</h4>
              <label className="field"><span>Base number</span><input type="number" value={percentageBase} onChange={(e) => setPercentageBase(Number(e.target.value))} /></label>
              <label className="field"><span>Percentage</span><input type="number" value={percentageRate} onChange={(e) => setPercentageRate(Number(e.target.value))} /></label>
              <div className="calc-results">
                <ResultRow label="Percentage amount" value={formatNumber(percentageAmount)} />
                <ResultRow label="Base plus percentage" value={formatNumber(percentageTotal)} />
              </div>
            </article>
          )}

          {visibleIds.has('discount') && (
            <article id="discount" className="calculator-tool-card">
              <h4>Discount Calculator</h4>
              <label className="field"><span>Original price</span><input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value))} /></label>
              <label className="field"><span>Discount rate (%)</span><input type="number" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} /></label>
              <div className="calc-results">
                <ResultRow label="You save" value={`$${formatNumber(discountSavings)}`} />
                <ResultRow label="Final price" value={`$${formatNumber(discountFinal)}`} />
              </div>
            </article>
          )}

          {visibleIds.has('loan') && (
            <article id="loan" className="calculator-tool-card">
              <h4>Loan Payment Calculator</h4>
              <label className="field"><span>Loan amount</span><input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} /></label>
              <label className="field"><span>Interest rate (%)</span><input type="number" step="0.1" value={loanRate} onChange={(e) => setLoanRate(Number(e.target.value))} /></label>
              <label className="field"><span>Term (years)</span><input type="number" value={loanYears} onChange={(e) => setLoanYears(Number(e.target.value))} /></label>
              <div className="calc-results">
                <ResultRow label="Monthly payment" value={`$${formatNumber(loanPayment)}`} />
                <ResultRow label="Total paid" value={`$${formatNumber(totalLoanPaid)}`} />
                <ResultRow label="Total interest" value={`$${formatNumber(totalLoanInterest)}`} />
              </div>
            </article>
          )}

          {visibleIds.has('savings') && (
            <article id="savings" className="calculator-tool-card">
              <h4>Savings Growth Calculator</h4>
              <label className="field"><span>Starting amount</span><input type="number" value={savingsStart} onChange={(e) => setSavingsStart(Number(e.target.value))} /></label>
              <label className="field"><span>Monthly contribution</span><input type="number" value={savingsMonthly} onChange={(e) => setSavingsMonthly(Number(e.target.value))} /></label>
              <label className="field"><span>Annual return (%)</span><input type="number" step="0.1" value={savingsRate} onChange={(e) => setSavingsRate(Number(e.target.value))} /></label>
              <label className="field"><span>Years</span><input type="number" value={savingsYears} onChange={(e) => setSavingsYears(Number(e.target.value))} /></label>
              <div className="calc-results">
                <ResultRow label="Future value" value={`$${formatNumber(futureSavings)}`} />
                <ResultRow label="Contribution total" value={`$${formatNumber(totalSavedContribution)}`} />
                <ResultRow label="Growth earned" value={`$${formatNumber(savingsGrowth)}`} />
              </div>
            </article>
          )}

          {visibleIds.has('tip') && (
            <article id="tip" className="calculator-tool-card">
              <h4>Tip Split Calculator</h4>
              <label className="field"><span>Bill amount</span><input type="number" value={billAmount} onChange={(e) => setBillAmount(Number(e.target.value))} /></label>
              <label className="field"><span>Tip (%)</span><input type="number" value={tipRate} onChange={(e) => setTipRate(Number(e.target.value))} /></label>
              <label className="field"><span>People splitting</span><input type="number" min="1" value={splitCount} onChange={(e) => setSplitCount(Number(e.target.value))} /></label>
              <div className="calc-results">
                <ResultRow label="Tip amount" value={`$${formatNumber(totalTip)}`} />
                <ResultRow label="Total bill" value={`$${formatNumber(totalWithTip)}`} />
                <ResultRow label="Per person" value={`$${formatNumber(perPerson)}`} />
              </div>
            </article>
          )}
        </div>
      </SeoBlock>

      <SeoBlock
        title="Health & Fitness Calculators"
        intro="Quick body metrics and pacing tools."
      >
        <div className="calculator-tool-grid">
          {visibleIds.has('bmi') && (
            <article id="bmi" className="calculator-tool-card">
              <h4>BMI Calculator</h4>
              <label className="field"><span>Height (cm)</span><input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} /></label>
              <label className="field"><span>Weight (kg)</span><input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} /></label>
              <div className="calc-results">
                <ResultRow label="BMI" value={formatNumber(bmi)} />
                <ResultRow label="Category" value={bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Overweight' : 'Obesity range'} />
              </div>
            </article>
          )}

          {visibleIds.has('bmr') && (
            <article id="bmr" className="calculator-tool-card">
              <h4>BMR Calculator</h4>
              <label className="field"><span>Age</span><input type="number" value={ageYears} onChange={(e) => setAgeYears(Number(e.target.value))} /></label>
              <label className="field"><span>Height (cm)</span><input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} /></label>
              <label className="field"><span>Weight (kg)</span><input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} /></label>
              <label className="field">
                <span>Sex</span>
                <select value={sex} onChange={(e) => setSex(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <div className="calc-results">
                <ResultRow label="Estimated BMR" value={`${formatNumber(bmr)} kcal/day`} />
                <ResultRow label="Light activity" value={`${formatNumber(bmr * 1.375)} kcal/day`} />
              </div>
            </article>
          )}

          {visibleIds.has('pace') && (
            <article id="pace" className="calculator-tool-card">
              <h4>Running Pace Calculator</h4>
              <label className="field"><span>Distance (km)</span><input type="number" step="0.1" value={paceDistance} onChange={(e) => setPaceDistance(Number(e.target.value))} /></label>
              <label className="field"><span>Total time (minutes)</span><input type="number" step="0.1" value={paceTime} onChange={(e) => setPaceTime(Number(e.target.value))} /></label>
              <div className="calc-results">
                <ResultRow label="Pace per km" value={`${formatNumber(pacePerKm)} min/km`} />
                <ResultRow label="Pace per mile" value={`${formatNumber(pacePerMile)} min/mi`} />
              </div>
            </article>
          )}
        </div>
      </SeoBlock>

      <SeoBlock
        title="Math & School Calculators"
        intro="Core math, GPA, and randomization tools."
      >
        <div className="calculator-tool-grid">
          {visibleIds.has('gpa') && (
            <article id="gpa" className="calculator-tool-card">
              <h4>GPA Calculator</h4>
              <label className="field">
                <span>Course grades on 4.0 scale</span>
                <input value={gpaCourses} onChange={(e) => setGpaCourses(e.target.value)} placeholder="4, 3.7, 3.3, 4" />
              </label>
              <div className="calc-results">
                <ResultRow label="Courses counted" value={String(gpaValues.length)} />
                <ResultRow label="Average GPA" value={formatNumber(gpaAverage, 3)} />
              </div>
            </article>
          )}

          {visibleIds.has('unit') && (
            <article id="unit" className="calculator-tool-card">
              <h4>Unit Converter</h4>
              <label className="field"><span>Value</span><input type="number" value={unitValue} onChange={(e) => setUnitValue(Number(e.target.value))} /></label>
              <div className="calc-inline-grid">
                <label className="field">
                  <span>From</span>
                  <select value={unitFrom} onChange={(e) => setUnitFrom(e.target.value)}>
                    <option value="m">Meters</option>
                    <option value="km">Kilometers</option>
                    <option value="mi">Miles</option>
                    <option value="ft">Feet</option>
                    <option value="cm">Centimeters</option>
                  </select>
                </label>
                <label className="field">
                  <span>To</span>
                  <select value={unitTo} onChange={(e) => setUnitTo(e.target.value)}>
                    <option value="m">Meters</option>
                    <option value="km">Kilometers</option>
                    <option value="mi">Miles</option>
                    <option value="ft">Feet</option>
                    <option value="cm">Centimeters</option>
                  </select>
                </label>
              </div>
              <div className="calc-results">
                <ResultRow label="Converted value" value={formatNumber(convertedUnit, 4)} />
              </div>
            </article>
          )}

          {visibleIds.has('random') && (
            <article id="random" className="calculator-tool-card">
              <h4>Random Number Generator</h4>
              <div className="calc-inline-grid">
                <label className="field"><span>Min</span><input type="number" value={randomMin} onChange={(e) => setRandomMin(Number(e.target.value))} /></label>
                <label className="field"><span>Max</span><input type="number" value={randomMax} onChange={(e) => setRandomMax(Number(e.target.value))} /></label>
              </div>
              <div className="calc-results">
                <ResultRow label="Current value" value={String(randomValue)} />
              </div>
              <button type="button" onClick={randomize}>Generate random number</button>
            </article>
          )}
        </div>
      </SeoBlock>

      <SeoBlock
        title="Date & Time Calculators"
        intro="Useful for age, duration, and calendar planning."
      >
        <div className="calculator-tool-grid">
          {visibleIds.has('age') && (
            <article id="age" className="calculator-tool-card">
              <h4>Age Calculator</h4>
              <label className="field"><span>Birth date</span><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></label>
              <div className="calc-results">
                <ResultRow label="Age in years" value={String(ageInYears)} />
                <ResultRow label="Age in months" value={String(ageInMonths)} />
                <ResultRow label="Age in days" value={String(ageInDays)} />
              </div>
            </article>
          )}

          {visibleIds.has('datediff') && (
            <article id="datediff" className="calculator-tool-card">
              <h4>Date Difference Calculator</h4>
              <div className="calc-inline-grid">
                <label className="field"><span>Start date</span><input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} /></label>
                <label className="field"><span>End date</span><input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} /></label>
              </div>
              <div className="calc-results">
                <ResultRow label="Days apart" value={String(diffDays)} />
                <ResultRow label="Weeks apart" value={formatNumber(diffWeeks, 2)} />
                <ResultRow label="Whole months" value={String(diffMonths)} />
              </div>
            </article>
          )}
        </div>
      </SeoBlock>

      <SeoBlock
        title="What This Tab Includes"
        intro="A proper calculator tab should feel useful immediately, not like a placeholder."
      >
        <div className="table-like">
          <div><strong>Working tools</strong><span>Scientific, percentage, discount, loan, savings, tip split, BMI, BMR, pace, age, date difference, GPA, unit conversion, and random number generation.</span></div>
          <div><strong>Searchable hub</strong><span>The search field narrows visible calculators without leaving the page.</span></div>
          <div><strong>Design fit</strong><span>Everything uses the existing Audionyx typography, panel styling, and blue palette instead of a pasted third-party theme.</span></div>
        </div>
      </SeoBlock>
    </div>
  );
}
