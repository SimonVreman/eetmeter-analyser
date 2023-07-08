export function isSameFile(a: File, b: File): boolean {
	return (
		a.name === b.name && a.size === b.size && a.type === b.type && a.lastModified === b.lastModified
	);
}
