export const trimTimeComponent = (date: Date): Date =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
