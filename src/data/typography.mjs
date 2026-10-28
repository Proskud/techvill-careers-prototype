// Shared by the build-time JSX/data formatter and article rendering. No DOM
// mutation, no changes to input values, URLs, wording or sentence punctuation.
const shortWords = /(?<![\p{L}\p{N}_])(в|во|к|ко|с|со|у|о|об|обо|от|до|за|из|на|по|не|и|а|но|да|для|без|при|над|под|или|либо|через|между)[ \t]+(?=[\p{L}\d«„“"(*]|$)/giu;

export function bindShortWords(text) {
  return text.split(/(https?:\/\/[^\s<>"*]+|mailto:[^\s<>"*]+)/gu).map((part) => {
    if (/^(?:https?:\/\/|mailto:)/i.test(part)) return part;
    return part
      .replace(/(?<=[\p{L}\p{N}])-(?=[\p{L}\p{N}])/gu, "\u2011")
      .replace(shortWords, "$1\u00a0");
  }).join("");
}
