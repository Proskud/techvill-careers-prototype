export const serviceValueHoverQuery = '(min-width: 761px) and (hover: hover) and (pointer: fine)';

export function createServiceValueBehavior({ isHoverMode, activeElement }) {
  let dismissed = false;
  let touch = false;
  const dismiss = (item) => {
    dismissed = true;
    item.open = false;
    item.querySelector('summary')?.focus();
  };
  return {
    dismiss,
    pointerDown(event) { touch = event.pointerType === 'touch'; },
    pointerEnter(event) {
      if (!isHoverMode() || event.pointerType === 'touch') return;
      dismissed = false;
      event.currentTarget.open = true;
    },
    pointerLeave(event) {
      dismissed = false;
      if (!isHoverMode() || event.pointerType === 'touch') return;
      const focused = activeElement();
      if (event.currentTarget.contains(focused) && focused?.matches(':focus-visible')) return;
      event.currentTarget.open = false;
    },
    focus(event) {
      if (isHoverMode() && !dismissed && event.target.matches(':focus-visible')) event.currentTarget.open = true;
    },
    blur(event) {
      if (event.currentTarget.contains(event.relatedTarget)) return;
      dismissed = false;
      if (isHoverMode()) event.currentTarget.open = false;
    },
    summaryClick(event) {
      if (!isHoverMode() || touch || event.detail === 0) return;
      event.preventDefault();
      event.currentTarget.closest('details').open = true;
    },
    keyDown(event) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      dismiss(event.currentTarget);
    },
  };
}
