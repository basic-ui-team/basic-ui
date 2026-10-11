import type {
  ResolvedSpacingScale,
  SpacingScaleConfig,
  SpacingStepToken,
} from "../types";

const MAX_SPACING_STEPS = 10;
const VALID_UNITS = ["px", "rem"] as const;
const VALID_ROUNDING = ["whole", "up", "down"] as const;

export const DEFAULT_SPACING_SCALE: SpacingScaleConfig = {
  base: 4,
  ratio: Math.SQRT2,
  steps: 10,
  unit: "px",
  rounding: "whole",
};

/**
 * Validate spacing scale configuration before it is resolved into tokens.
 *
 * This intentionally validates configuration only. Resolving the scale into
 * CSS values belongs to the token generation phase.
 */
export function validateSpacingScale(config: SpacingScaleConfig): void {
  if (!config || typeof config !== "object") {
    throw new TypeError("Spacing scale configuration must be an object.");
  }

  if (!Number.isFinite(config.base) || config.base <= 0) {
    throw new RangeError("Spacing scale base must be a finite number greater than 0.");
  }

  if (!Number.isFinite(config.ratio) || config.ratio <= 0) {
    throw new RangeError("Spacing scale ratio must be a finite number greater than 0.");
  }

  if (!Number.isInteger(config.steps) || config.steps < 1 || config.steps > MAX_SPACING_STEPS) {
    throw new RangeError(
      `Spacing scale steps must be an integer from 1 to ${MAX_SPACING_STEPS}.`,
    );
  }

  if (!VALID_UNITS.includes(config.unit)) {
    throw new TypeError(`Spacing scale unit must be one of: ${VALID_UNITS.join(", ")}.`);
  }

  if (!VALID_ROUNDING.includes(config.rounding)) {
    throw new TypeError(`Spacing scale rounding must be one of: ${VALID_ROUNDING.join(", ")}.`);
  }

  if (config.overrides) {
    for (const key of Object.keys(config.overrides)) {
      const step = Number(key);
      if (!Number.isInteger(step) || step < 0 || step >= config.steps) {
        throw new RangeError(
          `Spacing scale override "${key}" must target an available step from 0 to ${config.steps - 1}.`,
        );
      }

      const value = config.overrides[key as SpacingStepToken];
      if (typeof value !== "string" || value.trim() === "") {
        throw new TypeError(`Spacing scale override "${key}" must be a non-empty string.`);
      }
    }
  }
}

function roundSpacingValue(value: number, rounding: SpacingScaleConfig["rounding"]): number {
  if (rounding === "up") return Math.ceil(value);
  if (rounding === "down") return Math.floor(value);
  return Math.round(value);
}

/**
 * Resolve a spacing scale into concrete CSS values.
 *
 * Step 0 is always zero. Non-zero steps use the configured base and ratio,
 * with rounding applied before the unit is appended.
 */
export function resolveSpacingScale(config: SpacingScaleConfig): ResolvedSpacingScale {
  validateSpacingScale(config);

  const resolved: ResolvedSpacingScale = {};
  for (let step = 0; step < config.steps; step += 1) {
    const key = String(step) as SpacingStepToken;
    const override = config.overrides?.[key];

    if (override !== undefined) {
      resolved[key] = override;
      continue;
    }

    const value = step === 0 ? 0 : roundSpacingValue(config.base * config.ratio ** (step - 1), config.rounding);
    resolved[key] = `${value}${config.unit}`;
  }

  return resolved;
}
