import type { DataPoint } from '../types/charts';

export function fillEmptyDays(data: DataPoint[]): DataPoint[] {
	if (data.length === 0) return [];
	const first = data[0].date;
	const last = data[data.length - 1].date;
	const days = Math.round((last - first) / (1000 * 60 * 60 * 24));
	const daysFilled = data.map((d) => d.date.getTime());
	const groups = data.filter((d) => d.date.getTime() === first.getTime()).map((d) => d.group);
	for (let i = 0; i < days; i++) {
		const date = new Date(first.getTime() + i * (1000 * 60 * 60 * 24));
		if (!daysFilled.includes(date.getTime())) {
			data.push(...groups.map((g) => ({ group: g, date, value: null })));
		}
	}
	return data.sort((a, b) => a.date - b.date);
}

export function calculateCorrectedAverage(data: DataPoint[], days = 5): DataPoint[] {
	if (data.length === 0) return [];
	const result: DataPoint[] = [];
	const group = data[0].group + ' (corrected average)';
	for (let i = data.length; i >= days; i--) {
		const point = data[i - 1];
		if (point.value === null) continue;
		const max = Math.max(...data.slice(i - days, i).map((d) => d.value ?? -1));
		if (point.value < max * 0.9) continue;
		result.push({ ...point, group, min: point.value * 0.9, max: point.value * 1.1 });
	}
	return [...data, ...result];
}
