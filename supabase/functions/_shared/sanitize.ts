// eslint-disable-next-line no-control-regex -- input controls are removed before persistence and rendering.
const SINGLE_LINE_CONTROLS = /[\u0000-\u001f\u007f-\u009f]/gu;
// eslint-disable-next-line no-control-regex -- preserve message line breaks while removing other controls.
const MULTILINE_CONTROLS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/gu;

export function sanitizeText(value: string, multiline = false): string {
    const normalized = value.normalize("NFC").replace(/\r\n?/gu, "\n");
    const withoutControls = multiline
        ? normalized.replace(MULTILINE_CONTROLS, "")
        : normalized.replace(SINGLE_LINE_CONTROLS, " ");

    return withoutControls.trim();
}

export function countCharacters(value: string): number {
    return Array.from(value).length;
}

export function escapeHtml(value: string): string {
    return value
        .replace(/&/gu, "&amp;")
        .replace(/</gu, "&lt;")
        .replace(/>/gu, "&gt;")
        .replace(/"/gu, "&quot;")
        .replace(/'/gu, "&#39;");
}
