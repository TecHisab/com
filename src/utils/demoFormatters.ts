export function formatBDT(amount: number, decimals = 0): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const sign = safe < 0 ? '-' : '';
  const absVal = Math.abs(safe);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absVal);
  return `${sign}৳ ${formatted}`;
}

export function formatNumber(amount: number, decimals = 2): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safe);
}

export function formatPercent(value: number, decimals = 1): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(decimals)}%`;
}

export function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isWithinDateRange(
  dateStr: string,
  startDate?: string,
  endDate?: string
): boolean {
  if (!dateStr) return true;
  if (startDate && dateStr < startDate) return false;
  if (endDate && dateStr > endDate) return false;
  return true;
}

export function generateDemoId(prefix: string): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${rand}`;
}

export function parseSafeNumber(value: string | number): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function triggerPrintableReport(title: string, htmlBody: string): void {
  const existing = document.getElementById('techisab-demo-print-sheet');
  if (existing) existing.remove();

  const printContainer = document.createElement('div');
  printContainer.id = 'techisab-demo-print-sheet';
  printContainer.className = 'hidden print:block p-8 bg-white text-black';
  printContainer.innerHTML = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 820px; margin: 0 auto; color: #0B1730;">
      <div style="border-bottom: 2px solid #0345A4; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #0345A4;">TecHisab</div>
          <div style="font-size: 13px; color: #5F6D82;">${title}</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #5F6D82;">
          <div><strong>DEMO MODE — Sample Data Only</strong></div>
          <div>Generated: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      ${htmlBody}
      <div style="margin-top: 24px; padding-top: 10px; border-top: 1px solid #D7E2F3; font-size: 11px; color: #5F6D82;">
        Disclaimer: This simulated sample output is generated inside the TecHisab browser demonstration sandbox for evaluation purposes only.
      </div>
    </div>
  `;
  document.body.appendChild(printContainer);
  window.print();
  setTimeout(() => {
    printContainer.remove();
  }, 500);
}
