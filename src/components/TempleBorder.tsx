/**
 * Signature divider: the triangular "temple border" (gopuram motif) woven along the edge of
 * Kanjeevaram silk, the saree used for Bharatanatyam costumes. It is a CSS mask over the
 * accent color (see `.temple-border` in global.css), so it follows the theme and costs no images.
 */
export function TempleBorder() {
  return (
    <div className="temple-border reveal" aria-hidden="true">
      <span className="temple-border__band" />
      <span className="temple-border__center" />
      <span className="temple-border__band temple-border__band--right" />
    </div>
  );
}
