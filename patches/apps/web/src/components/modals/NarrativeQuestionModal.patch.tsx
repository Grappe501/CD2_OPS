/**
 * PATCH idea:
 * After successful create, show toast with Undo.
 * Requires:
 * - ToastRoot in AppShell/RootLayout
 * - undo() helper
 *
 * Example:
 * const { push } = useToastCore();
 * push({ title:'Captured', description:'...', variant:'success', actionLabel:'Undo', onAction: () => undo('narrative_question', row.question_id) });
 */
