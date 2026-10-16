const NUMBER = /\d+(?:\.\d+)?/g;

const decimals = (n: string) => (n.includes('.') ? n.split('.')[1]!.length : 0);

/**
 * The text of a metric partway through its count-up, for progress `t` in [0, 1].
 *
 * - "96%"        counts the number up from 0, keeping the "%".
 * - "2.3→0.9ms"  keeps the "before" value and moves the "after" value from 2.3 to 0.9.
 * - Text with no number is returned unchanged.
 */
export function metricAt(metric: string, t: number): string {
  const p = Math.min(1, Math.max(0, t));
  const nums = metric.match(NUMBER);
  if (!nums) return metric;

  const target = nums[nums.length - 1]!;
  const isChange = nums.length >= 2 && metric.includes('→');
  const from = isChange ? Number(nums[nums.length - 2]) : 0;
  const value = (from + (Number(target) - from) * p).toFixed(decimals(target));

  const at = metric.lastIndexOf(target);
  return metric.slice(0, at) + value + metric.slice(at + target.length);
}
