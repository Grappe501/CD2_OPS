/**
 * PATCH: In TourOverlay, if step.action exists, render:
 *
 * import { TourActionButton } from "./TourActionButton";
 *
 * {step.action ? (
 *   <div className="mt-3">
 *     <TourActionButton action={step.action} />
 *   </div>
 * ) : null}
 */
