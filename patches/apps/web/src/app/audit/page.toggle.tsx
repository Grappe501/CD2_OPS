/**
 * PATCH idea for Audit Explorer page:
 * Add URL param showDeleted=1.
 *
 * const [showDeleted, setShowDeleted] = useState(searchParams.get('showDeleted')==='1');
 * toggle -> router.push('?showDeleted='+(showDeleted?'0':'1'))
 * pass to fetch /api/audit?showDeleted=1
 */
