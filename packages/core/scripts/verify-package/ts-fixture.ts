import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { consumerDir } from "./context";
import { assert } from "./report";

const require = createRequire(import.meta.url);

function tsc(args: string[]) {
  const tscPath = require.resolve("typescript/lib/tsc.js");
  return spawnSync(process.execPath, [tscPath, ...args], { cwd: consumerDir, encoding: "utf8" });
}

/**
 * Compiles an external-style consumer through the package manifest with the
 * project's bundler resolution: no workspace aliases and no custom conditions.
 * The second compile opts into the dev condition, which must not break type
 * resolution.
 */
export function phaseTypeScriptFixture() {
  console.log("\n== 4. External-style TypeScript fixture ==");
  const fixture = [
    'import { Button, type ButtonProps } from "@basic-ui/core";',
    'import { Card, type CardProps, type CardHeaderProps, type CardComponent } from "@basic-ui/core/Card";',
    'import { TablePagination, LinkPagination } from "@basic-ui/core/Pagination";',
    'import { Header, type HeaderProps } from "@basic-ui/core/Header";',
    'import { Image, type ImageProps } from "@basic-ui/core/Image";',
    'import { Skeleton, type SkeletonProps } from "@basic-ui/core/Skeleton";',
    'import type { AlertProps } from "@basic-ui/core";',
    "",
    "export const components = { Button, Card, TablePagination, LinkPagination, Header, Image, Skeleton };",
    "export const cardHeader = Card.Header;",
    "export type ConsumerButtonProps = ButtonProps;",
    "export type ConsumerCardProps = CardProps;",
    "export type ConsumerCardHeaderProps = CardHeaderProps;",
    "export type ConsumerCardComponent = CardComponent;",
    "export type ConsumerHeaderProps = HeaderProps;",
    "export type ConsumerImageProps = ImageProps;",
    "export type ConsumerSkeletonProps = SkeletonProps;",
    "export type ConsumerAlertProps = AlertProps;",
  ].join("\n");
  writeFileSync(join(consumerDir, "external-consumer.ts"), fixture + "\n");
  const fixtureTsConfig = {
    compilerOptions: {
      noEmit: true,
      strict: true,
      module: "esnext",
      moduleResolution: "bundler",
      target: "es2020",
      jsx: "react-jsx",
      lib: ["es2020", "dom"],
      skipLibCheck: true,
    },
    files: ["external-consumer.ts"],
  };
  writeFileSync(join(consumerDir, "tsconfig.fixture.json"), JSON.stringify(fixtureTsConfig));
  writeFileSync(
    join(consumerDir, "tsconfig.fixture.dev.json"),
    JSON.stringify({
      extends: "./tsconfig.fixture.json",
      compilerOptions: { customConditions: ["dev"] },
    }),
  );

  const defaultRun = tsc(["-p", "tsconfig.fixture.json"]);
  assert(
    "TS fixture compiles with default resolution",
    defaultRun.status === 0,
    ((defaultRun.stdout ?? "") + (defaultRun.stderr ?? "")).trim().slice(0, 200),
  );

  const devRun = tsc(["-p", "tsconfig.fixture.dev.json"]);
  assert(
    "TS fixture compiles with the dev condition",
    devRun.status === 0,
    ((devRun.stdout ?? "") + (devRun.stderr ?? "")).trim().slice(0, 200),
  );
}
