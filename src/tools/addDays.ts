export const addDays = (date: Date, days: number): Date => {
	const theDate = new Date(date)
	theDate.setDate(theDate.getDate() + days)
	return theDate
}