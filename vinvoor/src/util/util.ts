export function randomInt(lower = 0, upper = 10000): number {
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
}

// Date functions

export const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;

export function isTheSameDay(date1: Date, date2: Date) {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
}

export function shiftDate(date: Date, numDays: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

export const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  year: "2-digit",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

// Compare functions

export function equal(left: unknown, right: unknown): boolean {
  if (typeof left !== typeof right)
    return false;

  if (Array.isArray(left) && Array.isArray(right))
    return equalArray(left, right);
  if (typeof left === "object" && left !== null && right !== null) {
    return equalObject(
      left as Record<string, unknown>,
      right as Record<string, unknown>,
    );
  }

  return left === right;
}

function equalArray(left: unknown[], right: unknown[]): boolean {
  if (left.length !== right.length)
    return false;

  for (let i = 0; i < left.length; i++) {
    if (!equal(left[i], right[i]))
      return false;
  }

  return true;
}

function equalObject(left: Record<string, unknown>, right: Record<string, unknown>): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length)
    return false;

  for (const key of leftKeys) {
    if (!equal(left[key], right[key]))
      return false;
  }

  return true;
}
