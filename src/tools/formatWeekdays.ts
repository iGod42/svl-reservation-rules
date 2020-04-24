type FormatOptions = {
	weekendText?: string
	weekdayText?: string
	separator?: string
}

const defaultOptions: FormatOptions = {
	separator: ", "
}

const isSame = (array1: any[], array2: any[]) =>
	array1.every(val => array2.indexOf(val) >= 0) &&
	array2.every(val => array1.indexOf(val) >= 0)

export default (weekdays: number[], options: FormatOptions = {}): string => {
	const theOptions = { ...defaultOptions, ...options }

	if (theOptions.weekdayText && isSame(weekdays, [1, 2, 3, 4, 5]))
		return theOptions.weekdayText

	if (theOptions.weekendText && isSame(weekdays, [0, 6]))
		return theOptions.weekendText

	const weekdayTexts = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]

	return weekdays.map(day => weekdayTexts[day]).join(options.separator)
}
