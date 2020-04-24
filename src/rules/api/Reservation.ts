export interface Reservation {
	hour: Date
	courtId: number
	reservedBy: {
		id: string
	}
	players: { id: string }[]
}
