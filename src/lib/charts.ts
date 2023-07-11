export function fillEmptyDays(data: { group: string; date: Date; value: number | null }[]) {
	const first = data[0].date;
	const last = data[data.length - 1].date;
	const days = Math.round((last - first) / (1000 * 60 * 60 * 24));
	const daysFilled = data.map((d) => d.date.getTime());
	for (let i = 0; i < days; i++) {
		const date = new Date(first.getTime() + i * (1000 * 60 * 60 * 24));
		if (!daysFilled.includes(date.getTime())) {
			data.push({ group: data[0].group, date, value: null });
		}
	}
	return data.sort((a, b) => a.date - b.date);
}

export function average(data: { group: string; date: Date; value: number | null }[], days: number) {
	const result = [];
	for (let i = data.length; i >= days; i--) {
		const value = data.slice(i - days, i).reduce(
			(acc, curr) => {
				if (curr.value === null) return acc;
				return {
					...acc,
					min: acc.min === null ? curr.value : Math.min(acc.min, curr.value),
					max: acc.max === null ? curr.value : Math.max(acc.max, curr.value),
					value: acc.value === null ? curr.value : acc.value + curr.value
				};
			},
			{ date: data[i - 1].date, group: data[0].group, min: null, max: null, value: null }
		);
		if (value.value !== null) value.value /= days;
		result[i - days] = value;
	}
	return result;
}
