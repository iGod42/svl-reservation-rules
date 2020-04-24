import { Reservation } from "../api"

const minReservation: Reservation = {
	hour: new Date(2019, 10, 10),
	reservedBy: {
		id: "S1"
	},
	players: [{ id: "S1" }, { id: "S2" }],
	courtId: 1
}

export default minReservation
