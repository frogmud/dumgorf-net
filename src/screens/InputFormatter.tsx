import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { tokens } from '../theme';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { ChipSelector } from '../components/ChipSelector';
import { CommandOutput } from '../components/CommandOutput';

const TOOL_COLOR = '#a855f7';

type FormatType = 'phone' | 'credit-card' | 'date' | 'currency' | 'ssn' | 'custom';

const FORMAT_TYPES = [
  { id: 'phone' as const, label: 'Phone' },
  { id: 'credit-card' as const, label: 'Credit Card' },
  { id: 'date' as const, label: 'Date' },
  { id: 'currency' as const, label: 'Currency' },
  { id: 'ssn' as const, label: 'SSN' },
  { id: 'custom' as const, label: 'Custom' },
];

const DATE_FORMATS = [
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { id: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
];

interface EdgeTest {
  label: string;
  input: string;
  expected: string;
}

function formatPhone(raw: string, countryCode: string): string {
  const digits = raw.replace(/\D/g, '');
  if (countryCode === '+1') {
    const d = digits.slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (countryCode === '+44') {
    const d = digits.slice(0, 11);
    if (d.length <= 4) return d;
    if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  }
  return digits;
}

function formatCreditCard(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatDate(raw: string, pattern: string): string {
  const digits = raw.replace(/\D/g, '');
  const sep = pattern.includes('/') ? '/' : pattern.includes('-') ? '-' : '.';
  const parts = pattern.split(/[/\-.]/);

  let result = '';
  let di = 0;
  for (let i = 0; i < parts.length; i++) {
    const len = parts[i].length;
    const chunk = digits.slice(di, di + len);
    if (!chunk) break;
    result += (i > 0 ? sep : '') + chunk;
    di += len;
  }
  return result;
}

function formatCurrency(raw: string, locale: string, decimals: number): string {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return cleaned;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'en-US' ? 'USD' : locale === 'en-GB' ? 'GBP' : locale === 'de-DE' ? 'EUR' : locale === 'ja-JP' ? 'JPY' : 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return cleaned;
  }
}

function formatSsn(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

function formatCustom(raw: string, pattern: string, maskChar: string): string {
  try {
    const regex = new RegExp(pattern);
    const match = raw.match(regex);
    if (match && match[0]) return match[0];
  } catch {
    // invalid regex
  }
  return raw.replace(new RegExp(`[^${maskChar === '#' ? '0-9' : maskChar}]`, 'g'), '');
}

function getEdgeTests(format: FormatType): EdgeTest[] {
  switch (format) {
    case 'phone':
      return [
        { label: 'Full number', input: '2125551234', expected: '(212) 555-1234' },
        { label: 'Partial', input: '212', expected: '212' },
        { label: 'With dashes', input: '212-555-1234', expected: '(212) 555-1234' },
        { label: 'Too long', input: '21255512345678', expected: '(212) 555-1234' },
        { label: 'Empty', input: '', expected: '' },
      ];
    case 'credit-card':
      return [
        { label: 'Visa', input: '4111111111111111', expected: '4111 1111 1111 1111' },
        { label: 'Partial', input: '411111', expected: '4111 11' },
        { label: 'With spaces', input: '4111 1111 1111', expected: '4111 1111 1111' },
        { label: 'Empty', input: '', expected: '' },
      ];
    case 'date':
      return [
        { label: 'Full date', input: '12252025', expected: '12/25/2025' },
        { label: 'Partial', input: '1225', expected: '12/25' },
        { label: 'Empty', input: '', expected: '' },
      ];
    case 'currency':
      return [
        { label: 'Integer', input: '1000', expected: '$1,000.00' },
        { label: 'Decimal', input: '49.99', expected: '$49.99' },
        { label: 'Large', input: '1234567.89', expected: '$1,234,567.89' },
        { label: 'Empty', input: '', expected: '' },
      ];
    case 'ssn':
      return [
        { label: 'Full SSN', input: '123456789', expected: '123-45-6789' },
        { label: 'Partial', input: '12345', expected: '123-45' },
        { label: 'With dashes', input: '123-45-6789', expected: '123-45-6789' },
        { label: 'Empty', input: '', expected: '' },
      ];
    case 'custom':
      return [
        { label: 'Digits only', input: 'abc123', expected: '123' },
      ];
  }
}

export function InputFormatter() {
  const [formatType, setFormatType] = useState<FormatType>('phone');
  const [input, setInput] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [locale, setLocale] = useState('en-US');
  const [decimals, setDecimals] = useState(2);
  const [customPattern, setCustomPattern] = useState('[0-9]+');
  const [maskChar, setMaskChar] = useState('#');

  const formatted = useMemo(() => {
    switch (formatType) {
      case 'phone': return formatPhone(input, countryCode);
      case 'credit-card': return formatCreditCard(input);
      case 'date': return formatDate(input, dateFormat);
      case 'currency': return formatCurrency(input, locale, decimals);
      case 'ssn': return formatSsn(input);
      case 'custom': return formatCustom(input, customPattern, maskChar);
    }
  }, [formatType, input, countryCode, dateFormat, locale, decimals, customPattern, maskChar]);

  const edgeTests = useMemo(() => getEdgeTests(formatType), [formatType]);

  const testResults = useMemo(() => {
    return edgeTests.map((test) => {
      let actual: string;
      switch (formatType) {
        case 'phone': actual = formatPhone(test.input, countryCode); break;
        case 'credit-card': actual = formatCreditCard(test.input); break;
        case 'date': actual = formatDate(test.input, dateFormat); break;
        case 'currency': actual = formatCurrency(test.input, locale, decimals); break;
        case 'ssn': actual = formatSsn(test.input); break;
        case 'custom': actual = formatCustom(test.input, customPattern, maskChar); break;
      }
      return { ...test, actual, pass: actual === test.expected };
    });
  }, [edgeTests, formatType, countryCode, dateFormat, locale, decimals, customPattern, maskChar]);

  const configJson = JSON.stringify(
    {
      type: formatType,
      ...(formatType === 'phone' && { countryCode }),
      ...(formatType === 'date' && { pattern: dateFormat }),
      ...(formatType === 'currency' && { locale, decimals }),
      ...(formatType === 'custom' && { regex: customPattern, maskChar }),
    },
    null,
    2,
  );

  return (
    <ToolPageLayout
      title="Input Formatter"
      description="Live input masking for phone, credit card, date, currency, SSN. Custom regex mode."
    >
      {/* Format selector */}
      <Box sx={{ mb: 3 }}>
        <ChipSelector
          items={FORMAT_TYPES}
          selected={formatType}
          onSelect={(id) => { setFormatType(id); setInput(''); }}
          accentColor={TOOL_COLOR}
        />
      </Box>

      {/* Per-format config */}
      {formatType === 'phone' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 0.5 }}>Country code</Typography>
          <ChipSelector
            items={[
              { id: '+1', label: 'US (+1)' },
              { id: '+44', label: 'UK (+44)' },
            ]}
            selected={countryCode}
            onSelect={setCountryCode}
            accentColor={TOOL_COLOR}
          />
        </Box>
      )}

      {formatType === 'date' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 0.5 }}>Date format</Typography>
          <ChipSelector items={DATE_FORMATS} selected={dateFormat} onSelect={setDateFormat} accentColor={TOOL_COLOR} />
        </Box>
      )}

      {formatType === 'currency' && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, mb: 0.5 }}>Locale</Typography>
            <ChipSelector
              items={[
                { id: 'en-US', label: 'USD' },
                { id: 'en-GB', label: 'GBP' },
                { id: 'de-DE', label: 'EUR' },
                { id: 'ja-JP', label: 'JPY' },
              ]}
              selected={locale}
              onSelect={setLocale}
              accentColor={TOOL_COLOR}
            />
          </Box>
          <TextField
            label="Decimals"
            value={decimals}
            onChange={(e) => setDecimals(Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))}
            type="number"
            size="small"
            sx={{ width: 100 }}
          />
        </Stack>
      )}

      {formatType === 'custom' && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Regex pattern"
            value={customPattern}
            onChange={(e) => setCustomPattern(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: '0.875rem' } } }}
          />
          <TextField
            label="Mask char"
            value={maskChar}
            onChange={(e) => setMaskChar(e.target.value.slice(0, 1) || '#')}
            size="small"
            sx={{ width: 80 }}
          />
        </Stack>
      )}

      {/* Live input */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Raw input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          size="small"
          fullWidth
          placeholder={formatType === 'phone' ? '2125551234' : formatType === 'credit-card' ? '4111111111111111' : ''}
        />
        <TextField
          label="Formatted"
          value={formatted}
          size="small"
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
              sx: { fontFamily: 'monospace', fontSize: '0.875rem', color: TOOL_COLOR },
            },
          }}
        />
      </Stack>

      {/* Edge case tests */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Edge Case Tests
      </Typography>
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: tokens.colors.paper }}>
        {testResults.map((test, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.75,
              borderBottom: i < testResults.length - 1 ? `1px solid ${tokens.colors.border}` : 'none',
            }}
          >
            {test.pass ? (
              <CheckCircleIcon sx={{ fontSize: 16, color: '#22c55e' }} />
            ) : (
              <CancelIcon sx={{ fontSize: 16, color: '#ef4444' }} />
            )}
            <Typography variant="body2" sx={{ color: tokens.colors.text.secondary, minWidth: 80 }}>
              {test.label}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: tokens.colors.text.muted }}>
              "{test.input}"
            </Typography>
            <Typography variant="body2" sx={{ color: tokens.colors.text.muted, mx: 0.5 }}>
              {'>'}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: test.pass ? '#22c55e' : '#ef4444' }}
            >
              "{test.actual}"
            </Typography>
            {!test.pass && (
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: tokens.colors.text.muted }}>
                (expected "{test.expected}")
              </Typography>
            )}
          </Box>
        ))}
      </Paper>

      {/* Config JSON */}
      <Typography variant="h3" sx={{ mb: 1 }}>
        Config
      </Typography>
      <CommandOutput content={configJson} accentColor={TOOL_COLOR} />
    </ToolPageLayout>
  );
}
