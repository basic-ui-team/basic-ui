let failures = 0;

export function assert(name: string, ok: boolean, detail = "") {
  const status = ok ? "PASS" : "FAIL";
  console.log(status + "  " + name + (detail ? " - " + detail : ""));
  if (!ok) failures += 1;
}

export function failureCount() {
  return failures;
}
