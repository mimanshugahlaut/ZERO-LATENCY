/**
 * Truncate an Ethereum address: 0x1234...5678
 */
export function truncateAddress(addr, start = 6, end = 4) {
  if (!addr) return '—';
  return `${addr.slice(0, start)}...${addr.slice(-end)}`;
}

/**
 * Truncate a bytes32 hash: 0xABCD...1234
 */
export function truncateHash(hash, start = 8, end = 6) {
  if (!hash) return '—';
  const h = hash.startsWith('0x') ? hash : `0x${hash}`;
  return `${h.slice(0, start)}...${h.slice(-end)}`;
}

/**
 * Format a Unix timestamp to a relative time string
 */
export function timeAgo(timestamp) {
  const now = Date.now();
  const ts = typeof timestamp === 'bigint'
    ? Number(timestamp) * 1000
    : Number(timestamp) < 1e12
      ? Number(timestamp) * 1000
      : Number(timestamp);

  const diff = now - ts;
  if (diff < 60_000)  return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

/**
 * Format a Unix timestamp to full date/time string
 */
export function formatDateTime(timestamp) {
  const ts = typeof timestamp === 'bigint'
    ? Number(timestamp) * 1000
    : Number(timestamp) < 1e12
      ? Number(timestamp) * 1000
      : Number(timestamp);
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/**
 * Format a large number with commas
 */
export function formatNumber(n) {
  return Number(n).toLocaleString();
}

/**
 * Get initials from a candidate name
 */
export function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * Calculate vote percentage
 */
export function calcPercent(votes, total) {
  if (!total || total === 0) return 0;
  return Math.round((votes / total) * 100);
}

/**
 * Deterministic gradient for a candidate based on index
 */
export const CANDIDATE_GRADIENTS = [
  'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
];
export function candidateGradient(index) {
  return CANDIDATE_GRADIENTS[index % CANDIDATE_GRADIENTS.length];
}

/**
 * Candidate dot color for ledger/results
 */
const DOT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#84cc16'];
export function candidateDotColor(index) {
  return DOT_COLORS[index % DOT_COLORS.length];
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
