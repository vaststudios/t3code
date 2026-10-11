// local patch: the "..." icon that sidebar.css draws on hovered project and thread rows opens
// T3's existing context menu (the same one a right-click opens).
//
// The icon is a ::after pseudo-element of the row's container (.group/project-header or
// [data-thread-item]). The visible row button covers the rest of the container, so a click whose
// target is the container itself can only have hit the pseudo-element. One capture listener on the
// document handles every row; nothing is added to React's DOM.
(() => {
  if (window.__t3pMoreMenu) return;
  window.__t3pMoreMenu = true;

  const rowButtonFor = (el) => {
    if (el.matches(".group\\/project-header")) return el.querySelector(':scope > [data-sidebar="menu-button"]');
    if (el.matches("[data-thread-item]")) return el.querySelector(':scope > [data-sidebar="menu-sub-button"]');
    return null;
  };

  const open = (event) => {
    const el = event.target;
    if (!(el instanceof Element)) return;
    const button = rowButtonFor(el);
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    // Anchor the menu under the "..." icon rather than at the row's left edge.
    const row = el.getBoundingClientRect();
    button.dispatchEvent(new MouseEvent("contextmenu", {
      bubbles: true, cancelable: true, button: 2, buttons: 2,
      clientX: event.clientX, clientY: row.bottom,
    }));
  };

  document.addEventListener("click", open, true);
  // Keep the row's own press handlers (selection, drag) from seeing the press on the icon.
  document.addEventListener("pointerdown", (event) => {
    if (event.target instanceof Element && rowButtonFor(event.target)) event.stopPropagation();
  }, true);
})();
