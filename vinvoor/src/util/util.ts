export const randomInt = (lower: number = 0, upper: number = 10000): number => {
    return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

export const equal = (left: any, right: any): boolean => {
    if (typeof left !== typeof right) return false;

    if (Array.isArray(left) && Array.isArray(right))
        return equalArray(left, right);
    if (typeof left === "object" && left !== null && right !== null)
        return equalObject(
            left as Record<string, any>,
            right as Record<string, any>
        );

    return left === right;
};

const equalArray = (left: any[], right: any[]): boolean => {
    if (left.length !== right.length) return false;

    for (let i = 0; i < left.length; i++) {
        if (!equal(left[i], right[i])) return false;
    }

    return true;
};

const equalObject = (
    left: Record<string, any>,
    right: Record<string, any>
): boolean => {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) return false;

    for (const key of leftKeys) {
        if (!equal(left[key], right[key])) return false;
    }

    return true;
};
